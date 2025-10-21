"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Home,
  FileText,
  ShoppingBag,
  DollarSign,
  BarChart3,
  TrendingUp,
  Bell,
  Package,
  UserPlus,
  Settings,
  Upload,
  HelpCircle,
  Plus,
  MoreHorizontal,
  Mic,
  MoveUp,
  Building2,
  Zap,
  Camera,
  TrendingDown,
  Moon,
  Sun,
  X,
} from "lucide-react";
import { Flow, Step, LS_KEY, createInitialFlow, AUTO_PLAY_TIMINGS } from "@/lib/agent-types";
import { AgentStepCard } from "@/components/agent/AgentStepCard";
import { ProgressTimeline } from "@/components/agent/ProgressTimeline";
import { AgentControlBar } from "@/components/agent/AgentControlBar";
import { TranscriptModal } from "@/components/agent/TranscriptModal";
import { Toast } from "@/components/agent/Toast";

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAgentFlow, setShowAgentFlow] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  
  // Agent flow state
  const [flow, setFlow] = useState<Flow>(createInitialFlow());
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showTranscript, setShowTranscript] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const navItems = [
    { name: "Home", icon: Home, active: true },
    { name: "Menus", icon: FileText },
    { name: "Orders", icon: ShoppingBag },
    { name: "Finance & payroll", icon: DollarSign },
  ];

  const historyItems = [
    { name: "Customer segmentation analysis", icon: BarChart3 },
    { name: "DoorDash price adjustments", icon: TrendingUp },
    { name: "Staff alert automation", icon: Bell },
    { name: "Stock and menu automations", icon: Package },
    { name: "Add staff", icon: UserPlus },
    { name: "Configure your POS", icon: Settings },
    { name: "Import your menu", icon: Upload },
    { name: "Getting started with Square", icon: HelpCircle },
  ];

  const tabs = ["For you", "Sales", "Money", "Automations"];

  // Handle search input - trigger agent flow for transfer-related queries
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.toLowerCase();
    
    if (query.includes("transfer") || query.includes("missing") || query.includes("deposit") || query.includes("payment")) {
      setShowAgentFlow(true);
      addLedgerEntry("flow_started", undefined, { query: searchQuery });
      setToast({ message: "Starting troubleshooting flow...", type: "info" });
    }
  };

  // Auto-play logic
  useEffect(() => {
    if (!isPlaying || flow.mode !== "autoplay" || !showAgentFlow) {
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
  }, [isPlaying, currentStepIndex, flow, playbackSpeed, showAgentFlow]);

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

  const handleExitAgentFlow = () => {
    setShowAgentFlow(false);
    setSearchQuery("");
    handleReset();
  };

  return (
    <div className={`flex h-screen ${darkMode ? 'bg-black text-white' : 'bg-white text-gray-900'} overflow-hidden`}>
      {/* Sidebar */}
      <div className={`w-72 ${darkMode ? 'bg-[#1a1a1a]' : 'bg-gray-50'} flex flex-col ${darkMode ? 'border-r border-gray-800' : 'border-r border-gray-200'}`}>
        {/* Sidebar Header */}
        <div className={`p-4 ${darkMode ? 'border-b border-gray-800' : 'border-b border-gray-200'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl font-bold">🍀</span>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className={`text-sm font-semibold truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Olympia Greek
              </h2>
              <p className={`text-xs truncate ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                admin@olympiagreek.com
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            {!showAgentFlow ? (
              <>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Spaces</span>
                  <button className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}>
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <nav className="space-y-1 mb-6">
                  {navItems.map((item, idx) => (
                    <button
                      key={idx}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                        item.active
                          ? darkMode 
                            ? "bg-[#2a2a2a] text-white font-medium"
                            : "bg-gray-200 text-gray-900 font-medium"
                          : darkMode
                          ? "text-gray-400 hover:bg-[#2a2a2a] hover:text-white"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.name}
                    </button>
                  ))}
                </nav>

                <div className="mb-2">
                  <span className={`text-xs font-medium ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>History</span>
                </div>

                <nav className="space-y-1">
                  {historyItems.map((item, idx) => (
                    <button
                      key={idx}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                        darkMode
                          ? "text-gray-300 hover:bg-[#2a2a2a] hover:text-white"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.name}
                    </button>
                  ))}
                </nav>
              </>
            ) : (
              <>
                <div className="mb-2">
                  <span className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Progress</span>
                </div>

                <ProgressTimeline
                  steps={flow.steps}
                  currentStepIndex={currentStepIndex}
                  onStepClick={handleStepClick}
                  interactive={flow.mode === "interactive"}
                />
              </>
            )}
          </div>
        </div>

        {/* User Profile with Dark Mode Toggle */}
        <div className={`p-4 ${darkMode ? 'border-t border-gray-800' : 'border-t border-gray-200'}`}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gray-600 overflow-hidden">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Matt"
                alt="User"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Matt</p>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Owner</p>
            </div>
          </div>
          
          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
              darkMode
                ? "bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white"
                : "bg-gray-200 hover:bg-gray-300 text-gray-900"
            }`}
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className={`${darkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-200'} border-b px-6 py-3`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {showAgentFlow ? "Troubleshooting: Missing Transfer" : "Home"}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                size="sm"
                className={`${darkMode ? 'bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'} border-none rounded-full`}
              >
                <span className="text-green-400 mr-2">●</span>
                Store info
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className={`${darkMode ? 'bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'} border-none rounded-full`}
              >
                <span className="text-red-400 mr-2">●</span>
                Employee info
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className={`${darkMode ? 'bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'} border-none rounded-full`}
              >
                <span className="text-green-400 mr-2">●</span>
                Device info
              </Button>
            </div>
          </div>
        </header>

        {/* Agent Control Bar (only when agent flow is active) */}
        {showAgentFlow && (
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
        )}

        {/* Content Area */}
        <main className={`flex-1 overflow-y-auto ${darkMode ? 'bg-[#0a0a0a]' : 'bg-gray-50'} pb-8`}>
          <div className="max-w-5xl mx-auto px-8 pt-16">
            {!showAgentFlow ? (
              <>
                {/* Main Heading */}
                <h2 className={`text-3xl font-semibold text-center mb-8 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  How can we help you run your business?
                </h2>

                {/* Search Bar */}
                <form onSubmit={handleSearchSubmit} className={`${darkMode ? 'bg-[#1a1a1a] border-gray-800' : 'bg-white border-gray-200'} rounded-2xl p-4 mb-6 border`}>
                  <input
                    type="text"
                    placeholder="Try: 'My transfer is missing' or 'Where is my deposit?'"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`bg-transparent border-none outline-none ${darkMode ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'} w-full mb-4`}
                  />
                  <div className="flex items-center gap-3 flex-wrap">
                    <button type="button" className={`w-10 h-10 ${darkMode ? 'bg-[#2a2a2a] hover:bg-[#3a3a3a]' : 'bg-gray-100 hover:bg-gray-200'} rounded-full flex items-center justify-center transition-colors`}>
                      <Plus className={`w-5 h-5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                    </button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className={`${darkMode ? 'bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'} border-none rounded-full`}
                    >
                      New invoice
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className={`${darkMode ? 'bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'} border-none rounded-full`}
                    >
                      New menu
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className={`${darkMode ? 'bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'} border-none rounded-full`}
                    >
                      View orders
                    </Button>
                    <button type="button" className={`w-10 h-10 ${darkMode ? 'bg-[#2a2a2a] hover:bg-[#3a3a3a]' : 'bg-gray-100 hover:bg-gray-200'} rounded-full flex items-center justify-center transition-colors`}>
                      <MoreHorizontal className={`w-5 h-5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                    </button>
                    <div className="flex-1"></div>
                    <button type="button" className={`w-10 h-10 ${darkMode ? 'bg-[#2a2a2a] hover:bg-[#3a3a3a]' : 'bg-gray-100 hover:bg-gray-200'} rounded-full flex items-center justify-center transition-colors`}>
                      <Mic className={`w-5 h-5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                    </button>
                    <button type="submit" className={`w-10 h-10 ${darkMode ? 'bg-[#2a2a2a] hover:bg-[#3a3a3a]' : 'bg-gray-100 hover:bg-gray-200'} rounded-full flex items-center justify-center transition-colors`}>
                      <MoveUp className={`w-5 h-5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                    </button>
                  </div>
                </form>

                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                  {tabs.map((tab, idx) => (
                    <button
                      key={idx}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        idx === 0
                          ? darkMode
                            ? "bg-[#2a2a2a] text-white"
                            : "bg-gray-200 text-gray-900"
                          : darkMode
                          ? "text-gray-400 hover:bg-[#1a1a1a] hover:text-white"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Dashboard Cards */}
                <div className="space-y-4">
                  {/* Financial Overview Card */}
                  <div className={`${darkMode ? 'bg-[#1a1a1a] border-gray-800 hover:border-gray-700' : 'bg-white border-gray-200 hover:border-gray-300'} rounded-2xl p-6 border transition-colors cursor-pointer group`}>
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <Building2 className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        <h3 className={`text-base font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          Financial overview
                        </h3>
                      </div>
                      <button className={`${darkMode ? 'text-gray-400 group-hover:text-white' : 'text-gray-400 group-hover:text-gray-900'} transition-colors`}>
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          className="rotate-[-45deg]"
                        >
                          <path
                            d="M5 10h10M10 5l5 5-5 5"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-6">
                      <div>
                        <p className={`text-2xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          $5,212.90
                        </p>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>In sales today</p>
                      </div>
                      <div>
                        <p className={`text-2xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          $21,990.14
                        </p>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          In 2 checking accounts
                        </p>
                      </div>
                      <div>
                        <p className={`text-2xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          $922.00
                        </p>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Outgoing payroll today
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Happy Hour Card */}
                  <div className={`${darkMode ? 'bg-[#1a1a1a] border-gray-800 hover:border-gray-700' : 'bg-white border-gray-200 hover:border-gray-300'} rounded-2xl p-6 border transition-colors cursor-pointer group`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className={`w-10 h-10 ${darkMode ? 'bg-[#2a2a2a]' : 'bg-gray-100'} rounded-lg flex items-center justify-center flex-shrink-0`}>
                          <Zap className="w-5 h-5 text-yellow-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className={`text-base font-semibold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            Add a Happy Hour to your restaurant
                          </h3>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            You could benefit from a Happy Hour menu to drive
                            business at slower hours.
                          </p>
                        </div>
                        <div className="flex items-center gap-4 flex-shrink-0">
                          <span className="text-4xl">🍻</span>
                          <button className={`${darkMode ? 'text-gray-400 group-hover:text-white' : 'text-gray-400 group-hover:text-gray-900'} transition-colors`}>
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="none"
                              className="rotate-[-45deg]"
                            >
                              <path
                                d="M5 10h10M10 5l5 5-5 5"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Daily Cash Snapshot Card */}
                  <div className={`${darkMode ? 'bg-[#1a1a1a] border-gray-800 hover:border-gray-700' : 'bg-white border-gray-200 hover:border-gray-300'} rounded-2xl p-6 border transition-colors cursor-pointer group`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className={`w-10 h-10 ${darkMode ? 'bg-[#2a2a2a]' : 'bg-gray-100'} rounded-lg flex items-center justify-center flex-shrink-0`}>
                          <Camera className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className={`text-base font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            Daily cash snapshot
                          </h3>
                          <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Good morning! Yesterday&apos;s sales came in at $2,300
                            (about 5% above your usual). Payroll of $4,200 is due
                            Friday. The veggie promo gave lunch a nice +12% boost.
                            No staffing or hardware issues were detected overnight.
                          </p>
                        </div>
                        <button className={`${darkMode ? 'text-gray-400 group-hover:text-white' : 'text-gray-400 group-hover:text-gray-900'} transition-colors flex-shrink-0`}>
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            className="rotate-[-45deg]"
                          >
                            <path
                              d="M5 10h10M10 5l5 5-5 5"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Transaction Summary Card */}
                  <div className={`${darkMode ? 'bg-[#1a1a1a] border-gray-800 hover:border-gray-700' : 'bg-white border-gray-200 hover:border-gray-300'} rounded-2xl p-6 border transition-colors cursor-pointer group`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className={`w-10 h-10 ${darkMode ? 'bg-[#2a2a2a]' : 'bg-gray-100'} rounded-lg flex items-center justify-center flex-shrink-0`}>
                          <TrendingDown className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className={`text-base font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            Transaction summary
                          </h3>
                          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Yesterday&apos;s sales reached $2,480, about average.
                            The dinner rush had 24 more covers than you usually see
                            on Thursdays.
                          </p>
                        </div>
                        <button className={`${darkMode ? 'text-gray-400 group-hover:text-white' : 'text-gray-400 group-hover:text-gray-900'} transition-colors flex-shrink-0`}>
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            className="rotate-[-45deg]"
                          >
                            <path
                              d="M5 10h10M10 5l5 5-5 5"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Agent Flow Content */}
                <div className="space-y-4">
                  {/* Exit Button */}
                  <button
                    onClick={handleExitAgentFlow}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
                      darkMode
                        ? "text-gray-400 hover:text-white hover:bg-[#1a1a1a]"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <X className="w-4 h-4" />
                    Exit troubleshooting
                  </button>

                  {/* Intro Message */}
                  <div className={`${darkMode ? 'bg-[#1a1a1a]' : 'bg-white'} rounded-2xl p-6 border border-blue-500/30`}>
                    <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
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
                    <div className={`${darkMode ? 'bg-green-900/20' : 'bg-green-50'} rounded-2xl p-6 border border-green-500/30 animate-in fade-in slide-in-from-bottom-4 duration-500`}>
                      <h3 className="text-lg font-semibold text-green-400 mb-2">
                        ✓ Troubleshooting Complete
                      </h3>
                      <p className={`text-sm mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Transfer located and successfully requeued. You should see the deposit in your bank account by Oct 22.
                        The delay was caused by weekend processing at your bank.
                      </p>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        💡 <strong>What happened:</strong> Your transfer was queued on Friday evening and fell into the weekend processing window. 
                        Banks don't process ACH transfers on weekends, so it was automatically requeued for Monday morning.
                      </p>
                    </div>
                  )}
                </div>
              </>
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
