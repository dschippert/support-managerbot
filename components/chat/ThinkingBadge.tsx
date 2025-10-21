"use client";

import { useState } from "react";
import { Brain, ChevronDown, ChevronUp } from "lucide-react";

interface ThinkingBadgeProps {
  duration: number; // in seconds
  details?: string[];
}

export function ThinkingBadge({ duration, details }: ThinkingBadgeProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="animate-in fade-in slide-in-from-top-2 duration-150">
      <button
        onClick={() => details && setIsExpanded(!isExpanded)}
        className={`flex items-center gap-2 px-3 py-1 bg-[#1a1a1a] rounded-full text-xs text-gray-400 font-mono border border-gray-800 transition-colors ${
          details ? 'hover:border-gray-700 cursor-pointer' : 'cursor-default'
        }`}
      >
        <Brain className="w-3 h-3 animate-pulse" />
        <span>Thought for {duration}s</span>
        {details && (
          isExpanded ? (
            <ChevronUp className="w-3 h-3" />
          ) : (
            <ChevronDown className="w-3 h-3" />
          )
        )}
      </button>
      
      {isExpanded && details && (
        <div className="mt-2 p-3 bg-[#0a0a0a] rounded-lg text-xs text-gray-500 font-mono space-y-1 animate-in fade-in slide-in-from-top-1 duration-200">
          {details.map((detail, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <span className="text-gray-600">•</span>
              <span>{detail}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

