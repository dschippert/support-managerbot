"use client";

interface TypingIndicatorProps {
  statusText?: string;
}

export function TypingIndicator({ statusText }: TypingIndicatorProps) {
  return (
    <div className="flex items-center gap-3 animate-in fade-in duration-300">
      <div className="flex gap-1">
        <span 
          className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" 
          style={{ animationDelay: '0ms', animationDuration: '1.4s' }} 
        />
        <span 
          className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" 
          style={{ animationDelay: '200ms', animationDuration: '1.4s' }} 
        />
        <span 
          className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" 
          style={{ animationDelay: '400ms', animationDuration: '1.4s' }} 
        />
      </div>
      {statusText && (
        <span className="text-sm text-gray-400 italic animate-pulse">
          {statusText}
        </span>
      )}
    </div>
  );
}

