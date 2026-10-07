/**
 * SmartServe AI - Simulated Enterprise Customer Support Database
 * Contains Products, Orders, Customers, FAQs, Support Tickets, and Escalations.
 */

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
  orderStatus: 'Delivered' | 'Shipped' | 'Out for Delivery' | 'Processing' | 'In Transit' | 'Cancelled' | 'Returned';
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
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'In Progress' | 'Escalated' | 'Resolved';
  createdAt: string;
}

export interface EscalationRecord {
  escalationId: string;
  customerId?: string;
  orderId?: string;
  ticketId?: string;
  reason: string;
  issueSummary: string;
  status: 'Pending Human Review' | 'Assigned to Senior Tier' | 'Resolved';
  escalatedAt: string;
  assignedAgent?: string;
}

// Initial Products (12 products)
export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "PROD-X200",
    name: "X200 Wireless Noise-Cancelling Headphones",
    category: "Audio",
    price: 199.99,
    inStock: true,
    stockCount: 42,
    description: "Premium over-ear wireless headphones with industry-leading Active Noise Cancellation (ANC), 40-hour battery life, and crystal-clear multipoint Bluetooth 5.3 connectivity.",
    specifications: {
      "Driver": "40mm Bio-Cellulose Dynamic Drivers",
      "Battery Life": "40 Hours with ANC on, 55 Hours ANC off",
      "Weight": "250 grams",
      "Bluetooth": "5.3 with LDAC, AAC, SBC",
      "Fast Charging": "10 minutes provides 5 hours playback",
      "Microphones": "4 Beamforming Mics with AI Noise Suppression"
    },
    warrantyMonths: 24
  },
  {
    id: "PROD-AERO14",
    name: "AeroBook Slim 14 Laptop",
    category: "Computers",
    price: 1099.00,
    inStock: true,
    stockCount: 18,
    description: "Ultra-portable 14-inch OLED powerhouse laptop featuring Intel Core Ultra 7 processor, 32GB LPDDR5X RAM, 1TB NVMe SSD, and 16-hour battery endurance.",
    specifications: {
      "Display": "14.0-inch 2.8K OLED 120Hz (2880x1800)",
      "Processor": "Intel Core Ultra 7 155H",
      "Memory": "32GB LPDDR5X 7467MHz",
      "Storage": "1TB PCIe Gen4 NVMe SSD",
      "Ports": "2x Thunderbolt 4, 1x USB-A 3.2, 1x HDMI 2.1, Audio Jack",
      "Weight": "1.19 kg (2.62 lbs)"
    },
    warrantyMonths: 12
  },
  {
    id: "PROD-TAB11",
    name: "UltraTab Pro 11 Tablet",
    category: "Tablets",
    price: 649.99,
    inStock: true,
    stockCount: 25,
    description: "High-performance productivity tablet equipped with an 11-inch Liquid Retina display, stylus support, quad speakers, and all-day battery life.",
    specifications: {
      "Display": "11-inch 120Hz IPS Touchscreen (2560x1600)",
      "Chipset": "Octa-Core Octa-X 8nm",
      "RAM & Storage": "8GB RAM / 256GB Storage",
      "Stylus Support": "SmartPen Gen 2 compatible (magnetic wireless charging)",
      "Cameras": "13MP Rear / 8MP Ultra-wide Front with Auto-framing"
    },
    warrantyMonths: 12
  },
  {
    id: "PROD-SOUND-MINI",
    name: "SoundWave Mini Portable Speaker",
    category: "Audio",
    price: 49.99,
    inStock: true,
    stockCount: 85,
    description: "Rugged waterproof IP67 Bluetooth speaker with deep punchy bass, 360-degree acoustics, and up to 14 hours of continuous playback.",
    specifications: {
      "Water Resistance": "IP67 Dustproof and Waterproof (submersible up to 1m for 30 min)",
      "Battery": "14 Hours runtime (3000mAh)",
      "Output Power": "15W RMS",
      "Connectivity": "Bluetooth 5.2, PartySync Multi-speaker pairing"
    },
    warrantyMonths: 12
  },
  {
    id: "PROD-VISION-4K",
    name: "VisionQuest 4K Smart Monitor 27-inch",
    category: "Monitors",
    price: 389.00,
    inStock: true,
    stockCount: 14,
    description: "Crisp 27-inch 4K UHD IPS professional monitor with 99% sRGB color gamut, USB-C 90W Power Delivery, and built-in stereo speakers.",
    specifications: {
      "Resolution": "3840 x 2160 UHD @ 60Hz",
      "Panel Type": "IPS Anti-Glare",
      "Brightness": "400 nits (HDR400)",
      "Connectivity": "1x USB-C 90W PD, 2x HDMI 2.0, 1x DisplayPort 1.4, USB Hub"
    },
    warrantyMonths: 36
  },
  {
    id: "PROD-POWER-20K",
    name: "PowerCore 20000mAh Fast Battery Bank",
    category: "Accessories",
    price: 45.00,
    inStock: true,
    stockCount: 120,
    description: "Ultra-high capacity airline-approved portable power bank with 65W Power Delivery output, capable of fast-charging laptops, tablets, and phones simultaneously.",
    specifications: {
      "Capacity": "20,000mAh / 74Wh (TSA Approved)",
      "Max Output": "65W USB-C PD 3.0",
      "Ports": "2x USB-C (in/out), 1x USB-A QC 3.0",
      "Display": "Digital smart LED percentage readout"
    },
    warrantyMonths: 18
  },
  {
    id: "PROD-MECH-PRO",
    name: "MechStrike Pro Mechanical Keyboard",
    category: "Peripherals",
    price: 119.99,
    inStock: true,
    stockCount: 30,
    description: "Custom mechanical gaming keyboard with hot-swappable tactile brown switches, per-key RGB lighting, PBT double-shot keycaps, and aluminum top frame.",
    specifications: {
      "Layout": "Tenkeyless (87 Keys) or Full 104 Keys",
      "Switches": "Hot-swappable Gateron Brown Tactile",
      "Connectivity": "Tri-mode: 2.4GHz Wireless, Bluetooth 5.0, Detachable USB-C",
      "Battery": "4000mAh (up to 200 hours without RGB)"
    },
    warrantyMonths: 24
  },
  {
    id: "PROD-MOUSE-APEX",
    name: "ApexPrecision Wireless Ergonomic Mouse",
    category: "Peripherals",
    price: 69.95,
    inStock: true,
    stockCount: 54,
    description: "Sculpted ergonomic vertical mouse designed to alleviate wrist strain, featuring a 26K optical sensor, hyper-fast scroll wheel, and whisper-quiet clicks.",
    specifications: {
      "DPI": "200 to 26,000 DPI adjustable",
      "Ergonomics": "57-degree natural handshake angle",
      "Battery": "Rechargeable Li-Po, 70 days per full charge",
      "Buttons": "6 programmable buttons"
    },
    warrantyMonths: 24
  },
  {
    id: "PROD-LAMP-LUMINA",
    name: "Lumina Desk Smart LED Lamp",
    category: "Home & Office",
    price: 59.99,
    inStock: true,
    stockCount: 22,
    description: "Architect-style eye-care LED desk lamp with auto-dimming ambient brightness sensor, color temperature controls (2700K - 6500K), and wireless phone charging pad base.",
    specifications: {
      "Luminance": "Up to 1000 Lumens",
      "Color Temp": "2700K Warm to 6500K Cool White (5 levels)",
      "Wireless Charger Base": "Qi-certified 15W fast wireless pad",
      "Arm Adjustability": "Multi-angle 3-axis swivel aluminum hinge"
    },
    warrantyMonths: 12
  },
  {
    id: "PROD-WATCH-FIT",
    name: "FitPulse GPS Smartwatch",
    category: "Wearables",
    price: 159.00,
    inStock: false,
    stockCount: 0,
    description: "Comprehensive fitness smartwatch featuring standalone dual-frequency GPS, heart-rate and SpO2 tracking, 5ATM water resistance, and 10-day battery life.",
    specifications: {
      "Display": "1.43-inch AMOLED Sapphire Glass (466x466)",
      "Sensors": "Optical Heart Rate, SpO2, Accelerometer, Barometer, Compass",
      "Water Resistance": "5ATM (Swimming up to 50 meters)",
      "Battery": "Up to 10 days typical use, 24 hours active GPS"
    },
    warrantyMonths: 12
  },
  {
    id: "PROD-CAM-STEALTH",
    name: "StealthStream HD 2K Webcam",
    category: "Accessories",
    price: 79.99,
    inStock: true,
    stockCount: 40,
    description: "High-definition 2K QHD webcam with motorized physical privacy shutter, low-light autofocus sensor, and dual stereo noise-canceling microphones.",
    specifications: {
      "Resolution": "2K QHD (2560x1440) @ 60 FPS",
      "Field of View": "65° / 78° / 90° adjustable via software",
      "Privacy": "Integrated magnetic physical sliding shutter",
      "Mount": "Universal clip for monitors and standard 1/4\" tripod screw"
    },
    warrantyMonths: 24
  },
  {
    id: "PROD-BOTTLE-THERMO",
    name: "ThermoShield Smart Insulated Bottle 750ml",
    category: "Lifestyle",
    price: 34.50,
    inStock: true,
    stockCount: 65,
    description: "Vacuum-insulated double-wall stainless steel bottle with digital temperature cap display, keeping drinks freezing cold for 24 hours or piping hot for 12 hours.",
    specifications: {
      "Capacity": "750ml (25 oz)",
      "Material": "18/8 Pro-Grade Kitchen Stainless Steel, BPA Free",
      "Cap": "LED Touch Temperature Indicator (IPX7 waterproof)",
      "Insulation": "Double-wall vacuum with copper lining"
    },
    warrantyMonths: 12
  }
];

// Initial Orders (16 realistic orders)
export const INITIAL_ORDERS: Order[] = [
  {
    orderId: "ORD1001",
    customerId: "CUST-401",
    customerName: "Alex Rivera",
    customerEmail: "alex.rivera@example.com",
    productName: "X200 Wireless Noise-Cancelling Headphones",
    productId: "PROD-X200",
    quantity: 1,
    totalPrice: 199.99,
    orderDate: "2026-09-28",
    orderStatus: "Delivered",
    estimatedDeliveryDate: "2026-10-02",
    deliveredDate: "2026-10-02",
    deliveryAddress: "742 Evergreen Terrace, Springfield, OR 97477",
    trackingNumber: "TRK-FEDEX-9481023",
    carrier: "FedEx Ground",
    isEligibleForReturn: true,
    returnIneligibleReason: undefined
  },
  {
    orderId: "ORD1002",
    customerId: "CUST-402",
    customerName: "Sarah Chen",
    customerEmail: "sarah.chen@example.com",
    productName: "AeroBook Slim 14 Laptop",
    productId: "PROD-AERO14",
    quantity: 1,
    totalPrice: 1099.00,
    orderDate: "2026-10-03",
    orderStatus: "In Transit",
    estimatedDeliveryDate: "2026-10-08",
    deliveryAddress: "1204 Beacon St, Brookline, MA 02446",
    trackingNumber: "TRK-UPS-8829103",
    carrier: "UPS Express Saver",
    isEligibleForReturn: false,
    returnIneligibleReason: "Order has not yet been delivered. Returns can be initiated only after delivery."
  },
  {
    orderId: "ORD1003",
    customerId: "CUST-403",
    customerName: "Marcus Johnson",
    customerEmail: "marcus.j@example.com",
    productName: "VisionQuest 4K Smart Monitor 27-inch",
    productId: "PROD-VISION-4K",
    quantity: 1,
    totalPrice: 389.00,
    orderDate: "2026-10-04",
    orderStatus: "Out for Delivery",
    estimatedDeliveryDate: "2026-10-07",
    deliveryAddress: "550 Market Street, San Francisco, CA 94104",
    trackingNumber: "TRK-USPS-3391024",
    carrier: "USPS Priority",
    isEligibleForReturn: false,
    returnIneligibleReason: "Package is currently with the courier for delivery today. Return can be requested upon receipt."
  },
  {
    orderId: "ORD1004",
    customerId: "CUST-404",
    customerName: "Elena Rostova",
    customerEmail: "elena.r@example.com",
    productName: "UltraTab Pro 11 Tablet",
    productId: "PROD-TAB11",
    quantity: 1,
    totalPrice: 649.99,
    orderDate: "2026-10-05",
    orderStatus: "Processing",
    estimatedDeliveryDate: "2026-10-10",
    deliveryAddress: "321 Elm Street, Austin, TX 78701",
    trackingNumber: "Pending Allocation",
    carrier: "FedEx Express",
    isEligibleForReturn: false,
    returnIneligibleReason: "Order is currently being packaged in the warehouse. You may cancel this order before dispatch."
  },
  {
    orderId: "ORD1005",
    customerId: "CUST-405",
    customerName: "David Miller",
    customerEmail: "david.m@example.com",
    productName: "MechStrike Pro Mechanical Keyboard",
    productId: "PROD-MECH-PRO",
    quantity: 1,
    totalPrice: 119.99,
    orderDate: "2026-09-30",
    orderStatus: "Delivered",
    estimatedDeliveryDate: "2026-10-04",
    deliveredDate: "2026-10-04",
    deliveryAddress: "88 Pine Road, Seattle, WA 98101",
    trackingNumber: "TRK-DHL-7719201",
    carrier: "DHL Express",
    isEligibleForReturn: true,
    returnIneligibleReason: undefined
  },
  {
    orderId: "ORD1006",
    customerId: "CUST-406",
    customerName: "Priya Patel",
    customerEmail: "priya.p@example.com",
    productName: "ApexPrecision Wireless Ergonomic Mouse",
    productId: "PROD-MOUSE-APEX",
    quantity: 2,
    totalPrice: 139.90,
    orderDate: "2026-08-10",
    orderStatus: "Delivered",
    estimatedDeliveryDate: "2026-08-15",
    deliveredDate: "2026-08-15",
    deliveryAddress: "404 North Ave, Atlanta, GA 30332",
    trackingNumber: "TRK-UPS-1102938",
    carrier: "UPS Ground",
    isEligibleForReturn: false,
    returnIneligibleReason: "Exceeded standard 30-day return policy window (delivered over 50 days ago on Aug 15, 2026). Warranty support is still valid."
  },
  {
    orderId: "ORD1007",
    customerId: "CUST-407",
    customerName: "James Wilson",
    customerEmail: "j.wilson@example.com",
    productName: "SoundWave Mini Portable Speaker",
    productId: "PROD-SOUND-MINI",
    quantity: 1,
    totalPrice: 49.99,
    orderDate: "2026-10-01",
    orderStatus: "Shipped",
    estimatedDeliveryDate: "2026-10-09",
    deliveryAddress: "15 Ocean Drive, Miami, FL 33139",
    trackingNumber: "TRK-FEDEX-5544332",
    carrier: "FedEx Home Delivery",
    isEligibleForReturn: false,
    returnIneligibleReason: "Order is in transit with carrier. Eligible for return within 30 days after arrival."
  },
  {
    orderId: "ORD1008",
    customerId: "CUST-408",
    customerName: "Carlos Mendez",
    customerEmail: "carlos.m@example.com",
    productName: "PowerCore 20000mAh Fast Battery Bank",
    productId: "PROD-POWER-20K",
    quantity: 1,
    totalPrice: 45.00,
    orderDate: "2026-10-02",
    orderStatus: "Delivered",
    estimatedDeliveryDate: "2026-10-05",
    deliveredDate: "2026-10-05",
    deliveryAddress: "900 Michigan Ave, Chicago, IL 60611",
    trackingNumber: "TRK-USPS-8877665",
    carrier: "USPS Ground Advantage",
    isEligibleForReturn: true,
    returnIneligibleReason: undefined
  },
  {
    orderId: "ORD1009",
    customerId: "CUST-409",
    customerName: "Emily Watson",
    customerEmail: "emily.w@example.com",
    productName: "Lumina Desk Smart LED Lamp",
    productId: "PROD-LAMP-LUMINA",
    quantity: 1,
    totalPrice: 59.99,
    orderDate: "2026-09-25",
    orderStatus: "Delivered",
    estimatedDeliveryDate: "2026-09-29",
    deliveredDate: "2026-09-29",
    deliveryAddress: "220 Park Blvd, Denver, CO 80203",
    trackingNumber: "TRK-UPS-9900112",
    carrier: "UPS Ground",
    isEligibleForReturn: true,
    returnIneligibleReason: undefined
  },
  {
    orderId: "ORD1010",
    customerId: "CUST-410",
    customerName: "Liam O'Connor",
    customerEmail: "liam.oc@example.com",
    productName: "StealthStream HD 2K Webcam",
    productId: "PROD-CAM-STEALTH",
    quantity: 1,
    totalPrice: 79.99,
    orderDate: "2026-10-04",
    orderStatus: "Processing",
    estimatedDeliveryDate: "2026-10-11",
    deliveryAddress: "17 Maple Leaf Way, Portland, OR 97201",
    trackingNumber: "Pending Allocation",
    carrier: "FedEx Ground",
    isEligibleForReturn: false,
    returnIneligibleReason: "Order is processing in fulfillment center. Item can be cancelled before shipment."
  },
  {
    orderId: "ORD1011",
    customerId: "CUST-411",
    customerName: "Maya Lin",
    customerEmail: "maya.lin@example.com",
    productName: "ThermoShield Smart Insulated Bottle 750ml",
    productId: "PROD-BOTTLE-THERMO",
    quantity: 2,
    totalPrice: 69.00,
    orderDate: "2026-09-15",
    orderStatus: "Returned",
    estimatedDeliveryDate: "2026-09-20",
    deliveredDate: "2026-09-19",
    deliveryAddress: "55 Wall St, New York, NY 10005",
    trackingNumber: "TRK-RET-3322110",
    carrier: "USPS Returns",
    isEligibleForReturn: false,
    returnIneligibleReason: "Item has already been returned and full refund processed on Sept 27, 2026."
  },
  {
    orderId: "ORD1012",
    customerId: "CUST-412",
    customerName: "Robert Taylor",
    customerEmail: "robert.t@example.com",
    productName: "AeroBook Slim 14 Laptop",
    productId: "PROD-AERO14",
    quantity: 1,
    totalPrice: 1099.00,
    orderDate: "2026-10-01",
    orderStatus: "Delivered",
    estimatedDeliveryDate: "2026-10-04",
    deliveredDate: "2026-10-04",
    deliveryAddress: "1400 Broadway, Nashville, TN 37203",
    trackingNumber: "TRK-FEDEX-8899001",
    carrier: "FedEx Priority Overnight",
    isEligibleForReturn: true,
    returnIneligibleReason: undefined
  },
  {
    orderId: "ORD1013",
    customerId: "CUST-413",
    customerName: "Zoe Kravitz",
    customerEmail: "zoe.k@example.com",
    productName: "X200 Wireless Noise-Cancelling Headphones",
    productId: "PROD-X200",
    quantity: 1,
    totalPrice: 199.99,
    orderDate: "2026-10-05",
    orderStatus: "Shipped",
    estimatedDeliveryDate: "2026-10-08",
    deliveryAddress: "67 Sunset Blvd, Los Angeles, CA 90028",
    trackingNumber: "TRK-UPS-7744119",
    carrier: "UPS Next Day Air",
    isEligibleForReturn: false,
    returnIneligibleReason: "Order is currently in transit with UPS. Return can be requested once received."
  },
  {
    orderId: "ORD1014",
    customerId: "CUST-414",
    customerName: "Daniel Craig",
    customerEmail: "daniel.c@example.com",
    productName: "VisionQuest 4K Smart Monitor 27-inch",
    productId: "PROD-VISION-4K",
    quantity: 1,
    totalPrice: 389.00,
    orderDate: "2026-09-02",
    orderStatus: "Cancelled",
    estimatedDeliveryDate: "2026-09-07",
    deliveryAddress: "10 Downing St, London (Forwarding Box), NJ 07102",
    trackingNumber: "N/A",
    carrier: "N/A",
    isEligibleForReturn: false,
    returnIneligibleReason: "Order was cancelled prior to shipping. Payment was reversed."
  },
  {
    orderId: "ORD1015",
    customerId: "CUST-415",
    customerName: "Amina Yusuf",
    customerEmail: "amina.y@example.com",
    productName: "MechStrike Pro Mechanical Keyboard",
    productId: "PROD-MECH-PRO",
    quantity: 1,
    totalPrice: 119.99,
    orderDate: "2026-10-03",
    orderStatus: "Delivered",
    estimatedDeliveryDate: "2026-10-06",
    deliveredDate: "2026-10-06",
    deliveryAddress: "808 South Congress, Austin, TX 78704",
    trackingNumber: "TRK-DHL-4455667",
    carrier: "DHL Express",
    isEligibleForReturn: true,
    returnIneligibleReason: undefined
  },
  {
    orderId: "ORD1024",
    customerId: "CUST-999",
    customerName: "Jordan Hayes",
    customerEmail: "jordan.h@example.com",
    productName: "X200 Wireless Noise-Cancelling Headphones",
    productId: "PROD-X200",
    quantity: 1,
    totalPrice: 199.99,
    orderDate: "2026-10-02",
    orderStatus: "Shipped",
    estimatedDeliveryDate: "2026-10-08",
    deliveryAddress: "450 Silicon Way, San Jose, CA 95112",
    trackingNumber: "TRK-FEDEX-9988776",
    carrier: "FedEx Express 2-Day",
    isEligibleForReturn: false,
    returnIneligibleReason: "Package is currently en route with carrier. Returns can be processed after delivery."
  }
];

// Initial FAQs (16 comprehensive items)
export const INITIAL_FAQS: FAQItem[] = [
  {
    id: "FAQ-01",
    category: "Returns & Refunds",
    question: "What is your return policy?",
    keywords: ["return", "policy", "refund", "days", "window", "eligibility", "can i return"],
    answer: "We offer a 30-day money-back guarantee for most products from the date of delivery. Items must be in original condition with packaging, tags, and accessories included. Once inspected at our returns depot, refunds are issued to your original payment method within 3 to 5 business days."
  },
  {
    id: "FAQ-02",
    category: "Returns & Refunds",
    question: "How do I return a damaged or defective item?",
    keywords: ["damaged", "broken", "defective", "refund", "return damaged", "cracked", "faulty"],
    answer: "If you received a damaged or malfunctioning item, we apologize for the inconvenience! Please provide your Order ID. You are eligible for an immediate prepaid replacement or a 100% refund without paying return shipping. Our support team will generate a prepaid return label and create an expedited priority ticket."
  },
  {
    id: "FAQ-03",
    category: "Shipping & Delivery",
    question: "What are your shipping options and delivery timelines?",
    keywords: ["shipping", "delivery", "timelines", "express", "standard", "how long", "rates"],
    answer: "We offer Standard Shipping (3-5 business days, free on orders over $50), Express 2-Day Delivery ($9.99), and Overnight Priority ($19.99). Orders placed before 2 PM EST ship out the same day."
  },
  {
    id: "FAQ-04",
    category: "Shipping & Delivery",
    question: "How do I track my order status?",
    keywords: ["track", "tracking", "status", "where is", "carrier", "locate"],
    answer: "You can track your order at any time by asking our SmartServe assistant for your Order ID (e.g., ORD1001 or ORD1024), or by checking your confirmation email for the carrier tracking number (FedEx, UPS, USPS, DHL)."
  },
  {
    id: "FAQ-05",
    category: "Warranty",
    question: "What does the hardware warranty cover?",
    keywords: ["warranty", "hardware", "coverage", "repairs", "defect", "guarantee"],
    answer: "All hardware items come with manufacturer warranty ranging from 12 to 36 months (e.g., 24 months for X200 Headphones, 12 months for laptops and tablets). Warranty covers manufacturing defects, hardware failure, and battery malfunctions under normal usage. It excludes accidental drops and water submersion beyond rated IP ratings."
  },
  {
    id: "FAQ-06",
    category: "Payment & Billing",
    question: "What payment methods are supported?",
    keywords: ["payment", "methods", "credit card", "paypal", "apple pay", "google pay", "klarna"],
    answer: "We accept Visa, Mastercard, American Express, Discover, PayPal, Apple Pay, Google Pay, and Klarna buy-now-pay-later (4 interest-free installments)."
  },
  {
    id: "FAQ-07",
    category: "Order Changes",
    question: "Can I change my delivery address or cancel my order after placing it?",
    keywords: ["change address", "modify order", "cancel order", "cancel", "wrong address"],
    answer: "Orders in 'Processing' status can be modified or cancelled immediately through support before warehouse fulfillment. Once an order status changes to 'Shipped', the address cannot be altered through us directly, but you may reroute the parcel via FedEx Delivery Manager or UPS My Choice using your tracking number."
  },
  {
    id: "FAQ-08",
    category: "Returns & Refunds",
    question: "How long does a refund take to appear in my bank account?",
    keywords: ["refund time", "how long refund", "bank account", "refund processing", "reversal"],
    answer: "Once our fulfillment center scans your returned parcel, the refund is triggered within 24 hours. Depending on your financial institution, funds generally appear on your credit or debit statement in 3-5 business days."
  },
  {
    id: "FAQ-09",
    category: "International",
    question: "Do you ship internationally?",
    keywords: ["international", "global", "overseas", "canada", "europe", "customs", "worldwide"],
    answer: "Yes, we ship to over 65 countries worldwide including Canada, the UK, the European Union, Australia, and Japan. International transit averages 6-10 business days. Import duties and taxes are calculated at checkout."
  },
  {
    id: "FAQ-10",
    category: "Customer Support",
    question: "How do I reach a human representative or manager?",
    keywords: ["talk to human", "human agent", "representative", "manager", "escalate", "real person"],
    answer: "You can ask our assistant to escalate your issue at any moment! Our human support tier is active 24/7. When an issue is escalated, an urgent escalation record is logged, and a senior tier support representative reviews the conversation context."
  },
  {
    id: "FAQ-11",
    category: "Product Support",
    question: "Are firmware updates free for smart audio and wearable devices?",
    keywords: ["firmware", "software update", "x200 update", "app", "upgrade"],
    answer: "Yes! All companion apps (such as the SmartServe Audio app for X200 Headphones and FitPulse Health app) are free on iOS and Android. Firmware updates download automatically over Bluetooth to improve performance, noise cancellation, and battery efficiency."
  },
  {
    id: "FAQ-12",
    category: "Price Matching",
    question: "Do you offer price matching?",
    keywords: ["price match", "cheaper elsewhere", "competitor price", "discount"],
    answer: "Yes! If you find an identical item sold and shipped by an authorized major retailer (Amazon, Best Buy, B&H) at a lower advertised price within 14 days of purchase, contact us with the link and we will refund the difference."
  },
  {
    id: "FAQ-13",
    category: "Product Safety",
    question: "Are your batteries and electronics certified safe for air travel?",
    keywords: ["flight", "tsa", "battery", "airplane", "powercore", "airline"],
    answer: "Yes. Our PowerCore 20000mAh portable charger has a 74Wh rating, which is well below the FAA and TSA 100Wh limit for carry-on luggage. Lithium batteries must always be kept in carry-on baggage and not checked luggage."
  },
  {
    id: "FAQ-14",
    category: "Sustainability",
    question: "Do you have an e-waste trade-in or recycling program?",
    keywords: ["recycling", "trade in", "e-waste", "recycle old device", "green"],
    answer: "Yes, we offer free trade-in and recycling for old laptops, tablets, headphones, and chargers. In addition to responsible recycling, you can receive up to a $50 store credit toward your next purchase."
  },
  {
    id: "FAQ-15",
    category: "Security & Privacy",
    question: "How do you protect my payment and personal information?",
    keywords: ["security", "pci", "data protection", "privacy", "safe"],
    answer: "We use bank-level 256-bit AES encryption and are Level 1 PCI-DSS compliant. We never store complete credit card numbers on our servers, and we never sell personal information to third parties."
  },
  {
    id: "FAQ-16",
    category: "Returns & Refunds",
    question: "What happens if an order status is 'Out for Delivery' or 'In Transit' and I want to return it?",
    keywords: ["return in transit", "return out for delivery", "cancel while shipping"],
    answer: "Items currently in transit cannot be marked for return until they are physically delivered. Once delivered, you have 30 days to initiate a return or refuse delivery at the door so the courier returns to sender."
  }
];

// Initial Support Tickets
export const INITIAL_TICKETS: SupportTicket[] = [
  {
    ticketId: "TCK-8801",
    customerId: "CUST-405",
    orderId: "ORD1005",
    issueCategory: "Hardware Defect",
    issueDescription: "Spacebar stabilizer on MechStrike Pro feels loose out of box",
    priority: "Medium",
    status: "In Progress",
    createdAt: "2026-10-05T14:30:00Z"
  },
  {
    ticketId: "TCK-8802",
    customerId: "CUST-402",
    orderId: "ORD1002",
    issueCategory: "Shipping Delay Inquiry",
    issueDescription: "Customer inquired about estimated delivery date for AeroBook laptop",
    priority: "Low",
    status: "Resolved",
    createdAt: "2026-10-04T09:15:00Z"
  },
  {
    ticketId: "TCK-8803",
    customerId: "CUST-406",
    orderId: "ORD1006",
    issueCategory: "Warranty Claim",
    issueDescription: "ApexPrecision mouse left click intermittent, warranty validation requested",
    priority: "Medium",
    status: "Open",
    createdAt: "2026-10-06T11:00:00Z"
  }
];

// Initial Escalations
export const INITIAL_ESCALATIONS: EscalationRecord[] = [
  {
    escalationId: "ESC-101",
    customerId: "CUST-406",
    orderId: "ORD1006",
    ticketId: "TCK-8803",
    reason: "Customer requested exception for past-window return on ergonomic mouse",
    issueSummary: "Mouse purchased in August, customer experiencing discomfort and requested manual store credit review",
    status: "Assigned to Senior Tier",
    escalatedAt: "2026-10-06T11:15:00Z",
    assignedAgent: "Lead Support Specialist: Marcus Vance"
  }
];

// In-Memory Database store with reset capability
class DatabaseStore {
  private products: Product[] = [];
  private orders: Order[] = [];
  private faqs: FAQItem[] = [];
  private tickets: SupportTicket[] = [];
  private escalations: EscalationRecord[] = [];

  constructor() {
    this.reset();
  }

  public reset() {
    this.products = JSON.parse(JSON.stringify(INITIAL_PRODUCTS));
    this.orders = JSON.parse(JSON.stringify(INITIAL_ORDERS));
    this.faqs = JSON.parse(JSON.stringify(INITIAL_FAQS));
    this.tickets = JSON.parse(JSON.stringify(INITIAL_TICKETS));
    this.escalations = JSON.parse(JSON.stringify(INITIAL_ESCALATIONS));
  }

  // FAQ methods
  public searchFAQ(query: string): FAQItem[] {
    const q = query.toLowerCase().trim();
    const words = q.split(/\s+/).filter(w => w.length > 2);

    return this.faqs.filter(faq => {
      const matchQ = faq.question.toLowerCase().includes(q);
      const matchAns = faq.answer.toLowerCase().includes(q);
      const matchKeywords = faq.keywords.some(k => q.includes(k.toLowerCase()) || k.toLowerCase().includes(q));
      const wordMatch = words.some(w => 
        faq.question.toLowerCase().includes(w) || 
        faq.answer.toLowerCase().includes(w) ||
        faq.keywords.some(k => k.toLowerCase().includes(w))
      );
      return matchQ || matchAns || matchKeywords || wordMatch;
    }).slice(0, 3);
  }

  public getAllFAQs(): FAQItem[] {
    return this.faqs;
  }

  // Order methods
  public getOrder(orderId: string): Order | undefined {
    const cleaned = orderId.toUpperCase().trim();
    return this.orders.find(o => o.orderId.toUpperCase() === cleaned);
  }

  public getAllOrders(): Order[] {
    return this.orders;
  }

  // Product methods
  public getProductByName(name: string): Product | undefined {
    const cleaned = name.toLowerCase().trim();
    // exact or substring match
    return this.products.find(p => {
      const pName = p.name.toLowerCase();
      const pId = p.id.toLowerCase();
      return pName.includes(cleaned) || cleaned.includes(pName) || pId.includes(cleaned);
    });
  }

  public searchProducts(query: string): Product[] {
    const q = query.toLowerCase().trim();
    return this.products.filter(p => 
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q)
    );
  }

  public getAllProducts(): Product[] {
    return this.products;
  }

  // Tickets
  public createTicket(issue: string, priority: string, orderId?: string, customerId?: string): SupportTicket {
    const validPriorities: ('Low' | 'Medium' | 'High' | 'Critical')[] = ['Low', 'Medium', 'High', 'Critical'];
    const p = validPriorities.find(vp => vp.toLowerCase() === priority.toLowerCase()) || 'Medium';

    // Auto classify category
    let category = "General Support";
    const lowerIssue = issue.toLowerCase();
    if (lowerIssue.includes("damage") || lowerIssue.includes("broken") || lowerIssue.includes("crack")) {
      category = "Damaged Goods";
    } else if (lowerIssue.includes("refund") || lowerIssue.includes("return")) {
      category = "Return & Refund Request";
    } else if (lowerIssue.includes("delay") || lowerIssue.includes("delivery") || lowerIssue.includes("shipping")) {
      category = "Shipping Logistics";
    } else if (lowerIssue.includes("defect") || lowerIssue.includes("hardware") || lowerIssue.includes("battery")) {
      category = "Hardware Malfunction";
    } else if (lowerIssue.includes("billing") || lowerIssue.includes("charged") || lowerIssue.includes("payment")) {
      category = "Billing Dispute";
    }

    const nextNumber = 8800 + this.tickets.length + 1;
    const newTicket: SupportTicket = {
      ticketId: `TCK-${nextNumber}`,
      customerId,
      orderId,
      issueCategory: category,
      issueDescription: issue,
      priority: p,
      status: 'Open',
      createdAt: new Date().toISOString()
    };

    this.tickets.unshift(newTicket);
    return newTicket;
  }

  public getAllTickets(): SupportTicket[] {
    return this.tickets;
  }

  // Escalations
  public createEscalation(issueSummary: string, reason?: string, orderId?: string, customerId?: string, ticketId?: string): EscalationRecord {
    const nextNumber = 100 + this.escalations.length + 1;
    const newEscalation: EscalationRecord = {
      escalationId: `ESC-${nextNumber}`,
      customerId,
      orderId,
      ticketId,
      reason: reason || "Escalated for senior human review per customer request or frustration criteria",
      issueSummary,
      status: 'Pending Human Review',
      escalatedAt: new Date().toISOString(),
      assignedAgent: "Senior Support Queue (Tier 2)"
    };

    this.escalations.unshift(newEscalation);
    return newEscalation;
  }

  public getAllEscalations(): EscalationRecord[] {
    return this.escalations;
  }
}

export const db = new DatabaseStore();
