import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Heart, GraduationCap } from 'lucide-react';

export const Countdown2027: React.FC = () => {
  // Target: Summer 2027 Graduation (June 30, 2027)
  const targetDate = new Date('2027-06-30T12:00:00Z').getTime();

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="relative w-full max-w-5xl mx-auto px-4 py-8">
      <div className="relative rounded-2xl bg-gradient-to-r from-[var(--bg-secondary)] via-[var(--bg-card)] to-[var(--bg-secondary)] border border-[var(--border-gold)] p-6 sm:p-8 shadow-2xl gold-box-glow text-center overflow-hidden transition-colors duration-400">
        {/* Top Gold Ribbon Line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--accent-gold)] to-transparent" />

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[var(--bg-primary)] border border-[var(--border-gold)] text-xs font-cinzel text-[var(--accent-gold)] uppercase tracking-widest mb-3 shadow-sm">
          <GraduationCap className="w-4 h-4 text-[var(--accent-gold)]" />
          <span>Destination: 2027 Farewell & Convocation</span>
        </div>

        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-cinzel font-bold text-[#F8F5EE] tracking-tight">
          Every Moment Until 2027 Counts
        </h2>

        <p className="mt-2 text-xs sm:text-sm text-[var(--accent-champagne)]/90 font-editorial italic max-w-2xl mx-auto leading-relaxed">
          “In 2027, we will complete our BS MLT degrees and take different paths into the world. This website exists so our four years together never fade from memory.”
        </p>

        {/* Countdown Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-2xl mx-auto mt-6">
          <div className="p-3.5 sm:p-4 rounded-xl bg-[#070D1C]/80 border border-[#C8A45D]/25 flex flex-col items-center">
            <span className="font-mono text-2xl sm:text-4xl font-bold text-[#C8A45D] tabular-nums">
              {timeLeft.days}
            </span>
            <span className="text-[10px] sm:text-xs uppercase tracking-wider text-[#E7D39B]/70 font-cinzel mt-1">
              Days Left
            </span>
          </div>

          <div className="p-3.5 sm:p-4 rounded-xl bg-[#070D1C]/80 border border-[#C8A45D]/25 flex flex-col items-center">
            <span className="font-mono text-2xl sm:text-4xl font-bold text-[#C8A45D] tabular-nums">
              {timeLeft.hours}
            </span>
            <span className="text-[10px] sm:text-xs uppercase tracking-wider text-[#E7D39B]/70 font-cinzel mt-1">
              Hours
            </span>
          </div>

          <div className="p-3.5 sm:p-4 rounded-xl bg-[#070D1C]/80 border border-[#C8A45D]/25 flex flex-col items-center">
            <span className="font-mono text-2xl sm:text-4xl font-bold text-[#C8A45D] tabular-nums">
              {timeLeft.minutes}
            </span>
            <span className="text-[10px] sm:text-xs uppercase tracking-wider text-[#E7D39B]/70 font-cinzel mt-1">
              Minutes
            </span>
          </div>

          <div className="p-3.5 sm:p-4 rounded-xl bg-[#070D1C]/80 border border-[#C8A45D]/25 flex flex-col items-center">
            <span className="font-mono text-2xl sm:text-4xl font-bold text-[#E7D39B] tabular-nums">
              {timeLeft.seconds}
            </span>
            <span className="text-[10px] sm:text-xs uppercase tracking-wider text-[#E7D39B]/70 font-cinzel mt-1">
              Seconds
            </span>
          </div>
        </div>

        {/* Brotherhood Quote */}
        <div className="mt-5 text-xs text-[#C8A45D] flex items-center justify-center gap-1.5 font-cinzel">
          <span>12 Brothers</span>
          <span aria-hidden="true">·</span>
          <span>One MUST Legacy</span>
          <span aria-hidden="true">·</span>
          <span>Class of 2023–2027</span>
        </div>
      </div>
    </div>
  );
};
