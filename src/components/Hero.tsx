import React from 'react';
import { ChevronDown, Compass, ShieldCheck } from 'lucide-react';

interface HeroProps {
  onScrollToExplore: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onScrollToExplore }) => {
  return (
    <section
      id="hero"
      aria-label="Homepage Hero"
      className="relative min-h-[calc(100vh-5rem)] w-full flex flex-col justify-between items-center text-center px-4 sm:px-6 lg:px-12 py-12 overflow-hidden bg-[var(--bg-primary)] transition-colors duration-400"
    >
      {/* Background Cinematic University Campus at Night with Deep Blue Space Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hero_campus_night_1792668356137.jpg"
          alt="MUST University campus illuminated under the night sky"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-35 scale-105"
        />
        {/* Deep Blue Space Vignette and Ambient Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-primary)]/85 via-[var(--bg-primary)]/75 to-[var(--bg-primary)]" />
        <div className="absolute inset-0 bg-radial from-[#1e40af]/15 via-transparent to-[var(--bg-primary)]/90" />
      </div>

      {/* Floating Side Vertical Text (Desktop Only) */}
      <div className="hidden lg:flex absolute left-8 top-1/2 -translate-y-1/2 z-10 flex-col items-center gap-4">
        <div className="w-[1px] h-16 bg-gradient-to-b from-transparent to-[#C8A45D]/60" />
        <span className="text-[11px] tracking-[0.3em] uppercase text-[#E7D39B]/60 [writing-mode:vertical-rl] font-cinzel rotate-180 select-none">
          DIFFERENT PATHS, SAME MEMORIES
        </span>
        <div className="w-[1px] h-16 bg-gradient-to-t from-transparent to-[#C8A45D]/60" />
      </div>

      <div className="hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 z-10 flex-col items-center gap-4">
        <div className="w-[1px] h-16 bg-gradient-to-b from-transparent to-[#C8A45D]/60" />
        <span className="text-[11px] tracking-[0.3em] uppercase text-[#E7D39B]/60 [writing-mode:vertical-rl] font-cinzel select-none">
          FA23 · BS MEDICAL LABORATORY TECHNOLOGY
        </span>
        <div className="w-[1px] h-16 bg-gradient-to-t from-transparent to-[#C8A45D]/60" />
      </div>

      {/* Top Batch Label */}
      <div className="relative z-10 pt-4 flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 text-xs tracking-widest uppercase font-semibold text-[var(--accent-gold)] bg-[var(--bg-secondary)]/85 rounded-full border border-[var(--border-gold)] backdrop-blur-sm shadow-sm">
          <ShieldCheck className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
          <span>FA23 · BS MLT · CLASS OF 2027</span>
        </div>
      </div>

      {/* Central Hero Body */}
      <div className="relative z-10 max-w-4xl mx-auto my-auto py-8 sm:py-12 flex flex-col items-center">
        {/* Central Emblem Badge */}
        <div className="relative mb-6 sm:mb-8 group">
          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-2 border-[var(--accent-gold)] bg-[var(--bg-secondary)]/90 backdrop-blur-md flex flex-col items-center justify-center p-3 shadow-2xl gold-box-glow transition-transform duration-500 group-hover:scale-105">
            <div className="w-full h-full rounded-full border border-[var(--accent-champagne)]/30 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] tracking-widest uppercase text-[var(--accent-gold)] font-cinzel">MUST</span>
              <span className="text-base sm:text-lg font-cinzel font-bold text-[#F8F5EE] tracking-wider leading-tight">
                BS MLT
              </span>
              <span className="text-[11px] tracking-widest font-cinzel font-semibold text-[var(--accent-champagne)]">BOYS</span>
            </div>
          </div>
          {/* Subtle outer halo */}
          <div className="absolute -inset-2 rounded-full border border-[var(--accent-gold)]/20 animate-spin-slow pointer-events-none" />
        </div>

        {/* Brand Kicker */}
        <div className="text-xs sm:text-sm tracking-[0.3em] uppercase text-[var(--accent-gold)] font-semibold mb-3 font-cinzel">
          MUST · BS MLT BOYS
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-cinzel font-extrabold text-[#F8F5EE] tracking-tight leading-[1.15] max-w-3xl text-balance gold-glow">
          “We Came as Students. <br className="hidden sm:inline" />
          We Leave as Brothers.”
        </h1>

        {/* Supporting Copy */}
        <p className="mt-4 sm:mt-6 text-base sm:text-xl font-editorial italic text-[var(--accent-champagne)] max-w-2xl text-balance">
          “One Batch. Countless Memories. One Legacy.”
        </p>

        {/* CTAs */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onScrollToExplore}
            className="px-6 py-3 text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#030713] bg-gradient-to-r from-[var(--accent-gold)] via-[var(--accent-champagne)] to-[var(--accent-gold)] hover:brightness-110 rounded-lg shadow-lg transition-all flex items-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--accent-gold)]"
          >
            <Compass className="w-4 h-4" />
            <span>Open Batch Booklet</span>
          </button>
          
          <a
            href="#directory"
            className="px-6 py-3 text-xs sm:text-sm font-medium tracking-wider text-[#F8F5EE] bg-[var(--bg-secondary)]/85 hover:bg-[var(--bg-secondary)] border border-[var(--border-gold)] hover:border-[var(--accent-gold)] rounded-lg transition-all flex items-center gap-2"
          >
            <span>Meet The 12 Brothers</span>
          </a>
        </div>
      </div>

      {/* Bottom Caption & Scroll to Explore */}
      <div className="relative z-10 pb-4 flex flex-col items-center gap-2">
        <p className="text-xs sm:text-sm text-[#E7D39B]/80 font-editorial tracking-wide">
          Not just a batch. But a family.
        </p>
        <button
          onClick={onScrollToExplore}
          className="flex flex-col items-center gap-1 text-[11px] tracking-widest uppercase text-[#C8A45D]/80 hover:text-[#C8A45D] transition-colors mt-1 group cursor-pointer focus:outline-none"
          aria-label="Scroll to explore batch booklet"
        >
          <span>Scroll to Explore</span>
          <ChevronDown className="w-4 h-4 animate-bounce text-[#C8A45D] group-hover:translate-y-0.5 transition-transform" />
        </button>
      </div>
    </section>
  );
};
