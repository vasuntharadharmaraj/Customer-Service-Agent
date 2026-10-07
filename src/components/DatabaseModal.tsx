import React, { useState } from "react";
import { 
  X, 
  Database, 
  Package, 
  Laptop, 
  HelpCircle, 
  Ticket, 
  ShieldAlert, 
  Search, 
  Copy, 
  Check, 
  ArrowRight,
  ExternalLink
} from "lucide-react";
import { DatabaseState, Order, Product, FAQItem, SupportTicket, EscalationRecord } from "../types";

interface DatabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: DatabaseState | null;
  onSelectQuery: (query: string) => void;
}

export const DatabaseModal: React.FC<DatabaseModalProps> = ({
  isOpen,
  onClose,
  data,
  onSelectQuery
}) => {
  const [activeTab, setActiveTab] = useState<"orders" | "products" | "faqs" | "tickets" | "escalations">("orders");
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen || !data) return null;

  const copyToClipboard = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAskAboutOrder = (orderId: string) => {
    onSelectQuery(`Where is my order ${orderId}?`);
    onClose();
  };

  const handleAskAboutProduct = (productName: string) => {
    onSelectQuery(`Tell me about the ${productName}.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-4 bg-slate-850 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">
                Simulated Enterprise Database Explorer
              </h3>
              <p className="text-xs text-slate-400">
                Inspect local records that ground the Agent's tool calls and prevent AI hallucinations
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls & Search */}
        <div className="px-5 py-3 bg-slate-900 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            <button
              onClick={() => { setActiveTab("orders"); setSearch(""); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeTab === "orders"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-750"
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Orders ({data.orders.length})</span>
            </button>

            <button
              onClick={() => { setActiveTab("products"); setSearch(""); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeTab === "products"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-750"
              }`}
            >
              <Laptop className="w-3.5 h-3.5" />
              <span>Products ({data.products.length})</span>
            </button>

            <button
              onClick={() => { setActiveTab("faqs"); setSearch(""); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeTab === "faqs"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-750"
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>FAQs ({data.faqs.length})</span>
            </button>

            <button
              onClick={() => { setActiveTab("tickets"); setSearch(""); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeTab === "tickets"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-750"
              }`}
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>Tickets ({data.tickets.length})</span>
            </button>

            <button
              onClick={() => { setActiveTab("escalations"); setSearch(""); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeTab === "escalations"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-750"
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Escalations ({data.escalations.length})</span>
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${activeTab}...`}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Tab Content Panel */}
        <div className="flex-1 p-5 overflow-y-auto">
          {/* ORDERS TAB */}
          {activeTab === "orders" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {data.orders
                .filter(o => 
                  o.orderId.toLowerCase().includes(search.toLowerCase()) ||
                  o.customerName.toLowerCase().includes(search.toLowerCase()) ||
                  o.productName.toLowerCase().includes(search.toLowerCase()) ||
                  o.orderStatus.toLowerCase().includes(search.toLowerCase())
                )
                .map((order) => (
                  <div
                    key={order.orderId}
                    className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 hover:border-slate-600 transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between pb-2 border-b border-slate-700/60">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-cyan-300">
                            {order.orderId}
                          </span>
                          <button
                            onClick={() => copyToClipboard(order.orderId)}
                            className="p-1 rounded text-slate-400 hover:text-white transition"
                            title="Copy Order ID"
                          >
                            {copiedId === order.orderId ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-700 text-slate-200">
                          {order.orderStatus}
                        </span>
                      </div>

                      <div className="mt-2.5 space-y-1 text-xs">
                        <p className="font-semibold text-white">{order.productName}</p>
                        <p className="text-slate-400">Customer: <span className="text-slate-200">{order.customerName}</span> (${order.totalPrice.toFixed(2)})</p>
                        <p className="text-slate-400">Order Date: <span className="text-slate-300">{order.orderDate}</span></p>
                        <p className="text-slate-400">Est. Delivery: <span className="text-slate-300">{order.estimatedDeliveryDate}</span></p>
                        <p className="text-slate-400">Carrier: <span className="font-mono text-slate-300">{order.carrier}</span></p>
                        <div className="pt-1">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                            order.isEligibleForReturn
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              : "bg-slate-700/60 text-slate-400"
                          }`}>
                            {order.isEligibleForReturn ? "Eligible for Return (Within 30 Days)" : "Not Returnable"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-700/60 flex items-center justify-end">
                      <button
                        onClick={() => handleAskAboutOrder(order.orderId)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded bg-indigo-600/30 hover:bg-indigo-600 text-indigo-200 hover:text-white text-xs font-medium transition cursor-pointer"
                      >
                        <span>Ask Agent</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* PRODUCTS TAB */}
          {activeTab === "products" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {data.products
                .filter(p => 
                  p.name.toLowerCase().includes(search.toLowerCase()) ||
                  p.category.toLowerCase().includes(search.toLowerCase()) ||
                  p.description.toLowerCase().includes(search.toLowerCase())
                )
                .map((prod) => (
                  <div
                    key={prod.id}
                    className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 hover:border-slate-600 transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between pb-2 border-b border-slate-700/60">
                        <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wide">
                          {prod.category}
                        </span>
                        <span className="font-bold text-sm text-emerald-400">
                          ${prod.price.toFixed(2)}
                        </span>
                      </div>

                      <div className="mt-2.5 space-y-1.5 text-xs">
                        <h4 className="font-bold text-sm text-white">{prod.name}</h4>
                        <p className="text-slate-300 text-xs leading-relaxed line-clamp-2">
                          {prod.description}
                        </p>
                        <div className="flex items-center gap-2 pt-1">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            prod.inStock
                              ? "bg-emerald-500/20 text-emerald-300"
                              : "bg-rose-500/20 text-rose-300"
                          }`}>
                            {prod.inStock ? `In Stock (${prod.stockCount} units)` : "Out of Stock"}
                          </span>
                          <span className="text-slate-400 text-[11px]">
                            {prod.warrantyMonths} Mos. Warranty
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-700/60 flex items-center justify-end">
                      <button
                        onClick={() => handleAskAboutProduct(prod.name)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded bg-indigo-600/30 hover:bg-indigo-600 text-indigo-200 hover:text-white text-xs font-medium transition cursor-pointer"
                      >
                        <span>Query Specs</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* FAQS TAB */}
          {activeTab === "faqs" && (
            <div className="space-y-3">
              {data.faqs
                .filter(f => 
                  f.question.toLowerCase().includes(search.toLowerCase()) ||
                  f.answer.toLowerCase().includes(search.toLowerCase()) ||
                  f.category.toLowerCase().includes(search.toLowerCase())
                )
                .map((faq) => (
                  <div
                    key={faq.id}
                    className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 hover:border-slate-600 transition"
                  >
                    <div className="flex items-center justify-between pb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                        {faq.category}
                      </span>
                      <button
                        onClick={() => {
                          onSelectQuery(faq.question);
                          onClose();
                        }}
                        className="text-xs text-indigo-300 hover:text-indigo-200 transition font-medium cursor-pointer"
                      >
                        Test this FAQ Question →
                      </button>
                    </div>
                    <h4 className="font-bold text-sm text-white mb-1.5">{faq.question}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
            </div>
          )}

          {/* TICKETS TAB */}
          {activeTab === "tickets" && (
            <div className="space-y-3">
              {data.tickets.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No support tickets created yet.
                </div>
              ) : (
                data.tickets
                  .filter(t => 
                    t.ticketId.toLowerCase().includes(search.toLowerCase()) ||
                    t.issueCategory.toLowerCase().includes(search.toLowerCase()) ||
                    t.issueDescription.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((t) => (
                    <div
                      key={t.ticketId}
                      className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-indigo-300 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/60">
                            #{t.ticketId}
                          </span>
                          <span className="font-semibold text-xs text-white">{t.issueCategory}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            {t.priority}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-1">{t.issueDescription}</p>
                        {t.orderId && (
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Order Ref: <span className="font-mono text-cyan-300">{t.orderId}</span>
                          </p>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 sm:text-right">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium block sm:inline-block">
                          {t.status}
                        </span>
                        <div className="text-[10px] text-slate-500 mt-1">
                          {new Date(t.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </div>
          )}

          {/* ESCALATIONS TAB */}
          {activeTab === "escalations" && (
            <div className="space-y-3">
              {data.escalations.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No active human escalations logged.
                </div>
              ) : (
                data.escalations
                  .filter(e => 
                    e.escalationId.toLowerCase().includes(search.toLowerCase()) ||
                    e.reason.toLowerCase().includes(search.toLowerCase()) ||
                    e.issueSummary.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((e) => (
                    <div
                      key={e.escalationId}
                      className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 flex flex-col gap-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ShieldAlert className="w-4 h-4 text-rose-400" />
                          <span className="font-mono font-bold text-xs text-rose-300">
                            #{e.escalationId}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                            {e.status}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {new Date(e.escalatedAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-rose-200">
                        Reason: <span className="font-normal text-slate-300">{e.reason}</span>
                      </p>
                      <p className="text-xs text-slate-300">
                        Summary: {e.issueSummary}
                      </p>
                      <p className="text-[11px] text-slate-400 pt-1 border-t border-rose-900/40">
                        Assigned Queue: <strong className="text-slate-200">{e.assignedAgent || "Senior Support Tier"}</strong>
                      </p>
                    </div>
                  ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
