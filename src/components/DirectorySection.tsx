import React, { useState, useMemo } from 'react';
import { BATCH_STUDENTS, Student } from '../data/students';
import { StudentAvatar } from './StudentAvatar';
import { Search, ArrowUpDown, ArrowRight, UserX } from 'lucide-react';

interface DirectorySectionProps {
  onSelectStudent: (student: Student) => void;
}

export const DirectorySection: React.FC<DirectorySectionProps> = ({ onSelectStudent }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'roll' | 'name'>('roll');

  const filteredStudents = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const result = BATCH_STUDENTS.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.rollNo.toLowerCase().includes(q) ||
        s.batchRole.toLowerCase().includes(q) ||
        s.specialtyInterest.toLowerCase().includes(q)
    );

    if (sortBy === 'name') {
      return [...result].sort((a, b) => a.name.localeCompare(b.name));
    }
    return result; // default order in students.ts is by roll number
  }, [searchQuery, sortBy]);

  return (
    <section
      id="directory"
      aria-label="Student Roster Directory"
      className="relative w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[var(--bg-primary)] border-t border-[var(--border-gold)] transition-colors duration-400"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="text-xs tracking-[0.25em] uppercase font-semibold text-[#C8A45D] mb-2 font-cinzel">
            Official Batch Roster
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-cinzel font-bold text-[#F5F0E5] tracking-tight">
            The 12 Brothers Directory
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#E7D39B]/80 font-editorial italic max-w-2xl mx-auto">
            12 distinctive paths united in medical laboratory science. Search through the roster to discover roles, specialties, and batch memories.
          </p>

        </div>

        {/* Search & Sort Controls Bar */}
        <div className="w-full max-w-2xl mx-auto mb-10 flex flex-col sm:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C8A45D]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by student name or roll no (e.g., 001, Adil, Awais)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0B1530] border border-[#C8A45D]/30 text-sm text-[#F5F0E5] placeholder-[#E7D39B]/40 focus:outline-none focus:border-[#C8A45D] focus:ring-1 focus:ring-[#C8A45D] transition-all"
              aria-label="Search students by name or roll number"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#E7D39B]/60 hover:text-[#E7D39B]"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sort Toggle */}
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            <span className="text-xs text-[#E7D39B]/70 flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#C8A45D]" />
              Sort:
            </span>
            <div className="flex items-center p-1 bg-[#0B1530] rounded-lg border border-[#C8A45D]/30 text-xs">
              <button
                onClick={() => setSortBy('roll')}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  sortBy === 'roll'
                    ? 'bg-[#C8A45D] text-[#070D1C] font-semibold'
                    : 'text-[#E7D39B]/80 hover:text-white'
                }`}
              >
                Roll No
              </button>
              <button
                onClick={() => setSortBy('name')}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  sortBy === 'name'
                    ? 'bg-[#C8A45D] text-[#070D1C] font-semibold'
                    : 'text-[#E7D39B]/80 hover:text-white'
                }`}
              >
                Alphabetical
              </button>
            </div>
          </div>
        </div>

        {/* Directory Grid (3-in-a-row on desktop matching the portfolio guidelines) */}
        {filteredStudents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((student) => (
              <div
                key={student.id}
                onClick={() => onSelectStudent(student)}
                className="group relative bg-[#0B1530]/80 hover:bg-[#102047] border border-[#C8A45D]/25 hover:border-[#C8A45D]/80 rounded-2xl p-6 transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
              >
                {/* Top Corner Badge Accent */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <StudentAvatar
                    student={student}
                    size="lg"
                    className="group-hover:scale-105 transition-transform"
                  />
                  <div className="text-right">
                    <span className="font-mono text-xs font-semibold text-[#C8A45D] bg-[#070D1C] px-2.5 py-1 rounded-md border border-[#C8A45D]/30 inline-block">
                      {student.rollNo}
                    </span>
                    <div className="text-[11px] text-[#E7D39B]/60 mt-1">
                      {student.labStation}
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="mb-4">
                  <h3 className="text-xl font-cinzel font-bold text-[#F5F0E5] group-hover:text-[#E7D39B] transition-colors">
                    {student.name}
                  </h3>
                  <div className="text-xs text-[#C8A45D] font-medium mt-0.5">
                    {student.batchRole}
                  </div>
                  <p className="text-xs text-[#E7D39B]/70 mt-2.5 line-clamp-2 leading-relaxed">
                    "{student.favoriteQuote}"
                  </p>
                </div>

                {/* Footer bar */}
                <div className="pt-3 border-t border-[#C8A45D]/15 flex items-center justify-between text-xs text-[#E7D39B]/80">
                  <span className="text-[11px] truncate max-w-[200px] text-[#A3B3D9]">
                    {student.specialtyInterest}
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-[#C8A45D] group-hover:translate-x-1 transition-transform">
                    <span>Profile</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="w-full max-w-md mx-auto py-12 px-6 text-center bg-[#0B1530]/60 border border-[#C8A45D]/20 rounded-2xl">
            <UserX className="w-10 h-10 text-[#C8A45D]/60 mx-auto mb-3" />
            <h3 className="text-lg font-cinzel font-bold text-[#F5F0E5]">
              No Student Found
            </h3>
            <p className="text-xs text-[#E7D39B]/70 mt-1 mb-4">
              We couldn't find anyone matching "{searchQuery}". Try searching for roll number (e.g. 017) or first name.
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="px-4 py-2 text-xs font-semibold text-[#070D1C] bg-[#C8A45D] hover:bg-[#E7D39B] rounded-lg transition-colors cursor-pointer"
            >
              Reset Search Filter
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
