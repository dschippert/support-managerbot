"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface MerchantTaskProps {
  title: string;
  description: string;
  onConfirm: () => void;
}

export function MerchantTask({ title, description, onConfirm }: MerchantTaskProps) {
  const [isChecked, setIsChecked] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleConfirm = () => {
    setIsConfirmed(true);
    onConfirm();
  };

  return (
    <div className="bg-[#1a1a1a] rounded-2xl p-5 border border-purple-500/30 animate-in fade-in slide-in-from-bottom-3 duration-300">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-8 h-8 rounded-full bg-purple-900/30 flex items-center justify-center flex-shrink-0">
          <span className="text-purple-400 text-sm">👤</span>
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-white mb-1">{title}</h4>
          <p className="text-sm text-gray-400">{description}</p>
        </div>
      </div>

      <div className="space-y-3">
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className="relative">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              disabled={isConfirmed}
              className="w-5 h-5 rounded border-2 border-gray-600 bg-transparent appearance-none cursor-pointer checked:bg-purple-600 checked:border-purple-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {isChecked && (
              <Check className="w-3 h-3 text-white absolute top-1 left-1 pointer-events-none animate-in zoom-in duration-400" />
            )}
          </div>
          <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
            I've confirmed the deposit in my bank app
          </span>
        </label>

        <Button
          onClick={handleConfirm}
          disabled={!isChecked || isConfirmed}
          className={`w-full bg-purple-600 hover:bg-purple-700 text-white transition-all duration-150 ${
            isChecked && !isConfirmed ? 'hover:scale-[1.02] active:scale-[0.98]' : ''
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isConfirmed ? 'Confirmed' : 'Continue'}
        </Button>
      </div>
    </div>
  );
}

