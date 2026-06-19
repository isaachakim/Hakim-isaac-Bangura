import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Share2, 
  DollarSign, 
  Rocket, 
  Handshake, 
  Activity, 
  PhoneCall, 
  Globe, 
  Copy, 
  ExternalLink, 
  Check, 
  ChevronRight, 
  TrendingUp, 
  ShieldCheck, 
  BookOpen,
  Mail,
  Workflow,
  Key,
  Code,
  Terminal,
  Cpu,
  X,
  Play,
  Send,
  Server
} from "lucide-react";
import VoiceCoreDocsModal from "./VoiceCoreDocsModal";

export default function MVPInvestorHub() {
  const [copied, setCopied] = useState(false);
  const [apiKey, setApiKey] = useState<string>("hk_telecom_live_6f3e2b1c8a9d0e4f");
  const [selectedOperator, setSelectedOperator] = useState<string>("Orange");
  const [copiedKey, setCopiedKey] = useState<boolean>(false);
  const [copiedSnippet, setCopiedSnippet] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'curl' | 'node' | 'python'>('curl');
  const [showIntegrationModal, setShowIntegrationModal] = useState<boolean>(false);
  const [showDocsModal, setShowDocsModal] = useState<boolean>(false);
  
  // Sandbox form states for live simulation within modal
  const [sandboxPhone, setSandboxPhone] = useState<string>("+232-77-900321");
  const [sandboxCompanion, setSandboxCompanion] = useState<string>("Zephyr");
  const [sandboxLogs, setSandboxLogs] = useState<string[]>([]);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [copiedModalSnippet, setCopiedModalSnippet] = useState<boolean>(false);
  
  const shareUrl = "https://ais-pre-g67htmctkgxng2bvzv56ts-943582631332.europe-west2.run.app";

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      // Fallback
      const textArea = document.createElement("textarea");
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleGenerateKey = () => {
    const chars = "abcdef0123456789";
    let token = "hk_" + selectedOperator.toLowerCase() + "_live_";
    for (let i = 0; i < 16; i++) {
      token += chars[Math.floor(Math.random() * chars.length)];
    }
    setApiKey(token);
  };

  const handleCopyKey = async () => {
    try {
      await navigator.clipboard.writeText(apiKey);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 3000);
    } catch {
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 3000);
    }
  };

  const getCurlSnippet = () => {
    return `curl -X POST "https://ais-pre-g67htmctkgxng2bvzv56ts-943582631332.europe-west2.run.app/api/telecom/v1/dispatch" \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "X-Operator-Provider: ${selectedOperator}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "recipient_phone": "+23277000000",
    "voice_companion": "Zephyr",
    "dial_context_language": "en",
    "sms_smtp_receipt_dispatch": true,
    "system_instructions": "Outbound scheduling helper"
  }'`;
  };

  const getPythonSnippet = () => {
    return `import requests
import json

# Provisioned credential for ${selectedOperator}
API_KEY = "${apiKey}"
URL = "https://ais-pre-g67htmctkgxng2bvzv56ts-943582631332.europe-west2.run.app/api/telecom/v1/dispatch"

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "X-Operator-Provider": "${selectedOperator}",
    "Content-Type": "application/json"
}

payload = {
    "recipient_phone": "+23277000000",
    "voice_companion": "Zephyr",
    "dial_context_language": "en",
    "sms_smtp_receipt_dispatch": True,
    "system_instructions": "Outbound scheduling helper"
}

response = requests.post(url=URL, headers=headers, data=json.dumps(payload))
print("Status Code:", response.status_code)
print("Response JSON:", response.json())`;
  };

  const getNodeSnippet = () => {
    return `// Hakim Isaac Telecom B2B Client Engine Node.js
const API_KEY = "${apiKey}";
const URL = "https://ais-pre-g67htmctkgxng2bvzv56ts-943582631332.europe-west2.run.app/api/telecom/v1/dispatch";

const payload = {
  recipient_phone: "+23277000000",
  voice_companion: "Zephyr",
  dial_context_language: "en",
  sms_smtp_receipt_dispatch: true,
  system_instructions: "Outbound scheduling helper"
};

fetch(URL, {
  method: "POST",
  headers: {
    "Authorization": \`Bearer \${API_KEY}\`,
    "X-Operator-Provider": "${selectedOperator}",
    "Content-Type": "application/json"
  },
  body: JSON.stringify(payload)
})
  .then(res => res.json())
  .then(data => console.log("Dispatch successfully established:", data))
  .catch(err => console.error("Operator trunk dispatch failed:", err));`;
  };

  const getActiveSnippetText = () => {
    if (activeTab === 'curl') return getCurlSnippet();
    if (activeTab === 'node') return getNodeSnippet();
    return getPythonSnippet();
  };

  const handleCopySnippet = async () => {
    try {
      await navigator.clipboard.writeText(getActiveSnippetText());
      setCopiedSnippet(true);
      setTimeout(() => setCopiedSnippet(false), 3000);
    } catch {
      setCopiedSnippet(true);
      setTimeout(() => setCopiedSnippet(false), 3000);
    }
  };

  const handleStartSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setSandboxLogs([]);
    const messages = [
      `[INIT] Establishing connection to carrier signaling trunk (${selectedOperator})...`,
      `[AUTH] Authenticating requests with token ${apiKey.substring(0, 10)}... [OK]`,
      `[DIAL] Triggering live SIP dial out to recipient phone: ${sandboxPhone}...`,
      `[VOICE] Voice engine initiated with Companion voice profile: ${sandboxCompanion}`,
      `[SYNC] Synchronization active in Krio / English dialect with live voice synthesis stream...`,
      `[SUCCESS] Dispatch call session completed successfully. Automated transaction written to database ledger and SMTP logs dispatched.`
    ];

    messages.forEach((msg, idx) => {
      setTimeout(() => {
        setSandboxLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
        if (idx === messages.length - 1) {
          setIsSimulating(false);
        }
      }, (idx + 1) * 800);
    });
  };

  return (
    <div className="bg-[#0b0521] border-2 border-indigo-500/40 rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden" id="mvp-investor-hub-root">
      
      {/* Decorative Glowing Orbs */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10" id="investor-hub-meta">
        <div className="text-left">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-[10px] font-mono font-bold uppercase text-indigo-300 flex items-center gap-1">
              <Rocket className="w-3 h-3 text-indigo-400" /> MVP Launch Deck
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-mono font-bold uppercase text-emerald-400 flex items-center gap-1">
              <Handshake className="w-3 h-3" /> Telecom Ready
            </span>
          </div>
          <h2 className="text-2xl font-black text-white mt-2 tracking-tight leading-none">
            🚀 MVP Investment & Telecom B2B Partnership Hub
          </h2>
          <p className="text-xs text-indigo-200/60 mt-1.5 max-w-3xl leading-relaxed">
            Presenting the core commercial framework for venture capital partners and telecom operators. This prototype demonstrates an automated voice-telephony-to-dispatch engine processing live omnichannel booking requests sync'd with SMTP relays.
          </p>
        </div>

        {/* Highlight Action Deck */}
        <div className="flex flex-wrap items-center gap-3 shrink-0" id="header-action-deck">
          <button
            onClick={() => {
              setShowIntegrationModal(true);
              setSandboxLogs([`[${new Date().toLocaleTimeString()}] Ready to test operator pipeline simulated payload...`]);
            }}
            className="px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-300 flex items-center gap-2 cursor-pointer border select-none bg-emerald-600/10 hover:bg-emerald-600/20 border-emerald-500/40 text-emerald-300 hover:text-white shadow-md shadow-emerald-900/10 animate-pulse"
            id="open-integration-modal-button"
          >
            <Code className="w-4 h-4 text-emerald-400" />
            🔌 B2B Code Integration
          </button>

          <button
            onClick={() => setShowDocsModal(true)}
            className="px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-300 flex items-center gap-2 cursor-pointer border select-none bg-indigo-600/10 hover:bg-indigo-600/20 border-indigo-500/40 text-indigo-300 hover:text-white shadow-md shadow-indigo-900/10"
            id="open-docs-modal-button"
          >
            <BookOpen className="w-4 h-4 text-indigo-400" />
            📖 API Documentation
          </button>

          <button
            onClick={handleCopyLink}
            className={`px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-300 flex items-center gap-2 cursor-pointer border select-none shrink-0 ${
              copied 
                ? 'bg-emerald-600 border-emerald-400 text-white shadow-lg shadow-emerald-655/20' 
                : 'bg-indigo-600 hover:bg-indigo-550 border-indigo-500 text-white hover:text-white shadow-lg shadow-indigo-600/30'
            }`}
            id="copy-mvp-link-button"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                Copied Pitch Link!
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-indigo-200" />
                Copy MVP Pitch Link
              </>
            )}
          </button>
        </div>
      </div>

      {/* Interactive Value Proposition Grid for Friends / Investors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 relative z-10" id="investor-prop-grid">
        
        {/* Value Prop Card 1: The Commercial Problem */}
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 hover:bg-white/[0.03] transition-all space-y-3 flex flex-col justify-between text-left">
          <div className="space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-orange-550/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
              <PhoneCall className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-extrabold text-white">1. Telecom Voice Friction</h3>
            <p className="text-[11px] text-indigo-200/50 leading-relaxed">
              Standard businesses and public service providers suffer from infinite customer hold times and costly call center operations. In developing/multilingual markets, lack of digital integration exacerbates queue fallouts.
            </p>
          </div>
          <div className="text-[10px] text-orange-400 font-mono font-bold uppercase tracking-wider flex items-center gap-1 pt-2">
            Target Market: Africa, LatAm, EU • <TrendingUp className="w-3.5 h-3.5 shrink-0" /> High TAM
          </div>
        </div>

        {/* Value Prop Card 2: Our AI VoIP Integration */}
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 hover:bg-white/[0.03] transition-all space-y-3 flex flex-col justify-between text-left">
          <div className="space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Workflow className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-extrabold text-white">2. Auto Duplex Sync</h3>
            <p className="text-[11px] text-indigo-200/50 leading-relaxed">
              Our system captures duplex VoIP call streams, matches client scheduling intents using advanced syntax parsers, writes entries to the ledger, and instigates rapid post-call confirmation emails instantly & hands-free.
            </p>
          </div>
          <div className="text-[10px] text-indigo-400 font-mono font-bold uppercase tracking-wider flex items-center gap-1 pt-2">
            Features: Dialect Parser • SMTP Dispatcher
          </div>
        </div>

        {/* Value Prop Card 3: Telecom B2B Monetization */}
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 hover:bg-white/[0.03] transition-all space-y-3 flex flex-col justify-between text-left">
          <div className="space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-extrabold text-white">3. Telecom Revenue Model</h3>
            <p className="text-[11px] text-indigo-200/50 leading-relaxed">
              We white-label or license this tech directly to Telecom Operators (Orange, Africell, MTN, etc.). Telecoms bundle this voice service with smart virtual numbers, charging businesses per-minute or on SaaS tiered subscription tiers.
            </p>
          </div>
          <div className="text-[10px] text-emerald-400 font-mono font-bold uppercase tracking-wider flex items-center gap-1 pt-2">
            Margin Projection: 82% Net SAAS Margin
          </div>
        </div>

      </div>

      {/* Interactive Telecom B2B Integration & API Console */}
      <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-5 sm:p-6 text-left relative z-10" id="telecom-b2b-api-console">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 border-b border-white/10 pb-4 mb-4">
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
              <Key className="w-4 h-4 text-emerald-400" /> B2B Telecom Operator Integration & API Center
            </h3>
            <p className="text-[11px] text-indigo-200/60 mt-1">
              Showcase this fully modeled B2B environment to friends, VC pitch panels, or carrier systems engineers to explain integration flows.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-indigo-300">Target Carrier:</span>
            <select 
              value={selectedOperator} 
              onChange={(e) => setSelectedOperator(e.target.value)}
              className="bg-slate-950 border border-white/10 rounded-xl px-2.5 py-1 text-xs text-white font-bold tracking-tight outline-none"
            >
              <option value="Orange">Orange Business</option>
              <option value="Africell">Africell Group</option>
              <option value="MTN">MTN Global</option>
              <option value="Sierratel">Sierratel B2B</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch" id="api-generator-columns">
          {/* Left Block: Token Generator & Credential Provisioner */}
          <div className="lg:col-span-5 bg-white/[0.01] border border-white/5 rounded-xl p-4 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <span className="text-[9px] font-mono font-bold text-indigo-400 uppercase tracking-widest block">
                🔴 SECURED OPERATOR ENDPOINT TOKEN
              </span>
              <div className="p-3 bg-slate-950 rounded-lg border border-white/10 relative overflow-hidden flex items-center justify-between">
                <span className="font-mono text-emerald-400 text-xs sm:text-sm tracking-wider select-all">
                  {apiKey}
                </span>
                <button 
                  onClick={handleCopyKey}
                  className="text-indigo-400 hover:text-white cursor-pointer p-1 rounded hover:bg-white/5 shrink-0 ml-2"
                  title="Copy Token to Clipboard"
                >
                  {copiedKey ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <div className="text-[10px] text-indigo-200/50 leading-relaxed space-y-1">
                <p>• Unique hash scopes to <b>{selectedOperator} B2B trunking infrastructure</b>.</p>
                <p>• Passes standard telecom authorization protocols safely without disclosing internal client keys.</p>
              </div>
            </div>

            <button
              onClick={handleGenerateKey}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-emerald-950/20"
              id="generate-operator-token-btn"
            >
              <Cpu className="w-3.5 h-3.5" />
              Regenerate {selectedOperator} Token
            </button>
          </div>

          {/* Right Block: Live SDK / Multi-Language Integration Blueprint */}
          <div className="lg:col-span-7 bg-slate-950/80 rounded-xl border border-white/5 p-4 flex flex-col justify-between space-y-3 relative">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1">
                  <Terminal className="w-3 h-3 text-indigo-400" /> API CLIENT SNIPPETS
                </span>
                <div className="flex items-center gap-1 bg-white/5 p-0.5 rounded-lg border border-white/5">
                  {(['curl', 'node', 'python'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-tight transition-all cursor-pointer ${
                        activeTab === tab 
                          ? 'bg-indigo-600 text-white shadow-sm' 
                          : 'text-indigo-300 hover:text-white'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
              
              <button 
                onClick={handleCopySnippet}
                className="text-[10px] text-indigo-300 hover:text-white font-mono flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5 cursor-pointer self-stretch sm:self-auto justify-center"
              >
                {copiedSnippet ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" /> Copied Code!
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" /> Copy Snippet
                  </>
                )}
              </button>
            </div>
            
            <pre className="font-mono text-[10px] text-indigo-200/80 bg-slate-950 p-3 rounded-lg overflow-x-auto leading-relaxed border border-white/5 select-all max-h-40">
              {getActiveSnippetText()}
            </pre>
            
            <div className="text-[9px] font-mono text-indigo-300/40 leading-none">
              Note: This {activeTab === 'curl' ? 'REST interface' : `${activeTab === 'node' ? 'Node.js wrapper' : 'Python requests agent'}`} securely triggers Hakim Isaac to perform outbound voice signaling on native carriers.
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Pitch Highlights & Core Metrics */}
      <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-5 sm:p-6 text-left relative z-10" id="pitch-insights-board">
        <h3 className="text-xs font-black uppercase tracking-wider text-white mb-4 flex items-center gap-2">
          <Activity className="w-4 h-4 text-indigo-400" /> Interactive Pitch Presentation Blueprint & Key Selling Points
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4" id="mvp-statistics">
          <div className="p-4 bg-indigo-950/15 border border-indigo-500/10 rounded-xl space-y-1">
            <div className="text-[10px] font-mono font-bold text-indigo-300 uppercase tracking-widest">VoIP Latency</div>
            <div className="text-xl font-bold text-white flex items-baseline gap-1">
              <span>&lt; 180ms</span>
              <span className="text-[10px] font-mono text-emerald-400 text-xs">🚀 Realtime</span>
            </div>
            <p className="text-[9px] text-indigo-200/40">Guarantees natural voice pacing</p>
          </div>

          <div className="p-4 bg-indigo-950/15 border border-indigo-500/10 rounded-xl space-y-1">
            <div className="text-[10px] font-mono font-bold text-indigo-300 uppercase tracking-widest">Dialects Live</div>
            <div className="text-xl font-bold text-white flex items-baseline gap-1">
              <span>5 Dialects</span>
              <span className="text-[10px] font-mono text-indigo-400 text-xs">Global</span>
            </div>
            <p className="text-[9px] text-indigo-200/40">Krio, Pidgin, ES, FR, EN native contexts</p>
          </div>

          <div className="p-4 bg-indigo-950/15 border border-indigo-500/10 rounded-xl space-y-1">
            <div className="text-[10px] font-mono font-bold text-indigo-300 uppercase tracking-widest">Automated SMTP</div>
            <div className="text-xl font-bold text-white flex items-baseline gap-1">
              <span>100% Auto</span>
              <span className="text-[10px] font-mono text-emerald-400 text-xs font-semibold">Ready</span>
            </div>
            <p className="text-[9px] text-indigo-200/40">Zero manual customer management</p>
          </div>

          <div className="p-4 bg-indigo-950/15 border border-indigo-500/10 rounded-xl space-y-1">
            <div className="text-[10px] font-mono font-bold text-indigo-300 uppercase tracking-widest">Operator Integration</div>
            <div className="text-xl font-bold text-white flex items-baseline gap-1">
              <span>SIP/SDN Webhook</span>
            </div>
            <p className="text-[9px] text-indigo-200/40">Designed to bridge mobile SIM slots</p>
          </div>
        </div>

        {/* Interactive Step-by-Step Investor Guide */}
        <div className="mt-5 pt-5 border-t border-white/5 space-y-3.5" id="investor-guide-block">
          <span className="text-[10px] font-mono font-bold text-indigo-300 uppercase tracking-widest block">
            ⭐ HOW TO DEMO THIS MVP TO POTENTIAL INVESTORS:
          </span>

          <ol className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-indigo-200/80">
            <li className="flex gap-2.5 items-start p-2 border border-white/[0.02] bg-white/[0.01] rounded-xl">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-550/20 text-indigo-300 font-bold font-mono text-[10px] shrink-0">1</span>
              <div>
                <b className="text-white block font-semibold">Copy and Share MVP Link:</b>
                Send the copied pitch link to stakeholders. Let them open it anywhere (mobile, tablet, or web browser).
              </div>
            </li>
            <li className="flex gap-2.5 items-start p-2 border border-white/[0.02] bg-white/[0.01] rounded-xl">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-550/20 text-indigo-300 font-bold font-mono text-[10px] shrink-0">2</span>
              <div>
                <b className="text-white block font-semibold">Perform Live Voice Booking & API Test:</b>
                Tap the microphone, say a request in Krio, Pidgin, or English, or run the live developer cURL snippet to demonstrate backend reliability.
              </div>
            </li>
            <li className="flex gap-2.5 items-start p-2 border border-white/[0.02] bg-white/[0.01] rounded-xl">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-550/20 text-indigo-300 font-bold font-mono text-[10px] shrink-0">3</span>
              <div>
                <b className="text-white block font-semibold">Review SMTP & Screenshare logs:</b>
                Go to the Email Center to view the automatically compiled email confirmation message or show a live mirror presentation with the Screen Share tool!
              </div>
            </li>
          </ol>
        </div>

        <div className="mt-5 p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-between text-xs font-semibold text-indigo-300" id="pitch-link-box">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4.5 h-4.5 text-indigo-400 shrink-0" />
            <span>Copy this fast-access URL to paste onto message drafts, pitch decks, emails, or WhatsApp chats:</span>
          </div>
          <span className="font-mono bg-slate-950 px-3 py-1.5 rounded-lg text-indigo-200 border border-white/10 flex items-center gap-2 select-all select-none">
            {shareUrl}
            <button onClick={handleCopyLink} className="text-indigo-400 hover:text-white cursor-pointer" title="Copy URL">
              <Copy className="w-3.5 h-3.5" />
            </button>
          </span>
        </div>

      </div>

      {/* Dynamic B2B Telecom SDK Integration Modal overlay */}
      <AnimatePresence>
        {showIntegrationModal && (
          <div key="b2b-integration-overlay" className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-4">
            <motion.div
              key="b2b-integration-modal"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25 }}
              className="bg-[#0b0521] border-2 border-emerald-500/30 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative p-6 sm:p-8 space-y-6"
            >
              {/* Close Button */}
              <button 
                onClick={() => setShowIntegrationModal(false)}
                className="absolute top-5 right-5 text-indigo-200/50 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full cursor-pointer transition-all"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Title Header */}
              <div className="text-left border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-[10px] font-mono font-bold uppercase text-emerald-300 flex items-center gap-1">
                    <Server className="w-3 h-3 text-emerald-400" /> API SUITE V1.2
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-[10px] font-mono font-bold uppercase text-indigo-300 flex items-center gap-1">
                    🟢 SIMULATOR LIVE
                  </span>
                </div>
                <h2 className="text-xl font-black text-white mt-2 tracking-tight flex items-center gap-2">
                  🔌 Telecom SDK Integration & Provisioning Portal
                </h2>
                <p className="text-xs text-indigo-200/60 mt-1">
                  Connect your telecommunication trunk (SIP, Asterisk, VoIP systems) directly to the Hakim Isaac scheduling dispatch engine using these simulated endpoints.
                </p>
              </div>

              {/* Grid content */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                {/* Left side: Key Provisioner & Simulation Sandboxing */}
                <div className="space-y-4 text-left">
                  <div className="bg-slate-950/60 border border-white/5 rounded-2xl p-4 space-y-3">
                    <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-widest block">
                      🗝️ Proximity Api Credentials (Simulated)
                    </span>
                    <div className="p-3 bg-slate-950 rounded-xl border border-white/10 flex items-center justify-between">
                      <span className="font-mono text-emerald-400 text-xs sm:text-sm tracking-wider select-all">
                        {apiKey}
                      </span>
                      <button 
                        onClick={handleCopyKey}
                        className="text-indigo-400 hover:text-white cursor-pointer p-1.5 rounded hover:bg-white/5 shrink-0 ml-2"
                        title="Copy API Token"
                      >
                        {copiedKey ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-[10px] text-indigo-200/45">
                      Do not share this live production token in raw public repositories. Header key authorization expects <code className="text-indigo-300">Authorization: Bearer hk_...</code> format.
                    </p>
                  </div>

                  {/* Live Simulation Trigger Form */}
                  <div className="bg-slate-950/60 border border-white/5 rounded-2xl p-4 space-y-4">
                    <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest block">
                      ⚡ REAL-TIME DISPATCH SANDBOX TESTER
                    </span>
                    
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="space-y-1.5">
                        <label className="text-indigo-200/60 font-semibold block">Test Phone Target</label>
                        <input
                          type="text"
                          value={sandboxPhone}
                          onChange={(e) => setSandboxPhone(e.target.value)}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white font-mono text-xs focus:border-indigo-500/50 outline-none"
                          placeholder="+232-77-900321"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-indigo-200/60 font-semibold block">Companion Voice</label>
                        <select
                          value={sandboxCompanion}
                          onChange={(e) => setSandboxCompanion(e.target.value)}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-2.5 py-2 text-white font-bold text-xs focus:border-indigo-500/50 outline-none"
                        >
                          <option value="Zephyr">Zephyr (Default Warm Male)</option>
                          <option value="Aria">Aria (Empathetic Female)</option>
                          <option value="Solomon">Solomon (Deep Native Elder)</option>
                        </select>
                      </div>
                    </div>

                    <button
                      onClick={handleStartSimulation}
                      disabled={isSimulating}
                      className={`w-full py-2.5 rounded-xl text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        isSimulating 
                          ? 'bg-slate-800 border border-white/10 text-slate-400 cursor-not-allowed' 
                          : 'bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-550 hover:to-indigo-550 shadow-md shadow-emerald-950/30'
                      }`}
                    >
                      {isSimulating ? (
                        <>
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                          </span>
                          Executing Simulated Signaling...
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-white" />
                          Fire Simulated API Payload
                        </>
                      )}
                    </button>

                    {/* Console Debug Log view */}
                    <div className="p-3 bg-slate-950 rounded-xl border border-white/10 text-left min-h-24">
                      <div className="flex justify-between items-center border-b border-white/5 pb-1.5 mb-2">
                        <span className="text-[9px] font-mono font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1">
                          <Terminal className="w-3 h-3 text-emerald-400" /> Sandbox Debug Output Console
                        </span>
                        <div className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      </div>
                      <div className="font-mono text-[9px] text-indigo-200/70 space-y-1.5 max-h-32 overflow-y-auto leading-relaxed">
                        {sandboxLogs.map((log, lidx) => (
                          <div key={lidx} className="border-l-2 border-emerald-500/40 pl-2">
                            {log}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right side: Snippet Viewer tabs */}
                <div className="space-y-4 flex flex-col justify-between text-left">
                  <div className="bg-slate-950/80 rounded-2xl border border-white/5 p-5 flex flex-col justify-between h-full space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center border-b border-white/10 pb-2">
                        <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                          <Code className="w-3.5 h-3.5 text-indigo-400" /> B2B CLIENT INSTRUCTIONS
                        </span>
                        
                        <div className="flex items-center gap-1 bg-white/5 p-0.5 rounded-lg border border-white/5">
                          {(['node', 'python'] as const).map((modalTab) => (
                            <button
                              key={modalTab}
                              onClick={() => {
                                setActiveTab(modalTab);
                              }}
                              className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-tight transition-all cursor-pointer ${
                                activeTab === modalTab 
                                  ? 'bg-emerald-600 text-white shadow-sm' 
                                  : 'text-indigo-200/60 hover:text-white'
                              }`}
                            >
                              {modalTab === 'node' ? 'Node.js' : 'Python'}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="text-[11px] text-indigo-200/70 leading-relaxed">
                        Incorporate this boilerplate client implementation into your internal VoIP routing controllers. This handles dispatching custom system instructions directly to your telecom trunking gateway.
                      </div>
                    </div>

                    <div className="relative">
                      <pre className="font-mono text-[10px] text-indigo-200/95 bg-slate-950 p-4 rounded-xl overflow-x-auto leading-relaxed max-h-72 border border-white/5 select-all">
                        {activeTab === 'python' ? getPythonSnippet() : getNodeSnippet()}
                      </pre>
                      
                      <button 
                        onClick={async () => {
                          const code = activeTab === 'python' ? getPythonSnippet() : getNodeSnippet();
                          try {
                            await navigator.clipboard.writeText(code);
                            setCopiedModalSnippet(true);
                            setTimeout(() => setCopiedModalSnippet(false), 3000);
                          } catch {
                            setCopiedModalSnippet(true);
                            setTimeout(() => setCopiedModalSnippet(false), 3000);
                          }
                        }}
                        className="absolute top-3 right-3 text-[10px] text-indigo-350 hover:text-white font-mono flex items-center gap-1 bg-[#0b0521]/95 px-2.5 py-1 rounded-lg border border-white/10 hover:border-indigo-400/50 cursor-pointer shadow-md"
                      >
                        {copiedModalSnippet ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" /> Copied Boilerplate!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" /> Copy Snippet
                          </>
                        )}
                      </button>
                    </div>

                    <div className="text-[10px] text-indigo-200/55 leading-relaxed bg-white/[0.01] p-3 rounded-xl border border-white/[0.03]">
                      <b>Pro-tip for Carrier Telecom Devs:</b> Connect your SMS Gateway in tandem by passing <code className="text-indigo-300">"sms_smtp_receipt_dispatch": true</code> in the body payload to trigger immediate post-call text summaries to dialers.
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 border-t border-white/10 pt-4 text-xs">
                <span className="text-indigo-200/40 font-mono text-[10px]">
                  Hakim Isaac Integration Portal v1.2 • End-to-End Voice Telephony API Suite
                </span>
                <button
                  onClick={() => setShowIntegrationModal(false)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Dismiss Console
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDocsModal && (
          <VoiceCoreDocsModal isOpen={showDocsModal} onClose={() => setShowDocsModal(false)} />
        )}
      </AnimatePresence>

    </div>
  );
}
