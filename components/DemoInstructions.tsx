"use client";

import { useState } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface DemoInstructionsProps {
  onToggle: (isOpen: boolean) => void;
}

export function DemoInstructions({ onToggle }: DemoInstructionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    onToggle(newState);
  };

  return (
    <div
      className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 ease-in-out z-40 ${
        isOpen ? "w-[360px]" : "w-[64px]"
      }`}
    >
      {/* Closed state - vertical text and icon */}
      {!isOpen && (
        <div className="h-full flex items-center justify-center">
          <button
            onClick={handleToggle}
            className="flex flex-col items-center gap-4 hover:opacity-70 transition-opacity"
          >
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </div>
            <div
              className="text-sm font-medium text-gray-600 whitespace-nowrap"
              style={{
                writingMode: "vertical-rl",
                textOrientation: "mixed",
                transform: "rotate(180deg)",
              }}
            >
              Demo Instructions
            </div>
          </button>
        </div>
      )}

      {/* Open state - full instructions */}
      {isOpen && (
        <div className="h-full flex flex-col p-6 overflow-y-auto animate-in fade-in slide-in-from-left-4 duration-300">
          <div className="flex items-start justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Demo Instructions
            </h2>
            <button
              onClick={handleToggle}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Overview */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                Support Managerbot Usecase
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                This is a proof-of-concept to illustrate the value of automated
                troubleshooting within Managerbot. Watch how the AI diagnoses
                issues, creates action plans, and guides merchants through
                resolution—all conversationally.
              </p>
            </div>

            {/* Instructions */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                How to use this demo
              </h3>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-900 text-white text-xs font-medium flex items-center justify-center">
                    1
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Type <span className="font-medium">"Where's my money?"</span> or
                    anything related to missing transfers.
                  </p>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-900 text-white text-xs font-medium flex items-center justify-center">
                    2
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Watch Managerbot work through the diagnostic plan
                    automatically.
                  </p>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-900 text-white text-xs font-medium flex items-center justify-center">
                    3
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Managerbot will ask for approval before proceeding. Click{" "}
                    <span className="font-medium">"Sounds good"</span> to continue.
                  </p>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-900 text-white text-xs font-medium flex items-center justify-center">
                    4
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    The plan continues until a manual check is required. Managerbot
                    asks you to verify a pending deposit in your banking app.
                  </p>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-900 text-white text-xs font-medium flex items-center justify-center">
                    5
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Confirm by clicking{" "}
                    <span className="font-medium">"Yep, it's there"</span>.
                  </p>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-900 text-white text-xs font-medium flex items-center justify-center">
                    6
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    After resolution, the input becomes active for follow-up
                    questions.
                  </p>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-900 text-white text-xs font-medium flex items-center justify-center">
                    7
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Ask something like{" "}
                    <span className="font-medium">"When is the cutoff on Friday?"</span>{" "}
                    to see contextual Q&A in action.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

