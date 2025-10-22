"use client";

import { Step } from "@/lib/chat-types";
import { Check, Loader2 } from "lucide-react";
import { TransferList } from "./TransferList";

interface PlanCardProps {
  steps: Step[];
}

export function PlanCard({ steps }: PlanCardProps) {
  const getStepClasses = (status: Step["status"]) => {
    switch (status) {
      case "working":
        return "border-white bg-gradient-to-r from-gray-50 via-white to-gray-50 animate-gradient";
      case "complete":
        return "border-white bg-white";
      case "failed":
        return "border-white bg-gray-50";
      default:
        return "border-white bg-white";
    }
  };

  return (
    <div className="bg-white rounded-[24px] p-5 border border-gray-200 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-[85%]">
      <div className="space-y-2">
        {steps.map((step, idx) => (
          <div
            key={step.id}
            className={`p-3 rounded-[16px] border transition-all duration-500 ease-out ${getStepClasses(step.status)} animate-in fade-in slide-in-from-top-2`}
            style={{ 
              animationDelay: `${idx * 150}ms`,
              backgroundSize: step.status === "working" ? "200% 100%" : "100% 100%"
            }}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 transition-all duration-400 ease-out">
                {step.status === "complete" ? (
                  <div className="w-6 h-6 rounded-full bg-gray-900 flex items-center justify-center animate-in zoom-in duration-500 ease-out">
                    <Check className="w-3.5 h-3.5 text-white" />
                  </div>
                ) : step.status === "working" ? (
                  <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center border border-gray-300 shadow-sm">
                    <Loader2 className="w-3.5 h-3.5 text-gray-900 animate-spin" style={{ animationDuration: '0.8s' }} />
                  </div>
                ) : (
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-50 text-xs font-medium text-gray-500 border border-gray-200 transition-all duration-300">
                    {step.number}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 mb-0.5 transition-all duration-300">
                  {step.title}
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed transition-all duration-300">
                  {step.status === "working" ? step.description : 
                   step.status === "complete" && step.result ? step.result : 
                   step.description}
                </p>
                {/* Show transfer list for step 2 when complete */}
                {step.id === "check-transfers" && step.status === "complete" && (
                  <TransferList />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
