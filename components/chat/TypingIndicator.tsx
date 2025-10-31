"use client";

interface TypingIndicatorProps {
  statusText?: string;
}

export function TypingIndicator({ statusText }: TypingIndicatorProps) {
  return (
    <div className="flex items-center gap-3 animate-in fade-in duration-300">
      <div className="flex gap-1.5">
        <span 
          className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" 
          style={{ animationDelay: '0ms', animationDuration: '1s' }} 
        />
        <span 
          className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" 
          style={{ animationDelay: '150ms', animationDuration: '1s' }} 
        />
        <span 
          className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" 
          style={{ animationDelay: '300ms', animationDuration: '1s' }} 
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

