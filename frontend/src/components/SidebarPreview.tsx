import { MessageSquare, Clock, Archive } from "lucide-react";
import { cn } from "../lib/utils";

const mockChats = [
  { id: 1, title: "Market Analysis Q4", time: "2m ago", active: true },
  { id: 2, title: "Brand Strategy Review", time: "1h ago", active: false },
  { id: 3, title: "Competitor Deep Dive", time: "3h ago", active: false },
];

export const SidebarPreview = () => {
  return (
    <div 
      className="w-64 backdrop-blur-md rounded-2xl p-4 space-y-6"
      style={{ 
        backgroundColor: "rgba(17, 24, 39, 0.5)",
        borderWidth: "1px",
        borderColor: "rgba(30, 58, 95, 0.5)"
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div 
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #0ea5e9, #a855f7)" }}
        >
          <span className="text-sm font-bold" style={{ color: "#0a0f1a" }}>P</span>
        </div>
        <span className="font-semibold" style={{ color: "#e8edf5", fontFamily: "var(--font-display)" }}>
          Prompt Codex
        </span>
      </div>

      {/* Active Chats */}
      <div>
        <div className="flex items-center gap-2 text-xs mb-3" style={{ color: "#94a3b8" }}>
          <MessageSquare className="w-3 h-3" />
          <span className="uppercase tracking-wider">Active Chats</span>
        </div>
        <div className="space-y-1">
          {mockChats.map((chat) => (
            <button
              key={chat.id}
              className={cn(
                "w-full flex items-center gap-3 p-2 rounded-lg text-left transition-all"
              )}
              style={{
                backgroundColor: chat.active ? "rgba(14, 165, 233, 0.1)" : "transparent",
                borderWidth: chat.active ? "1px" : "0",
                borderColor: chat.active ? "rgba(14, 165, 233, 0.3)" : "transparent",
              }}
            >
              <div
                className="w-2 h-2 rounded-full shrink-0"
                style={{ 
                  backgroundColor: chat.active ? "#2dd4bf" : "rgba(148, 163, 184, 0.3)" 
                }}
              />
              <div className="flex-1 min-w-0">
                <p 
                  className="text-sm font-medium truncate"
                  style={{ color: "#e8edf5" }}
                >
                  {chat.title}
                </p>
                <p className="text-xs flex items-center gap-1" style={{ color: "#94a3b8" }}>
                  <Clock className="w-3 h-3" />
                  {chat.time}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Archived */}
      <div>
        <div className="flex items-center gap-2 text-xs mb-3" style={{ color: "#94a3b8" }}>
          <Archive className="w-3 h-3" />
          <span className="uppercase tracking-wider">Archived</span>
        </div>
        <p className="text-xs italic" style={{ color: "rgba(148, 163, 184, 0.7)" }}>
          Completed chats stored in Pinecone
        </p>
      </div>
    </div>
  );
};
