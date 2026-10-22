import React, { useState, useEffect, useId } from 'react';
import {
  Image as ImageIcon,
  Heart,
  Upload,
  Sparkles,
  X,
  PlusCircle,
  Users,
  MapPin,
  Calendar,
  Maximize2,
  Filter,
} from 'lucide-react';
import {
  MemoryItem,
  INITIAL_MEMORIES,
  getSavedMemories,
  saveMemories,
} from '../data/memories';
import { BATCH_STUDENTS } from '../data/students';
import confetti from 'canvas-confetti';

export const MemoryWallSection: React.FC = () => {
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedBrotherRoll, setSelectedBrotherRoll] = useState<string>('all');
  const [selectedMemory, setSelectedMemory] = useState<MemoryItem | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  // Form states for new memory upload
  const [formTitle, setFormTitle] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formCategory, setFormCategory] = useState<
    'Labs & Practicals' | 'Campus Life' | 'Hostel & Nights' | 'Brotherhood'
  >('Brotherhood');
  const [formDescription, setFormDescription] = useState('');
  const [formStory, setFormStory] = useState('');
  const [formTaggedRolls, setFormTaggedRolls] = useState<string[]>([]);
  const [formImageData, setFormImageData] = useState<string>('');

  const photoInputId = useId();

  // Load from localStorage on mount
  useEffect(() => {
    setMemories(getSavedMemories());
  }, []);

  const categories = [
    'All',
    'Labs & Practicals',
    'Campus Life',
    'Hostel & Nights',
    'Brotherhood',
  ];

  // Filtering
  const filteredMemories = memories.filter((m) => {
    const matchCategory =
      activeCategory === 'All' || m.category === activeCategory;
    const matchBrother =
      selectedBrotherRoll === 'all' ||
      m.taggedRolls.includes(selectedBrotherRoll);
    return matchCategory && matchBrother;
  });

  const handleLike = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = memories.map((m) =>
      m.id === id ? { ...m, likes: m.likes + 1 } : m
    );
    setMemories(updated);
    saveMemories(updated);
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setFormImageData(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleToggleTag = (roll: string) => {
    setFormTaggedRolls((prev) =>
      prev.includes(roll) ? prev.filter((r) => r !== roll) : [...prev, roll]
    );
  };

  const handleSelectAllBrothers = () => {
    if (formTaggedRolls.length === BATCH_STUDENTS.length) {
      setFormTaggedRolls([]);
    } else {
      setFormTaggedRolls(BATCH_STUDENTS.map((s) => s.rollNo));
    }
  };

  const handleSubmitMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const newMemory: MemoryItem = {
      id: `user-mem-${Date.now()}`,
      title: formTitle.trim(),
      location: formLocation.trim() || 'MUST Campus · Mirpur',
      date: formDate.trim() || 'FA23 Batch Memory',
      category: formCategory,
      description: formDescription.trim() || 'A cherished memory before 2027.',
      story: formStory.trim() || formDescription.trim(),
      taggedRolls:
        formTaggedRolls.length > 0
          ? formTaggedRolls
          : ['FA23-MLT-001', 'FA23-MLT-017'],
      likes: 1,
      imageUrl: formImageData || undefined,
      isUserAdded: true,
    };

    const updated = [newMemory, ...memories];
    setMemories(updated);
    saveMemories(updated);

    // Reset Form
    setFormTitle('');
    setFormLocation('');
    setFormDate('');
    setFormDescription('');
    setFormStory('');
    setFormTaggedRolls([]);
    setFormImageData('');
    setUploadModalOpen(false);

    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#C8A45D', '#E7D39B', '#FFFFFF'],
    });
  };

  const getStudentName = (roll: string) => {
    const s = BATCH_STUDENTS.find((st) => st.rollNo === roll);
    return s ? `${s.name} (${s.nickname})` : roll;
  };

  return (
    <section
      id="memories"
      aria-label="Batch Memories Scrapbook"
      className="relative w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#070D1C] border-t border-[#C8A45D]/20"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B1530] border border-[#C8A45D]/30 text-xs font-cinzel text-[#C8A45D] uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Class of 2023–2027 Archives</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-cinzel font-bold text-[#F5F0E5] tracking-tight">
            The Brotherhood Scrapbook
          </h2>

          <p className="mt-3 text-sm sm:text-base text-[#E7D39B]/90 font-editorial italic max-w-2xl mx-auto leading-relaxed">
            “Four years under the same roof. In 2027, our paths will branch out into hospitals and clinics. Every photograph here is a reminder of who was by our side.”
          </p>

          {/* Action to Add New Memory */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setUploadModalOpen(true)}
              className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#070D1C] bg-gradient-to-r from-[#C8A45D] to-[#E7D39B] hover:brightness-110 rounded-lg shadow-lg transition-all flex items-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#C8A45D]"
            >
              <Upload className="w-4 h-4" />
              <span>Add Memory / Photo to Wall</span>
            </button>
          </div>
        </div>

        {/* Filter Bar: Category & Brother Tag */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 bg-[#0B1530]/80 p-3 sm:p-4 rounded-2xl border border-[#C8A45D]/20">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 text-xs rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-[#C8A45D] text-[#070D1C] font-semibold shadow-sm'
                    : 'text-[#E7D39B]/80 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Filter by Specific Brother */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className="text-xs text-[#E7D39B]/70 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-[#C8A45D]" />
              Tag:
            </span>
            <select
              value={selectedBrotherRoll}
              onChange={(e) => setSelectedBrotherRoll(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-lg bg-[#070D1C] border border-[#C8A45D]/30 text-[#E7D39B] focus:outline-none focus:border-[#C8A45D]"
            >
              <option value="all">All 12 Brothers</option>
              {BATCH_STUDENTS.map((b) => (
                <option key={b.id} value={b.rollNo}>
                  {b.name} ({b.nickname})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Memories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMemories.map((mem) => (
            <div
              key={mem.id}
              onClick={() => setSelectedMemory(mem)}
              className="group relative bg-[#0B1530] border border-[#C8A45D]/30 hover:border-[#C8A45D] rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_0_30px_rgba(200,164,93,0.25)] cursor-pointer flex flex-col justify-between"
            >
              {/* Subtle Golden Lens Flare Sweeping Sheen */}
              <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden rounded-2xl">
                <div className="lens-flare-sheen absolute inset-0 w-[200%] h-full" />
              </div>

              {/* Photo Area with Anamorphic Lens Flare */}
              <div className="relative aspect-[16/10] w-full bg-[#070D1C] overflow-hidden flex items-center justify-center border-b border-[#C8A45D]/20">
                {mem.imageUrl ? (
                  <img
                    src={mem.imageUrl}
                    alt={mem.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-12 h-12 rounded-full border border-[#C8A45D]/40 bg-[#0B1530] flex items-center justify-center text-[#C8A45D] mb-2 group-hover:scale-110 transition-transform">
                      <ImageIcon className="w-6 h-6 opacity-75" />
                    </div>
                    <span className="text-[11px] font-cinzel font-semibold text-[#E7D39B]">
                      MUST FA23 MEMORY
                    </span>
                    <span className="text-[10px] text-[#A3B3D9] mt-0.5">
                      Click to read full story
                    </span>
                  </div>
                )}

                {/* Golden Lens Flare Optical Glint & Anamorphic Streak */}
                <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
                  {/* Soft Radial Gold Flare Bloom */}
                  <div className="w-24 h-24 rounded-full bg-radial from-[#FFE9B3]/35 via-[#C8A45D]/15 to-transparent blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  {/* Anamorphic Horizontal Golden Ray */}
                  <div className="absolute left-0 right-0 h-[1.5px] lens-flare-anamorphic scale-x-0 group-hover:scale-x-100 opacity-0 group-hover:opacity-90 transition-all duration-700 ease-out" />
                  {/* Core Star Glint */}
                  <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_12px_#FFE9B3] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Category Pill Tag */}
                <div className="absolute top-3 left-3 z-20 px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#070D1C]/90 text-[#C8A45D] border border-[#C8A45D]/30 backdrop-blur-sm">
                  {mem.category}
                </div>

                {/* Like Button */}
                <button
                  onClick={(e) => handleLike(e, mem.id)}
                  className="absolute top-3 right-3 z-20 px-2 py-1 rounded-full bg-[#070D1C]/90 text-[#E7D39B] hover:text-red-400 border border-[#C8A45D]/30 flex items-center gap-1 text-xs cursor-pointer focus:outline-none transition-colors backdrop-blur-sm"
                  title="Applaud memory"
                >
                  <Heart className="w-3.5 h-3.5 fill-current text-red-400/80" />
                  <span className="text-[11px] font-mono tabular-nums">{mem.likes}</span>
                </button>

                {/* Expand overlay hint on hover */}
                <div className="absolute inset-0 z-20 bg-[#070D1C]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <span className="px-3 py-1.5 rounded-lg bg-[#0B1530]/90 border border-[#C8A45D] text-xs font-semibold text-[#E7D39B] flex items-center gap-1.5 shadow-lg">
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>View Memory Story</span>
                  </span>
                </div>
              </div>

              {/* Content Info */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[11px] text-[#C8A45D] font-mono mb-1">
                    <Calendar className="w-3 h-3" />
                    <span>{mem.date}</span>
                  </div>

                  <h3 className="text-lg font-cinzel font-bold text-[#F5F0E5] group-hover:text-[#E7D39B] transition-colors line-clamp-2">
                    {mem.title}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-[#E7D39B]/70 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-[#C8A45D] shrink-0" />
                    <span className="truncate">{mem.location}</span>
                  </div>

                  <p className="mt-2.5 text-xs text-[#F5F0E5]/80 leading-relaxed font-editorial italic line-clamp-2">
                    "{mem.description}"
                  </p>
                </div>

                {/* Tagged Brothers Avatars */}
                <div className="mt-4 pt-3 border-t border-[#C8A45D]/15 flex items-center justify-between">
                  <div className="flex items-center -space-x-2 overflow-hidden">
                    {mem.taggedRolls.slice(0, 5).map((roll) => {
                      const student = BATCH_STUDENTS.find((s) => s.rollNo === roll);
                      return (
                        <div
                          key={roll}
                          title={student?.name || roll}
                          className="w-6 h-6 rounded-full border border-[#C8A45D] bg-[#070D1C] flex items-center justify-center text-[9px] font-bold text-[#E7D39B]"
                        >
                          {student?.initials || roll.slice(-2)}
                        </div>
                      );
                    })}
                    {mem.taggedRolls.length > 5 && (
                      <div className="w-6 h-6 rounded-full border border-[#C8A45D] bg-[#0B1530] flex items-center justify-center text-[9px] font-bold text-[#C8A45D]">
                        +{mem.taggedRolls.length - 5}
                      </div>
                    )}
                  </div>

                  <span className="text-[11px] font-mono text-[#C8A45D]">
                    {mem.taggedRolls.length} Brothers
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Memory Lightbox / Full Story Modal */}
      {selectedMemory && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md"
          onClick={() => setSelectedMemory(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0B1530] border border-[#C8A45D]/50 rounded-2xl p-6 sm:p-8 text-[#F5F0E5] shadow-2xl gold-box-glow"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#C8A45D]/20 mb-4">
              <span className="text-xs uppercase tracking-wider text-[#C8A45D] font-mono">
                {selectedMemory.category} · MUST FA23 Archive
              </span>
              <button
                onClick={() => setSelectedMemory(null)}
                className="p-1.5 rounded-full text-[#E7D39B] hover:text-white hover:bg-white/5 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* If user uploaded an image */}
            {selectedMemory.imageUrl && (
              <div className="w-full aspect-video rounded-xl overflow-hidden mb-4 border border-[#C8A45D]/30">
                <img
                  src={selectedMemory.imageUrl}
                  alt={selectedMemory.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3 text-xs text-[#E7D39B]/80 mb-2">
              <span className="flex items-center gap-1 font-mono text-[#C8A45D]">
                <Calendar className="w-3.5 h-3.5" />
                {selectedMemory.date}
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#C8A45D]" />
                {selectedMemory.location}
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-cinzel font-bold text-[#F5F0E5] mb-3">
              {selectedMemory.title}
            </h3>

            {/* Story */}
            <div className="p-4 rounded-xl bg-[#070D1C]/80 border border-[#C8A45D]/20 mb-5">
              <div className="text-xs uppercase tracking-wider text-[#C8A45D] font-cinzel mb-1">
                The Story & Campus Memory
              </div>
              <p className="text-sm sm:text-base text-[#F5F0E5]/95 leading-relaxed font-editorial italic">
                "{selectedMemory.story}"
              </p>
            </div>

            {/* Tagged Brothers */}
            <div className="mb-6">
              <div className="text-xs uppercase tracking-wider text-[#C8A45D] font-cinzel mb-2 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                <span>Brothers Tagged In This Memory</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedMemory.taggedRolls.map((roll) => (
                  <span
                    key={roll}
                    className="px-2.5 py-1 rounded-md bg-[#070D1C] border border-[#C8A45D]/30 text-xs text-[#E7D39B] font-medium"
                  >
                    {getStudentName(roll)}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#C8A45D]/20">
              <button
                onClick={(e) => handleLike(e, selectedMemory.id)}
                className="px-4 py-2 rounded-lg bg-[#070D1C] border border-[#C8A45D]/30 text-xs text-[#E7D39B] hover:text-red-400 flex items-center gap-2 cursor-pointer"
              >
                <Heart className="w-4 h-4 fill-current text-red-400" />
                <span>Applaud Memory ({selectedMemory.likes})</span>
              </button>

              <button
                onClick={() => setSelectedMemory(null)}
                className="px-5 py-2 text-xs font-semibold uppercase tracking-wider text-[#070D1C] bg-[#C8A45D] hover:bg-[#E7D39B] rounded-lg transition-colors cursor-pointer"
              >
                Close Memory
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload/Add Memory Modal */}
      {uploadModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md"
          onClick={() => setUploadModalOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-xl max-h-[90vh] overflow-y-auto bg-[#0B1530] border border-[#C8A45D]/50 rounded-2xl p-6 sm:p-8 text-[#F5F0E5] shadow-2xl gold-box-glow"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#C8A45D]/20 mb-5">
              <div className="flex items-center gap-2 text-xs font-cinzel font-bold text-[#C8A45D] uppercase tracking-wider">
                <PlusCircle className="w-4 h-4" />
                <span>Add A Batch Memory (2023–2027)</span>
              </div>
              <button
                onClick={() => setUploadModalOpen(false)}
                className="p-1.5 rounded-full text-[#E7D39B] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitMemory} className="space-y-4">
              <div>
                <label className="block text-xs font-cinzel text-[#C8A45D] mb-1">
                  Memory Title *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g., The Histology Slide Marathon before Viva"
                  className="w-full px-3 py-2 rounded-lg bg-[#070D1C] border border-[#C8A45D]/30 text-xs text-[#F5F0E5] focus:outline-none focus:border-[#C8A45D]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-cinzel text-[#C8A45D] mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    placeholder="e.g., MUST Microbiology Lab or Cafeteria"
                    className="w-full px-3 py-2 rounded-lg bg-[#070D1C] border border-[#C8A45D]/30 text-xs text-[#F5F0E5] focus:outline-none focus:border-[#C8A45D]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-cinzel text-[#C8A45D] mb-1">
                    Semester / Date
                  </label>
                  <input
                    type="text"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    placeholder="e.g., Semester 3 · Spring 2024"
                    className="w-full px-3 py-2 rounded-lg bg-[#070D1C] border border-[#C8A45D]/30 text-xs text-[#F5F0E5] focus:outline-none focus:border-[#C8A45D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-cinzel text-[#C8A45D] mb-1">
                  Category
                </label>
                <select
                  value={formCategory}
                  onChange={(e) =>
                    setFormCategory(
                      e.target.value as
                        | 'Labs & Practicals'
                        | 'Campus Life'
                        | 'Hostel & Nights'
                        | 'Brotherhood'
                    )
                  }
                  className="w-full px-3 py-2 rounded-lg bg-[#070D1C] border border-[#C8A45D]/30 text-xs text-[#F5F0E5] focus:outline-none focus:border-[#C8A45D]"
                >
                  <option value="Labs & Practicals">Labs & Practicals</option>
                  <option value="Campus Life">Campus Life</option>
                  <option value="Hostel & Nights">Hostel & Nights</option>
                  <option value="Brotherhood">Brotherhood</option>
                </select>
              </div>

              {/* Photo Upload from device */}
              <div>
                <label className="block text-xs font-cinzel text-[#C8A45D] mb-1">
                  Upload Photograph (Optional)
                </label>
                <div className="flex items-center gap-3">
                  <label
                    htmlFor={photoInputId}
                    className="px-4 py-2 rounded-lg bg-[#070D1C] border border-[#C8A45D]/40 text-xs text-[#E7D39B] hover:text-white hover:bg-[#C8A45D]/10 cursor-pointer flex items-center gap-2"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Choose File from Device</span>
                  </label>
                  <input
                    id={photoInputId}
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                  />
                  {formImageData && (
                    <span className="text-xs text-emerald-400 font-medium">
                      ✓ Photo attached
                    </span>
                  )}
                </div>
              </div>

              {/* Tag Brothers */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-cinzel text-[#C8A45D]">
                    Tag Brothers Present:
                  </label>
                  <button
                    type="button"
                    onClick={handleSelectAllBrothers}
                    className="text-[11px] text-[#C8A45D] hover:underline cursor-pointer"
                  >
                    {formTaggedRolls.length === BATCH_STUDENTS.length
                      ? 'Deselect All'
                      : 'Select All 12'}
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 p-2.5 rounded-lg bg-[#070D1C] border border-[#C8A45D]/20 max-h-36 overflow-y-auto">
                  {BATCH_STUDENTS.map((b) => (
                    <label
                      key={b.id}
                      className="flex items-center gap-1.5 text-[11px] text-[#E7D39B] cursor-pointer hover:text-white"
                    >
                      <input
                        type="checkbox"
                        checked={formTaggedRolls.includes(b.rollNo)}
                        onChange={() => handleToggleTag(b.rollNo)}
                        className="rounded border-[#C8A45D] text-[#C8A45D] focus:ring-0"
                      />
                      <span className="truncate">{b.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Story */}
              <div>
                <label className="block text-xs font-cinzel text-[#C8A45D] mb-1">
                  The Story & Memory Details *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formStory}
                  onChange={(e) => setFormStory(e.target.value)}
                  placeholder="Tell the story: what happened, what made everyone laugh or struggle together..."
                  className="w-full px-3 py-2 rounded-lg bg-[#070D1C] border border-[#C8A45D]/30 text-xs text-[#F5F0E5] focus:outline-none focus:border-[#C8A45D] resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="px-4 py-2 text-xs text-[#E7D39B]/70 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold uppercase tracking-wider text-[#070D1C] bg-[#C8A45D] hover:bg-[#E7D39B] rounded-lg transition-colors cursor-pointer"
                >
                  Save to Memory Wall
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
