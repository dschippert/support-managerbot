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
    <div className="animate-in fade-in slide-in-from-top-2 duration-200">
      <button
        onClick={() => details && setIsExpanded(!isExpanded)}
        className={`flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600 font-mono border border-gray-200 transition-all duration-200 ${
          details ? 'hover:bg-gray-200 hover:border-gray-300 cursor-pointer' : 'cursor-default'
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
        <div className="mt-2 p-3 bg-gray-50 rounded-lg text-xs text-gray-600 font-mono space-y-1 animate-in fade-in slide-in-from-top-2 duration-200 border border-gray-200">
          {details.map((detail, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <span className="text-gray-400">•</span>
              <span>{detail}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

