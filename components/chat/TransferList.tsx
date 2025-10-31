"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Transfer {
  date: string;
  amount: string;
  status: "completed" | "failed";
}

const transfers: Transfer[] = [
  {
    date: "Oct 18, 2025",
    amount: "$3,245.12",
    status: "completed"
  },
  {
    date: "Oct 16, 2025",
    amount: "$2,890.45",
    status: "completed"
  },
  {
    date: "Oct 15, 2025",
    amount: "$4,719.57",
    status: "failed"
  }
];

export function TransferList() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mt-2">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="inline-flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 transition-colors"
      >
        <span>Show transfers</span>
        {isExpanded ? (
          <ChevronUp className="w-3.5 h-3.5" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5" />
        )}
      </button>
      
      {isExpanded && (
        <div className="mt-3 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
          {transfers.map((transfer, idx) => (
            <div
              key={idx}
              className={`flex items-center justify-between text-xs py-2 px-3 rounded-md ${
                transfer.status === "failed"
                  ? "bg-red-50 border border-red-100"
                  : "bg-gray-50 border border-gray-100"
              }`}
            >
              <span className="text-gray-900">
                <span className="font-semibold">{transfer.amount}</span>
                <span className="font-normal text-gray-600"> on {transfer.date}</span>
              </span>
              <span
                className={`inline-flex items-center gap-1 ${
                  transfer.status === "failed"
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {transfer.status === "failed" ? "⚠ Failed" : "✓ Completed"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

