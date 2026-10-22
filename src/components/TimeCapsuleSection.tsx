import React, { useState } from 'react';
import { Lock, KeyRound, Sparkles, Send, CheckCircle2, X, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';
import timeCapsuleRelicImg from '../assets/images/time_capsule_relic_1792668357581.jpg';

export const TimeCapsuleSection: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [authorName, setAuthorName] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [message, setMessage] = useState('');
  const [unlockYear, setUnlockYear] = useState('2033');
  const [isSealed, setIsSealed] = useState(false);

  const handleSealMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSealed(true);
    // Golden confetti burst
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#C8A45D', '#E7D39B', '#FFFFFF'],
    });
  };

  const handleResetForm = () => {
    setIsSealed(false);
    setMessage('');
    setAuthorName('');
    setRollNo('');
  };

  return (
    <section
      id="capsule"
      aria-label="Future Time Capsule"
      className="relative w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#0B1530]/50 border-t border-[#C8A45D]/15 overflow-hidden"
    >
      {/* Background soft glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#C8A45D]/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Cinematic Capsule Relic Illustration */}
          <div className="relative flex flex-col items-center justify-center">
            <div className="relative w-full max-w-md aspect-square rounded-2xl overflow-hidden border border-[#C8A45D]/40 shadow-2xl gold-box-glow group">
              <img
                src={timeCapsuleRelicImg}
                alt="Sealed golden time capsule cylinder relic"
                loading="eager"
                decoding="async"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/assets/images/time_capsule_relic_1792668357581.jpg';
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070D1C]/90 via-transparent to-transparent" />
              
              {/* Overlay Badge */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-[#E7D39B]">
                <div className="flex items-center gap-1.5 font-mono">
                  <Lock className="w-3.5 h-3.5 text-[#C8A45D]" />
                  <span>SEALED RELIC · MUST FA23</span>
                </div>
                <div className="text-[11px] font-mono text-[#C8A45D]">
                  TARGET: +10 YEARS
                </div>
              </div>
            </div>

            <div className="mt-4 text-center">
              <span className="text-[11px] uppercase tracking-widest text-[#C8A45D] font-mono">
                Digital Heirloom Capsule · Vault Status: Ready
              </span>
            </div>
          </div>

          {/* Right: Copy & Action */}
          <div className="flex flex-col text-left">
            <div className="text-xs tracking-[0.25em] uppercase font-semibold text-[#C8A45D] mb-2 font-cinzel">
              Preserving Brotherhood Across Decades
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-cinzel font-bold text-[#F5F0E5] tracking-tight leading-tight">
              The Batch Time Capsule
            </h2>

            <p className="mt-4 text-base sm:text-lg text-[#E7D39B]/90 font-editorial italic leading-relaxed">
              “What will you say to the brothers who stood with you when years have passed and careers have unfolded?”
            </p>

            <p className="mt-4 text-xs sm:text-sm text-[#F5F0E5]/80 leading-relaxed">
              The Time Capsule is an archival concept created for the 12 boys of BS MLT to pen private messages, aspirations, and nostalgic promises to their future selves. Sealed under digital custody, it stands as an enduring pledge that university fellowship never fades.
            </p>

            <div className="mt-6 p-4 rounded-xl bg-[#070D1C]/60 border border-[#C8A45D]/25 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#C8A45D] font-cinzel">
                <KeyRound className="w-4 h-4" />
                <span>The 10-Year Reunion Protocol</span>
              </div>
              <p className="text-xs text-[#E7D39B]/70 leading-relaxed">
                Letters contributed in this frontend concept are structured to be unsealed at our future 10-year batch reunion. A digital reflection of who we are today and who we strive to become.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={() => setModalOpen(true)}
                className="px-6 py-3 text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#070D1C] bg-gradient-to-r from-[#C8A45D] to-[#E7D39B] hover:brightness-110 rounded-lg shadow-lg transition-all flex items-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#C8A45D]"
              >
                <Sparkles className="w-4 h-4" />
                <span>Explore The Time Capsule</span>
              </button>

              <span className="text-xs text-[#E7D39B]/60 italic font-editorial">
                * Frontend concept preview (no real messages stored)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Explore / Message Composer Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="w-full max-w-xl bg-[#0B1530] border border-[#C8A45D]/50 rounded-2xl p-6 sm:p-8 text-[#F5F0E5] shadow-2xl gold-box-glow"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#C8A45D]/20 mb-5">
              <div className="flex items-center gap-2 text-xs font-cinzel font-bold text-[#C8A45D] uppercase tracking-wider">
                <Clock className="w-4 h-4" />
                <span>Time Capsule Simulator</span>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-full text-[#E7D39B] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!isSealed ? (
              <form onSubmit={handleSealMessage} className="space-y-4">

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-cinzel text-[#C8A45D] mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder="e.g., Awais Sultan"
                      className="w-full px-3 py-2 rounded-lg bg-[#070D1C] border border-[#C8A45D]/30 text-xs text-[#F5F0E5] focus:outline-none focus:border-[#C8A45D]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-cinzel text-[#C8A45D] mb-1">
                      Roll Number
                    </label>
                    <input
                      type="text"
                      value={rollNo}
                      onChange={(e) => setRollNo(e.target.value)}
                      placeholder="e.g., FA23-MLT-017"
                      className="w-full px-3 py-2 rounded-lg bg-[#070D1C] border border-[#C8A45D]/30 text-xs text-[#F5F0E5] focus:outline-none focus:border-[#C8A45D]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-cinzel text-[#C8A45D] mb-1">
                    Unlock Year
                  </label>
                  <select
                    value={unlockYear}
                    onChange={(e) => setUnlockYear(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#070D1C] border border-[#C8A45D]/30 text-xs text-[#F5F0E5] focus:outline-none focus:border-[#C8A45D]"
                  >
                    <option value="2028">2028 · 5-Year Reunion</option>
                    <option value="2033">2033 · 10-Year Silver Milestone</option>
                    <option value="2043">2043 · 20-Year Golden Reunion</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-cinzel text-[#C8A45D] mb-1">
                    Message to Future Self & Brothers
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write a message, promise, or memory to be read 10 years from now..."
                    className="w-full px-3 py-2 rounded-lg bg-[#070D1C] border border-[#C8A45D]/30 text-xs text-[#F5F0E5] focus:outline-none focus:border-[#C8A45D] resize-none"
                    required
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 text-xs text-[#E7D39B]/70 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-semibold uppercase tracking-wider text-[#070D1C] bg-[#C8A45D] hover:bg-[#E7D39B] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Seal in Capsule</span>
                  </button>
                </div>
              </form>
            ) : (
              /* Success / Sealed State */
              <div className="py-6 text-center space-y-4 animate-in zoom-in-95 duration-200">
                <div className="w-16 h-16 rounded-full bg-[#070D1C] border-2 border-[#C8A45D] flex items-center justify-center mx-auto text-[#C8A45D] shadow-lg">
                  <CheckCircle2 className="w-8 h-8 text-[#C8A45D]" />
                </div>
                
                <h4 className="text-xl font-cinzel font-bold text-[#F5F0E5]">
                  Letter Digitally Sealed!
                </h4>

                <p className="text-xs text-[#E7D39B]/80 max-w-md mx-auto leading-relaxed">
                  Thank you, <span className="text-white font-semibold">{authorName || 'Brother'}</span> ({rollNo}). Your letter has been conceptually sealed in the MUST FA23 Batch Vault scheduled for unlock in <span className="text-[#C8A45D] font-bold">{unlockYear}</span>.
                </p>

                <div className="p-3 bg-[#070D1C] rounded-lg border border-[#C8A45D]/30 text-xs text-left italic font-editorial text-[#E7D39B]">
                  "{message}"
                </div>

                <div className="pt-3 flex justify-center gap-3">
                  <button
                    onClick={handleResetForm}
                    className="px-4 py-2 text-xs text-[#E7D39B] hover:text-white border border-[#C8A45D]/30 rounded-lg"
                  >
                    Draft Another Letter
                  </button>
                  <button
                    onClick={() => setModalOpen(false)}
                    className="px-5 py-2 text-xs font-semibold uppercase tracking-wider text-[#070D1C] bg-[#C8A45D] hover:bg-[#E7D39B] rounded-lg transition-colors cursor-pointer"
                  >
                    Close Capsule
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
