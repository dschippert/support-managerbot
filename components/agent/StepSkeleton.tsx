"use client";

export function StepSkeleton() {
  return (
    <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-gray-800 animate-pulse">
      <div className="flex items-start gap-4">
        {/* Step Number & Icon */}
        <div className="flex flex-col items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-[#2a2a2a]" />
          <div className="w-5 h-5 rounded-full bg-[#2a2a2a]" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex-1 space-y-2">
              {/* Title skeleton */}
              <div className="h-5 bg-[#2a2a2a] rounded w-1/3" />
              {/* Description skeleton */}
              <div className="h-4 bg-[#2a2a2a] rounded w-2/3" />
            </div>
            {/* Status pill skeleton */}
            <div className="h-6 w-24 bg-[#2a2a2a] rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

