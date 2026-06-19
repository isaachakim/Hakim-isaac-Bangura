import React, { useState, useEffect, useRef } from "react";
import { 
  Tv, 
  Monitor, 
  Mail, 
  Send, 
  Calendar, 
  Clock, 
  Plus, 
  Search, 
  Trash2, 
  RefreshCw, 
  User, 
  Eye, 
  X, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Sliders,
  Sparkles
} from "lucide-react";
import { Appointment } from "../types";

export interface SentEmail {
  id: string;
  recipient: string;
  sender: string;
  subject: string;
  body: string;
  timestamp: Date;
  status: 'Delivered' | 'Sending';
}

interface AppointmentPortalProps {
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
  sentEmails: SentEmail[];
  setSentEmails: React.Dispatch<React.SetStateAction<SentEmail[]>>;
  triggerConfirmationEmail: (app: Appointment) => void;
}

let idCounter = 0;
const generatePortalUniqueId = (prefix: string = "id") => {
  idCounter++;
  return `${prefix}-${Date.now()}-${idCounter}-${Math.random().toString(36).substring(2, 11)}`;
};

export default function AppointmentPortal({
  appointments,
  setAppointments,
  sentEmails,
  setSentEmails,
  triggerConfirmationEmail
}: AppointmentPortalProps) {
  // Navigation & UI filter tabs
  const [activeTab, setActiveTab] = useState<'share' | 'bookings' | 'emails'>('share');
  
  // Search and status filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  // Custom manual new booking form
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formTime, setFormTime] = useState("");
  const [formService, setFormService] = useState("Product Support Consultation");
  const [formRemarks, setFormRemarks] = useState("");

  // Custom email compose panel state
  const [selectedAppForMail, setSelectedAppForMail] = useState<Appointment | null>(null);
  const [composeSubject, setComposeSubject] = useState("");
  const [composeBody, setComposeBody] = useState("");
  const [customMailNotification, setCustomMailNotification] = useState<string | null>(null);

  // Screen share core states
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [isMockShare, setIsMockShare] = useState<boolean>(false);
  const [shareError, setShareError] = useState<string | null>(null);
  const [shareResolution, setShareResolution] = useState<string>("1920x1080 (HD)");
  const [shareFPS, setShareFPS] = useState<number>(30);
  
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Active interval for mock stream visual stats fluctuation
  useEffect(() => {
    const timer = setInterval(() => {
      if (screenStream || isMockShare) {
        setShareFPS(Math.floor(29 + Math.random() * 3));
      }
    }, 2000);
    return () => clearInterval(timer);
  }, [screenStream, isMockShare]);

  const startScreenShare = async () => {
    try {
      // Release any existing streams
      if (screenStream) {
        screenStream.getTracks().forEach(track => track.stop());
      }

      setShareError(null);
      setIsMockShare(false);

      // Attempt actual browser Screen Sharing Capture
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          displaySurface: "browser",
        },
        audio: false
      });

      setScreenStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(e => console.warn("Video auto-play delayed:", e));
      }
      
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        const settings = videoTrack.getSettings();
        if (settings.width && settings.height) {
          setShareResolution(`${settings.width}x${settings.height}`);
        }
        
        videoTrack.onended = () => {
          stopScreenShare(stream);
        };
      }
    } catch (err: any) {
      console.warn("Real display-capture failed/denied (common in sandbox or iframe settings). Activating smart simulation board.", err);
      setIsMockShare(true);
      setShareError(err.message || "Display capture requires custom permissions inside iframes.");
    }
  };

  const stopScreenShare = (streamToStop: MediaStream | null = null) => {
    const active = streamToStop || screenStream;
    if (active) {
      active.getTracks().forEach(track => {
        track.stop();
      });
    }
    setScreenStream(null);
    setIsMockShare(false);
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    return () => {
      if (screenStream) {
        screenStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [screenStream]);

  // Clean-up or set default selections if appointments change
  const handleSelectAppForMail = (app: Appointment) => {
    setSelectedAppForMail(app);
    setComposeSubject(`Hakim Isaac Business Booking Notice: ${app.serviceType}`);
    setComposeBody(
      `Dear ${app.clientName},\n\nThis is a customized service message regarding your scheduled appointment for "${app.serviceType}".\n\n📌 Date: ${app.date}\n📌 Time: ${app.time}\n📌 Status: ${app.status.toUpperCase()}\n\nHakim Isaac Customer Support is processing your appointment request. Let us know if you need to reschedule by replying to this email.\n\nBest wishes,\nHakim Isaac Global Frontdesk Operations`
    );
  };

  // Dispatch custom compiled email
  const sendCustomCompiledEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppForMail) return;

    const newMail: SentEmail = {
      id: generatePortalUniqueId("mail-custom"),
      recipient: selectedAppForMail.emailAddress,
      sender: "hakimisaac001@gmail.com",
      subject: composeSubject,
      body: composeBody,
      timestamp: new Date(),
      status: "Sending"
    };

    setSentEmails(prev => [newMail, ...prev]);
    setCustomMailNotification(`Email packet dispatched to ${selectedAppForMail.emailAddress}. Delivering via mock SMTP routing...`);

    // Complete the promise delay representing network socket
    setTimeout(() => {
      setSentEmails(prev => prev.map(m => m.id === newMail.id ? { ...m, status: 'Delivered' } : m));
      // Optionally update emailSent state
      setAppointments(prev => prev.map(a => a.id === selectedAppForMail.id ? { ...a, emailSent: true } : a));
      setCustomMailNotification(`Email Delivered successfully to ${selectedAppForMail.emailAddress}!`);
      setTimeout(() => setCustomMailNotification(null), 4000);
    }, 1200);

    setSelectedAppForMail(null);
  };

  // Manual fast status adjuster
  const changeAppointmentStatus = (id: string, newStatus: Appointment['status']) => {
    setAppointments(prev => prev.map(app => app.id === id ? { ...app, status: newStatus } : app));
  };

  // Form handle for added appointment
  const submitNewAppointmentForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim()) {
      alert("Please provide at least a Client Name and Email Address.");
      return;
    }

    const brandNew: Appointment = {
      id: generatePortalUniqueId("app-man"),
      clientName: formName,
      emailAddress: formEmail,
      date: formDate || new Date().toISOString().split('T')[0],
      time: formTime || "10:30 AM",
      serviceType: formService,
      status: "pending",
      remarks: formRemarks || "Manually scheduled directly via the Appointment Book management console.",
      createdAt: new Date(),
      emailSent: false
    };

    setAppointments(prev => [brandNew, ...prev]);
    triggerConfirmationEmail(brandNew);

    // Reset Form
    setFormName("");
    setFormEmail("");
    setFormDate("");
    setFormTime("");
    setFormRemarks("");
    setIsAddingNew(false);
  };

  // Delete appointment action
  const deleteAppAction = (id: string) => {
    if (confirm("Are you sure you want to permanently delete this appointment from the book?")) {
      setAppointments(prev => prev.filter(app => app.id !== id));
    }
  };

  // Filtered lists logic
  const filteredAppointments = appointments.filter(app => {
    const isMatchedSearch = 
      app.clientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      app.emailAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.serviceType.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (statusFilter === "all") return isMatchedSearch;
    return app.status === statusFilter && isMatchedSearch;
  });

  return (
    <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 text-left" id="appointment-portal-root">
      
      {/* Container Header Grid */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-5" id="portal-header">
        <div id="portal-title-block">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/30 text-[10px] font-mono font-bold uppercase text-indigo-400">
              Omnichannel Sync
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono text-emerald-400 font-bold">Active Live Connection</span>
          </div>
          <h2 className="text-xl font-extrabold text-white mt-1 flex items-center gap-2 tracking-tight">
            📅 Appointment Book & Multitalk Email Dispatcher
          </h2>
          <p className="text-xs text-indigo-200/50 mt-1 font-medium max-w-2xl">
            Live interactive workspace syncing speech voice bookings seamlessly in Krio, Pidgin, Spanish, French, and English.
          </p>
        </div>

        {/* Tab Switcher controls */}
        <div className="flex items-center bg-white/5 border border-white/10 p-1 rounded-xl shrink-0" id="portal-tabs">
          <button
            onClick={() => setActiveTab('share')}
            className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
              activeTab === 'share' 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' 
                : 'text-indigo-200/60 hover:text-white hover:bg-white/5'
            }`}
          >
            📺 Live Screen Share
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
              activeTab === 'bookings' 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' 
                : 'text-indigo-200/60 hover:text-white hover:bg-white/5'
            }`}
          >
            📋 Appointment Book ({appointments.length})
          </button>
          <button
            onClick={() => setActiveTab('emails')}
            className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
              activeTab === 'emails' 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' 
                : 'text-indigo-200/60 hover:text-white hover:bg-white/5'
            }`}
          >
            ✉️ Email Center ({sentEmails.length})
          </button>
        </div>
      </div>

      {customMailNotification && (
        <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-300 flex items-center gap-2 animate-pulse" id="portal-toast">
          <CheckCircle2 className="w-4.5 h-4.5 text-indigo-400" />
          {customMailNotification}
        </div>
      )}

      {/* RENDER TAB 1: SCREEN SHARE OF APPOINTMENT BOOK */}
      {activeTab === 'share' && (
        <div className="space-y-6" id="tab-screen-share">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Visual Screen Monitor Display (Left 2 Columns) */}
            <div className="lg:col-span-2 space-y-4">
              <div 
                className={`relative w-full rounded-2xl border aspect-video overflow-hidden group transition-all flex flex-col justify-between p-4 ${
                  screenStream || isMockShare
                    ? 'border-indigo-500 bg-slate-950 shadow-[0_0_25px_rgba(99,102,241,0.15)]'
                    : 'border-white/10 bg-slate-950/40'
                }`}
                id="share-display-frame"
              >
                {/* Live Stream feeds */}
                {screenStream && !isMockShare ? (
                  <video 
                    ref={videoRef}
                    autoPlay 
                    playsInline 
                    muted
                    className="absolute inset-0 w-full h-full object-cover z-0"
                  />
                ) : isMockShare ? (
                  /* SIMULATION PRESENTATION BOARD FALLBACK */
                  <div className="absolute inset-0 w-full h-full bg-slate-950/95 overflow-y-auto p-4 sm:p-6 z-0 border border-amber-500/30 font-mono text-[10px] text-indigo-300/90 select-none flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center border-b border-indigo-500/30 pb-2 mb-4">
                        <div className="flex items-center gap-2 text-amber-400">
                          <Sliders className="w-4 h-4 text-amber-500 shrink-0" />
                          <span className="font-extrabold tracking-wider text-xs">VIRTUAL SCREENSHARE CONSOLE</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> SIMULATION ACTIVE
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="bg-white/[0.02] p-2.5 rounded-xl border border-white/5 space-y-1">
                          <span className="text-white font-bold text-xs">📌 APPOINTMENT LEDGER RUNNINGS:</span>
                          <p className="text-[9px] text-indigo-200/50">Simulated live-sync desktop browser frame showing total of {appointments.length} active customer bookings</p>
                        </div>

                        {/* Miniature Compact Scrollable book logs inside screen share feed */}
                        <div className="space-y-1">
                          {appointments.slice(0, 3).map((app, index) => (
                            <div key={`stream-${app.id}`} className="p-2 border border-white/5 bg-white/[0.01] rounded-lg flex justify-between items-center gap-2 text-[9px]">
                              <div>
                                <span className="text-indigo-200 font-bold">#{index+1} {app.clientName}</span> 
                                <span className="text-indigo-400">({app.emailAddress})</span>
                                <div className="text-[8px] text-indigo-300/40">📅 {app.date} • {app.time} • Service: {app.serviceType}</div>
                              </div>
                              <span className={`px-1.5 py-0.5 rounded font-bold uppercase text-[7px] ${
                                app.status === 'confirmed' ? 'bg-emerald-500/15 text-emerald-400' :
                                app.status === 'completed' ? 'bg-indigo-500/15 text-indigo-300' :
                                app.status === 'canceled' ? 'bg-rose-500/15 text-rose-400' : 'bg-yellow-500/15 text-yellow-500'
                              }`}>
                                {app.status}
                              </span>
                            </div>
                          ))}
                          {appointments.length > 3 && (
                            <div className="text-center font-bold text-[8px] text-indigo-400/40 mt-1">
                              + {appointments.length - 3} more records synced ...
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-white/5 pt-3 mt-4 text-[9px] text-indigo-200/40 flex justify-between">
                      <span>FPS: {shareFPS} fps • Quality: Lossless Raw Feed</span>
                      <span>HAKIM ISAAC VIRTUAL SYNC SYSTEM v2.5</span>
                    </div>
                  </div>
                ) : (
                  /* IDLE / NO SHARE STATE */
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 space-y-3 bg-indigo-950/20 select-none">
                    <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-indigo-300">
                      <Monitor className="w-8 h-8 opacity-45" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-black text-white">No active screen share stream</h4>
                      <p className="text-xs text-indigo-200/50 max-w-sm">
                        Instantly capture your tab, screen, or run the virtual sandbox screen to present the appointment book in real-time.
                      </p>
                    </div>
                  </div>
                )}

                {/* Overlaid UI Controls / info bar */}
                {(screenStream || isMockShare) && (
                  <div className="z-10 w-full flex items-center justify-between pointer-events-auto bg-slate-900/90 backdrop-blur-md p-2 rounded-xl border border-white/10" id="share-overlay-bars">
                    <div className="flex items-center gap-2 text-xs font-semibold text-white">
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-ping" />
                      <span className="font-mono text-[10px] text-indigo-300">
                        {isMockShare ? "Virtual Sandbox Share Feed" : "Live Local Desktop Mirror"}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => stopScreenShare()}
                        className="px-3 py-1 bg-rose-500 text-white font-bold tracking-wider uppercase text-[10px] rounded hover:bg-rose-600 transition-all cursor-pointer"
                      >
                        Stop Sharing
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Controller Dashboard buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={startScreenShare}
                  id="action-start-sharing"
                  className="flex-1 py-3.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-black tracking-widest uppercase transition-all shadow-lg shadow-indigo-600/20 text-center flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Tv className="w-4 h-4 shrink-0" /> Launch Real Screen Share Stream
                </button>
                <button
                  onClick={() => setIsMockShare(true)}
                  id="action-sandbox-sharing"
                  className="flex-1 py-3.5 px-4 bg-white/5 hover:bg-white/10 text-indigo-200 border border-white/10 rounded-2xl text-xs font-black tracking-widest uppercase transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sliders className="w-4 h-4 text-amber-500 shrink-0" /> Run Virtual Presentation Board
                </button>
              </div>

            </div>

            {/* Presentation Insights Sidebar Panel */}
            <div className="space-y-4">
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 text-left space-y-4" id="presentation-panel">
                <div className="flex items-center gap-2 border-b border-white/10 pb-3" id="presentation-title">
                  <Monitor className="w-4.5 h-4.5 text-indigo-400" />
                  <h3 className="text-xs font-black tracking-widest uppercase text-white">
                    Stream Telemetry
                  </h3>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div className="flex justify-between items-center py-1 border-b border-white/[0.03]">
                    <span className="text-indigo-200/50">Status:</span>
                    <span className={`font-mono font-bold ${screenStream || isMockShare ? 'text-emerald-400' : 'text-indigo-200/30'}`}>
                      {screenStream ? "Real Mirror Outward" : isMockShare ? "Virtual Sandbox Feed" : "Stream Suspended"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-white/[0.03]">
                    <span className="text-indigo-200/50">Target Stream Object:</span>
                    <span className="font-mono text-indigo-200">`/src/App.tsx#Appointments`</span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-white/[0.03]">
                    <span className="text-indigo-200/50 font-medium">Virtual FPS Counter:</span>
                    <span className="font-mono text-indigo-200">{screenStream || isMockShare ? `${shareFPS} Hz` : '0 fps'}</span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-white/[0.03]">
                    <span className="text-indigo-200/50">Estimated Resolution:</span>
                    <span className="font-mono text-indigo-200">{screenStream || isMockShare ? shareResolution : 'N/A'}</span>
                  </div>

                  <div className="flex justify-between items-center py-1">
                    <span className="text-indigo-200/50">Codec Pipeline:</span>
                    <span className="font-mono text-emerald-400 font-bold uppercase text-[10px] bg-emerald-400/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                      Lossless Multi-Talk
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-indigo-950/40 rounded-xl border border-indigo-500/20" id="sandbox-capture-info">
                  <div className="flex gap-2 text-[11px] leading-relaxed text-indigo-300">
                    <AlertCircle className="w-4 h-4 text-indigo-400 shrink-0" />
                    <p>
                      <b>How to Screen Share:</b> Tap the <i>Launch Screen Share</i> button, select a browser tab (e.g. this appointment view) or window, and see it render live! Ideal for mirroring calendars, reservation logs, and presentation frames.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* RENDER TAB 2: APPOINTMENT BOOK LEDGER */}
      {activeTab === 'bookings' && (
        <div className="space-y-5" id="tab-appointment-ledger">
          
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/10" id="bookings-controls-bar">
            
            {/* Search Input bar */}
            <div className="relative flex-grow max-w-md" id="search-input-combo">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-indigo-300/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Client, Email, or Service..."
                className="w-full bg-slate-950 border border-white/5 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-indigo-200/30 font-semibold focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Filters and Add Button panel */}
            <div className="flex items-center gap-2 overflow-x-auto shrink-0" id="bookings-filters">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-950 border border-white/10 text-xs font-semibold text-indigo-200 rounded-xl px-3 py-2 focus:outline-none cursor-pointer hover:border-white/20"
              >
                <option value="all">All Booking Statuses</option>
                <option value="pending">Pending Only</option>
                <option value="confirmed">Confirmed Only</option>
                <option value="completed">Completed Only</option>
                <option value="canceled">Canceled Only</option>
              </select>

              <button
                onClick={() => setIsAddingNew(!isAddingNew)}
                className="py-2 px-3 bg-indigo-600 hover:bg-indigo-505 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer font-bold select-none whitespace-nowrap"
              >
                {isAddingNew ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                Add Booking
              </button>

              {appointments.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    const firstConfirm = window.confirm("🚨 WARNING: You are about to clear ALL records from the Appointment Book database. This will also close any active screen share views. Do you wish to proceed?");
                    if (firstConfirm) {
                      const secondConfirm = window.confirm("Final authentication: Are you absolutely sure? All voice logs and local scheduled slots will be lost.");
                      if (secondConfirm) {
                        setAppointments([]);
                        if (isMockShare || screenStream) {
                          stopScreenShare();
                        }
                        setCustomMailNotification("Appointment book ledger has been completely cleared and reset!");
                        setTimeout(() => setCustomMailNotification(null), 4000);
                      }
                    }
                  }}
                  className="py-2 px-3 bg-rose-500/10 hover:bg-rose-600 border border-rose-500/30 hover:border-rose-500 text-rose-300 hover:text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer font-bold select-none whitespace-nowrap"
                  title="Wipe whole appointment ledger"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear Book
                </button>
              )}
            </div>
          </div>

          {/* Professional real-time live-update dashboard metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4" id="bookings-analytics-grid">
            <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-4 flex flex-col justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-400">Total Bookings</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-white">{appointments.length}</span>
                <span className="text-[10px] text-indigo-200/50">records</span>
              </div>
            </div>
            <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-4 flex flex-col justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400">Confirmed Status</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-white">{appointments.filter(a => a.status === 'confirmed').length}</span>
                <span className="text-[10px] text-emerald-400/50">active</span>
              </div>
            </div>
            <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-4 flex flex-col justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-400">SMTP Emails</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-white">{sentEmails.length}</span>
                <span className="text-[10px] text-purple-400/50">dispatched</span>
              </div>
            </div>
            <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-4 flex flex-col justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400">Auto voice sync</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-white">{appointments.filter(a => a.remarks?.toLowerCase().includes("voice") || a.remarks?.toLowerCase().includes("automatically") || a.remarks?.toLowerCase().includes("auto-booked")).length}</span>
                <span className="text-[10px] text-amber-400/55">synced slots</span>
              </div>
            </div>
          </div>

          {/* New Appointment Manual Booking Form (Collapsible) */}
          {isAddingNew && (
            <form onSubmit={submitNewAppointmentForm} className="bg-gradient-to-b from-indigo-950 to-slate-955 p-5 border border-indigo-500/30 rounded-2xl space-y-4 text-left animate-slideDown" id="man-booking-form">
              <div className="flex items-center gap-1.5 border-b border-white/10 pb-2 mb-3">
                <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
                <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">Manual Appointment Scheduler Frame</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-300">Client Full name</label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    required
                    placeholder="e.g. Hakim Isaac Bangura"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white placeholder-indigo-200/20 focus:outline-none focus:border-indigo-500 font-medium"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-300">Email Address (For Sync Confirm)</label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    required
                    placeholder="e.g. testcustomer@gmail.com"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white placeholder-indigo-200/20 focus:outline-none focus:border-indigo-500 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-300">Target Date</label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-indigo-200 focus:outline-none focus:border-indigo-500 font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-300">Target Time Slot</label>
                  <input
                    type="text"
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    placeholder="e.g. 10:30 AM"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white placeholder-indigo-200/20 focus:outline-none focus:border-indigo-500 font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-300">Service Category</label>
                  <select
                    value={formService}
                    onChange={(e) => setFormService(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-indigo-200 focus:outline-none focus:border-indigo-500 font-medium cursor-pointer"
                  >
                    <option value="Product Support Consultation">Product Support Consultation</option>
                    <option value="Real Estate Appointment Scheduling">Real Estate Appointment Scheduling</option>
                    <option value="Sierra Leone Krio Language Workshop">Sierra Leone Krio Language Workshop</option>
                    <option value="General Corporate Support Call">General Corporate Support Call</option>
                    <option value="Logistics Feed Consultation">Logistics Feed Consultation</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-300">Internal Remarks / Client Notes</label>
                <textarea
                  value={formRemarks}
                  onChange={(e) => setFormRemarks(e.target.value)}
                  placeholder="Specify custom instructions or customer comments..."
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white placeholder-indigo-200/20 focus:outline-none focus:border-indigo-500 font-medium h-16 resize-none"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="px-4 py-2 text-xs bg-white/5 hover:bg-white/10 text-indigo-300 rounded-lg font-bold select-none cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-black uppercase tracking-wider transition-all select-none cursor-pointer"
                >
                  Enact & Draft Confirmation
                </button>
              </div>
            </form>
          )}

          {/* Grid View Of Synced Bookings */}
          {filteredAppointments.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-white/[0.01] border border-white/10 text-indigo-200/40 text-xs font-semibold" id="empty-bookings-state">
              No appointments registered matching the search query or selected status filter context.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" id="ledger-grid-box">
              {filteredAppointments.map((app) => (
                <div 
                  key={app.id} 
                  className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                    app.status === 'confirmed' ? 'bg-emerald-500/[0.02] border-emerald-500/20 hover:border-emerald-500/40 hover:bg-emerald-500/[0.03]' :
                    app.status === 'completed' ? 'bg-indigo-500/[0.01] border-indigo-500/15 hover:border-indigo-500/30' :
                    app.status === 'canceled' ? 'bg-rose-500/[0.02] border-rose-500/15 hover:border-rose-500/30' :
                    'bg-white/[0.02] border-white/5 hover:border-white/15'
                  }`}
                  id={`app-booking-${app.id}`}
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex items-center gap-1.5">
                        <User className="w-4 h-4 text-indigo-400 shrink-0" />
                        <span className="font-bold text-xs text-white tracking-tight leading-none client-name">{app.clientName}</span>
                      </div>
                      
                      {/* Active Label Status */}
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider font-mono ${
                        app.status === 'confirmed' ? 'bg-emerald-505/15 text-emerald-400' :
                        app.status === 'completed' ? 'bg-indigo-505/15 text-indigo-300' :
                        app.status === 'canceled' ? 'bg-rose-505/15 text-rose-400' : 'bg-yellow-501/15 text-yellow-500'
                      }`}>
                        {app.status}
                      </span>
                    </div>

                    {/* Meta info layout */}
                    <div className="space-y-1.5 text-xs border-y border-white/[0.03] py-2.5">
                      <p className="flex items-center gap-1.5 text-indigo-200/80 font-medium">
                        <Mail className="w-3.5 h-3.5 text-indigo-300/40 shrink-0" /> {app.emailAddress}
                      </p>
                      <p className="flex items-center gap-1.5 text-indigo-200/80 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-indigo-300/40 shrink-0" /> {app.date}
                      </p>
                      <p className="flex items-center gap-1.5 text-indigo-200/80 font-medium">
                        <Clock className="w-3.5 h-3.5 text-indigo-300/40 shrink-0" /> {app.time}
                      </p>
                      <p className="font-semibold text-indigo-400 mt-1 uppercase text-[9px] font-mono tracking-wider">
                        💼 {app.serviceType}
                      </p>
                    </div>

                    {app.remarks && (
                      <p className="text-[11px] leading-relaxed italic text-indigo-200/60 bg-slate-950/40 p-2 rounded-xl">
                        "{app.remarks}"
                      </p>
                    )}
                  </div>

                  {/* Actions / Dispatch mail links */}
                  <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-white/5 text-[10px]">
                    <div className="flex items-center gap-1.5 text-indigo-200/40 font-semibold font-mono">
                      ✉️ {app.emailSent ? (
                        <span className="text-emerald-400 flex items-center gap-0.5"><CheckCircle2 className="w-3 h-3 stroke-[2.5]" /> Dispatched</span>
                      ) : (
                        <span className="text-yellow-500">Draft Awaiting</span>
                      )}
                    </div>

                    <div className="flex items-center gap-1" id="booking-actions">
                      {/* Manage status presets trigger dropdown */}
                      <select
                        value={app.status}
                        onChange={(e) => changeAppointmentStatus(app.id, e.target.value as Appointment['status'])}
                        className="bg-slate-950 border border-white/10 rounded px-1.5 py-1 text-[9px] text-indigo-300 font-bold focus:outline-none cursor-pointer"
                        title="Update status"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="canceled">Canceled</option>
                      </select>

                      {/* Select to dispatch custom mail */}
                      <button
                        onClick={() => {
                          setActiveTab('emails');
                          handleSelectAppForMail(app);
                        }}
                        className="p-1 rounded bg-indigo-500/10 hover:bg-indigo-500 text-indigo-300 hover:text-white transition-all cursor-pointer"
                        title="Send customized confirmation email to this user"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete item */}
                      <button
                        onClick={() => deleteAppAction(app.id)}
                        className="p-1 rounded bg-rose-500/10 hover:bg-rose-600 text-rose-400 hover:text-white transition-all cursor-pointer"
                        title="Remove booking entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* RENDER TAB 3: CUSTOM EMAIL DISPATCH CENTER */}
      {activeTab === 'emails' && (
        <div className="space-y-6" id="tab-email-center">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Outgoing Mail Composer Form Panel (Left 2 columns if compose active) */}
            <div className="lg:col-span-1 bg-white/[0.02] border border-white/5 rounded-2xl p-5 text-left h-fit space-y-4" id="email-compose-wrapper">
              <div className="flex items-center gap-1.5 border-b border-white/10 pb-3">
                <Mail className="w-4.5 h-4.5 text-indigo-400" />
                <h3 className="text-xs font-black tracking-widest uppercase text-white">Smart Dispatch Composer</h3>
              </div>

              {selectedAppForMail ? (
                <form onSubmit={sendCustomCompiledEmail} className="space-y-4" id="compose-draft-form">
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono uppercase tracking-wider text-indigo-300 font-bold">Mail Recipient</span>
                    <div className="bg-slate-950 p-2.5 rounded-xl border border-white/5 font-mono text-[11px] text-white flex justify-between items-center">
                      <span>{selectedAppForMail.clientName} ({selectedAppForMail.emailAddress})</span>
                      <button 
                        type="button" 
                        onClick={() => setSelectedAppForMail(null)} 
                        className="text-rose-400 font-bold px-1 rounded hover:bg-slate-900"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-mono uppercase tracking-wider text-indigo-300 font-bold">Email Subject Line</label>
                    <input
                      type="text"
                      required
                      value={composeSubject}
                      onChange={(e) => setComposeSubject(e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white font-medium focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-mono uppercase tracking-wider text-indigo-300 font-bold">Message Content Body (HTML or Plain Text)</label>
                    <textarea
                      required
                      value={composeBody}
                      onChange={(e) => setComposeBody(e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white font-medium focus:outline-none focus:border-indigo-500 h-44 resize-none leading-relaxed font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-black tracking-widest uppercase transition-all shadow-lg shadow-indigo-600/20 text-center flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" /> Dispatch Outward Mail Unit
                  </button>
                </form>
              ) : (
                <div className="p-8 text-center rounded-xl bg-slate-950/40 border border-white/5 text-indigo-300/40 text-xs font-semibold" id="no-compose-active">
                  <p className="mb-3">No compose draft selected.</p>
                  <p className="text-[11px] text-indigo-200/30">
                    Go to the <b>Appointment Book</b> tab and select the Mail symbol on any reservation to write a custom notification message. Or click the default quick confirmar button below to trigger general templates.
                  </p>
                </div>
              )}
            </div>

            {/* Dispacted Mail SMTP log (Right 2 columns) */}
            <div className="lg:col-span-2 bg-slate-950/20 border border-white/5 rounded-2xl p-5 text-left space-y-4" id="sent-logs-wrapper">
              <div className="flex justify-between items-center border-b border-white/10 pb-3" id="sent-logs-header">
                <div className="flex items-center gap-1.5">
                  <FileText className="w-4.5 h-4.5 text-indigo-400" />
                  <h3 className="text-xs font-black tracking-widest uppercase text-white">
                    Deliverability SMTP Outbound Logs
                  </h3>
                </div>

                <button
                  onClick={() => {
                    if (appointments.length > 0) {
                      triggerConfirmationEmail(appointments[0]);
                      setCustomMailNotification(`Triggered default confirmation template for ${appointments[0].clientName}`);
                      setTimeout(() => setCustomMailNotification(null), 3000);
                    } else {
                      alert("No appointments registered to confirm!");
                    }
                  }}
                  className="px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[10px] text-indigo-300 font-bold transition-all cursor-pointer flex items-center gap-1 whitespace-nowrap"
                >
                  <RefreshCw className="w-3 h-3 text-indigo-400 shrink-0" /> Dispatch Quick Template For Latest Booking
                </button>
              </div>

              <div className="space-y-3 max-h-[460px] overflow-y-auto" id="outbound-scroller">
                {sentEmails.length === 0 ? (
                  <div className="p-12 text-center text-indigo-300/40 text-xs font-semibold">
                    SMTP server is clean. No letters dispatched yet.
                  </div>
                ) : (
                  sentEmails.map((mail) => (
                    <div 
                      key={mail.id} 
                      className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.03] transition-all space-y-2 text-left"
                      id={`sent-log-item-${mail.id}`}
                    >
                      <div className="flex flex-wrap justify-between items-center gap-2 text-[10px] font-mono">
                        <div className="flex items-center gap-1.5 text-indigo-300 font-bold">
                          <User className="w-3.5 h-3.5 text-indigo-400" /> TO: <span className="text-white">{mail.recipient}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-indigo-200/40">{new Date(mail.timestamp).toLocaleTimeString()}</span>
                          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                            mail.status === 'Delivered' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-yellow-500/15 text-yellow-500 animate-pulse'
                          }`}>
                            {mail.status}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-xs font-extrabold text-indigo-200 tracking-tight leading-tight">
                          SUBJECT: {mail.subject}
                        </h4>
                        <div className="bg-slate-950/60 p-2.5 rounded-lg border border-white/[0.02] font-mono text-[9px] text-indigo-200/60 leading-relaxed whitespace-pre-wrap max-h-[90px] overflow-y-auto">
                          {mail.body}
                        </div>
                      </div>

                      <div className="text-[8px] text-indigo-200/30 text-right font-mono font-bold uppercase tracking-wider">
                        SENDER: {mail.sender} • PipelineID: {mail.id}
                      </div>
                    </div>
                  ))
                )}
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
