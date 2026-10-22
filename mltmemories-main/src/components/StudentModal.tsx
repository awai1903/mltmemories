import React, { useEffect } from 'react';
import { Student } from '../data/students';
import { StudentAvatar } from './StudentAvatar';
import { X, Award, Microscope, Quote, Sparkles, BookOpen } from 'lucide-react';

interface StudentModalProps {
  student: Student | null;
  onClose: () => void;
}

export const StudentModal: React.FC<StudentModalProps> = ({ student, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (student) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [student, onClose]);

  if (!student) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md transition-opacity duration-300"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="student-modal-title"
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0B1530] border border-[#C8A45D]/40 rounded-2xl shadow-2xl p-6 sm:p-8 text-[#F5F0E5] gold-box-glow"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top gold line accent */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-[#C8A45D] to-transparent" />

        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close profile modal"
          className="absolute top-5 right-5 p-2 rounded-full text-[#E7D39B]/70 hover:text-[#E7D39B] hover:bg-white/5 border border-transparent hover:border-[#C8A45D]/30 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#C8A45D]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-6 border-b border-[#C8A45D]/20">
          <StudentAvatar student={student} size="xl" className="shrink-0 ring-4 ring-[#C8A45D]/20" />
          
          <div className="text-center sm:text-left flex-1">
            <div className="text-xs tracking-widest uppercase font-semibold text-[#C8A45D] mb-1">
              MUST · FA23 · BS MLT
            </div>
            <h2 id="student-modal-title" className="text-2xl sm:text-3xl font-cinzel font-bold text-[#F5F0E5] tracking-wide">
              {student.name} <span className="font-editorial italic text-[#E7D39B] text-xl font-normal">"{student.nickname}"</span>
            </h2>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-1.5 text-xs text-[#E7D39B]/90 font-medium">
              <span className="font-mono text-[#C8A45D] bg-[#070D1C] px-2 py-0.5 rounded border border-[#C8A45D]/30">
                {student.rollNo}
              </span>
              <span aria-hidden="true" className="text-[#C8A45D]/50">·</span>
              <span>{student.batchRole}</span>
              <span aria-hidden="true" className="text-[#C8A45D]/50">·</span>
              <span className="text-[#C8A45D] font-cinzel">Class of 2027</span>
            </div>
            
            <p className="mt-2 text-xs text-[#E7D39B]/70 flex items-center justify-center sm:justify-start gap-1.5">
              <Microscope className="w-3.5 h-3.5 text-[#C8A45D]" />
              <span>{student.labStation}</span>
            </p>
          </div>
        </div>

        {/* Body Content */}
        <div className="py-6 space-y-6 text-sm">
          {/* Quote */}
          <div className="relative p-4 rounded-xl bg-[#070D1C]/60 border border-[#C8A45D]/20">
            <Quote className="absolute top-3 left-3 w-5 h-5 text-[#C8A45D]/30 -scale-x-100" />
            <blockquote className="pl-6 italic font-editorial text-base sm:text-lg text-[#E7D39B] leading-relaxed">
              "{student.favoriteQuote}"
            </blockquote>
          </div>

          {/* Bio */}
          <div>
            <h3 className="text-xs uppercase tracking-wider text-[#C8A45D] font-semibold flex items-center gap-1.5 mb-2 font-cinzel">
              <BookOpen className="w-3.5 h-3.5" />
              Batch Profile & Legacy
            </h3>
            <p className="text-[#F5F0E5]/90 leading-relaxed text-sm">
              {student.bio}
            </p>
          </div>

          {/* 2027 Farewell Statement */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-[#102047] to-[#0B1530] border border-[#C8A45D]/40">
            <h3 className="text-xs uppercase tracking-wider text-[#C8A45D] font-semibold flex items-center gap-1.5 mb-1.5 font-cinzel">
              <Sparkles className="w-3.5 h-3.5 text-[#C8A45D]" />
              Personal Farewell 2027 Reflection
            </h3>
            <p className="text-sm text-[#F5F0E5] font-editorial italic leading-relaxed">
              "{student.farewellNote2027}"
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-lg bg-[#070D1C]/40 border border-[#C8A45D]/20">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C8A45D] mb-1 font-cinzel">
                <Microscope className="w-3.5 h-3.5" />
                Focus Field
              </div>
              <div className="text-xs sm:text-sm text-[#F5F0E5]">
                {student.specialtyInterest}
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-[#070D1C]/40 border border-[#C8A45D]/20">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C8A45D] mb-1 font-cinzel">
                <Sparkles className="w-3.5 h-3.5" />
                Signature Trait
              </div>
              <div className="text-xs sm:text-sm text-[#F5F0E5]">
                {student.signatureTrait}
              </div>
            </div>
          </div>

          {/* Sample Data Disclaimer Note */}
          <div className="pt-2">
            <div className="p-3 rounded-lg bg-[#070D1C]/80 border border-[#C8A45D]/20 text-[11px] text-[#E7D39B]/70 flex items-start gap-2.5">
              <Award className="w-4 h-4 text-[#C8A45D] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-[#E7D39B]">Roster Profile Note:</span> Roll numbers and names are official batch records. Quotes, focus fields, and personal bios are sample archive placeholders ready to be updated with real personal statements and photographs in <code className="text-[#C8A45D]">public/boys-photos/{student.rollNo}.jpg</code>.
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="pt-4 border-t border-[#C8A45D]/20 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold tracking-wider uppercase text-[#070D1C] bg-gradient-to-r from-[#C8A45D] to-[#E7D39B] hover:brightness-110 rounded-lg transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-[#C8A45D] cursor-pointer"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};
