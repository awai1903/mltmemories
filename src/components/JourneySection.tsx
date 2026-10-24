import React, { useState } from 'react';
import { Clock, Edit3, Check, Calendar, Sparkles, BookOpen, Microscope, Coffee, Layers } from 'lucide-react';

interface Milestone {
  id: string;
  title: string;
  date: string;
  category: string;
  icon: 'begin' | 'study' | 'lab' | 'memories';
  summary: string;
  details: string;
  batchReflection: string;
  image: string;
}

const INITIAL_MILESTONES: Milestone[] = [
  {
    id: 'm1',
    title: 'University Beginnings',
    date: 'Fall 2023 · Orientation',
    category: 'The Inception',
    icon: 'begin',
    summary: 'The 12 of us gathered in the MUST lecture halls for the very first time.',
    details: 'Stepping onto the Mirpur University of Science and Technology campus as strangers from different towns and backgrounds. Receiving our white laboratory coats, discovering our roll numbers (FA23-MLT-001 through 051), and taking our seats as the boys of BS MLT.',
    batchReflection: 'The beginning of a bond that would grow stronger with every passing semester.',
    image: '/assets/images/hero_campus_night_1792668356137.jpg',
  },
  {
    id: 'm2',
    title: 'Learning Together',
    date: 'Spring 2024 · Foundation Terms',
    category: 'Academic Solidarity',
    icon: 'study',
    summary: 'Unraveling complex human anatomy, physiology, and early laboratory sciences.',
    details: 'Mastering biochemical pathways, memorizing Latin anatomical nomenclature, and cramming together in the university library before midterms. Sharing hand-written summaries, group quiz drills, and late-evening phone calls untangling tough questions.',
    batchReflection: 'No brother was ever left behind; if one passed, we all celebrated.',
    image: '/assets/images/batch_film_cinematic_1792668356841.jpg',
  },
  {
    id: 'm3',
    title: 'Lab & Practical Years',
    date: 'Ongoing Clinical Sessions',
    category: 'Hands-On Mastery',
    icon: 'lab',
    summary: 'Hours under the lenses: Hematology, Histopathology, and Microbiology benches.',
    details: 'The smell of Leishman stain, preparing blood smears, calibrating spectrophotometers, identifying bacterial colonies under oil immersion, and navigating high-pressure viva examinations under rigorous faculty supervision.',
    batchReflection: 'Turning theoretical knowledge into clinical instinct alongside true brothers.',
    image: '/boys-photos/FA23-MLT-004.jpg',
  },
  {
    id: 'm4',
    title: 'Memories That Stay',
    date: 'Present & Beyond',
    category: 'The Eternal Brotherhood',
    icon: 'memories',
    summary: 'The laughter in between experiments, cafeteria chai, and road trips.',
    details: 'Post-practical discussions over steaming cups of milk tea at the student cafeteria, friendly debates on cricket matches, impromptu campus photography sessions, and the unspoken pact that distance or time will never dim this fellowship.',
    batchReflection: 'We entered as classmates; we will always remain brothers.',
    image: '/group-photo.jpg',
  },
];

export const JourneySection: React.FC = () => {
  const [milestones, setMilestones] = useState<Milestone[]>(INITIAL_MILESTONES);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDateText, setEditDateText] = useState<string>('');

  const getIcon = (type: Milestone['icon']) => {
    switch (type) {
      case 'begin':
        return <BookOpen className="w-4 h-4 text-[#C8A45D]" />;
      case 'study':
        return <Sparkles className="w-4 h-4 text-[#C8A45D]" />;
      case 'lab':
        return <Microscope className="w-4 h-4 text-[#C8A45D]" />;
      case 'memories':
        return <Coffee className="w-4 h-4 text-[#C8A45D]" />;
    }
  };

  const handleStartEditDate = (e: React.MouseEvent, m: Milestone) => {
    e.stopPropagation();
    setEditingId(m.id);
    setEditDateText(m.date);
  };

  const handleSaveDate = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setMilestones((prev) =>
      prev.map((m) => (m.id === id ? { ...m, date: editDateText } : m))
    );
    setEditingId(null);
  };

  return (
    <section
      id="journey"
      aria-label="Our Journey Timeline"
      className="relative w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#0B1530]/40 border-t border-[#C8A45D]/15"
    >
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs tracking-[0.25em] uppercase font-semibold text-[#C8A45D] mb-2 font-cinzel">
            Chronicles of the FA23 Batch
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-cinzel font-bold text-[#F5F0E5] tracking-tight">
            Our Journey
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#E7D39B]/80 font-editorial italic max-w-xl mx-auto">
            A milestone journey from our first laboratory coat to enduring fraternity. Click any chapter to inspect notes and photographs.
          </p>
          <div className="mt-3 text-[11px] text-[#E7D39B]/60">
            * Sample timeline milestones. Milestone dates can be customized directly.
          </div>
        </div>

        {/* Timeline Container */}
        <div className="relative border-l-2 border-[#C8A45D]/30 ml-4 sm:ml-32 md:ml-40 space-y-12">
          {milestones.map((milestone) => (
            <div
              key={milestone.id}
              onClick={() => setSelectedMilestone(milestone)}
              className="relative pl-7 sm:pl-12 group cursor-pointer"
            >
              {/* Timeline Marker Circular Picture Frame */}
              <div className="absolute -left-[24px] sm:-left-[26px] top-1.5 w-12 h-12 rounded-full overflow-hidden border-2 border-[#C8A45D] bg-[#070D1C] flex items-center justify-center shadow-xl group-hover:scale-115 group-hover:border-[#E7D39B] transition-transform z-10 gold-box-glow">
                <img
                  src={milestone.image}
                  alt={milestone.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Floating mini icon badge */}
                <div className="absolute bottom-0 right-0 p-0.5 rounded-full bg-[#070D1C]/90 border border-[#C8A45D]">
                  {getIcon(milestone.icon)}
                </div>
              </div>

              {/* Side Date Label (Desktop) */}
              <div className="hidden sm:block absolute -left-36 md:-left-44 top-2 text-right w-28 md:w-36">
                {editingId === milestone.id ? (
                  <div className="flex items-center gap-1 justify-end" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="text"
                      value={editDateText}
                      onChange={(e) => setEditDateText(e.target.value)}
                      className="w-full text-xs bg-[#070D1C] border border-[#C8A45D] rounded px-1.5 py-0.5 text-[#F5F0E5] focus:outline-none"
                    />
                    <button
                      onClick={(e) => handleSaveDate(e, milestone.id)}
                      className="p-1 rounded bg-[#C8A45D] text-[#070D1C]"
                    >
                      <Check className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-end gap-1 text-xs font-mono font-medium text-[#C8A45D]">
                    <span>{milestone.date}</span>
                    <button
                      onClick={(e) => handleStartEditDate(e, milestone)}
                      className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-white transition-opacity"
                      title="Edit milestone date"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile Date Header */}
              <div className="sm:hidden flex items-center justify-between text-xs font-mono text-[#C8A45D] mb-1">
                <span>{milestone.date}</span>
                <span className="text-[10px] uppercase font-sans text-[#E7D39B]/60">{milestone.category}</span>
              </div>

              {/* Milestone Card with Circular Picture Frame */}
              <div className="p-5 sm:p-6 rounded-2xl bg-[#0B1530] border border-[#C8A45D]/25 group-hover:border-[#C8A45D]/70 transition-all duration-300 shadow-md group-hover:shadow-xl">
                <div className="flex items-center justify-between gap-4 mb-2">
                  <span className="hidden sm:inline-block text-xs uppercase tracking-widest font-semibold text-[#C8A45D]">
                    {milestone.category}
                  </span>
                  <span className="text-xs text-[#E7D39B]/70 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#C8A45D]" />
                    <span>Click to read chapter</span>
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 my-2">
                  {/* Prominent Circular Picture Frame */}
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-[#C8A45D]/70 bg-[#070D1C] overflow-hidden shrink-0 shadow-lg gold-box-glow group-hover:border-[#E7D39B] transition-all">
                    <img
                      src={milestone.image}
                      alt={milestone.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 rounded-full border border-[#D4AF37]/30 pointer-events-none" />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-xl sm:text-2xl font-cinzel font-bold text-[#F5F0E5] group-hover:text-[#E7D39B] transition-colors leading-snug">
                      {milestone.title}
                    </h3>
                    <p className="mt-1 text-sm text-[#E7D39B]/85 leading-relaxed font-editorial italic text-base">
                      {milestone.summary}
                    </p>
                  </div>
                </div>

                <p className="mt-3 text-xs sm:text-sm text-[#F5F0E5]/80 leading-relaxed">
                  {milestone.details}
                </p>

                <div className="mt-4 pt-3 border-t border-[#C8A45D]/15 text-xs text-[#C8A45D] italic font-serif flex items-center gap-2">
                  <Sparkles className="w-3 h-3 text-[#C8A45D] shrink-0" />
                  <span>"{milestone.batchReflection}"</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Milestone Modal */}
      {selectedMilestone && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedMilestone(null)}
        >
          <div
            className="w-full max-w-lg bg-[#0B1530] border border-[#C8A45D]/50 rounded-2xl p-6 sm:p-8 text-[#F5F0E5] shadow-2xl gold-box-glow"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Image Frame */}
            <div className="relative w-full h-44 rounded-xl overflow-hidden border border-[#C8A45D]/40 mb-4 shadow-inner">
              <img
                src={selectedMilestone.image}
                alt={selectedMilestone.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1530] via-transparent to-transparent" />
              <div className="absolute bottom-2 left-3 flex items-center gap-2 text-xs font-mono text-[#E7D39B] bg-[#070D1C]/80 px-2.5 py-1 rounded-md border border-[#C8A45D]/40 backdrop-blur-sm">
                <Calendar className="w-3.5 h-3.5 text-[#C8A45D]" />
                <span>{selectedMilestone.date}</span>
              </div>
            </div>

            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase tracking-wider text-[#E7D39B]/80 font-cinzel">
                {selectedMilestone.category}
              </span>
            </div>

            <h3 className="text-2xl font-cinzel font-bold text-[#F5F0E5] mb-3">
              {selectedMilestone.title}
            </h3>

            <p className="text-sm text-[#F5F0E5]/90 leading-relaxed mb-4">
              {selectedMilestone.details}
            </p>

            <div className="p-4 rounded-xl bg-[#070D1C]/80 border border-[#C8A45D]/20 mb-6">
              <div className="text-xs uppercase tracking-wider text-[#C8A45D] font-cinzel mb-1">
                Batch Memory Note
              </div>
              <p className="font-editorial italic text-base text-[#E7D39B]">
                "{selectedMilestone.batchReflection}"
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedMilestone(null)}
                className="px-5 py-2 text-xs font-semibold uppercase tracking-wider text-[#070D1C] bg-[#C8A45D] hover:bg-[#E7D39B] rounded-lg transition-colors cursor-pointer"
              >
                Close Milestone
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
