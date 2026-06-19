import React, { useState, useEffect, useRef } from "react";
import { 
  Mic, 
  MicOff, 
  VolumeX, 
  Volume2, 
  Sparkles, 
  AlertCircle, 
  HelpCircle, 
  Flame, 
  MessageSquareCode, 
  ArrowUpRight, 
  Globe2,
  Lock,
  Wifi,
  Square,
  Play,
  Pause,
  Save,
  RotateCcw,
  Calendar,
  Clock,
  Plus,
  Phone,
  UserPlus,
  Code,
  FileText,
  Globe,
  Trash2,
  CheckCircle2,
  Mail,
  Send,
  Bell,
  MailCheck,
  ShieldAlert,
  Search,
  Compass,
  BookOpen,
  History
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ConnectionStatus, TranscriptItem, VoiceName, VOICES, LanguageCode, SUPPORTED_LANGUAGES, Appointment } from "./types";
import Waveform from "./components/Waveform";
import VoiceSelector from "./components/VoiceSelector";
import TranscriptList from "./components/TranscriptList";
import AppointmentPortal from "./components/AppointmentPortal";
import MVPInvestorHub from "./components/MVPInvestorHub";
import { CalendarWidget } from "./components/CalendarWidget";
import { DraftBookingPanel } from "./components/DraftBookingPanel";

let idCounter = 0;
const generateUniqueId = (prefix: string = "id") => {
  idCounter++;
  return `${prefix}-${Date.now()}-${idCounter}-${Math.random().toString(36).substring(2, 11)}`;
};

export default function App() {
  const [status, setStatus] = useState<ConnectionStatus>("disconnected");
  const [selectedVoice, setSelectedVoice] = useState<VoiceName>("Puck");
  const [selectedLang, setSelectedLang] = useState<LanguageCode>("en");
  const [transcripts, setTranscripts] = useState<TranscriptItem[]>([]);
  const [volume, setVolume] = useState<number>(0);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [outputVolume, setOutputVolume] = useState<number>(0.8);
  const [textPrompt, setTextPrompt] = useState<string>("");
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [showHelperInfo, setShowHelperInfo] = useState<boolean>(false);
  const [autoDetectedToast, setAutoDetectedToast] = useState<{ code: LanguageCode; name: string; flag: string } | null>(null);
  const [customMailNotification, setCustomMailNotification] = useState<string | null>(null);

  // Live real-time Draft Bookings state
  const [draftBooking, setDraftBooking] = useState<{
    clientName: string;
    emailAddress: string;
    date: string;
    time: string;
    serviceType: string;
    isDrafting: boolean;
    confidence: number;
    originalUtterance?: string;
    detectedLanguage?: string;
  }>({
    clientName: "Alpha Sesay",
    emailAddress: "alpha.sesay@salone.com",
    date: "2026-06-19",
    time: "02:00 PM",
    serviceType: "Business Strategy Consultation",
    isDrafting: false,
    confidence: 0.95,
  });

  // Unified view tabs for Inbound Telephony vs Outbound Hub vs West African Research
  const [activeViewTab, setActiveViewTab] = useState<'inbound' | 'outbound' | 'research'>('inbound');

  // Multi-channel Outbound states
  const [dialerPhone, setDialerPhone] = useState<string>("+232-76-904122");
  const [dialerLang, setDialerLang] = useState<LanguageCode>("krio");
  const [dialerVoice, setDialerVoice] = useState<string>("Aria");
  const [dialerClientName, setDialerClientName] = useState<string>("Amina Sesay");
  const [dialCallState, setDialCallState] = useState<'idle' | 'calling' | 'ringing' | 'connected' | 'ended'>('idle');
  const [dialDuration, setDialDuration] = useState<number>(0);
  const [dialTranscripts, setDialTranscripts] = useState<{ sender: 'agent' | 'user'; text: string; time: string }[]>([]);
  const [dialIsMuted, setDialIsMuted] = useState<boolean>(false);
  const [dialIsSpeaking, setDialIsSpeaking] = useState<boolean>(false);
  const [userSpeechInput, setUserSpeechInput] = useState<string>("");

  // Live real-time hands-free Outbound Microphone speech recognition states
  const [outboundMicActive, setOutboundMicActive] = useState<boolean>(false);
  const outboundRecognitionRef = useRef<any>(null);

  // Client Smartphone Simulator states for interactive real-time messages
  const [phoneUnlocked, setPhoneUnlocked] = useState<boolean>(false);
  const [phoneStatusTime, setPhoneStatusTime] = useState<string>("05:12");
  const [latestPhoneNotif, setLatestPhoneNotif] = useState<{ sender: string; text: string; type: 'SMS' | 'WhatsApp'; timestamp: string } | null>(null);
  const [smartphoneReplyText, setSmartphoneReplyText] = useState<string>("");

  // Google Search Grounded West African Research States
  const [researchQuery, setResearchQuery] = useState<string>("Sierra Leone cotton tree history & legacy");
  const [researchCountry, setResearchCountry] = useState<string>("Sierra Leone");
  const [researching, setResearching] = useState<boolean>(false);
  const [researchResult, setResearchResult] = useState<string | null>(
    `**Overview & Geographical Context**: The historic Cotton Tree (Ceiba pentandra) was the absolute physical and spiritual heart of Freetown, Sierra Leone, standing majestic in the center of the capital city's oldest administrative quarter near the National Museum, State House, and Supreme Court. Located at the geographic coordinates 8.4872° N, 13.2356° W, it stood as an irreplaceable physical axis for Freetown's road systems for centuries, with its massive trunk and sprawling green canopy visible across multiple hillside districts.

**Historical & Cultural Significance**: The legend of the Cotton Tree goes back to 1792, when a group of freed Black American slaves, known as the Nova Scotian Settlers, landed in Freetown. Upon arrival, they gathered beneath the colossal Cotton Tree to hold a prayer thanksgiving service, singing Christian hymns and dedicating their new home as a land of freedom. For the next 231 years, the tree stood as a living symbol of liberation, self-determination, and survival. It withstood civil conflict, colonialism, and numerous urban expansions, serving as a sacred site of memory and reflection for generations.

**Logistical & Practical Intelligence**: On May 24, 2023, following a severe wind and rainstorm, the ancient tree suffered a catastrophic natural collapse, breaking near its base. Today, the monument site remains heavily secured and actively protected by state protocols. Currency transactions near the site are managed in New Leone (SLE), with standard tourist access strictly coordinated. Travel advisories designate the surrounding Freetown central business district as highly active; standard security measures apply. Transport connects via Lungi International Airport (FNA) followed by shuttle or water taxi.

**Local Hidden Gems & Modern Highlights**: While the physical tree has fallen, the government of Sierra Leone, in collaboration with local artisans, has actively preserved the wood, transforming the fallen timber into educational sculptures, historical carvings, and national museum exhibitions. Central Freetown holds deep cultural highlights, including the nearby Sierra Leone National Museum, the historic King's Gate, and the Freetown Maroon Church, representing a continuous thread of West African resilience and heritage.`
  );
  const [researchThinking, setResearchThinking] = useState<string | null>(
    `- Goal: Investigate the historical, geographical, and logistical telemetry of Freetown's famous Cotton Tree.
- Search Strategy: Execute multi-grid queries regarding verified real-world events. Fact-checking database indicates the landmark suffered a total collapse on May 24, 2023, due to an extreme cyclonic windstorm. Checked state communications and reports from Freetown City Council.
- Verification: Confirm coordinates (8.4872° N, 13.2356° W). Cross-verify the founding date of 1792 with the arrival of Nova Scotian Settlers. High confidence assessment achieved.
- Resolution: Ensure post-collapse preservation efforts are clearly explained to the user to give 100% complete and accurate real-time contextual information.`
  );
  const [showThinking, setShowThinking] = useState<boolean>(true);
  const [researchSources, setResearchSources] = useState<any[] | null>([
    {
      web: {
        title: "Sierra Leone's historic Cotton Tree collapses in Freetown storm",
        uri: "https://www.reuters.com/world/africa/sierra-leones-historic-cotton-tree-collapses-freetown-storm-2023-05-25/"
      }
    },
    {
      web: {
        title: "Cotton Tree (Sierra Leone) - Wikipedia",
        uri: "https://en.wikipedia.org/wiki/Cotton_Tree_(Sierra_Leone)"
      }
    }
  ]);
  const [researchError, setResearchError] = useState<string | null>(null);
  const [researchHistory, setResearchHistory] = useState<{ id: string; query: string; country: string; timestamp: Date }[]>([
    { id: "1", query: "Sierra Leone cotton tree history & legacy", country: "Sierra Leone", timestamp: new Date() },
    { id: "2", query: "Dakar Goree Island tourist advisory", country: "Senegal", timestamp: new Date(Date.now() - 3600000) },
    { id: "3", query: "Accra modern tech hubs and currency rates", country: "Ghana", timestamp: new Date(Date.now() - 7200000) }
  ]);

  // SMS Logs & Messaging state
  const [msgRecipient, setMsgRecipient] = useState<string>("+232-76-222333");
  const [msgClientName, setMsgClientName] = useState<string>("Mohamed Bangura");
  const [msgBody, setMsgBody] = useState<string>("Hello, your voice booking has been logged successfully! Hakim Isaac will follow up in 24 hours.");
  const [msgType, setMsgType] = useState<'sms' | 'whatsapp'>('sms');
  const [dispatchedMessages, setDispatchedMessages] = useState<{
    id: string;
    recipient: string;
    clientName: string;
    body: string;
    type: 'SMS' | 'WhatsApp';
    timestamp: Date;
    status: 'Delivered' | 'Pending' | 'Bounced';
    direction: 'inbound' | 'outbound';
  }[]>([
    {
      id: "msg-1",
      recipient: "+232-76-444555",
      clientName: "Aminata Koroma",
      body: "VoiceCore platform setup complete for agt_abc123. Dialing linked E.164 phone numbers with 99.8% SLA.",
      type: "SMS",
      timestamp: new Date(Date.now() - 3600000 * 2),
      status: "Delivered",
      direction: "outbound"
    },
    {
      id: "msg-2",
      recipient: "+232-76-333444",
      clientName: "Mohamed Bangura",
      body: "Follow up on data bundle complaint - Ref #VC-00291. Connecting live via Krio voice channel.",
      type: "WhatsApp",
      timestamp: new Date(Date.now() - 1800000),
      status: "Delivered",
      direction: "outbound"
    }
  ]);

  // Outbound call native timer references
  const dialTimerRef = useRef<any>(null);

  // Smartphone clock live feed
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hrs = now.getHours();
      let mins = now.getMinutes();
      const str = `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
      setPhoneStatusTime(str);
    };
    updateTime();
    const t = setInterval(updateTime, 60000);
    return () => clearInterval(t);
  }, []);

  // Continuous speech-to-text recognition effect for interactive cellular dialers
  useEffect(() => {
    if (dialCallState !== 'connected' || !outboundMicActive) {
      if (outboundRecognitionRef.current) {
        try {
          outboundRecognitionRef.current.stop();
        } catch (e) {}
        outboundRecognitionRef.current = null;
      }
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("[Outbound Voice] SpeechRecognition API is unsupported by browser host.");
      return;
    }

    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;
    // Align speech-to-text language code with our dialect selection
    rec.lang = dialerLang === 'krio' ? 'en-US' : (dialerLang === 'pcm' ? 'en-IN' : dialerLang);

    let silenceTimer: any = null;

    rec.onstart = () => {
      console.log("[Outbound Voice] Web Mic streaming engaged...");
    };

    rec.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      const activeText = finalTranscript || interimTranscript;
      if (activeText.trim()) {
        setUserSpeechInput(activeText);

        // Handle auto-dispatch when user stops speaking for 1.3 seconds
        if (silenceTimer) clearTimeout(silenceTimer);
        silenceTimer = setTimeout(() => {
          if (activeText.trim()) {
            sendUserResponseToOutboundCall(activeText.trim());
          }
        }, 1300);
      }
    };

    rec.onerror = (err: any) => {
      console.warn("[Outbound Voice] Error:", err.error);
    };

    rec.onend = () => {
      // Keep it listening continuously during live active connection
      if (dialCallState === 'connected' && outboundMicActive) {
        try {
          rec.start();
        } catch (e) {}
      }
    };

    outboundRecognitionRef.current = rec;
    try {
      rec.start();
    } catch (e) {
      console.error(e);
    }

    return () => {
      if (silenceTimer) clearTimeout(silenceTimer);
      if (outboundRecognitionRef.current) {
        try {
          outboundRecognitionRef.current.stop();
        } catch (e) {}
        outboundRecognitionRef.current = null;
      }
    };
  }, [dialCallState, outboundMicActive, dialerLang]);

  const startDialOutCall = () => {
    if (!dialerPhone.trim()) {
      alert("Please enter a valid recipient phone number.");
      return;
    }
    setDialCallState('calling');
    setDialDuration(0);
    setDialTranscripts([
      { sender: 'agent', text: `🛸 [VOICE ENGINE INITIALIZING] Establishing SIP Trunk connection...`, time: new Date().toLocaleTimeString() }
    ]);

    // Stage 1: Calling (1.5 seconds)
    setTimeout(() => {
      setDialCallState('ringing');
      setDialTranscripts(prev => [
        ...prev,
        { sender: 'agent', text: `☎️ [RINGING] Outbound trunk signaling to cellular node ${dialerPhone}...`, time: new Date().toLocaleTimeString() }
      ]);

      // Stage 2: Ringing (2.5 seconds)
      setTimeout(() => {
        setDialCallState('connected');
        setDialTranscripts(prev => [
          ...prev,
          { sender: 'agent', text: `💬 [CONNECTED] Call answered by ${dialerClientName || "Customer"}! Syncing Speech-To-Text...`, time: new Date().toLocaleTimeString() }
        ]);

        // Synthesize voice intro on Answer
        const voiceLanguageMap: Record<string, string> = {
          en: "en-US",
          fr: "fr-FR",
          es: "es-ES",
          ar: "ar-SA",
          krio: "en-GB", 
          pcm: "en-IN"  
        };
        const activeLangCode = dialerLang;
        const msgText = `Hello ${dialerClientName || "there"}! This is Aria, your VoiceCore operations representative. We are calling you on your phone line ${dialerPhone} regarding your recent voice request. How can I help you today?`;
        
        // play voice aloud
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel(); // kill active speaks
          const utterance = new SpeechSynthesisUtterance(msgText);
          utterance.lang = voiceLanguageMap[activeLangCode] || "en-US";
          if (dialerVoice === "Solomon") {
            utterance.pitch = 0.6;
            utterance.rate = 0.85;
          } else if (dialerVoice === "Aria") {
            utterance.pitch = 1.15;
            utterance.rate = 1.0;
          } else {
            utterance.pitch = 0.9;
            utterance.rate = 0.95;
          }
          window.speechSynthesis.speak(utterance);
        }

        // Add intro agent dialog item
        setDialTranscripts(prev => [
          ...prev,
          { sender: 'agent', text: msgText, time: new Date().toLocaleTimeString() }
        ]);

        // Start call duration counter
        dialTimerRef.current = setInterval(() => {
          setDialDuration(d => d + 1);
        }, 1000);

      }, 2500);

    }, 1500);
  };

  const endDialOutCall = () => {
    if (dialTimerRef.current) {
      clearInterval(dialTimerRef.current);
    }
    setDialCallState('ended');
    setDialTranscripts(prev => [
      ...prev,
      { sender: 'agent', text: `⏹️ [DISCONNECTED] Call session terminated by agent. Bandwidth billed: ${dialDuration}s`, time: new Date().toLocaleTimeString() }
    ]);

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    
    // reset after 4 seconds
    setTimeout(() => {
      setDialCallState('idle');
    }, 3000);
  };

  const sendUserResponseToOutboundCall = (overrideText?: string) => {
    const userText = overrideText || userSpeechInput;
    if (!userText.trim()) return;

    setUserSpeechInput("");

    // Append user transcript item
    setDialTranscripts(prev => [
      ...prev,
      { sender: 'user', text: userText, time: new Date().toLocaleTimeString() }
    ]);

    // Simulate Agent response after 1.2 seconds
    setDialIsSpeaking(true);
    setTimeout(() => {
      setDialIsSpeaking(false);
      
      const responses: string[] = [
        `Thank you for that feedback! We have successfully updated your account record under phone number ${dialerPhone}.`,
        `Perfect. I have registered your callback intention into our master CRM. Is there anything else you would like to note?`,
        `Understood. Our technical telecom team has logged this report. We will dispatch a follow-up SMS text confirmation with live update tags.`,
        `That sounds completely fine. I am marking this appointment booking as high priority.`,
        `Fabulous details! Your telemetry connection is synced perfectly, thank you.`
      ];
      const randomReply = responses[Math.floor(Math.random() * responses.length)];
      
      setDialTranscripts(prev => [
        ...prev,
        { sender: 'agent', text: randomReply, time: new Date().toLocaleTimeString() }
      ]);

      // Speak back
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(randomReply);
        
        // Match dialect speaking pitch and accent
        const voiceLanguageMap: Record<string, string> = {
          en: "en-US",
          fr: "fr-FR",
          es: "es-ES",
          ar: "ar-SA",
          krio: "en-GB", 
          pcm: "en-IN"  
        };
        utterance.lang = voiceLanguageMap[dialerLang] || "en-US";
        if (dialerVoice === "Solomon") {
          utterance.pitch = 0.6;
          utterance.rate = 0.85;
        } else if (dialerVoice === "Aria") {
          utterance.pitch = 1.15;
          utterance.rate = 1.0;
        } else {
          utterance.pitch = 0.9;
          utterance.rate = 0.95;
        }
        window.speechSynthesis.speak(utterance);
      }

    }, 1200);
  };

  const handleSendInstantMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgRecipient.trim() || !msgBody.trim()) {
      alert("Please fill in recipient phone and message content.");
      return;
    }

    const newMsg = {
      id: generateUniqueId("msg"),
      recipient: msgRecipient,
      clientName: msgClientName || "Customer Link",
      body: msgBody,
      type: msgType === 'whatsapp' ? ('WhatsApp' as const) : ('SMS' as const),
      timestamp: new Date(),
      status: 'Delivered' as const,
      direction: 'outbound' as const
    };

    setDispatchedMessages(prev => [newMsg, ...prev]);

    // Set simulated incoming notification on customer smartphone simulator
    setLatestPhoneNotif({
      sender: "VoiceCore Gateway",
      text: msgBody,
      type: msgType === 'whatsapp' ? ('WhatsApp' as const) : ('SMS' as const),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    setMsgBody(""); // clear body
    
    // Play sweet note sound alert in UI
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.1); // E5
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
    } catch {}

    // Show a beautiful toast notification
    setCustomMailNotification(`Dispatched ${newMsg.type} successfully to ${newMsg.clientName}!`);
    setTimeout(() => setCustomMailNotification(null), 3000);
  };

  const executeRegionalResearch = async (forcedQuery?: string, forcedCountry?: string) => {
    const targetQuery = forcedQuery !== undefined ? forcedQuery : researchQuery;
    const targetCountry = forcedCountry !== undefined ? forcedCountry : researchCountry;

    if (!targetQuery.trim()) {
      setResearchError("Please type a place or query to investigate.");
      return;
    }

    setResearching(true);
    setResearchError(null);
    setResearchResult(null);
    setResearchThinking(null);
    setResearchSources(null);

    // Save search query into local history
    const queryExists = researchHistory.some(
      h => h.query.toLowerCase() === targetQuery.toLowerCase() && h.country.toLowerCase() === targetCountry.toLowerCase()
    );
    if (!queryExists) {
      const newHistoryItem = {
        id: generateUniqueId("res"),
        query: targetQuery,
        country: targetCountry,
        timestamp: new Date()
      };
      setResearchHistory(prev => [newHistoryItem, ...prev]);
    }

    try {
      const response = await fetch("/api/research", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          query: targetQuery,
          country: targetCountry
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned error status ${response.status}`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setResearchResult(data.text);
      setResearchThinking(data.thinking);
      if (data.groundingMetadata?.groundingChunks) {
        setResearchSources(data.groundingMetadata.groundingChunks);
      }
    } catch (err: any) {
      console.error("[Research Component Error]:", err);
      setResearchError(err.message || "Failed to perform West African research. Please check server connections.");
    } finally {
      setResearching(false);
    }
  };

  const sendInboundMessageFromSmartphone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!smartphoneReplyText.trim()) return;

    const newMsg = {
      id: generateUniqueId("msg"),
      recipient: msgRecipient,
      clientName: msgClientName || "Customer Link",
      body: smartphoneReplyText,
      type: msgType === 'whatsapp' ? ('WhatsApp' as const) : ('SMS' as const),
      timestamp: new Date(),
      status: 'Delivered' as const,
      direction: 'inbound' as const
    };

    setDispatchedMessages(prev => [newMsg, ...prev]);
    const originalReplyText = smartphoneReplyText;
    setSmartphoneReplyText("");

    // Play sweet client reply tick sound in parent screen
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(659.25, audioCtx.currentTime); // E5
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.1); // A5
      gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch {}

    // Show notification to agent that user has replied!
    setCustomMailNotification(`📥 Message reply from ${msgClientName || " Mohamed"}: "${originalReplyText.substring(0, 32)}..."`);
    setTimeout(() => setCustomMailNotification(null), 5000);

    // Auto chatbot answer from VoiceCore Agent after 1.8 seconds
    setTimeout(() => {
      const answers = [
        `Thanks for texting! Your response is registered. Speak live to our agent in Krio or English!`,
        `Got that message! Logging this note status into the unified scheduler database ledger.`,
        `Perfect confirmation receipt. Support Ticket Ref #VC-00291 has been appended with your reply.`
      ];
      const botResponse = answers[Math.floor(Math.random() * answers.length)];
      
      const botMsg = {
        id: generateUniqueId("msg"),
        recipient: msgRecipient,
        clientName: msgClientName || "Customer Link",
        body: botResponse,
        type: msgType === 'whatsapp' ? ('WhatsApp' as const) : ('SMS' as const),
        timestamp: new Date(),
        status: 'Delivered' as const,
        direction: 'outbound' as const
      };

      setDispatchedMessages(prev => [botMsg, ...prev]);

      // Sound notification for carrier automated relay
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        osc.type = "triangle";
        osc.frequency.setValueAtTime(440, audioCtx.currentTime); // A4
        gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.005, audioCtx.currentTime + 0.15);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.2);
      } catch {}

    }, 1800);
  };
  
  // Pause/Continue & Local Storage Persistence
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [savedHistory, setSavedHistory] = useState<{ id: string; date: string; len: number; text: string }[]>(() => {
    try {
      const saved = localStorage.getItem("hakim_saved_conversations");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const saveConversation = () => {
    if (transcripts.length === 0) {
      alert("No active conversation transcripts found to save.");
      return;
    }

    // 1. Download file (.txt)
    const title = `================ HAKIM ISAAC DIALOGUE TRANSCRIPT ================\n`;
    const headerInfo = `Date/Time: ${new Date().toLocaleString()}\nDialect: ${SUPPORTED_LANGUAGES.find(l=>l.code===selectedLang)?.name || selectedLang}\nVoice Partner: ${selectedVoice}\n-----------------------------------------------------------------\n\n`;
    const bodyContent = transcripts.map(item => {
      const label = item.sender === 'user' ? 'Customer (Caller)' : 'Hakim Isaac (Rep)';
      const t = item.timestamp instanceof Date ? item.timestamp : new Date(item.timestamp);
      return `[${t.toLocaleTimeString()}] ${label}:\n   ${item.text}`;
    }).join('\n\n');
    const footer = `\n\n-----------------------------------------------------------------\n© Hakim Isaac Omnichannel Platform • Real-time Multitalk agent\n=================================================================`;

    const fullBlobText = title + headerInfo + bodyContent + footer;
    const blob = new Blob([fullBlobText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `hakim-isaac-transcript-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // 2. Add to localStorage list
    const newSavedItem = {
      id: generateUniqueId("saved"),
      date: new Date().toLocaleString(),
      len: transcripts.length,
      text: fullBlobText
    };

    const nextHistory = [newSavedItem, ...savedHistory];
    setSavedHistory(nextHistory);
    try {
      localStorage.setItem("hakim_saved_conversations", JSON.stringify(nextHistory));
    } catch (e) {}
  };

  const deleteSavedConversation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const nextHistory = savedHistory.filter(h => h.id !== id);
    setSavedHistory(nextHistory);
    try {
      localStorage.setItem("hakim_saved_conversations", JSON.stringify(nextHistory));
    } catch (e) {}
  };
  
  // Email log interface
  interface SentEmail {
    id: string;
    recipient: string;
    sender: string;
    subject: string;
    body: string;
    timestamp: Date;
    status: 'Delivered' | 'Sending';
  }

  // Business customer appointments logs - replaced phoneNumber with emailAddress as requested
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: "app-1",
      clientName: "Musa Kargbo",
      emailAddress: "musa.kargbo@gmail.com",
      date: "2026-06-15",
      time: "07:44 AM", // Matches current metadata hour so it can trigger!
      serviceType: "Business Inquiry Call",
      status: "confirmed",
      remarks: "Wants Hakim Isaac to review custom business invoices in Krio dialect.",
      createdAt: new Date("2026-06-15"),
      emailSent: true
    },
    {
      id: "app-2",
      clientName: "Amina Al-Jamil",
      emailAddress: "amina.aljamil@dubai-estate.ae",
      date: "2026-06-20",
      time: "02:00 PM",
      serviceType: "Real Estate Appointment Scheduling",
      status: "pending",
      remarks: "Requested Arabic call callback to survey Dubai real estate catalog.",
      createdAt: new Date("2026-06-14"),
      emailSent: false
    },
    {
      id: "app-3",
      clientName: "Oluwaseun Adebayo",
      emailAddress: "oluwaseun@lagostransport.ng",
      date: "2026-06-15",
      time: "11:00 AM",
      serviceType: "Consultancy Appointment",
      status: "completed",
      remarks: "Discussed company logistics in Nigerian Pidgin feedback session.",
      createdAt: new Date("2026-06-15"),
      emailSent: true
    }
  ]);

  const [sentEmails, setSentEmails] = useState<SentEmail[]>([
    {
      id: "mail-1",
      recipient: "oluwaseun@lagostransport.ng",
      sender: "hakimisaac001@gmail.com",
      subject: "Hakim Isaac Booking Confirmation",
      body: "Hello Oluwaseun Adebayo,\n\nWe are pleased to confirm your appointment for Consultancy Appointment scheduled on 2026-06-15 at 11:00 AM with customer agent Hakim Isaac.\n\nBest wishes,\nHakim Isaac Customer Support team",
      timestamp: new Date("2026-06-15T07:20:00"),
      status: "Delivered"
    },
    {
      id: "mail-2",
      recipient: "musa.kargbo@gmail.com",
      sender: "hakimisaac001@gmail.com",
      subject: "Hakim Isaac Booking Confirmation",
      body: "Hello Musa Kargbo,\n\nWe are pleased to confirm your appointment for Business Inquiry Call scheduled on 2026-06-15 at 07:44 AM with customer agent Hakim Isaac.\n\nBest wishes,\nHakim Isaac Customer Support team",
      timestamp: new Date("2026-06-15T07:25:00"),
      status: "Delivered"
    }
  ]);

  // Active reminder states
  const [activeReminder, setActiveReminder] = useState<Appointment | null>(null);
  const [dismissedReminders, setDismissedReminders] = useState<string[]>([]);

  // Appointment creation builder fields
  const [newClientName, setNewClientName] = useState("");
  const [newEmailAddress, setNewEmailAddress] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [newService, setNewService] = useState("Product Support Consultation");
  const [newRemarks, setNewRemarks] = useState("");

  const triggerConfirmationEmail = (app: Appointment) => {
    const newMail: SentEmail = {
      id: generateUniqueId("mail"),
      recipient: app.emailAddress,
      sender: "hakimisaac001@gmail.com",
      subject: `Hakim Isaac: Appointment Booking Confirmation (${app.serviceType})`,
      body: `Hello ${app.clientName},\n\nWe are pleased to confirm your appointment details with Hakim Isaac Customer Service:\n\n📅 Date: ${app.date}\n⏰ Time: ${app.time}\n💼 Service Type: ${app.serviceType}\n\nHakim Isaac will contact you on the scheduled date as set. If you need any further assistance, do not hesitate to contact us at hakimisaac001@gmail.com.\n\nBest regards,\nHakim Isaac Business Operations Office\nSender: hakimisaac001@gmail.com`,
      timestamp: new Date(),
      status: 'Sending'
    };

    setSentEmails(prev => [newMail, ...prev]);

    // Simulate successful SMTP dispatch delay
    setTimeout(() => {
      setSentEmails(prev => prev.map(m => m.id === newMail.id ? { ...m, status: 'Delivered' } : m));
      setAppointments(prev => prev.map(a => a.id === app.id ? { ...a, emailSent: true } : a));
    }, 1500);
  };

  const handleAddNewAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName.trim() || !newEmailAddress.trim()) return;

    const newAppointment: Appointment = {
      id: generateUniqueId("app"),
      clientName: newClientName,
      emailAddress: newEmailAddress,
      date: newDate || new Date().toISOString().split('T')[0],
      time: newTime || "12:00 PM",
      serviceType: newService,
      status: "pending",
      remarks: newRemarks,
      createdAt: new Date(),
      emailSent: false
    };

    setAppointments([newAppointment, ...appointments]);
    triggerConfirmationEmail(newAppointment);
    
    // Reset form fields
    setNewClientName("");
    setNewEmailAddress("");
    setNewDate("");
    setNewTime("");
    setNewRemarks("");

    // Simulate speech feedback
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const txt = `Appointment for ${newClientName} on ${newDate || "today"} is registered. A confirmation email has been dispatched from hakimisaac001@gmail.com.`;
      const utter = new SpeechSynthesisUtterance(txt);
      const curL = SUPPORTED_LANGUAGES.find(l => l.code === selectedLang);
      utter.lang = curL?.locale || 'en-US';
      window.speechSynthesis.speak(utter);
    }
  };

  const handleToggleStatus = (id: string) => {
    setAppointments(prev => prev.map(item => {
      if (item.id === id) {
        const nextStatus = item.status === 'pending' ? 'confirmed' : item.status === 'confirmed' ? 'completed' : 'pending';
        return { ...item, status: nextStatus };
      }
      return item;
    }));
  };

  const handleDeleteAppointment = (id: string) => {
    setAppointments(prev => prev.filter(item => item.id !== id));
  };

  const triggerReminderAlert = (app: Appointment) => {
    if (activeReminder?.id === app.id || dismissedReminders.includes(app.id)) return;
    
    setActiveReminder(app);

    // Audio chime tone
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sine";
        osc.frequency.value = 880;
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.55);
      }
    } catch(e) {
      console.warn("Unable to play notification audio chime", e);
    }

    // TTS Voice synthesis
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const prompt = `Hakim Isaac reminder alert: It is time for your customer appointment with ${app.clientName} for ${app.serviceType}.`;
      const utter = new SpeechSynthesisUtterance(prompt);
      utter.rate = 1.0;
      window.speechSynthesis.speak(utter);
    }
  };

  // Timer checking for matching scheduling hours - "notify me when it's time"
  useEffect(() => {
    const checker = setInterval(() => {
      const now = new Date();
      // Format to YYYY-MM-DD local
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      
      // Time format
      let hours = now.getHours();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      const minsStr = String(now.getMinutes()).padStart(2, '0');
      const timeStr = `${String(hours).padStart(2, '0')}:${minsStr} ${ampm}`;

      appointments.forEach(app => {
        if (app.status !== 'completed' && !dismissedReminders.includes(app.id)) {
          const appTimeClean = app.time.trim().toUpperCase();
          const curTimeClean = timeStr.trim().toUpperCase();
          if (app.date === dateStr && appTimeClean === curTimeClean) {
            triggerReminderAlert(app);
          }
        }
      });
    }, 7000);

    return () => clearInterval(checker);
  }, [appointments, dismissedReminders]);

  // Automatic voice and text booking parser from active conversation stream
  useEffect(() => {
    if (transcripts.length === 0) return;
    const lastItem = transcripts[transcripts.length - 1];
    if (!lastItem || lastItem.sender !== 'user') return;

    const lowerText = lastItem.text.toLowerCase();

    // 1) Translate Sierra Leonean ethnic languages to English if selected or detected
    let detectedLangName = "";
    let englishTranslation = "";
    
    // Simple localization translation engine
    const slTranslation = (() => {
      const lower = lastItem.text.toLowerCase().trim();
      if (selectedLang === 'men' || lower.includes("bua") || lower.includes("bi bɛi") || lower.includes("bi bei")) {
        let trans = lastItem.text;
        trans = trans.replace(/bua/gi, "Hello");
        trans = trans.replace(/bi bɛi bɛi|bi bei bei/gi, "how are you doing");
        trans = trans.replace(/nya lyei na|nya nem na/gi, "my name is");
        trans = trans.replace(/gbeha|gba/gi, "tomorrow");
        return { translated: trans, langName: "Mende" };
      }
      if (selectedLang === 'tem' || lower.includes("sekɛ") || lower.includes("seke") || lower.includes("kɔ raye") || lower.includes("ko raye")) {
        let trans = lastItem.text;
        trans = trans.replace(/sekɛ|seke/gi, "Hello");
        trans = trans.replace(/kɔ raye|ko raye/gi, "how are you");
        trans = trans.replace(/pa nem mi/gi, "my name is");
        trans = trans.replace(/tina/gi, "tomorrow");
        return { translated: trans, langName: "Temne" };
      }
      if (selectedLang === 'lym' || lower.includes("malaŋ") || lower.includes("malang") || lower.includes("aw bɛh") || lower.includes("aw beh")) {
        let trans = lastItem.text;
        trans = trans.replace(/malaŋ|malang/gi, "Hello");
        trans = trans.replace(/aw bɛh|aw beh/gi, "how are you");
        trans = trans.replace(/tina/gi, "tomorrow");
        return { translated: trans, langName: "Limba" };
      }
      if (selectedLang === 'kno' || lower.includes("ah bɛɛ") || lower.includes("ah bee")) {
        let trans = lastItem.text;
        trans = trans.replace(/ah bɛɛ bɛi|ah bee bei/gi, "Hello, how are you");
        return { translated: trans, langName: "Kono" };
      }
      if (selectedLang === 'krio' || lower.includes("aw di bodi") || lower.includes("how di bodi")) {
        let trans = lastItem.text;
        trans = trans.replace(/aw di bodi|how di bodi/gi, "How is everything");
        trans = trans.replace(/mi nem na/gi, "my name is");
        trans = trans.replace(/wetin na yu nem/gi, "what is your name");
        trans = trans.replace(/tide|tiday/gi, "today");
        trans = trans.replace(/tina|tomara/gi, "tomorrow");
        return { translated: trans, langName: "Krio" };
      }
      return null;
    })();

    if (slTranslation) {
      detectedLangName = slTranslation.langName;
      englishTranslation = slTranslation.translated;
    }

    // 2) Parse variables for live Drafting card
    let parsedName = "";
    const nameMatch = lastItem.text.match(/(?:my name is|i am|this is|nem na|nem mi) ([a-zA-Z\s]{2,15})/i);
    if (nameMatch && nameMatch[1]) {
      parsedName = nameMatch[1].trim();
    } else {
      // search for known regional names
      const namesList = ["amina", "alpha", "isaac", "musa", "fatmata", "mohamed", "conteh", "kamara", "sesay", "kargbo", "bangura", "sallieu", "seun"];
      const words = lowerText.split(/\s+/);
      const found = words.find(w => namesList.includes(w.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"")));
      if (found) {
        parsedName = found.charAt(0).toUpperCase() + found.slice(1);
      }
    }

    let parsedDate = "";
    if (lowerText.includes("tomorrow") || lowerText.includes("tina") || lowerText.includes("gbeha") || lowerText.includes("gba")) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      parsedDate = tomorrow.toISOString().split('T')[0];
    } else if (lowerText.includes("next week")) {
      const nextW = new Date();
      nextW.setDate(nextW.getDate() + 7);
      parsedDate = nextW.toISOString().split('T')[0];
    } else if (lowerText.includes("monday")) {
      parsedDate = "2026-06-22";
    } else if (lowerText.includes("tuesday")) {
      parsedDate = "2026-06-23";
    } else if (lowerText.includes("wednesday")) {
      parsedDate = "2026-06-24";
    } else if (lowerText.includes("thursday")) {
      parsedDate = "2026-06-25";
    } else if (lowerText.includes("friday")) {
      parsedDate = "2026-06-19"; // tomorrow relative to June 18 2026
    } else {
      const ymdMatch = lastItem.text.match(/\d{4}-\d{2}-\d{2}/);
      if (ymdMatch) {
        parsedDate = ymdMatch[0];
      }
    }

    let parsedTime = "";
    const hmAmPmMatch = lastItem.text.match(/(\d{1,2}):(\d{2})\s*(am|pm)/i);
    if (hmAmPmMatch) {
       parsedTime = `${hmAmPmMatch[1].padStart(2, '0')}:${hmAmPmMatch[2]} ${hmAmPmMatch[3].toUpperCase()}`;
    } else {
       const singleHrMatch = lastItem.text.match(/(\d{1,2})\s*(am|pm)/i);
       if (singleHrMatch) {
         parsedTime = `${singleHrMatch[1].padStart(2, '0')}:00 ${singleHrMatch[2].toUpperCase()}`;
       }
    }

    let parsedService = "";
    if (lowerText.includes("consult") || lowerText.includes("business") || lowerText.includes("strategy")) {
      parsedService = "Product Strategy Consultation";
    } else if (lowerText.includes("market") || lowerText.includes("trade") || lowerText.includes("cocoa") || lowerText.includes("rice")) {
      parsedService = "West African Trade Brokerage";
    } else if (lowerText.includes("estate") || lowerText.includes("property") || lowerText.includes("land")) {
      parsedService = "Real Estate Advisory";
    } else if (lowerText.includes("health") || lowerText.includes("doctor") || lowerText.includes("medical")) {
      parsedService = "Community Medical Consultation";
    }

    // Update real-time Draft Bookings monitor coordinates
    setDraftBooking(prev => {
      return {
        clientName: parsedName || prev.clientName,
        emailAddress: prev.emailAddress,
        date: parsedDate || prev.date,
        time: parsedTime || prev.time,
        serviceType: parsedService || prev.serviceType,
        isDrafting: true,
        confidence: 0.96,
        originalUtterance: lastItem.text,
        detectedLanguage: detectedLangName || undefined
      };
    });

    const isBookingPhrase = 
      lowerText.includes("book") || 
      lowerText.includes("schedul") || 
      lowerText.includes("appoint") || 
      lowerText.includes("reserve") || 
      lowerText.includes("confirm") ||
      lowerText.includes("calendar");

    if (isBookingPhrase) {
      // Prevent double triggers
      if ((window as any)._lastParsedTranscriptId === lastItem.id && (window as any)._lastParsedTranscriptLength === lastItem.text.length) {
        return;
      }
      (window as any)._lastParsedTranscriptId = lastItem.id;
      (window as any)._lastParsedTranscriptLength = lastItem.text.length;

      const finalName = parsedName || "Voice Caller";
      const finalDate = parsedDate || "2026-06-19";
      const finalTime = parsedTime || "04:30 PM";
      const finalService = parsedService || "Enterprise Scheduling Session";
      const finalEmail = "customer@hakimisaac001.com";

      const autoApp: Appointment = {
        id: generateUniqueId("auto-app"),
        clientName: finalName,
        emailAddress: finalEmail,
        date: finalDate,
        time: finalTime,
        serviceType: finalService,
        status: "confirmed",
        remarks: `Auto-booked via ${detectedLangName || 'English'} voice analysis: "${lastItem.text}"`,
        createdAt: new Date(),
        emailSent: false
      };

      setAppointments(prev => [autoApp, ...prev]);
      triggerConfirmationEmail(autoApp);

      setDraftBooking(prev => ({
        ...prev,
        clientName: finalName,
        date: finalDate,
        time: finalTime,
        serviceType: finalService,
        isDrafting: false
      }));

      if ("speechSynthesis" in window) {
        const confirmSentence = `Perfect! I have automatically booked an appointment for ${finalName} on ${finalDate} at ${finalTime}. I have verified this instantly.`;
        const msg = new SpeechSynthesisUtterance(confirmSentence);
        window.speechSynthesis.speak(msg);
      }
    }
  }, [transcripts]);

  // References for WebAudio and Websockets
  const wsRef = useRef<WebSocket | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const outputGainNodeRef = useRef<GainNode | null>(null);
  
  // Audio playback scheduling state
  const nextPlaybackTimeRef = useRef<number>(0);
  const activePlaybackNodesRef = useRef<AudioBufferSourceNode[]>([]);
  const activeNodesCountRef = useRef<number>(0);

  // Storing mute reference for onAudioProcess callback closure
  const mutedRef = useRef<boolean>(isMuted);
  useEffect(() => {
    mutedRef.current = isMuted;
  }, [isMuted]);

  // Storing pause reference for onAudioProcess callback closure
  const pausedRef = useRef<boolean>(isPaused);
  useEffect(() => {
    pausedRef.current = isPaused;
    if (isPaused) {
      stopAllPlayback();
    }
  }, [isPaused]);

  // Storing language reference for websocket onmessage callback closure
  const selectedLangRef = useRef<LanguageCode>(selectedLang);
  useEffect(() => {
    selectedLangRef.current = selectedLang;
  }, [selectedLang]);

  // Handle manual output gain updates
  useEffect(() => {
    if (outputGainNodeRef.current) {
      outputGainNodeRef.current.gain.value = outputVolume;
    }
  }, [outputVolume]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      disconnectSession();
    };
  }, []);

  // Real-time language and dialect detection scoring heuristic
  const detectLanguage = (text: string): LanguageCode | null => {
    const normalized = text.toLowerCase();
    
    let scores = {
      en: 0,
      fr: 0,
      es: 0,
      ar: 0,
      pcm: 0,
      kri: 0
    };

    // 1. Arabic alphabets or phonetic transliterated expressions
    if (/[\u0600-\u06FF\u0750-\u077F]/.test(text)) {
      scores.ar += 15;
    }
    const arWords = ["salam", "shukran", "marhaba", "habibi", "alaikum", "na'am", "laa", "marhaban"];
    arWords.forEach(word => {
      if (new RegExp(`\\b${word}\\b`).test(normalized)) {
        scores.ar += 4;
      }
    });

    // 2. French lexical items
    const frWords = [
      "bonjour", "merci", "salut", "s'il", "vous", "plait", "plaît", "oui", "non", 
      "rendez-vous", "rendezvous", "monsieur", "madame", "comment", "avec", "pour", 
      "suis", "est", "une", "des", "les", "aux"
    ];
    frWords.forEach(word => {
      if (normalized.includes(word)) {
        scores.fr += 3;
      }
    });

    // 3. Spanish lexical items
    const esWords = [
      "hola", "gracias", "por favor", "si", "sí", "buenos", "dias", "días", "tardes", 
      "reunion", "reunión", "cita", "con", "para", "como", "tengo", "estoy"
    ];
    esWords.forEach(word => {
      if (normalized.includes(word)) {
        scores.es += 3;
      }
    });

    // 4. Sierra Leone Krio native patterns
    const kriWords = [
      "aw di bodi", "di bodi fine", "aw yu slip", "tenki", "kushe", "bɔdi", "mɔnin", "ivnin", 
      "unɔ", "pɔsin", "fɔ", "lɛk", "ba", "tiday", "sef", "leone", "siera", "makit", "kias",
      "bodi", "monin", "evnin", "lan krio", "nɔ", "go makit", "nar", "fow", "ɔn"
    ];
    kriWords.forEach(word => {
      if (normalized.includes(word)) {
        scores.kri += 5;
      }
    });

    // 5. Nigerian Pidgin patterns
    const pcmWords = [
      "abeg", "dey", "how far", "no wahala", "biko", "shey", "wahala", "shayo", "jare", 
      "commot", "una dey", "pikin", "chop", "sabi", "wetin", "dem", "naija"
    ];
    pcmWords.forEach(word => {
      if (normalized.includes(word)) {
        if (["wetin", "sabi", "pikin", "dem"].includes(word)) {
          scores.pcm += 3;
          scores.kri += 2; // overlap with Krio
        } else {
          scores.pcm += 5;
        }
      }
    });

    // 6. English vocabulary
    const enWords = [
      "hello", "schedule", "appointment", "meeting", "tomorrow", "booking", "please", 
      "thank you", "support", "register", "corporate", "office"
    ];
    enWords.forEach(word => {
      if (new RegExp(`\\b${word}\\b`).test(normalized)) {
        scores.en += 1;
      }
    });

    // Extract best candidate
    let maxScore = 0;
    let detected: LanguageCode | null = null;

    (Object.keys(scores) as LanguageCode[]).forEach(lang => {
      if (scores[lang] > maxScore) {
        maxScore = scores[lang];
        detected = lang;
      }
    });

    if (maxScore >= 3) {
      return detected;
    }
    return null;
  };

  // Downsample helper: Converts arbitrary mic rate to 16kHz
  const downsampleBuffer = (
    buffer: Float32Array, 
    inputSampleRate: number, 
    outputSampleRate: number
  ): Float32Array => {
    if (inputSampleRate === outputSampleRate) return buffer;
    const sampleRateRatio = inputSampleRate / outputSampleRate;
    const newLength = Math.round(buffer.length / sampleRateRatio);
    const result = new Float32Array(newLength);
    let offsetResult = 0;
    let offsetBuffer = 0;

    while (offsetResult < result.length) {
      const nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
      let accum = 0;
      let count = 0;
      for (let i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
        accum += buffer[i];
        count++;
      }
      result[offsetResult] = count > 0 ? accum / count : 0;
      offsetResult++;
      offsetBuffer = nextOffsetBuffer;
    }
    return result;
  };

  // Convert float to 16-bit signed PCM
  const floatTo16BitPCM = (floatData: Float32Array): ArrayBuffer => {
    const buffer = new ArrayBuffer(floatData.length * 2);
    const view = new DataView(buffer);
    for (let i = 0; i < floatData.length; i++) {
      const s = Math.max(-1, Math.min(1, floatData[i]));
      view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
    return buffer;
  };

  // Convert buffer to base64
  const bufferToBase64 = (buffer: ArrayBuffer): string => {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  // Playback precise queued PCM sound packet at 24kHz
  const playPCMChunk = (base64PCM: string) => {
    const outCtx = outputAudioCtxRef.current;
    if (!outCtx) return;

    try {
      // 1. Base64 decode to Int16 values
      const binaryString = atob(base64PCM);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const int16Array = new Int16Array(bytes.buffer);

      // 2. Map Int16 integers [-32768, 32767] to floats [-1.0, 1.0]
      const floatBuffer = new Float32Array(int16Array.length);
      for (let i = 0; i < int16Array.length; i++) {
        floatBuffer[i] = int16Array[i] / 32768.0;
      }

      // 3. Create AudioBuffer (Mono, 24kHz)
      const audioBuffer = outCtx.createBuffer(1, floatBuffer.length, 24000);
      audioBuffer.getChannelData(0).set(floatBuffer);

      // 4. Create source node and hook up to gain node
      const sourceNode = outCtx.createBufferSource();
      sourceNode.buffer = audioBuffer;
      sourceNode.connect(outputGainNodeRef.current || outCtx.destination);

      // 5. Precisely chain/schedule output playback time
      const currentTime = outCtx.currentTime;
      if (nextPlaybackTimeRef.current < currentTime) {
        nextPlaybackTimeRef.current = currentTime + 0.05; // tiny buffer block to absorb latency
      }

      sourceNode.start(nextPlaybackTimeRef.current);
      nextPlaybackTimeRef.current += audioBuffer.duration;

      // 6. Track active nodes for interrupt handling and speaking activity toggle
      activePlaybackNodesRef.current.push(sourceNode);
      activeNodesCountRef.current++;
      setIsSpeaking(true);

      sourceNode.onended = () => {
        activeNodesCountRef.current = Math.max(0, activeNodesCountRef.current - 1);
        if (activeNodesCountRef.current === 0) {
          setIsSpeaking(false);
        }
        
        // Remove from reference tracking list
        const index = activePlaybackNodesRef.current.indexOf(sourceNode);
        if (index > -1) {
          activePlaybackNodesRef.current.splice(index, 1);
        }
      };

    } catch (err) {
      console.error("[Audio] Error playing returned spoken packet:", err);
    }
  };

  // Stop all active assistant playbacks instantly (interruption)
  const stopAllPlayback = () => {
    activePlaybackNodesRef.current.forEach(node => {
      try {
        node.stop();
      } catch (e) {
        // node already stopped or not started
      }
    });
    activePlaybackNodesRef.current = [];
    activeNodesCountRef.current = 0;
    nextPlaybackTimeRef.current = 0;
    setIsSpeaking(false);
  };

  // Disconnect session and release mics completely
  const cleanupMediaResources = () => {
    if (processorRef.current) {
      try {
        processorRef.current.disconnect();
      } catch (e) {}
      processorRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        try { track.stop(); } catch(e){}
      });
      streamRef.current = null;
    }
    if (inputAudioCtxRef.current) {
      try {
        inputAudioCtxRef.current.close();
      } catch(e){}
      inputAudioCtxRef.current = null;
    }
    if (outputAudioCtxRef.current) {
      try {
        outputAudioCtxRef.current.close();
      } catch (e) {}
      outputAudioCtxRef.current = null;
    }
    outputGainNodeRef.current = null;
    stopAllPlayback();
    setVolume(0);
    setIsSpeaking(false);
  };

  const disconnectSession = () => {
    if (wsRef.current) {
      try {
        wsRef.current.close();
      } catch (e) {}
      wsRef.current = null;
    }
    cleanupMediaResources();
    setStatus("disconnected");
  };

  // Connect to server socket bridge
  const connectSession = async () => {
    if (wsRef.current) {
      disconnectSession();
    }

    setStatus("connecting");
    setConnectionError(null);

    const checkInterval = setTimeout(() => {
      if (status === "connecting") {
        setConnectionError("Handshake timed out. Check if server terminal is running or active.");
        setStatus("error");
        disconnectSession();
      }
    }, 15000);

    try {
      // 1. Establish the connection parameters
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const targetWsUrl = `${protocol}//${window.location.host}/api/live-ws?voice=${selectedVoice}&lang=${selectedLang}`;
      console.log(`[Client] Initializing socket connection at: ${targetWsUrl}`);

      const ws = new WebSocket(targetWsUrl);
      wsRef.current = ws;

      // 2. Initialize Web Audio API AudioContexts
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtxClass) {
        throw new Error("Web Audio API is not supported in this browser environment.");
      }

      // Configure playback Context at 24kHz (ideal for voice)
      const outCtx = new AudioCtxClass({ sampleRate: 24000 });
      outputAudioCtxRef.current = outCtx;

      // Configure player Volume dial gain
      const gainNode = outCtx.createGain();
      gainNode.gain.value = outputVolume;
      gainNode.connect(outCtx.destination);
      outputGainNodeRef.current = gainNode;

      // Configure capture Context at 16kHz
      const inCtx = new AudioCtxClass({ sampleRate: 16000 });
      inputAudioCtxRef.current = inCtx;

      ws.onopen = async () => {
        clearTimeout(checkInterval);
        console.log("[Client] WebSocket connection established successfully.");
        
        try {
          // Request mic access from user explicitly inside iframe container
          const micStream = await navigator.mediaDevices.getUserMedia({
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true,
            }
          });
          streamRef.current = micStream;

          const source = inCtx.createMediaStreamSource(micStream);
          const processor = inCtx.createScriptProcessor(4096, 1, 1);
          
          source.connect(processor);
          processor.connect(inCtx.destination);
          processorRef.current = processor;

          processor.onaudioprocess = (e) => {
            if (mutedRef.current || pausedRef.current) {
              setVolume(0);
              return;
            }

            const inputBuffer = e.inputBuffer.getChannelData(0);
            const downsampled = downsampleBuffer(inputBuffer, e.inputBuffer.sampleRate, 16000);

            // Volume estimation
            let sum = 0;
            for (let i = 0; i < downsampled.length; i++) {
              sum += downsampled[i] * downsampled[i];
            }
            const rms = Math.sqrt(sum / downsampled.length);
            setVolume(rms * 1.8);

            // Conversion and transport
            const pcmData = floatTo16BitPCM(downsampled);
            const base64Audio = bufferToBase64(pcmData);

            if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
              wsRef.current.send(JSON.stringify({
                type: "audio",
                audio: base64Audio
              }));
            }
          };

          setStatus("connected");

        } catch (micErr: any) {
          console.error("[Client] Failed to obtain microphone stream:", micErr);
          setConnectionError("Microphone hardware access is denied. Please permit mic access in your page permissions.");
          setStatus("error");
          disconnectSession();
        }
      };

      ws.onmessage = (event) => {
        try {
          if (pausedRef.current) {
            return; // Ignore incoming text and audio packets while conversation is paused
          }
          const packet = JSON.parse(event.data);
          
          if (packet.type === "status" && packet.status === "session-connected") {
            setStatus("connected");
          } else if (packet.type === "error") {
            setConnectionError(packet.error);
            setStatus("error");
          } else if (packet.type === "server-message") {
            // 1) Sound clip played back
            if (packet.audio) {
              playPCMChunk(packet.audio);
            }

            // 2) Stopped by interruption
            if (packet.interrupted) {
              stopAllPlayback();
            }

            // 3) Model spoken transcription
            if (packet.text) {
              const textStr = packet.text;
              setTranscripts(prev => {
                if (prev.length === 0) {
                  return [{ id: generateUniqueId("tr-model"), sender: 'model', text: textStr, timestamp: new Date() }];
                }
                const last = prev[prev.length - 1];
                if (last.sender === 'model') {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    ...last,
                    text: last.text + textStr
                  };
                  return updated;
                } else {
                  return [...prev, { id: generateUniqueId("tr-model"), sender: 'model', text: textStr, timestamp: new Date() }];
                }
              });
            }

            // 4) User voice transcribed
            if (packet.userTranscript) {
              const uText = packet.userTranscript;
              setTranscripts(prev => {
                const last = prev[prev.length - 1];
                if (last && last.sender === 'user') {
                  const durationDiff = new Date().getTime() - last.timestamp.getTime();
                  if (durationDiff < 5000) {
                    const updated = [...prev];
                    updated[updated.length - 1] = {
                      ...last,
                      text: last.text + " " + uText
                    };
                    return updated;
                  }
                }
                return [...prev, { id: generateUniqueId("tr-user"), sender: 'user', text: uText, timestamp: new Date() }];
              });

              // Real-time automatic language/dialect detection
              const detected = detectLanguage(uText);
              if (detected && detected !== selectedLangRef.current) {
                setSelectedLang(detected);
                setAutoDetectedToast({
                  code: detected,
                  name: SUPPORTED_LANGUAGES.find(l => l.code === detected)?.name || detected,
                  flag: SUPPORTED_LANGUAGES.find(l => l.code === detected)?.flag || '🌐'
                });
                setTimeout(() => setAutoDetectedToast(null), 5000);
              }
            }
          }
        } catch (msgErr) {
          console.error("[Client] Error parsing incoming bridge WebSocket payload:", msgErr);
        }
      };

      ws.onclose = () => {
        console.log("[Client] WebSocket closed.");
        setStatus(current => current === "error" ? "error" : "disconnected");
        cleanupMediaResources();
      };

      ws.onerror = (err) => {
        console.error("[Client] WebSocket connection error:", err);
        setConnectionError("Failed to communicate with full-stack socket bridge endpoint.");
        setStatus("error");
      };

    } catch (e: any) {
      console.error("[Client] Exception starting socket connection hook:", e);
      setConnectionError(e.message || "Failed to make connection.");
      setStatus("error");
      disconnectSession();
    }
  };

  // Sent typed/text input to the session
  const sendTextInput = () => {
    if (!textPrompt.trim() || !wsRef.current || status !== "connected") return;

    const textPayload = textPrompt.trim();
    
    // Add user typed speech bubble immediately
    setTranscripts(prev => [
      ...prev,
      { id: generateUniqueId("tr-user"), sender: 'user', text: textPayload, timestamp: new Date() }
    ]);

    // Send it to Gemini session over WS
    wsRef.current.send(JSON.stringify({
      type: "text",
      text: textPayload
    }));

    // Real-time language detection check for typed inputs
    const detected = detectLanguage(textPayload);
    if (detected && detected !== selectedLang) {
      setSelectedLang(detected);
      setAutoDetectedToast({
        code: detected,
        name: SUPPORTED_LANGUAGES.find(l => l.code === detected)?.name || detected,
        flag: SUPPORTED_LANGUAGES.find(l => l.code === detected)?.flag || '🌐'
      });
      setTimeout(() => setAutoDetectedToast(null), 5000);
    }

    setTextPrompt("");
  };

  const clearTranscriptLog = () => {
    setTranscripts([]);
  };

  // Helpers for clean state labels
  const getStatusBadge = () => {
    switch (status) {
      case "disconnected":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-900 text-slate-400 border border-slate-800" id="status-disconnected">
            <span className="h-2 w-2 rounded-full bg-slate-500" />
            Offline
          </span>
        );
      case "connecting":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20" id="status-connecting">
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            Connecting
          </span>
        );
      case "connected":
        if (isPaused) {
          return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-[0_0_8px_rgba(245,158,11,0.15)] animate-pulse" id="status-paused">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              Conversation Paused
            </span>
          );
        }
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_8px_rgba(16,185,129,0.15)]" id="status-connected">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Live Session Connected
          </span>
        );
      case "error":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20" id="status-error">
            <span className="h-2 w-2 rounded-full bg-red-500" />
            Error status
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#060114] text-white flex flex-col font-sans relative overflow-x-hidden" id="voice-companion-root">
      {/* Background Decor */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-0">
        <div className="w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[160px]" />
        <div className="w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[130px]" />
      </div>

      {/* Main Container */}
      <div className="flex-1 flex flex-col max-w-7xl w-full mx-auto px-4 sm:px-6 py-4 z-10 relative" id="app-wrapper">
        
        {/* Navigation Bar */}
        <nav className="py-5 flex justify-between items-center border-b border-white/5" id="branding-header">
          <div className="flex items-center space-x-3" id="brand-info">
            <div className="w-10 h-10 bg-gradient-to-tr from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/30" id="brand-logo">
              <Sparkles className="h-5 w-5 text-white animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tight bg-gradient-to-r from-white via-indigo-100 to-indigo-300 bg-clip-text text-transparent uppercase text-left leading-tight">Hakim Isaac</span>
              <span className="text-[9px] uppercase font-mono tracking-widest text-indigo-400 font-extrabold text-left">Omnichannel Voice Assistant</span>
            </div>
          </div>

          <div className="flex items-center space-x-3" id="header-actions">
            {getStatusBadge()}
            <div className="hidden md:flex items-center space-x-2 bg-white/5 px-4 py-1.5 rounded-full border border-white/5" id="telephony-engine-status">
              <Wifi className={`w-3.5 h-3.5 ${status === 'connected' ? 'text-green-400 animate-pulse' : 'text-slate-500'}`} />
              <span className="text-[10px] uppercase tracking-wider font-mono opacity-80 text-indigo-200">
                {status === 'connected' ? 'Duplex VoIP 16kHz' : 'System Ready'}
              </span>
            </div>
          </div>
        </nav>

        {/* Premium Breathtaking Hero Section */}
        <div className="py-12 md:py-16 text-center max-w-3xl mx-auto space-y-6" id="welcome-hero-section">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase bg-indigo-500/10 text-indigo-300 border border-indigo-500/10"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            Hakim Isaac Smart Intelligence Portal
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl md:text-5xl font-black tracking-tight"
          >
            <span className="bg-gradient-to-r from-white via-indigo-100 to-indigo-300 bg-clip-text text-transparent">
              HAKIM ISAAC VOICE COMPANION
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-sm md:text-base text-indigo-200/75 leading-relaxed font-sans max-w-2xl mx-auto"
          >
            A master regional agent, automated scheduling directory, and localized verification specialist operating with deep multi-step thinking. Connect your duplex audio directly to test his interactive conversational reasoning.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-3 pt-2"
          >
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium bg-white/5 border border-white/5 text-indigo-100">
              ⚡ 100% Verified Facts Checked
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium bg-white/5 border border-white/5 text-indigo-100">
              📞 Duplex VoIP
            </span>
          </motion.div>
        </div>

        {/* Unified Desktop Dual-Column Grid Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto w-full mb-12 items-start" id="app-content-grid">
          
          {/* Column 1 (Left): Voice sphere active call deck */}
          <div className="lg:col-span-12 xl:col-span-7 flex flex-col space-y-6 w-full" id="stage-left-block">
            
            {/* Show instructions/helper panel */}
            <AnimatePresence>
              {showHelperInfo && (
                <motion.div
                  key="helper-info-panel"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white/5 border border-white/10 rounded-3xl p-5 text-sm text-indigo-200/90 leading-relaxed space-y-2.5 overflow-hidden backdrop-blur-md"
                  id="instructions-box"
                >
                  <h4 className="font-extrabold text-white text-sm flex items-center gap-1.5" id="instruction-title">
                    <Sparkles className="w-4 h-4 text-indigo-400" /> Hakim Isaac Telephony Simulation
                  </h4>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs text-indigo-200/80" id="instruction-steps">
                    <li>This system establishes a duplex 16000Hz live audio socket straight to the Gemini pipeline.</li>
                    <li>To talk aloud, click the play/call button below. Remember to permit microphone access.</li>
                    <li>The default system voice is pre-set to a polished male telephony operator profile.</li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Glowing Central Voice Stage */}
            <div className="flex-grow flex flex-col items-center justify-center py-6 relative bg-white/[0.01] border border-white/5 rounded-3xl p-6" id="controller-card">
              <div className="w-52 h-52 rounded-full border-4 border-white/10 flex items-center justify-center relative mb-6 shadow-2xl transition-all duration-500" id="orbit-button-ring">
                <div className="absolute w-60 h-60 rounded-full border border-indigo-400/20 animate-pulse"></div>
                <div className="absolute w-64 h-64 rounded-full border border-white/5"></div>
                
                {/* Visual Speaking Ripples */}
                <AnimatePresence>
                  {status === 'connected' && (
                    <motion.div 
                       key="pulse-idle-ripple"
                       initial={{ scale: 0.9, opacity: 0 }}
                       animate={{ scale: 1.35, opacity: 0.12 }}
                       exit={{ scale: 0.9, opacity: 0 }}
                       transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                       className="absolute inset-0 rounded-full bg-indigo-550 pointer-events-none"
                    />
                  )}
                  {status === 'connected' && isSpeaking && (
                    <motion.div 
                       key="pulse-speaking-ripple"
                       initial={{ scale: 0.9, opacity: 0 }}
                       animate={{ scale: 1.55, opacity: 0.2 }}
                       exit={{ scale: 0.9, opacity: 0 }}
                       transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
                       className="absolute inset-0 rounded-full bg-purple-500 pointer-events-none"
                    />
                  )}
                </AnimatePresence>

                <div className="w-44 h-44 bg-gradient-to-br from-indigo-500 to-purple-700 rounded-full flex items-center justify-center shadow-2xl shadow-indigo-500/30 overflow-hidden" id="waveform-stage">
                  <Waveform volume={volume} isSpeaking={isSpeaking} status={status} />
                </div>
              </div>

              <h1 className="text-3xl font-black mb-2 tracking-tight text-white text-center" id="main-vibe-heading">
                {status === 'connected' 
                  ? (isSpeaking ? "Hakim Isaac is speaking..." : "Listening closely...") 
                  : status === 'connecting' 
                  ? "Ringing Reception..." 
                  : "Call Hakim Isaac Agent"
                }
              </h1>
              
              <p className="text-xs text-indigo-300/70 max-w-sm text-center leading-relaxed" id="main-vibe-sub">
                {status === 'connected'
                  ? `Voice connection live. Talk to schedule appointments.`
                  : "Click the call button in the deck below to stream your voice and test the interactive booking capability."
                }
              </p>

              {/* Connected details */}
              {status === "connected" && (
                <div className="mt-4 flex items-center gap-1.5 text-xs text-indigo-200 font-bold px-3 py-1 bg-indigo-500/15 border border-indigo-550/20 rounded-full" id="active-mic-badge">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-ping" />
                  Voice Connected • Male Operator Voice
                </div>
              )}
            </div>

            {/* Error messaging state */}
            <AnimatePresence>
              {connectionError && (
                <motion.div
                  key="connection-error-box"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex gap-3 text-xs text-red-200"
                  id="connection-error-box"
                >
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                  <div className="space-y-1" id="error-box-lines">
                    <p className="font-bold text-red-300" id="error-title">Stream Status Interrupt</p>
                    <p className="opacity-90 leading-relaxed font-normal" id="error-desc">{connectionError}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Circular Controller Deck Floating Footer */}
            <div className="flex justify-center items-center py-2" id="controls-panel">
              <div className="bg-white/10 backdrop-blur-xl p-2 rounded-full border border-white/20 flex space-x-3 shadow-2xl items-center" id="concentric-control-deck">
                
                {/* Help instructions button */}
                <button
                  onClick={() => setShowHelperInfo(!showHelperInfo)}
                  id="help-toggle-btn"
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                    showHelperInfo 
                      ? 'bg-white text-indigo-950 font-bold' 
                      : 'bg-white/5 hover:bg-white/25 text-white'
                  }`}
                  title="Toggle helper tips"
                >
                  <Sparkles className="w-4.5 h-4.5" />
                </button>

                {/* Microphone silent trigger button */}
                <button
                  disabled={status !== "connected"}
                  onClick={() => setIsMuted(!isMuted)}
                  id="mic-mute-btn"
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                    status !== "connected"
                      ? "text-white/20 cursor-not-allowed bg-white/5"
                      : isMuted
                      ? "bg-rose-500 text-white shadow-lg shadow-rose-500/20"
                      : "bg-white/5 hover:bg-white/25 text-white"
                  }`}
                  title={isMuted ? "Unmute Mic" : "Mute Mic"}
                >
                  {isMuted ? <MicOff className="w-4.5 h-4.5" /> : <Mic className="w-4.5 h-4.5" />}
                </button>

                {/* Pause / Resume Button */}
                <button
                  disabled={status !== "connected"}
                  onClick={() => setIsPaused(!isPaused)}
                  id="conn-pause-btn"
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                    status !== "connected"
                      ? "text-white/20 cursor-not-allowed bg-white/5"
                      : isPaused
                      ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20"
                      : "bg-white/5 hover:bg-white/25 text-white"
                  }`}
                  title={isPaused ? "Resume Conversation" : "Pause Conversation"}
                >
                  {isPaused ? <Play className="w-4.5 h-4.5 fill-current" /> : <Pause className="w-4.5 h-4.5" />}
                </button>

                {/* Primary Connection Trigger Ring Button */}
                {status === "disconnected" || status === "error" ? (
                  <button
                    onClick={connectSession}
                    id="primary-action-btn"
                    className="w-14 h-14 rounded-full bg-white hover:bg-indigo-550 flex items-center justify-center text-indigo-950 shadow-xl transition-all duration-300 font-bold cursor-pointer"
                    title="Initialize Voice Connection"
                  >
                    {status === "connecting" ? (
                      <div className="w-5 h-5 border-2 border-indigo-950 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Phone className="w-5 h-5 fill-indigo-950 text-indigo-950" />
                    )}
                  </button>
                ) : (
                  <button
                    onClick={disconnectSession}
                    id="primary-action-btn"
                    className="px-5 h-14 rounded-full bg-rose-500 hover:bg-rose-600 flex items-center justify-center space-x-2 transition-colors duration-300 shadow-xl shadow-rose-500/30 text-white font-extrabold cursor-pointer"
                    title="End Conversation"
                  >
                    <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                    <span className="text-xs uppercase tracking-wider font-extrabold">End Call</span>
                  </button>
                )}

                {/* Speaker volume control triggers */}
                <div className="flex items-center space-x-2 px-3 h-12 rounded-full bg-white/5 border border-white/5" id="speaker-volume-panel">
                  <div className="text-white/60" id="speaker-volume-icon">
                    {outputVolume === 0 ? <VolumeX className="w-4.5 h-4.5" /> : <Volume2 className="w-4.5 h-4.5 text-indigo-300" />}
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={outputVolume}
                    onChange={(e) => setOutputVolume(parseFloat(e.target.value))}
                    className="w-16 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white focus:outline-none"
                    id="volume-slider"
                  />
                </div>

                {/* Save conversation logs */}
                <button
                  disabled={transcripts.length === 0}
                  onClick={saveConversation}
                  id="save-logs-btn"
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                    transcripts.length === 0
                      ? "text-white/20 bg-white/5 cursor-not-allowed"
                      : "bg-white/5 hover:bg-indigo-500/30 hover:text-indigo-200 text-white"
                  }`}
                  title="Save/Download conversation transcript"
                >
                  <Save className="w-4.5 h-4.5" />
                </button>

                {/* Reset transcripts logs */}
                <button
                  onClick={clearTranscriptLog}
                  id="clear-logs-btn"
                  className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/20 flex items-center justify-center transition-colors text-white cursor-pointer"
                  title="Reset dialog transcript logs"
                >
                  <RotateCcw className="w-4.5 h-4.5" />
                </button>

              </div>
            </div>

          </div>

          {/* Column 2 (Right): Dynamic Calendar agenda & Live Voice-Parsed Draft state */}
          <div className="lg:col-span-12 xl:col-span-5 flex flex-col space-y-6 w-full" id="stage-right-block">
            {/* Real-time Draft Booking Telemetry Card with direct SMS/Calling engines */}
            <DraftBookingPanel
              draft={draftBooking}
              onConfirm={(finalApp) => {
                setAppointments(prev => [finalApp, ...prev]);
                // Send confirmation email
                triggerConfirmationEmail(finalApp);
                if ("speechSynthesis" in window) {
                  const speechText = `Perfect! I have manually confirmed your booking for ${finalApp.clientName} on ${finalApp.date} at ${finalApp.time}.`;
                  window.speechSynthesis.speak(new SpeechSynthesisUtterance(speechText));
                }
                setDraftBooking(prev => ({
                  ...prev,
                  isDrafting: false
                }));
              }}
              onClear={() => {
                setDraftBooking({
                  clientName: "",
                  emailAddress: "",
                  date: "",
                  time: "",
                  serviceType: "",
                  isDrafting: false,
                  confidence: 1.0,
                });
              }}
              onUpdateDraft={(updates) => {
                setDraftBooking(prev => ({ ...prev, ...updates }));
              }}
              onSimulateCall={(name, phone) => {
                setDialerPhone(phone);
                setDialerClientName(name);
                setDialCallState('calling');
                setDialDuration(0);
                
                // Trigger phone call animation simulation
                setTimeout(() => {
                  setDialCallState('ringing');
                  setTimeout(() => {
                    setDialCallState('connected');
                    // Add dialogue transcript log inside the dialer logs
                    setDialTranscripts([
                      { sender: 'agent', text: `Hello ${name}, this is Hakim Isaac, confirming your custom booking slot. Is this still fine?`, time: "Just Now" }
                    ]);
                  }, 1800);
                }, 1800);
              }}
              onSimulateSMS={(name, phone, sms) => {
                setLatestPhoneNotif({
                  sender: "Hakim Isaac Gateway",
                  text: sms,
                  type: "SMS",
                  timestamp: "Just Now"
                });
                setPhoneUnlocked(true);
              }}
              onSimulateEmail={(name, email, service, date, time) => {
                const simEmail = {
                  id: generateUniqueId("sim-mail"),
                  recipient: email,
                  sender: "hakimisaac001@gmail.com",
                  subject: `Hakim Isaac Booking Confirmation: ${service}`,
                  body: `Dear ${name},\n\nWe present you 100% verified confirmation for your upcoming appointment.\n\n📅 Scheduled Date: ${date}\n⏰ Scheduled Time: ${time}\n💼 Service Type: ${service}\n\nOur system operator Hakim Isaac will call you directly at your designated handset slot.\n\nBest regards,\nHakim Isaac Corporate Support Office`,
                  timestamp: new Date(),
                  status: "Delivered" as const
                };
                setSentEmails(prev => [simEmail, ...prev]);
              }}
            />

            {/* Standard Calendar Month Organizer Grid widget displaying auto bookings */}
            <CalendarWidget
              appointments={appointments}
              onSelectDate={(selectedDateStr) => {
                console.log("Viewing date agenda for:", selectedDateStr);
              }}
            />
          </div>

        </div>

        {/* Outbound section disabled per user request */}
        {false && (
          /* Outbound Multi-channel Communications Hub (Beautiful wide bento matrix) */
          <div className="flex-grow max-w-7xl mx-auto w-full my-6 flex flex-col items-stretch space-y-8" id="outbound-content-grid">
            
            {/* Top Row: Direct Dialer Desk (Left) + Text SMS Messenger Desk (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
              
              {/* Box 1: Outbound Telco Dialer Desk */}
              <div className="bg-gradient-to-br from-slate-900 via-indigo-950/20 to-slate-900 border border-white/10 rounded-3xl p-6 relative flex flex-col justify-between" id="telco-dialer-desk">
                
                {/* Decorative glowing lines */}
                <div className="absolute top-0 right-12 w-24 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-40 animate-pulse" />

                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-white/5 pb-3">
                    <div className="text-left">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[9px] font-mono font-bold uppercase text-emerald-300">
                        📞 OUTBOUND TELEPHONY
                      </span>
                      <h3 className="text-base font-black text-white mt-1 tracking-tight">Direct Call Dialout Operator</h3>
                    </div>
                    {dialCallState !== 'idle' && (
                      <span className="px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-[9px] font-mono font-bold text-rose-400 animate-pulse uppercase flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                        {dialCallState} • {dialDuration}s
                      </span>
                    )}
                  </div>

                  {/* Dialer form fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-indigo-300 font-bold block">Client Name</label>
                      <input
                        type="text"
                        disabled={dialCallState !== 'idle'}
                        value={dialerClientName}
                        onChange={(e) => setDialerClientName(e.target.value)}
                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-indigo-100 font-semibold focus:border-indigo-500/50 outline-none disabled:opacity-55"
                        placeholder="e.g., Amina Sesay"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-indigo-300 font-bold block">Recipient Phone (E.164)</label>
                      <input
                        type="text"
                        disabled={dialCallState !== 'idle'}
                        value={dialerPhone}
                        onChange={(e) => setDialerPhone(e.target.value)}
                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-indigo-500/50 outline-none disabled:opacity-55"
                        placeholder="+232-76-904122"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-indigo-300 font-bold block">Synthesizer Dialect</label>
                      <select
                        disabled={dialCallState !== 'idle'}
                        value={dialerLang}
                        onChange={(e) => setDialerLang(e.target.value as LanguageCode)}
                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-2.5 py-2 text-xs text-indigo-200 font-bold focus:border-indigo-500/50 outline-none disabled:opacity-55"
                      >
                        <option value="en">English (Global Office)</option>
                        <option value="krio">Krio (Native Salone)</option>
                        <option value="pcm">Pidgin (Naija/West Africa)</option>
                        <option value="es">Spanish (Castilian Dialect)</option>
                        <option value="fr">French (Parisian Core)</option>
                        <option value="ar">Arabic (Gulf Surveying)</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-indigo-300 font-bold block">Outbound Agent Voice</label>
                      <select
                        disabled={dialCallState !== 'idle'}
                        value={dialerVoice}
                        onChange={(e) => setDialerVoice(e.target.value)}
                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-2.5 py-2 text-xs text-indigo-200 font-bold focus:border-indigo-500/50 outline-none disabled:opacity-55"
                      >
                        <option value="Aria">Aria (Empathetic Female)</option>
                        <option value="Zephyr">Zephyr (Warm Male Operator)</option>
                        <option value="Solomon">Solomon (Deep Native Elder)</option>
                      </select>
                    </div>
                  </div>

                  {/* Interactive dialogue area with transcript for ongoing call */}
                  <div className="p-3 bg-slate-950 border border-white/5 rounded-2xl h-44 flex flex-col justify-between">
                    <div className="text-[9px] font-mono font-bold text-indigo-400 uppercase tracking-widest border-b border-indigo-950 pb-1 mb-1.5 flex justify-between items-center">
                      <span>📡 DUPLEX CALL SESSION TRANSCRIPT</span>
                      {dialCallState === 'connected' && <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />}
                    </div>
                    
                    {dialCallState === 'idle' ? (
                      <div className="flex-1 flex flex-col items-center justify-center text-center text-indigo-200/30 text-[11px] p-4">
                        <Phone className="w-5 h-5 text-indigo-500/40 mb-2" />
                        Trunk link standby. Click "Place Outbound Voice Call" below to initiate direct telecom dialing simulation.
                      </div>
                    ) : (
                      <div className="flex-1 overflow-y-auto space-y-2 pr-1 font-mono text-[10px] text-left">
                        {dialTranscripts.map((t, idx) => (
                          <div 
                            key={idx} 
                            className={`p-2 rounded-xl text-[10px] leading-relaxed max-w-[90%] ${
                              t.sender === 'agent' 
                                ? 'bg-indigo-950/40 text-indigo-100 border-l-2 border-indigo-500 mr-auto' 
                                : 'bg-emerald-950/40 text-emerald-100 border-l-2 border-emerald-400 ml-auto'
                            }`}
                          >
                            <div className="flex justify-between text-[8px] opacity-40 font-bold mb-0.5">
                              <span>{t.sender === 'agent' ? 'VOICECORE AGENT' : 'CLIENT'}</span>
                              <span>{t.time}</span>
                            </div>
                            <p>{t.text}</p>
                          </div>
                        ))}
                        {dialIsSpeaking && (
                          <div className="text-indigo-400 text-[10px] italic animate-pulse">
                            Aria speaking response...
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Call controller actions with active Speech Recognition handsfree support */}
                <div className="mt-4 pt-4 border-t border-white/5 font-sans" id="dialer-action-deck">
                  {dialCallState === 'idle' ? (
                    <button
                      onClick={startDialOutCall}
                      className="w-full py-3 bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-555 hover:to-indigo-555 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg hover:shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Phone className="w-4 h-4 fill-current shrink-0 animate-bounce" />
                      Place Outbound Voice Call
                    </button>
                  ) : (
                    <div className="space-y-3.5">
                      {dialCallState === 'connected' && (
                        <div className="space-y-3">
                          {/* Handsfree Toggle and Speech Indicators */}
                          <div className="p-3.5 bg-slate-950 border border-white/5 rounded-2xl flex items-center justify-between text-left">
                            <div className="space-y-1">
                              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 block flex items-center gap-1">
                                <span className={`w-2 h-2 rounded-full ${outboundMicActive ? 'bg-emerald-400 animate-ping' : 'bg-slate-600'}`} />
                                {outboundMicActive ? '🎙️ Mic Auto-Streaming Mode' : '🤐 Push-to-Text Mode'}
                              </span>
                              <p className="text-[10px] text-indigo-200/50 leading-relaxed font-semibold">
                                {outboundMicActive 
                                  ? 'Speech recognition active. Speak into mic and pause to auto-reply.' 
                                  : 'Hands-free mic disabled. Use the text prompt below or speak manually.'}
                              </p>
                            </div>
                            <button
                              onClick={() => setOutboundMicActive(!outboundMicActive)}
                              id="toggle-handsfree-mic"
                              className={`px-3 py-1.5 rounded-xl text-[9px] uppercase font-black tracking-widest transition-all cursor-pointer ${
                                outboundMicActive 
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 shadow' 
                                  : 'bg-white/5 text-white/50 border border-white/10 hover:bg-white/15'
                              }`}
                            >
                              {outboundMicActive ? 'ON' : 'OFF'}
                            </button>
                          </div>

                          {/* Render active typing waveform or speaking simulation */}
                          {outboundMicActive && (
                            <div className="h-6 flex items-center justify-center gap-1.5 px-4 bg-emerald-900/10 border border-emerald-500/10 rounded-xl" id="outbound-mic-waveform">
                              <span className="text-[8px] font-mono text-emerald-400 uppercase tracking-widest mr-2 animate-pulse">STREAMING LIVE:</span>
                              <span className="w-1 h-3 bg-emerald-400 rounded-full animate-bounce delay-100" />
                              <span className="w-1 h-5 bg-emerald-400 rounded-full animate-bounce delay-150" />
                              <span className="w-1 h-4 bg-emerald-400 rounded-full animate-bounce delay-200" />
                              <span className="w-1 h-2 bg-emerald-400 rounded-full animate-bounce delay-300" />
                              <span className="w-1 h-4.5 bg-emerald-400 rounded-full animate-bounce delay-75" />
                            </div>
                          )}

                          {/* Chat manual backup input form */}
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={userSpeechInput}
                              onChange={(e) => setUserSpeechInput(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && sendUserResponseToOutboundCall()}
                              placeholder={outboundMicActive ? "Mic is listening... Speak or type response here" : "Type customer speech response... (e.g. 'I want my invoice')"}
                              className="flex-1 bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/35 focus:border-indigo-500 outline-none"
                            />
                            <button
                              onClick={() => sendUserResponseToOutboundCall()}
                              className="px-4 bg-indigo-600 hover:bg-indigo-550 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                            >
                              Send
                            </button>
                          </div>
                        </div>
                      )}
                      
                      <button
                        onClick={endDialOutCall}
                        className="w-full py-3 bg-rose-600 hover:bg-rose-550 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Square className="w-4 h-4 fill-current shrink-0" />
                        End Outbound connection
                      </button>
                    </div>
                  )}
                </div>

              </div>

              {/* Box 2: SMS/WhatsApp Dispatch Desk & Dynamic Client Smartphone Simulator */}
              <div className="bg-gradient-to-br from-slate-900 via-emerald-950/10 to-slate-900 border border-white/10 rounded-3xl p-6 relative flex flex-col justify-between" id="sms-messaging-desk">
                
                {/* Decorative glowing lines */}
                <div className="absolute top-0 right-12 w-24 h-px bg-gradient-to-r from-transparent via-indigo-400 to-transparent opacity-40 animate-pulse" />

                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-white/5 pb-3">
                    <div className="text-left">
                      <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-[9px] font-mono font-bold uppercase text-indigo-300">
                        💬 INSTANT MESSAGING DISPATCH
                      </span>
                      <h3 className="text-base font-black text-white mt-1 tracking-tight">Direct SMS / WhatsApp Portal</h3>
                    </div>
                    <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-wider animate-pulse">
                      ⚡ Duplex Active
                    </span>
                  </div>

                  {/* Split Screen Matrix */}
                  <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
                    
                    {/* Left side: Gateway Form & Control Center */}
                    <div className="xl:col-span-7 flex flex-col justify-between space-y-4">
                      
                      <form onSubmit={handleSendInstantMessage} className="space-y-3.5 text-left">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                          <div className="space-y-1">
                            <label className="text-[10px] font-mono uppercase tracking-wider text-indigo-300 font-bold block">Client Name</label>
                            <input
                              type="text"
                              required
                              value={msgClientName}
                              onChange={(e) => setMsgClientName(e.target.value)}
                              className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-indigo-500 outline-none font-sans"
                              placeholder="e.g. Mohamed Bangura"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-mono uppercase tracking-wider text-indigo-300 font-bold block">Mobile phone number</label>
                            <input
                              type="text"
                              required
                              value={msgRecipient}
                              onChange={(e) => setMsgRecipient(e.target.value)}
                              className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-indigo-500 outline-none font-mono font-bold"
                              placeholder="+232-76-222333"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 items-center">
                          <div className="space-y-1">
                            <label className="text-[10px] font-mono uppercase tracking-wider text-indigo-300 font-bold block">Gateway Route</label>
                            <select
                              value={msgType}
                              onChange={(e) => setMsgType(e.target.value as 'sms' | 'whatsapp')}
                              className="w-full bg-slate-950 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-indigo-200 font-bold focus:border-indigo-500 outline-none"
                            >
                              <option value="sms">SMS Text Dispatch</option>
                              <option value="whatsapp">WhatsApp Official API</option>
                            </select>
                          </div>

                          {/* Load carrier Templates */}
                          <div className="space-y-1">
                            <label className="text-[10px] font-mono uppercase tracking-wider text-indigo-300 font-bold block">Quick Load Template</label>
                            <select
                              onChange={(e) => {
                                const val = e.target.value;
                                if (val === 'confirm') {
                                  setMsgBody(`Perfect ${msgClientName || "Customer"}, your VoiceCore booking appointment has been logged from our carrier trunk. Best wishes, Hakim Isaac support.`);
                                } else if (val === 'followup') {
                                  setMsgBody(`Hello ${msgClientName || "Customer"}, this is a follow-up summary of your outbound voice dial session. We are waiting on your registration receipt.`);
                                } else if (val === 'support') {
                                  setMsgBody(`Ticket #VC-90212 for client ${msgClientName || "Customer"} has been successfully processed under support trunking SLA. Status: Resolved.`);
                                }
                              }}
                              className="w-full bg-slate-900 border border-indigo-500/30 rounded-xl px-2.5 py-1.5 text-xs text-emerald-400 font-bold focus:border-indigo-500 outline-none"
                            >
                              <option value="">-- Choose Template --</option>
                              <option value="confirm">📅 Booking Appointment Confirm</option>
                              <option value="followup">⏰ Dialer Follow-Up Note</option>
                              <option value="support">🛠️ Telecom Ticket Resolution</option>
                            </select>
                          </div>
                        </div>

                        <div className="space-y-1.5 text-left">
                          <div className="flex justify-between items-center">
                            <label className="text-[10px] font-mono uppercase tracking-wider text-indigo-300 font-bold text-indigo-300 block">Message body content</label>
                            <span className="text-[9px] font-mono text-indigo-200/40">{msgBody.length} / 160 Characters standard</span>
                          </div>
                          <textarea
                            required
                            value={msgBody}
                            onChange={(e) => setMsgBody(e.target.value)}
                            className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none h-20 resize-none leading-relaxed font-mono"
                            placeholder="Type text message..."
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-555 hover:to-indigo-555 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                          Send dispatch trunk response
                        </button>
                      </form>

                      {/* Live Message logs scroll panel */}
                      <div className="pt-2 border-t border-white/5 text-left flex-1 flex flex-col justify-between">
                        <div>
                          <span className="text-[9px] font-mono font-bold text-indigo-400 uppercase tracking-widest block mb-2">
                            ✉️ SYSTEM OUTGOING LOGS FEED
                          </span>
                          <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                            {dispatchedMessages.map((msg) => (
                              <div key={msg.id} className="p-2 rounded-xl bg-slate-950 border border-white/5 text-[9.5px] space-y-1">
                                <div className="flex justify-between text-[7.5px] font-mono">
                                  <span className={`font-bold ${msg.direction === 'inbound' ? 'text-indigo-400' : 'text-emerald-400'}`}>
                                    {msg.direction === 'inbound' ? '📥 INBOUND FROM' : '📤 DISPATCH TO'} {msg.clientName}
                                  </span>
                                  <span className="opacity-40">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                                </div>
                                <p className="text-white/85 font-mono leading-relaxed">&ldquo;{msg.body}&rdquo;</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Right side: High-Fidelity CSS Smartphone Simulator */}
                    <div className="xl:col-span-5 flex flex-col items-center justify-center" id="client-smartphone-simulator">
                      <div className="w-full max-w-[240px] h-[370px] rounded-[34px] border-[6px] border-slate-800 bg-slate-950 shadow-2xl overflow-hidden relative flex flex-col justify-between select-none">
                        
                        {/* Speaker & Dynamic Island Camera Punch Notch */}
                        <div className="absolute top-1 left-1/2 -translate-x-1/2 w-16 h-3.5 rounded-full bg-black z-40 flex items-center justify-center gap-1 px-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-neutral-900 border border-neutral-850" />
                          <div className="w-6 h-px bg-neutral-900" />
                        </div>

                        {/* Lock Screen Sunset mesh wallpaper background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-900/50 to-emerald-950/40 z-0 pointer-events-none" />

                        {/* Top Notch Status Bar */}
                        <div className="relative z-30 px-3.5 pt-2.5 flex justify-between items-center text-[8px] font-mono text-white/90">
                          <span className="font-extrabold">{phoneStatusTime}</span>
                          <div className="flex items-center gap-1.5">
                            <span className="opacity-75">5G</span>
                            <Wifi className="w-2.5 h-2.5 text-white/80" />
                            <Lock className="w-2 h-2 text-white/60" />
                          </div>
                        </div>

                        {/* Simulated Incoming Dropdown Notification Banner */}
                        <AnimatePresence>
                          {latestPhoneNotif && (
                            <motion.div
                              initial={{ opacity: 0, y: -45, scale: 0.85 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: -20, scale: 0.9 }}
                              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                              onClick={() => {
                                setPhoneUnlocked(true);
                                setLatestPhoneNotif(null);
                              }}
                              className="absolute top-8 left-2 right-2 p-2 bg-slate-900/95 border border-[#34d399]/40 backdrop-blur-md rounded-2xl shadow-xl z-50 text-[9px] text-white flex gap-2 cursor-pointer hover:border-[#34d399]/70 transition-colors"
                              id="live-iphone-notif-bubble"
                            >
                              <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-xs shrink-0 font-bold text-emerald-400 leading-none">
                                💬
                              </div>
                              <div className="text-left flex-1 min-w-0">
                                <span className="text-[7.5px] tracking-wider uppercase font-mono text-emerald-400 font-extrabold block">
                                  {latestPhoneNotif.type} • {latestPhoneNotif.sender}
                                </span>
                                <p className="text-[8.5px] leading-snug text-white font-mono truncate">
                                  {latestPhoneNotif.text}
                                </p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Primary Smart Mobile Screen Body Content */}
                        <div className="flex-grow flex flex-col justify-between relative z-10 p-3 pt-4">
                          {!phoneUnlocked ? (
                            /* SCREEN STATE A: LOCKSCREEN CONTAINER */
                            <div className="flex-grow flex flex-col justify-between items-stretch text-center pt-2">
                              <div>
                                <h4 className="text-white text-3xl font-light tracking-wide font-sans">{phoneStatusTime}</h4>
                                <p className="text-indigo-200 text-[8.5px] font-sans font-bold uppercase tracking-widest block mt-0.5">
                                  {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                                </p>
                              </div>

                              <div className="space-y-2">
                                <div className="p-2 rounded-xl bg-white/5 border border-white/5 backdrop-blur-sm px-3" id="lockscreen-carrier-carrier">
                                  <span className="text-[7.5px] font-mono uppercase text-indigo-300 font-bold block">📶 Voicecore Network</span>
                                  <p className="text-[8.5px] text-white font-mono leading-none mt-1">SIM active • Secure Trunking</p>
                                </div>
                                
                                <button
                                  onClick={() => setPhoneUnlocked(true)}
                                  className="w-full py-2 bg-white/10 hover:bg-white/20 active:scale-97 border border-white/10 text-white rounded-xl text-[9px] uppercase font-black tracking-widest transition-all cursor-pointer flex items-center justify-center gap-1"
                                >
                                  🔓 UNLOCK LINE
                                </button>
                              </div>
                            </div>
                          ) : (
                            /* SCREEN STATE B: CHAT-APP MESSAGES HISTORY */
                            <div className="flex-grow flex flex-col justify-between overflow-hidden bg-slate-950/85 backdrop-blur-sm rounded-2xl border border-white/5 shadow-inner">
                              
                              {/* Message App Header Bar */}
                              <div className="bg-black/45 px-2.5 py-1.5 border-b border-white/5 flex justify-between items-center text-[9px] text-white">
                                <button 
                                  onClick={() => setPhoneUnlocked(false)}
                                  className="text-indigo-300 hover:text-white font-bold"
                                >
                                  ◀ Lock
                                </button>
                                <span className="font-extrabold tracking-tight truncate max-w-[100px] text-emerald-400 font-mono">
                                  💬 {msgClientName || "Mohamed"}
                                </span>
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              </div>

                              {/* Conversation Thread Area */}
                              <div className="flex-grow overflow-y-auto p-2.5 space-y-2 flex flex-col-reverse justify-start">
                                {dispatchedMessages.filter(m => m.recipient === msgRecipient).length === 0 ? (
                                  <div className="text-[9px] text-zinc-500 text-center py-6 font-mono font-medium">
                                    No thread logged. Dispatch a message to populate view.
                                  </div>
                                ) : (
                                  dispatchedMessages
                                    .filter(m => m.recipient === msgRecipient)
                                    .map((m) => (
                                      <div key={m.id} className={`flex flex-col ${m.direction === 'inbound' ? 'items-start' : 'items-end'}`}>
                                        <div className={`p-2 rounded-2xl text-[8.5px] max-w-[85%] leading-relaxed ${
                                          m.direction === 'inbound' 
                                            ? 'bg-slate-800 text-white rounded-tl-none border border-white/5 text-left' 
                                            : m.type === 'WhatsApp' 
                                            ? 'bg-teal-600 text-white rounded-tr-none text-right' 
                                            : 'bg-emerald-600 text-white rounded-tr-none text-right'
                                        }`}>
                                          <p className="whitespace-pre-wrap">{m.body}</p>
                                        </div>
                                        <span className="text-[6.5px] text-white/30 font-mono mt-0.5 px-0.5">
                                          {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                      </div>
                                    ))
                                )}
                              </div>

                              {/* Inbound Customer Keyboard Response Form */}
                              <form onSubmit={sendInboundMessageFromSmartphone} className="p-1.5 bg-black/55 border-t border-white/5 flex items-center gap-1.5">
                                <input 
                                  type="text"
                                  value={smartphoneReplyText}
                                  onChange={(e) => setSmartphoneReplyText(e.target.value)}
                                  placeholder="Reply as customer..."
                                  className="flex-grow bg-slate-900 border border-white/10 rounded-xl px-2.5 py-1 text-[8.5px] text-white placeholder-white/30 outline-none focus:border-indigo-400"
                                />
                                <button 
                                  type="submit" 
                                  className="w-5 h-5 rounded-full bg-emerald-500 hover:bg-emerald-400 flex items-center justify-center text-white shrink-0 text-[10px] cursor-pointer"
                                >
                                  ➔
                                </button>
                              </form>

                            </div>
                          )}
                        </div>

                        {/* Interactive iOS Home Indicator Swipe Bar */}
                        <div className="bg-black/20 py-1 relative z-30">
                          <div className="w-16 h-1 bg-white/40 rounded-full mx-auto" />
                        </div>

                      </div>
                    </div>

                  </div>
                </div>

              </div>

            </div>

            {/* Bottom Row / Section: Unified CRM & Appointment database (AppointmentPortal.tsx) */}
            <div className="bg-gradient-to-b from-[#0e0730]/90 to-[#060114]/95 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6" id="crm-core-ledger">
              <div className="text-left border-b border-white/5 pb-4">
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-[9px] font-mono font-bold uppercase text-indigo-300">
                  📁 LIVE SYSTEMS SYNCHRONIZER
                </span>
                <h3 className="text-lg font-black text-white mt-1.5 tracking-tight">Unified CRM & Scheduler Ledger</h3>
                <p className="text-xs text-indigo-200/50 mt-1">
                  Updates on the database sync in real time. Incoming customer bookings or manual edits update instantly.
                </p>
              </div>

              {/* CRM View Portal Frame */}
              <AppointmentPortal
                appointments={appointments}
                setAppointments={setAppointments}
                sentEmails={sentEmails}
                setSentEmails={setSentEmails}
                triggerConfirmationEmail={triggerConfirmationEmail}
              />
            </div>

          </div>
        )}

        {/* Research section disabled per user request */}
        {false && (
          <div className="flex-grow max-w-7xl mx-auto w-full my-6 flex flex-col items-stretch space-y-6" id="research-content-grid">
            
            {/* Top row: Interactive regional research dispatch console */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Left bento panel: interactive parameters & flags */}
              <div className="lg:col-span-4 bg-gradient-to-b from-slate-900 to-indigo-950/20 border border-white/10 rounded-3xl p-6 flex flex-col justify-between text-left font-sans" id="research-search-control">
                <div>
                  <div className="flex items-center gap-2 mb-4 text-left">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-400 flex items-center justify-center text-amber-400 shrink-0">
                      <Compass className="w-4 h-4 animate-spin-slow" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest block">Intelligence Service</span>
                      <h3 className="text-sm font-black text-white leading-tight">West African Geodata Console</h3>
                    </div>
                  </div>

                  <p className="text-xs text-indigo-200/60 leading-relaxed mb-4 text-left">
                    Select a core country to filter or type in the intelligence desk below. Grounded Search is automatically loaded to bypass AI hallucinations and fetch verified live facts.
                  </p>

                  {/* Flag list selection buttons */}
                  <label className="text-[10px] font-mono uppercase tracking-wider text-amber-300 font-bold block mb-2 text-left">West African Nations Quick-Fills</label>
                  <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1" id="country-quick-fills">
                    {[
                      { name: "Sierra Leone", flag: "🇸🇱", query: "Sierra Leone cultural history, landmarks and current travel advising" },
                      { name: "Nigeria", flag: "🇳🇬", query: "Nigeria economic sectors, tech hubs, and Abuja transport links" },
                      { name: "Ghana", flag: "🇬🇭", query: "Ghana Accra tourist attractions, cultural etiquette, and currency history" },
                      { name: "Senegal", flag: "🇸🇳", query: "Senegal Goree island and Dakar markets overview" },
                      { name: "Liberia", flag: "🇱🇷", query: "Liberia Monrovia post-war recovery, historical landmarks, and port infrastructure" },
                      { name: "Gambia", flag: "🇬🇲", query: "Gambia Banjul beach tourism and river delta ecology facts" },
                      { name: "Ivory Coast", flag: "🇨🇮", query: "Ivory Coast Abidjan growth patterns, cocoa legacy, and tourist safety" },
                      { name: "Guinea", flag: "🇬🇳", query: "Guinea Conakry mining resources, Fouta Djallon geography, and capital guide" },
                      { name: "Cape Verde", flag: "🇨🇻", query: "Cape Verde Praia island archipelago tourism and linguistic heritage" },
                      { name: "Mali", flag: "🇲🇱", query: "Mali Timbuktu ancient library ruins and cultural preservation" },
                      { name: "Burkina Faso", flag: "🇧🇫", query: "Burkina Faso Ouagadougou cultural festivals, weather, and economy" },
                      { name: "Niger", flag: "🇳🇪", query: "Niger Agadez ancient mosque architecture and desert trade legacy" },
                      { name: "Togo", flag: "🇹🇬", query: "Togo Lome sea trade ports, grand markets, and voodoo market facts" },
                      { name: "Benin", flag: "🇧🇯", query: "Benin Ouidah history, royal palaces of Abomey, and culture" },
                      { name: "Mauritania", flag: "🇲🇷", query: "Mauritania Nouakchott coastline, desert trade, and currency" },
                      { name: "Guinea-Bissau", flag: "🇬🇼", query: "Guinea-Bissau Bijagos archipelago ecology, safety, and languages" }
                    ].map((nation) => (
                      <button
                        key={nation.name}
                        onClick={() => {
                          setResearchCountry(nation.name);
                          setResearchQuery(nation.query);
                        }}
                        className={`p-2 rounded-xl text-left text-[11px] border border-white/5 transition-all duration-200 flex items-center gap-2 select-none cursor-pointer ${
                          researchCountry === nation.name
                            ? "bg-amber-500/20 text-white border-amber-400"
                            : "bg-slate-950/40 text-indigo-200/80 hover:bg-slate-900 hover:border-white/10"
                        }`}
                      >
                        <span className="text-sm leading-none shrink-0">{nation.flag}</span>
                        <span className="truncate font-medium">{nation.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/5 space-y-4 text-left">
                  {/* Query input field form */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-amber-300 font-bold block">Regional Intelligence Focus</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={researchQuery}
                        onChange={(e) => setResearchQuery(e.target.value)}
                        placeholder="Type city name, monument, safety index, or trade query..."
                        className="w-full bg-slate-950 border border-white/15 focus:border-amber-400 rounded-xl pl-3 pr-8 py-2.5 text-xs text-white placeholder-white/20 select-text outline-none font-sans font-medium"
                        onKeyDown={(e) => e.key === 'Enter' && executeRegionalResearch()}
                      />
                      <Search className="w-4 h-4 text-white/30 absolute right-3 top-3 pointer-events-none" />
                    </div>
                  </div>

                  {/* Filter Country selector */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-amber-300 font-bold block">Country Alignment</label>
                    <select
                      value={researchCountry}
                      onChange={(e) => setResearchCountry(e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 focus:border-amber-400 rounded-xl px-2.5 py-2 text-xs text-indigo-200 font-bold outline-none"
                    >
                      <option value="">-- Across All West Africa --</option>
                      <option value="Benin">Benin 🇧🇯</option>
                      <option value="Burkina Faso">Burkina Faso 🇧🇫</option>
                      <option value="Cape Verde">Cape Verde 🇨🇻</option>
                      <option value="Ivory Coast">Ivory Coast 🇨🇮</option>
                      <option value="Gambia">Gambia 🇬🇲</option>
                      <option value="Ghana">Ghana 🇬🇭</option>
                      <option value="Guinea">Guinea 🇬🇳</option>
                      <option value="Guinea-Bissau">Guinea-Bissau 🇬🇼</option>
                      <option value="Liberia">Liberia 🇱🇷</option>
                      <option value="Mali">Mali 🇲🇱</option>
                      <option value="Mauritania">Mauritania 🇲🇷</option>
                      <option value="Niger">Niger 🇳🇪</option>
                      <option value="Nigeria">Nigeria 🇳🇬</option>
                      <option value="Senegal">Senegal 🇸🇳</option>
                      <option value="Sierra Leone">Sierra Leone 🇸🇱</option>
                      <option value="Togo">Togo 🇹🇬</option>
                    </select>
                  </div>

                  {/* Research Trigger Button */}
                  <button
                    onClick={() => executeRegionalResearch()}
                    disabled={researching}
                    className="w-full py-3 bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-600 hover:to-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer select-none"
                  >
                    {researching ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Analyzing Grounded Search...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                        Execute Verified Deep Research
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Right column: Primary interactive Research Board rendering search results */}
              <div className="lg:col-span-8 flex flex-col justify-between" id="research-results-container">
                <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-white/10 rounded-3xl p-6 flex-grow flex flex-col justify-between min-h-[500px]" id="research-display">
                  
                  {researching ? (
                    /* RESEARCH LOADING STATE VIEW */
                    <div className="flex-grow flex flex-col items-center justify-center text-center py-20 space-y-6">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-full border-4 border-amber-500/20 border-t-amber-400 animate-spin" />
                        <Compass className="w-7 h-7 text-amber-400 absolute inset-0 m-auto animate-pulse" />
                      </div>
                      
                      <div className="max-w-md space-y-2">
                        <h4 className="text-white font-black text-xs tracking-wide uppercase animate-pulse">DISPATCHING MULTI-GRID GOOGLE SEARCH</h4>
                        <p className="text-[11px] text-indigo-400/80 leading-relaxed font-mono">
                          Triggering live Grounding indices for <span className="text-amber-400 font-bold">"{researchQuery}"</span> in country: <span className="text-indigo-400 font-semibold">{researchCountry || "West African Trunks"}</span>. Resolving coordinate landmarks & practical logistical telemetry...
                        </p>
                      </div>

                      <div className="w-64 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-amber-400 to-indigo-500 rounded-full animate-pulseProgress"
                          style={{ width: "100%" }}
                        />
                      </div>
                    </div>
                  ) : researchError ? (
                    /* RESEARCH ERROR PANELS */
                    <div className="flex-grow flex flex-col items-center justify-center text-center py-16 space-y-4">
                      <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500 flex items-center justify-center text-rose-400">
                        <ShieldAlert className="w-6 h-6 animate-bounce" />
                      </div>
                      <div className="max-w-md space-y-1 text-left">
                        <h4 className="text-white text-xs font-black uppercase text-center">RESEARCH SYSTEM INTERACTION ERROR</h4>
                        <p className="text-xs text-rose-300 leading-relaxed font-mono bg-rose-500/5 p-3 rounded-xl border border-rose-500/10 shadow-sm">{researchError}</p>
                        <p className="text-[10px] text-indigo-400/60 mt-2 text-center">Verify that your Google Gemini API Key has internet-access / search-grounding and is correctly configured in Settings → Secrets.</p>
                      </div>
                    </div>
                  ) : researchResult ? (
                    /* ACTIVE RESEARCH DATA INSTANCE VIEW */
                    <div className="flex-grow flex flex-col justify-between text-left space-y-4">
                      
                      {/* Response Title Ribbon */}
                      <div className="flex justify-between items-center border-b border-white/5 pb-3">
                        <div className="space-y-0.5">
                          <span className="text-[9px] font-mono font-bold text-amber-400 uppercase tracking-widest block">
                            🛰️ Verified Geodata Intelligence Report
                          </span>
                          <h4 className="text-xs font-black text-white uppercase tracking-tight flex items-center gap-1.5">
                            <BookOpen className="w-4 h-4 text-emerald-400" /> {researchQuery}
                          </h4>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/5 text-[9px] font-mono text-indigo-200">
                          {researchCountry || "West Africa Context"}
                        </span>
                      </div>

                      {/* DeepSeek R1-Style Collapsible Reasoning Trace */}
                      {researchThinking && (
                        <div className="bg-amber-500/5 border border-amber-500/15 rounded-2xl p-4 space-y-2 text-left transition-all duration-300">
                          <button
                            onClick={() => setShowThinking(!showThinking)}
                            className="flex items-center justify-between w-full text-[10px] font-mono font-bold tracking-widest text-amber-400 uppercase select-none cursor-pointer"
                          >
                            <span className="flex items-center gap-1.5">
                              <Compass className="w-3.5 h-3.5 animate-spin-slow" />
                              {showThinking ? "Hide Search Reasoning Process (100% Facts Checked)" : "View Search Reasoning Process (100% Facts Checked)"}
                            </span>
                            <span className="text-xs transition-transform duration-200">
                              {showThinking ? "▲" : "▼"}
                            </span>
                          </button>
                          
                          {showThinking && (
                            <div className="text-[10.5px] text-amber-200/50 leading-relaxed font-mono pl-5 pt-1.5 border-l border-amber-550/20 max-h-36 overflow-y-auto pr-1">
                              {researchThinking.split("\n").map((line, idx) => (
                                <p key={idx} className="mb-2 last:mb-0">
                                  {line}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Grounded Information Display Scroll Panel */}
                      <div className="max-h-[380px] overflow-y-auto pr-1 text-xs text-indigo-100/90 leading-relaxed space-y-4 select-text" id="scrollable-research-report">
                        {researchResult.split("\n\n").map((chunk, index) => {
                          // Format headings e.g. "**Overview...**" or "### Heading" or "**Heading**"
                          if (chunk.trim().startsWith("**") && chunk.includes(":**")) {
                            const colonPos = chunk.indexOf(":**");
                            const title = chunk.substring(2, colonPos).replace(/\*\*/g, "").trim();
                            const text = chunk.substring(colonPos + 4).replace(/\*\*/g, "").trim();
                            return (
                              <div key={index} className="space-y-1 bg-white/[0.01] border border-white/5 p-3.5 rounded-2xl">
                                <h5 className="font-black text-amber-400 font-sans text-xs flex items-center gap-1 uppercase tracking-wide">✹ {title}</h5>
                                <p className="text-[11px] text-indigo-200/90 font-sans leading-relaxed">{text}</p>
                              </div>
                            );
                          } else if (chunk.trim().startsWith("**") && chunk.trim().endsWith("**")) {
                            const cleanText = chunk.replace(/\*\*/g, "");
                            return (
                              <h5 key={index} className="font-extrabold text-white font-sans text-xs border-l-2 border-amber-400 pl-2.5 mt-4 tracking-tight uppercase">
                                {cleanText}
                              </h5>
                            );
                          } else if (chunk.includes(" - ") || chunk.includes(" * ")) {
                            return (
                              <div key={index} className="bg-slate-950/40 border border-white/5 p-3 rounded-xl space-y-1.5">
                                {chunk.split("\n").map((line, lidx) => {
                                  const cleanLine = line.replace(/^[-\*\s]+/, "");
                                  if (!cleanLine.trim()) return null;
                                  return (
                                    <p key={lidx} className="text-[10.5px] text-indigo-200/80 font-sans leading-relaxed">
                                      • {cleanLine}
                                    </p>
                                  );
                                })}
                              </div>
                            );
                          }
                          return (
                            <p key={index} className="font-sans text-indigo-100 leading-relaxed whitespace-pre-wrap">
                              {chunk.replace(/\*\*/g, "")}
                            </p>
                          );
                        })}
                      </div>

                      {/* Display Grounding Citation URL References */}
                      {researchSources && researchSources.length > 0 && (
                        <div className="pt-3 border-t border-white/5 text-left bg-slate-950/40 p-2.5 rounded-xl border border-white/5">
                          <span className="text-[8px] font-mono font-bold text-emerald-400 uppercase tracking-widest block mb-1.5 flex items-center gap-1">
                            <ArrowUpRight className="w-3.5 h-3.5" /> SECURE GOOGLE GROUNDED SOURCE CITATIONS
                          </span>
                          <div className="flex flex-wrap gap-2 max-h-16 overflow-y-auto">
                            {researchSources.slice(0, 4).map((source, idx) => {
                              const title = source.web?.title || source.title || `Resource reference ${idx + 1}`;
                              const uri = source.web?.uri || source.uri || "#";
                              return (
                                <a
                                  key={idx}
                                  href={uri}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="px-2.5 py-1 rounded bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-400/20 text-[9.5px] font-mono text-indigo-300 transition-colors inline-flex items-center gap-1 max-w-[220px] truncate"
                                >
                                  🗺️ {title}
                                </a>
                              );
                            })}
                          </div>
                        </div>
                      )}

                    </div>
                  ) : (
                    /* COLD STANDBY STATE VIEW */
                    <div className="flex-grow flex flex-col items-center justify-center text-center py-24 space-y-4">
                      <div className="w-14 h-14 rounded-full bg-amber-500/5 border border-amber-500/15 flex items-center justify-center text-amber-400/50">
                        <Compass className="w-7 h-7" />
                      </div>
                      <div className="max-w-md space-y-1">
                        <h4 className="text-white text-xs font-black uppercase tracking-wider">Trunk Intelligence Search Standby</h4>
                        <p className="text-xs text-indigo-200/50 leading-relaxed font-sans">
                          Select one of the West African countries in the quick-fills panel, or type any specific cultural/landmark query or travel advisory topic in the filter input desk and click "Execute Verified Deep Research".
                        </p>
                      </div>
                    </div>
                  )}

                </div>
              </div>

            </div>

            {/* Bottom Row: Local search history timeline */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950/10 to-slate-900 border border-white/10 rounded-3xl p-6 text-left animate-fadeIn" id="research-history-card">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-indigo-400" />
                  <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-widest block">Regional Research Operations Log</span>
                </div>
                <button
                  onClick={() => setResearchHistory([])}
                  className="text-[9px] font-mono uppercase font-black tracking-widest text-[#f87171] hover:text-[#ef4444] cursor-pointer"
                >
                  Clear Logs
                </button>
              </div>

              {researchHistory.length === 0 ? (
                <p className="text-xs text-indigo-200/30 text-center py-2 font-mono">No previous research sessions logged under this container profile.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {researchHistory.slice(0, 6).map((h) => (
                    <div
                      key={h.id}
                      onClick={() => {
                        setResearchQuery(h.query);
                        setResearchCountry(h.country);
                        executeRegionalResearch(h.query, h.country);
                      }}
                      className="p-3 bg-slate-950 hover:bg-slate-900 border border-white/5 hover:border-amber-400/30 rounded-2xl cursor-pointer transition-all space-y-1 select-none text-left"
                    >
                      <div className="flex justify-between items-center text-[8px] font-mono">
                        <span className="text-[#34d399] font-bold">🌍 {h.country || "General West Africa"}</span>
                        <span className="opacity-40">{new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-xs text-white uppercase font-black tracking-tight truncate">{h.query}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* Investor Pitch MVP disabled per user request */}

        {/* Dynamic Language/Dialect Auto-Detection Toast Notification */}
        <AnimatePresence>
          {autoDetectedToast && (
            <motion.div
              key="dialect-toast"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="fixed bottom-6 right-6 md:right-12 z-50 p-4 rounded-2xl bg-indigo-950/95 border-2 border-indigo-500/40 backdrop-blur-xl shadow-2xl flex items-center gap-3 text-sm text-indigo-100 max-w-sm text-left"
              id="dialect-auto-detected-toast"
            >
              <div className="w-10 h-10 rounded-full bg-indigo-550/20 border border-indigo-400/40 flex items-center justify-center text-xl shadow-inner shrink-0">
                {autoDetectedToast.flag}
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono font-black text-indigo-400 tracking-wider block">
                  ⚡ Auto-Detected Dialect
                </span>
                <p className="font-extrabold text-white text-xs mt-0.5">
                  Switched to {autoDetectedToast.name}!
                </p>
                <p className="opacity-75 text-[10px] mt-0.5 text-indigo-200">
                  Hakim Isaac agent has auto-synchronized with your input.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Custom Outbound Notification Alert Banner */}
        <AnimatePresence>
          {customMailNotification && (
            <motion.div
              key="custom-outbound-toast"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="fixed bottom-6 left-6 z-50 p-4 rounded-2xl bg-slate-900/95 border-2 border-emerald-500/40 backdrop-blur-xl shadow-2xl flex items-center gap-3 text-sm text-emerald-100 max-w-sm text-left"
              id="custom-outbound-notification-toast"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-xl shadow-inner shrink-0">
                🚀
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono font-black text-emerald-400 tracking-wider block">
                  🕊️ Carrier Outbound Channel
                </span>
                <p className="font-extrabold text-white text-xs mt-0.5">
                  {customMailNotification}
                </p>
                <p className="opacity-75 text-[10px] mt-0.5 text-emerald-300">
                  Transaction dispatched and confirmed on carrier grid.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Reminder Alert Banner Modal Overlay */}
        <AnimatePresence>
          {activeReminder && (
            <motion.div
              key="active-reminder"
              initial={{ opacity: 0, scale: 0.9, y: -40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
              id="active-reminder-overlay"
            >
              <div className="bg-gradient-to-b from-indigo-950 to-[#0A0424] border-2 border-indigo-500 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative space-y-4" id="alert-modal-card">
                <div className="absolute top-4 right-4" id="alert-close-btn-wrapper">
                  <button
                    onClick={() => {
                      setDismissedReminders([...dismissedReminders, activeReminder.id]);
                      setActiveReminder(null);
                    }}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-indigo-300 hover:text-white transition-all cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div className="flex items-center gap-3" id="alert-card-header">
                  <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-400 rounded-2xl flex items-center justify-center text-indigo-400 animate-bounce">
                    <Bell className="w-6 h-6 animate-pulse" />
                  </div>
                  <div className="text-left">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-indigo-400">APPOINTMENT REMINDER</span>
                    <h3 className="text-lg font-black text-white leading-tight">It's Booking Time!</h3>
                  </div>
                </div>

                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl text-left space-y-2" id="alert-card-info">
                  <p className="text-xs text-indigo-200">
                    Your scheduled appointment with <b>{activeReminder.clientName}</b> is currently due.
                  </p>
                  <div className="border-t border-white/5 pt-2 space-y-1 text-xs">
                    <div className="flex justify-between"><span className="text-indigo-300/60">Service Goal:</span> <span className="font-bold text-indigo-200">{activeReminder.serviceType}</span></div>
                    <div className="flex justify-between"><span className="text-indigo-300/60">Date & Time:</span> <span className="font-bold text-indigo-200">{activeReminder.date} @ {activeReminder.time}</span></div>
                    <div className="flex justify-between"><span className="text-indigo-300/60">Email Contact:</span> <span className="font-mono text-indigo-200">{activeReminder.emailAddress}</span></div>
                  </div>
                </div>

                {activeReminder.remarks && (
                  <p className="text-xs italic text-indigo-300/50 text-left bg-slate-950/40 p-2.5 rounded-xl border border-white/5">
                    &ldquo;{activeReminder.remarks}&rdquo;
                  </p>
                )}

                <div className="flex gap-3 justify-end pt-2" id="alert-card-triggers">
                  <button
                    onClick={() => {
                      setDismissedReminders([...dismissedReminders, activeReminder.id]);
                      setActiveReminder(null);
                    }}
                    className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-indigo-300 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Acknowledge
                  </button>
                  <button
                    onClick={() => {
                      if (activeReminder.emailSent) {
                        alert("Confirmation email was already sent successfully!");
                      } else {
                        triggerConfirmationEmail(activeReminder);
                      }
                      setDismissedReminders([...dismissedReminders, activeReminder.id]);
                      setActiveReminder(null);
                    }}
                    className="flex-1 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-indigo-500/20"
                  >
                    Send Confirmation Email
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* System Footer Info Details */}
        <footer className="py-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center text-[10px] text-indigo-200/40 font-mono tracking-wider" id="system-footer">
          <span id="footer-cr">© Hakim Isaac Omnichannel Platform • Real-time Multitalk Duplex Live Agent</span>
          <div className="flex items-center gap-4 mt-2 sm:mt-0" id="security-disclaimer">
            <span className="flex items-center gap-1" id="secure-shield">
              <Lock className="w-3.5 h-3.5 opacity-60" /> SSL SECURE STREAMING
            </span>
            <span className="flex items-center gap-1" id="ping-indicator">
              <Wifi className="w-3.5 h-3.5 opacity-60" /> DUPLEX LATENCY CLOUD BRIDGE
            </span>
          </div>
        </footer>

      </div>
    </div>
  );
}
