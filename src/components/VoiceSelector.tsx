import { VOICES, VoiceName, VoiceOption } from "../types";
import { Mic, Check } from "lucide-react";

interface VoiceSelectorProps {
  selectedVoice: VoiceName;
  onVoiceChange: (voice: VoiceName) => void;
  status: string;
}

export default function VoiceSelector({ selectedVoice, onVoiceChange, status }: VoiceSelectorProps) {
  return (
    <div className="space-y-4" id="voice-selector-container">
      <div className="flex items-center gap-2" id="voice-selector-header">
        <Mic className="w-4 h-4 text-indigo-400" id="voice-selector-icon" />
        <h3 className="text-xs font-bold tracking-widest uppercase text-indigo-400">
          Choose Companion Voice
        </h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3" id="voice-selector-grid">
        {VOICES.map((voice: VoiceOption) => {
          const isSelected = voice.id === selectedVoice;
          return (
            <button
              key={voice.id}
              id={`voice-btn-${voice.id}`}
              onClick={() => onVoiceChange(voice.id)}
              className={`relative flex flex-col p-3 text-left rounded-2xl border transition-all cursor-pointer ${
                isSelected
                  ? "bg-indigo-600/20 border-indigo-400/80 shadow-[0_0_16px_rgba(99,102,241,0.35)] text-white"
                  : "bg-white/5 border-white/15 hover:border-white/30 hover:bg-white/10 text-indigo-200/80"
              }`}
            >
              <div className="flex items-center justify-between mb-2" id={`voice-meta-${voice.id}`}>
                <span className="text-xl" id={`voice-emoji-${voice.id}`}>{voice.emoji}</span>
                {isSelected && (
                  <span className="p-0.5 rounded-full bg-indigo-500 text-white shadow-md shadow-indigo-500/20" id={`voice-check-${voice.id}`}>
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
              </div>
              
              <div className="font-bold text-sm tracking-tight text-white" id={`voice-name-${voice.id}`}>
                {voice.name}
              </div>
              <div className="text-[10px] text-indigo-300 font-semibold mb-1.5" id={`voice-gender-${voice.id}`}>
                {voice.gender}
              </div>
              <div className="text-xs text-indigo-200/60 leading-relaxed font-normal mt-auto" id={`voice-desc-${voice.id}`}>
                {voice.description}
              </div>
            </button>
          );
        })}
      </div>

      {status === "connected" && (
        <p className="text-xs text-yellow-500/90 text-center" id="voice-change-hint">
          💡 Changing the voice while connected will apply to the next session. Tap "Disconnect" and "Connect" to instantly switch!
        </p>
      )}
    </div>
  );
}
