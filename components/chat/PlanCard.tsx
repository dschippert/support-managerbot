"use client";

import { Step } from "@/lib/chat-types";
import { ArrowRight, Check, Loader2, X } from "lucide-react";

interface PlanCardProps {
  steps: Step[];
}

export function PlanCard({ steps }: PlanCardProps) {
  const getStepIcon = (status: Step["status"]) => {
    switch (status) {
      case "working":
        return <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />;
      case "complete":
        return <Check className="w-4 h-4 text-green-400 animate-in zoom-in duration-300" />;
      case "failed":
        return <X className="w-4 h-4 text-red-400" />;
      default:
        return <ArrowRight className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStepColor = (status: Step["status"]) => {
    switch (status) {
      case "working":
        return "border-blue-500/30 bg-blue-900/10";
      case "complete":
        return "border-green-500/30 bg-green-900/10";
      case "failed":
        return "border-red-500/30 bg-red-900/10";
      default:
        return "border-gray-800 bg-transparent";
    }
  };

  return (
    <div className="bg-[#1a1a1a] rounded-2xl p-5 border border-gray-800 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h3 className="text-sm font-semibold text-white mb-4">Troubleshooting Plan</h3>
      <div className="space-y-3">
        {steps.map((step, idx) => (
          <div
            key={step.id}
            className={`p-3 rounded-lg border transition-all duration-300 ${getStepColor(step.status)} animate-in fade-in slide-in-from-left-2`}
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {getStepIcon(step.status)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-gray-500">Step {step.number}</span>
                  <h4 className="text-sm font-medium text-white">{step.title}</h4>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {step.status === "working" ? step.description : 
                   step.status === "complete" && step.result ? step.result : 
                   step.description}
                </p>
                
                {/* Progress bar for working state */}
                {step.status === "working" && (
                  <div className="mt-2 w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 animate-pulse" style={{ width: '60%' }} />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

