import { useEffect, useRef } from "react";
import { TranscriptItem } from "../types";
import { MessageSquare, Bot, User, Headphones, Volume2, Sparkles } from "lucide-react";

interface TranscriptListProps {
  transcripts: TranscriptItem[];
  status: string;
  selectedLanguageLocale: string;
}

export default function TranscriptList({ transcripts, status, selectedLanguageLocale }: TranscriptListProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom dynamically whenever new items arrive or change
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [transcripts]);

  // Fallback Text to Speech functionality requested by the user
  const handleSpeakText = (e: any, text: string) => {
    e.stopPropagation();
    if (!("speechSynthesis" in window)) {
      alert("Text-to-speech is not supported in this browser.");
      return;
    }

    // Stop former audios
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = selectedLanguageLocale || "en-US";
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Optional: try to find a natural voice matching the locale
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang.startsWith(selectedLanguageLocale.slice(0, 2)));
    if (voice) {
      utterance.voice = voice;
    }

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex flex-col h-[380px] bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl overflow-hidden text-white shadow-xl" id="transcript-panel">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-white/[0.03] border-b border-white/10" id="transcript-header">
        <div className="flex items-center gap-2" id="transcript-header-left">
          <MessageSquare className="w-4 h-4 text-indigo-400" />
          <h3 className="text-xs font-bold tracking-widest uppercase text-indigo-400">Call Transcript Feed</h3>
        </div>
        <div className="flex items-center gap-2" id="transcript-header-right">
          <span className="flex h-2 w-2 relative" id="status-pulse-container">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              status === 'connected' ? 'bg-green-400' : status === 'connecting' ? 'bg-amber-400' : 'bg-white/30'
            }`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${
              status === 'connected' ? 'bg-green-500' : status === 'connecting' ? 'bg-amber-500' : 'bg-white/40'
            }`}></span>
          </span>
          <span className="text-xs font-semibold tracking-wide text-indigo-200/80 capitalize" id="status-label">
            {status}
          </span>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={containerRef} 
        className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth" 
        id="transcript-scroll-area"
      >
        {transcripts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-2 text-indigo-200/40" id="empty-transcript">
            <Headphones className="w-10 h-10 stroke-[1.2] text-indigo-400/40" id="no-transcripts-icon" />
            <p className="text-sm font-semibold" id="no-transcripts-msg">Line is silent.</p>
            {status === 'connected' ? (
              <p className="text-xs text-indigo-200/50 max-w-xs leading-relaxed" id="connected-instruction">
                Greetings! Hakim Isaac is active on the line. Speak or type in your selected language to test the customer service dialog.
              </p>
            ) : (
              <p className="text-xs text-indigo-200/50 max-w-xs leading-relaxed" id="disconnected-instruction">
                Connect the voice channel below to simulate a live customer service call stream.
              </p>
            )}
          </div>
        ) : (
          transcripts.map((item: TranscriptItem) => {
            const isUser = item.sender === 'user';
            return (
              <div
                key={item.id}
                id={`transcript-item-${item.id}`}
                className={`flex gap-3 max-w-[90%] group ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                {/* Avatar */}
                <div 
                  id={`avatar-${item.id}`}
                  className={`flex items-center justify-center w-8 h-8 rounded-full shrink-0 ${
                    isUser ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Bubble */}
                <div className="space-y-1 relative" id={`bubble-wrapper-${item.id}`}>
                  <div className="text-[10px] text-indigo-300/60 font-semibold px-1 flex items-center justify-between" id={`time-${item.id}`}>
                    <span>
                      {isUser ? 'Customer (Caller)' : 'Hakim Isaac (Rep)'} • {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                  <div 
                    id={`bubble-body-${item.id}`}
                    className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed relative flex items-start gap-2 ${
                      isUser 
                        ? 'bg-indigo-550/15 text-indigo-100 border border-indigo-400/20 rounded-tr-none' 
                        : 'bg-white/10 text-white border border-white/10 rounded-tl-none'
                    }`}
                  >
                    <span className="flex-grow">{item.text}</span>
                    
                    {/* TTS Button on bubbles for browser voice synthesis fallback */}
                    <button
                      onClick={(e) => handleSpeakText(e, item.text)}
                      title="Speak packet via browser TTS"
                      className="p-1 rounded bg-white/5 hover:bg-white/20 text-indigo-300 hover:text-white transition-all shrink-0 cursor-pointer self-end"
                      id={`bubble-tts-${item.id}`}
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
