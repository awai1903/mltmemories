import React, { useState } from 'react';
import { Menu, X, Sparkles } from 'lucide-react';

interface NavigationProps {
  onExploreClick: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ onExploreClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <header className="sticky top-0 z-40 w-full bg-[#070D1C]/90 backdrop-blur-md border-b border-[#C8A45D]/20 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single Text Element) */}
        <a
          href="#hero"
          className="group flex items-center gap-3 text-lg sm:text-xl font-cinzel font-bold tracking-wider text-[#F5F0E5] whitespace-nowrap shrink-0 hover:text-[#E7D39B] transition-colors"
        >
          <div className="w-8 h-8 rounded-full border border-[#C8A45D]/60 bg-[#0B1530] flex items-center justify-center text-xs font-serif text-[#C8A45D] group-hover:scale-105 transition-transform">
            MUST
          </div>
          <span>MUST · BS MLT BOYS</span>
        </a>

        {/* Zone 2: Navigation Links (Clean single line typography with hover underlines) */}
        <nav
          className="hidden lg:flex items-center gap-7 text-xs sm:text-sm font-medium tracking-wide text-[#E7D39B]/80"
          aria-label="Main Navigation"
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-[#F5F0E5] hover:border-b-2 hover:border-[#C8A45D] pb-1 transition-all whitespace-nowrap shrink-0"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Primary Action + Mobile Hamburger */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onExploreClick}
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#070D1C] bg-gradient-to-r from-[#C8A45D] to-[#E7D39B] hover:brightness-110 rounded-lg shadow-md transition-all whitespace-nowrap shrink-0 focus:outline-none focus:ring-2 focus:ring-[#C8A45D] cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Explore Legacy</span>
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-[#E7D39B] hover:text-[#F5F0E5] hover:bg-white/5 border border-[#C8A45D]/30 transition-colors focus:outline-none focus:ring-2 focus:ring-[#C8A45D]"
            aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Down Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0B1530] border-b border-[#C8A45D]/30 px-6 py-6 animate-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col gap-4 text-sm font-medium text-[#E7D39B]">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-[#C8A45D]/10 hover:text-[#F5F0E5] transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onExploreClick();
                }}
                className="w-full py-2.5 text-xs font-semibold uppercase tracking-wider text-[#070D1C] bg-gradient-to-r from-[#C8A45D] to-[#E7D39B] rounded-lg transition-all text-center flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Explore Legacy</span>
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
