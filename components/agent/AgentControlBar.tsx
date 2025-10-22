"use client";

import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, FileText, Zap } from "lucide-react";

interface AgentControlBarProps {
  mode: "interactive" | "autoplay";
  isPlaying: boolean;
  onModeToggle: () => void;
  onPlayPause: () => void;
  onReset: () => void;
  onViewTranscript: () => void;
  playbackSpeed?: number;
  onSpeedChange?: (speed: number) => void;
}

export function AgentControlBar({
  mode,
  isPlaying,
  onModeToggle,
  onPlayPause,
  onReset,
  onViewTranscript,
  playbackSpeed = 1,
  onSpeedChange
}: AgentControlBarProps) {
  const speeds = [0.5, 1, 2];

  return (
    <div className="bg-[#1a1a1a] border-b border-gray-800 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Side - Mode Toggle */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium text-gray-400">Mode:</span>
          </div>
          
          <button
            onClick={onModeToggle}
            className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2a2a2a] hover:bg-[#3a3a3a] transition-colors"
          >
            <div className={`w-10 h-6 rounded-full transition-colors ${
              mode === "autoplay" ? "bg-blue-600" : "bg-gray-700"
            }`}>
              <div className={`w-5 h-5 bg-white rounded-full transition-transform shadow-lg mt-0.5 ${
                mode === "autoplay" ? "translate-x-5 ml-0.5" : "translate-x-0 ml-0.5"
              }`} />
            </div>
            <span className="text-sm font-medium text-white">
              {mode === "autoplay" ? "Auto-play" : "Interactive"}
            </span>
          </button>

          {/* Playback Speed (only in autoplay) */}
          {mode === "autoplay" && onSpeedChange && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Speed:</span>
              <div className="flex gap-1">
                {speeds.map((speed) => (
                  <button
                    key={speed}
                    onClick={() => onSpeedChange(speed)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      playbackSpeed === speed
                        ? "bg-blue-600 text-white"
                        : "bg-[#2a2a2a] text-gray-400 hover:bg-[#3a3a3a] hover:text-white"
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Side - Actions */}
        <div className="flex items-center gap-2">
          {/* Play/Pause (autoplay only) */}
          {mode === "autoplay" && (
            <Button
              onClick={onPlayPause}
              size="sm"
              className={`${
                isPlaying
                  ? "bg-yellow-600 hover:bg-yellow-700"
                  : "bg-green-600 hover:bg-green-700"
              } text-white`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Play
                </>
              )}
            </Button>
          )}

          {/* Reset */}
          <Button
            onClick={onReset}
            size="sm"
            variant="secondary"
            className="bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>

          {/* View Transcript */}
          <Button
            onClick={onViewTranscript}
            size="sm"
            variant="secondary"
            className="bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white"
          >
            <FileText className="w-4 h-4 mr-2" />
            View Transcript
          </Button>
        </div>
      </div>
    </div>
  );
}

