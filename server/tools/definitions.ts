import { FunctionDeclaration, Type } from "@google/genai";

export const searchFaqDeclaration: FunctionDeclaration = {
  name: "search_faq",
  description: "Search the local FAQ knowledge base for company policies, return procedures, shipping timelines, warranties, payment options, and general support info.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      query: {
        type: Type.STRING,
        description: "The search query keywords or policy question, e.g. 'return policy', 'international shipping', 'warranty'."
      }
    },
    required: ["query"]
  }
};

export const getOrderStatusDeclaration: FunctionDeclaration = {
  name: "get_order_status",
  description: "Retrieve real-time simulated order information and delivery tracking status by Order ID (e.g., ORD1001, ORD1024).",
  parameters: {
    type: Type.OBJECT,
    properties: {
      order_id: {
        type: Type.STRING,
        description: "The unique order identifier, formatted like ORD1001, ORD1002, etc."
      }
    },
    required: ["order_id"]
  }
};

export const getProductInfoDeclaration: FunctionDeclaration = {
  name: "get_product_info",
  description: "Search the product catalog to retrieve detailed specs, pricing, availability, and description by product name or keyword (e.g. 'X200 headphones', 'AeroBook laptop', 'VisionQuest monitor').",
  parameters: {
    type: Type.OBJECT,
    properties: {
      product_name: {
        type: Type.STRING,
        description: "The name, model, or category of the product to look up, e.g. 'X200', 'AeroBook', 'PowerCore'."
      }
    },
    required: ["product_name"]
  }
};

export const checkReturnEligibilityDeclaration: FunctionDeclaration = {
  name: "check_return_eligibility",
  description: "Check whether a specific customer order is eligible for return or refund according to our 30-day post-delivery return policy.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      order_id: {
        type: Type.STRING,
        description: "The order ID to check eligibility for, e.g. ORD1001, ORD1005, ORD1006."
      }
    },
    required: ["order_id"]
  }
};

export const createSupportTicketDeclaration: FunctionDeclaration = {
  name: "create_support_ticket",
  description: "Create an official customer support ticket for complaints, defects, damaged items, billing inquiries, or tracking issues.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      issue: {
        type: Type.STRING,
        description: "Detailed description of customer complaint or issue."
      },
      priority: {
        type: Type.STRING,
        description: "Priority of the ticket: 'Low', 'Medium', 'High', or 'Critical'."
      }
    },
    required: ["issue", "priority"]
  }
};

export const escalateToHumanDeclaration: FunctionDeclaration = {
  name: "escalate_to_human",
  description: "Escalate complex, sensitive, unresolved, or high-frustration issues to a human support representative or senior manager.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      issue_summary: {
        type: Type.STRING,
        description: "Concise summary of the unresolved issue requiring human intervention."
      },
      reason: {
        type: Type.STRING,
        description: "Reason for escalation, e.g. 'Customer highly frustrated', 'Payment dispute', 'Explicit human request', 'Complex return exception'."
      }
    },
    required: ["issue_summary"]
  }
};

export const analyzeSentimentDeclaration: FunctionDeclaration = {
  name: "analyze_sentiment",
  description: "Analyze the customer message to determine emotional sentiment: Positive, Neutral, Negative, or Angry.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      customer_message: {
        type: Type.STRING,
        description: "The text of the customer message to evaluate."
      }
    },
    required: ["customer_message"]
  }
};

export const AGENT_TOOLS: FunctionDeclaration[] = [
  searchFaqDeclaration,
  getOrderStatusDeclaration,
  getProductInfoDeclaration,
  checkReturnEligibilityDeclaration,
  createSupportTicketDeclaration,
  escalateToHumanDeclaration,
  analyzeSentimentDeclaration
];
