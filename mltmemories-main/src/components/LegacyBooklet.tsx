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
  Volume2,
  VolumeX,
} from 'lucide-react';

interface LegacyBookletProps {
  onSelectStudent: (student: Student) => void;
}

export const LegacyBooklet: React.FC<LegacyBookletProps> = ({ onSelectStudent }) => {
  const totalSpreads = 8;
  const [currentSpread, setCurrentSpread] = useState<number>(0);
  const [mobilePage, setMobilePage] = useState<number>(0);
  const [tocOpen, setTocOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Flip animation states
  // 'next': flipping from currentSpread to currentSpread + 1
  // 'prev': flipping from currentSpread to currentSpread - 1
  const [flipState, setFlipState] = useState<{
    direction: 'next' | 'prev';
    fromSpread: number;
    toSpread: number;
  } | null>(null);

  const bookletRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Web Audio synthetic soft paper rustle sound
  const playPageTurnSound = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Generate soft paper friction noise
      const bufferSize = ctx.sampleRate * 0.14; // ~140ms
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        // pink-ish noise decay
        const progress = i / bufferSize;
        const envelope = Math.sin(progress * Math.PI) * (1 - progress * 0.5);
        data[i] = (Math.random() * 2 - 1) * envelope * 0.12;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      // Bandpass filter to emulate real paper sheet frequency
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, ctx.currentTime);
      filter.Q.setValueAtTime(1.2, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
    } catch {
      // Audio not supported or autoplay blocked
    }
  };

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
  }, [currentSpread, flipState, mobilePage]);

  const handleNext = () => {
    if (flipState) return;
    if (currentSpread >= totalSpreads - 1 && mobilePage >= 13) return;

    playPageTurnSound();

    const nextSpread = Math.min(currentSpread + 1, totalSpreads - 1);
    setFlipState({
      direction: 'next',
      fromSpread: currentSpread,
      toSpread: nextSpread,
    });

    setMobilePage((prev) => Math.min(prev + 1, 13));

    setTimeout(() => {
      setCurrentSpread(nextSpread);
      setFlipState(null);
    }, 650);
  };

  const handlePrev = () => {
    if (flipState) return;
    if (currentSpread <= 0 && mobilePage <= 0) return;

    playPageTurnSound();

    const prevSpread = Math.max(currentSpread - 1, 0);
    setFlipState({
      direction: 'prev',
      fromSpread: currentSpread,
      toSpread: prevSpread,
    });

    setMobilePage((prev) => Math.max(prev - 1, 0));

    setTimeout(() => {
      setCurrentSpread(prevSpread);
      setFlipState(null);
    }, 650);
  };

  const jumpToStudent = (index: number) => {
    if (flipState) return;
    playPageTurnSound();
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

  // Helper to render a student profile page inside the book
  const renderStudentPage = (student: Student, pageNumber: number, isRightPage: boolean) => (
    <div
      className={`h-full w-full flex flex-col justify-between p-5 sm:p-7 md:p-8 bg-[#FBF8F1] text-[#0A1124] relative overflow-hidden select-text ${
        isRightPage ? 'border-l border-[#8C6D2D]/20 shadow-[inset_12px_0_20px_-8px_rgba(0,0,0,0.12)]' : 'shadow-[inset_-12px_0_20px_-8px_rgba(0,0,0,0.12)]'
      }`}
    >
      {/* Subtle Archival Laid Paper Texture and Vintage Corner Ornaments */}
      <div className="absolute inset-0 bg-radial from-transparent via-[#F4EDE0]/40 to-[#EAE0CA]/60 pointer-events-none" />
      <div className="absolute top-3 left-3 text-[10px] text-[#C8A45D]/70 font-cinzel select-none">✦</div>
      <div className="absolute top-3 right-3 text-[10px] text-[#C8A45D]/70 font-cinzel select-none">✦</div>
      <div className="absolute bottom-3 left-3 text-[10px] text-[#C8A45D]/70 font-cinzel select-none">✦</div>
      <div className="absolute bottom-3 right-3 text-[10px] text-[#C8A45D]/70 font-cinzel select-none">✦</div>

      {/* Page Header */}
      <div className="relative z-10 flex items-center justify-between pb-2.5 border-b border-[#C8A45D]/30">
        <span className="text-[9px] sm:text-[10px] uppercase tracking-widest font-cinzel font-semibold text-[#8C6D2D]">
          MUST · BS MLT · CLASS OF 2027
        </span>
        <span className="font-mono text-[11px] sm:text-xs text-[#8C6D2D] font-bold">
          PAGE {pageNumber}
        </span>
      </div>

      {/* Main Student Profile Body */}
      <div className="relative z-10 my-auto py-2 sm:py-3 flex flex-col items-center text-center">
        {/* Avatar with Gold Foil Bezel */}
        <div className="relative mb-2.5 group">
          <StudentAvatar student={student} size="lg" className="ring-4 ring-[#C8A45D]/50 shadow-xl" />
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-[#07132c] text-[#F5E5B8] font-mono text-[10px] font-bold border border-[#C8A45D]/70 whitespace-nowrap shadow-md">
            {student.rollNo}
          </div>
        </div>

        {/* Student Name & Nickname */}
        <h3 className="text-lg sm:text-2xl font-cinzel font-bold text-[#0F1B38] tracking-tight mt-1">
          {student.name}
        </h3>
        <div className="text-xs font-editorial italic text-[#8C6D2D] font-semibold">
          "{student.nickname}" · {student.batchRole}
        </div>

        {/* Quote */}
        <div className="relative my-2 sm:my-3 p-3 rounded-xl bg-white/80 border border-[#C8A45D]/30 max-w-sm shadow-sm">
          <Quote className="w-3.5 h-3.5 text-[#C8A45D] mb-1 opacity-70" />
          <p className="text-xs sm:text-sm font-editorial italic text-[#1D2A4D] leading-relaxed">
            "{student.favoriteQuote}"
          </p>
        </div>

        {/* Lab Station & Specialty */}
        <div className="w-full max-w-sm space-y-1 text-left text-xs bg-[#F2EBDA]/70 p-2.5 sm:p-3 rounded-lg border border-[#C8A45D]/25">
          <div className="flex items-center gap-1.5 text-[#0F1B38]">
            <Microscope className="w-3.5 h-3.5 text-[#8C6D2D] shrink-0" />
            <span className="font-semibold text-xs sm:text-sm">{student.labStation}</span>
          </div>
          <div className="text-[11px] text-[#334155] line-clamp-1">
            <span className="font-semibold text-[#8C6D2D]">Focus:</span> {student.specialtyInterest}
          </div>
        </div>

        {/* Farewell 2027 Reflection snippet */}
        <div className="mt-2 text-[11px] text-[#475569] font-editorial italic max-w-sm leading-relaxed line-clamp-2">
          "{student.farewellNote2027}"
        </div>
      </div>

      {/* Page Footer Action */}
      <div className="relative z-10 pt-2.5 border-t border-[#C8A45D]/30 flex items-center justify-between">
        <span className="text-[9px] sm:text-[10px] uppercase font-cinzel text-[#8C6D2D] truncate max-w-[150px]">
          {student.signatureTrait}
        </span>
        <button
          onClick={() => onSelectStudent(student)}
          className="px-2.5 sm:px-3 py-1 rounded bg-[#07132c] hover:bg-[#0c2256] text-[#F5E5B8] text-[10px] sm:text-[11px] font-semibold font-cinzel uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer shadow-sm"
        >
          <span>Full Record</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>

      {/* Interactive Corner Dog-Ear Cue */}
      {isRightPage && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          className="absolute bottom-0 right-0 w-8 h-8 cursor-pointer group/corner z-20"
          title="Click to flip to next page"
        >
          <div className="absolute bottom-0 right-0 w-0 h-0 border-solid border-t-[20px] border-l-[20px] border-b-0 border-r-0 border-t-transparent border-l-[#C8A45D]/50 group-hover/corner:border-t-[26px] group-hover/corner:border-l-[26px] transition-all" />
        </div>
      )}
      {!isRightPage && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          className="absolute bottom-0 left-0 w-8 h-8 cursor-pointer group/corner z-20"
          title="Click to flip to previous page"
        >
          <div className="absolute bottom-0 left-0 w-0 h-0 border-solid border-t-[20px] border-r-[20px] border-b-0 border-l-0 border-t-transparent border-r-[#C8A45D]/50 group-hover/corner:border-t-[26px] group-hover/corner:border-r-[26px] transition-all" />
        </div>
      )}
    </div>
  );

  // Helper to render any page in a given spread
  const renderSpreadPage = (spreadIndex: number, side: 'left' | 'right') => {
    // SPREAD 0
    if (spreadIndex === 0) {
      if (side === 'left') {
        // Hardcover Title Frontispiece
        return (
          <div className="h-full w-full bg-gradient-to-br from-[#0c1b3d] via-[#07132c] to-[#040919] p-6 sm:p-8 md:p-10 flex flex-col items-center justify-between text-center relative border-r border-[#C8A45D]/20 shadow-[inset_-15px_0_25px_rgba(0,0,0,0.5)]">
            <div className="w-full flex items-center justify-between text-[10px] sm:text-[11px] font-cinzel text-[#C8A45D]">
              <span>MUST UNIVERSITY</span>
              <span>EST. 2023</span>
            </div>

            <div className="my-auto flex flex-col items-center">
              <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full border-2 border-[#D4AF37] bg-[#030713]/80 flex flex-col items-center justify-center p-2 mb-3 sm:mb-4 shadow-2xl gold-box-glow">
                <GraduationCap className="w-7 h-7 sm:w-8 sm:h-8 text-[#D4AF37] mb-1" />
                <span className="text-[9px] sm:text-[10px] font-cinzel font-bold text-[#F8F5EE]">BS MLT</span>
                <span className="text-[7px] sm:text-[8px] font-mono text-[#D4AF37]">FA23–2027</span>
              </div>

              <h3 className="text-xl sm:text-3xl font-cinzel font-extrabold text-[#F8F5EE] tracking-wide leading-tight">
                OUR LEGACY
              </h3>
              <div className="text-[10px] sm:text-xs uppercase font-cinzel text-[#D4AF37] tracking-[0.25em] mt-1">
                The 12 Brothers Yearbook
              </div>

              <div className="w-16 h-[1.5px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent my-2 sm:my-3" />

              <p className="text-xs font-editorial italic text-[#F5E5B8]/80 max-w-xs">
                “We Came as Students. We Leave as Brothers.”
              </p>
            </div>

            <div className="text-[9px] sm:text-[10px] font-mono text-[#D4AF37]/70">
              VOLUME I · CLASS OF 2023–2027
            </div>
          </div>
        );
      } else {
        // Prologue & Dedication
        return (
          <div className="h-full w-full bg-[#FBF8F1] p-6 sm:p-8 md:p-10 flex flex-col justify-between text-[#0A1124] relative shadow-[inset_15px_0_25px_rgba(0,0,0,0.12)]">
            <div className="flex items-center justify-between pb-3 border-b border-[#8C6D2D]/30">
              <span className="text-[10px] font-cinzel font-bold uppercase text-[#8C6D2D]">
                Prologue & Dedication
              </span>
              <span className="text-xs font-mono font-bold text-[#8C6D2D]">PAGE 1</span>
            </div>

            <div className="my-auto py-2">
              <h4 className="text-lg sm:text-xl font-cinzel font-bold text-[#0F1B38] mb-2">
                To The Twelve Brothers
              </h4>
              <p className="text-xs sm:text-sm font-editorial italic text-[#334155] leading-relaxed mb-2.5">
                This volume commemorates the four-year brotherhood of the BS Medical Laboratory Technology batch at Mirpur University of Science and Technology.
              </p>
              <p className="text-xs text-[#1E293B] leading-relaxed mb-3">
                Before our 2027 convocation disperses us into clinical laboratories across the country, these pages preserve our laughter, our shared exams, our lab coats, and our unbreakable covenant.
              </p>

              <div className="p-2.5 sm:p-3 bg-[#EFE7D4] rounded-lg border border-[#C8A45D]/30 text-xs">
                <div className="font-cinzel font-bold text-[#8C6D2D] mb-1">
                  Turn Page to Enter The Roster
                </div>
                <div className="text-[11px] text-[#475569]">
                  Click the right page corner, use controls below, or press the Right Arrow (→) to flip.
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#8C6D2D]/30 flex justify-end">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="px-3.5 py-1.5 rounded bg-[#07132c] text-[#F5E5B8] text-xs font-cinzel font-bold hover:bg-[#0c2256] transition-colors flex items-center gap-1 cursor-pointer shadow-md"
              >
                <span>Begin Reading</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        );
      }
    }

    // SPREADS 1 TO 6: Students
    if (spreadIndex >= 1 && spreadIndex <= 6) {
      const studentIndex = (spreadIndex - 1) * 2 + (side === 'left' ? 0 : 1);
      const student = BATCH_STUDENTS[studentIndex];
      const pageNum = studentIndex + 2;
      return renderStudentPage(student, pageNum, side === 'right');
    }

    // SPREAD 7: Epilogue & Back Cover
    if (spreadIndex === 7) {
      if (side === 'left') {
        return (
          <div className="h-full w-full bg-[#FBF8F1] p-6 sm:p-8 flex flex-col justify-between text-[#0A1124] relative shadow-[inset_-15px_0_25px_rgba(0,0,0,0.12)]">
            <div className="flex items-center justify-between pb-3 border-b border-[#8C6D2D]/30">
              <span className="text-[10px] font-cinzel font-bold uppercase text-[#8C6D2D]">
                The Convocation Oath
              </span>
              <span className="text-xs font-mono font-bold text-[#8C6D2D]">PAGE 14</span>
            </div>

            <div className="my-auto py-2">
              <ShieldCheck className="w-8 h-8 text-[#8C6D2D] mb-2" />
              <h4 className="text-lg sm:text-xl font-cinzel font-bold text-[#0F1B38] mb-2">
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
        );
      } else {
        return (
          <div className="h-full w-full bg-gradient-to-bl from-[#0c1b3d] via-[#07132c] to-[#040919] p-6 sm:p-8 flex flex-col items-center justify-between text-center relative border-l border-[#C8A45D]/20 shadow-[inset_15px_0_25px_rgba(0,0,0,0.5)]">
            <div className="w-full text-right text-[11px] font-cinzel text-[#C8A45D]">
              FINAL EPILOGUE
            </div>

            <div className="my-auto flex flex-col items-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-[#D4AF37] bg-[#030713] flex items-center justify-center text-sm font-cinzel text-[#D4AF37] mb-3 shadow-lg">
                12
              </div>
              <h3 className="text-lg sm:text-xl font-cinzel font-bold text-[#F8F5EE]">
                BROTHERS FOR LIFE
              </h3>
              <p className="text-xs font-editorial italic text-[#F5E5B8]/80 max-w-xs mt-2">
                “May our legacy inspire the future batches of MUST University.”
              </p>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentSpread(0);
                setMobilePage(0);
              }}
              className="px-4 py-1.5 rounded bg-[#D4AF37] text-[#030713] text-xs font-cinzel font-bold hover:brightness-110 transition-all cursor-pointer shadow-md"
            >
              Return to Front Cover
            </button>
          </div>
        );
      }
    }

    return null;
  };

  return (
    <section
      id="booklet"
      aria-label="Interactive Batch Legacy Booklet"
      ref={bookletRef}
      className="relative w-full min-h-[820px] lg:min-h-[900px] bg-[var(--bg-primary)] flex flex-col items-center justify-between py-12 px-4 sm:px-6 lg:px-8 overflow-hidden select-none border-y border-[var(--border-gold)] scroll-mt-16 sm:scroll-mt-20 transition-colors duration-400"
    >
      {/* Background Ambient Cosmic Nebulas */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-gradient-to-r from-[#0c2256]/45 via-[#183a82]/35 to-[#0c2256]/45 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[340px] bg-[var(--accent-gold)]/10 rounded-full blur-[90px] pointer-events-none" />

      {/* Section Header */}
      <div className="relative z-10 text-center max-w-3xl mx-auto mb-6 px-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-gold)] text-xs font-cinzel text-[var(--accent-gold)] uppercase tracking-widest mb-2 shadow-sm">
          <BookOpen className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
          <span>Interactive 3D Batch Folio & Yearbook</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-cinzel font-bold text-[#F8F5EE] tracking-tight">
          The FA23 Legacy Booklet
        </h2>
        <p className="mt-2 text-sm sm:text-base text-[var(--accent-champagne)]/90 font-editorial italic max-w-xl mx-auto">
          Turn the 3D pages of our 2023–2027 memory volume. Flip through brother profiles, batch pledges, and lab station memories.
        </p>
      </div>

      {/* Main 3D Booklet Stage */}
      <div className="relative z-10 w-full max-w-5xl mx-auto my-auto flex flex-col items-center perspective-book">
        {/* Physical Book Wrapper with Hardcover Edge Lip & Shadow */}
        <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] max-h-[580px] rounded-2xl p-2.5 sm:p-3 bg-gradient-to-b from-[#182a4d] via-[#09152e] to-[#040c1e] border-2 border-[#C8A45D]/60 shadow-[0_30px_70px_-10px_rgba(0,0,0,0.9),0_0_50px_rgba(200,164,93,0.25)] flex overflow-visible">
          {/* Stacked Paper Edges on Left and Right (Simulates 100+ physical pages) */}
          <div className="hidden sm:block absolute -left-2 top-3 bottom-3 w-2.5 book-paper-edge-right rounded-l-sm shadow-md pointer-events-none opacity-85" />
          <div className="hidden sm:block absolute -right-2 top-3 bottom-3 w-2.5 book-paper-edge-right rounded-r-sm shadow-md pointer-events-none opacity-85" />
          <div className="hidden sm:block absolute left-3 right-3 -bottom-2 h-2.5 book-paper-edge-bottom rounded-b-sm shadow-md pointer-events-none opacity-85" />

          {/* Book Inner Spread Container */}
          <div className="relative w-full h-full rounded-xl overflow-hidden bg-[#07132c] flex book-transform-3d">
            {/* Center Book Spine Binding Fold / Crease Shadow */}
            <div className="hidden sm:block absolute left-1/2 top-0 bottom-0 w-10 -translate-x-1/2 bg-gradient-to-r from-black/45 via-black/15 to-black/45 z-30 pointer-events-none shadow-inner" />
            <div className="hidden sm:block absolute left-1/2 top-0 bottom-0 w-[1px] -translate-x-1/2 bg-[#C8A45D]/30 z-30 pointer-events-none" />

            {/* Golden Ribbon Bookmark */}
            <div className="hidden sm:flex absolute left-1/2 -top-1 w-5 h-16 bg-gradient-to-b from-[#C8A45D] via-[#E7D39B] to-[#997930] -translate-x-1/2 z-40 rounded-b shadow-lg pointer-events-none">
              <Bookmark className="w-4 h-4 text-[#07132c] mx-auto mt-2" />
            </div>

            {/* DESKTOP 3D TWO-PAGE SPREAD VIEW (sm and above) */}
            <div className="hidden sm:flex w-full h-full relative book-transform-3d">
              {/* UNDERNEATH STATIONARY LEFT PAGE */}
              <div
                onClick={handlePrev}
                className="w-1/2 h-full cursor-pointer relative"
                title="Click left page to flip backward"
              >
                {renderSpreadPage(
                  flipState && flipState.direction === 'prev' ? flipState.toSpread : currentSpread,
                  'left'
                )}
              </div>

              {/* UNDERNEATH STATIONARY RIGHT PAGE */}
              <div
                onClick={handleNext}
                className="w-1/2 h-full cursor-pointer relative"
                title="Click right page to flip forward"
              >
                {renderSpreadPage(
                  flipState && flipState.direction === 'next' ? flipState.toSpread : currentSpread,
                  'right'
                )}
              </div>

              {/* DYNAMIC 3D FLIPPING LEAF (NEXT TURN) */}
              {flipState && flipState.direction === 'next' && (
                <div className="absolute right-0 top-0 w-1/2 h-full z-40 animate-page-flip-next book-transform-3d pointer-events-none">
                  {/* Front Face: The outgoing right page */}
                  <div className="absolute inset-0 w-full h-full book-face-front overflow-hidden">
                    {renderSpreadPage(flipState.fromSpread, 'right')}
                    {/* Dynamic curl lighting shadow */}
                    <div className="absolute inset-0 bg-gradient-to-l from-black/35 via-white/10 to-transparent pointer-events-none" />
                  </div>

                  {/* Back Face: The incoming next left page */}
                  <div className="absolute inset-0 w-full h-full book-face-back overflow-hidden">
                    {renderSpreadPage(flipState.toSpread, 'left')}
                    {/* Dynamic curl lighting shadow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-white/10 to-transparent pointer-events-none" />
                  </div>
                </div>
              )}

              {/* DYNAMIC 3D FLIPPING LEAF (PREV TURN) */}
              {flipState && flipState.direction === 'prev' && (
                <div className="absolute left-0 top-0 w-1/2 h-full z-40 animate-page-flip-prev book-transform-3d pointer-events-none">
                  {/* Front Face: The incoming previous right page */}
                  <div className="absolute inset-0 w-full h-full book-face-front overflow-hidden">
                    {renderSpreadPage(flipState.toSpread, 'right')}
                    {/* Dynamic curl lighting shadow */}
                    <div className="absolute inset-0 bg-gradient-to-l from-black/35 via-white/10 to-transparent pointer-events-none" />
                  </div>

                  {/* Back Face: The outgoing left page */}
                  <div className="absolute inset-0 w-full h-full book-face-back overflow-hidden">
                    {renderSpreadPage(flipState.fromSpread, 'left')}
                    {/* Dynamic curl lighting shadow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-white/10 to-transparent pointer-events-none" />
                  </div>
                </div>
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
                    className="w-full py-2 bg-[#D4AF37] text-[#030713] font-cinzel font-bold text-xs rounded-lg shadow-md cursor-pointer"
                  >
                    Open Booklet (Page 1) →
                  </button>
                </div>
              ) : mobilePage <= 12 ? (
                /* Mobile Single Student Page */
                renderStudentPage(BATCH_STUDENTS[mobilePage - 1], mobilePage, false)
              ) : (
                /* Mobile Epilogue */
                <div className="min-h-full bg-[#FBF8F1] p-6 flex flex-col justify-between text-[#0A1124] text-center">
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
                    onClick={() => {
                      playPageTurnSound();
                      setMobilePage(0);
                      setCurrentSpread(0);
                    }}
                    className="w-full py-2 bg-[#07132c] text-[#F5E5B8] font-cinzel font-bold text-xs rounded-lg cursor-pointer"
                  >
                    Return to Front Cover
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Booklet Interactive Control Dock */}
        <div className="w-full max-w-2xl mt-5 px-2 flex flex-col sm:flex-row items-center justify-between gap-3 bg-[var(--bg-secondary)]/95 border border-[var(--border-gold)] rounded-xl p-3 shadow-xl backdrop-blur-md">
          {/* Flip Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={Boolean(flipState) || (currentSpread === 0 && mobilePage === 0)}
              className="px-3 py-1.5 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-gold)] text-[var(--accent-champagne)] hover:text-white disabled:opacity-40 transition-colors flex items-center gap-1 text-xs cursor-pointer"
              title="Previous Page (or press ← Left Arrow)"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline font-cinzel">Prev Page</span>
            </button>

            <span className="text-xs font-mono text-[var(--accent-gold)] px-2">
              <span className="sm:inline hidden">
                Spread {currentSpread + 1} of {totalSpreads}
              </span>
              <span className="sm:hidden">
                Page {mobilePage + 1} of 14
              </span>
            </span>

            <button
              onClick={handleNext}
              disabled={Boolean(flipState) || (currentSpread === totalSpreads - 1 && mobilePage === 13)}
              className="px-3 py-1.5 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-gold)] text-[var(--accent-champagne)] hover:text-white disabled:opacity-40 transition-colors flex items-center gap-1 text-xs cursor-pointer"
              title="Next Page (or press → Right Arrow)"
            >
              <span className="hidden sm:inline font-cinzel">Next Page</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Roster Jump Dropdown & Actions */}
          <div className="flex items-center gap-2">
            {/* Audio Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1.5 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-gold)] text-[var(--accent-champagne)] hover:text-white transition-colors cursor-pointer"
              title={soundEnabled ? 'Mute Page Flip Sound' : 'Enable Page Flip Sound'}
              aria-label="Toggle Page Flip Sound"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-[var(--accent-gold)]" /> : <VolumeX className="w-4 h-4 text-white/50" />}
            </button>

            {/* Quick Index */}
            <div className="relative">
              <button
                onClick={() => setTocOpen(!tocOpen)}
                className="px-3 py-1.5 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-gold)] text-[var(--accent-champagne)] hover:text-white flex items-center gap-1.5 text-xs font-cinzel cursor-pointer"
              >
                <List className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
                <span>Jump to Brother</span>
              </button>

              {tocOpen && (
                <div
                  className="absolute right-0 bottom-full mb-2 w-64 max-h-72 overflow-y-auto rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-gold)] p-2 shadow-2xl z-50 gold-box-glow"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="text-[10px] font-cinzel text-[var(--accent-gold)] uppercase tracking-wider px-2 py-1 border-b border-[var(--border-gold)]/30 mb-1">
                    Select Brother Profile
                  </div>
                  {BATCH_STUDENTS.map((student, idx) => (
                    <button
                      key={student.rollNo}
                      onClick={() => jumpToStudent(idx)}
                      className="w-full text-left px-2 py-1.5 rounded hover:bg-white/5 flex items-center justify-between text-xs text-[#F5F0E5] transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-[#C8A45D]">
                          #{idx + 1}
                        </span>
                        <span className="truncate">{student.name}</span>
                      </div>
                      <span className="font-mono text-[9px] text-[#A3B3D9]">
                        {student.rollNo.slice(-3)}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              className="p-1.5 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-gold)] text-[var(--accent-champagne)] hover:text-white transition-colors cursor-pointer"
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
              aria-label="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
