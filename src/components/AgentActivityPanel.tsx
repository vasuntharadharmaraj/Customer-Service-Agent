import React, { useState } from "react";
import { 
  Activity, 
  Terminal, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp, 
  Cpu, 
  Smile, 
  Meh, 
  Frown, 
  Flame, 
  ArrowRight,
  ShieldAlert,
  Zap,
  Info
} from "lucide-react";
import { AgentActivity, ToolExecutionStep } from "../types";

interface AgentActivityPanelProps {
  activity: AgentActivity | null;
  isLoading: boolean;
}

export const AgentActivityPanel: React.FC<AgentActivityPanelProps> = ({ activity, isLoading }) => {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  const toggleStep = (idx: number) => {
    setExpandedStep(expandedStep === idx ? null : idx);
  };

  const getSentimentBadge = (sentiment: AgentActivity["sentiment"]) => {
    switch (sentiment) {
      case "Positive":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <Smile className="w-3.5 h-3.5" /> Positive
          </span>
        );
      case "Negative":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Frown className="w-3.5 h-3.5" /> Negative
          </span>
        );
      case "Angry":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/40 animate-pulse">
            <Flame className="w-3.5 h-3.5 text-rose-400" /> Angry (Escalation Trigger)
          </span>
        );
      case "Neutral":
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-700/60 text-slate-300 border border-slate-600">
            <Meh className="w-3.5 h-3.5" /> Neutral
          </span>
        );
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-xl flex flex-col h-full">
      {/* Panel Header */}
      <div className="px-4 py-3 bg-slate-850 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide">
              AGENT ACTIVITY & REASONING PANEL
            </h2>
            <p className="text-[11px] text-slate-400">
              Live inspection of agentic intent, tool execution & decision loops
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping"></span>
            <span className="font-medium animate-pulse">Agent Reasoning...</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>Agent Ready</span>
          </div>
        )}
      </div>

      {/* Main Body */}
      <div className="p-4 flex-1 overflow-y-auto space-y-4">
        {!activity ? (
          <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-6 text-slate-400">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500 mb-3">
              <Activity className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-slate-300">No Agent Activity Recorded Yet</p>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">
              Send a customer message or select a sample query to observe the Gemini agent's tool-selection and execution pipeline.
            </p>
            <div className="mt-4 p-3 bg-slate-800/60 rounded-lg border border-slate-700/60 text-left text-xs space-y-1.5 max-w-xs">
              <div className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-cyan-400" />
                Demonstration Workflow:
              </div>
              <p className="text-slate-400 text-[11px]">
                1. Customer sends intent-driven query<br />
                2. Model evaluates intent & selects tool(s)<br />
                3. Server executes function on simulated DB<br />
                4. Agent processes result and formulates answer
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Top Cards: Intent, Sentiment, Tool Selected, Final Action */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Intent Card */}
              <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700">
                <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-1">
                  Detected Intent
                </div>
                <div className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                  {activity.intent}
                </div>
              </div>

              {/* Sentiment Card */}
              <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700">
                <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-1">
                  Customer Sentiment
                </div>
                <div>{getSentimentBadge(activity.sentiment)}</div>
              </div>
            </div>

            {/* Tool Selected & Final Action Banner */}
            <div className="p-3.5 bg-indigo-950/30 rounded-lg border border-indigo-800/40 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-[11px] uppercase tracking-wider font-semibold text-indigo-300">
                    Tool Selected
                  </div>
                  <div className="text-sm font-mono font-bold text-cyan-300 mt-0.5 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-cyan-400" />
                    {activity.toolSelected}
                  </div>
                </div>

                {activity.isEscalated && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/40">
                    <ShieldAlert className="w-3.5 h-3.5" /> Escalated to Human
                  </span>
                )}
              </div>

              <div className="pt-2 border-t border-indigo-900/60">
                <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">
                  Final Action Taken
                </div>
                <div className="text-xs text-slate-200 font-medium mt-0.5 flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{activity.finalAction}</span>
                </div>
              </div>
            </div>

            {/* Step-by-Step Tool Trace */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                  Execution Steps ({activity.toolSteps.length})
                </div>
                {activity.toolSteps.length > 0 && (
                  <span className="text-[10px] text-slate-400">
                    Click step to inspect function arguments & payloads
                  </span>
                )}
              </div>

              {activity.toolSteps.length === 0 ? (
                <div className="p-3 bg-slate-800/40 rounded-lg border border-dashed border-slate-700 text-xs text-slate-400 text-center">
                  Direct AI response generated without requiring tool execution.
                </div>
              ) : (
                <div className="space-y-2">
                  {activity.toolSteps.map((step, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-800/90 rounded-lg border border-slate-700/80 overflow-hidden transition"
                    >
                      {/* Step Header */}
                      <button
                        onClick={() => toggleStep(idx)}
                        className="w-full px-3 py-2.5 flex items-center justify-between text-left hover:bg-slate-750 transition cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-slate-700 text-slate-300 text-xs flex items-center justify-center font-bold">
                            {idx + 1}
                          </span>
                          <span className="font-mono text-xs font-bold text-cyan-300">
                            {step.tool}()
                          </span>
                          <span className="text-[11px] text-slate-400 font-sans truncate max-w-[200px] sm:max-w-xs">
                            – {step.summary}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {step.status === "success" ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400">
                              <CheckCircle2 className="w-3 h-3" /> Success
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-400">
                              <AlertTriangle className="w-3 h-3" /> Error
                            </span>
                          )}
                          {expandedStep === idx ? (
                            <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                          )}
                        </div>
                      </button>

                      {/* Expandable JSON Inspector */}
                      {expandedStep === idx && (
                        <div className="px-3 py-2.5 bg-slate-950/80 border-t border-slate-800 text-xs font-mono space-y-2.5">
                          <div>
                            <div className="text-[10px] uppercase font-bold text-indigo-400 mb-1">
                              Input Arguments:
                            </div>
                            <pre className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-300 overflow-x-auto text-[11px]">
                              {JSON.stringify(step.input, null, 2)}
                            </pre>
                          </div>
                          <div>
                            <div className="text-[10px] uppercase font-bold text-emerald-400 mb-1">
                              Database / Tool Result:
                            </div>
                            <pre className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-300 overflow-x-auto text-[11px] max-h-48">
                              {JSON.stringify(step.result, null, 2)}
                            </pre>
                          </div>
                          <div className="text-[10px] text-slate-500 font-sans flex justify-between">
                            <span>Executed at {step.timestamp}</span>
                            <span>Status: {step.status}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* High-level Safe Summary */}
            <div className="p-3 bg-slate-800/40 rounded-lg border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <span className="font-semibold text-slate-300">Agentic Safeguards:</span>
              <p>
                Strict tool grounding active. Model cannot fabricate orders or delivery dates; all data is verified against the local enterprise database.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
