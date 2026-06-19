import React, { useState } from 'react';
import { Appointment } from '../types';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Mail, 
  Sparkles,
  Phone,
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CalendarWidgetProps {
  appointments: Appointment[];
  onSelectDate?: (dateString: string) => void;
  onQuickBook?: (dateString: string) => void;
}

export const CalendarWidget: React.FC<CalendarWidgetProps> = ({
  appointments,
  onSelectDate,
  onQuickBook
}) => {
  // Current local time metadata is June 2026. Let's default to June 2026
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 5, 18)); // June 18, 2026
  const [selectedDate, setSelectedDate] = useState<string>("2026-06-18");

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  // Calculations for calendar grid
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // Sunday is 0

  const prevMonthDays = new Date(year, month, 0).getDate();

  // Create grid cells
  const cells: { day: number; isCurrentMonth: boolean; dateString: string }[] = [];

  // Previous month padding cells
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const d = prevMonthDays - i;
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const mStr = String(prevMonth + 1).padStart(2, '0');
    const dStr = String(d).padStart(2, '0');
    cells.push({
      day: d,
      isCurrentMonth: false,
      dateString: `${prevYear}-${mStr}-${dStr}`
    });
  }

  // Current month cells
  for (let d = 1; d <= daysInMonth; d++) {
    const mStr = String(month + 1).padStart(2, '0');
    const dStr = String(d).padStart(2, '0');
    cells.push({
      day: d,
      isCurrentMonth: true,
      dateString: `${year}-${mStr}-${dStr}`
    });
  }

  // Next month padding cells to complete a perfect grid of 35 or 42
  const remainingCells = cells.length % 7;
  if (remainingCells > 0) {
    const nextCellsCount = 7 - remainingCells;
    for (let d = 1; d <= nextCellsCount; d++) {
      const nextMonth = month === 11 ? 0 : month + 1;
      const nextYear = month === 11 ? year + 1 : year;
      const mStr = String(nextMonth + 1).padStart(2, '0');
      const dStr = String(d).padStart(2, '0');
      cells.push({
        day: d,
        isCurrentMonth: false,
        dateString: `${nextYear}-${mStr}-${dStr}`
      });
    }
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getAppointmentsForDate = (dateStr: string) => {
    return appointments.filter(app => app.date === dateStr);
  };

  const selectedDayAppointments = getAppointmentsForDate(selectedDate);

  return (
    <div className="bg-[#10092c] border border-white/10 rounded-3xl p-5 shadow-2xl flex flex-col space-y-4" id="calendar-widget-core">
      {/* Calendar Header Controls */}
      <div className="flex items-center justify-between" id="calendar-header-panel">
        <div className="flex flex-col text-left">
          <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-indigo-400">
            Interactive Schedule Grid
          </span>
          <h4 className="text-md font-black text-white" id="calendar-month-title">
            {monthNames[month]} {year}
          </h4>
        </div>

        <div className="flex items-center gap-1.5" id="calendar-month-arrows">
          <button 
            type="button"
            onClick={handlePrevMonth}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button 
            type="button"
            onClick={() => setCurrentDate(new Date(2026, 5, 18))}
            className="px-2.5 py-1 text-[9px] uppercase font-mono font-bold tracking-wider bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/20 cursor-pointer"
          >
            Today
          </button>
          <button 
            type="button"
            onClick={handleNextMonth}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekdays indicator row */}
      <div className="grid grid-cols-7 gap-1 text-center font-mono text-[9px] uppercase tracking-wider text-indigo-300 font-bold opacity-80 border-b border-white/5 pb-2" id="calendar-weekdays-row">
        <span>Sun</span>
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
      </div>

      {/* Days Grid cells */}
      <div className="grid grid-cols-7 gap-1.5" id="calendar-days-matrix">
        {cells.map((cell, index) => {
          const matchingApps = getAppointmentsForDate(cell.dateString);
          const hasApp = matchingApps.length > 0;
          const isSelected = selectedDate === cell.dateString;
          const isTodayString = cell.dateString === "2026-06-18"; // locked relative to prompt metadata date

          return (
            <motion.button
              whileTap={{ scale: 0.95 }}
              key={`${cell.dateString}-${index}`}
              type="button"
              onClick={() => {
                setSelectedDate(cell.dateString);
                if (onSelectDate) onSelectDate(cell.dateString);
              }}
              className={`relative h-11 w-full rounded-2xl flex flex-col items-center justify-center transition-all duration-300 border cursor-pointer ${
                isSelected 
                  ? 'bg-gradient-to-tr from-indigo-500 to-indigo-650 border-indigo-400 text-white shadow-lg shadow-indigo-500/25'
                  : isTodayString
                  ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-200'
                  : cell.isCurrentMonth
                  ? 'bg-white/[0.02] border-white/5 hover:border-white/15 text-indigo-100 hover:bg-white/5'
                  : 'bg-transparent border-transparent text-white/20'
              }`}
            >
              <span className={`text-[11px] font-bold ${isSelected ? 'text-white' : 'text-indigo-100'}`}>
                {cell.day}
              </span>
              
              {/* Event indicator dot */}
              {hasApp && (
                <span className={`absolute bottom-1.5 w-1.5 h-1.5 rounded-full ${
                  isSelected 
                    ? 'bg-white animate-pulse' 
                    : matchingApps.some(a => a.status === 'confirmed')
                    ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)] animate-bounce'
                    : 'bg-purple-400'
                }`} />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Selected Day Agenda Header */}
      <div className="pt-3 border-t border-white/5 flex flex-col space-y-3" id="calendar-daily-agenda">
        <div className="flex items-center justify-between text-left">
          <div className="flex items-center space-x-1.5" id="agenda-date-badge">
            <CalendarIcon className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-[10px] font-black uppercase text-indigo-300 font-mono">
              Agenda for: {new Date(selectedDate.replace(/-/g, '/')).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>

          <span className="text-[9px] font-mono text-white/50">
            {selectedDayAppointments.length} Session{selectedDayAppointments.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Selected Day Appointment Items */}
        <div className="space-y-2 max-h-[175px] overflow-y-auto" id="agenda-appointment-scroller">
          <AnimatePresence mode="popLayout">
            {selectedDayAppointments.length > 0 ? (
              selectedDayAppointments.map((app) => (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="bg-white/5 border border-white/5 rounded-2xl p-3 flex flex-col text-left space-y-2"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="text-xs font-black text-white flex items-center gap-1.5">
                        <User className="w-3 h-3 text-indigo-400" />
                        {app.clientName}
                      </h5>
                      <p className="text-[9px] text-white/40 flex items-center gap-1 mt-0.5 font-mono">
                        <Mail className="w-2.5 h-2.5" />
                        {app.emailAddress}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 text-[8px] font-mono font-black uppercase tracking-wider rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {app.status}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-[9px] border-t border-white/5 pt-1.5">
                    <span className="text-indigo-300 font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3 text-indigo-400" />
                      {app.time}
                    </span>
                    <span className="text-indigo-250 opacity-80 italic max-w-[120px] truncate">
                      {app.serviceType}
                    </span>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-6 text-center bg-white/[0.01] border border-dashed border-white/5 rounded-2xl text-[10px] text-indigo-200/45 flex flex-col items-center space-y-1.5"
                id="empty-agenda"
              >
                <Sparkles className="w-5 h-5 text-indigo-400/30 animate-pulse" />
                <p>No automatic bookings dialed on this date.</p>
                <p className="opacity-80">Speak to Hakim Isaac to book instantly!</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
