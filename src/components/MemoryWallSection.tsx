import React, { useState } from 'react';
import { Image as ImageIcon, Heart, Upload, Sparkles, X, PlusCircle } from 'lucide-react';

interface MemoryTile {
  id: string;
  title: string;
  subtitle: string;
  category: 'Academics' | 'Campus Life' | 'Brotherhood';
  placeholderDesc: string;
  initialLikes: number;
  tags: string[];
}

const INITIAL_TILES: MemoryTile[] = [
  {
    id: 'mem-1',
    title: 'First Day at University',
    subtitle: 'MUST Department of MLT · Orientation Hall',
    category: 'Campus Life',
    placeholderDesc: 'Reserved for photographs of our first walk through the university gates, collecting identification badges, and the first group snapshot.',
    initialLikes: 12,
    tags: ['Orientation', 'WhiteCoats', 'FirstSteps'],
  },
  {
    id: 'mem-2',
    title: 'Practical Lab Memories',
    subtitle: 'Hematology, Pathology & Biochemistry Benches',
    category: 'Academics',
    placeholderDesc: 'Reserved for captures of microscope field views, staining racks, slide preparations, and focused moments behind clinical refractometers.',
    initialLikes: 19,
    tags: ['LabCoatVibes', 'Microscopy', 'LeishmanStain'],
  },
  {
    id: 'mem-3',
    title: 'Canteen Chronicles',
    subtitle: 'Student Cafeteria & Lawn Chai Circles',
    category: 'Brotherhood',
    placeholderDesc: 'Reserved for candid shots around the cafeteria tables, arguing over football and cricket, sharing samosas, and laughing between lectures.',
    initialLikes: 24,
    tags: ['ChaiTime', 'Laughter', 'CafeteriaStories'],
  },
  {
    id: 'mem-4',
    title: 'Friends & Laughter',
    subtitle: 'Unscripted Campus Moments & Hallway Banter',
    category: 'Brotherhood',
    placeholderDesc: 'Reserved for spontaneous photographs taken in university corridors, library stairwells, and outdoor sports grounds.',
    initialLikes: 16,
    tags: ['Brothers', 'Unbreakable', 'MUSTMemories'],
  },
  {
    id: 'mem-5',
    title: 'Exam Preparation',
    subtitle: 'Night Owls, Hand-Written Notes & Quick Quizzes',
    category: 'Academics',
    placeholderDesc: 'Reserved for late-evening study huddles, whiteboard diagrams, coffee mugs, and the triumphant high-fives as finals concluded.',
    initialLikes: 15,
    tags: ['Midterms', 'StudyGroup', 'AllNighter'],
  },
  {
    id: 'mem-6',
    title: 'University Events',
    subtitle: 'Seminars, Sports Galas & Batch Gatherings',
    category: 'Campus Life',
    placeholderDesc: 'Reserved for university symposium photos, annual sports day participation, batch dinners, and honorary guest lectures.',
    initialLikes: 21,
    tags: ['SportsGala', 'BatchGathering', 'Legacy'],
  },
];

export const MemoryWallSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [likes, setLikes] = useState<Record<string, number>>(() =>
    INITIAL_TILES.reduce((acc, t) => ({ ...acc, [t.id]: t.initialLikes }), {})
  );
  const [selectedTile, setSelectedTile] = useState<MemoryTile | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  const categories = ['All', 'Academics', 'Campus Life', 'Brotherhood'];

  const filteredTiles = INITIAL_TILES.filter(
    (t) => activeCategory === 'All' || t.category === activeCategory
  );

  const handleLike = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setLikes((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  return (
    <section
      id="memories"
      aria-label="Batch Memory Wall"
      className="relative w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#070D1C] border-t border-[#C8A45D]/15"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="text-xs tracking-[0.25em] uppercase font-semibold text-[#C8A45D] mb-2 font-cinzel">
            Visual Archive & Retrospectives
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-cinzel font-bold text-[#F5F0E5] tracking-tight">
            The Memory Wall
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#E7D39B]/80 font-editorial italic max-w-2xl mx-auto">
            A gallery designed to host our photographs, practical highlights, and campus banter. Click any memory frame to preview or learn how to contribute.
          </p>

          {/* Upload Button */}
          <div className="mt-5">
            <button
              onClick={() => setUploadModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0B1530] border border-[#C8A45D]/40 text-xs font-semibold uppercase tracking-wider text-[#E7D39B] hover:text-[#070D1C] hover:bg-[#C8A45D] transition-all cursor-pointer shadow-sm"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Contribute a Memory Photo</span>
            </button>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center justify-center gap-2 mb-10 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#C8A45D] text-[#070D1C] font-semibold shadow-sm'
                  : 'bg-[#0B1530] text-[#E7D39B]/80 hover:text-white border border-[#C8A45D]/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Tiles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTiles.map((tile) => (
            <div
              key={tile.id}
              onClick={() => setSelectedTile(tile)}
              className="group relative bg-[#0B1530] border border-[#C8A45D]/25 hover:border-[#C8A45D] rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl cursor-pointer flex flex-col justify-between"
            >
              {/* Image Frame Placeholder */}
              <div className="relative aspect-video w-full bg-[#070D1C] border-b border-[#C8A45D]/20 flex flex-col items-center justify-center p-6 text-center overflow-hidden">
                <div className="w-14 h-14 rounded-full border border-[#C8A45D]/40 bg-[#0B1530] flex items-center justify-center text-[#C8A45D] mb-3 group-hover:scale-110 transition-transform shadow-inner">
                  <ImageIcon className="w-6 h-6 opacity-80" />
                </div>
                <span className="text-xs font-semibold text-[#E7D39B] uppercase tracking-wider font-cinzel">
                  Future Photo Slot
                </span>
                <span className="text-[11px] text-[#A3B3D9]/70 mt-1">
                  Ready for real batch uploads
                </span>

                {/* Category Pill Tag */}
                <div className="absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#070D1C]/90 text-[#C8A45D] border border-[#C8A45D]/30">
                  {tile.category}
                </div>

                {/* Interactive Heart */}
                <button
                  onClick={(e) => handleLike(e, tile.id)}
                  className="absolute top-3 right-3 p-1.5 rounded-full bg-[#070D1C]/90 text-[#E7D39B] hover:text-red-400 border border-[#C8A45D]/30 flex items-center gap-1 text-xs cursor-pointer focus:outline-none transition-colors"
                  title="Applaud memory"
                >
                  <Heart className="w-3.5 h-3.5 fill-current text-red-400/80" />
                  <span className="text-[11px] font-mono tabular-nums">{likes[tile.id] || 0}</span>
                </button>
              </div>

              {/* Content Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-cinzel font-bold text-[#F5F0E5] group-hover:text-[#E7D39B] transition-colors">
                    {tile.title}
                  </h3>
                  <div className="text-xs text-[#C8A45D] font-medium mt-0.5">
                    {tile.subtitle}
                  </div>
                  <p className="mt-2.5 text-xs text-[#E7D39B]/70 leading-relaxed font-editorial italic text-sm">
                    {tile.placeholderDesc}
                  </p>
                </div>

                {/* Hashtags */}
                <div className="mt-4 pt-3 border-t border-[#C8A45D]/15 flex flex-wrap gap-1.5">
                  {tile.tags.map((tag) => (
                    <span key={tag} className="text-[10px] font-mono text-[#C8A45D]/80">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedTile && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedTile(null)}
        >
          <div
            className="w-full max-w-lg bg-[#0B1530] border border-[#C8A45D]/50 rounded-2xl p-6 sm:p-8 text-[#F5F0E5] shadow-2xl gold-box-glow"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#C8A45D]/20 mb-4">
              <span className="text-xs uppercase tracking-wider text-[#C8A45D] font-mono">
                {selectedTile.category} Archive Slot
              </span>
              <button
                onClick={() => setSelectedTile(null)}
                className="p-1 rounded-full text-[#E7D39B] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-video w-full rounded-xl bg-[#070D1C] border border-[#C8A45D]/30 flex flex-col items-center justify-center text-center p-6 mb-4">
              <ImageIcon className="w-10 h-10 text-[#C8A45D]/50 mb-2" />
              <div className="text-sm font-cinzel font-semibold text-[#E7D39B]">
                {selectedTile.title}
              </div>
              <p className="text-xs text-[#A3B3D9] mt-1 max-w-sm">
                In this frontend prototype, this card is ready to link high-resolution batch photos once uploaded.
              </p>
            </div>

            <h3 className="text-2xl font-cinzel font-bold text-[#F5F0E5] mb-1">
              {selectedTile.title}
            </h3>
            <div className="text-xs text-[#C8A45D] mb-3">{selectedTile.subtitle}</div>

            <p className="text-sm text-[#F5F0E5]/90 leading-relaxed mb-4">
              {selectedTile.placeholderDesc}
            </p>

            <div className="p-3.5 rounded-lg bg-[#070D1C] border border-[#C8A45D]/20 text-xs text-[#E7D39B]/80 mb-6 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-[#C8A45D] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white">How to add batch memories:</span> Place captured photos in <code className="text-[#C8A45D]">public/memories/</code> and link them in the memory array. Captions, student tags, and dates can be mapped directly.
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setSelectedTile(null)}
                className="px-5 py-2 text-xs font-semibold uppercase tracking-wider text-[#070D1C] bg-[#C8A45D] hover:bg-[#E7D39B] rounded-lg transition-colors cursor-pointer"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contribute/Upload Modal */}
      {uploadModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setUploadModalOpen(false)}
        >
          <div
            className="w-full max-w-md bg-[#0B1530] border border-[#C8A45D]/50 rounded-2xl p-6 text-[#F5F0E5] shadow-2xl gold-box-glow"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#C8A45D]/20 mb-4">
              <div className="flex items-center gap-2 text-xs font-cinzel font-bold text-[#C8A45D] uppercase tracking-wider">
                <PlusCircle className="w-4 h-4" />
                <span>Add Memory Photo</span>
              </div>
              <button
                onClick={() => setUploadModalOpen(false)}
                className="p-1 rounded-full text-[#E7D39B] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-[#F5F0E5]/90">
              <p className="leading-relaxed">
                This is a live frontend demonstration. In the production deployment, batch members can submit event snapshots, lab candids, and group selfies.
              </p>

              <div className="p-3 rounded-lg bg-[#070D1C] border border-[#C8A45D]/20 space-y-2">
                <div className="font-semibold text-[#E7D39B]">Photo Replacement Instructions:</div>
                <ul className="list-disc pl-4 space-y-1 text-[#E7D39B]/80">
                  <li>Photos can be added to the project's static assets.</li>
                  <li>Memory categories and dates can be registered in the data file.</li>
                  <li>Rebuild and redeploy with <code className="text-[#C8A45D]">npm run build</code>.</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setUploadModalOpen(false)}
                className="px-5 py-2 text-xs font-semibold uppercase tracking-wider text-[#070D1C] bg-[#C8A45D] hover:bg-[#E7D39B] rounded-lg transition-colors cursor-pointer"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
