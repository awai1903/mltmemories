import React from 'react';
import { ArrowUp, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { label: 'Home', href: '#hero' },
    { label: 'The Ring', href: '#the-ring' },
    { label: '2027 Countdown', href: '#countdown-2027' },
    { label: 'The Boys', href: '#directory' },
    { label: 'Memories', href: '#memories' },
    { label: 'Farewell 2027', href: '#farewell' },
    { label: 'Time Capsule', href: '#capsule' },
    { label: 'Our Story', href: '#story' },
  ];

  return (
    <footer className="relative w-full bg-[var(--bg-primary)] border-t border-[var(--border-gold)] text-[#F8F5EE] py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-400">
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-between gap-8 text-center sm:text-left sm:flex-row">
        {/* Brand Lockup */}
        <div className="flex flex-col items-center sm:items-start">
          <div className="flex items-center gap-2.5 text-lg font-cinzel font-bold text-[#F5F0E5]">
            <div className="w-7 h-7 rounded-full border border-[#C8A45D] bg-[#0B1530] flex items-center justify-center text-[10px] font-serif text-[#C8A45D]">
              MUST
            </div>
            <span>MUST · BS MLT BOYS</span>
          </div>
          <p className="mt-1.5 text-xs text-[#E7D39B]/70 font-editorial italic max-w-sm">
            “We Came as Students. We Leave as Brothers.” — FA23 Batch Memorial
          </p>
          <div className="text-[11px] text-[#C8A45D] font-mono mt-2">
            Mirpur University of Science and Technology (MUST)
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-[#E7D39B]/80">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Back to top button */}
        <div className="flex flex-col sm:items-end items-center gap-2">
          <button
            onClick={scrollToTop}
            className="p-2.5 rounded-full bg-[#0B1530] border border-[#C8A45D]/30 text-[#E7D39B] hover:text-[#070D1C] hover:bg-[#C8A45D] transition-all cursor-pointer focus:outline-none"
            aria-label="Back to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
          <span className="text-[10px] text-[#E7D39B]/50 font-mono">
            RETURN TO SUMMIT
          </span>
        </div>
      </div>

      {/* Bottom Legal / Dedication Line */}
      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-[#C8A45D]/10 flex flex-col sm:flex-row items-center justify-between text-xs text-[#E7D39B]/60 gap-4">
        <div className="flex items-center gap-1.5">
          <span>Crafted with honor for the 12 brothers of BS MLT FA23</span>
          <Heart className="w-3.5 h-3.5 fill-current text-[#C8A45D]" />
        </div>
        <div className="text-[11px]">
          © {new Date().getFullYear()} MUST BS MLT BOYS. Digital Legacy Prototype.
        </div>
      </div>
    </footer>
  );
};
