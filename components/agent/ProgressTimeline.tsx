"use client";

import { Step } from "@/lib/agent-types";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";

interface ProgressTimelineProps {
  steps: Step[];
  currentStepIndex: number;
  onStepClick?: (index: number) => void;
  interactive?: boolean;
}

export function ProgressTimeline({
  steps,
  currentStepIndex,
  onStepClick,
  interactive = true
}: ProgressTimelineProps) {
  const getStepIcon = (step: Step, index: number) => {
    if (step.status === "done") {
      return <CheckCircle2 className="w-5 h-5 text-green-400" />;
    }
    if (step.status === "working") {
      return <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />;
    }
    if (index === currentStepIndex && step.status !== "planned") {
      return <div className="w-5 h-5 rounded-full bg-blue-500 animate-pulse" />;
    }
    return <Circle className="w-5 h-5 text-gray-600" />;
  };

  return (
    <div className="flex flex-col gap-1 py-4">
      {steps.map((step, index) => {
        const isActive = index === currentStepIndex;
        const isCompleted = step.status === "done";
        const isClickable = interactive && index <= currentStepIndex;

        return (
          <div key={step.id} className="relative">
            {/* Connecting Line */}
            {index < steps.length - 1 && (
              <div 
                className={`absolute left-[10px] top-8 w-0.5 h-6 transition-colors ${
                  isCompleted ? "bg-green-400" : "bg-gray-700"
                }`}
              />
            )}

            {/* Step Item */}
            <button
              onClick={() => isClickable && onStepClick?.(index)}
              disabled={!isClickable}
              className={`flex items-center gap-3 p-2 rounded-lg transition-all w-full text-left ${
                isActive 
                  ? "bg-[#2a2a2a]" 
                  : isClickable
                  ? "hover:bg-[#1a1a1a]"
                  : ""
              } ${!isClickable ? "cursor-default" : "cursor-pointer"}`}
            >
              {/* Icon */}
              <div className="flex-shrink-0">
                {getStepIcon(step, index)}
              </div>

              {/* Step Info */}
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-medium truncate transition-colors ${
                  isActive 
                    ? "text-white" 
                    : isCompleted 
                    ? "text-gray-400" 
                    : "text-gray-500"
                }`}>
                  {step.title}
                </p>
              </div>

              {/* Step Number Badge */}
              <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium ${
                isActive 
                  ? "bg-blue-600 text-white" 
                  : isCompleted 
                  ? "bg-green-900/30 text-green-400" 
                  : "bg-gray-800 text-gray-500"
              }`}>
                {index + 1}
              </div>
            </button>
          </div>
        );
      })}
    </div>
  );
}

