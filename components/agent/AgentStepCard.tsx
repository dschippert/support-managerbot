"use client";

import { Step } from "@/lib/agent-types";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle2, 
  Loader2, 
  AlertCircle, 
  UserCheck, 
  Pause, 
  RotateCcw, 
  HelpCircle,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { useState } from "react";

interface AgentStepCardProps {
  step: Step;
  stepNumber: number;
  onApprove?: () => void;
  onDecline?: () => void;
  onUndo?: () => void;
  onPause?: () => void;
  onExplain?: () => void;
  isActive?: boolean;
}

export function AgentStepCard({
  step,
  stepNumber,
  onApprove,
  onDecline,
  onUndo,
  onPause,
  onExplain,
  isActive = false
}: AgentStepCardProps) {
  const [showExplanation, setShowExplanation] = useState(false);

  const getStatusIcon = () => {
    switch (step.status) {
      case "done":
        return <CheckCircle2 className="w-5 h-5 text-green-400" />;
      case "working":
        return <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />;
      case "needs_approval":
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      case "waiting_merchant":
        return <UserCheck className="w-5 h-5 text-purple-400" />;
      case "paused":
        return <Pause className="w-5 h-5 text-gray-400" />;
      case "undone":
        return <RotateCcw className="w-5 h-5 text-gray-500" />;
      default:
        return <div className="w-5 h-5 rounded-full border-2 border-gray-600" />;
    }
  };

  const getStatusPill = () => {
    const styles: Record<string, { bg: string; text: string; label: string }> = {
      planned: { bg: "bg-gray-800", text: "text-gray-400", label: "Planned" },
      working: { bg: "bg-blue-900/30", text: "text-blue-400", label: "In Progress" },
      done: { bg: "bg-green-900/30", text: "text-green-400", label: "Completed" },
      needs_approval: { bg: "bg-yellow-900/30", text: "text-yellow-400", label: "Needs Approval" },
      waiting_merchant: { bg: "bg-purple-900/30", text: "text-purple-400", label: "Awaiting Merchant" },
      paused: { bg: "bg-gray-800", text: "text-gray-400", label: "Paused" },
      undone: { bg: "bg-gray-900", text: "text-gray-500", label: "Undone" }
    };

    const style = styles[step.status];
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
        {style.label}
      </span>
    );
  };

  const showActions = step.status === "needs_approval" || 
                      step.status === "waiting_merchant" || 
                      step.status === "working" ||
                      (step.status === "done" && step.reversible);

  return (
    <div 
      className={`bg-[#1a1a1a] rounded-2xl p-6 border transition-all duration-300 ${
        isActive 
          ? "border-blue-500/50 shadow-lg shadow-blue-500/10" 
          : "border-gray-800 hover:border-gray-700"
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Step Number & Icon */}
        <div className="flex flex-col items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center text-sm font-medium text-gray-400">
            {stepNumber}
          </div>
          {getStatusIcon()}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex-1">
              <h3 className="text-base font-semibold text-white mb-1">
                {step.title}
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                {step.description}
              </p>
            </div>
            {getStatusPill()}
          </div>

          {/* Explanation Toggle */}
          {step.explain && (
            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-3"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Why this step?</span>
              {showExplanation ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          )}

          {/* Explanation Panel */}
          {showExplanation && step.explain && (
            <div className="bg-[#2a2a2a] rounded-lg p-4 mb-4 border border-gray-700 transition-all duration-300 ease-in-out animate-in fade-in slide-in-from-top-2">
              <p className="text-sm text-gray-300 leading-relaxed">
                {step.explain}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          {showActions && (
            <div className="flex items-center gap-2 flex-wrap">
              {step.status === "needs_approval" && (
                <>
                  <Button
                    onClick={onApprove}
                    onKeyDown={(e) => e.key === "Enter" && onApprove?.()}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white transition-all duration-200 hover:scale-105"
                  >
                    Approve
                  </Button>
                  <Button
                    onClick={onDecline}
                    onKeyDown={(e) => e.key === "Enter" && onDecline?.()}
                    size="sm"
                    variant="secondary"
                    className="bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white transition-all duration-200"
                  >
                    Decline
                  </Button>
                </>
              )}

              {step.status === "waiting_merchant" && (
                <Button
                  onClick={onApprove}
                  onKeyDown={(e) => e.key === "Enter" && onApprove?.()}
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-700 text-white transition-all duration-200 hover:scale-105"
                >
                  I've Confirmed
                </Button>
              )}

              {step.status === "working" && onPause && (
                <Button
                  onClick={onPause}
                  onKeyDown={(e) => e.key === "Enter" && onPause?.()}
                  size="sm"
                  variant="secondary"
                  className="bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white transition-all duration-200"
                >
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </Button>
              )}

              {step.status === "done" && step.reversible && onUndo && (
                <Button
                  onClick={onUndo}
                  onKeyDown={(e) => e.key === "Enter" && onUndo?.()}
                  size="sm"
                  variant="secondary"
                  className="bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white transition-all duration-200 hover:scale-105"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Undo
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

