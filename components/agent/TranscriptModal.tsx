"use client";

import { LedgerEntry, Step } from "@/lib/agent-types";
import { Button } from "@/components/ui/button";
import { X, Copy, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface TranscriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  ledger: LedgerEntry[];
  steps: Step[];
}

export function TranscriptModal({
  isOpen,
  onClose,
  ledger,
  steps
}: TranscriptModalProps) {
  const [copied, setCopied] = useState(false);

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    
    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
      return () => window.removeEventListener("keydown", handleEsc);
    }
  }, [isOpen, onClose]);

  const handleCopyToClipboard = () => {
    const transcriptData = {
      timestamp: new Date().toISOString(),
      totalEvents: ledger.length,
      steps: steps.map((step) => ({
        id: step.id,
        title: step.title,
        status: step.status
      })),
      ledger: ledger.map((entry) => ({
        timestamp: new Date(entry.ts).toISOString(),
        event: entry.event,
        stepId: entry.stepId,
        meta: entry.meta
      }))
    };

    navigator.clipboard.writeText(JSON.stringify(transcriptData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTimestamp = (ts: number) => {
    const date = new Date(ts);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      fractionalSecondDigits: 3
    });
  };

  const getEventColor = (event: string) => {
    if (event.includes("started")) return "text-blue-400";
    if (event.includes("completed") || event.includes("granted")) return "text-green-400";
    if (event.includes("denied") || event.includes("failed")) return "text-red-400";
    if (event.includes("paused")) return "text-yellow-400";
    if (event.includes("undone")) return "text-orange-400";
    return "text-gray-400";
  };

  const getStepTitle = (stepId?: string) => {
    if (!stepId) return null;
    const step = steps.find((s) => s.id === stepId);
    return step?.title;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[#1a1a1a] border border-gray-800 rounded-2xl w-full max-w-3xl max-h-[80vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div>
            <h2 className="text-xl font-semibold text-white">Audit Transcript</h2>
            <p className="text-sm text-gray-400 mt-1">
              {ledger.length} event{ledger.length !== 1 ? "s" : ""} recorded
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleCopyToClipboard}
              size="sm"
              variant="secondary"
              className="bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white"
            >
              {copied ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Export JSON
                </>
              )}
            </Button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#2a2a2a] hover:bg-[#3a3a3a] flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {ledger.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No events recorded yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {ledger.map((entry, index) => {
                const stepTitle = getStepTitle(entry.stepId);
                return (
                  <div
                    key={index}
                    className="bg-[#2a2a2a] rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      {/* Timestamp */}
                      <div className="flex-shrink-0 w-24">
                        <span className="text-xs font-mono text-gray-500">
                          {formatTimestamp(entry.ts)}
                        </span>
                      </div>

                      {/* Event */}
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${getEventColor(entry.event)}`}>
                          {entry.event}
                        </p>
                        {stepTitle && (
                          <p className="text-xs text-gray-400 mt-1">
                            Step: {stepTitle}
                          </p>
                        )}
                        {entry.meta && Object.keys(entry.meta).length > 0 && (
                          <div className="mt-2 bg-[#1a1a1a] rounded p-2">
                            <pre className="text-xs text-gray-400 font-mono overflow-x-auto">
                              {JSON.stringify(entry.meta, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-800">
          <p className="text-xs text-gray-500 text-center">
            All actions are logged for transparency and compliance
          </p>
        </div>
      </div>
    </div>
  );
}

