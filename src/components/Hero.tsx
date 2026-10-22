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
      className="relative min-h-[calc(100vh-5rem)] w-full flex flex-col justify-between items-center text-center px-4 sm:px-6 lg:px-12 py-12 overflow-hidden bg-[#070D1C]"
    >
      {/* Background Cinematic University Campus at Night */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hero_campus_night_1792668356137.jpg"
          alt="MUST University campus illuminated under the night sky"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-40 scale-105"
        />
        {/* Soft Vignette and Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#070D1C]/80 via-[#070D1C]/75 to-[#070D1C]" />
        <div className="absolute inset-0 bg-radial from-transparent via-[#070D1C]/50 to-[#070D1C]" />
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
        <div className="inline-flex items-center gap-2 px-3 py-1 text-xs tracking-widest uppercase font-semibold text-[#C8A45D] bg-[#0B1530]/80 rounded border border-[#C8A45D]/30 backdrop-blur-sm">
          <ShieldCheck className="w-3.5 h-3.5 text-[#C8A45D]" />
          <span>FA23 · BS MLT · CLASS OF 2027</span>
        </div>
      </div>

      {/* Central Hero Body */}
      <div className="relative z-10 max-w-4xl mx-auto my-auto py-8 sm:py-12 flex flex-col items-center">
        {/* Central Emblem Badge */}
        <div className="relative mb-6 sm:mb-8 group">
          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-2 border-[#C8A45D] bg-[#0B1530]/90 backdrop-blur-md flex flex-col items-center justify-center p-3 shadow-2xl gold-box-glow transition-transform duration-500 group-hover:scale-105">
            <div className="w-full h-full rounded-full border border-[#E7D39B]/30 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] tracking-widest uppercase text-[#C8A45D] font-cinzel">MUST</span>
              <span className="text-base sm:text-lg font-cinzel font-bold text-[#F5F0E5] tracking-wider leading-tight">
                BS MLT
              </span>
              <span className="text-[11px] tracking-widest font-cinzel font-semibold text-[#E7D39B]">BOYS</span>
            </div>
          </div>
          {/* Subtle outer halo */}
          <div className="absolute -inset-2 rounded-full border border-[#C8A45D]/20 animate-spin-slow pointer-events-none" />
        </div>

        {/* Brand Kicker */}
        <div className="text-xs sm:text-sm tracking-[0.3em] uppercase text-[#C8A45D] font-semibold mb-3 font-cinzel">
          MUST · BS MLT BOYS
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-cinzel font-extrabold text-[#F5F0E5] tracking-tight leading-[1.15] max-w-3xl text-balance gold-glow">
          “We Came as Students. <br className="hidden sm:inline" />
          We Leave as Brothers.”
        </h1>

        {/* Supporting Copy */}
        <p className="mt-4 sm:mt-6 text-base sm:text-xl font-editorial italic text-[#E7D39B] max-w-2xl text-balance">
          “One Batch. Countless Memories. One Legacy.”
        </p>

        {/* CTAs */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onScrollToExplore}
            className="px-6 py-3 text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#070D1C] bg-gradient-to-r from-[#C8A45D] via-[#E7D39B] to-[#C8A45D] hover:brightness-110 rounded-lg shadow-lg transition-all flex items-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#C8A45D]"
          >
            <Compass className="w-4 h-4" />
            <span>Enter The 3D Orbit</span>
          </button>
          
          <a
            href="#directory"
            className="px-6 py-3 text-xs sm:text-sm font-medium tracking-wider text-[#F5F0E5] bg-[#0B1530]/80 hover:bg-[#0B1530] border border-[#C8A45D]/40 hover:border-[#C8A45D] rounded-lg transition-all flex items-center gap-2"
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
          aria-label="Scroll to explore 3D photo ring"
        >
          <span>Scroll to Explore</span>
          <ChevronDown className="w-4 h-4 animate-bounce text-[#C8A45D] group-hover:translate-y-0.5 transition-transform" />
        </button>
      </div>
    </section>
  );
};
