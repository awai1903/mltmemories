/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { PhotoRing3D } from './components/PhotoRing3D';
import { DirectorySection } from './components/DirectorySection';
import { JourneySection } from './components/JourneySection';
import { MemoryWallSection } from './components/MemoryWallSection';
import { TimeCapsuleSection } from './components/TimeCapsuleSection';
import { StoryAndFilmSection } from './components/StoryAndFilmSection';
import { Footer } from './components/Footer';
import { StudentModal } from './components/StudentModal';
import { Countdown2027 } from './components/Countdown2027';
import { FarewellWall } from './components/FarewellWall';
import { Student } from './data/students';

export default function App() {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const scrollToRing = () => {
    const el = document.getElementById('the-ring');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#070D1C] text-[#F5F0E5] flex flex-col font-sans selection:bg-[#C8A45D]/30 selection:text-[#E7D39B]">
      {/* Top 3-Zone Navigation */}
      <Navigation onExploreClick={scrollToRing} />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Full-screen Hero Section */}
        <Hero onScrollToExplore={scrollToRing} />

        {/* Signature Feature: Tilted 3D Rotating Photo Ring */}
        <PhotoRing3D onSelectStudent={(student) => setSelectedStudent(student)} />

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
