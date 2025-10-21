"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Flow, Step, LedgerEntry, LS_KEY, createInitialFlow, AUTO_PLAY_TIMINGS } from "@/lib/agent-types";
import { AgentStepCard } from "@/components/agent/AgentStepCard";
import { ProgressTimeline } from "@/components/agent/ProgressTimeline";
import { AgentControlBar } from "@/components/agent/AgentControlBar";
import { TranscriptModal } from "@/components/agent/TranscriptModal";
import { Toast } from "@/components/agent/Toast";
import {
  Home,
  FileText,
  ShoppingBag,
  DollarSign,
  Plus,
  HelpCircle
} from "lucide-react";

export default function TroubleshootingPage() {
  const [flow, setFlow] = useState<Flow>(createInitialFlow());
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showTranscript, setShowTranscript] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Navigation items for sidebar
  const navItems = [
    { name: "Home", icon: Home, active: false },
    { name: "Menus", icon: FileText },
    { name: "Orders", icon: ShoppingBag },
    { name: "Finance & payroll", icon: DollarSign },
  ];

  // Load state from localStorage on mount
  useEffect(() => {
    const savedFlow = localStorage.getItem(LS_KEY);
    if (savedFlow) {
      try {
        const parsed = JSON.parse(savedFlow);
        setFlow(parsed);
        // Find current step index
        const activeIndex = parsed.steps.findIndex(
          (s: Step) => s.status === "working" || s.status === "needs_approval" || s.status === "waiting_merchant"
        );
        if (activeIndex !== -1) {
          setCurrentStepIndex(activeIndex);
        } else {
          const lastDoneIndex = parsed.steps.findLastIndex((s: Step) => s.status === "done");
          setCurrentStepIndex(Math.min(lastDoneIndex + 1, parsed.steps.length - 1));
        }
      } catch (e) {
        console.error("Failed to parse saved flow:", e);
      }
    } else {
      // Initialize first step if starting fresh
      addLedgerEntry("flow_started");
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(flow));
  }, [flow]);

  // Auto-play logic
  useEffect(() => {
    if (!isPlaying || flow.mode !== "autoplay") {
      return;
    }

    const currentStep = flow.steps[currentStepIndex];
    
    // If flow is complete, stop
    if (currentStepIndex >= flow.steps.length || currentStep.status === "done") {
      const allDone = flow.steps.every((s) => s.status === "done");
      if (allDone && !flow.completedAt) {
        setFlow((prev) => ({
          ...prev,
          completedAt: Date.now()
        }));
        addLedgerEntry("flow_completed");
        setIsPlaying(false);
        setToast({ message: "✓ Troubleshooting complete! Transfer located and requeued.", type: "success" });
        return;
      }
    }

    // Start or continue current step
    if (currentStep.status === "planned") {
      startStep(currentStepIndex);
    } else if (currentStep.status === "working") {
      const delay = (AUTO_PLAY_TIMINGS[currentStep.id as keyof typeof AUTO_PLAY_TIMINGS] || 2000) / playbackSpeed;
      
      timeoutRef.current = setTimeout(() => {
        if (currentStep.requiresApproval) {
          // Move to approval state
          updateStepStatus(currentStepIndex, "needs_approval");
          addLedgerEntry("approval_requested", currentStep.id);
          
          // Auto-approve after delay in autoplay
          timeoutRef.current = setTimeout(() => {
            handleApprove(currentStepIndex);
          }, 1500 / playbackSpeed);
        } else if (currentStep.requiresMerchantAction) {
          // Move to merchant action state
          updateStepStatus(currentStepIndex, "waiting_merchant");
          addLedgerEntry("merchant_task_started", currentStep.id);
          
          // Auto-complete after delay in autoplay with simulated banner
          timeoutRef.current = setTimeout(() => {
            setToast({ message: "⚡ Simulated merchant action - auto-completed in demo mode", type: "info" });
            setTimeout(() => {
              handleApprove(currentStepIndex);
            }, 500);
          }, 2500 / playbackSpeed);
        } else {
          // Complete step and move to next
          completeStep(currentStepIndex);
        }
      }, delay);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isPlaying, currentStepIndex, flow, playbackSpeed]);

  const addLedgerEntry = (event: string, stepId?: string, meta?: Record<string, unknown>) => {
    setFlow((prev) => ({
      ...prev,
      ledger: [
        ...prev.ledger,
        {
          ts: Date.now(),
          event,
          stepId,
          meta
        }
      ]
    }));
  };

  const updateStepStatus = (index: number, status: Step["status"]) => {
    setFlow((prev) => {
      const newSteps = [...prev.steps];
      newSteps[index] = { ...newSteps[index], status };
      return { ...prev, steps: newSteps };
    });
  };

  const startStep = (index: number) => {
    updateStepStatus(index, "working");
    addLedgerEntry("step_started", flow.steps[index].id);
  };

  const completeStep = (index: number) => {
    updateStepStatus(index, "done");
    addLedgerEntry("step_completed", flow.steps[index].id);
    
    // Move to next step
    if (index < flow.steps.length - 1) {
      setCurrentStepIndex(index + 1);
    }
  };

  const handleApprove = (index: number) => {
    const step = flow.steps[index];
    
    if (step.requiresApproval) {
      addLedgerEntry("approval_granted", step.id);
      setToast({ message: `Approved: ${step.title}`, type: "success" });
    } else if (step.requiresMerchantAction) {
      addLedgerEntry("merchant_task_completed", step.id);
      setToast({ message: `Confirmed: ${step.title}`, type: "success" });
    }
    
    completeStep(index);
  };

  const handleDecline = (index: number) => {
    const step = flow.steps[index];
    addLedgerEntry("approval_denied", step.id);
    updateStepStatus(index, "paused");
    setIsPlaying(false);
    setToast({ message: `Declined: ${step.title}. Flow paused.`, type: "info" });
  };

  const handleUndo = (index: number) => {
    const step = flow.steps[index];
    addLedgerEntry("step_undone", step.id);
    updateStepStatus(index, "undone");
    setToast({ message: `Undone: ${step.title}. Action reversed.`, type: "info" });
    
    // Move back to this step
    setCurrentStepIndex(index);
    
    // Reset to planned state after brief moment
    setTimeout(() => {
      updateStepStatus(index, "planned");
    }, 500);
  };

  const handlePause = () => {
    setIsPlaying(false);
    const step = flow.steps[currentStepIndex];
    if (step.status === "working") {
      updateStepStatus(currentStepIndex, "paused");
      addLedgerEntry("step_paused", step.id);
    }
  };

  const handleModeToggle = () => {
    const newMode = flow.mode === "interactive" ? "autoplay" : "interactive";
    setFlow((prev) => ({ ...prev, mode: newMode }));
    addLedgerEntry("autoplay_toggled", undefined, { mode: newMode });
    
    if (newMode === "autoplay") {
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  };

  const handlePlayPause = () => {
    const newPlaying = !isPlaying;
    setIsPlaying(newPlaying);
    
    if (newPlaying) {
      const step = flow.steps[currentStepIndex];
      if (step.status === "paused") {
        updateStepStatus(currentStepIndex, "working");
        addLedgerEntry("step_resumed", step.id);
      }
    }
  };

  const handleReset = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    const newFlow = createInitialFlow();
    newFlow.mode = flow.mode;
    setFlow(newFlow);
    setCurrentStepIndex(0);
    setIsPlaying(false);
    addLedgerEntry("flow_reset");
    setToast({ message: "Flow reset. Starting fresh.", type: "info" });
  };

  const handleStepClick = (index: number) => {
    if (flow.mode === "interactive" && index <= currentStepIndex) {
      setCurrentStepIndex(index);
    }
  };

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      {/* Sidebar */}
      <div className="w-72 bg-[#1a1a1a] flex flex-col border-r border-gray-800">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl font-bold">🍀</span>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-semibold text-white truncate">
                Olympia Greek
              </h2>
              <p className="text-xs text-gray-400 truncate">
                admin@olympiagreek.com
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-400">Spaces</span>
            <button className="text-gray-400 hover:text-white">
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <nav className="space-y-1 mb-6">
            {navItems.map((item, idx) => (
              <button
                key={idx}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  item.active
                    ? "bg-[#2a2a2a] text-white font-medium"
                    : "text-gray-400 hover:bg-[#2a2a2a] hover:text-white"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </button>
            ))}
          </nav>

          <div className="mb-2">
            <span className="text-xs font-medium text-gray-500">Progress</span>
          </div>

          <ProgressTimeline
            steps={flow.steps}
            currentStepIndex={currentStepIndex}
            onStepClick={handleStepClick}
            interactive={flow.mode === "interactive"}
          />
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-800 mt-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-600 overflow-hidden">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Matt"
                alt="User"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white">Matt</p>
              <p className="text-xs text-gray-400">Owner</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-black border-b border-gray-800 px-6 py-3">
          <div className="flex items-center gap-3">
            <HelpCircle className="w-5 h-5 text-blue-400" />
            <h1 className="text-lg font-medium text-white">
              Troubleshooting: Missing Transfer
            </h1>
          </div>
        </header>

        {/* Control Bar */}
        <AgentControlBar
          mode={flow.mode}
          isPlaying={isPlaying}
          onModeToggle={handleModeToggle}
          onPlayPause={handlePlayPause}
          onReset={handleReset}
          onViewTranscript={() => setShowTranscript(true)}
          playbackSpeed={playbackSpeed}
          onSpeedChange={setPlaybackSpeed}
        />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-[#0a0a0a] p-8">
          <div className="max-w-4xl mx-auto space-y-4">
            {/* Intro Message */}
            <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-blue-500/30">
              <p className="text-sm text-gray-300 leading-relaxed">
                I'll help you locate your missing transfer. This process is{" "}
                <span className="text-blue-400 font-medium">transparent</span> (you'll see every step),{" "}
                <span className="text-green-400 font-medium">interruptible</span> (pause or stop anytime), and{" "}
                <span className="text-yellow-400 font-medium">reversible</span> (undo any action). Let's get started.
              </p>
            </div>

            {/* Step Cards */}
            {flow.steps.map((step, index) => (
              <div
                key={step.id}
                className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <AgentStepCard
                  step={step}
                  stepNumber={index + 1}
                  isActive={index === currentStepIndex}
                  onApprove={() => handleApprove(index)}
                  onDecline={() => handleDecline(index)}
                  onUndo={() => handleUndo(index)}
                  onPause={handlePause}
                />
              </div>
            ))}

            {/* Completion Message */}
            {flow.completedAt && (
              <div className="bg-green-900/20 rounded-2xl p-6 border border-green-500/30 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-lg font-semibold text-green-400 mb-2">
                  ✓ Troubleshooting Complete
                </h3>
                <p className="text-sm text-gray-300 mb-3">
                  Transfer located and successfully requeued. You should see the deposit in your bank account by Oct 22.
                  The delay was caused by weekend processing at your bank.
                </p>
                <p className="text-xs text-gray-400">
                  💡 <strong>What happened:</strong> Your transfer was queued on Friday evening and fell into the weekend processing window. 
                  Banks don't process ACH transfers on weekends, so it was automatically requeued for Monday morning.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Transcript Modal */}
      <TranscriptModal
        isOpen={showTranscript}
        onClose={() => setShowTranscript(false)}
        ledger={flow.ledger}
        steps={flow.steps}
      />

      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

