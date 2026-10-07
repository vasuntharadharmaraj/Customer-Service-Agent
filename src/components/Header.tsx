import React from "react";
import { Bot, Database, BookOpen, RotateCcw, Sparkles } from "lucide-react";

interface HeaderProps {
  onOpenDatabase: () => void;
  onOpenAcademic: () => void;
  onResetData: () => void;
  isResetting: boolean;
  activeOrderId?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenDatabase,
  onOpenAcademic,
  onResetData,
  isResetting,
  activeOrderId
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 px-4 lg:px-6 py-3.5 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand & Subtitle */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-white/20">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                SMARTSERVE AI
              </h1>
              <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Agentic Engine
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Autonomous Customer Support with Dynamic Function & Tool Calling
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          {activeOrderId && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-slate-400">Active Session Order:</span>
              <span className="font-mono font-semibold text-cyan-300">{activeOrderId}</span>
            </div>
          )}

          <button
            onClick={onOpenDatabase}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 transition shadow-sm font-medium cursor-pointer"
            title="Inspect Simulated Database: Orders, Products, FAQs, Tickets"
          >
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <span>Database Explorer</span>
          </button>

          <button
            onClick={onOpenAcademic}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-950/60 hover:bg-indigo-900/60 text-indigo-200 border border-indigo-700/50 transition shadow-sm font-medium cursor-pointer"
            title="View Academic Project Documentation & Architecture"
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
            <span>About Project (MCA)</span>
          </button>

          <button
            onClick={onResetData}
            disabled={isResetting}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition disabled:opacity-50 cursor-pointer"
            title="Reset simulation data to default state"
          >
            <RotateCcw className={`w-3.5 h-3.5 text-slate-400 ${isResetting ? "animate-spin" : ""}`} />
            <span>Reset Data</span>
          </button>
        </div>
      </div>
    </header>
  );
};
