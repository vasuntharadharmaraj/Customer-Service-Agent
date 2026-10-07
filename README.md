# SMARTSERVE AI – Agentic Customer Support Assistant

An autonomous, multi-tool Agentic AI customer support platform powered by **Google Gemini Function Calling**, conversational memory, automated triage, and deterministic enterprise grounding.

---

## 1. Project Title & Abstract

### Title
**SmartServe AI: An Agentic Customer Support Assistant utilizing Gemini Tool Calling & Decision Loops**

### Abstract
Conventional customer-support chatbots rely on ungrounded generative token prediction or rigid rule trees, often hallucinating sensitive order numbers, misstating delivery timelines, or falsely assuring refunds. **SmartServe AI** solves this by implementing a genuinely **Agentic AI architecture**. When a user submits an inquiry, the system dynamically analyzes customer intent, evaluates whether external tools are required, invokes verified functions against an enterprise database (order status, product specifications, return policy assessment, support ticket creation, and sentiment evaluation), handles multi-turn tool chaining, and synthesizes grounded natural language responses. A human escalation protocol automatically transfers distressed or high-risk cases to senior human representatives, providing full explainability through an Agent Activity Panel.

---

## 2. Problem Statement
E-commerce enterprises process thousands of customer queries daily regarding shipment tracking, item returns, damaged parcels, and hardware technical specifications. Traditional AI chatbots fail in two major ways:
1. **Hallucination & Fabrication:** Generating plausible-sounding but fictitious order dates, tracking numbers, and refund assurances.
2. **Lack of Autonomous Agency:** Inability to inspect real-time database state, create genuine support tickets, or chain multiple computational steps together without hardcoded script flows.

**SmartServe AI** bridges this gap by decoupling conversational intelligence (Gemini) from data authority (deterministic tool handlers), ensuring that customer interactions are grounded in verified enterprise facts.

---

## 3. Objectives
1. Implement a complete **Agentic AI loop**: Intent Recognition → Tool Selection → Tool Execution → Result Processing → Grounded Synthesis.
2. Prevent artificial hallucination of orders, products, and policies using strict function calling.
3. Support **Conversational Memory**: Retaining context (such as previously referenced Order IDs or product models) across subsequent turns without asking the user to repeat themselves.
4. Support **Multi-Tool Chaining**: Permitting the agent to invoke multiple functions within a single turn (e.g., Sentiment Analysis → Return Verification → Ticket Creation → Human Escalation).
5. Provide a transparent **Agent Activity Panel** that exposes detected intents, selected tools, input parameters, execution summaries, and sentiment metrics without revealing private chain-of-thought traces.
6. Serve as a reference **MCA (Master of Computer Applications) Academic Project** demonstrating modern applied Generative AI and Agentic Systems.

---

## 4. Key Features
- **Dynamic Tool Calling:** Gemini autonomously determines when to query tools vs. when to provide direct conversational answers.
- **Simulated Enterprise Database:** Realistic local dataset of 16 orders, 12 products, 16 FAQs, and persistent ticket/escalation queues.
- **Sentiment & Escalation Engine:** Detects customer anger or frustration, elevates ticket priority to Critical, and registers an official Human Escalation reference.
- **30-Day Return Eligibility Validator:** Computes return eligibility according to delivery timestamps, carrier statuses, and damage reporting.
- **Live Agent Activity Panel:** Displays real-time intent, selected tools, execution steps with collapsible JSON input/output inspectors, and final actions taken.
- **Interactive Database Explorer:** In-app browser allowing users and examiners to inspect simulated Orders, Products, FAQs, and newly generated Tickets in real time.
- **10 One-Click Test Queries:** Pre-configured test cases covering every agentic branch and edge case.
- **Zero Hallucination Guarantee:** If an order or product is not in the database, the agent truthfully reports that it cannot be found.

---

## 5. System Architecture

```
┌────────────────────────────────────────────────────────┐
│                   Customer Frontend                    │
│   (React + TypeScript + Tailwind CSS + Lucide Icons)   │
└───────────────────────────┬────────────────────────────┘
                            │ HTTP POST /api/chat
                            ▼
┌────────────────────────────────────────────────────────┐
│                   Express API Server                   │
│   • Multi-turn session memory tracking                 │
│   • Active Order ID context resolution                 │
└───────────────────────────┬────────────────────────────┘
                            │
              ┌─────────────┴─────────────┐
              ▼                           ▼
┌───────────────────────────┐ ┌───────────────────────────┐
│     Gemini Agent Loop     │ │    Deterministic Tools    │
│  • GoogleGenAI SDK        │ │  • search_faq()           │
│  • gemini-3.8-flash       │ │  • get_order_status()     │
│  • FunctionDeclarations   │ │  • get_product_info()     │
│  • System Instructions    │ │  • check_return_elig()    │
│  • Intent Classification  │ │  • create_support_ticket()│
└─────────────┬─────────────┘ │  • escalate_to_human()    │
              │               │  • analyze_sentiment()    │
              │ Tool Calling  └─────────────┬─────────────┘
              │ Iteration                   │
              ▼                             ▼
┌────────────────────────────────────────────────────────┐
│             Simulated Enterprise Database              │
│  16 Orders • 12 Products • 16 FAQs • Tickets • Esc.    │
└────────────────────────────────────────────────────────┘
```

---

## 6. Agent Workflow Loop

```
Customer Message: "I received a damaged laptop for order ORD1001 and want a refund."
       │
       ▼
[Stage 1: Intent Understanding]
Agent identifies: Complaint + Damaged Goods + Refund Intent.
Context extracts: Order ID "ORD1001".
       │
       ▼
[Stage 2: Tool Selection]
Model decides to invoke two tools sequentially:
1. check_return_eligibility(order_id="ORD1001")
2. create_support_ticket(issue="Damaged laptop received, refund requested", priority="High")
       │
       ▼
[Stage 3: Deterministic Tool Execution]
Runtime executes check_return_eligibility → Returns: Eligible (delivered within 30 days).
Runtime executes create_support_ticket → Returns: Ticket #TCK-8804 registered.
       │
       ▼
[Stage 4: Model Synthesis]
Gemini processes tool outputs and formulates final response:
"I have verified order ORD1001. Your AeroBook Slim 14 Laptop is eligible for a full refund.
A prepaid return label has been emailed, and Support Ticket #TCK-8804 has been created."
       │
       ▼
[Stage 5: Activity Log Update]
Agent Activity Panel renders step trace, parameter inspector, and context widgets.
```

---

## 7. Tools and Functions Registry

| Function Name | Input Parameters | Purpose | Return Fields |
|---|---|---|---|
| `search_faq` | `query: string` | Query policy articles & shipping FAQs | Question, Answer, Category |
| `get_order_status` | `order_id: string` | Fetch delivery logistics & courier status | Status, Product, Date, Carrier, Tracking |
| `get_product_info` | `product_name: string` | Query hardware catalog & specifications | Name, Price, In-stock, Specs, Warranty |
| `check_return_eligibility` | `order_id: string` | Evaluate 30-day post-delivery return policy | Eligible (bool), Reason, Next Steps |
| `create_support_ticket` | `issue: string, priority: string` | Register complaint in official support queue | Ticket ID, Category, Priority, Status |
| `escalate_to_human` | `issue_summary: string, reason: string` | Transfer case to senior human specialist | Escalation ID, Reason, Queue, Status |
| `analyze_sentiment` | `customer_message: string` | Classify customer emotional state | Sentiment (Positive, Neutral, Negative, Angry) |

---

## 8. Technology Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS, Lucide React icons.
- **Backend:** Node.js, Express 4, `tsx` TypeScript runtime.
- **Artificial Intelligence:** Google Gemini API (`@google/genai` TypeScript SDK), Gemini Function Calling (`gemini-3.8-flash`).
- **Data Persistence:** In-memory structured enterprise database with factory reset capability.
- **Build Tool:** Vite 8 with SPA middleware mounting.

---

## 9. Installation & Setup

### Prerequisites
- Node.js (version 18 or higher)
- npm (version 9 or higher)

### Installation Steps
1. Clone or download the repository.
2. Install project dependencies:
   ```bash
   npm install
   ```

### Gemini API Setup
Configure your API key in the `.env` file (or through the AI Studio Secrets panel):
```env
GEMINI_API_KEY="your-gemini-api-key-here"
```

---

## 10. How to Run the Project

1. **Start the Development Server:**
   ```bash
   npm run dev
   ```
2. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```
3. **Build for Production:**
   ```bash
   npm run build
   npm run start
   ```

---

## 11. Sample Test Cases & Demonstration Script

| Test # | User Prompt | Expected Agent Behavior & Tool Execution |
|---|---|---|
| **1** | `"Where is my order ORD1001?"` | Detects order tracking intent. Calls `get_order_status("ORD1001")`. Returns FedEx delivery status. |
| **2** | `"When will my order arrive?"` | **Tests Conversational Memory.** Recognizes "my order" refers to ORD1001 from previous turn without re-asking. Calls `get_order_status("ORD1001")`. |
| **3** | `"Tell me about the X200 headphones."` | Calls `get_product_info("X200")`. Displays ANC specs, 40hr battery life, LDAC codecs, and price. |
| **4** | `"Can I return order ORD1005?"` | Calls `check_return_eligibility("ORD1005")`. Confirms item is eligible within 30-day window. |
| **5** | `"I received a damaged product and want a refund."` | Agent asks for Order ID if unprovided, or executes return check + creates priority ticket if order ID is present. |
| **6** | `"I want a refund for my order."` | Evaluates return policy and verifies order status before explaining refund turnaround. |
| **7** | `"Create a complaint for my order."` | Calls `create_support_ticket(priority="High")`. Logs official ticket #TCK-xxxx. |
| **8** | `"Your service is terrible and nobody is helping me!"` | **Tests Sentiment & Escalation.** Detects Angry sentiment. Automatically calls `create_support_ticket` + `escalate_to_human`. |
| **9** | `"Talk to a human agent right now."` | Calls `escalate_to_human(reason="Explicit request")`. Assigns to Tier 2 specialist. |
| **10** | `"What is your return policy?"` | Calls `search_faq("return policy")`. Returns 30-day money-back guarantee details. |

---

## 12. Explanation of How This Demonstrates Agentic AI

### Traditional Chatbot vs. SmartServe AI

| Dimension | Traditional Chatbot | SmartServe AI (Agentic) |
|---|---|---|
| **Action Capability** | Read-only text generator | Callable tools that query databases & create tickets |
| **Truth Grounding** | Predicts tokens probabilistically; hallucinates dates | Grounded in verified database records |
| **Decision Making** | Static if-else branching or ungrounded LLM reply | Autonomous reasoning loop: dynamically chooses 0, 1, or multiple tools |
| **Observability** | Black-box output | Full step-by-step Agent Activity inspection |
| **Memory** | Typically forgets previous references | Preserves active order ID across turns |
| **Escalation** | Fakes human presence | Logs genuine escalation records with unique Reference IDs |

---

## 13. Academic Disclosure
*SmartServe AI was created as an academic demonstration for the Master of Computer Applications (MCA) curriculum. All product lines, order numbers, customer profiles, and courier tracking details are realistic simulated entities designed to demonstrate applied Generative AI and Agentic Systems.*
