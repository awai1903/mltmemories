/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
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
