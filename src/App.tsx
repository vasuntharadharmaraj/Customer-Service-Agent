/**
 * SmartServe AI - Agentic Customer Support Assistant
 * Main Application Component
 */

import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { ChatWindow } from "./components/ChatWindow";
import { AgentActivityPanel } from "./components/AgentActivityPanel";
import { ContextCards } from "./components/ContextCards";
import { DatabaseModal } from "./components/DatabaseModal";
import { AcademicModal } from "./components/AcademicModal";
import { Message, AgentActivity, DatabaseState } from "./types";

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg-init",
      role: "assistant",
      content: "Hello! I am **SmartServe AI**, an agentic customer support assistant for TechMart Online.\n\nI dynamically reason about customer inquiries, inspect order logistics, verify warranty & return eligibility, file priority support tickets, and escalate to human supervisors when necessary.\n\nHow can I help you today? You can type your request or click one of the quick test queries above!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentActivity, setCurrentActivity] = useState<AgentActivity | null>(null);
  const [activeOrderId, setActiveOrderId] = useState<string | undefined>(undefined);
  const [databaseState, setDatabaseState] = useState<DatabaseState | null>(null);
  const [isDatabaseOpen, setIsDatabaseOpen] = useState(false);
  const [isAcademicOpen, setIsAcademicOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Load database snapshot on initial mount
  useEffect(() => {
    fetchDatabaseState();
  }, []);

  const fetchDatabaseState = async () => {
    try {
      const res = await fetch("/api/database");
      if (res.ok) {
        const data = await res.json();
        setDatabaseState(data);
      }
    } catch (err) {
      console.error("Failed to fetch database state:", err);
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessageId = `msg-${Date.now()}`;
    const userTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newUserMsg: Message = {
      id: userMessageId,
      role: "user",
      content: text,
      timestamp: userTimestamp
    };

    // Optimistically update message list
    const updatedMessages = [...messages, newUserMsg];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      // Format history for agent
      const historyPayload = messages.map(m => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: historyPayload,
          activeOrderId
        })
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data = await res.json();
      const botMessageId = `msg-bot-${Date.now()}`;
      const botTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const newBotMsg: Message = {
        id: botMessageId,
        role: "assistant",
        content: data.reply,
        timestamp: botTimestamp,
        activity: data.activity
      };

      setMessages(prev => [...prev, newBotMsg]);
      setCurrentActivity(data.activity);

      if (data.activeOrderId) {
        setActiveOrderId(data.activeOrderId);
      }

      // If tickets or escalations were created, refresh DB state
      if (data.activity?.createdTickets?.length > 0 || data.activity?.isEscalated) {
        fetchDatabaseState();
      }
    } catch (error: any) {
      console.error("Chat error:", error);
      const errorMsg: Message = {
        id: `msg-err-${Date.now()}`,
        role: "assistant",
        content: "I encountered a communication issue while processing your request. Please try again or rephrase your inquiry.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearConversation = () => {
    setMessages([]);
    setCurrentActivity(null);
    setActiveOrderId(undefined);
  };

  const handleResetData = async () => {
    setIsResetting(true);
    try {
      const res = await fetch("/api/reset", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setDatabaseState(data);
        handleClearConversation();
        setMessages([
          {
            id: `msg-reset-${Date.now()}`,
            role: "assistant",
            content: "Simulation database and conversation state have been reset to factory defaults. Ready for a new customer support interaction!",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
    } catch (err) {
      console.error("Reset failed:", err);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-white">
      {/* Top Application Header */}
      <Header
        onOpenDatabase={() => setIsDatabaseOpen(true)}
        onOpenAcademic={() => setIsAcademicOpen(true)}
        onResetData={handleResetData}
        isResetting={isResetting}
        activeOrderId={activeOrderId}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 min-h-[calc(100vh-70px)]">
        {/* Left Column: Interactive Chat Interface (7 cols on desktop) */}
        <div className="lg:col-span-7 flex flex-col h-[650px] lg:h-[calc(100vh-105px)]">
          <ChatWindow
            messages={messages}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
            onClearConversation={handleClearConversation}
            onSelectActivity={(act) => setCurrentActivity(act)}
            currentActivity={currentActivity}
          />
        </div>

        {/* Right Column: Agent Activity Panel + Contextual Cards (5 cols on desktop) */}
        <div className="lg:col-span-5 flex flex-col gap-4 h-[650px] lg:h-[calc(100vh-105px)] overflow-y-auto no-scrollbar">
          {/* Contextual Artifacts (Order Card, Product Card, Ticket, Escalation Alert) */}
          <ContextCards
            activity={currentActivity}
            onSelectQuery={handleSendMessage}
          />

          {/* Primary Agent Activity & Reasoning Panel */}
          <div className="flex-1 min-h-[380px]">
            <AgentActivityPanel
              activity={currentActivity}
              isLoading={isLoading}
            />
          </div>
        </div>
      </main>

      {/* Modals */}
      <DatabaseModal
        isOpen={isDatabaseOpen}
        onClose={() => setIsDatabaseOpen(false)}
        data={databaseState}
        onSelectQuery={handleSendMessage}
      />

      <AcademicModal
        isOpen={isAcademicOpen}
        onClose={() => setIsAcademicOpen(false)}
      />
    </div>
  );
}
