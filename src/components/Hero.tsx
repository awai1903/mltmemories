import React, { useState } from 'react';
import { ChevronDown, Compass, ShieldCheck, Maximize2, X, Users } from 'lucide-react';
import heroCampusNightImg from '../assets/images/hero_campus_night_1792668356137.jpg';

interface HeroProps {
  onScrollToExplore: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onScrollToExplore }) => {
  const [photoError, setPhotoError] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  return (
    <section
      id="hero"
      aria-label="Homepage Hero"
      className="relative w-full flex flex-col items-center text-center px-4 sm:px-6 lg:px-12 pt-5 sm:pt-10 pb-12 sm:pb-16 bg-[var(--bg-primary)] scroll-mt-16 sm:scroll-mt-20 transition-colors duration-400"
    >
      {/* Background Cinematic University Campus at Night with Deep Blue Space Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src={heroCampusNightImg}
          alt="MUST University campus illuminated under the night sky"
          loading="eager"
          decoding="async"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = '/assets/images/hero_campus_night_1792668356137.jpg';
          }}
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
      <div className="relative z-10 pt-1 sm:pt-2 flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 text-xs tracking-widest uppercase font-semibold text-[var(--accent-gold)] bg-[var(--bg-secondary)]/85 rounded-full border border-[var(--border-gold)] backdrop-blur-sm shadow-sm">
          <ShieldCheck className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
          <span>FA23 · BS MLT · CLASS OF 2027</span>
        </div>
      </div>

      {/* Central Hero Body */}
      <div className="relative z-10 max-w-4xl mx-auto py-3 sm:py-6 flex flex-col items-center w-full">
        {/* Complete Uncropped Group Photo Showcase - All Brothers Fully Visible */}
        <div className="relative mb-5 sm:mb-8 group w-full max-w-xl sm:max-w-2xl lg:max-w-3xl px-1 sm:px-2">
          <div
            onClick={() => setLightboxOpen(true)}
            className="w-full rounded-2xl border-2 border-[var(--accent-gold)] bg-[var(--bg-secondary)]/90 backdrop-blur-md p-2 sm:p-2.5 shadow-2xl gold-box-glow transition-all duration-500 group-hover:scale-[1.01] cursor-pointer relative overflow-hidden"
            title="Click to view full batch photo in high resolution"
          >
            {!photoError ? (
              <div className="relative w-full rounded-xl overflow-hidden bg-[#070D1C] border border-[var(--accent-champagne)]/20 shadow-inner">
                {/* 4:3 uncropped aspect ratio to guarantee all boys on the left, center, and right are 100% visible */}
                <img
                  src="/group-photo.jpg"
                  alt="MUST BS MLT Boys - Complete Batch Photo"
                  onError={() => setPhotoError(true)}
                  className="w-full h-auto max-h-[250px] sm:max-h-[380px] md:max-h-[440px] object-contain mx-auto transition-transform duration-700 group-hover:scale-[1.02]"
                />

                {/* Subtle top badge showing All Brothers */}
                <div className="absolute top-2 left-2 sm:top-3 sm:left-3 px-2.5 sm:px-3 py-1 rounded-full bg-[#070D1C]/85 backdrop-blur-md border border-[var(--accent-gold)]/50 text-[9px] sm:text-xs font-cinzel font-semibold tracking-wider text-[var(--accent-champagne)] flex items-center gap-1.5 shadow-lg">
                  <Users className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
                  <span>ALL BROTHERS IN ONE FRAME</span>
                </div>

                {/* Subtle bottom hover zoom indicator */}
                <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 px-2 sm:px-2.5 py-1 rounded-lg bg-[#070D1C]/85 backdrop-blur-md border border-[var(--accent-gold)]/40 text-[9px] sm:text-xs text-[var(--accent-champagne)] flex items-center gap-1 shadow-md opacity-90 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-3 h-3 text-[var(--accent-gold)]" />
                  <span>View Full Photo</span>
                </div>
              </div>
            ) : (
              <div className="w-full py-12 rounded-xl border border-[var(--accent-champagne)]/30 flex flex-col items-center justify-center text-center p-4">
                <span className="text-[10px] tracking-widest uppercase text-[var(--accent-gold)] font-cinzel">MUST</span>
                <span className="text-xl font-cinzel font-bold text-[#F8F5EE] tracking-wider leading-tight">
                  BS MLT BOYS
                </span>
                <span className="text-xs tracking-widest font-cinzel font-semibold text-[var(--accent-champagne)] mt-1">CLASS OF 2027</span>
              </div>
            )}
          </div>
        </div>

        {/* Brand Kicker */}
        <div className="text-xs sm:text-sm tracking-[0.3em] uppercase text-[var(--accent-gold)] font-semibold mb-2 sm:mb-3 font-cinzel">
          MUST · BS MLT BOYS
        </div>

        {/* Main Headline */}
        <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-cinzel font-extrabold text-[#F8F5EE] tracking-tight leading-[1.18] max-w-3xl text-balance gold-glow">
          “We Came as Students. <br className="hidden sm:inline" />
          We Leave as Brothers.”
        </h1>

        {/* Supporting Copy */}
        <p className="mt-3 sm:mt-5 text-sm sm:text-lg md:text-xl font-editorial italic text-[var(--accent-champagne)] max-w-2xl text-balance">
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

      {/* Fullscreen Photo Lightbox */}
      {lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-[#030713]/95 backdrop-blur-xl flex flex-col items-center justify-center p-3 sm:p-6"
          onClick={() => setLightboxOpen(false)}
        >
          <div
            className="relative max-w-6xl w-full max-h-[92vh] flex flex-col items-center bg-[#070D1C] border border-[#C8A45D]/40 rounded-2xl p-2 sm:p-4 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar */}
            <div className="w-full flex items-center justify-between pb-3 px-2 border-b border-[#C8A45D]/20">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#C8A45D]" />
                <span className="font-cinzel text-xs sm:text-sm font-semibold text-[#F8F5EE] tracking-wider">
                  MUST BS MLT BOYS · FA23 BATCH OF 2027
                </span>
              </div>
              <button
                onClick={() => setLightboxOpen(false)}
                className="p-1.5 rounded-lg bg-[#0B1530] text-[#E7D39B] hover:text-white hover:bg-[#C8A45D]/20 transition-colors cursor-pointer"
                aria-label="Close photo view"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Full Resolution Photo with head-to-toe uncropped display */}
            <div className="w-full flex-1 flex items-center justify-center py-3 overflow-auto">
              <img
                src="/group-photo.jpg"
                alt="MUST BS MLT Boys - High Resolution Official Batch Photo"
                className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-xl"
              />
            </div>

            {/* Bottom Caption */}
            <div className="w-full pt-2 px-2 border-t border-[#C8A45D]/20 flex flex-col sm:flex-row items-center justify-between text-xs text-[#E7D39B]/80 gap-1 text-center">
              <span className="font-editorial italic">“We Came as Students. We Leave as Brothers.”</span>
              <span className="text-[11px] font-cinzel text-[#C8A45D]">10 Brothers Standing Together in White · MUST Campus</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

