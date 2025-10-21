"use client";

import { Message } from "@/lib/chat-types";
import { ThinkingBadge } from "./ThinkingBadge";

interface ChatMessageProps {
  message: Message;
  index: number;
}

export function ChatMessage({ message, index }: ChatMessageProps) {
  const isUser = message.role === "user";
  const isSystem = message.role === "system";
  
  if (isSystem) {
    return (
      <div 
        className="flex justify-center my-2 animate-in fade-in slide-in-from-bottom-2 duration-200"
        style={{ animationDelay: `${index * 100}ms` }}
      >
        <span className="text-sm text-gray-500 italic">{message.content}</span>
      </div>
    );
  }

  return (
    <div 
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 animate-in fade-in slide-in-from-bottom-3 duration-200`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className={`max-w-[80%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-2`}>
        {/* Thinking badge for agent messages */}
        {!isUser && message.thinkingTime && (
          <ThinkingBadge 
            duration={Math.round(message.thinkingTime / 1000)} 
            details={message.data?.thinkingDetails}
          />
        )}
        
        {/* Message bubble */}
        <div
          className={`px-4 py-3 rounded-2xl ${
            isUser
              ? 'bg-[#2a2a2a] text-white rounded-br-sm'
              : 'bg-[#1a1a1a] text-gray-200 border border-gray-800 rounded-bl-sm'
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
    </div>
  );
}

