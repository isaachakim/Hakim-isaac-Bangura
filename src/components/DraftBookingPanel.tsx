import React, { useState } from 'react';
import { Appointment } from '../types';
import { 
  Sparkles,
  Check,
  User,
  Calendar,
  Clock,
  Mail,
  Phone,
  MessageSquare,
  AlertCircle,
  Video,
  Send,
  Loader2,
  Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DraftBooking {
  clientName: string;
  emailAddress: string;
  date: string;
  time: string;
  serviceType: string;
  isDrafting: boolean;
  confidence: number;
  originalUtterance?: string;
  detectedLanguage?: string;
}

interface DraftBookingPanelProps {
  draft: DraftBooking | null;
  onConfirm: (finalApp: Appointment) => void;
  onClear: () => void;
  onUpdateDraft: (updates: Partial<DraftBooking>) => void;
  onSimulateCall: (name: string, phone: string) => void;
  onSimulateSMS: (name: string, phone: string, text: string) => void;
  onSimulateEmail: (name: string, email: string, service: string, date: string, time: string) => void;
}

export const DraftBookingPanel: React.FC<DraftBookingPanelProps> = ({
  draft,
  onConfirm,
  onClear,
  onUpdateDraft,
  onSimulateCall,
  onSimulateSMS,
  onSimulateEmail
}) => {
  const [phoneForCall, setPhoneForCall] = useState("+232-76-921443");
  const [phoneForSMS, setPhoneForSMS] = useState("+232-76-921443");
  const [testEmailAddress, setTestEmailAddress] = useState("isaac.sierraleone@corp.com");
  
  const [activeActionTab, setActiveActionTab] = useState<'call' | 'sms' | 'email'>('call');

  // Local feedback states for actions
  const [actionStatus, setActionStatus] = useState<{
    type: 'success' | 'loading' | 'idle';
    message: string;
  }>({ type: 'idle', message: '' });

  // Fallback defaults if no voice draft is present
  const clientNameVal = draft?.clientName || "Olu Temne";
  const dateVal = draft?.date || "2026-06-19";
  const timeVal = draft?.time || "10:30 AM";
  const serviceVal = draft?.serviceType || "Business Growth Consultation";
  const emailVal = draft?.emailAddress || "olu@sierraleonetech.com";

  const executeCallSimulation = () => {
    setActionStatus({ type: 'loading', message: `Initializing encrypted digital VoIP trunk to ${phoneForCall}...` });
    setTimeout(() => {
      onSimulateCall(clientNameVal, phoneForCall);
      setActionStatus({ 
        type: 'success', 
        message: `✓ Simulated Outbound Call accurately placed to ${clientNameVal} at ${phoneForCall}. Line active.` 
      });
      // reset success after 6s
      setTimeout(() => setActionStatus({ type: 'idle', message: '' }), 6000);
    }, 1500);
  };

  const executeSMSSimulation = () => {
    setActionStatus({ type: 'loading', message: `Encoding short-message PDU envelope packet...` });
    const smsMessage = `Hello ${clientNameVal}, this is Hakim Isaac. Your booking for ${serviceVal} on ${dateVal} at ${timeVal} has been verified and scheduled.`;
    setTimeout(() => {
      onSimulateSMS(clientNameVal, phoneForSMS, smsMessage);
      setActionStatus({ 
        type: 'success', 
        message: `✓ Short Message Service (SMS) accurately enveloped and transmitted to ${phoneForSMS}!` 
      });
      setTimeout(() => setActionStatus({ type: 'idle', message: '' }), 6000);
    }, 1200);
  };

  const executeEmailSimulation = () => {
    setActionStatus({ type: 'loading', message: `Assembling MIME multi-part body through support SMTP server...` });
    setTimeout(() => {
      onSimulateEmail(clientNameVal, testEmailAddress, serviceVal, dateVal, timeVal);
      setActionStatus({ 
        type: 'success', 
        message: `✓ SMTPS secure handshake complete! HTML Schedule Invite sent to ${testEmailAddress}.` 
      });
      setTimeout(() => setActionStatus({ type: 'idle', message: '' }), 6000);
    }, 1400);
  };

  return (
    <div className="flex flex-col space-y-4" id="draft-panel-wrapper">
      
      {/* 1. Live Voice Draft Booking Board */}
      <div className="bg-[#10092c] border border-white/10 rounded-3xl p-5 shadow-2xl relative overflow-hidden text-left" id="voice-draft-main">
        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        
        {/* Card Header */}
        <div className="flex justify-between items-center border-b border-white/5 pb-3">
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-indigo-400">
              Hakim Live voice-to-text parser
            </span>
          </div>

          <span className="text-[9px] uppercase font-mono font-bold px-2 py-0.5 bg-indigo-500/20 text-indigo-200 rounded border border-indigo-500/10">
            {draft?.isDrafting ? "🔄 Drafting Live..." : "✨ Stable Draft"}
          </span>
        </div>

        {/* Utterance snippet */}
        {draft?.originalUtterance && (
          <div className="mt-3 bg-indigo-950/40 border border-indigo-900/40 rounded-xl p-2 text-xs italic text-indigo-200/90 leading-relaxed font-sans" id="utterance-feedback">
            <p className="text-[8px] font-mono font-bold tracking-widest text-indigo-400/80 uppercase">Detected Speech (Sierra Leone / Auto):</p>
            "{draft.originalUtterance}"
            {draft.detectedLanguage && (
              <span className="block mt-1 text-[8.5px] font-mono font-bold text-indigo-300">
                🗣 Auto-detected Language: {draft.detectedLanguage.toUpperCase()} ➔ English
              </span>
            )}
          </div>
        )}

        {/* Interactive Draft Editable Form Fields */}
        <div className="mt-4 space-y-3" id="draft-form-inputs">
          <div className="grid grid-cols-2 gap-3">
            {/* Client Name Input */}
            <div className="space-y-1">
              <label className="text-[9px] font-mono tracking-wide font-bold uppercase text-indigo-300 flex items-center gap-1">
                <User className="w-3 h-3 text-indigo-400" /> Client Name
              </label>
              <input 
                type="text" 
                value={clientNameVal}
                onChange={(e) => onUpdateDraft({ clientName: e.target.value })}
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white outline-none focus:border-indigo-400 font-semibold"
                placeholder="Speaker's Name"
              />
            </div>

            {/* Email Address */}
            <div className="space-y-1">
              <label className="text-[9px] font-mono tracking-wide font-bold uppercase text-indigo-300 flex items-center gap-1">
                <Mail className="w-3 h-3 text-indigo-400" /> Email Email
              </label>
              <input 
                type="email" 
                value={emailVal}
                onChange={(e) => onUpdateDraft({ emailAddress: e.target.value })}
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-indigo-200 outline-none focus:border-indigo-400"
                placeholder="customer@domain.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Appointment Date */}
            <div className="space-y-1">
              <label className="text-[9px] font-mono tracking-wide font-bold uppercase text-indigo-300 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-indigo-400" /> Target Date
              </label>
              <input 
                type="date" 
                value={dateVal}
                onChange={(e) => onUpdateDraft({ date: e.target.value })}
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white outline-none focus:border-indigo-400 font-mono"
              />
            </div>

            {/* Appointment Time */}
            <div className="space-y-1">
              <label className="text-[9px] font-mono tracking-wide font-bold uppercase text-indigo-300 flex items-center gap-1">
                <Clock className="w-3 h-3 text-indigo-400" /> Target Time
              </label>
              <input 
                type="text" 
                value={timeVal}
                onChange={(e) => onUpdateDraft({ time: e.target.value })}
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white outline-none focus:border-indigo-400 font-medium"
                placeholder="e.g., 03:00 PM"
              />
            </div>
          </div>

          {/* Service Classification */}
          <div className="space-y-1">
            <label className="text-[9px] font-mono tracking-wide font-bold uppercase text-indigo-300 flex items-center gap-1">
              <Video className="w-3.5 h-3.5 text-indigo-400" /> Service Classification
            </label>
            <input 
              type="text" 
              value={serviceVal}
              onChange={(e) => onUpdateDraft({ serviceType: e.target.value })}
              className="w-full bg-slate-950 border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white outline-none focus:border-indigo-400"
              placeholder="Classification"
            />
          </div>
        </div>

        {/* Action Bottom row */}
        <div className="mt-5 pt-3 border-t border-white/5 flex gap-2 justify-end">
          <button
            type="button"
            onClick={onClear}
            className="px-3.5 py-1.5 rounded-xl border border-white/10 text-white/60 hover:text-white hover:bg-white/5 text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-all"
          >
            Reset Draft
          </button>
          
          <button
            type="button"
            onClick={() => {
              const app: Appointment = {
                id: Math.random().toString(36).substring(2, 9),
                clientName: clientNameVal,
                emailAddress: emailVal,
                date: dateVal,
                time: timeVal,
                serviceType: serviceVal,
                status: 'confirmed',
                remarks: draft?.originalUtterance ? `Drafted from translation: "${draft.originalUtterance}"` : 'Automatically booked.',
                createdAt: new Date(),
                emailSent: true
              };
              onConfirm(app);
            }}
            className="px-4 py-1.5 rounded-xl bg-indigo-500 hover:bg-indigo-650 text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-all shadow-[0_4px_12px_rgba(99,102,241,0.25)]"
          >
            <Check className="w-3.5 h-3.5" /> Confirm & Book
          </button>
        </div>

      </div>

      {/* 2. Direct-Action Integrations Console (Telephony, SMS and Email Gateway Simulator) */}
      <div className="bg-[#10092c] border border-white/10 rounded-3xl p-5 shadow-2xl relative text-left" id="accurate-simulation-gateways">
        <div className="flex flex-col mb-4">
          <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-emerald-400">
            Outbound Delivery Gateway
          </span>
          <h4 className="text-md font-black text-white mt-0.5">
            Accurate Multi-channel Testing
          </h4>
        </div>

        {/* Gateway Tabs */}
        <div className="flex border-b border-white/10 mb-4 bg-black/30 p-1 rounded-xl" id="gateway-tabs">
          <button
            type="button"
            onClick={() => { setActiveActionTab('call'); setActionStatus({ type: 'idle', message: '' }); }}
            className={`flex-1 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer transition-all ${
              activeActionTab === 'call'
                ? 'bg-indigo-500/10 text-indigo-200 border border-indigo-500/20 shadow-md'
                : 'text-white/50 hover:text-white hover:bg-white/5'
            }`}
          >
            <Phone className="w-3 h-3" /> Call Trunk
          </button>
          <button
            type="button"
            onClick={() => { setActiveActionTab('sms'); setActionStatus({ type: 'idle', message: '' }); }}
            className={`flex-1 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer transition-all ${
              activeActionTab === 'sms'
                ? 'bg-indigo-500/10 text-indigo-200 border border-indigo-500/20 shadow-md'
                : 'text-white/50 hover:text-white hover:bg-white/5'
            }`}
          >
            <MessageSquare className="w-3 h-3" /> SMS Gateway
          </button>
          <button
            type="button"
            onClick={() => { setActiveActionTab('email'); setActionStatus({ type: 'idle', message: '' }); }}
            className={`flex-1 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer transition-all ${
              activeActionTab === 'email'
                ? 'bg-indigo-500/10 text-indigo-200 border border-indigo-500/20 shadow-md'
                : 'text-white/50 hover:text-white hover:bg-white/5'
            }`}
          >
            <Mail className="w-3 h-3" /> SMTPS Mailer
          </button>
        </div>

        {/* Tab Contents */}
        <div className="min-h-[140px] flex flex-col justify-between" id="gateway-execution-box">
          <AnimatePresence mode="wait">
            {activeActionTab === 'call' && (
              <motion.div
                key="tab-call-content"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-3 text-left"
              >
                <p className="text-[11px] text-indigo-200/70 leading-relaxed">
                  Call the system to place an immediate accurate SIP-Trunk phone call to confirm reservation details.
                </p>
                <div className="flex gap-2">
                  <div className="flex-grow">
                    <label className="text-[8px] uppercase tracking-wider font-mono text-indigo-400 font-extrabold block mb-1">Target Phone Number</label>
                    <input
                      type="text"
                      value={phoneForCall}
                      onChange={(e) => setPhoneForCall(e.target.value)}
                      className="w-full bg-slate-950 border border-white/5 text-xs text-white rounded-xl px-3 py-2 font-mono"
                      placeholder="+232-xx-xxxxxx"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={executeCallSimulation}
                    className="self-end bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold uppercase px-4 py-2 text-[10px] rounded-xl flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    <Phone className="w-3 h-3 fill-current" /> Dial Out
                  </button>
                </div>
              </motion.div>
            )}

            {activeActionTab === 'sms' && (
              <motion.div
                key="tab-sms-content"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-3 text-left"
              >
                <p className="text-[11px] text-indigo-200/70 leading-relaxed">
                  Send a fully encoded text message alert through our verified shortcode GSM gateway directly to the client's handset.
                </p>
                <div className="flex gap-2">
                  <div className="flex-grow">
                    <label className="text-[8px] uppercase tracking-wider font-mono text-indigo-400 font-extrabold block mb-1">Mobile Contact</label>
                    <input
                      type="text"
                      value={phoneForSMS}
                      onChange={(e) => setPhoneForSMS(e.target.value)}
                      className="w-full bg-slate-950 border border-white/5 text-xs text-white rounded-xl px-3 py-2 font-mono"
                      placeholder="+232-xx-xxxxxx"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={executeSMSSimulation}
                    className="self-end bg-indigo-500 hover:bg-indigo-600 text-white font-extrabold uppercase px-4 py-2 text-[10px] rounded-xl flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    <Send className="w-3 h-3" /> Transmit SMS
                  </button>
                </div>
              </motion.div>
            )}

            {activeActionTab === 'email' && (
              <motion.div
                key="tab-email-content"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-3 text-left"
              >
                <p className="text-[11px] text-indigo-200/70 leading-relaxed">
                  Generate and parse a premium inline HTML confirmation receipt, then send it via SMTP securely to the user's primary inbox.
                </p>
                <div className="flex gap-2">
                  <div className="flex-grow">
                    <label className="text-[8px] uppercase tracking-wider font-mono text-indigo-400 font-extrabold block mb-1">Designated Inbox</label>
                    <input
                      type="text"
                      value={testEmailAddress}
                      onChange={(e) => setTestEmailAddress(e.target.value)}
                      className="w-full bg-slate-950 border border-white/5 text-xs text-indigo-200 rounded-xl px-3 py-2"
                      placeholder="user@domain.com"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={executeEmailSimulation}
                    className="self-end bg-purple-500 hover:bg-purple-600 text-white font-extrabold uppercase px-4 py-2 text-[10px] rounded-xl flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    <Mail className="w-3 h-3" /> Send Email
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Log Status Box */}
          {actionStatus.type !== 'idle' && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-4 p-2.5 rounded-xl text-[10px] leading-relaxed transition-all flex items-center gap-2 ${
                actionStatus.type === 'loading'
                  ? 'bg-indigo-950/40 border border-indigo-900 text-indigo-300'
                  : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.1)]'
              }`}
            >
              {actionStatus.type === 'loading' ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400 shrink-0" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              )}
              <span>{actionStatus.message}</span>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
