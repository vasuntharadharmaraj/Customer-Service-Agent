import { db } from "../db.js";

export interface ToolExecutionResult {
  tool: string;
  input: Record<string, any>;
  result: Record<string, any>;
  status: "success" | "error";
  summary: string;
}

export function executeTool(name: string, args: Record<string, any>, contextOrderId?: string): ToolExecutionResult {
  switch (name) {
    case "search_faq": {
      const query = String(args.query || "");
      const matches = db.searchFAQ(query);
      if (matches.length > 0) {
        return {
          tool: name,
          input: args,
          status: "success",
          summary: `Found ${matches.length} relevant FAQ topic(s) on '${matches[0].question}'`,
          result: {
            matchesCount: matches.length,
            topMatch: matches[0],
            allMatches: matches.map(m => ({ question: m.question, category: m.category, answer: m.answer }))
          }
        };
      } else {
        return {
          tool: name,
          input: args,
          status: "error",
          summary: `No matching FAQ found for query: "${query}"`,
          result: {
            error: "No matching FAQ articles found.",
            suggestion: "Agent can check order status, create a support ticket, or escalate to human."
          }
        };
      }
    }

    case "get_order_status": {
      const orderId = String(args.order_id || "").trim();
      const order = db.getOrder(orderId);
      if (!order) {
        return {
          tool: name,
          input: args,
          status: "error",
          summary: `Order ${orderId} was not found in records`,
          result: {
            error: `Order ID '${orderId}' does not exist in our system.`,
            suggestion: "Please ask the customer to verify their order number (e.g. ORD1001 through ORD1015, ORD1024)."
          }
        };
      }
      return {
        tool: name,
        input: args,
        status: "success",
        summary: `Order ${order.orderId}: Status '${order.orderStatus}', Est. Delivery: ${order.estimatedDeliveryDate}`,
        result: {
          orderId: order.orderId,
          product: order.productName,
          orderDate: order.orderDate,
          orderStatus: order.orderStatus,
          estimatedDeliveryDate: order.estimatedDeliveryDate,
          carrier: order.carrier,
          trackingNumber: order.trackingNumber,
          customerName: order.customerName,
          deliveryAddress: order.deliveryAddress
        }
      };
    }

    case "get_product_info": {
      const productName = String(args.product_name || "").trim();
      const product = db.getProductByName(productName);
      if (!product) {
        // try general search
        const searchResults = db.searchProducts(productName);
        if (searchResults.length > 0) {
          const match = searchResults[0];
          return {
            tool: name,
            input: args,
            status: "success",
            summary: `Found product '${match.name}', Price: $${match.price.toFixed(2)} (${match.inStock ? 'In Stock' : 'Out of Stock'})`,
            result: {
              productName: match.name,
              description: match.description,
              price: `$${match.price.toFixed(2)}`,
              availability: match.inStock ? `In Stock (${match.stockCount} units)` : "Currently Out of Stock",
              specifications: match.specifications,
              warranty: `${match.warrantyMonths} Months Manufacturer Warranty`
            }
          };
        }
        return {
          tool: name,
          input: args,
          status: "error",
          summary: `Product '${productName}' not found in catalog`,
          result: {
            error: `No product matching '${productName}' was found.`,
            availableCatalog: db.getAllProducts().map(p => p.name)
          }
        };
      }

      return {
        tool: name,
        input: args,
        status: "success",
        summary: `Product: '${product.name}', Price: $${product.price.toFixed(2)}, Availability: ${product.inStock ? 'In Stock' : 'Out of Stock'}`,
        result: {
          productName: product.name,
          description: product.description,
          price: `$${product.price.toFixed(2)}`,
          availability: product.inStock ? `In Stock (${product.stockCount} units available)` : "Currently Out of Stock",
          specifications: product.specifications,
          warranty: `${product.warrantyMonths} Months Manufacturer Warranty`
        }
      };
    }

    case "check_return_eligibility": {
      const orderId = String(args.order_id || "").trim();
      const order = db.getOrder(orderId);
      if (!order) {
        return {
          tool: name,
          input: args,
          status: "error",
          summary: `Cannot check return: Order ${orderId} not found`,
          result: {
            error: `Order ${orderId} not found.`,
            eligible: false,
            reason: "Invalid order number."
          }
        };
      }

      if (order.isEligibleForReturn) {
        return {
          tool: name,
          input: args,
          status: "success",
          summary: `Order ${order.orderId} IS eligible for return / full refund`,
          result: {
            orderId: order.orderId,
            product: order.productName,
            eligible: true,
            reason: `Order was delivered on ${order.deliveredDate || order.orderDate} and is within the 30-day return policy window.`,
            nextSteps: "A prepaid return shipping label can be emailed to the customer. Once received at our fulfillment center, a 100% refund is issued within 3-5 business days."
          }
        };
      } else {
        return {
          tool: name,
          input: args,
          status: "success",
          summary: `Order ${order.orderId} is NOT eligible for return: ${order.returnIneligibleReason || 'Policy condition not met'}`,
          result: {
            orderId: order.orderId,
            product: order.productName,
            eligible: false,
            reason: order.returnIneligibleReason || "Order is outside the 30-day window or has not completed delivery yet.",
            nextSteps: "If the item is damaged, defective, or there is an extenuating circumstance, a support ticket can be opened or escalated to a human supervisor for an exception."
          }
        };
      }
    }

    case "create_support_ticket": {
      const issue = String(args.issue || "Customer complaint");
      const priority = String(args.priority || "Medium");
      const orderId = args.order_id ? String(args.order_id) : contextOrderId;
      const ticket = db.createTicket(issue, priority, orderId);

      return {
        tool: name,
        input: args,
        status: "success",
        summary: `Created Support Ticket #${ticket.ticketId} [${ticket.priority} Priority] - ${ticket.issueCategory}`,
        result: {
          ticketId: ticket.ticketId,
          issueCategory: ticket.issueCategory,
          priority: ticket.priority,
          status: ticket.status,
          orderId: ticket.orderId || "N/A",
          createdAt: ticket.createdAt
        }
      };
    }

    case "escalate_to_human": {
      const issueSummary = String(args.issue_summary || "Escalation requested");
      const reason = String(args.reason || "Customer frustration or complex resolution");
      const orderId = args.order_id ? String(args.order_id) : contextOrderId;
      const escalation = db.createEscalation(issueSummary, reason, orderId);

      return {
        tool: name,
        input: args,
        status: "success",
        summary: `Escalated to Human Representative: Ref #${escalation.escalationId} [Status: ${escalation.status}]`,
        result: {
          escalationId: escalation.escalationId,
          reason: escalation.reason,
          summary: escalation.issueSummary,
          status: escalation.status,
          assignedAgent: escalation.assignedAgent,
          escalatedAt: escalation.escalatedAt
        }
      };
    }

    case "analyze_sentiment": {
      const text = String(args.customer_message || "").toLowerCase();
      let sentiment: "Positive" | "Neutral" | "Negative" | "Angry" = "Neutral";
      let rationale = "Routine transactional query";

      const angryPatterns = ["useless", "terrible", "worst", "garbage", "scam", "cheat", "lawsuit", "sue", "ridiculous", "hate", "horrible", "fraud", "furious", "unacceptable", "nobody is helping", "pathetic", "angry"];
      const negativePatterns = ["broken", "damaged", "delayed", "missing", "refund", "complaint", "wrong", "upset", "not working", "defective", "disappointed", "slow", "failed"];
      const positivePatterns = ["thanks", "thank you", "great", "awesome", "perfect", "good", "love", "helpful", "wonderful", "appreciate"];

      if (angryPatterns.some(w => text.includes(w))) {
        sentiment = "Angry";
        rationale = "Customer is displaying extreme frustration, hostile or accusatory language, or expressing repeated failure of service.";
      } else if (negativePatterns.some(w => text.includes(w))) {
        sentiment = "Negative";
        rationale = "Customer is reporting a problem, product defect, delivery delay, or seeking return/refund.";
      } else if (positivePatterns.some(w => text.includes(w))) {
        sentiment = "Positive";
        rationale = "Customer express gratitude, satisfaction, or cordial interaction.";
      }

      return {
        tool: name,
        input: args,
        status: "success",
        summary: `Sentiment Analyzed: '${sentiment}' - ${rationale}`,
        result: {
          sentiment,
          rationale,
          recommendedAction: sentiment === "Angry" 
            ? "Immediate empathetic acknowledgment, prioritize ticket, escalate to human supervisor if unresolved"
            : sentiment === "Negative"
            ? "Validate customer concern, offer prompt resolution (return label or ticket creation)"
            : "Continue with friendly professional tone"
        }
      };
    }

    default:
      return {
        tool: name,
        input: args,
        status: "error",
        summary: `Unknown tool '${name}'`,
        result: { error: `Tool ${name} does not exist.` }
      };
  }
}
