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
  ChevronRight,
} from "lucide-react";
import { Message, Step, createInitialSteps } from "@/lib/chat-types";
import { getThinkingTime, getThinkingDetails, TIMINGS } from "@/lib/animation-config";
import { ChatContainer } from "@/components/chat/ChatContainer";
import { DemoInstructions } from "@/components/DemoInstructions";
import Image from "next/image";

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingStatus, setTypingStatus] = useState<string | undefined>();
  const [currentPlan, setCurrentPlan] = useState<Step[]>([]);
  const [pendingSteps, setPendingSteps] = useState<Step[]>([]);
  const [phase2PlanMessageId, setPhase2PlanMessageId] = useState<string | null>(null);
  const [phase2Steps, setPhase2Steps] = useState<Step[]>([]);
  const [awaitingApproval, setAwaitingApproval] = useState(false);
  const [awaitingMerchant, setAwaitingMerchant] = useState(false);
  const [inputAtBottom, setInputAtBottom] = useState(false);
  const [conversationComplete, setConversationComplete] = useState(false);
  const [conversationStarted, setConversationStarted] = useState(false);
  const [instructionsOpen, setInstructionsOpen] = useState(false);
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
    // Mark that conversation has been started (for history persistence)
    setConversationStarted(true);
    
    // First animate the input to bottom
    setInputAtBottom(true);
    
    // Wait for input animation to complete
    await delay(500);
    
    setShowChat(true);
    
    // User message appears
    addMessage({
      role: "user",
      type: "text",
      content: searchQuery,
    });

    // Clear input but keep at bottom
    setSearchQuery("");
    
    // Initial response from agent
    await delay(600);
    addMessage({
      role: "agent",
      type: "text",
      content: "I can help you troubleshoot your missing transfer"
    });
    
    // 1) Start with "Drafting a plan..."
    await delay(800);
    const draftingMsg = addMessage({
      role: "system",
      type: "text",
      content: "Drafting a plan..."
    });

    // Show typing indicator
    await delay(400);
    setIsTyping(true);
    setTypingStatus("Currently outlining steps to locate their missing transfer.");
    
    // Planning time
    await delay(2800);
    setTypingStatus(undefined);
    setIsTyping(false);
    
    // 2) Replace "Drafting a plan..." with "Plan complete."
    await delay(300);
    setMessages(prev => prev.map(m => 
      m.id === draftingMsg.id 
        ? { ...m, content: "Plan complete." }
        : m
    ));
    
    // 3) Show "Thought for Xs"
    await delay(600);
    const thinkingDuration = 3;
    addMessage({
      role: "system",
      type: "text",
      content: `Thought for ${thinkingDuration}s`
    });

    // Simulate thinking time
    await delay(thinkingDuration * 1000);

    // Start showing first 3 steps one by one
    await delay(600);
    const allSteps = createInitialSteps();
    const steps = allSteps.slice(0, 3);
    setPendingSteps(allSteps.slice(3));
    
    // Add a plan message first (PlanCard will use currentPlan fallback)
    addMessage({
      role: "agent",
      type: "plan",
      content: "",
      thinkingTime: 0
    });
    
    // Then add steps one by one
    await addStepsOneByOne(steps);

    // Start executing first 3 steps
    await delay(400);
    await executeSteps(steps);

    // After executing 3 steps, prompt for approval
    await delay(600);
    addMessage({
      role: "agent",
      type: "approval-request",
      content: "This transfer missed your bank's Friday cutoff, so it was automatically reversed. I can start a new ACH to get it back on track.",
    });
    // Delay, then show action buttons as a separate right-aligned message
    await delay(800);
    addMessage({
      role: "user",
      type: "approval-actions",
      content: "",
    });
    setAwaitingApproval(true);
  };

  // Add plan steps one by one with animation
  const addStepsOneByOne = async (steps: Step[]) => {
    for (let i = 0; i < steps.length; i++) {
      await delay(500); // Pause between each step appearance
      setCurrentPlan(prev => [...prev, steps[i]]);
    }
  };

  // Execute troubleshooting steps
  const executeSteps = async (steps: Step[]) => {
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      await executeAutomatedStep(step, i);
    }
  };

  // Execute a single automated step
  const executeAutomatedStep = async (step: Step, index: number) => {
    // Small delay before starting
    await delay(300);
    
    // Update step to working with smooth transition
    setCurrentPlan(prev => prev.map((s, idx) => 
      idx === index ? { ...s, status: "working" as const } : s
    ));

    // Show working status with realistic duration
    const workDuration = step.duration || TIMINGS.mediumStep;
    await delay(workDuration);

    // Mark complete with smooth animation
    setCurrentPlan(prev => prev.map((s, idx) => 
      idx === index ? { ...s, status: "complete" as const } : s
    ));

    // Pause to let user appreciate the checkmark animation
    await delay(700);
    
    // Add subtle thinking between steps
    if (index < 2) {
      // Brief pause with typing indicator
      setIsTyping(true);
      await delay(600);
      setIsTyping(false);
      await delay(300);
    }
  };

  // Helpers to manage steps inside a specific message (phase 2 plan)
  const updatePhase2Steps = (next: Step[] | ((prev: Step[]) => Step[])) => {
    // Maintain a local copy for reference, but actual rendering uses message-scoped steps
    setPhase2Steps(prev => (typeof next === 'function' ? (next as (p: Step[]) => Step[])(prev) : next));
  };

  const executePhase2Step = async (index: number, duration: number) => {
    updatePhase2Steps(prev => prev.map((s, i) => i === index ? { ...s, status: "working" as const } : s));
    await delay(duration);
    updatePhase2Steps(prev => prev.map((s, i) => i === index ? { ...s, status: "complete" as const } : s));
    await delay(700);
  };

  // Execute a step by index within a specific plan message
  const executeStepInMessage = async (messageId: string, index: number, duration: number) => {
    updateMessageSteps(messageId, prev => prev.map((s, i) => i === index ? { ...s, status: "working" as const } : s));
    await delay(duration);
    updateMessageSteps(messageId, prev => prev.map((s, i) => i === index ? { ...s, status: "complete" as const } : s));
    await delay(700);
  };

  // Generic helper: update steps for a specific message id
  const updateMessageSteps = (messageId: string, updater: (prev: Step[]) => Step[]) => {
    setMessages(prev => prev.map(m => {
      if (m.id !== messageId) return m;
      const current = m.data?.steps || [];
      const next = updater(current);
      return { ...m, data: { ...(m.data || {}), steps: next } };
    }));
  };

  // Handle approval
  const handleApprove = async () => {
    setAwaitingApproval(false);
    
    // Show user's response as a message
    addMessage({
      role: "user",
      type: "text",
      content: "Sounds good"
    });
    
    // Small delay for button animation
    await delay(200);
    
    // Show "Considering next steps..." with thinking
    addMessage({
      role: "system",
      type: "text",
      content: "Considering next steps..."
    });

    await delay(500);
    setIsTyping(true);
    await delay(1200);
    setIsTyping(false);
    
    // Start a new plan container (phase 2) below latest chat bubble
    const plan2 = addMessage({
      role: "agent",
      type: "plan",
      content: "",
      thinkingTime: 0,
      data: { steps: [] }
    });
    setPhase2PlanMessageId(plan2.id);

    // Steps 4,5,6 for phase 2
    const step4 = pendingSteps[0];
    const step5 = pendingSteps[1];
    const step6 = pendingSteps[2];

    if (step4) {
      // Append step 4 and execute
      updateMessageSteps(plan2.id, prev => [...prev, step4]);
      await delay(400);
      await executeStepInMessage(plan2.id, 0, step4.duration || TIMINGS.mediumStep);
    }

    if (step5) {
      // Append step 5 (merchant)
      updateMessageSteps(plan2.id, prev => [...prev, step5]);
      await delay(400);
      // Ask for manual confirmation (left bubble), then show actions (right)
      addMessage({
        role: "agent",
        type: "merchant-task",
        content: "Before we move forward, can you check your bank app for a pending deposit?",
      });
      await delay(800);
      addMessage({
        role: "user",
        type: "merchant-actions",
        content: "",
      });
      setAwaitingMerchant(true);
      return;
    }

    if (!step5 && step6) {
      // Append step 6 and execute within plan2
      updateMessageSteps(plan2.id, prev => [...prev, step6]);
      await delay(400);
      await executeStepInMessage(plan2.id, 1, step6.duration || TIMINGS.mediumStep);
      await showSuccess();
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
    
    // Show user's response as a message
    addMessage({
      role: "user",
      type: "text",
      content: "Yep, it's there"
    });
    
    await delay(400);
    
    addMessage({
      role: "system",
      type: "text",
      content: "Confirmed. Finalizing..."
    });

    // Mark merchant step complete in phase 2 (index 1)
    if (phase2PlanMessageId) {
      updateMessageSteps(phase2PlanMessageId, prev => prev.map((s, i) => i === 1 ? { ...s, status: "complete" as const } : s));
    }
    await delay(600);

    // Create final container for step 6 and execute within it
    const step6 = pendingSteps[2];
    if (step6) {
      const plan3 = addMessage({
        role: "agent",
        type: "plan",
        content: "",
        thinkingTime: 0,
        data: { steps: [ { ...step6, status: "pending" as const } ] }
      });
      await delay(400);
      // Working
      updateMessageSteps(plan3.id, prev => prev.map((s, i) => i === 0 ? { ...s, status: "working" as const } : s));
      await delay(step6.duration || TIMINGS.mediumStep);
      // Complete
      updateMessageSteps(plan3.id, prev => prev.map((s, i) => i === 0 ? { ...s, status: "complete" as const } : s));
      await delay(700);
    }
    await showSuccess();
  };

  // Handle merchant decline (no deposit)
  const handleMerchantDecline = () => {
    setAwaitingMerchant(false);
    addMessage({
      role: "system",
      type: "text",
      content: "No deposit found. We can investigate further or try again later."
    });
  };

  // Show success message
  const showSuccess = async () => {
    // Add "Troubleshooting steps completed" status
    addMessage({
      role: "system",
      type: "text",
      content: "Troubleshooting steps completed."
    });
    
    // Brief pause before showing final result
    await delay(1000);
    setIsTyping(true);
    
    const thinkingTime = 2200;
    await delay(thinkingTime);
    setIsTyping(false);
    
    // Show detailed success message
    await delay(300);
    addMessage({
      role: "agent",
      type: "text",
      content: "Your missing transfer of $4,719.57 has been successfully processed and is estimated to be deposited on Oct 25."
    });
    
    // Final friendly message
    await delay(1000);
    addMessage({
      role: "agent",
      type: "text",
      content: "Is there anything else I can help you with?"
    });
    
    // Enable follow-up questions
    setConversationComplete(true);
  };
  
  // Handle follow-up questions
  const handleFollowUpQuestion = async (question: string) => {
    const query = question.toLowerCase();
    
    // Check if it's a cutoff/processing time question
    if (query.includes("cutoff") || 
        query.includes("deadline") ||
        query.includes("processing time") ||
        query.includes("processing hours") ||
        query.includes("what time") ||
        query.includes("when do transfers") ||
        query.includes("bank hours") ||
        query.includes("transfer schedule")) {
      
      // Add user message
      addMessage({
        role: "user",
        type: "text",
        content: question
      });
      
      // Thinking sequence with progression
      await delay(600);
      const thinkingMsg = addMessage({
        role: "system",
        type: "text",
        content: "Thinking..."
      });
      
      await delay(800);
      setMessages(prev => prev.map(m => 
        m.id === thinkingMsg.id 
          ? { ...m, content: "Searching the web..." }
          : m
      ));
      
      await delay(1200);
      setMessages(prev => prev.map(m => 
        m.id === thinkingMsg.id 
          ? { ...m, content: "Searching First National Bank..." }
          : m
      ));
      
      await delay(1500);
      setMessages(prev => prev.map(m => 
        m.id === thinkingMsg.id 
          ? { ...m, content: "Done." }
          : m
      ));
      
      // Show the response
      await delay(500);
      addMessage({
        role: "agent",
        type: "text",
        content: "I checked your bank's ACH processing schedule. First National Bank's cutoff for same-day ACH is 2:00 PM ET on Fridays. Since your original transfer was submitted at 3:45 PM on Friday, it missed the cutoff and was automatically reversed. Any transfers submitted before 2:00 PM on Friday would have been processed that same day."
      });
    } else {
      // Generic response for other questions
      addMessage({
        role: "user",
        type: "text",
        content: question
      });
      
      await delay(1000);
      addMessage({
        role: "agent",
        type: "text",
        content: "I'd be happy to help with that! For now, I'm specialized in handling transfer and payment issues. Is there anything else related to your transfer I can help with?"
      });
    }
  };

  // Handle search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // If conversation is complete, handle as follow-up question
    if (conversationComplete && searchQuery.trim()) {
      handleFollowUpQuestion(searchQuery);
      setSearchQuery("");
      return;
    }
    
    const query = searchQuery.toLowerCase();
    
    if (query.includes("transfer") || 
        query.includes("missing") || 
        query.includes("deposit") || 
        query.includes("payment") ||
        query.includes("where") && query.includes("money") ||
        query.includes("wheres my money") ||
        query.includes("where's my money") ||
        query.includes("funds") ||
        query.includes("payout") ||
        query.includes("settlement") ||
        query.includes("ach") ||
        query.includes("direct deposit") ||
        query.includes("bank account") && (query.includes("not") || query.includes("missing")) ||
        query.includes("didn't receive") ||
        query.includes("didnt receive") ||
        query.includes("haven't received") ||
        query.includes("havent received") ||
        query.includes("not arrived") ||
        query.includes("hasn't arrived") ||
        query.includes("hasnt arrived") ||
        query.includes("delayed")) {
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
    <>
      <DemoInstructions onToggle={setInstructionsOpen} />
      <div 
        className="flex flex-col h-screen bg-black text-gray-900 overflow-hidden transition-all duration-300 ease-in-out"
        style={{ marginLeft: instructionsOpen ? '360px' : '64px' }}
      >
      {/* Header */}
      <header className="bg-black px-6 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#224D2E' }}>
              <Image src="https://raw.githubusercontent.com/dschippert/support-managerbot/ce15c74b02b418c28ceffa1842837429ac62e0c4/public/img/logomark.svg" alt="Logo" width={24} height={24} />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-white">Olympia Greek</h1>
              <p className="text-xs text-gray-400">admin@olympiagreek.com</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              className="rounded-full text-gray-300 border-0 hover:bg-[#404040]"
              style={{ backgroundColor: '#333333' }}
            >
              <span className="text-green-400 mr-1">●</span>
              Store info
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="rounded-full text-gray-300 border-0 hover:bg-[#404040]"
              style={{ backgroundColor: '#333333' }}
            >
              <span className="text-red-400 mr-1">●</span>
              Employee info
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="rounded-full text-gray-300 border-0 hover:bg-[#404040]"
              style={{ backgroundColor: '#333333' }}
            >
              <span className="text-green-400 mr-1">●</span>
              Device info
            </Button>
          </div>
        </div>
      </header>

      {/* Main Container with rounded top corners */}
      <div className="flex flex-1 bg-white rounded-t-3xl overflow-hidden">
        {/* Sidebar */}
        <div className="w-72 bg-white flex flex-col border-r border-gray-200">
        {/* Navigation */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500">Spaces</span>
              <button className="text-gray-500 hover:text-gray-300">
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <nav className="space-y-1 mb-6">
              {navItems.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (item.name === "Home") {
                      setShowChat(false);
                      setInputAtBottom(false);
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                    item.active && !showChat
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
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
              {(conversationStarted ? ["Troubleshooting missing transfer", ...historyItems.map(h => h.name)] : historyItems.map(h => h.name)).map((itemName, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    // If clicking "Troubleshooting missing transfer"
                    if (itemName === "Troubleshooting missing transfer") {
                      if (showChat && idx === 0) {
                        return; // Already viewing
                      }
                      // Switch to chat view
                      setShowChat(true);
                      setInputAtBottom(true);
                    }
                  }}
                  className={`w-full flex items-start px-3 py-2 rounded-md text-sm transition-colors ${
                    showChat && idx === 0 && itemName === "Troubleshooting missing transfer"
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  {itemName}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Matt"
                alt="User"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">Matt</p>
              <p className="text-xs text-gray-500">Owner</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-white relative z-0">
          {/* Page Title - Always visible when chat is active */}
          {showChat && (
            <div className="border-b border-gray-200 px-8 py-4">
              <div className="flex items-center justify-between max-w-5xl mx-auto">
                <h2 className="text-base font-medium text-gray-900">Troubleshooting missing transfer</h2>
                <div className="flex items-center gap-2">
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M10 3v14M3 10h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Dashboard Content - Fades out when chat starts */}
          <div className={`transition-all duration-500 ${showChat ? 'opacity-0 translate-y-[-20px] pointer-events-none' : 'opacity-100'}`}>
            <div className="w-[740px] mx-auto px-0 pt-16">
              {/* Main Heading */}
              <h2 className="text-3xl font-semibold text-gray-900 text-center mb-8">
                How can we help you run your business?
              </h2>
            </div>
          </div>

          {/* Search Input - Animates to bottom */}
          {!inputAtBottom && (
            <div className="w-[740px] mx-auto px-0">
              <form onSubmit={handleSearchSubmit} className="bg-white rounded-[32px] py-5 px-6 mb-8 border border-gray-200 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.35)] transition-all duration-500">
                <input
                  type="text"
                  placeholder="Ask anything"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-gray-900 placeholder-gray-400 w-full text-base mb-5"
                />
                <div className="flex items-center gap-3 flex-wrap">
                  <button type="button" className="w-10 h-10 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors border border-gray-200">
                    <Plus className="w-5 h-5 text-gray-600" />
                  </button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-full"
                  >
                    New invoice
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-full"
                  >
                    New menu
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-full"
                  >
                    View orders
                  </Button>
                  <button type="button" className="w-10 h-10 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors border border-gray-200">
                    <MoreHorizontal className="w-5 h-5 text-gray-600" />
                  </button>
                  <div className="flex-1"></div>
                  <button type="button" className="w-10 h-10 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors border border-gray-200">
                    <Mic className="w-5 h-5 text-gray-600" />
                  </button>
                  <button type="submit" className="w-10 h-10 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors border border-gray-200">
                    <MoveUp className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Dashboard Cards - Fade out when chat starts */}
          <div className={`transition-all duration-500 ${showChat ? 'opacity-0 translate-y-[-20px] pointer-events-none' : 'opacity-100'}`}>
            <div className="w-[740px] mx-auto px-0">
              {/* Tabs */}
              <div className="flex gap-2 mb-6">
                {tabs.map((tab, idx) => (
                  <button
                    key={idx}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      idx === 0
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Dashboard Cards Container (no vertical spacing around sections) */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                {/* Financial Overview Card */}
                <div className="p-6 transition-colors cursor-pointer group">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <Building2 className="w-5 h-5 text-gray-900" />
                      <h3 className="text-base font-semibold text-gray-900">
                        Financial overview
                      </h3>
                    </div>
                    <button className="text-gray-400 group-hover:text-gray-600 transition-colors">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <p className="text-2xl font-bold text-gray-900 mb-1">
                        $5,212.90
                      </p>
                      <p className="text-sm text-gray-600">In sales today</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900 mb-1">
                        $21,990.14
                      </p>
                      <p className="text-sm text-gray-600">
                        In 2 checking accounts
                      </p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900 mb-1">
                        $922.00
                      </p>
                      <p className="text-sm text-gray-600">
                        Outgoing payroll today
                      </p>
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-200" />

                {/* Happy Hour Card */}
                <div className="p-6 transition-colors cursor-pointer group">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <Zap className="w-5 h-5 text-gray-900 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h3 className="text-base font-semibold text-gray-900 mb-1">
                          Add a Happy Hour to your restaurant
                        </h3>
                        <p className="text-sm text-gray-600">
                          You could benefit from a Happy Hour menu to drive
                          business at slower hours.
                        </p>
                      </div>
                      <button className="text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0">
                          <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-200" />

                {/* Daily Cash Snapshot Card */}
                <div className="p-6 transition-colors cursor-pointer group">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <Camera className="w-5 h-5 text-gray-900 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h3 className="text-base font-semibold text-gray-900 mb-2">
                          Daily cash snapshot
                        </h3>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          Good morning! Yesterday&apos;s sales came in at $2,300
                          (about 5% above your usual). Payroll of $4,200 is due
                          Friday. The veggie promo gave lunch a nice +12% boost.
                          No staffing or hardware issues were detected overnight.
                        </p>
                      </div>
                      <button className="text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0">
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-200" />

                {/* Transaction Summary Card */}
                <div className="p-6 transition-colors cursor-pointer group">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <TrendingDown className="w-5 h-5 text-gray-900 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h3 className="text-base font-semibold text-gray-900 mb-2">
                          Transaction summary
                        </h3>
                        <p className="text-sm text-gray-700">
                          Yesterday&apos;s sales reached $2,480, about average.
                          The dinner rush had 24 more covers than you usually see
                          on Thursdays.
                        </p>
                      </div>
                      <button className="text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0">
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Container - Shows when chat starts */}
          {showChat && (
            <div className="absolute inset-0 bg-white animate-in fade-in duration-300">
              <ChatContainer
                messages={messages}
                isTyping={isTyping}
                typingStatus={typingStatus}
                currentPlan={currentPlan}
                onApprove={awaitingApproval ? handleApprove : undefined}
                onDecline={awaitingApproval ? handleDecline : undefined}
            onMerchantConfirm={awaitingMerchant ? handleMerchantConfirm : undefined}
            onMerchantDecline={awaitingMerchant ? handleMerchantDecline : undefined}
              />
            </div>
          )}
        </main>

        {/* Input at bottom - Animates in */}
        {inputAtBottom && (
          <div 
            className="absolute bottom-0 left-0 right-0 animate-in slide-in-from-bottom-8 duration-400 z-10"
            style={{ 
              paddingTop: '40px',
              paddingBottom: '32px',
              paddingLeft: '32px',
              paddingRight: '32px'
            }}
          >
            {/* Frosted glass backdrop - testing simpler version */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                top: '12px',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                background: 'linear-gradient(to bottom, rgba(252, 252, 252, 0) 0px, rgba(252, 252, 252, 0.01) 28px, rgba(252, 252, 252, 0.01) 100%)',
                zIndex: -1
              }}
            />
            <div className="w-[740px] mx-auto relative">
              <form onSubmit={handleSearchSubmit} className="bg-white rounded-[32px] py-5 px-6 border border-gray-200 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.35)]">
                <input
                  type="text"
                  placeholder="Ask anything"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-gray-900 placeholder-gray-400 w-full text-base mb-5"
                  disabled={showChat && !conversationComplete}
                />
                <div className="flex items-center gap-3">
                  <button type="button" className="w-10 h-10 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors border border-gray-200">
                    <Plus className="w-5 h-5 text-gray-600" />
                  </button>
                  <button type="button" className="w-10 h-10 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors border border-gray-200">
                    <MoreHorizontal className="w-5 h-5 text-gray-600" />
                  </button>
                  <div className="flex-1"></div>
                  <button type="button" className="w-10 h-10 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors border border-gray-200">
                    <Mic className="w-5 h-5 text-gray-600" />
                  </button>
                  <button type="submit" className="w-10 h-10 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors border border-gray-200">
                    <MoveUp className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
    </>
  );
}
