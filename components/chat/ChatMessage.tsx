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
    const isDraftingPlan = message.content.toLowerCase().includes("drafting a plan");
    const isPlanDrafted = message.content.toLowerCase().includes("plan drafted") || message.content.toLowerCase().includes("plan complete");
    
    return (
      <div 
        className="flex justify-start my-3 animate-in fade-in slide-in-from-left-2 duration-300"
        style={{ animationDelay: `${index * 80}ms` }}
      >
        <p className={`text-sm italic flex items-center ${
          isDraftingPlan || isPlanDrafted
            ? 'text-gray-600' 
            : 'text-gray-500'
        }`}>
          {isDraftingPlan ? (
            <span className='animate-text-shimmer font-medium'>Drafting a plan...</span>
          ) : isPlanDrafted ? (
            <span className='font-medium'>Plan complete.</span>
          ) : (
            <span>{message.content}</span>
          )}
        </p>
      </div>
    );
  }

  return (
    <div 
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 animate-in fade-in slide-in-from-${isUser ? 'right' : 'left'}-3 duration-300`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className={`max-w-[85%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-2`}>
        {/* Thinking badge for agent messages */}
        {!isUser && message.thinkingTime && (
          <ThinkingBadge 
            duration={Math.round(message.thinkingTime / 1000)} 
            details={message.data?.thinkingDetails}
          />
        )}
        
        {/* Message bubble */}
        <div
          className={`px-4 py-2.5 rounded-[32px] transition-all duration-200 ${
            isUser
              ? 'bg-black text-white'
              : 'bg-gray-100 text-gray-900'
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
    </div>
  );
}

