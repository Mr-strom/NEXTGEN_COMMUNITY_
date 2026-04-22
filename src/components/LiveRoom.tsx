import React, { useEffect, useState, useRef, useCallback } from "react";
import { getSupabase } from "../lib/supabase";
import { Send } from "lucide-react";
import { useUser } from "@clerk/react";

type Message = {
  id: string;
  text: string;
  user: string;
  timestamp: number;
  isOwn: boolean;
};

export const LiveRoom = React.memo(({ subredditName }: { subredditName: string }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const { user } = useUser();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [onlineCount, setOnlineCount] = useState(
    Math.floor(Math.random() * 200) + 10
  );

  const currentUser = user?.username || user?.firstName || "Anonymous";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineCount(Math.floor(Math.random() * 200) + 10);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const client = getSupabase();
    if (!client) return;

    const channel = client.channel(`live-room-${subredditName}`);
    
    channel.on(
      "broadcast",
      { event: "message" },
      (payload) => {
        setMessages((prev) => [
          ...prev,
          { ...payload.payload, isOwn: payload.payload.user === currentUser },
        ]);
      }
    ).subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }, [subredditName, currentUser]);

  const handleSend = useCallback(() => {
    if (!text.trim()) return;

    const newMsg: Message = {
      id: crypto.randomUUID(),
      text: text.trim(),
      user: currentUser,
      timestamp: Date.now(),
      isOwn: true,
    };

    setMessages((prev) => [...prev, newMsg]);

    const client = getSupabase();
    if (client) {
      client.channel(`live-room-${subredditName}`).send({
        type: "broadcast",
        event: "message",
        payload: { ...newMsg, isOwn: false },
      });
    }

    setText("");
  }, [text, currentUser, subredditName]);

  return (
    <div className="flex flex-col h-[600px] w-full bg-[#ECE5DD] dark:bg-[#0B141A] rounded-md overflow-hidden relative" data-ocid="live-room.container">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-card border-b border-border z-10">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
          <h2 className="font-semibold text-foreground">
            Live — r/{subredditName}
          </h2>
        </div>
        <div className="text-xs text-muted-foreground font-medium">
          {onlineCount} online
        </div>
      </div>

      {/* Messages list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col max-w-[70%] ${
              msg.isOwn ? "ml-auto items-end" : "mr-auto items-start"
            }`}
          >
            {!msg.isOwn && (
              <span className="text-[10px] text-muted-foreground font-semibold mb-1 ml-1">
                {msg.user}
              </span>
            )}
            <div
              className={`px-3 py-1.5 rounded-2xl shadow-sm text-sm break-words relative transform transition-all animate-in slide-in-from-bottom-2 ${
                msg.isOwn
                  ? "bg-[#DCF8C6] dark:bg-[#005C4B] text-black dark:text-white rounded-br-none"
                  : "bg-white dark:bg-[#1F2C33] text-foreground rounded-bl-none"
              }`}
            >
              {msg.text}
              <div className={`text-[9px] mt-1 opacity-60 text-right ${msg.isOwn ? 'text-black dark:text-white/70' : 'text-muted-foreground'}`}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="p-3 bg-[#F0F2F5] dark:bg-[#202C33] pb-[calc(12px+env(safe-area-inset-bottom))]">
        <div className="flex items-center gap-2">
          <input
            type="text"
            className="flex-1 rounded-full px-4 py-2 text-sm bg-white dark:bg-[#2A3942] border-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-reddit-orange shadow-sm text-foreground placeholder:text-muted-foreground"
            placeholder="Type a message"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <button
            onClick={handleSend}
            disabled={!text.trim()}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:bg-gray-400 text-white transition-all transform active:scale-95 flex-shrink-0 focus:outline-none shadow-md group"
          >
            <Send className="w-5 h-5 ml-1 mt-0.5 group-active:scale-110 active:scale-125 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
});

export default LiveRoom;
