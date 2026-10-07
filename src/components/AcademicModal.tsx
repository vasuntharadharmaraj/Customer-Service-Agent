import React from "react";
import { 
  X, 
  BookOpen, 
  Cpu, 
  Workflow, 
  Zap, 
  ShieldCheck, 
  Database, 
  GitBranch, 
  Bot, 
  BrainCircuit,
  Layers,
  ArrowRight
} from "lucide-react";

interface AcademicModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AcademicModal: React.FC<AcademicModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-850 rounded-2xl w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-850 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">
                MCA Academic Project Documentation & Architecture
              </h3>
              <p className="text-xs text-slate-400">
                Agentic Customer Support Assistant utilizing Gemini Function & Tool Calling
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

        {/* Content Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 text-slate-300 text-xs sm:text-sm leading-relaxed">
          {/* Abstract */}
          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-2">
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-cyan-400" />
              1. Project Abstract & Core Motivation
            </h4>
            <p className="text-slate-300 leading-relaxed text-xs sm:text-sm">
              Traditional customer-support chatbots rely on static pattern matching or purely ungrounded generative text, frequently causing hallucinations (inventing non-existent tracking numbers, hallucinating delivery dates, or falsely promising refunds). 
              <strong> SmartServe AI</strong> represents an <strong>Agentic AI</strong> architecture. Powered by Google Gemini and real-time Function Calling, the system analyzes customer intent, formulates an execution plan, selectively invokes deterministic backend tools (database queries, eligibility assessments, sentiment analysis, ticket creation), and incorporates verified ground truths into the final synthesized response.
            </p>
          </div>

          {/* Academic Concepts Grid */}
          <div>
            <h4 className="font-bold text-sm text-white mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              2. Key Computational & AI Concepts Demonstrated
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                <span className="font-bold text-xs text-cyan-300 block">Agentic AI vs Static Chatbots</span>
                <p className="text-xs text-slate-400">
                  Unlike passive chatbots that only produce conversational tokens, an agent possesses autonomous decision-making: it assesses whether tools are needed, chains multiple actions, evaluates outputs, and updates environmental state.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                <span className="font-bold text-xs text-indigo-300 block">Function & Tool Calling</span>
                <p className="text-xs text-slate-400">
                  Declarative JSON Schema functions exposed to the LLM. The model returns structured arguments (e.g., <code className="text-cyan-200">get_order_status(order_id)</code>) rather than natural language text, delegating deterministic compute to the host runtime.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                <span className="font-bold text-xs text-emerald-300 block">Conversational Memory</span>
                <p className="text-xs text-slate-400">
                  Context preservation across multi-turn interactions. If a customer mentions <code className="text-emerald-200">ORD1024</code>, subsequent implicit queries ("When will it arrive?" or "Can I return it?") resolve reference pronouns accurately.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                <span className="font-bold text-xs text-amber-300 block">Multi-Tool Reasoning Loops</span>
                <p className="text-xs text-slate-400">
                  Chaining sequential operations: Analyzing sentiment → validating order delivery date → executing return policy checks → filing an official support ticket → escalating to human queues.
                </p>
              </div>
            </div>
          </div>

          {/* Agent Architecture Workflow */}
          <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-800/40 space-y-3">
            <h4 className="font-bold text-sm text-indigo-200 flex items-center gap-2">
              <Workflow className="w-4 h-4 text-indigo-400" />
              3. The 6-Stage Agent Execution Pipeline
            </h4>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">1</span>
                <div>
                  <strong className="text-slate-200">Customer Intent Classification:</strong> Natural language input is ingested alongside conversational memory history to identify user objectives.
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">2</span>
                <div>
                  <strong className="text-slate-200">Tool Selection Decision:</strong> The model decides whether to answer directly (greetings/chit-chat) or select one or more specialized tools from the registry.
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">3</span>
                <div>
                  <strong className="text-slate-200">Deterministic Tool Invocation:</strong> Host runtime executes verified routines on the database (order lookups, return eligibility checks, ticket creation).
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">4</span>
                <div>
                  <strong className="text-slate-200">Multi-Turn Tool Chaining:</strong> Tool outputs are fed back to the model turn. If additional actions are needed (e.g. creating ticket after return failure), subsequent tools are invoked.
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">5</span>
                <div>
                  <strong className="text-slate-200">Human Escalation Protocol:</strong> High customer frustration, legal threats, or complex edge cases trigger explicit human supervisor handover.
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">6</span>
                <div>
                  <strong className="text-slate-200">Grounded Natural Language Synthesis:</strong> Final customer response is formatted clearly, strictly utilizing factual results from tool steps.
                </div>
              </div>
            </div>
          </div>

          {/* Tools Table */}
          <div>
            <h4 className="font-bold text-sm text-white mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              4. Complete Registered Tool Registry
            </h4>
            <div className="overflow-x-auto rounded-xl border border-slate-700/80">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-800 text-slate-300 font-semibold border-b border-slate-700">
                  <tr>
                    <th className="p-2.5">Function Name</th>
                    <th className="p-2.5">Parameters</th>
                    <th className="p-2.5">Simulated Purpose</th>
                    <th className="p-2.5">Return Data</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-slate-850 text-slate-300">
                  <tr>
                    <td className="p-2.5 font-mono text-cyan-300">search_faq</td>
                    <td className="p-2.5 font-mono text-slate-400">query: string</td>
                    <td className="p-2.5">Search policy knowledge base</td>
                    <td className="p-2.5">Top matching FAQ articles & answers</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-mono text-cyan-300">get_order_status</td>
                    <td className="p-2.5 font-mono text-slate-400">order_id: string</td>
                    <td className="p-2.5">Fetch real-time delivery status</td>
                    <td className="p-2.5">Status, product, delivery date, carrier</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-mono text-cyan-300">get_product_info</td>
                    <td className="p-2.5 font-mono text-slate-400">product_name: string</td>
                    <td className="p-2.5">Query hardware specifications</td>
                    <td className="p-2.5">Price, stock status, specs, warranty</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-mono text-cyan-300">check_return_eligibility</td>
                    <td className="p-2.5 font-mono text-slate-400">order_id: string</td>
                    <td className="p-2.5">Evaluate 30-day return policy</td>
                    <td className="p-2.5">Eligible boolean, policy reason, next steps</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-mono text-cyan-300">create_support_ticket</td>
                    <td className="p-2.5 font-mono text-slate-400">issue: string, priority</td>
                    <td className="p-2.5">File formal customer complaint</td>
                    <td className="p-2.5">Ticket ID, category, priority, status</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-mono text-cyan-300">escalate_to_human</td>
                    <td className="p-2.5 font-mono text-slate-400">issue_summary: string</td>
                    <td className="p-2.5">Assign case to human specialist</td>
                    <td className="p-2.5">Escalation Ref ID, reason, queue status</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-mono text-cyan-300">analyze_sentiment</td>
                    <td className="p-2.5 font-mono text-slate-400">customer_message: string</td>
                    <td className="p-2.5">Assess emotional state</td>
                    <td className="p-2.5">Positive / Neutral / Negative / Angry</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Academic Simulation Notice */}
          <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 text-xs text-slate-400">
            <strong className="text-slate-300 block mb-1">Academic Demonstration Notice:</strong>
            This system runs against a simulated local dataset consisting of 16 customer orders, 12 products, 16 FAQs, and active support queues. No live credit card or external proprietary enterprise APIs are required.
          </div>
        </div>
      </div>
    </div>
  );
};
