/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { LegacyBooklet } from './components/LegacyBooklet';
import { DirectorySection } from './components/DirectorySection';
import { JourneySection } from './components/JourneySection';
import { MemoryWallSection } from './components/MemoryWallSection';
import { TimeCapsuleSection } from './components/TimeCapsuleSection';
import { StoryAndFilmSection } from './components/StoryAndFilmSection';
import { Footer } from './components/Footer';
import { StudentModal } from './components/StudentModal';
import { Countdown2027 } from './components/Countdown2027';
import { FarewellWall } from './components/FarewellWall';
import { ThemeProvider } from './context/ThemeContext';
import { Student } from './data/students';

function AppContent() {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      setShowScrollTop(window.scrollY > 350);
    };
    window.addEventListener('scroll', checkScroll, { passive: true });
    return () => window.removeEventListener('scroll', checkScroll);
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBooklet = () => {
    const el = document.getElementById('booklet');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[#F8F5EE] flex flex-col font-sans selection:bg-[var(--accent-gold)]/30 selection:text-[var(--accent-champagne)] transition-colors duration-400">
      {/* Top 3-Zone Navigation */}
      <Navigation onExploreClick={scrollToBooklet} />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Full-screen Hero Section */}
        <Hero onScrollToExplore={scrollToBooklet} />

        {/* Signature Feature: Fully Responsive Interactive Batch Legacy Memory Booklet */}
        <LegacyBooklet onSelectStudent={(student) => setSelectedStudent(student)} />

        {/* 2027 Convocation & Farewell Countdown Banner */}
        <div id="countdown-2027">
          <Countdown2027 />
        </div>

        {/* Searchable 12 Boys Directory */}
        <DirectorySection onSelectStudent={(student) => setSelectedStudent(student)} />

        {/* Milestone Timeline: Our Journey */}
        <JourneySection />

        {/* Visual Memory Scrapbook & Gallery */}
        <MemoryWallSection />

        {/* 2027 Farewell & Brotherhood Wall */}
        <FarewellWall onSelectStudent={(student) => setSelectedStudent(student)} />

        {/* Future Time Capsule */}
        <TimeCapsuleSection />

        {/* Our Story and Batch Film Preview */}
        <StoryAndFilmSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Scroll to Top button for Mobile & Desktop */}
      {showScrollTop && (
        <button
          onClick={handleScrollToTop}
          aria-label="Scroll back to top"
          className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-[var(--bg-secondary)]/90 backdrop-blur-md border border-[var(--border-gold)] text-[var(--accent-gold)] hover:text-white hover:bg-[var(--accent-gold)]/20 shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--accent-gold)]"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* Student Profile Modal */}
      <StudentModal
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
