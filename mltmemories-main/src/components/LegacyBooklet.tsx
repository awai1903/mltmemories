import React, { useState, useEffect, useRef } from 'react';
import { BATCH_STUDENTS, Student } from '../data/students';
import { StudentAvatar } from './StudentAvatar';
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Sparkles,
  ExternalLink,
  List,
  Maximize2,
  Minimize2,
  GraduationCap,
  Microscope,
  Quote,
  ShieldCheck,
  Bookmark,
} from 'lucide-react';

interface LegacyBookletProps {
  onSelectStudent: (student: Student) => void;
}

export const LegacyBooklet: React.FC<LegacyBookletProps> = ({ onSelectStudent }) => {
  // Total spreads:
  // Spread 0: Cover & Prologue
  // Spread 1: Student 0 & 1 (Adil Javed & Abdul Moiz)
  // Spread 2: Student 2 & 3 (Abdur Rehman & Ahmed Khurshid)
  // Spread 3: Student 4 & 5 (Arslan Shabbir & Awais Sultan)
  // Spread 4: Student 5 & 6 (Faizan Ahmed & Usman Saeed)
  // Spread 5: Student 8 & 9 (Atta Ur Rehman & Tayyab Ali Khan)
  // Spread 6: Student 10 & 11 (Qasim Azad & Aman Naveed)
  // Spread 7: Epilogue & 2027 Covenant
  const totalSpreads = 8;
  const [currentSpread, setCurrentSpread] = useState<number>(0);
  const [mobilePage, setMobilePage] = useState<number>(0); // 0 to 13 on mobile
  const [tocOpen, setTocOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isFlipping, setIsFlipping] = useState<'next' | 'prev' | null>(null);
  const bookletRef = useRef<HTMLDivElement>(null);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSpread, mobilePage]);

  const handleNext = () => {
    if (isFlipping) return;
    setIsFlipping('next');
    setTimeout(() => {
      setCurrentSpread((prev) => Math.min(prev + 1, totalSpreads - 1));
      setMobilePage((prev) => Math.min(prev + 1, 13));
      setIsFlipping(null);
    }, 280);
  };

  const handlePrev = () => {
    if (isFlipping) return;
    setIsFlipping('prev');
    setTimeout(() => {
      setCurrentSpread((prev) => Math.max(prev - 1, 0));
      setMobilePage((prev) => Math.max(prev - 1, 0));
      setIsFlipping(null);
    }, 280);
  };

  const jumpToStudent = (index: number) => {
    const targetSpread = Math.floor(index / 2) + 1;
    setCurrentSpread(targetSpread);
    setMobilePage(index + 1);
    setTocOpen(false);
  };

  const toggleFullscreen = () => {
    if (!bookletRef.current) return;
    if (!isFullscreen) {
      if (bookletRef.current.requestFullscreen) {
        bookletRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  // Helper to render a student page inside the book spread
  const renderStudentPage = (student: Student, pageNumber: number, isRightPage: boolean) => (
    <div
      className={`h-full flex flex-col justify-between p-6 sm:p-8 bg-[#F8F5EE] text-[#0A1124] relative overflow-hidden select-text ${
        isRightPage ? 'border-l border-amber-900/10' : ''
      }`}
    >
      {/* Archival Paper Texture and corner ornaments */}
      <div className="absolute inset-0 bg-radial from-transparent via-[#F2EADB]/20 to-[#E8DCBF]/35 pointer-events-none" />
      <div className="absolute top-3 left-3 text-[10px] text-[#C8A45D]/60 font-cinzel">✦</div>
      <div className="absolute top-3 right-3 text-[10px] text-[#C8A45D]/60 font-cinzel">✦</div>
      <div className="absolute bottom-3 left-3 text-[10px] text-[#C8A45D]/60 font-cinzel">✦</div>
      <div className="absolute bottom-3 right-3 text-[10px] text-[#C8A45D]/60 font-cinzel">✦</div>

      {/* Page Header */}
      <div className="relative z-10 flex items-center justify-between pb-3 border-b border-[#C8A45D]/30">
        <span className="text-[10px] uppercase tracking-widest font-cinzel font-semibold text-[#8C6D2D]">
          MUST · BS MLT · CLASS OF 2027
        </span>
        <span className="font-mono text-xs text-[#8C6D2D] font-bold">
          PAGE {pageNumber}
        </span>
      </div>

      {/* Main Student Profile Body */}
      <div className="relative z-10 my-auto py-4 flex flex-col items-center text-center">
        {/* Avatar with Gold Foil Bezel */}
        <div className="relative mb-3 group">
          <StudentAvatar student={student} size="lg" className="ring-4 ring-[#C8A45D]/40 shadow-xl" />
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-[#07132c] text-[#F5E5B8] font-mono text-[10px] font-bold border border-[#C8A45D]/60 whitespace-nowrap shadow-md">
            {student.rollNo}
          </div>
        </div>

        {/* Student Name & Nickname */}
        <h3 className="text-xl sm:text-2xl font-cinzel font-bold text-[#0F1B38] tracking-tight mt-2">
          {student.name}
        </h3>
        <div className="text-xs font-editorial italic text-[#8C6D2D] font-semibold">
          "{student.nickname}" · {student.batchRole}
        </div>

        {/* Quote */}
        <div className="relative my-3 p-3.5 rounded-xl bg-white/70 border border-[#C8A45D]/25 max-w-sm shadow-sm">
          <Quote className="w-3.5 h-3.5 text-[#C8A45D] mb-1 opacity-70" />
          <p className="text-xs sm:text-sm font-editorial italic text-[#1D2A4D] leading-relaxed">
            "{student.favoriteQuote}"
          </p>
        </div>

        {/* Lab Station & Specialty */}
        <div className="w-full max-w-sm space-y-1.5 text-left text-xs bg-[#F1E9D7]/60 p-3 rounded-lg border border-[#C8A45D]/20">
          <div className="flex items-center gap-1.5 text-[#0F1B38]">
            <Microscope className="w-3.5 h-3.5 text-[#8C6D2D] shrink-0" />
            <span className="font-semibold">{student.labStation}</span>
          </div>
          <div className="text-[11px] text-[#334155] line-clamp-1">
            <span className="font-semibold text-[#8C6D2D]">Focus:</span> {student.specialtyInterest}
          </div>
        </div>

        {/* Farewell 2027 Reflection snippet */}
        <div className="mt-3 text-[11px] text-[#475569] font-editorial italic max-w-sm leading-relaxed line-clamp-2">
          "{student.farewellNote2027}"
        </div>
      </div>

      {/* Page Footer Action */}
      <div className="relative z-10 pt-3 border-t border-[#C8A45D]/30 flex items-center justify-between">
        <span className="text-[10px] uppercase font-cinzel text-[#8C6D2D]">
          {student.signatureTrait}
        </span>
        <button
          onClick={() => onSelectStudent(student)}
          className="px-3 py-1 rounded bg-[#07132c] hover:bg-[#0c2256] text-[#F5E5B8] text-[11px] font-semibold font-cinzel uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer shadow-sm"
        >
          <span>Full Record</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </div>
  );

  return (
    <section
      id="booklet"
      aria-label="Interactive Batch Legacy Booklet"
      ref={bookletRef}
      className="relative w-full min-h-[820px] lg:min-h-[900px] bg-[var(--bg-primary)] flex flex-col items-center justify-between py-12 px-4 sm:px-6 lg:px-8 overflow-hidden select-none border-y border-[var(--border-gold)] transition-colors duration-400"
    >
      {/* Background Ambient Cosmic Nebulas */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-gradient-to-r from-[#0c2256]/45 via-[#183a82]/35 to-[#0c2256]/45 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[340px] bg-[var(--accent-gold)]/10 rounded-full blur-[90px] pointer-events-none" />

      {/* Section Header */}
      <div className="relative z-10 text-center max-w-3xl mx-auto mb-6 px-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-gold)] text-xs font-cinzel text-[var(--accent-gold)] uppercase tracking-widest mb-2 shadow-sm">
          <BookOpen className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
          <span>Interactive Batch Yearbook & Folio</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-cinzel font-bold text-[#F8F5EE] tracking-tight">
          The FA23 Legacy Booklet
        </h2>
        <p className="mt-2 text-sm sm:text-base text-[var(--accent-champagne)]/90 font-editorial italic max-w-xl mx-auto">
          Turn the pages of our 2023–2027 memory volume. Flip through brother profiles, batch pledges, and lab station memories.
        </p>
      </div>

      {/* Main Booklet Frame */}
      <div className="relative z-10 w-full max-w-5xl mx-auto my-auto flex flex-col items-center">
        {/* Book Container with 3D Depth, Leather Spine, and Shadow */}
        <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] max-h-[580px] rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_40px_rgba(212,175,55,0.2)] border-4 border-[#8C6D2D] bg-[#07132c] flex overflow-hidden">
          {/* Center Book Spine / Binding Fold Shadow */}
          <div className="hidden sm:block absolute left-1/2 top-0 bottom-0 w-8 -translate-x-1/2 bg-gradient-to-r from-black/40 via-black/10 to-black/40 z-30 pointer-events-none shadow-inner" />

          {/* Golden Bookmark Ribbon */}
          <div className="hidden sm:flex absolute left-1/2 -top-2 w-5 h-16 bg-gradient-to-b from-[#C8A45D] via-[#E7D39B] to-[#997930] -translate-x-1/2 z-40 rounded-b shadow-lg pointer-events-none">
            <Bookmark className="w-4 h-4 text-[#07132c] mx-auto mt-2" />
          </div>

          {/* DESKTOP 2-PAGE SPREAD VIEW (sm and above) */}
          <div className="hidden sm:grid grid-cols-2 w-full h-full">
            {/* SPREAD 0: Hardcover Title & Prologue */}
            {currentSpread === 0 && (
              <>
                {/* Left Page: Luxury Leather Cover Frontispiece */}
                <div className="h-full bg-gradient-to-br from-[#0c1b3d] via-[#07132c] to-[#040919] p-8 sm:p-10 flex flex-col items-center justify-between text-center relative border-r border-[#C8A45D]/20">
                  <div className="w-full flex items-center justify-between text-[11px] font-cinzel text-[#C8A45D]">
                    <span>MUST UNIVERSITY</span>
                    <span>EST. 2023</span>
                  </div>

                  <div className="my-auto flex flex-col items-center">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-[#D4AF37] bg-[#030713]/80 flex flex-col items-center justify-center p-2 mb-4 shadow-2xl gold-box-glow">
                      <GraduationCap className="w-8 h-8 text-[#D4AF37] mb-1" />
                      <span className="text-[10px] font-cinzel font-bold text-[#F8F5EE]">BS MLT</span>
                      <span className="text-[8px] font-mono text-[#D4AF37]">FA23–2027</span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-cinzel font-extrabold text-[#F8F5EE] tracking-wide leading-tight">
                      OUR LEGACY
                    </h3>
                    <div className="text-xs uppercase font-cinzel text-[#D4AF37] tracking-[0.25em] mt-1">
                      The 12 Brothers Yearbook
                    </div>

                    <div className="w-16 h-[1.5px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent my-3" />

                    <p className="text-xs font-editorial italic text-[#F5E5B8]/80 max-w-xs">
                      “We Came as Students. We Leave as Brothers.”
                    </p>
                  </div>

                  <div className="text-[10px] font-mono text-[#D4AF37]/70">
                    VOLUME I · CLASS OF 2023–2027
                  </div>
                </div>

                {/* Right Page: Prologue & Table of Contents */}
                <div className="h-full bg-[#F8F5EE] p-8 sm:p-10 flex flex-col justify-between text-[#0A1124] relative">
                  <div className="flex items-center justify-between pb-3 border-b border-[#8C6D2D]/30">
                    <span className="text-[10px] font-cinzel font-bold uppercase text-[#8C6D2D]">
                      Prologue & Dedication
                    </span>
                    <span className="text-xs font-mono font-bold text-[#8C6D2D]">PAGE 1</span>
                  </div>

                  <div className="my-auto py-2">
                    <h4 className="text-xl font-cinzel font-bold text-[#0F1B38] mb-2">
                      To The Twelve Brothers
                    </h4>
                    <p className="text-xs sm:text-sm font-editorial italic text-[#334155] leading-relaxed mb-3">
                      This volume commemorates the four-year brotherhood of the BS Medical Laboratory Technology batch at Mirpur University of Science and Technology.
                    </p>
                    <p className="text-xs text-[#1E293B] leading-relaxed mb-4">
                      Before our 2027 convocation disperses us into clinical laboratories and medical centers across the nation, these pages preserve our laughter, our shared exams, our lab coats, and our unbreakable covenant.
                    </p>

                    <div className="p-3 bg-[#EFE7D4] rounded-lg border border-[#C8A45D]/30 text-xs">
                      <div className="font-cinzel font-bold text-[#8C6D2D] mb-1">
                        Turn Page to Enter The Roster
                      </div>
                      <div className="text-[11px] text-[#475569]">
                        Use arrows below or on your keyboard (← / →) to flip through all 12 student spreads.
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#8C6D2D]/30 flex justify-end">
                    <button
                      onClick={handleNext}
                      className="px-4 py-1.5 rounded bg-[#07132c] text-[#F5E5B8] text-xs font-cinzel font-bold hover:bg-[#0c2256] transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>Begin Reading</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* SPREADS 1 to 6: 12 Students paired (2 students per spread) */}
            {currentSpread >= 1 && currentSpread <= 6 && (
              <>
                {renderStudentPage(
                  BATCH_STUDENTS[(currentSpread - 1) * 2],
                  (currentSpread - 1) * 2 + 2,
                  false
                )}
                {renderStudentPage(
                  BATCH_STUDENTS[(currentSpread - 1) * 2 + 1],
                  (currentSpread - 1) * 2 + 3,
                  true
                )}
              </>
            )}

            {/* SPREAD 7: Epilogue Spread & 2027 Oath */}
            {currentSpread === 7 && (
              <>
                {/* Left Page: 2027 Oath & Covenant */}
                <div className="h-full bg-[#F8F5EE] p-8 flex flex-col justify-between text-[#0A1124] relative">
                  <div className="flex items-center justify-between pb-3 border-b border-[#8C6D2D]/30">
                    <span className="text-[10px] font-cinzel font-bold uppercase text-[#8C6D2D]">
                      The Convocation Oath
                    </span>
                    <span className="text-xs font-mono font-bold text-[#8C6D2D]">PAGE 14</span>
                  </div>

                  <div className="my-auto py-2">
                    <ShieldCheck className="w-8 h-8 text-[#8C6D2D] mb-2" />
                    <h4 className="text-xl font-cinzel font-bold text-[#0F1B38] mb-2">
                      The Oath of 2027
                    </h4>
                    <p className="text-xs sm:text-sm font-editorial italic text-[#334155] leading-relaxed mb-3">
                      “We pledge that distance shall not erode our brotherhood, nor time diminish our shared university laughter.”
                    </p>
                    <p className="text-xs text-[#1E293B] leading-relaxed mb-3">
                      Wherever the diagnostic craft takes us—whether haematology, clinical biochemistry, or molecular pathology—the 12 of MUST BS MLT remain bound as one.
                    </p>
                    <div className="text-xs font-cinzel font-bold text-[#8C6D2D]">
                      Reunion Target: 2033 (10-Year Assembly)
                    </div>
                  </div>

                  <div className="text-[10px] font-mono text-[#8C6D2D]">
                    MUST UNIVERSITY · DEPT. OF MLT
                  </div>
                </div>

                {/* Right Page: Back Leather Cover */}
                <div className="h-full bg-gradient-to-bl from-[#0c1b3d] via-[#07132c] to-[#040919] p-8 flex flex-col items-center justify-between text-center relative border-l border-[#C8A45D]/20">
                  <div className="w-full text-right text-[11px] font-cinzel text-[#C8A45D]">
                    FINAL EPILOGUE
                  </div>

                  <div className="my-auto flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full border border-[#D4AF37] bg-[#030713] flex items-center justify-center text-sm font-cinzel text-[#D4AF37] mb-3 shadow-lg">
                      12
                    </div>
                    <h3 className="text-xl font-cinzel font-bold text-[#F8F5EE]">
                      BROTHERS FOR LIFE
                    </h3>
                    <p className="text-xs font-editorial italic text-[#F5E5B8]/80 max-w-xs mt-2">
                      “May our legacy inspire the future batches of MUST University.”
                    </p>
                  </div>

                  <button
                    onClick={() => setCurrentSpread(0)}
                    className="px-4 py-1.5 rounded bg-[#D4AF37] text-[#030713] text-xs font-cinzel font-bold hover:brightness-110 transition-all cursor-pointer shadow-md"
                  >
                    Return to Cover
                  </button>
                </div>
              </>
            )}
          </div>

          {/* MOBILE 1-PAGE RESPONSIVE VIEW (sm and below) */}
          <div className="sm:hidden w-full h-full overflow-y-auto">
            {mobilePage === 0 ? (
              /* Mobile Cover Page */
              <div className="min-h-full bg-gradient-to-br from-[#0c1b3d] to-[#040919] p-6 flex flex-col items-center justify-between text-center text-white">
                <span className="text-[10px] font-cinzel text-[#D4AF37]">MUST · BS MLT FA23</span>
                <div className="my-auto flex flex-col items-center py-6">
                  <div className="w-20 h-20 rounded-full border-2 border-[#D4AF37] bg-[#030713] flex items-center justify-center text-xs font-cinzel text-[#D4AF37] mb-3 shadow-lg">
                    12 BOYS
                  </div>
                  <h3 className="text-2xl font-cinzel font-bold">OUR LEGACY</h3>
                  <div className="text-xs text-[#D4AF37] font-cinzel mt-1">Class of 2023–2027</div>
                  <p className="text-xs font-editorial italic text-[#F5E5B8]/80 mt-2">
                    “We Came as Students. We Leave as Brothers.”
                  </p>
                </div>
                <button
                  onClick={handleNext}
                  className="w-full py-2 bg-[#D4AF37] text-[#030713] font-cinzel font-bold text-xs rounded-lg"
                >
                  Open Booklet (Page 1) →
                </button>
              </div>
            ) : mobilePage <= 12 ? (
              /* Mobile Single Student Page */
              renderStudentPage(BATCH_STUDENTS[mobilePage - 1], mobilePage, false)
            ) : (
              /* Mobile Epilogue */
              <div className="min-h-full bg-[#F8F5EE] p-6 flex flex-col justify-between text-[#0A1124] text-center">
                <span className="text-[10px] font-cinzel font-bold text-[#8C6D2D]">EPILOGUE</span>
                <div className="my-auto py-4">
                  <h4 className="text-xl font-cinzel font-bold text-[#0F1B38] mb-2">
                    The 2027 Convocation Pledge
                  </h4>
                  <p className="text-xs font-editorial italic text-[#334155] leading-relaxed">
                    “We pledge that distance shall not erode our brotherhood, nor time diminish our shared university laughter.”
                  </p>
                </div>
                <button
                  onClick={() => setMobilePage(0)}
                  className="w-full py-2 bg-[#07132c] text-[#F5E5B8] font-cinzel font-bold text-xs rounded-lg"
                >
                  Return to Front Cover
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Booklet Interactive Control Dock */}
        <div className="w-full max-w-2xl mt-5 px-2 flex flex-col sm:flex-row items-center justify-between gap-3 bg-[var(--bg-secondary)]/95 border border-[var(--border-gold)] rounded-xl p-3 shadow-xl backdrop-blur-md">
          {/* Flip Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentSpread === 0 && mobilePage === 0}
              className="px-3 py-1.5 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-gold)] text-[var(--accent-champagne)] hover:text-white disabled:opacity-40 transition-colors flex items-center gap-1 text-xs cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline font-cinzel">Prev Page</span>
            </button>

            <span className="text-xs font-mono text-[var(--accent-gold)] px-2">
              <span className="sm:inline hidden">Spread {currentSpread + 1} of {totalSpreads}</span>
              <span className="sm:hidden">Page {mobilePage + 1} of 14</span>
            </span>

            <button
              onClick={handleNext}
              disabled={currentSpread === totalSpreads - 1 && mobilePage === 13}
              className="px-3 py-1.5 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-gold)] text-[var(--accent-champagne)] hover:text-white disabled:opacity-40 transition-colors flex items-center gap-1 text-xs cursor-pointer"
            >
              <span className="hidden sm:inline font-cinzel">Next Page</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Jump & Tools */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTocOpen(!tocOpen)}
              className="px-3 py-1.5 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-gold)] text-[var(--accent-champagne)] hover:text-white transition-colors flex items-center gap-1.5 text-xs cursor-pointer"
              title="Table of Contents"
            >
              <List className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
              <span className="font-cinzel">Index</span>
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-1.5 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-gold)] text-[var(--accent-champagne)] hover:text-white transition-colors cursor-pointer"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Table of Contents Drawer */}
        {tocOpen && (
          <div className="w-full max-w-2xl mt-2 p-4 bg-[var(--bg-secondary)] border border-[var(--border-gold)] rounded-xl shadow-2xl z-30 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="text-xs font-cinzel uppercase text-[var(--accent-gold)] font-bold mb-2 pb-1 border-b border-[var(--border-gold)] flex justify-between items-center">
              <span>Jump to Any Brother in Booklet</span>
              <span className="text-[10px] text-[#A3B3D9] font-sans">12 Brothers Total</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              {BATCH_STUDENTS.map((b, idx) => (
                <button
                  key={b.id}
                  onClick={() => jumpToStudent(idx)}
                  className="p-2 rounded bg-[var(--bg-primary)] hover:bg-[#0c2256] text-left border border-[var(--border-gold)]/30 hover:border-[var(--accent-gold)] transition-colors cursor-pointer"
                >
                  <div className="font-mono text-[10px] text-[var(--accent-gold)]">{b.rollNo}</div>
                  <div className="font-cinzel font-semibold text-[#F8F5EE] truncate">{b.name}</div>
                  <div className="text-[10px] text-[var(--accent-champagne)]/70 truncate">"{b.nickname}"</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
