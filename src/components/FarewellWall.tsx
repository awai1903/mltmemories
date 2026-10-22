import React, { useState, useEffect } from 'react';
import { BATCH_STUDENTS, Student } from '../data/students';
import { StudentAvatar } from './StudentAvatar';
import { Heart, MessageSquare, Send, Sparkles, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

interface FarewellNote {
  id: string;
  authorName: string;
  authorRole: string;
  note: string;
  timestamp: string;
  likes: number;
}

const INITIAL_NOTES: FarewellNote[] = [
  {
    id: 'note-1',
    authorName: 'Awais Sultan',
    authorRole: 'FA23-MLT-017 · Tech Architect',
    note: 'Brothers, when 2027 arrives and we toss our graduation caps, look back at this website. We spent the best four years of our youth together at MUST. Never forget where we started.',
    timestamp: 'Permanent Archive',
    likes: 45,
  },
  {
    id: 'note-2',
    authorName: 'Adil Javed',
    authorRole: 'FA23-MLT-001 · The Captain',
    note: 'To all 11 brothers: leading practicals and presentations alongside you has been my greatest pride. In 2027, we go out into the world as leaders in healthcare.',
    timestamp: 'Permanent Archive',
    likes: 38,
  },
  {
    id: 'note-3',
    authorName: 'Tayyab Ali Khan',
    authorRole: 'FA23-MLT-041 · Morale Officer',
    note: 'Class of 2027! Promise me that no matter which city or hospital we end up in, we will have our annual reunion dinner. The laughter in the cafeteria must never die.',
    timestamp: 'Permanent Archive',
    likes: 42,
  },
  {
    id: 'note-4',
    authorName: 'Abdul Moiz',
    authorRole: 'FA23-MLT-003 · The Anchor',
    note: 'Thank you for standing by me through every midterm stress and grueling practical viva. 2027 is our finish line, but our brotherhood is eternal.',
    timestamp: 'Permanent Archive',
    likes: 36,
  },
];

const FAREWELL_STORAGE_KEY = 'must_mlt_farewell_notes_v1';

export const FarewellWall: React.FC<{ onSelectStudent: (student: Student) => void }> = ({
  onSelectStudent,
}) => {
  const [notes, setNotes] = useState<FarewellNote[]>(() => {
    try {
      const raw = localStorage.getItem(FAREWELL_STORAGE_KEY);
      return raw ? JSON.parse(raw) : INITIAL_NOTES;
    } catch {
      return INITIAL_NOTES;
    }
  });

  const [authorName, setAuthorName] = useState('');
  const [authorRole, setAuthorRole] = useState('');
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'roster-notes' | 'guestbook'>('roster-notes');

  useEffect(() => {
    try {
      localStorage.setItem(FAREWELL_STORAGE_KEY, JSON.stringify(notes));
    } catch (e) {
      console.error(e);
    }
  }, [notes]);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !authorName.trim()) return;

    const newNote: FarewellNote = {
      id: `farewell-${Date.now()}`,
      authorName: authorName.trim(),
      authorRole: authorRole.trim() || 'FA23 BS MLT Brother',
      note: message.trim(),
      timestamp: 'Just now',
      likes: 1,
    };

    setNotes([newNote, ...notes]);
    setAuthorName('');
    setAuthorRole('');
    setMessage('');

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#C8A45D', '#E7D39B', '#FFFFFF'],
    });
  };

  const handleLikeNote = (id: string) => {
    setNotes(notes.map((n) => (n.id === id ? { ...n, likes: n.likes + 1 } : n)));
  };

  return (
    <section
      id="farewell"
      aria-label="2027 Farewell & Brotherhood Wall"
      className="relative w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[var(--bg-secondary)]/60 border-t border-[var(--border-gold)] transition-colors duration-400"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#070D1C] border border-[#C8A45D]/30 text-xs font-cinzel text-[#C8A45D] uppercase tracking-widest mb-3">
            <Award className="w-3.5 h-3.5" />
            <span>Class of 2027 Convocation Pledge</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-cinzel font-bold text-[#F5F0E5] tracking-tight">
            Farewell 2027: The Brotherhood Wall
          </h2>

          <p className="mt-3 text-sm sm:text-base text-[#E7D39B]/90 font-editorial italic max-w-2xl mx-auto leading-relaxed">
            “In 2027, our laboratory coats will be hung and degrees awarded. Here are the promises and farewell words of the 12 brothers before our paths diverge.”
          </p>

          {/* Toggle between 12 Brothers Notes and Open Board */}
          <div className="mt-6 inline-flex p-1 bg-[#070D1C] rounded-xl border border-[#C8A45D]/30 text-xs font-medium">
            <button
              onClick={() => setActiveTab('roster-notes')}
              className={`px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'roster-notes'
                  ? 'bg-[#C8A45D] text-[#070D1C] font-semibold'
                  : 'text-[#E7D39B]/80 hover:text-white'
              }`}
            >
              The 12 Brothers Farewell Statements
            </button>
            <button
              onClick={() => setActiveTab('guestbook')}
              className={`px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'guestbook'
                  ? 'bg-[#C8A45D] text-[#070D1C] font-semibold'
                  : 'text-[#E7D39B]/80 hover:text-white'
              }`}
            >
              Post a 2027 Farewell Message ({notes.length})
            </button>
          </div>
        </div>

        {activeTab === 'roster-notes' ? (
          /* Grid of all 12 brothers' personal farewell 2027 quotes */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BATCH_STUDENTS.map((student) => (
              <div
                key={student.id}
                onClick={() => onSelectStudent(student)}
                className="group relative bg-[#0B1530] border border-[#C8A45D]/25 hover:border-[#C8A45D] rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <StudentAvatar student={student} size="md" />
                    <div>
                      <div className="text-xs font-mono text-[#C8A45D]">
                        {student.rollNo}
                      </div>
                      <h4 className="text-base font-cinzel font-bold text-[#F5F0E5] group-hover:text-[#E7D39B] transition-colors">
                        {student.name}
                      </h4>
                      <div className="text-[11px] text-[#E7D39B]/70">
                        "{student.nickname}" · {student.batchRole}
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#070D1C]/80 border border-[#C8A45D]/20">
                    <span className="text-[10px] uppercase tracking-wider font-cinzel text-[#C8A45D] block mb-1">
                      Farewell 2027 Reflection:
                    </span>
                    <p className="text-xs sm:text-sm text-[#F5F0E5]/90 font-editorial italic leading-relaxed">
                      "{student.farewellNote2027}"
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-2 text-right">
                  <span className="text-[11px] text-[#C8A45D] font-cinzel group-hover:underline">
                    View Complete Roster Profile →
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Interactive Guestbook & Message Form */
          <div className="space-y-8 max-w-4xl mx-auto">
            {/* New Message Form */}
            <div className="bg-[#070D1C] border border-[#C8A45D]/40 rounded-2xl p-6 shadow-xl gold-box-glow">
              <h3 className="text-lg font-cinzel font-bold text-[#F5F0E5] mb-2 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#C8A45D]" />
                <span>Leave a Farewell Message for the Class of 2027</span>
              </h3>
              <p className="text-xs text-[#E7D39B]/70 mb-4 font-editorial italic">
                Pen down a heartfelt memory, advice, or promise to be cherished as we count down to our graduation in 2027.
              </p>

              <form onSubmit={handleAddNote} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-cinzel text-[#C8A45D] mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder="e.g., Awais Sultan"
                      className="w-full px-3 py-2 rounded-lg bg-[#0B1530] border border-[#C8A45D]/30 text-xs text-[#F5F0E5] focus:outline-none focus:border-[#C8A45D]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-cinzel text-[#C8A45D] mb-1">
                      Batch Role / Roll No
                    </label>
                    <input
                      type="text"
                      value={authorRole}
                      onChange={(e) => setAuthorRole(e.target.value)}
                      placeholder="e.g., FA23-MLT-017 or Brother"
                      className="w-full px-3 py-2 rounded-lg bg-[#0B1530] border border-[#C8A45D]/30 text-xs text-[#F5F0E5] focus:outline-none focus:border-[#C8A45D]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-cinzel text-[#C8A45D] mb-1">
                    Farewell Message / Brotherhood Note *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your words to the boys before 2027..."
                    className="w-full px-3 py-2 rounded-lg bg-[#0B1530] border border-[#C8A45D]/30 text-xs text-[#F5F0E5] focus:outline-none focus:border-[#C8A45D] resize-none"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#070D1C] bg-gradient-to-r from-[#C8A45D] to-[#E7D39B] hover:brightness-110 rounded-lg shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Post Message to Wall</span>
                  </button>
                </div>
              </form>
            </div>

            {/* List of Posted Notes */}
            <div className="space-y-4">
              {notes.map((n) => (
                <div
                  key={n.id}
                  className="p-5 rounded-2xl bg-[#0B1530] border border-[#C8A45D]/25 flex flex-col sm:flex-row items-start justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-cinzel font-bold text-[#F5F0E5]">
                        {n.authorName}
                      </span>
                      <span aria-hidden="true" className="text-[#C8A45D]/60">·</span>
                      <span className="font-mono text-[#C8A45D] text-[11px]">
                        {n.authorRole}
                      </span>
                      <span aria-hidden="true" className="text-[#C8A45D]/60">·</span>
                      <span className="text-[11px] text-[#E7D39B]/60">
                        {n.timestamp}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-[#F5F0E5]/90 font-editorial italic leading-relaxed">
                      "{n.note}"
                    </p>
                  </div>

                  <button
                    onClick={() => handleLikeNote(n.id)}
                    className="px-3 py-1.5 rounded-full bg-[#070D1C] border border-[#C8A45D]/30 text-xs text-[#E7D39B] hover:text-red-400 flex items-center gap-1.5 shrink-0 cursor-pointer"
                  >
                    <Heart className="w-3.5 h-3.5 fill-current text-red-400/80" />
                    <span className="font-mono tabular-nums">{n.likes}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
