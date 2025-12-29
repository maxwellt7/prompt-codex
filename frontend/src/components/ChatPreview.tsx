import { Send } from "lucide-react";
import { Button } from "./ui/button";

export const ChatPreview = () => {
  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Glow effect behind */}
      <div 
        className="absolute inset-0 blur-3xl opacity-50"
        style={{
          background: "linear-gradient(135deg, rgba(14, 165, 233, 0.2), rgba(168, 85, 247, 0.2), rgba(45, 212, 191, 0.2))"
        }}
      />
      
      {/* Chat window */}
      <div 
        className="relative border-gradient rounded-2xl overflow-hidden backdrop-blur-md"
        style={{ backgroundColor: "rgba(17, 24, 39, 0.8)" }}
      >
        {/* Header */}
        <div 
          className="flex items-center gap-3 p-4 border-b"
          style={{ borderColor: "rgba(30, 58, 95, 0.5)" }}
        >
          <div 
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: "#2dd4bf" }}
          />
          <span className="text-sm font-medium" style={{ color: "#e8edf5" }}>Strategic Analysis</span>
          <span className="ml-auto text-xs font-mono" style={{ color: "#94a3b8" }}>claude-3-opus</span>
        </div>
        
        {/* Messages */}
        <div className="p-4 space-y-4 min-h-[200px]">
          {/* AI Message */}
          <div className="flex gap-3">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
              style={{ 
                background: "linear-gradient(135deg, #0ea5e9, #a855f7)",
                color: "#0a0f1a"
              }}
            >
              AI
            </div>
            <div 
              className="rounded-2xl rounded-tl-md p-3 text-sm max-w-[85%]"
              style={{ backgroundColor: "rgba(30, 41, 59, 0.5)", color: "rgba(232, 237, 245, 0.9)" }}
            >
              <p>I've analyzed your market position. Let me walk you through the key strategic opportunities...</p>
            </div>
          </div>
          
          {/* User Message */}
          <div className="flex gap-3 justify-end">
            <div 
              className="rounded-2xl rounded-tr-md p-3 text-sm max-w-[85%]"
              style={{ 
                backgroundColor: "rgba(14, 165, 233, 0.2)", 
                borderWidth: "1px",
                borderColor: "rgba(14, 165, 233, 0.3)",
                color: "rgba(232, 237, 245, 0.9)" 
              }}
            >
              <p>Focus on the competitive advantages</p>
            </div>
          </div>
          
          {/* Typing indicator */}
          <div className="flex gap-3">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
              style={{ 
                background: "linear-gradient(135deg, #0ea5e9, #a855f7)",
                color: "#0a0f1a"
              }}
            >
              AI
            </div>
            <div 
              className="rounded-2xl rounded-tl-md p-3"
              style={{ backgroundColor: "rgba(30, 41, 59, 0.5)" }}
            >
              <div className="flex gap-1">
                <span 
                  className="w-2 h-2 rounded-full animate-bounce"
                  style={{ backgroundColor: "rgba(232, 237, 245, 0.4)", animationDelay: "0ms" }}
                />
                <span 
                  className="w-2 h-2 rounded-full animate-bounce"
                  style={{ backgroundColor: "rgba(232, 237, 245, 0.4)", animationDelay: "150ms" }}
                />
                <span 
                  className="w-2 h-2 rounded-full animate-bounce"
                  style={{ backgroundColor: "rgba(232, 237, 245, 0.4)", animationDelay: "300ms" }}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Input */}
        <div 
          className="p-4 border-t"
          style={{ borderColor: "rgba(30, 58, 95, 0.5)" }}
        >
          <div 
            className="flex items-center gap-2 rounded-xl p-2"
            style={{ backgroundColor: "rgba(30, 41, 59, 0.3)" }}
          >
            <input
              type="text"
              placeholder="Continue the conversation..."
              className="flex-1 bg-transparent text-sm placeholder:text-[#94a3b8] focus:outline-none px-2"
              style={{ color: "#e8edf5" }}
              readOnly
            />
            <Button size="icon" variant="glass" className="shrink-0">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
