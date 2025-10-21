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
} from "lucide-react";
import { Message, Step, createInitialSteps } from "@/lib/chat-types";
import { getThinkingTime, getThinkingDetails, TIMINGS } from "@/lib/animation-config";
import { ChatContainer } from "@/components/chat/ChatContainer";

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingStatus, setTypingStatus] = useState<string | undefined>();
  const [currentPlan, setCurrentPlan] = useState<Step[]>([]);
  const [awaitingApproval, setAwaitingApproval] = useState(false);
  const [awaitingMerchant, setAwaitingMerchant] = useState(false);
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

  // Add a message to the conversation
  const addMessage = (message: Omit<Message, "id" | "timestamp">) => {
    const newMessage: Message = {
      ...message,
      id: `msg-${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  };

  // Main conversation orchestration
  const startConversation = async () => {
    setShowChat(true);
    
    // User message
    addMessage({
      role: "user",
      type: "text",
      content: searchQuery,
    });

    // Clear input
    setSearchQuery("");

    // Thinking + First response
    await delay(TIMINGS.typingIndicator);
    setIsTyping(true);
    
    const thinkingTime1 = getThinkingTime();
    await delay(thinkingTime1);
    setIsTyping(false);
    
    addMessage({
      role: "agent",
      type: "text",
      content: "I'll help you locate that transfer. Let me check a few things for you.",
      thinkingTime: thinkingTime1,
      data: { thinkingDetails: getThinkingDetails("initial") }
    });

    // Status message
    await delay(TIMINGS.statusMessageDelay);
    setIsTyping(true);
    setTypingStatus("Analyzing your account...");
    
    // Thinking + Show plan
    await delay(2000);
    const thinkingTime2 = getThinkingTime();
    setTypingStatus(undefined);
    await delay(thinkingTime2);
    setIsTyping(false);

    const steps = createInitialSteps();
    setCurrentPlan(steps);
    
    addMessage({
      role: "agent",
      type: "plan",
      content: "Here's my plan to troubleshoot this:",
      thinkingTime: thinkingTime2,
      data: { 
        steps,
        thinkingDetails: getThinkingDetails("planning")
      }
    });

    // Start executing steps
    await delay(1000);
    addMessage({
      role: "system",
      type: "text",
      content: "Starting troubleshooting..."
    });

    await delay(500);
    executeSteps(steps);
  };

  // Execute troubleshooting steps
  const executeSteps = async (steps: Step[]) => {
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      
      // Check if step requires approval
      if (step.requiresApproval) {
        // Show thinking before approval request
        const thinkingTime = Math.floor(getThinkingTime() / 2); // Shorter thinking
        await delay(thinkingTime);
        
        addMessage({
          role: "agent",
          type: "approval-request",
          content: "I can submit a request to retry this transfer.",
          thinkingTime,
        });
        
        setAwaitingApproval(true);
        return; // Wait for user response
      }

      // Check if step requires merchant action
      if (step.requiresMerchantAction) {
        addMessage({
          role: "agent",
          type: "merchant-task",
          content: "Please open your bank app and check for pending deposits dated Oct 20-21.",
        });
        
        setAwaitingMerchant(true);
        return; // Wait for user confirmation
      }

      // Execute automated step
      await executeAutomatedStep(step, i);
    }

    // All steps complete - show success
    await showSuccess();
  };

  // Execute a single automated step
  const executeAutomatedStep = async (step: Step, index: number) => {
    // Update step to working
    setCurrentPlan(prev => prev.map((s, idx) => 
      idx === index ? { ...s, status: "working" as const } : s
    ));

    // Show working status
    await delay(step.duration || TIMINGS.mediumStep);

    // Mark complete
    setCurrentPlan(prev => prev.map((s, idx) => 
      idx === index ? { ...s, status: "complete" as const } : s
    ));

    await delay(300); // Brief pause to see completion animation
  };

  // Handle approval
  const handleApprove = async () => {
    setAwaitingApproval(false);
    
    addMessage({
      role: "system",
      type: "text",
      content: "Approved. Continuing..."
    });

    // Find the approval step and mark complete
    const approvalStepIndex = currentPlan.findIndex(s => s.requiresApproval);
    if (approvalStepIndex !== -1) {
      setCurrentPlan(prev => prev.map((s, idx) => 
        idx === approvalStepIndex ? { ...s, status: "complete" as const } : s
      ));
      
      await delay(500);
      
      // Continue with remaining steps
      const remainingSteps = currentPlan.slice(approvalStepIndex + 1);
      if (remainingSteps.length > 0) {
        executeSteps(currentPlan);
      } else {
        showSuccess();
      }
    }
  };

  // Handle decline
  const handleDecline = () => {
    setAwaitingApproval(false);
    
    addMessage({
      role: "system",
      type: "text",
      content: "Request declined. Troubleshooting paused."
    });
  };

  // Handle merchant confirmation
  const handleMerchantConfirm = async () => {
    setAwaitingMerchant(false);
    
    addMessage({
      role: "system",
      type: "text",
      content: "Confirmed. Finalizing..."
    });

    // Mark merchant step complete
    const merchantStepIndex = currentPlan.findIndex(s => s.requiresMerchantAction);
    if (merchantStepIndex !== -1) {
      setCurrentPlan(prev => prev.map((s, idx) => 
        idx === merchantStepIndex ? { ...s, status: "complete" as const } : s
      ));
      
      await delay(500);
      showSuccess();
    }
  };

  // Show success message
  const showSuccess = async () => {
    const thinkingTime = getThinkingTime();
    await delay(thinkingTime);
    
    addMessage({
      role: "agent",
      type: "success",
      content: "Transfer located and successfully requeued. You should see the deposit in your bank account by Oct 22. The delay was caused by weekend processing at your bank.",
      thinkingTime,
      data: { thinkingDetails: getThinkingDetails("finalizing") }
    });
  };

  // Handle search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.toLowerCase();
    
    if (query.includes("transfer") || query.includes("missing") || query.includes("deposit") || query.includes("payment")) {
      startConversation();
    }
  };

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Utility delay function
  const delay = (ms: number) => new Promise(resolve => {
    timeoutRef.current = setTimeout(resolve, ms);
  });

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
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            {!showChat ? (
              <>
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
                  <span className="text-xs font-medium text-gray-500">History</span>
                </div>

                <nav className="space-y-1">
                  {historyItems.map((item, idx) => (
                    <button
                      key={idx}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-[#2a2a2a] hover:text-white transition-colors"
                    >
                      <item.icon className="w-4 h-4" />
                      {item.name}
                    </button>
                  ))}
                </nav>
              </>
            ) : (
              <div className="text-sm text-gray-500">
                <p className="mb-2">Chat active</p>
                <button
                  onClick={() => {
                    setShowChat(false);
                    setMessages([]);
                    setCurrentPlan([]);
                  }}
                  className="text-xs text-gray-400 hover:text-white transition-colors"
                >
                  ← Back to dashboard
                </button>
              </div>
            )}
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-800">
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
        <header className="bg-black border-b border-gray-800 px-6 py-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-medium text-white">
                {showChat ? "Troubleshooting: Missing Transfer" : "Home"}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                size="sm"
                className="bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white border-none rounded-full"
              >
                <span className="text-green-400 mr-2">●</span>
                Store info
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white border-none rounded-full"
              >
                <span className="text-red-400 mr-2">●</span>
                Employee info
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white border-none rounded-full"
              >
                <span className="text-green-400 mr-2">●</span>
                Device info
              </Button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        {showChat ? (
          <ChatContainer
            messages={messages}
            isTyping={isTyping}
            typingStatus={typingStatus}
            currentPlan={currentPlan}
            onApprove={awaitingApproval ? handleApprove : undefined}
            onDecline={awaitingApproval ? handleDecline : undefined}
            onMerchantConfirm={awaitingMerchant ? handleMerchantConfirm : undefined}
          />
        ) : (
          <main className="flex-1 overflow-y-auto bg-[#0a0a0a] pb-8">
            <div className="max-w-5xl mx-auto px-8 pt-16">
              {/* Main Heading */}
              <h2 className="text-3xl font-semibold text-white text-center mb-8">
                How can we help you run your business?
              </h2>

              {/* Search Bar */}
              <form onSubmit={handleSearchSubmit} className="bg-[#1a1a1a] rounded-2xl p-4 mb-6 border border-gray-800">
                <input
                  type="text"
                  placeholder="Try: 'My transfer is missing' or 'Where is my deposit?'"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-white placeholder-gray-500 w-full mb-4"
                />
                <div className="flex items-center gap-3 flex-wrap">
                  <button type="button" className="w-10 h-10 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-full flex items-center justify-center transition-colors">
                    <Plus className="w-5 h-5 text-gray-300" />
                  </button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white border-none rounded-full"
                  >
                    New invoice
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white border-none rounded-full"
                  >
                    New menu
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white border-none rounded-full"
                  >
                    View orders
                  </Button>
                  <button type="button" className="w-10 h-10 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-full flex items-center justify-center transition-colors">
                    <MoreHorizontal className="w-5 h-5 text-gray-300" />
                  </button>
                  <div className="flex-1"></div>
                  <button type="button" className="w-10 h-10 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-full flex items-center justify-center transition-colors">
                    <Mic className="w-5 h-5 text-gray-300" />
                  </button>
                  <button type="submit" className="w-10 h-10 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-full flex items-center justify-center transition-colors">
                    <MoveUp className="w-5 h-5 text-gray-300" />
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
                        ? "bg-[#2a2a2a] text-white"
                        : "text-gray-400 hover:bg-[#1a1a1a] hover:text-white"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Dashboard Cards */}
              <div className="space-y-4">
                {/* Financial Overview Card */}
                <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-gray-800 hover:border-gray-700 transition-colors cursor-pointer group">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <Building2 className="w-5 h-5 text-gray-400" />
                      <h3 className="text-base font-semibold text-white">
                        Financial overview
                      </h3>
                    </div>
                    <button className="text-gray-400 group-hover:text-white transition-colors">
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
                      <p className="text-2xl font-bold text-white mb-1">
                        $5,212.90
                      </p>
                      <p className="text-sm text-gray-400">In sales today</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white mb-1">
                        $21,990.14
                      </p>
                      <p className="text-sm text-gray-400">
                        In 2 checking accounts
                      </p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white mb-1">
                        $922.00
                      </p>
                      <p className="text-sm text-gray-400">
                        Outgoing payroll today
                      </p>
                    </div>
                  </div>
                </div>

                {/* Happy Hour Card */}
                <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-gray-800 hover:border-gray-700 transition-colors cursor-pointer group">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-10 h-10 bg-[#2a2a2a] rounded-lg flex items-center justify-center flex-shrink-0">
                        <Zap className="w-5 h-5 text-yellow-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base font-semibold text-white mb-1">
                          Add a Happy Hour to your restaurant
                        </h3>
                        <p className="text-sm text-gray-400">
                          You could benefit from a Happy Hour menu to drive
                          business at slower hours.
                        </p>
                      </div>
                      <div className="flex items-center gap-4 flex-shrink-0">
                        <span className="text-4xl">🍻</span>
                        <button className="text-gray-400 group-hover:text-white transition-colors">
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
                <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-gray-800 hover:border-gray-700 transition-colors cursor-pointer group">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-10 h-10 bg-[#2a2a2a] rounded-lg flex items-center justify-center flex-shrink-0">
                        <Camera className="w-5 h-5 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base font-semibold text-white mb-2">
                          Daily cash snapshot
                        </h3>
                        <p className="text-sm text-gray-300 leading-relaxed">
                          Good morning! Yesterday&apos;s sales came in at $2,300
                          (about 5% above your usual). Payroll of $4,200 is due
                          Friday. The veggie promo gave lunch a nice +12% boost.
                          No staffing or hardware issues were detected overnight.
                        </p>
                      </div>
                      <button className="text-gray-400 group-hover:text-white transition-colors flex-shrink-0">
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
                <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-gray-800 hover:border-gray-700 transition-colors cursor-pointer group">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-10 h-10 bg-[#2a2a2a] rounded-lg flex items-center justify-center flex-shrink-0">
                        <TrendingDown className="w-5 h-5 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base font-semibold text-white mb-2">
                          Transaction summary
                        </h3>
                        <p className="text-sm text-gray-300">
                          Yesterday&apos;s sales reached $2,480, about average.
                          The dinner rush had 24 more covers than you usually see
                          on Thursdays.
                        </p>
                      </div>
                      <button className="text-gray-400 group-hover:text-white transition-colors flex-shrink-0">
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
            </div>
          </main>
        )}

        {/* Input at bottom when chat is active */}
        {showChat && (
          <div className="border-t border-gray-800 p-4 bg-black flex-shrink-0 animate-in slide-in-from-bottom duration-400">
            <div className="max-w-4xl mx-auto">
              <input
                type="text"
                placeholder="Ask anything..."
                className="w-full bg-[#1a1a1a] border border-gray-800 rounded-full px-6 py-3 text-white placeholder-gray-500 outline-none focus:border-gray-700 transition-colors"
                disabled
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
