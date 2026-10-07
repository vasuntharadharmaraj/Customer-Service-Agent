export interface ToolExecutionStep {
  tool: string;
  input: Record<string, any>;
  result: Record<string, any>;
  summary: string;
  status: "success" | "error";
  timestamp: string;
}

export interface AgentActivity {
  intent: string;
  toolSelected: string;
  toolSteps: ToolExecutionStep[];
  sentiment: "Positive" | "Neutral" | "Negative" | "Angry";
  finalAction: string;
  isEscalated: boolean;
  escalationDetails?: {
    escalationId: string;
    reason: string;
    summary: string;
    status: string;
    assignedAgent?: string;
    escalatedAt?: string;
  };
  createdTickets: Array<{
    ticketId: string;
    issueCategory: string;
    priority: string;
    status: string;
    orderId?: string;
    createdAt?: string;
  }>;
  orderInfo?: {
    orderId: string;
    product: string;
    orderDate: string;
    orderStatus: string;
    estimatedDeliveryDate: string;
    carrier?: string;
    trackingNumber?: string;
    customerName?: string;
    deliveryAddress?: string;
  };
  productInfo?: {
    productName: string;
    description: string;
    price: string;
    availability: string;
    specifications?: Record<string, string>;
    warranty?: string;
  };
  activeOrderId?: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  activity?: AgentActivity;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  inStock: boolean;
  stockCount: number;
  description: string;
  specifications: Record<string, string>;
  warrantyMonths: number;
}

export interface Order {
  orderId: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  productName: string;
  productId: string;
  quantity: number;
  totalPrice: number;
  orderDate: string;
  orderStatus: string;
  estimatedDeliveryDate: string;
  deliveryAddress: string;
  trackingNumber: string;
  carrier: string;
  deliveredDate?: string;
  isEligibleForReturn: boolean;
  returnIneligibleReason?: string;
}

export interface FAQItem {
  id: string;
  category: string;
  question: string;
  keywords: string[];
  answer: string;
}

export interface SupportTicket {
  ticketId: string;
  customerId?: string;
  orderId?: string;
  issueCategory: string;
  issueDescription: string;
  priority: string;
  status: string;
  createdAt: string;
}

export interface EscalationRecord {
  escalationId: string;
  customerId?: string;
  orderId?: string;
  ticketId?: string;
  reason: string;
  issueSummary: string;
  status: string;
  escalatedAt: string;
  assignedAgent?: string;
}

export interface DatabaseState {
  products: Product[];
  orders: Order[];
  faqs: FAQItem[];
  tickets: SupportTicket[];
  escalations: EscalationRecord[];
}
