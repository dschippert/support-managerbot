"use client";

import { useEffect, useRef } from "react";
import { Message, Step } from "@/lib/chat-types";
import { ChatMessage } from "./ChatMessage";
import { TypingIndicator } from "./TypingIndicator";
import { PlanCard } from "./PlanCard";
import { ApprovalPrompt } from "./ApprovalPrompt";
import { MerchantTask } from "./MerchantTask";

interface ChatContainerProps {
  messages: Message[];
  isTyping: boolean;
  typingStatus?: string;
  currentPlan?: Step[];
  onApprove?: () => void;
  onDecline?: () => void;
  onMerchantConfirm?: () => void;
}

export function ChatContainer({
  messages,
  isTyping,
  typingStatus,
  currentPlan,
  onApprove,
  onDecline,
  onMerchantConfirm
}: ChatContainerProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages appear
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages, isTyping, currentPlan]);

  return (
    <div 
      ref={containerRef}
      className="flex-1 overflow-y-auto px-8 py-6 space-y-4"
      style={{ scrollBehavior: 'smooth' }}
    >
      {/* Render all messages */}
      {messages.map((message, index) => {
        // Regular text message
        if (message.type === "text") {
          return <ChatMessage key={message.id} message={message} index={index} />;
        }

        // Plan card with steps
        if (message.type === "plan" && message.data?.steps) {
          return (
            <div key={message.id} className="my-4">
              <PlanCard steps={message.data.steps} />
            </div>
          );
        }

        // Approval request
        if (message.type === "approval-request" && onApprove && onDecline) {
          return (
            <div key={message.id} className="my-4">
              <ApprovalPrompt
                title="Approval Required"
                description={message.content}
                details={[
                  "Initiate a new ACH transaction",
                  "Update your settlement queue",
                  "Send confirmation via email"
                ]}
                onApprove={onApprove}
                onDecline={onDecline}
              />
            </div>
          );
        }

        // Merchant task
        if (message.type === "merchant-task" && onMerchantConfirm) {
          return (
            <div key={message.id} className="my-4">
              <MerchantTask
                title="Manual Confirmation Needed"
                description={message.content}
                onConfirm={onMerchantConfirm}
              />
            </div>
          );
        }

        // Success message
        if (message.type === "success") {
          return (
            <div key={message.id} className="my-4 animate-in fade-in slide-in-from-bottom-3 duration-300">
              <div className="bg-green-900/20 rounded-2xl p-5 border border-green-500/30">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-900/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-green-400 text-sm">✓</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-green-400 mb-2">
                      Troubleshooting Complete
                    </h4>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {message.content}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        }

        return null;
      })}

      {/* Show plan updates */}
      {currentPlan && currentPlan.length > 0 && !messages.find(m => m.type === "plan") && (
        <div className="my-4">
          <PlanCard steps={currentPlan} />
        </div>
      )}

      {/* Typing indicator */}
      {isTyping && (
        <div className="flex justify-start mb-4">
          <div className="bg-[#1a1a1a] px-4 py-3 rounded-2xl rounded-bl-sm border border-gray-800">
            <TypingIndicator statusText={typingStatus} />
          </div>
        </div>
      )}

      {/* Scroll anchor */}
      <div ref={messagesEndRef} />
    </div>
  );
}

