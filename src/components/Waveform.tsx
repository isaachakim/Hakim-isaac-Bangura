import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ConnectionStatus } from "../types";

interface WaveformProps {
  volume: number;       // 0 to 1
  isSpeaking: boolean;  // whether assistant is speaking
  status: ConnectionStatus;
}

export default function Waveform({ volume, isSpeaking, status }: WaveformProps) {
  const [animationOffsets, setAnimationOffsets] = useState<number[]>([]);

  useEffect(() => {
    // Generate static variations for visual variety
    const offsets = Array.from({ length: 16 }, () => Math.random() * 0.5 + 0.5);
    setAnimationOffsets(offsets);
  }, []);

  if (status === 'disconnected') {
    return (
      <div className="flex items-center justify-center h-28 w-full gap-1.5" id="waveform-idle">
        {Array.from({ length: 16 }).map((_, i) => (
          <div
            key={i}
            id={`waveform-bar-idle-${i}`}
            className="w-1.5 h-3 bg-slate-800 rounded-full transition-all duration-300"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-28 w-full gap-1.5" id="waveform-active">
      {Array.from({ length: 16 }).map((_, i) => {
        const offset = animationOffsets[i] || 1;
        
        let targetHeight = 12; // default idle minimum height
        let colorClass = "bg-violet-600/40";
        let glowClass = "";

        if (status === 'connecting') {
          // Pulse yellow when connecting
          targetHeight = 12 + Math.sin((Date.now() / 150) + i) * 10;
          colorClass = "bg-indigo-300";
          glowClass = "shadow-[0_0_8px_rgba(165,180,252,0.5)]";
        } else if (isSpeaking) {
          // Assistant is speaking - smooth rolling wave
          const waveValue = Math.sin((Date.now() / 100) + (i * 0.5)) * 0.5 + 0.5; // 0 to 1
          targetHeight = 16 + waveValue * 48 * offset;
          colorClass = "bg-white";
          glowClass = "shadow-[0_0_12px_rgba(255,255,255,0.85)]";
        } else if (volume > 0.01) {
          // User is talking - audio reactive peaks
          targetHeight = 12 + Math.min(volume * 110, 85) * offset;
          colorClass = "bg-indigo-400";
          glowClass = "shadow-[0_0_14px_rgba(129,140,248,0.8)]";
        } else {
          // Connected and idle - gentle sleeping wave
          const breathing = Math.sin((Date.now() / 300) + (i * 0.3)) * 0.5 + 0.5;
          targetHeight = 12 + breathing * 14;
          colorClass = "bg-indigo-500/50";
          glowClass = "shadow-[0_0_6px_rgba(99,102,241,0.3)]";
        }

        return (
          <motion.div
            key={i}
            id={`waveform-bar-${i}`}
            animate={{
              height: Math.max(6, targetHeight)
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 18,
              mass: 0.5
            }}
            className={`w-1.5 rounded-full transition-colors duration-300 ${colorClass} ${glowClass}`}
          />
        );
      })}
    </div>
  );
}
