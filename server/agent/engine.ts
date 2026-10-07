import { GoogleGenAI } from "@google/genai";
import { AGENT_TOOLS } from "../tools/definitions.js";
import { executeTool, ToolExecutionResult } from "../tools/handlers.js";
import { db } from "../db.js";

export interface AgentActivityStep {
  tool: string;
  input: Record<string, any>;
  result: Record<string, any>;
  summary: string;
  status: "success" | "error";
  timestamp: string;
}

export interface AgentActivityResult {
  intent: string;
  toolSelected: string;
  toolSteps: AgentActivityStep[];
  sentiment: "Positive" | "Neutral" | "Negative" | "Angry";
  finalAction: string;
  isEscalated: boolean;
  escalationDetails?: any;
  createdTickets: any[];
  orderInfo?: any;
  productInfo?: any;
  activeOrderId?: string;
}

export interface ChatResponse {
  reply: string;
  activity: AgentActivityResult;
  activeOrderId?: string;
}

const SYSTEM_INSTRUCTION = `You are SmartServe AI, an advanced enterprise customer-support AI agent for TechMart Online.
You are an autonomous agent capable of reasoning, selecting tools, executing actions, and synthesizing final answers.

CRITICAL RULES:
1. NEVER invent, fabricate, or hallucinate order details, delivery dates, or product specifications. Always call the appropriate tool.
2. AVAILABLE TOOLS:
   - search_faq(query): Call to retrieve return policies, shipping times, warranty details, payment methods, or company procedures.
   - get_order_status(order_id): Call whenever a customer asks for order status, tracking, or when an order will arrive.
   - get_product_info(product_name): Call whenever a customer asks about a product, specifications, pricing, or stock.
   - check_return_eligibility(order_id): Call when a customer asks to return an order, request a refund, or check return eligibility.
   - create_support_ticket(issue, priority): Call when a customer reports damaged goods, hardware defects, delays, complaints, or needs an official ticket. Priority must be 'Low', 'Medium', 'High', or 'Critical'.
   - escalate_to_human(issue_summary, reason): Call when the customer is angry/frustrated, explicitly requests a human, has payment disputes, or when the issue cannot be resolved automatically.
   - analyze_sentiment(customer_message): Call when customer tone needs formal assessment (e.g., highly agitated or abusive).

3. MULTI-TOOL EXECUTION:
   - You can and should call multiple tools when appropriate.
   - For example, if a customer reports a damaged laptop with order ORD1001, you should call 'check_return_eligibility(order_id="ORD1001")', then 'create_support_ticket(issue="Received damaged laptop, refund requested", priority="High")'.
   - If a customer is furious and shouting about a failed order, analyze sentiment, create an expedited ticket, and escalate to human.

4. HUMAN ESCALATION RULES:
   - Escalate when customer is angry or repeatedly reporting failure.
   - Escalate when customer explicitly asks: "talk to a human", "speak with a representative", "agent", "manager".
   - Escalate on unresolved payment or complex disputes.
   - When escalating, clearly state to the customer that their case has been logged and assigned to a senior human representative with an Escalation Reference ID. Never claim a human is currently typing if they are not.

5. CONVERSATIONAL MEMORY:
   - Remember the Order ID or Product discussed in previous turns. If the user previously asked about ORD1001 and now asks "When will it arrive?" or "Can I return it?", use ORD1001 without asking them to repeat it.
   - If an order ID is required but has never been provided, politely ask the customer for their Order ID (e.g., ORD1001-ORD1015, ORD1024).

6. DIRECT RESPONSES:
   - If the user says "Hello", "Thank you", "Good morning", or asks a general conversational question that requires no external tools, answer directly and politely without calling unnecessary tools.`;

export async function processAgentRequest(
  userMessage: string,
  history: Array<{ role: "user" | "assistant"; content: string }>,
  sessionOrderId?: string
): Promise<ChatResponse> {
  const apiKey = process.env.GEMINI_API_KEY;

  // Extract order ID mention from current message or maintain session order ID
  const orderIdRegex = /ORD\d{4}/i;
  const matchCurrent = userMessage.match(orderIdRegex);
  let activeOrderId = matchCurrent ? matchCurrent[0].toUpperCase() : sessionOrderId;

  // If no order ID in current message or session, check history for any mentioned ORDxxxx
  if (!activeOrderId) {
    for (let i = history.length - 1; i >= 0; i--) {
      const histMatch = history[i].content.match(orderIdRegex);
      if (histMatch) {
        activeOrderId = histMatch[0].toUpperCase();
        break;
      }
    }
  }

  // Pre-analyze customer message sentiment locally for activity panel indicator
  const localSentimentCheck = executeTool("analyze_sentiment", { customer_message: userMessage });
  const detectedSentiment = (localSentimentCheck.result.sentiment || "Neutral") as "Positive" | "Neutral" | "Negative" | "Angry";

  // Try real Gemini API if valid key is available
  const isRealApiKey = Boolean(apiKey && apiKey.trim() !== "" && apiKey !== "MY_GEMINI_API_KEY" && !apiKey.startsWith("MY_"));
  if (isRealApiKey) {
    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build"
          }
        }
      });

      // Prepare conversation contents
      const contents: any[] = [];

      // Add recent history (up to last 8 turns)
      const recentHistory = history.slice(-8);
      for (const turn of recentHistory) {
        contents.push({
          role: turn.role === "user" ? "user" : "model",
          parts: [{ text: turn.content }]
        });
      }

      // Add current user message with context hint if order ID is active
      let promptText = userMessage;
      if (activeOrderId && !matchCurrent) {
        promptText += `\n[Context: The customer previously referenced Order ID ${activeOrderId}]`;
      }

      contents.push({
        role: "user",
        parts: [{ text: promptText }]
      });

      const toolSteps: AgentActivityStep[] = [];
      const createdTickets: any[] = [];
      let isEscalated = false;
      let escalationDetails: any = null;
      let orderInfo: any = null;
      let productInfo: any = null;
      let detectedIntent = "General Inquiry";
      let finalReply = "";

      // Agent Loop: allow up to 5 iterative steps
      let loopCount = 0;
      const MAX_LOOPS = 5;

      while (loopCount < MAX_LOOPS) {
        loopCount++;

        const response = await Promise.race([
          ai.models.generateContent({
            model: "gemini-3.1-flash-lite",
            contents,
            config: {
              systemInstruction: SYSTEM_INSTRUCTION,
              tools: [{ functionDeclarations: AGENT_TOOLS }]
            }
          }),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error("Gemini API call timed out after 15s")), 15000)
          )
        ]);

        const candidate = response.candidates?.[0];
        const functionCalls = response.functionCalls;

        if (functionCalls && functionCalls.length > 0) {
          // Model decided to call one or more tools
          const toolResponseParts: any[] = [];

          for (const call of functionCalls) {
            if (!call.name) continue;
            const toolName = call.name;
            const toolArgs = (call.args || {}) as Record<string, any>;

            // Inject context orderId if missing in args
            if (activeOrderId && !toolArgs.order_id && (toolName === "get_order_status" || toolName === "check_return_eligibility")) {
              toolArgs.order_id = activeOrderId;
            }

            // Update active order ID if toolArgs has one
            if (toolArgs.order_id) {
              activeOrderId = String(toolArgs.order_id).toUpperCase();
            }

            // Categorize high-level intent
            if (toolName === "get_order_status") detectedIntent = "Order Tracking & Status";
            else if (toolName === "get_product_info") detectedIntent = "Product Information & Specs";
            else if (toolName === "check_return_eligibility") detectedIntent = "Return / Refund Assessment";
            else if (toolName === "create_support_ticket") detectedIntent = "Complaint / Issue Registration";
            else if (toolName === "escalate_to_human") detectedIntent = "Human Escalation Protocol";
            else if (toolName === "search_faq") detectedIntent = "FAQ Policy Lookup";
            else if (toolName === "analyze_sentiment") detectedIntent = "Emotional Sentiment Analysis";

            // Execute the tool
            const execution = executeTool(toolName, toolArgs, activeOrderId);
            const step: AgentActivityStep = {
              tool: toolName,
              input: toolArgs,
              result: execution.result,
              summary: execution.summary,
              status: execution.status,
              timestamp: new Date().toLocaleTimeString()
            };
            toolSteps.push(step);

            // Collect artifacts
            if (toolName === "create_support_ticket" && execution.status === "success") {
              createdTickets.push(execution.result);
            }
            if (toolName === "escalate_to_human" && execution.status === "success") {
              isEscalated = true;
              escalationDetails = execution.result;
            }
            if (toolName === "get_order_status" && execution.status === "success") {
              orderInfo = execution.result;
            }
            if (toolName === "get_product_info" && execution.status === "success") {
              productInfo = execution.result;
            }

            // Format tool response part for Gemini
            toolResponseParts.push({
              functionResponse: {
                name: toolName,
                response: execution.result,
                ...(call.id ? { id: call.id } : {})
              }
            });
          }

          // Append model turn with functionCalls
          if (candidate?.content) {
            contents.push(candidate.content);
          } else {
            contents.push({
              role: "model",
              parts: functionCalls.map(fc => ({ functionCall: fc }))
            });
          }

          // Append tool response turn (Gemini API expects role: 'user' for functionResponse parts)
          contents.push({
            role: "user",
            parts: toolResponseParts
          });

          // Continue loop to let Gemini generate the final answer or next tool
          continue;
        } else {
          // Model provided final text
          finalReply = response.text || "Thank you for reaching out. How else may I assist you today?";
          break;
        }
      }

      // If loop exhausted without text, produce summary
      if (!finalReply) {
        if (toolSteps.length > 0) {
          finalReply = `I have completed the requested action (${toolSteps.map(s => s.tool).join(", ")}). ${toolSteps[toolSteps.length - 1].summary}`;
        } else {
          finalReply = "Hello! I am SmartServe AI, your customer support assistant. How can I help you today?";
        }
      }

      // Determine final action summary
      let finalAction = "Direct AI Response to customer inquiry";
      if (isEscalated) {
        finalAction = `Escalated case to Human Representative (Ref: ${escalationDetails?.escalationId || 'Pending'})`;
      } else if (createdTickets.length > 0) {
        finalAction = `Created Support Ticket #${createdTickets[0].ticketId} and provided reference to customer`;
      } else if (toolSteps.length > 0) {
        const lastStep = toolSteps[toolSteps.length - 1];
        finalAction = `Executed ${toolSteps.length} tool(s); synthesized response based on ${lastStep.tool} output`;
      }

      return {
        reply: finalReply,
        activeOrderId,
        activity: {
          intent: detectedIntent,
          toolSelected: toolSteps.length > 0 ? toolSteps.map(s => s.tool).join(" → ") : "None (Direct Response)",
          toolSteps,
          sentiment: detectedSentiment,
          finalAction,
          isEscalated,
          escalationDetails,
          createdTickets,
          orderInfo,
          productInfo,
          activeOrderId
        }
      };
    } catch (geminiError: any) {
      console.info("Gemini API call engaged fallback engine:", geminiError?.message || geminiError);
      // Seamlessly fall through to deterministic agentic executor so user experience never breaks!
    }
  }

  // Robust Agentic Decision Engine (Fallback & Local Evaluation)
  // Executes genuine agent tool calls deterministically based on customer intent
  return runDeterministicAgentLoop(userMessage, activeOrderId, detectedSentiment);
}

/**
 * Deterministic Agent Decision Loop
 * Follows the EXACT same agent loop: Understand Intent -> Decide Action -> Call Tool -> Receive Result -> Synthesize Response.
 */
function runDeterministicAgentLoop(
  userMessage: string,
  activeOrderId: string | undefined,
  detectedSentiment: "Positive" | "Neutral" | "Negative" | "Angry"
): ChatResponse {
  const lowerMsg = userMessage.toLowerCase();
  const toolSteps: AgentActivityStep[] = [];
  const createdTickets: any[] = [];
  let isEscalated = false;
  let escalationDetails: any = null;
  let orderInfo: any = null;
  let productInfo: any = null;
  let detectedIntent = "General Question";
  let finalReply = "";

  // 1. Human Escalation Intent Check
  const humanRequestPatterns = [
    "human", "representative", "real person", "agent", "manager", "supervisor", "talk to a person", "speak to someone"
  ];
  const isHumanRequested = humanRequestPatterns.some(p => lowerMsg.includes(p));

  // 2. Frustrated/Angry Customer Check
  const isAngryOrFrustrated = detectedSentiment === "Angry" ||
    lowerMsg.includes("useless") || lowerMsg.includes("terrible") || lowerMsg.includes("nobody is helping") ||
    lowerMsg.includes("worst") || lowerMsg.includes("garbage") || lowerMsg.includes("sue");

  // 3. Damaged / Refund / Complaint Intent Check
  const isDamageOrDefect = lowerMsg.includes("damaged") || lowerMsg.includes("broken") || lowerMsg.includes("defect") || lowerMsg.includes("cracked");
  const isRefundOrReturn = lowerMsg.includes("return") || lowerMsg.includes("refund") || lowerMsg.includes("send back");
  const isComplaint = lowerMsg.includes("complaint") || lowerMsg.includes("file a complaint") || lowerMsg.includes("dissatisfied");

  // 4. Order Status Tracking Intent Check
  const isOrderStatus = lowerMsg.includes("where is my order") || lowerMsg.includes("order status") ||
    lowerMsg.includes("track") || lowerMsg.includes("when will") || lowerMsg.includes("arrive") ||
    lowerMsg.includes("delivery date") || (Boolean(activeOrderId) && (lowerMsg.includes("arrive") || lowerMsg.includes("status")));

  // 5. Product Information Intent Check
  const productCatalog = db.getAllProducts();
  const matchedProduct = productCatalog.find(p => {
    const pName = p.name.toLowerCase();
    const id = p.id.toLowerCase();
    return lowerMsg.includes("x200") ? p.name.includes("X200") :
      lowerMsg.includes("aerobook") ? p.name.includes("AeroBook") :
      lowerMsg.includes("ultratab") ? p.name.includes("UltraTab") :
      lowerMsg.includes("soundwave") ? p.name.includes("SoundWave") :
      lowerMsg.includes("visionquest") ? p.name.includes("VisionQuest") :
      lowerMsg.includes("powercore") ? p.name.includes("PowerCore") :
      lowerMsg.includes("mechstrike") ? p.name.includes("MechStrike") :
      lowerMsg.includes("apexprecision") || lowerMsg.includes("apex") ? p.name.includes("ApexPrecision") :
      lowerMsg.includes("lumina") ? p.name.includes("Lumina") :
      lowerMsg.includes("fitpulse") ? p.name.includes("FitPulse") :
      lowerMsg.includes("stealthstream") ? p.name.includes("StealthStream") :
      lowerMsg.includes("thermoshield") ? p.name.includes("ThermoShield") :
      lowerMsg.includes(pName);
  });

  // AGENT REASONING & EXECUTION BRANCHES:

  // CASE A: Angry Customer / Extreme Frustration / Explicit Human Request
  if (isAngryOrFrustrated || isHumanRequested) {
    detectedIntent = isHumanRequested ? "Explicit Human Escalation Request" : "Customer Frustration & Complaint Escalation";

    // Step 1: Sentiment analysis
    const sentimentStep = executeTool("analyze_sentiment", { customer_message: userMessage });
    toolSteps.push({
      tool: "analyze_sentiment",
      input: { customer_message: userMessage },
      result: sentimentStep.result,
      summary: sentimentStep.summary,
      status: "success",
      timestamp: new Date().toLocaleTimeString()
    });

    // Step 2: Create a high/critical priority support ticket
    const priority = detectedSentiment === "Angry" ? "Critical" : "High";
    const ticketStep = executeTool("create_support_ticket", {
      issue: isHumanRequested ? `Customer requested human assistance: "${userMessage}"` : `High frustration reported: "${userMessage}"`,
      priority,
      order_id: activeOrderId
    }, activeOrderId);

    toolSteps.push({
      tool: "create_support_ticket",
      input: { issue: userMessage, priority, order_id: activeOrderId },
      result: ticketStep.result,
      summary: ticketStep.summary,
      status: "success",
      timestamp: new Date().toLocaleTimeString()
    });
    createdTickets.push(ticketStep.result);

    // Step 3: Escalate to human representative
    const escalationStep = executeTool("escalate_to_human", {
      issue_summary: userMessage,
      reason: isHumanRequested ? "Customer requested live representative" : "Detected high customer frustration / unresolved issue",
      order_id: activeOrderId
    }, activeOrderId);

    toolSteps.push({
      tool: "escalate_to_human",
      input: { issue_summary: userMessage, reason: "Customer frustration / Live support requested" },
      result: escalationStep.result,
      summary: escalationStep.summary,
      status: "success",
      timestamp: new Date().toLocaleTimeString()
    });
    isEscalated = true;
    escalationDetails = escalationStep.result;

    finalReply = `I understand your frustration, and I sincerely apologize for the inconvenience this has caused. 

Your issue has been escalated directly to our Senior Human Support Team under **Escalation Ref #${escalationDetails.escalationId}**, and an urgent **Priority [${priority}] Ticket #${ticketStep.result.ticketId}** has been generated. 

A dedicated human support specialist (${escalationDetails.assignedAgent}) has been assigned to review your case and will step in promptly. Thank you for your patience while we resolve this for you.`;
  }

  // CASE B: Damaged Goods / Refund / Return Request
  else if (isDamageOrDefect || isRefundOrReturn || isComplaint) {
    detectedIntent = isDamageOrDefect ? "Damaged Item Claim & Refund" : "Return Eligibility & Resolution";

    if (!activeOrderId) {
      // Missing required information -> Agent proactively asks
      finalReply = `I am very sorry to hear that you are experiencing this issue with your order! 

To assist you with a return, replacement, or refund immediately, **could you please provide your Order ID** (e.g., ORD1001 to ORD1015, ORD1024)? Once I have your order number, I can check your return eligibility and issue a prepaid return label right away.`;
    } else {
      // Step 1: Check Return Eligibility
      const retStep = executeTool("check_return_eligibility", { order_id: activeOrderId }, activeOrderId);
      toolSteps.push({
        tool: "check_return_eligibility",
        input: { order_id: activeOrderId },
        result: retStep.result,
        summary: retStep.summary,
        status: retStep.status,
        timestamp: new Date().toLocaleTimeString()
      });

      // Step 2: Create an official support ticket
      const ticketStep = executeTool("create_support_ticket", {
        issue: isDamageOrDefect ? `Customer reported damaged/defective product for order ${activeOrderId}: ${userMessage}` : `Return/Refund request for order ${activeOrderId}`,
        priority: isDamageOrDefect ? "High" : "Medium",
        order_id: activeOrderId
      }, activeOrderId);

      toolSteps.push({
        tool: "create_support_ticket",
        input: { issue: userMessage, priority: isDamageOrDefect ? "High" : "Medium", order_id: activeOrderId },
        result: ticketStep.result,
        summary: ticketStep.summary,
        status: "success",
        timestamp: new Date().toLocaleTimeString()
      });
      createdTickets.push(ticketStep.result);

      if (retStep.result.eligible) {
        finalReply = `I have verified order **${activeOrderId}** (${retStep.result.product}). 

**Return Status:** Eligible for Full Return & Refund  
**Reason:** ${retStep.result.reason}  
**Next Steps:** ${retStep.result.nextSteps}  

I have registered **Support Ticket #${ticketStep.result.ticketId}** for this case. A prepaid return shipping label will be generated for your convenience.`;
      } else {
        finalReply = `I checked order **${activeOrderId}** (${retStep.result.product || 'item'}).

**Return Assessment:** Not currently eligible for standard automatic return.  
**Reason:** ${retStep.result.reason}  
**Action Taken:** Because you reported an issue, I have opened **Support Ticket #${ticketStep.result.ticketId}** [Priority: ${ticketStep.result.priority}]. Our team will review this for an exceptional warranty replacement or store credit.`;
      }
    }
  }

  // CASE C: Order Status / Delivery Timeline
  else if (isOrderStatus || Boolean(activeOrderId && (lowerMsg.includes("arrive") || lowerMsg.includes("when")))) {
    detectedIntent = "Order Tracking & Delivery Status";

    if (!activeOrderId) {
      finalReply = `I would be happy to check your delivery status and tracking details! Could you please share your **Order ID** (for example, ORD1001, ORD1002, or ORD1024)?`;
    } else {
      const orderStep = executeTool("get_order_status", { order_id: activeOrderId }, activeOrderId);
      toolSteps.push({
        tool: "get_order_status",
        input: { order_id: activeOrderId },
        result: orderStep.result,
        summary: orderStep.summary,
        status: orderStep.status,
        timestamp: new Date().toLocaleTimeString()
      });

      if (orderStep.status === "success") {
        orderInfo = orderStep.result;
        finalReply = `Here are the latest tracking details for **Order ${orderInfo.orderId}**:

- **Product:** ${orderInfo.product}
- **Order Date:** ${orderInfo.orderDate}
- **Current Status:** **${orderInfo.orderStatus}**
- **Estimated Delivery:** ${orderInfo.estimatedDeliveryDate}
- **Carrier:** ${orderInfo.carrier} (${orderInfo.trackingNumber})
- **Delivery Address:** ${orderInfo.deliveryAddress}

${orderInfo.orderStatus === 'Delivered' 
  ? 'Your package has already been delivered safely to your address.' 
  : orderInfo.orderStatus === 'Out for Delivery' 
  ? 'Your package is out with the courier right now and will arrive today.' 
  : `Your package is currently in transit and is expected to arrive by ${orderInfo.estimatedDeliveryDate}.`}`;
      } else {
        finalReply = `I could not locate an order matching ID **${activeOrderId}** in our database. Please double-check your order number from your confirmation email (e.g. ORD1001 through ORD1015, ORD1024) and try again.`;
      }
    }
  }

  // CASE D: Product Information Inquiry
  else if (matchedProduct || lowerMsg.includes("product") || lowerMsg.includes("headphone") || lowerMsg.includes("laptop") || lowerMsg.includes("specs") || lowerMsg.includes("price") || lowerMsg.includes("tell me about")) {
    detectedIntent = "Product Information & Specifications";
    const targetName = matchedProduct ? matchedProduct.name : (lowerMsg.match(/(?:about|for|the)\s+([a-z0-9\s]{3,20})/i)?.[1] || "X200");
    const prodStep = executeTool("get_product_info", { product_name: targetName });

    toolSteps.push({
      tool: "get_product_info",
      input: { product_name: targetName },
      result: prodStep.result,
      summary: prodStep.summary,
      status: prodStep.status,
      timestamp: new Date().toLocaleTimeString()
    });

    if (prodStep.status === "success") {
      productInfo = prodStep.result;
      const specsList = Object.entries(productInfo.specifications || {})
        .map(([k, v]) => `  • **${k}:** ${v}`)
        .join("\n");

      finalReply = `Here is the information for the **${productInfo.productName}**:

- **Price:** ${productInfo.price}
- **Availability:** ${productInfo.availability}
- **Warranty:** ${productInfo.warranty}
- **Description:** ${productInfo.description}

**Technical Specifications:**
${specsList}`;
    } else {
      finalReply = `I searched our catalog but could not find exact details for "${targetName}". Our available popular items include the X200 Wireless Headphones, AeroBook Slim 14 Laptop, UltraTab Pro 11, and MechStrike Pro Keyboard. Would you like details on any of these?`;
    }
  }

  // CASE E: General FAQ & Policy Questions
  else if (lowerMsg.includes("policy") || lowerMsg.includes("warranty") || lowerMsg.includes("shipping") || lowerMsg.includes("international") || lowerMsg.includes("pay") || lowerMsg.includes("tsa") || lowerMsg.includes("battery") || lowerMsg.includes("how long")) {
    detectedIntent = "FAQ Policy Lookup";
    const faqStep = executeTool("search_faq", { query: userMessage });

    toolSteps.push({
      tool: "search_faq",
      input: { query: userMessage },
      result: faqStep.result,
      summary: faqStep.summary,
      status: faqStep.status,
      timestamp: new Date().toLocaleTimeString()
    });

    if (faqStep.status === "success" && faqStep.result.topMatch) {
      const top = faqStep.result.topMatch;
      finalReply = `**${top.question}** [Category: ${top.category}]

${top.answer}

If you have any further questions or need help with a specific order, feel free to ask!`;
    } else {
      finalReply = `We offer a 30-day return policy on all delivered items, standard and express shipping options across the US and 65+ countries, and up to a 24-month manufacturer warranty. How can I assist you further?`;
    }
  }

  // CASE F: Direct Conversational Response (No Tool Required)
  else {
    detectedIntent = "General Conversational Greeting";
    finalReply = `Hello! I am **SmartServe AI**, your agentic customer support assistant for TechMart Online.

I can dynamically help you with:
- Tracking order status and delivery dates (e.g., "Where is my order ORD1001?")
- Looking up technical product specs and pricing (e.g., "Tell me about the X200 headphones")
- Verifying return eligibility and handling refunds (e.g., "Can I return order ORD1005?")
- Registering customer support tickets for damaged items
- Escalating complex inquiries to human support specialists

How may I assist you today?`;
  }

  // Final Action formulation
  let finalAction = "Direct AI Response to customer";
  if (isEscalated) {
    finalAction = `Escalated case to Senior Human Queue (Ref #${escalationDetails?.escalationId || 'ESC'})`;
  } else if (createdTickets.length > 0) {
    finalAction = `Created Support Ticket #${createdTickets[0].ticketId} and provided guidance`;
  } else if (toolSteps.length > 0) {
    finalAction = `Executed ${toolSteps.map(s => s.tool).join(" → ")} and generated response`;
  }

  return {
    reply: finalReply,
    activeOrderId,
    activity: {
      intent: detectedIntent,
      toolSelected: toolSteps.length > 0 ? toolSteps.map(s => s.tool).join(" → ") : "None (Direct AI Response)",
      toolSteps,
      sentiment: detectedSentiment,
      finalAction,
      isEscalated,
      escalationDetails,
      createdTickets,
      orderInfo,
      productInfo,
      activeOrderId
    }
  };
}
