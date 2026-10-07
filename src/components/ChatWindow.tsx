import React, { useState, useRef, useEffect } from "react";
import { 
  Send, 
  Trash2, 
  Bot, 
  User, 
  Sparkles, 
  Zap, 
  CheckCircle2, 
  ShieldAlert, 
  CornerDownLeft,
  MessageSquare
} from "lucide-react";
import { Message, AgentActivity } from "../types";

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (text: string) => void;
  onClearConversation: () => void;
  onSelectActivity: (activity: AgentActivity) => void;
  currentActivity: AgentActivity | null;
}

const SAMPLE_TEST_QUERIES = [
  { label: "1. Track Order ORD1001", query: "Where is my order ORD1001?" },
  { label: "2. Check Delivery Arrival (Memory)", query: "When will my order arrive?" },
  { label: "3. X200 Headphones Specs", query: "Tell me about the X200 headphones." },
  { label: "4. Return Eligibility (ORD1005)", query: "Can I return order ORD1005?" },
  { label: "5. Damaged Product Claim", query: "I received a damaged product and want a refund." },
  { label: "6. Request Refund", query: "I want a refund for my order." },
  { label: "7. File Complaint Ticket", query: "Create a complaint for my order." },
  { label: "8. Angry Sentiment / Escalation", query: "Your service is terrible and nobody is helping me!" },
  { label: "9. Human Agent Request", query: "Talk to a human agent right now." },
  { label: "10. Return Policy (FAQ)", query: "What is your return policy?" },
];

export const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  isLoading,
  onSendMessage,
  onClearConversation,
  onSelectActivity,
  currentActivity
}) => {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim());
    setInput("");
  };

  const handleQueryClick = (query: string) => {
    if (isLoading) return;
    onSendMessage(query);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-xl flex flex-col h-full">
      {/* Chat Header */}
      <div className="px-4 py-3 bg-slate-850 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">
              Customer Support Conversation
            </h3>
            <p className="text-[11px] text-slate-400">
              Interactive session with multi-turn memory & tool groundings
            </p>
          </div>
        </div>

        <button
          onClick={onClearConversation}
          disabled={messages.length === 0}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-transparent hover:border-slate-700 transition disabled:opacity-40 cursor-pointer"
          title="Clear current conversation history"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Chat</span>
        </button>
      </div>

      {/* Suggested Quick Test Queries Bar */}
      <div className="px-4 py-2.5 bg-slate-950/70 border-b border-slate-800/80 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 min-w-max">
          <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            Quick Test Queries:
          </span>
          {SAMPLE_TEST_QUERIES.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleQueryClick(item.query)}
              disabled={isLoading}
              className="text-[11px] px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-indigo-900/40 text-slate-300 hover:text-cyan-200 border border-slate-700/70 hover:border-indigo-600/50 transition cursor-pointer disabled:opacity-50"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
            <div className="w-12 h-12 rounded-2xl bg-indigo-950/60 border border-indigo-800/50 text-indigo-400 flex items-center justify-center mb-3">
              <Bot className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-200">Welcome to SmartServe AI</h4>
            <p className="text-xs text-slate-400 max-w-md mt-1 leading-relaxed">
              Ask about an order status, product specifications, return conditions, or try challenging scenarios like angry messages and human escalation requests.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 max-w-lg w-full text-left text-xs">
              <div 
                onClick={() => handleQueryClick("Where is my order ORD1001?")}
                className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60 hover:border-indigo-500/50 cursor-pointer transition text-slate-300"
              >
                <strong className="text-cyan-300 block mb-0.5">📦 Order Tracking</strong>
                "Where is my order ORD1001?"
              </div>
              <div 
                onClick={() => handleQueryClick("Tell me about the X200 headphones.")}
                className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60 hover:border-indigo-500/50 cursor-pointer transition text-slate-300"
              >
                <strong className="text-indigo-300 block mb-0.5">🎧 Product Specs</strong>
                "Tell me about the X200 headphones."
              </div>
              <div 
                onClick={() => handleQueryClick("Can I return order ORD1005?")}
                className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60 hover:border-indigo-500/50 cursor-pointer transition text-slate-300"
              >
                <strong className="text-emerald-300 block mb-0.5">🔄 Return Check</strong>
                "Can I return order ORD1005?"
              </div>
              <div 
                onClick={() => handleQueryClick("Your service is terrible and nobody is helping me!")}
                className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60 hover:border-rose-500/50 cursor-pointer transition text-slate-300"
              >
                <strong className="text-rose-300 block mb-0.5">🚨 Escalation & Sentiment</strong>
                "Your service is terrible and nobody is helping me!"
              </div>
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
              >
                {/* Assistant Avatar */}
                {!isUser && (
                  <div className="w-8 h-8 rounded-lg bg-indigo-600/30 text-indigo-400 border border-indigo-500/40 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                {/* Message Bubble */}
                <div className={`max-w-[85%] md:max-w-[78%] space-y-2`}>
                  <div
                    className={`p-3.5 rounded-2xl text-xs md:text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${
                      isUser
                        ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-tr-xs"
                        : "bg-slate-800 text-slate-200 border border-slate-700/80 rounded-tl-xs"
                    }`}
                  >
                    {msg.content}
                  </div>

                  {/* Inline Tool Execution Indicator for Assistant Messages */}
                  {!isUser && msg.activity && (
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                      {msg.activity.toolSteps.length > 0 ? (
                        <>
                          <button
                            onClick={() => msg.activity && onSelectActivity(msg.activity)}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-950/60 text-indigo-300 border border-indigo-800/60 hover:bg-indigo-900/60 transition cursor-pointer font-medium"
                            title="Click to view tool step details in Agent Activity Panel"
                          >
                            <Zap className="w-3 h-3 text-cyan-400" />
                            <span>Tools Used: {msg.activity.toolSteps.map(s => s.tool).join(", ")}</span>
                          </button>
                        </>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-400 border border-slate-700/80">
                          Direct Response (No tool needed)
                        </span>
                      )}

                      {msg.activity.isEscalated && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/40 font-semibold">
                          <ShieldAlert className="w-3 h-3" /> Escalated
                        </span>
                      )}

                      <span className="text-[10px] text-slate-500 ml-auto">
                        {msg.timestamp}
                      </span>
                    </div>
                  )}

                  {isUser && (
                    <div className="text-[10px] text-slate-500 text-right">
                      {msg.timestamp}
                    </div>
                  )}
                </div>

                {/* User Avatar */}
                {isUser && (
                  <div className="w-8 h-8 rounded-lg bg-slate-700 text-slate-300 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* Loading / Agent Reasoning indicator */}
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/30 text-indigo-400 border border-indigo-500/40 flex items-center justify-center shrink-0 mt-0.5 animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3.5 rounded-2xl rounded-tl-xs bg-slate-800 border border-slate-700/80 text-slate-300 text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              <span className="font-medium text-slate-300">
                Agent is analyzing intent and executing tool actions...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-3 bg-slate-850 border-t border-slate-800">
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 focus-within:border-indigo-500 transition shadow-inner">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your customer support inquiry (e.g., Where is ORD1001?)..."
            disabled={isLoading}
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-40 disabled:hover:bg-indigo-600 transition shadow-sm cursor-pointer"
            title="Send Message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
