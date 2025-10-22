"use client";

import { useEffect, useRef } from "react";
import { Message, Step } from "@/lib/chat-types";
import { ChatMessage } from "./ChatMessage";
import { TypingIndicator } from "./TypingIndicator";
import { PlanCard } from "./PlanCard";
import { ApprovalPrompt } from "./ApprovalPrompt";
import { Button } from "@/components/ui/button";

interface ChatContainerProps {
  messages: Message[];
  isTyping: boolean;
  typingStatus?: string;
  currentPlan?: Step[];
  onApprove?: () => void;
  onDecline?: () => void;
  onMerchantConfirm?: () => void;
  onMerchantDecline?: () => void;
}

export function ChatContainer({
  messages,
  isTyping,
  typingStatus,
  currentPlan,
  onApprove,
  onDecline,
  onMerchantConfirm,
  onMerchantDecline
}: ChatContainerProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages appear
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [messages, isTyping, currentPlan]);

  return (
    <div 
      ref={containerRef}
      className="flex-1 overflow-y-auto px-8 py-6 bg-white"
      style={{ scrollBehavior: 'smooth', paddingBottom: '200px' }}
    >
      <div className="w-[740px] mx-auto space-y-4">
        {/* Render all messages */}
        {messages.map((message, index) => {
        // Regular text message
        if (message.type === "text") {
          return <ChatMessage key={message.id} message={message} index={index} />;
        }

        // Plan card with steps
        if (message.type === "plan") {
          const hasScopedSteps = Array.isArray(message.data?.steps);
          const stepsToShow = hasScopedSteps
            ? (message.data?.steps || [])
            : (currentPlan && currentPlan.length > 0 ? currentPlan : undefined);
          if (stepsToShow && stepsToShow.length > 0) {
            return (
              <div key={message.id} className="my-4">
                <PlanCard steps={stepsToShow} />
              </div>
            );
          }
        }

        // Approval request (left bubble only)
        if (message.type === "approval-request") {
          return (
            <div key={message.id} className="flex justify-start mb-4 animate-in fade-in slide-in-from-left-3 duration-300">
              <div className="max-w-[85%]">
                <div className="bg-gray-100 text-gray-900 rounded-[32px] px-5 py-4">
                  <ApprovalPrompt
                    title="Approval required"
                    description={message.content}
                    details={[
                      "Initiate a new ACH transaction",
                      "Update your settlement queue",
                      "Send confirmation via email"
                    ]}
                  />
                </div>
              </div>
            </div>
          );
        }

        // Approval actions (right-aligned buttons after delay)
        if (message.type === "approval-actions" && onApprove && onDecline) {
          return (
            <div key={message.id} className={`flex justify-end mb-4 animate-in fade-in slide-in-from-right-3 duration-300`}>
              <div className="flex items-center gap-2">
                <Button
                  onClick={onDecline}
                  variant="outline"
                  className="px-6 py-2.5 rounded-full border border-gray-300 bg-white hover:bg-gray-50 hover:border-gray-400 text-gray-700 text-sm font-medium transition-all duration-200"
                >
                  Make changes
                </Button>
                <Button
                  onClick={onApprove}
                  className="px-6 py-2.5 rounded-full bg-black hover:bg-gray-800 text-white text-sm font-medium transition-all duration-200"
                >
                  Sounds good
                </Button>
              </div>
            </div>
          );
        }

        // Merchant task (left bubble, then separate right-aligned actions)
        if (message.type === "merchant-task") {
          return (
            <div key={message.id} className="flex justify-start mb-4 animate-in fade-in slide-in-from-left-3 duration-300">
              <div className="max-w-[85%]">
                <div className="bg-gray-100 text-gray-900 rounded-[32px] px-5 py-4">
                  <div className="space-y-1.5">
                    <p className="text-sm font-semibold text-gray-900">Manual Confirmation Needed</p>
                    <p className="text-sm text-gray-900 leading-relaxed">{message.content}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        }

        // Merchant actions (right-aligned buttons after delay)
        if (message.type === "merchant-actions" && onMerchantConfirm && onMerchantDecline) {
          return (
            <div key={message.id} className={`flex justify-end mb-4 animate-in fade-in slide-in-from-right-3 duration-300`}>
              <div className="flex items-center gap-2">
                <Button
                  onClick={onMerchantDecline}
                  variant="outline"
                  className="px-6 py-2.5 rounded-full border border-gray-300 bg-white hover:bg-gray-50 hover:border-gray-400 text-gray-700 text-sm font-medium transition-all duration-200"
                >
                  No deposit
                </Button>
                <Button
                  onClick={onMerchantConfirm}
                  className="px-6 py-2.5 rounded-full bg-black hover:bg-gray-800 text-white text-sm font-medium transition-all duration-200"
                >
                  Yep, it's there
                </Button>
              </div>
            </div>
          );
        }

        // Success message
        if (message.type === "success") {
          return (
            <div key={message.id} className="my-4 animate-in fade-in slide-in-from-bottom-3 duration-300">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                    <span className="text-gray-900 text-sm">✓</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">
                      Troubleshooting Complete
                    </h4>
                    <p className="text-sm text-gray-700 leading-relaxed">
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

      {/* Typing indicator */}
      {isTyping && (
        <div className="mb-4">
          {typingStatus && (
            <p className="text-sm text-gray-500 italic text-left mb-2">{typingStatus}</p>
          )}
          <div className="flex justify-start">
            <div className="bg-gray-100 px-4 py-2.5 rounded-[32px]">
              <TypingIndicator />
            </div>
          </div>
        </div>
      )}

      {/* Scroll anchor */}
      <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

