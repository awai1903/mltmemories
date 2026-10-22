import React, { useState } from 'react';
import { Menu, X, Sparkles, Palette, Check } from 'lucide-react';
import { useTheme, ThemeMode } from '../context/ThemeContext';

interface NavigationProps {
  onExploreClick: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ onExploreClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const navLinks = [
    { label: 'Home', href: '#hero' },
    { label: 'The Booklet', href: '#booklet' },
    { label: '2027 Countdown', href: '#countdown-2027' },
    { label: 'The Boys', href: '#directory' },
    { label: 'Memories', href: '#memories' },
    { label: 'Farewell 2027', href: '#farewell' },
    { label: 'Time Capsule', href: '#capsule' },
    { label: 'Our Story', href: '#story' },
  ];

  const themeOptions: { id: ThemeMode; name: string; colorDot: string }[] = [
    {
      id: 'cosmic-blue',
      name: 'Cosmic Blue Space',
      colorDot: 'bg-[#2A5298]',
    },
    {
      id: 'royal-gold',
      name: 'Royal Midnight Gold',
      colorDot: 'bg-[#C8A45D]',
    },
    {
      id: 'emerald-lab',
      name: 'Bioscience Emerald',
      colorDot: 'bg-[#2DD4BF]',
    },
  ];

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[var(--bg-primary)]/95 backdrop-blur-md border-b border-[var(--border-gold)] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-3 sm:gap-8">
        {/* Zone 1: Brand Wordmark */}
        <a
          href="#hero"
          onClick={scrollToTop}
          className="group flex items-center gap-2.5 sm:gap-3 text-base sm:text-xl font-cinzel font-bold tracking-wider text-[#F8F5EE] whitespace-nowrap shrink-0 hover:text-[var(--accent-champagne)] transition-colors cursor-pointer"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-[var(--accent-gold)]/80 bg-[var(--bg-secondary)] overflow-hidden flex items-center justify-center group-hover:scale-105 group-hover:border-[var(--accent-gold)] transition-all shadow-[0_0_14px_rgba(212,175,55,0.4)] shrink-0">
            <img
              src="/logo.png"
              alt="MUST BS MLT Official Department Logo"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <span>MUST · BS MLT BOYS</span>
        </a>

        {/* Zone 2: Navigation Links */}
        <nav
          className="hidden lg:flex items-center gap-6 text-xs sm:text-sm font-medium tracking-wide text-[#E7D39B]/85"
          aria-label="Main Navigation"
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-white hover:border-b-2 hover:border-[var(--accent-gold)] pb-1 transition-all whitespace-nowrap shrink-0"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Theme Switcher & Primary Action */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Theme Selector Dropdown Button */}
          <div className="relative">
            <button
              onClick={() => setThemeMenuOpen(!themeMenuOpen)}
              className="p-2 sm:px-3 sm:py-1.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-gold)] text-xs text-[var(--accent-champagne)] hover:text-white hover:border-[var(--accent-gold)] flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Change Website Theme"
              aria-label="Change website theme"
            >
              <Palette className="w-4 h-4 text-[var(--accent-gold)]" />
              <span className="hidden sm:inline text-[11px] font-cinzel uppercase">Theme</span>
            </button>

            {themeMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-52 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-gold)] p-2 shadow-2xl z-50 gold-box-glow animate-in fade-in zoom-in-95 duration-150"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-[10px] font-cinzel uppercase tracking-wider text-[var(--accent-gold)] px-2 py-1 border-b border-[var(--border-gold)] mb-1">
                  Select Theme
                </div>
                {themeOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setTheme(opt.id);
                      setThemeMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs text-left transition-colors cursor-pointer ${
                      theme === opt.id
                        ? 'bg-[var(--bg-card)] text-white font-semibold'
                        : 'text-[#E7D39B]/80 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${opt.colorDot} shadow-sm`} />
                      <span>{opt.name}</span>
                    </div>
                    {theme === opt.id && <Check className="w-3.5 h-3.5 text-[var(--accent-gold)]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={onExploreClick}
            className="hidden sm:inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 text-xs font-semibold uppercase tracking-wider text-[#030713] bg-gradient-to-r from-[var(--accent-gold)] to-[var(--accent-champagne)] hover:brightness-110 rounded-lg shadow-md transition-all whitespace-nowrap shrink-0 focus:outline-none cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Open Booklet</span>
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-[var(--accent-champagne)] hover:text-white hover:bg-white/5 border border-[var(--border-gold)] transition-colors focus:outline-none"
            aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Down Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[var(--bg-secondary)] border-b border-[var(--border-gold)] px-6 py-6 animate-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col gap-3 text-sm font-medium text-[var(--accent-champagne)]">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  if (link.href === '#hero') {
                    scrollToTop(e);
                  } else {
                    setMobileMenuOpen(false);
                  }
                }}
                className="py-1.5 border-b border-[var(--border-gold)]/20 hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}

            {/* Mobile Theme Selector */}
            <div className="pt-3">
              <div className="text-[11px] font-cinzel text-[var(--accent-gold)] uppercase tracking-wider mb-2">
                Website Theme
              </div>
              <div className="grid grid-cols-1 gap-1.5">
                {themeOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setTheme(opt.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${
                      theme === opt.id
                        ? 'bg-[var(--bg-card)] text-white font-semibold border border-[var(--border-gold)]'
                        : 'text-[#E7D39B]/80 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${opt.colorDot}`} />
                      <span>{opt.name}</span>
                    </div>
                    {theme === opt.id && <Check className="w-3.5 h-3.5 text-[var(--accent-gold)]" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onExploreClick();
                }}
                className="w-full py-2.5 text-xs font-semibold uppercase tracking-wider text-[#030713] bg-gradient-to-r from-[var(--accent-gold)] to-[var(--accent-champagne)] rounded-lg transition-all text-center flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Open Booklet</span>
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
