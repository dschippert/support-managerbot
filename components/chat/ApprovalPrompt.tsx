"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface ApprovalPromptProps {
  title: string;
  description: string;
  details?: string[];
  onApprove: () => void;
  onDecline: () => void;
}

export function ApprovalPrompt({ 
  title, 
  description, 
  details, 
  onApprove, 
  onDecline 
}: ApprovalPromptProps) {
  const [responded, setResponded] = useState(false);

  const handleApprove = () => {
    setResponded(true);
    onApprove();
  };

  const handleDecline = () => {
    setResponded(true);
    onDecline();
  };

  return (
    <div className="bg-[#1a1a1a] rounded-2xl p-5 border border-yellow-500/30 animate-in fade-in slide-in-from-bottom-3 duration-300">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-8 h-8 rounded-full bg-yellow-900/30 flex items-center justify-center flex-shrink-0">
          <span className="text-yellow-400 text-sm">⚠️</span>
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-white mb-1">{title}</h4>
          <p className="text-sm text-gray-400">{description}</p>
        </div>
      </div>

      {details && details.length > 0 && (
        <div className="mb-4 p-3 bg-[#0a0a0a] rounded-lg">
          <p className="text-xs text-gray-500 mb-2">This will:</p>
          <ul className="space-y-1">
            {details.map((detail, idx) => (
              <li key={idx} className="text-xs text-gray-400 flex items-start gap-2">
                <span className="text-gray-600 mt-0.5">•</span>
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex gap-2">
        <Button
          onClick={handleApprove}
          disabled={responded}
          className={`flex-1 bg-green-600 hover:bg-green-700 text-white transition-all duration-150 ${
            !responded ? 'hover:scale-[1.02] active:scale-[0.98]' : ''
          }`}
        >
          <Check className="w-4 h-4 mr-2" />
          Approve
        </Button>
        <Button
          onClick={handleDecline}
          disabled={responded}
          variant="secondary"
          className={`flex-1 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white transition-all duration-150 ${
            !responded ? 'hover:scale-[1.02] active:scale-[0.98]' : ''
          }`}
        >
          <X className="w-4 h-4 mr-2" />
          Decline
        </Button>
      </div>
    </div>
  );
}

