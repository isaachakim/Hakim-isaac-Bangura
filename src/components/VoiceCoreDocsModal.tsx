import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  Terminal, 
  Copy, 
  Check, 
  BookOpen, 
  Cpu, 
  FileText, 
  ShieldAlert, 
  Globe, 
  Flame, 
  ExternalLink,
  Code,
  Layers,
  PhoneCall,
  Calendar,
  Database,
  BarChart3,
  CheckCircle,
  Clock,
  ChevronRight
} from "lucide-react";

interface VoiceCoreDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SectionKey = 
  | "intro" 
  | "getting-started" 
  | "auth" 
  | "concepts" 
  | "api-ref" 
  | "lang" 
  | "errors" 
  | "limits" 
  | "sdks" 
  | "sandbox" 
  | "support-changelog";

export default function VoiceCoreDocsModal({ isOpen, onClose }: VoiceCoreDocsModalProps) {
  const [activeTab, setActiveTab] = useState<SectionKey>("intro");
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(id);
      setTimeout(() => setCopiedText(null), 2500);
    } catch {
      setCopiedText(id);
      setTimeout(() => setCopiedText(null), 2500);
    }
  };

  if (!isOpen) return null;

  const sectionsList: { key: SectionKey; label: string; icon: React.ReactNode }[] = [
    { key: "intro", label: "1. Introduction", icon: <BookOpen className="w-3.5 h-3.5" /> },
    { key: "getting-started", label: "2. Getting Started", icon: <Layers className="w-3.5 h-3.5" /> },
    { key: "auth", label: "3. Authentication", icon: <FileText className="w-3.5 h-3.5" /> },
    { key: "concepts", label: "4. Core Concepts", icon: <Cpu className="w-3.5 h-3.5" /> },
    { key: "api-ref", label: "5. API Reference", icon: <Code className="w-3.5 h-3.5" /> },
    { key: "lang", label: "6. Language Support", icon: <Globe className="w-3.5 h-3.5" /> },
    { key: "errors", label: "7. Error Codes", icon: <ShieldAlert className="w-3.5 h-3.5" /> },
    { key: "limits", label: "8. Rate Limits", icon: <Clock className="w-3.5 h-3.5" /> },
    { key: "sdks", label: "9. SDKs & Live Code", icon: <Terminal className="w-3.5 h-3.5" /> },
    { key: "sandbox", label: "10. Sandbox & Test", icon: <Flame className="w-3.5 h-3.5" /> },
    { key: "support-changelog", label: "11. Support & Log", icon: <CheckCircle className="w-3.5 h-3.5" /> },
  ];

  return (
    <div key="voicecore-docs-overlay" className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-4">
      <motion.div
        key="voicecore-docs-modal"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.25 }}
        className="bg-[#0b0521] border-2 border-indigo-500/30 rounded-3xl w-full max-w-6xl h-[90vh] flex flex-col shadow-2xl relative overflow-hidden text-left"
        id="voicecore-docs-root"
      >
        {/* Banner/Header */}
        <div className="p-6 border-b border-white/10 shrink-0 bg-slate-950/60 flex justify-between items-center sm:items-start" id="docs-header">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-[10px] font-mono font-bold uppercase text-indigo-300 flex items-center gap-1">
                <Terminal className="w-3 h-3 text-indigo-400" /> Standard API Docs
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-mono font-bold uppercase text-emerald-400">
                v1.0.0 Stable
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-2 tracking-tight">
              📖 VoiceCore Platform — Developer Documentation
            </h2>
            <p className="text-xs text-indigo-200/60 mt-1 max-w-2xl hidden sm:block">
              Welcome to the white-label custom telecom integration handbook. Build dynamic AI customer care centers, handle inbound VoIP sessions with custom dialects, SMS reminders, and post-call SMTP logging.
            </p>
          </div>

          <button 
            onClick={onClose}
            className="text-indigo-200/50 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full cursor-pointer transition-all"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dashboard layout split */}
        <div className="flex-grow flex overflow-hidden" id="docs-split-view">
          {/* Lidebar navigator */}
          <div className="w-52 sm:w-64 border-r border-white/5 bg-[#08021a] overflow-y-auto shrink-0 p-3 space-y-1 block" id="docs-sidebar">
            <span className="px-3 text-[9px] font-mono text-indigo-400/50 tracking-widest uppercase font-black block mb-2">
              Sections Menu
            </span>
            {sectionsList.map((sec) => (
              <button
                key={sec.key}
                onClick={() => setActiveTab(sec.key)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all select-none cursor-pointer border ${
                  activeTab === sec.key
                    ? 'bg-indigo-600/25 border-indigo-500/50 text-white shadow-sm font-black'
                    : 'bg-transparent border-transparent text-indigo-300 hover:text-white hover:bg-white/[0.02]'
                }`}
              >
                <span className={activeTab === sec.key ? 'text-indigo-400' : 'text-indigo-400/50'}>
                  {sec.icon}
                </span>
                <span className="truncate">{sec.label}</span>
              </button>
            ))}
            
            <div className="pt-6 px-3">
              <div className="p-3 bg-indigo-950/20 rounded-xl border border-indigo-500/10 space-y-1.5 text-[10px] text-indigo-200/50 leading-relaxed">
                <span className="font-bold text-white block">API Credentials</span>
                <p>Use your <span className="font-mono text-emerald-400">vc_test_</span> token to configure sandbox environments safely.</p>
              </div>
            </div>
          </div>

          {/* Main Content viewport */}
          <div className="flex-grow overflow-y-auto bg-[#0b0521] p-6 lg:p-8 space-y-6" id="docs-content-viewport">
            {/* Section 1: Intro */}
            {activeTab === "intro" && (
              <div className="space-y-6 text-xs text-indigo-200/80 leading-relaxed" id="docs-sec-intro">
                <h3 className="text-lg font-extrabold text-white flex items-center gap-2 border-b border-white/10 pb-2">
                  <BookOpen className="w-5 h-5 text-indigo-400" /> 1. Introduction
                </h3>
                <p>
                  VoiceCore is a white-label voice AI infrastructure platform. It enables businesses to deploy a fully branded AI voice agent that handles inbound customer calls, schedules outbound follow-ups, books appointments, and communicates in multiple languages — all through a simple REST API.
                </p>
                
                <div className="space-y-3">
                  <h4 className="font-extrabold text-white text-sm">💡 What you can build:</h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <li className="p-3 bg-white/[0.01] border border-white/5 rounded-xl">
                      <b className="text-white block font-semibold mb-1">24/7 AI Customer Service</b>
                      Receive and handle inbound calls on custom business phone lines seamlessly.
                    </li>
                    <li className="p-3 bg-white/[0.01] border border-white/5 rounded-xl">
                      <b className="text-white block font-semibold mb-1">Automated Campaigns</b>
                      Upload your contact csv files to trigger scheduled bulk outbound follow-up calls hands-free.
                    </li>
                    <li className="p-3 bg-white/[0.01] border border-white/5 rounded-xl">
                      <b className="text-white block font-semibold mb-1">Appointment Schedulers</b>
                      The voice engine checks real-time availability slots, books, tracks, and sends reminder triggers.
                    </li>
                    <li className="p-3 bg-white/[0.01] border border-white/5 rounded-xl">
                      <b className="text-white block font-semibold mb-1">Multilingual Voice Support</b>
                      Speaks Krio (Sierra Leone), Nigerian Pidgin, Arabic, French, Spanish, and English naturally.
                    </li>
                  </ul>
                </div>

                <div className="p-4 bg-slate-950/60 rounded-2xl border border-white/5 space-y-3">
                  <h4 className="font-mono text-[10px] text-indigo-400 uppercase tracking-wider font-extrabold">
                    Architecture overview
                  </h4>
                  <pre className="p-3 bg-slate-950 rounded-lg text-[9.5px] font-mono text-indigo-300 overflow-x-auto leading-relaxed border border-white/5">
{`Your Application
      │
      ▼
VoiceCore REST API
      │
   ┌──┴──────────────────┐
   │                     │
   ▼                     ▼
Inbound Engine      Outbound Engine
(receives calls)    (dials contacts)
   │                     │
   └──────────┬──────────┘
              │
              ▼
        AI Brain (Claude)
        Language Detection
        Intent Routing
              │
     ┌────────┼────────┐
     ▼        ▼        ▼
  Schedule  Follow-up  CRM Log
  Booking   Task       + Webhooks`}
                  </pre>
                </div>
              </div>
            )}

            {/* Section 2: Getting Started */}
            {activeTab === "getting-started" && (
              <div className="space-y-6 text-xs text-indigo-200/80 leading-relaxed" id="docs-sec-started">
                <h3 className="text-lg font-extrabold text-white flex items-center gap-2 border-b border-white/10 pb-2">
                  <Layers className="w-5 h-5 text-indigo-400" /> 2. Getting Started
                </h3>
                
                <div className="space-y-4">
                  <div className="flex gap-4 items-start">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-550/20 text-indigo-300 font-bold font-mono text-xs shrink-0">1</span>
                    <div className="space-y-1">
                      <b className="text-white text-sm font-semibold block">Step 1 — Create an account</b>
                      <p>Sign up at <span className="text-indigo-400 hover:underline">dashboard.voicecore.io</span> and choose your plan (Starter, Business, or Institutional).</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-550/20 text-indigo-300 font-bold font-mono text-xs shrink-0">2</span>
                    <div className="space-y-1">
                      <b className="text-white text-sm font-semibold block">Step 2 — Get your API key</b>
                      <p>Navigate to <b>Settings → API Keys</b> in your dashboard and generate a key. Keep this secret — never expose it in client-side code.</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-550/20 text-indigo-300 font-bold font-mono text-xs shrink-0">3</span>
                    <div className="space-y-2 flex-grow">
                      <b className="text-white text-sm font-semibold block">Step 3 — Configure your agent</b>
                      <p>Make your first API call to initialize your B2B operator voice agent:</p>
                      
                      <div className="relative">
                        <pre className="p-3 bg-slate-950 text-[10px] font-mono text-indigo-200 rounded-xl overflow-x-auto border border-white/5 leading-relaxed">
{`curl -X POST https://api.voicecore.io/v1/agent/configure \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "business_name": "Africell Sierra Leone",
    "agent_name": "Aria",
    "primary_language": "en",
    "supported_languages": ["en", "krio", "fr"],
    "phone_number": "+23276000000",
    "timezone": "Africa/Freetown"
  }'`}
                        </pre>
                        <button 
                          onClick={() => handleCopy(`curl -X POST https://api.voicecore.io/v1/agent/configure \\\n  -H "Authorization: Bearer YOUR_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d '{\n    "business_name": "Africell Sierra Leone",\n    "agent_name": "Aria",\n    "primary_language": "en",\n    "supported_languages": ["en", "krio", "fr"],\n    "phone_number": "+23276000000",\n    "timezone": "Africa/Freetown"\n  }'`, "init-agent")}
                          className="absolute top-2 right-2 text-[10px] font-mono hover:text-white bg-[#0b0521] px-2 py-1 rounded border border-white/10"
                        >
                          {copiedText === "init-agent" ? "Copied!" : "Copy"}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-550/20 text-indigo-300 font-bold font-mono text-xs shrink-0">4</span>
                    <div className="space-y-2 flex-grow">
                      <b className="text-white text-sm font-semibold block">Step 4 — Link your phone number</b>
                      <p>Point your business number directly to the VoiceCore inbound handler gateway:</p>
                      
                      <div className="relative">
                        <pre className="p-3 bg-slate-950 text-[10px] font-mono text-indigo-200 rounded-xl overflow-x-auto border border-white/5 leading-relaxed">
{`curl -X POST https://api.voicecore.io/v1/calls/inbound/setup \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "agent_id": "agt_abc123",
    "phone_number": "+23276000000"
  }'`}
                        </pre>
                        <button 
                          onClick={() => handleCopy(`curl -X POST https://api.voicecore.io/v1/calls/inbound/setup \\\n  -H "Authorization: Bearer YOUR_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d '{\n    "agent_id": "agt_abc123",\n    "phone_number": "+23276000000"\n  }'`, "link-number")}
                          className="absolute top-2 right-2 text-[10px] font-mono hover:text-white bg-[#0b0521] px-2 py-1 rounded border border-white/10"
                        >
                          {copiedText === "link-number" ? "Copied!" : "Copy"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Section 3: Authentication */}
            {activeTab === "auth" && (
              <div className="space-y-6 text-xs text-indigo-200/80 leading-relaxed" id="docs-sec-auth">
                <h3 className="text-lg font-extrabold text-white flex items-center gap-2 border-b border-white/10 pb-2">
                  <FileText className="w-5 h-5 text-indigo-400" /> 3. Authentication
                </h3>
                <p>All API requests require a Bearer token in the custom standard Authorization header:</p>
                <div className="px-4 py-2.5 bg-slate-950 rounded-xl border border-white/5 tracking-wider font-mono text-emerald-350">
                  {"Authorization: Bearer vc_live_xxxxxxxxxxxxxxxxxxxx"}
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-extrabold text-white text-sm">Token types & Environments:</h4>
                  <table className="w-full text-xs text-indigo-200/70 border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-white font-black text-left">
                        <th className="py-2 pr-4 font-mono select-none">Prefix</th>
                        <th className="py-2 px-4 select-none">Environment</th>
                        <th className="py-2 pl-4 select-none">Use Case</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-white/[0.04] py-2">
                        <td className="py-2 pr-4 font-mono text-emerald-400 font-bold">vc_live_</td>
                        <td className="py-2 px-4 font-semibold text-white">Production</td>
                        <td className="py-2 pl-4">Real dial out, live billing minutes, genuine outbound follow-ups.</td>
                      </tr>
                      <tr className="py-2">
                        <td className="py-2 pr-4 font-mono text-indigo-455 font-bold">vc_test_</td>
                        <td className="py-2 px-4 font-semibold text-white">Sandbox</td>
                        <td className="py-2 pl-4">Simulated carrier loop testing, logs events to sandbox tables only.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-4 bg-indigo-950/20 border border-indigo-500/15 rounded-2xl space-y-2">
                  <h4 className="font-extrabold text-white flex items-center gap-1.5"><ShieldAlert className="w-4 h-4 text-indigo-400" /> Security Best Practices</h4>
                  <ul className="list-disc leading-relaxed pl-4 space-y-1.5 text-[11px] text-indigo-200/60">
                    <li>Never hardcode or push a live B2B token onto client side repositories or public scripts.</li>
                    <li>Always access this key server-side using secure system variables: <code className="text-indigo-300">process.env.VOICECORE_API_KEY</code>.</li>
                    <li>Rotate compromised keys immediately using the administration dashboard profile settings.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Section 4: Core Concepts */}
            {activeTab === "concepts" && (
              <div className="space-y-6 text-xs text-indigo-200/80 leading-relaxed" id="docs-sec-concepts">
                <h3 className="text-lg font-extrabold text-white flex items-center gap-2 border-b border-white/10 pb-2">
                  <Cpu className="w-5 h-5 text-indigo-400" /> 4. Core Concepts
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-white/[0.01] hover:bg-white/[0.02] border border-white/5 rounded-2xl space-y-1">
                    <b className="text-white block font-extrabold uppercase text-[10px] tracking-wider font-mono text-indigo-400">🤖 CONCEPT: Agent</b>
                    <p className="text-[11px] text-indigo-200/60 leading-relaxed">
                      Your AI voice identity structure. It has configurable variables including name (voiced back to caller), voice profile style, primary fallback language, and custom organizational timezone.
                    </p>
                  </div>
                  <div className="p-4 bg-white/[0.01] hover:bg-white/[0.02] border border-white/5 rounded-2xl space-y-1">
                    <b className="text-white block font-extrabold uppercase text-[10px] tracking-wider font-mono text-indigo-400">📞 CONCEPT: Call Session</b>
                    <p className="text-[11px] text-indigo-200/60 leading-relaxed">
                      Represents each active duplex pipeline connection. Tracks transcripts, started/ended timings, detected dialect metadata, intent tagging, and associated webhook events.
                    </p>
                  </div>
                  <div className="p-4 bg-white/[0.01] hover:bg-white/[0.02] border border-white/5 rounded-2xl space-y-1">
                    <b className="text-white block font-extrabold uppercase text-[10px] tracking-wider font-mono text-indigo-400">📝 CONCEPT: Follow-up Task</b>
                    <p className="text-[11px] text-indigo-200/60 leading-relaxed">
                      Scheduled downstream task generated during sessions contextually or manual bulk API upload to automatically issue SMS or fallback callbacks to recipients.
                    </p>
                  </div>
                  <div className="p-4 bg-white/[0.01] hover:bg-white/[0.02] border border-white/5 rounded-2xl space-y-1">
                    <b className="text-white block font-extrabold uppercase text-[10px] tracking-wider font-mono text-indigo-400">📚 CONCEPT: Knowledge Base</b>
                    <p className="text-[11px] text-indigo-200/60 leading-relaxed">
                      The core truth vector. You provide documents (FAQs, tariffs, support scripts) and VoiceCore indexes them natively. The underlying model accesses this database strictly, avoiding hallucinations.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Section 5: API Reference */}
            {activeTab === "api-ref" && (
              <div className="space-y-6 text-xs text-indigo-200/80 leading-relaxed" id="docs-sec-apiref">
                <h3 className="text-lg font-extrabold text-white flex items-center gap-2 border-b border-white/10 pb-2">
                  <Code className="w-5 h-5 text-indigo-400" /> 5. API Reference
                </h3>

                <div className="space-y-6">
                  {/* Subsection A: Agent Config */}
                  <div className="space-y-3">
                    <span className="font-mono text-[10px] text-indigo-400 uppercase tracking-widest font-black block">
                      A. Agent Configuration
                    </span>
                    
                    <div className="bg-slate-950 p-4 rounded-2xl border border-white/5 space-y-3">
                      <div className="flex items-center gap-2 font-mono text-xs">
                        <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded font-black">POST</span>
                        <span className="text-white hover:underline">/v1/agent/configure</span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <span className="text-[10px] text-indigo-200/40 font-mono block uppercase">Request Structure:</span>
                          <pre className="p-2.5 bg-[#0b0521] rounded-lg text-[9.5px] font-mono text-indigo-300 overflow-x-auto leading-relaxed border border-white/5">
{`{
  "business_name": "Africell SL",
  "agent_name": "Aria",
  "agent_voice": "female_warm",
  "primary_language": "en",
  "supported_languages": ["en","krio"],
  "phone_number": "+23276000000",
  "timezone": "Africa/Freetown"
}`}
                          </pre>
                        </div>
                        <div className="space-y-2">
                          <span className="text-[10px] text-indigo-200/40 font-mono block uppercase">Response Output:</span>
                          <pre className="p-2.5 bg-[#0b0521] rounded-lg text-[9.5px] font-mono text-indigo-300 overflow-x-auto leading-relaxed border border-white/5">
{`{
  "agent_id": "agt_abc123",
  "status": "active",
  "created_at": "2026-06-16T10:00:00Z",
  "phone_number": "+23276000000"
}`}
                          </pre>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-2xl border border-white/5 space-y-3">
                      <div className="flex items-center gap-2 font-mono text-xs">
                        <span className="bg-blue-500/10 border border-blue-500/30 text-blue-400 px-2 py-0.5 rounded font-black">GET</span>
                        <span className="text-white hover:underline">/v1/agent/{"{agent_id}"}</span>
                      </div>
                      <pre className="p-2.5 bg-[#0b0521] rounded-lg text-[9.5px] font-mono text-indigo-300 overflow-x-auto leading-relaxed border border-white/5">
{`{
  "agent_id": "agt_abc123",
  "business_name": "Africell Sierra Leone",
  "agent_name": "Aria",
  "status": "active",
  "primary_language": "en",
  "supported_languages": ["en", "krio"],
  "total_calls_handled": 1284
}`}
                      </pre>
                    </div>
                  </div>

                  {/* Subsection B: Inbound Configuration */}
                  <div className="space-y-3 pt-4 border-t border-white/5">
                    <span className="font-mono text-[10px] text-indigo-400 uppercase tracking-widest font-black block">
                      B. Inbound & Call Session Logs
                    </span>

                    <div className="bg-slate-950 p-4 rounded-2xl border border-white/5 space-y-3">
                      <div className="flex items-center gap-2 font-mono text-xs">
                        <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded font-black">POST</span>
                        <span className="text-white">/v1/calls/inbound/setup</span>
                      </div>
                      <p className="text-[11px] text-indigo-200/60 leading-relaxed">
                        Enables instant recording and post-booking summaries dispatched directly through carriers.
                      </p>
                      <pre className="p-2.5 bg-[#0b0521] rounded-lg text-[9.5px] font-mono text-indigo-300 overflow-x-auto leading-relaxed border border-white/5">
{`{
  "agent_id": "agt_abc123",
  "phone_number": "+23276000000",
  "call_recording": true,
  "transcription": true,
  "post_call_sms": true
}`}
                      </pre>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-2xl border border-white/5 space-y-3">
                      <div className="flex items-center gap-2 font-mono text-xs">
                        <span className="bg-blue-500/10 border border-blue-500/30 text-blue-400 px-2 py-0.5 rounded font-black">GET</span>
                        <span className="text-white">/v1/calls/sessions/{"{session_id}"}</span>
                      </div>
                      <pre className="p-2.5 bg-[#0b0521] rounded-lg text-[9.5px] font-mono text-indigo-300 overflow-x-auto leading-relaxed border border-white/5">
{`{
  "session_id": "ses_xyz789",
  "direction": "inbound",
  "caller_number": "+23276999999",
  "language_detected": "krio",
  "duration_seconds": 183,
  "status": "resolved",
  "intent": "billing_inquiry"
}`}
                      </pre>
                    </div>
                  </div>

                  {/* Subsection C: Follow-ups */}
                  <div className="space-y-3 pt-4 border-t border-white/5">
                    <span className="font-mono text-[10px] text-indigo-400 uppercase tracking-widest font-black block">
                      C. Outbound Followups
                    </span>

                    <div className="bg-slate-950 p-4 rounded-2xl border border-white/5 space-y-3">
                      <div className="flex items-center gap-2 font-mono text-xs">
                        <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded font-black">POST</span>
                        <span className="text-white">/v1/followups/schedule</span>
                      </div>
                      <pre className="p-2.5 bg-[#0b0521] rounded-lg text-[9.5px] font-mono text-indigo-300 overflow-x-auto leading-relaxed border border-white/5">
{`{
  "agent_id": "agt_abc123",
  "contact": {
    "name": "Aminata Koroma",
    "phone": "+23276444555",
    "language": "en"
  },
  "scheduled_at": "2026-06-18T10:00:00Z",
  "reason": "Follow up on network ref #VC-00291"
}`}
                      </pre>
                    </div>
                  </div>

                  {/* Subsection D: Appointments */}
                  <div className="space-y-3 pt-4 border-t border-white/5">
                    <span className="font-mono text-[10px] text-indigo-400 uppercase tracking-widest font-black block">
                      D. Appointments Booking Sync
                    </span>

                    <div className="bg-slate-950 p-4 rounded-2xl border border-white/5 space-y-3">
                      <div className="flex items-center gap-2 font-mono text-xs">
                        <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded font-black">POST</span>
                        <span className="text-white">/v1/appointments/book</span>
                      </div>
                      <pre className="p-2.5 bg-[#0b0521] rounded-lg text-[9.5px] font-mono text-indigo-300 overflow-x-auto leading-relaxed border border-white/5">
{`{
  "agent_id": "agt_abc123",
  "contact": {
    "name": "Ibrahim Conteh",
    "phone": "+23276777888",
    "email": "ibrahim@example.com"
  },
  "datetime": "2026-06-20T10:00:00Z",
  "purpose": "SIM card replacement"
}`}
                      </pre>
                    </div>
                  </div>

                  {/* Subsection E: Webhooks */}
                  <div className="space-y-3 pt-4 border-t border-white/5">
                    <span className="font-mono text-[10px] text-indigo-400 uppercase tracking-widest font-black block">
                      E. Webhooks & Cryptographic Signature Validation
                    </span>

                    <div className="bg-slate-950 p-4 rounded-2xl border border-white/5 space-y-4">
                      <p className="text-[11px] text-indigo-200/60 leading-relaxed">
                        Avoid spoofing: Every outgoing webhook callback embeds an <code className="text-indigo-300">X-VoiceCore-Signature</code> secure header. Always construct local HMAC tags using the configured secret to compare against:
                      </p>
                      <pre className="p-3 bg-[#0b0521] rounded-xl text-[9.5px] font-mono text-indigo-300 overflow-x-auto leading-relaxed border border-white/5">
{`const crypto = require('crypto');

function verifyWebhook(payload, signature, secret) {
  const expected = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  return \`sha256=\${expected}\` === signature;
}`}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Section 6: Language Support */}
            {activeTab === "lang" && (
              <div className="space-y-6 text-xs text-indigo-200/80 leading-relaxed" id="docs-sec-lang">
                <h3 className="text-lg font-extrabold text-white flex items-center gap-2 border-b border-white/10 pb-2">
                  <Globe className="w-5 h-5 text-indigo-400" /> 6. Language Support
                </h3>
                <p>
                  VoiceCore incorporates ultra responsive language models. It auto-detects the caller's dialect within the first 3-5 seconds of audio interaction and seamlessly updates the speech engines.
                </p>

                <div className="space-y-3">
                  <h4 className="font-extrabold text-white text-sm">Supported Languages & Dialects:</h4>
                  <table className="w-full text-xs text-indigo-200/70 border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-white font-black text-left">
                        <th className="py-2 pr-4 font-mono select-none">Code</th>
                        <th className="py-2 px-4 select-none">Language</th>
                        <th className="py-2 px-4 text-center select-none">STT</th>
                        <th className="py-2 px-4 text-center select-none">TTS</th>
                        <th className="py-2 pl-4 select-none">Voice Notes / Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-white/[0.04]">
                        <td className="py-2 pr-4 font-mono text-white">en</td>
                        <td className="py-2 px-4 font-bold text-white">English</td>
                        <td className="py-2 px-4 text-center text-emerald-400">✅</td>
                        <td className="py-2 px-4 text-center text-emerald-400">✅</td>
                        <td className="py-2 pl-4">Standard Default profile</td>
                      </tr>
                      <tr className="border-b border-white/[0.04]">
                        <td className="py-2 pr-4 font-mono text-white">fr</td>
                        <td className="py-2 px-4 font-bold text-white">French</td>
                        <td className="py-2 px-4 text-center text-emerald-400">✅</td>
                        <td className="py-2 px-4 text-center text-emerald-400">✅</td>
                        <td className="py-2 pl-4">European and African variants</td>
                      </tr>
                      <tr className="border-b border-white/[0.04]">
                        <td className="py-2 pr-4 font-mono text-indigo-400">krio</td>
                        <td className="py-2 px-4 font-bold text-white">Krio (Sierra Leone)</td>
                        <td className="py-2 px-4 text-center text-emerald-400">✅</td>
                        <td className="py-2 px-4 text-center text-emerald-400">✅</td>
                        <td className="py-2 pl-4 text-indigo-400 font-semibold">Custom fine-tuning model for SL</td>
                      </tr>
                      <tr className="border-b border-white/[0.04]">
                        <td className="py-2 pr-4 font-mono text-white">es</td>
                        <td className="py-2 px-4 font-bold text-white">Spanish</td>
                        <td className="py-2 px-4 text-center text-emerald-400">✅</td>
                        <td className="py-2 px-4 text-center text-emerald-400">✅</td>
                        <td className="py-2 pl-4">Latin American & Castilian voice pacing</td>
                      </tr>
                      <tr className="border-b border-white/[0.04]">
                        <td className="py-2 pr-4 font-mono text-white">ar</td>
                        <td className="py-2 px-4 font-bold text-white">Arabic</td>
                        <td className="py-2 px-4 text-center text-emerald-400">✅</td>
                        <td className="py-2 px-4 text-center text-emerald-400">✅</td>
                        <td className="py-2 pl-4">Right-to-left syntax validation supported</td>
                      </tr>
                      <tr className="border-b border-white/[0.04]">
                        <td className="py-2 pr-4 font-mono text-indigo-400">pcm</td>
                        <td className="py-2 px-4 font-bold text-white">Nigerian Pidgin</td>
                        <td className="py-2 px-4 text-center text-emerald-400">✅</td>
                        <td className="py-2 px-4 text-center text-emerald-400">✅</td>
                        <td className="py-2 pl-4 text-indigo-400">West African local vernacular pacing</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-white/5 space-y-2.5">
                  <span className="font-mono text-[9px] text-indigo-400 uppercase tracking-widest block">Forcing strict context language</span>
                  <pre className="p-3 bg-[#0b0521] rounded-lg text-[9.5px] font-mono text-indigo-300 overflow-x-auto leading-relaxed border border-white/5">
{`{
  "contact": {
    "phone": "+23276444555",
    "language": "krio"
  }
}`}
                  </pre>
                </div>
              </div>
            )}

            {/* Section 7: Error Codes */}
            {activeTab === "errors" && (
              <div className="space-y-6 text-xs text-indigo-200/80 leading-relaxed" id="docs-sec-errors">
                <h3 className="text-lg font-extrabold text-white flex items-center gap-2 border-b border-white/10 pb-2">
                  <ShieldAlert className="w-5 h-5 text-indigo-400" /> 7. Error Codes
                </h3>
                <p>
                  Any non-2xx transaction returns a fully-validated responsive error body explaining exact parameter errors:
                </p>

                <div className="relative">
                  <pre className="p-4 bg-slate-950 text-[10px] font-mono text-indigo-250 rounded-xl overflow-x-auto border border-white/5 leading-relaxed">
{`{
  "error_code": "INVALID_PHONE_NUMBER",
  "message": "The phone number provided is not in E.164 format.",
  "details": {
    "field": "phone_number",
    "provided": "076000000",
    "expected_format": "+23276000000"
  }
}`}
                  </pre>
                  <button 
                    onClick={() => handleCopy(`{\n  "error_code": "INVALID_PHONE_NUMBER",\n  "message": "The phone number provided is not in E.164 format.",\n  "details": {\n    "field": "phone_number",\n    "provided": "076000000",\n    "expected_format": "+23276000000"\n  }\n}`, "err-json")}
                    className="absolute top-2 right-2 text-[10px] font-mono hover:text-white bg-[#0b0521] px-2 py-1 rounded border border-white/10"
                  >
                    {copiedText === "err-json" ? "Copied!" : "Copy"}
                  </button>
                </div>

                <div className="space-y-3">
                  <h4 className="font-extrabold text-white text-sm">Error Matrix:</h4>
                  <table className="w-full text-xs text-indigo-200/70 border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-white font-black text-left">
                        <th className="py-2 pr-4 font-mono select-none">Status</th>
                        <th className="py-2 px-4 select-none">Error Code</th>
                        <th className="py-2 pl-4 select-none">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-white/[0.04]">
                        <td className="py-2 pr-4 font-mono font-bold text-red-400">400</td>
                        <td className="py-2 px-4 font-mono text-white">INVALID_PHONE_NUMBER</td>
                        <td className="py-2 pl-4">Target not in standard international E.164 validation strings.</td>
                      </tr>
                      <tr className="border-b border-white/[0.04]">
                        <td className="py-2 pr-4 font-mono font-bold text-red-400">401</td>
                        <td className="py-2 px-4 font-mono text-white">UNAUTHORIZED</td>
                        <td className="py-2 pl-4">Carrier header credential key failed to authenticate trunk scopes.</td>
                      </tr>
                      <tr className="border-b border-white/[0.04]">
                        <td className="py-2 pr-4 font-mono font-bold text-red-400">403</td>
                        <td className="py-2 px-4 font-mono text-white">PLAN_LIMIT_EXCEEDED</td>
                        <td className="py-2 pl-4">Monthly minute allocations or B2B follow-up tasks exceeded account caps.</td>
                      </tr>
                      <tr className="border-b border-white/[0.04]">
                        <td className="py-2 pr-4 font-mono font-bold text-red-400">404</td>
                        <td className="py-2 px-4 font-mono text-white">AGENT_NOT_FOUND</td>
                        <td className="py-2 pl-4">No configured dial core tags found matching specified query variables.</td>
                      </tr>
                      <tr className="border-b border-white/[0.04]">
                        <td className="py-2 pr-4 font-mono font-bold text-red-400">409</td>
                        <td className="py-2 px-4 font-mono text-white">SLOT_UNAVAILABLE</td>
                        <td className="py-2 pl-4">Calendar appointment conflict. The voice booking slot is already claimed.</td>
                      </tr>
                      <tr className="border-b border-white/[0.04]">
                        <td className="py-2 pr-4 font-mono font-bold text-red-400">429</td>
                        <td className="py-2 px-4 font-mono text-white">RATE_LIMITED</td>
                        <td className="py-2 pl-4">Trunk bandwidth limits reached too many outbound hooks/sec.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Section 8: Rate Limits */}
            {activeTab === "limits" && (
              <div className="space-y-6 text-xs text-indigo-200/80 leading-relaxed" id="docs-sec-limits">
                <h3 className="text-lg font-extrabold text-white flex items-center gap-2 border-b border-white/10 pb-2">
                  <Clock className="w-5 h-5 text-indigo-400" /> 8. Rate Limits
                </h3>
                <p>Usage quotas apply to safeguard bandwidth concurrency on standard cellular cells:</p>

                <div className="space-y-3">
                  <table className="w-full text-xs text-indigo-200/70 border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-white font-black text-left">
                        <th className="py-2 pr-4 select-none">Client Plan Tier</th>
                        <th className="py-2 px-4 text-center select-none">Requests / Min</th>
                        <th className="py-2 pl-4 text-right select-none">Concurrent Carrier Calls</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-white/[0.04]">
                        <td className="py-2 pr-4 font-black text-indigo-300">Starter Core</td>
                        <td className="py-2 px-4 text-center">60 RPM</td>
                        <td className="py-2 pl-4 text-right">5 Max</td>
                      </tr>
                      <tr className="border-b border-white/[0.04]">
                        <td className="py-2 pr-4 font-black text-indigo-300">Business Hub</td>
                        <td className="py-2 px-4 text-center">300 RPM</td>
                        <td className="py-2 pl-4 text-right">50 Max</td>
                      </tr>
                      <tr className="border-b border-white/[0.04]">
                        <td className="py-2 pr-4 font-black flex items-center gap-1 text-emerald-300">Institutional SLA <CheckCircle className="w-3.5 h-3.5" /></td>
                        <td className="py-2 px-4 text-center text-emerald-400 font-bold">1,000 RPM</td>
                        <td className="py-2 pl-4 text-right text-emerald-400 font-bold">Unlimited Concurrency</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-white/5 space-y-3">
                  <h4 className="font-mono text-[9px] text-indigo-400 uppercase tracking-widest font-extrabold flex items-center gap-1">
                    Node.js Exponential Backoff Logic Example:
                  </h4>
                  <pre className="p-3 bg-[#0b0521] rounded-lg text-[9.5px] font-mono text-indigo-300 overflow-x-auto leading-relaxed border border-white/5">
{`async function apiCallWithRetry(fn, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (err.status === 429 && i < retries - 1) {
        const wait = Math.pow(2, i) * 1000;
        await new Promise(r => setTimeout(r, wait));
      } else {
        throw err;
      }
    }
  }
}`}
                  </pre>
                </div>
              </div>
            )}

            {/* Section 9: SDKs & Live Code */}
            {activeTab === "sdks" && (
              <div className="space-y-6 text-xs text-indigo-200/80 leading-relaxed" id="docs-sec-code">
                <h3 className="text-lg font-extrabold text-white flex items-center gap-2 border-b border-white/10 pb-2">
                  <Terminal className="w-5 h-5 text-indigo-400" /> 9. SDKs & Live Code Examples
                </h3>

                <div className="space-y-6">
                  {/* Node.js SDK */}
                  <div className="space-y-3">
                    <span className="font-mono text-[10px] text-indigo-400 hover:underline uppercase block">
                      📌 NODE.JS WRAPPER IMPLEMENTATION:
                    </span>
                    <div className="relative">
                      <pre className="p-4 bg-slate-950 text-[10px] font-mono text-indigo-250 rounded-2xl overflow-x-auto border border-white/5 leading-relaxed max-h-[50vh]">
{`const VoiceCore = require('@voicecore/node-sdk');

const client = new VoiceCore({
  apiKey: process.env.VOICECORE_API_KEY,
  environment: 'production'
});

async function setupAgent() {
  // 1. Create B2B operator agent instance
  const agent = await client.agents.configure({
    business_name: 'Africell Sierra Leone',
    agent_name: 'Aria',
    primary_language: 'en',
    supported_languages: ['en', 'krio', 'fr'],
    phone_number: '+23276000000',
    timezone: 'Africa/Freetown',
    escalation_number: '+23276111111'
  });

  console.log('Agent created:', agent.agent_id);

  // 2. Add knowledge base FAQ definitions
  await client.knowledgeBase.addEntries(agent.agent_id, [
    {
      category: 'pricing',
      question: 'How much does a 5GB bundle cost?',
      answer: 'Le 50,000 for 30 days. Dial *123# to activate.'
    }
  ]);

  // 3. Mount SIP trunk bindings
  await client.calls.inbound.setup({
    agent_id: agent.agent_id,
    phone_number: '+23276000000',
    call_recording: true,
    post_call_sms: true
  });
}

setupAgent();`}
                      </pre>
                      <button 
                        onClick={() => handleCopy(`const VoiceCore = require('@voicecore/node-sdk');\n\nconst client = new VoiceCore({\n  apiKey: process.env.VOICECORE_API_KEY,\n  environment: 'production'\n});\n\nasync function setupAgent() {\n  const agent = await client.agents.configure({\n    business_name: 'Africell Sierra Leone',\n    agent_name: 'Aria',\n    primary_language: 'en',\n    supported_languages: ['en', 'krio', 'fr'],\n    phone_number: '+23276000000',\n    timezone: 'Africa/Freetown',\n    escalation_number: '+23276111111'\n  });\n  console.log('Agent created:', agent.agent_id);\n}`, "node-sdk")}
                        className="absolute top-2 right-2 text-[10px] font-mono hover:text-white bg-[#0b0521] px-2.5 py-1.5 rounded-lg border border-white/10"
                      >
                        {copiedText === "node-sdk" ? "Copied Boilerplate!" : "Copy Code"}
                      </button>
                    </div>
                  </div>

                  {/* Python Client */}
                  <div className="space-y-3 pt-4 border-t border-white/5">
                    <span className="font-mono text-[10px] text-indigo-400 hover:underline uppercase block">
                      📌 PYTHON - CALENDAR BOOKING INTEGRATION:
                    </span>
                    <div className="relative font-mono">
                      <pre className="p-4 bg-slate-950 text-[10px] text-indigo-250 rounded-2xl overflow-x-auto border border-white/5 leading-relaxed max-h-72">
{`import voicecore

client = voicecore.Client(api_key="vc_live_xxxx")

appointment = client.appointments.book(
    agent_id="agt_abc123",
    contact={
        "name": "Fatmata Sesay",
        "phone": "+23276222333",
        "email": "fatmata@example.com"
    },
    datetime="2026-06-20T10:00:00Z",
    duration_minutes=30,
    location="Aberdeen Branch, Freetown",
    purpose="SIM replacement",
    send_confirmation=True,
    reminder_hours_before=[24, 1]
)

print(f"Appointment booked successfully: {appointment.reference}")`}
                      </pre>
                      <button 
                        onClick={() => handleCopy(`import voicecore\n\nclient = voicecore.Client(api_key="vc_live_xxxx")\n\nappointment = client.appointments.book(\n    agent_id="agt_abc123",\n    contact={\n        "name": "Fatmata Sesay",\n        "phone": "+23276222333",\n        "email": "fatmata@example.com"\n    },\n    datetime="2026-06-20T10:00:00Z",\n    duration_minutes=30,\n    location="Aberdeen Branch, Freetown",\n    purpose="SIM replacement",\n    send_confirmation=True,\n    reminder_hours_before=[24, 1]\n)\nprint(f"Appointment booked: {appointment.reference}")`, "py-sdk")}
                        className="absolute top-2 right-2 text-[10px] font-mono hover:text-white bg-[#0b0521] px-2.5 py-1.5 rounded-lg border border-white/10"
                      >
                        {copiedText === "py-sdk" ? "Copied Boilerplate!" : "Copy Code"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Section 10: Sandbox & Testing */}
            {activeTab === "sandbox" && (
              <div className="space-y-6 text-xs text-indigo-200/80 leading-relaxed" id="docs-sec-testing">
                <h3 className="text-lg font-extrabold text-white flex items-center gap-2 border-b border-white/10 pb-2">
                  <Flame className="w-5 h-5 text-indigo-400" /> 10. Sandbox & Testing
                </h3>
                <p>
                  Use your secret <span className="font-mono text-emerald-400">vc_test_</span> token key to experiment with telecom trunk responses without dialing physical phone targets or consuming carrier subscription minutes.
                </p>
                <div className="space-y-2">
                  <span className="font-mono text-[9px] text-indigo-400 uppercase tracking-wider block">Sandbox testing simulation endpoint:</span>
                  <div className="relative">
                    <pre className="p-4 bg-slate-950 text-[10px] font-mono text-indigo-250 rounded-xl overflow-x-auto border border-white/5 leading-relaxed">
{`curl -X POST https://api.voicecore.io/v1/test/simulate-call \\
  -H "Authorization: Bearer vc_test_xxxx" \\
  -H "Content-Type: application/json" \\
  -d '{
    "agent_id": "agt_abc123",
    "caller_number": "+23276999999",
    "language": "krio",
    "simulated_speech": "I wan know mi balance"
  }'`}
                    </pre>
                    <button 
                      onClick={() => handleCopy(`curl -X POST https://api.voicecore.io/v1/test/simulate-call \\\n  -H "Authorization: Bearer vc_test_xxxx" \\\n  -H "Content-Type: application/json" \\\n  -d '{\n    "agent_id": "agt_abc123",\n    "caller_number": "+23276999999",\n    "language": "krio",\n    "simulated_speech": "I wan know mi balance"\n  }'`, "test-sim")}
                      className="absolute top-2 right-2 text-[10px] font-mono hover:text-white bg-[#0b0521] px-2 py-1 rounded border border-white/10"
                    >
                      {copiedText === "test-sim" ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Section 11: Support & Log */}
            {activeTab === "support-changelog" && (
              <div className="space-y-6 text-xs text-indigo-200/80 leading-relaxed" id="docs-sec-changelog">
                <h3 className="text-lg font-extrabold text-white flex items-center gap-2 border-b border-white/10 pb-2">
                  <CheckCircle className="w-5 h-5 text-indigo-400" /> 11. Support & Changelog
                </h3>
                
                <div className="space-y-3">
                  <h4 className="font-extrabold text-white text-sm">Developer Channels:</h4>
                  <table className="w-full text-xs text-indigo-200/70 border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-white font-black text-left">
                        <th className="py-2 pr-4 select-none">Method</th>
                        <th className="py-2 px-4 select-none">Contact / Address</th>
                        <th className="py-2 pl-4 text-right select-none">Expected Response</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-white/[0.04]">
                        <td className="py-2 pr-4 font-bold text-white">Email support</td>
                        <td className="py-2 px-4 font-mono text-indigo-300">dev@voicecore.io</td>
                        <td className="py-2 pl-4 text-right">&lt; 24 hours</td>
                      </tr>
                      <tr className="border-b border-white/[0.04]">
                        <td className="py-2 pr-4 font-bold text-white">Business SLA</td>
                        <td className="py-2 px-4 font-mono text-indigo-300">support@voicecore.io</td>
                        <td className="py-2 pl-4 text-right">&lt; 4 hours</td>
                      </tr>
                      <tr className="border-b border-white/[0.04]">
                        <td className="py-2 pr-4 font-bold text-white">Emergency Direct</td>
                        <td className="py-2 px-4 font-mono text-indigo-300">+23276-VOICE</td>
                        <td className="py-2 pl-4 text-right text-emerald-400">&lt; 1 hour live</td>
                      </tr>
                      <tr className="border-b border-white/[0.04]">
                        <td className="py-2 pr-4 font-bold text-white">Status reports</td>
                        <td className="py-2 px-4 font-mono text-indigo-300">status.voicecore.io</td>
                        <td className="py-2 pl-4 text-right text-emerald-400 font-bold">Realtime Live</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="space-y-3 pt-4 border-t border-white/5 bg-[#08021a]/25 p-4 rounded-xl">
                  <h4 className="font-extrabold text-white text-sm">Changelog — Version History:</h4>
                  <div className="border-l-2 border-indigo-500/40 pl-3.5 space-y-1.5 text-[11px]">
                    <span className="font-bold text-white block">v1.0.0 — Stable Production Release (June 2026)</span>
                    <p className="text-indigo-200/50">
                      • Multi-lingual inbound scheduling with fine-tuned voice recognition algorithms.<br />
                      • Bulk followups using CSV file parsing engine and automated cron pipelines.<br />
                      • Micro-concurrency scaling for enterprise telecom nodes.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-4 border-t border-white/10 shrink-0 bg-slate-950/60 flex flex-col sm:flex-row justify-between items-center gap-2.5 text-xs text-indigo-200/40 font-mono tracking-wider " id="docs-footer">
          <span>VoiceCore Integration SDK v1.0.0 Stable • Secure B2B Telco Blueprint</span>
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-550 text-white font-extrabold text-xs tracking-wider uppercase rounded-xl transition-all cursor-pointer"
          >
            Acknowledge Documentation
          </button>
        </div>
      </motion.div>
    </div>
  );
}
