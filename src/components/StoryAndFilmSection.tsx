import React, { useState, useRef } from 'react';
import { Play, Volume2, VolumeX, X, Film, Sparkles, BookOpen } from 'lucide-react';
import batchFilmCinematicImg from '../assets/images/batch_film_cinematic_1792668356841.jpg';

export const StoryAndFilmSection: React.FC = () => {
  const [filmModalOpen, setFilmModalOpen] = useState(false);
  const [activeChapter, setActiveChapter] = useState(0);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorNodeRef = useRef<OscillatorNode | null>(null);

  const chapters = [
    {
      title: 'Prologue: The Gathering',
      duration: '01:45',
      synopsis: '12 young men from across the region cross the threshold of Mirpur University of Science and Technology.',
    },
    {
      title: 'Chapter I: The Laboratory Sanctum',
      duration: '03:10',
      synopsis: 'Mastering the microscopes, staining slides, and learning the delicate craft of medical diagnostics.',
    },
    {
      title: 'Chapter II: The Midnight Brotherhood',
      duration: '02:50',
      synopsis: 'Endless study sessions, shared dinners, laughter over university chai, and solidarity through exams.',
    },
    {
      title: 'Epilogue: Bound for Eternity',
      duration: '02:15',
      synopsis: 'Looking ahead towards future hospitals, research laboratories, and an unbroken brotherhood.',
    },
  ];

  // Procedural Web Audio Ambient Soundtrack (Zero external mp3 / zero 404 dependencies)
  const toggleAmbientSoundtrack = () => {
    if (isAudioPlaying) {
      if (oscillatorNodeRef.current) {
        oscillatorNodeRef.current.stop();
        oscillatorNodeRef.current.disconnect();
        oscillatorNodeRef.current = null;
      }
      setIsAudioPlaying(false);
    } else {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioCtx();
        audioContextRef.current = ctx;

        // Gentle warm drone chord
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(196, ctx.currentTime); // G3 warm golden tone
        gain.gain.setValueAtTime(0.04, ctx.currentTime); // Soft subtle volume

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();

        oscillatorNodeRef.current = osc;
        setIsAudioPlaying(true);
      } catch (e) {
        console.error('AudioContext not supported', e);
      }
    }
  };

  const handleCloseModal = () => {
    if (oscillatorNodeRef.current) {
      oscillatorNodeRef.current.stop();
      oscillatorNodeRef.current.disconnect();
      oscillatorNodeRef.current = null;
    }
    setIsAudioPlaying(false);
    setFilmModalOpen(false);
  };

  return (
    <section
      id="story"
      aria-label="Our Story & Batch Film"
      className="relative w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#070D1C] border-t border-[#C8A45D]/15"
    >
      <div className="max-w-6xl mx-auto">
        {/* Story Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs tracking-[0.25em] uppercase font-semibold text-[#C8A45D] mb-2 font-cinzel">
            The Bond of FA23
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-cinzel font-bold text-[#F5F0E5] tracking-tight">
            Our Story & Heritage
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#E7D39B]/90 font-editorial italic max-w-2xl mx-auto leading-relaxed">
            “In the quiet hum of the laboratory centrifuges and the golden glow of the university lawns, twelve lives converged into an unwritten family.”
          </p>
        </div>

        {/* Narrative Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 text-sm">
          <div className="p-6 rounded-2xl bg-[#0B1530]/60 border border-[#C8A45D]/20">
            <div className="w-10 h-10 rounded-full border border-[#C8A45D]/40 bg-[#070D1C] flex items-center justify-center text-[#C8A45D] mb-4">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-cinzel font-bold text-[#F5F0E5] mb-2">
              The First Steps
            </h3>
            <p className="text-[#F5F0E5]/80 leading-relaxed text-xs sm:text-sm">
              We arrived as twelve distinct individuals with distinct backgrounds, carrying notebooks, aspirations, and the quiet nervousness of our first university semester. Soon, shared lectures turned into shared smiles, and shared difficulties turned into solidarity.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0B1530]/60 border border-[#C8A45D]/20">
            <div className="w-10 h-10 rounded-full border border-[#C8A45D]/40 bg-[#070D1C] flex items-center justify-center text-[#C8A45D] mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-cinzel font-bold text-[#F5F0E5] mb-2">
              Forged in the Lab
            </h3>
            <p className="text-[#F5F0E5]/80 leading-relaxed text-xs sm:text-sm">
              Between microtomes, blood film staining, spectrophotometer calibrations, and sudden oral viva exams, we discovered that pressure does not break true brothers—it seals them. Every triumph in the diagnostic wing was celebrated together.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0B1530]/60 border border-[#C8A45D]/20">
            <div className="w-10 h-10 rounded-full border border-[#C8A45D]/40 bg-[#070D1C] flex items-center justify-center text-[#C8A45D] mb-4">
              <Film className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-cinzel font-bold text-[#F5F0E5] mb-2">
              The Lasting Pact
            </h3>
            <p className="text-[#F5F0E5]/80 leading-relaxed text-xs sm:text-sm">
              Degrees will be awarded, careers will take flight across hospitals and diagnostic institutes, and geography will separate our steps. But the name MUST BS MLT BOYS FA23 will forever remain our unshakeable anchor.
            </p>
          </div>
        </div>

        {/* Cinematic Batch Film Banner Box */}
        <div className="relative rounded-3xl overflow-hidden border border-[#C8A45D]/40 bg-[#0B1530] shadow-2xl gold-box-glow">
          {/* Background image container with scrim */}
          <div className="relative aspect-[21/9] min-h-[300px] sm:min-h-[380px] w-full overflow-hidden">
            <img
              src={batchFilmCinematicImg}
              alt="Medical laboratory setting under warm golden cinematic lighting"
              loading="eager"
              decoding="async"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/assets/images/batch_film_cinematic_1792668356841.jpg';
              }}
              className="w-full h-full object-cover object-center brightness-75 scale-100 hover:scale-105 transition-transform duration-1000"
            />
            {/* Dark vignette scrims */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#070D1C] via-[#070D1C]/60 to-transparent" />
            <div className="absolute inset-0 bg-radial from-transparent via-[#070D1C]/40 to-[#070D1C]/90" />

            {/* Center Play Button & Title */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
              <button
                onClick={() => setFilmModalOpen(true)}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-[#C8A45D] bg-[#070D1C]/80 hover:bg-[#C8A45D] text-[#E7D39B] hover:text-[#070D1C] flex items-center justify-center transition-all duration-300 shadow-2xl group hover:scale-110 cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#C8A45D]/50 mb-4"
                aria-label="Play Batch Documentary Film Preview"
              >
                <Play className="w-8 h-8 sm:w-10 sm:h-10 ml-1 fill-current group-hover:scale-110 transition-transform" />
              </button>

              <div className="text-xs uppercase tracking-[0.3em] font-semibold text-[#C8A45D] font-cinzel">
                Official Documentary Preview
              </div>

              <h3 className="text-2xl sm:text-3xl md:text-4xl font-cinzel font-bold text-[#F5F0E5] tracking-wide mt-1">
                OUR LEGACY: The FA23 Chronicle
              </h3>

              <p className="text-xs sm:text-sm text-[#E7D39B]/80 font-editorial italic mt-2 max-w-lg">
                Click to open the cinematic film showcase player with chapter breakdown and director notes.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Batch Film Preview Player Modal */}
      {filmModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md"
          onClick={handleCloseModal}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-3xl bg-[#0B1530] border border-[#C8A45D]/50 rounded-2xl overflow-hidden text-[#F5F0E5] shadow-2xl gold-box-glow"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-[#C8A45D]/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Film className="w-5 h-5 text-[#C8A45D]" />
                <div>
                  <h4 className="text-base sm:text-lg font-cinzel font-bold text-[#F5F0E5]">
                    OUR LEGACY · Batch Film Showcase
                  </h4>
                  <div className="text-[11px] text-[#C8A45D] font-mono">
                    MUST BS MLT FA23 ARCHIVES
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleAmbientSoundtrack}
                  className="px-3 py-1.5 rounded-lg bg-[#070D1C] border border-[#C8A45D]/30 text-xs text-[#E7D39B] hover:text-white flex items-center gap-1.5 cursor-pointer"
                  title="Toggle procedural ambient soundtrack"
                >
                  {isAudioPlaying ? (
                    <>
                      <Volume2 className="w-4 h-4 text-[#C8A45D]" />
                      <span>Ambient Sound ON</span>
                    </>
                  ) : (
                    <>
                      <VolumeX className="w-4 h-4" />
                      <span>Ambient Sound OFF</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleCloseModal}
                  className="p-2 rounded-full text-[#E7D39B] hover:text-white hover:bg-white/5 cursor-pointer"
                  aria-label="Close film preview"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Video Player Simulator Screen */}
            <div className="relative aspect-video w-full bg-[#070D1C] overflow-hidden flex flex-col justify-between p-6">
              <img
                src={batchFilmCinematicImg}
                alt="Film preview frame"
                loading="eager"
                decoding="async"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/assets/images/batch_film_cinematic_1792668356841.jpg';
                }}
                className="absolute inset-0 w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070D1C] via-[#070D1C]/40 to-transparent" />

              <div className="relative z-10 flex justify-between items-start">
                <span className="text-[11px] font-mono uppercase bg-black/60 px-2.5 py-1 rounded border border-[#C8A45D]/40 text-[#E7D39B]">
                  CINEMATIC PREVIEW · 4K MASTER
                </span>
                <span className="text-[11px] font-mono text-[#C8A45D] bg-black/60 px-2 py-1 rounded">
                  09:40 TOTAL RUNTIME
                </span>
              </div>

              <div className="relative z-10 text-center py-6">
                <div className="w-16 h-16 rounded-full border border-[#C8A45D] bg-black/50 text-[#E7D39B] flex items-center justify-center mx-auto mb-3">
                  <Play className="w-7 h-7 ml-0.5" />
                </div>
                <div className="text-xl font-cinzel font-bold text-white">
                  {chapters[activeChapter].title}
                </div>
                <div className="text-xs text-[#E7D39B] font-editorial italic max-w-md mx-auto mt-1">
                  {chapters[activeChapter].synopsis}
                </div>
              </div>

              {/* Progress Bar Simulator */}
              <div className="relative z-10">
                <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#C8A45D] transition-all duration-300"
                    style={{ width: `${((activeChapter + 1) / chapters.length) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-[#E7D39B]/70 mt-1.5">
                  <span>Chapter {activeChapter + 1} of {chapters.length}</span>
                  <span>{chapters[activeChapter].duration}</span>
                </div>
              </div>
            </div>

            {/* Chapter Selection Strip */}
            <div className="p-4 sm:p-5 bg-[#0B1530] border-t border-[#C8A45D]/20">
              <div className="text-xs uppercase tracking-wider font-semibold text-[#C8A45D] mb-3 font-cinzel">
                Select Chapter Marker
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {chapters.map((ch, idx) => (
                  <button
                    key={ch.title}
                    onClick={() => setActiveChapter(idx)}
                    className={`p-2.5 rounded-lg text-left border transition-all cursor-pointer flex items-center justify-between text-xs ${
                      activeChapter === idx
                        ? 'bg-[#102047] border-[#C8A45D] text-[#F5F0E5]'
                        : 'bg-[#070D1C]/60 border-[#C8A45D]/20 text-[#E7D39B]/70 hover:text-white'
                    }`}
                  >
                    <div className="truncate mr-2">
                      <div className="font-semibold">{ch.title}</div>
                      <div className="text-[10px] text-[#A3B3D9]">{ch.duration}</div>
                    </div>
                    {activeChapter === idx && (
                      <span className="text-[10px] font-mono text-[#C8A45D]">ACTIVE</span>
                    )}
                  </button>
                ))}
              </div>

            </div>
          </div>
        </div>
      )}
    </section>
  );
};
