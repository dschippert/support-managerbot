"use client";

import { Button } from "@/components/ui/button";
import {
  Home,
  FileText,
  ShoppingBag,
  DollarSign,
  Users,
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
  Star,
} from "lucide-react";

export default function Dashboard() {
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

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      {/* Sidebar */}
      <div className="w-72 bg-[#1a1a1a] flex flex-col">
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
        <header className="bg-black border-b border-gray-800 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-medium text-white">Home</h1>
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
        <main className="flex-1 overflow-y-auto bg-[#0a0a0a] pb-8">
          <div className="max-w-5xl mx-auto px-8 pt-16">
            {/* Main Heading */}
            <h2 className="text-3xl font-semibold text-white text-center mb-8">
              How can we help you run your business?
            </h2>

            {/* Search Bar */}
            <div className="bg-[#1a1a1a] rounded-2xl p-4 mb-6 border border-gray-800">
              <input
                type="text"
                placeholder="Ask anything"
                className="bg-transparent border-none outline-none text-white placeholder-gray-500 w-full mb-4"
              />
              <div className="flex items-center gap-3 flex-wrap">
                <button className="w-10 h-10 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-full flex items-center justify-center transition-colors">
                  <Plus className="w-5 h-5 text-gray-300" />
                </button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white border-none rounded-full"
                >
                  New invoice
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white border-none rounded-full"
                >
                  New menu
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white border-none rounded-full"
                >
                  View orders
                </Button>
                <button className="w-10 h-10 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-full flex items-center justify-center transition-colors">
                  <MoreHorizontal className="w-5 h-5 text-gray-300" />
                </button>
                <div className="flex-1"></div>
                <button className="w-10 h-10 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-full flex items-center justify-center transition-colors">
                  <Mic className="w-5 h-5 text-gray-300" />
                </button>
                <button className="w-10 h-10 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-full flex items-center justify-center transition-colors">
                  <MoveUp className="w-5 h-5 text-gray-300" />
                </button>
              </div>
            </div>

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

            {/* Cards */}
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
      </div>
    </div>
  );
}

