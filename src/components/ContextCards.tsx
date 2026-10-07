import React from "react";
import { 
  Package, 
  Truck, 
  Calendar, 
  MapPin, 
  CheckCircle, 
  XCircle, 
  Ticket, 
  ShieldAlert, 
  Laptop, 
  Tag, 
  Clock,
  ExternalLink
} from "lucide-react";
import { AgentActivity } from "../types";

interface ContextCardsProps {
  activity: AgentActivity | null;
  onSelectQuery?: (query: string) => void;
}

export const ContextCards: React.FC<ContextCardsProps> = ({ activity, onSelectQuery }) => {
  if (!activity) return null;

  const hasOrder = Boolean(activity.orderInfo);
  const hasProduct = Boolean(activity.productInfo);
  const hasTickets = activity.createdTickets && activity.createdTickets.length > 0;
  const hasEscalation = activity.isEscalated && Boolean(activity.escalationDetails);

  if (!hasOrder && !hasProduct && !hasTickets && !hasEscalation) {
    return null;
  }

  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case "Delivered":
        return <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Delivered</span>;
      case "Shipped":
      case "In Transit":
        return <span className="px-2 py-0.5 rounded text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">In Transit</span>;
      case "Out for Delivery":
        return <span className="px-2 py-0.5 rounded text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 animate-pulse">Out for Delivery</span>;
      case "Processing":
        return <span className="px-2 py-0.5 rounded text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">Processing</span>;
      case "Cancelled":
        return <span className="px-2 py-0.5 rounded text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">Cancelled</span>;
      case "Returned":
        return <span className="px-2 py-0.5 rounded text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">Returned</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-xs font-semibold bg-slate-700 text-slate-300">{status}</span>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "Critical":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40">Critical</span>;
      case "High":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-500/20 text-orange-400 border border-orange-500/40">High</span>;
      case "Medium":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">Medium</span>;
      case "Low":
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-700 text-slate-300">Low</span>;
    }
  };

  return (
    <div className="space-y-3">
      {/* 1. Human Escalation Alert Banner */}
      {hasEscalation && activity.escalationDetails && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-rose-950/60 to-slate-900 border border-rose-500/40 shadow-lg shadow-rose-950/20">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30 shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-rose-200">
                    Human Representative Escalation Logged
                  </h4>
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-rose-900/60 text-rose-300 border border-rose-700/50">
                    #{activity.escalationDetails.escalationId}
                  </span>
                </div>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
                  {activity.escalationDetails.status}
                </span>
              </div>

              <p className="text-xs text-rose-100/90 mt-1.5 leading-relaxed">
                <span className="font-semibold text-rose-200">Reason:</span> {activity.escalationDetails.reason}
              </p>
              
              <div className="flex flex-wrap items-center gap-4 mt-2 text-[11px] text-slate-400 pt-2 border-t border-rose-900/40">
                <span>Assigned: <strong className="text-slate-200">{activity.escalationDetails.assignedAgent || "Senior Support Specialist"}</strong></span>
                {activity.escalationDetails.escalatedAt && (
                  <span>Logged: <strong className="text-slate-200">{new Date(activity.escalationDetails.escalatedAt).toLocaleTimeString()}</strong></span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Order Information Card */}
      {hasOrder && activity.orderInfo && (
        <div className="p-4 rounded-xl bg-slate-850 border border-slate-700 shadow-md">
          <div className="flex items-center justify-between pb-3 border-b border-slate-700/70">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                Order Record
              </span>
              <span className="font-mono font-bold text-sm text-white px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                {activity.orderInfo.orderId}
              </span>
            </div>
            <div>{getOrderStatusBadge(activity.orderInfo.orderStatus)}</div>
          </div>

          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Item / Product:</span>
              <span className="font-semibold text-slate-100">{activity.orderInfo.product}</span>
            </div>

            <div>
              <span className="text-slate-400 block text-[11px] flex items-center gap-1">
                <Calendar className="w-3 h-3 text-indigo-400" /> Estimated Delivery:
              </span>
              <span className="font-semibold text-slate-100">{activity.orderInfo.estimatedDeliveryDate}</span>
            </div>

            {activity.orderInfo.carrier && (
              <div>
                <span className="text-slate-400 block text-[11px] flex items-center gap-1">
                  <Truck className="w-3 h-3 text-cyan-400" /> Carrier & Tracking:
                </span>
                <span className="font-mono text-slate-300">
                  {activity.orderInfo.carrier} ({activity.orderInfo.trackingNumber || "N/A"})
                </span>
              </div>
            )}

            {activity.orderInfo.deliveryAddress && (
              <div>
                <span className="text-slate-400 block text-[11px] flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-emerald-400" /> Destination:
                </span>
                <span className="text-slate-300 truncate block">{activity.orderInfo.deliveryAddress}</span>
              </div>
            )}
          </div>

          {onSelectQuery && (
            <div className="mt-3 pt-2.5 border-t border-slate-700/60 flex items-center gap-2 text-[11px]">
              <span className="text-slate-400">Quick Actions:</span>
              <button
                onClick={() => onSelectQuery(`Can I return order ${activity.orderInfo?.orderId}?`)}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 transition cursor-pointer"
              >
                Check Return Eligibility
              </button>
              <button
                onClick={() => onSelectQuery(`When will order ${activity.orderInfo?.orderId} arrive?`)}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition cursor-pointer"
              >
                Delivery Timeline
              </button>
            </div>
          )}
        </div>
      )}

      {/* 3. Product Information Card */}
      {hasProduct && activity.productInfo && (
        <div className="p-4 rounded-xl bg-slate-850 border border-slate-700 shadow-md">
          <div className="flex items-center justify-between pb-3 border-b border-slate-700/70">
            <div className="flex items-center gap-2">
              <Laptop className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                Product Catalog Specs
              </span>
            </div>
            <div className="font-bold text-sm text-emerald-400">{activity.productInfo.price}</div>
          </div>

          <div className="mt-3">
            <h4 className="font-bold text-sm text-white">{activity.productInfo.productName}</h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">{activity.productInfo.description}</p>
            
            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs">
              <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">
                Availability: <strong className="text-emerald-300">{activity.productInfo.availability}</strong>
              </span>
              {activity.productInfo.warranty && (
                <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">
                  {activity.productInfo.warranty}
                </span>
              )}
            </div>

            {activity.productInfo.specifications && (
              <div className="mt-3 pt-2.5 border-t border-slate-700/60">
                <span className="text-[11px] uppercase font-bold text-slate-400 block mb-1">
                  Key Specifications:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
                  {Object.entries(activity.productInfo.specifications).slice(0, 4).map(([k, v]) => (
                    <div key={k} className="text-slate-300">
                      <span className="text-slate-400">{k}:</span> {v}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. Support Tickets Created Card */}
      {hasTickets && (
        <div className="p-4 rounded-xl bg-slate-850 border border-slate-700 shadow-md">
          <div className="flex items-center gap-2 pb-2.5 border-b border-slate-700/70">
            <Ticket className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">
              Official Support Ticket Generated
            </span>
          </div>

          <div className="mt-2.5 space-y-2">
            {activity.createdTickets.map((t, idx) => (
              <div key={idx} className="p-3 bg-slate-800 rounded-lg border border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-indigo-300 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/50">
                      #{t.ticketId}
                    </span>
                    <span className="font-semibold text-xs text-white">{t.issueCategory}</span>
                    {getPriorityBadge(t.priority)}
                  </div>
                  {t.orderId && t.orderId !== "N/A" && (
                    <div className="text-[11px] text-slate-400 mt-1">
                      Associated Order: <span className="font-mono text-cyan-300">{t.orderId}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                    Status: {t.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
