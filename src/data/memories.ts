export interface MemoryItem {
  id: string;
  title: string;
  location: string;
  date: string;
  category: 'Labs & Practicals' | 'Campus Life' | 'Hostel & Nights' | 'Brotherhood';
  description: string;
  story: string;
  taggedRolls: string[];
  likes: number;
  imageUrl?: string;
  isUserAdded?: boolean;
}

export const INITIAL_MEMORIES: MemoryItem[] = [
  {
    id: 'mem-1',
    title: 'The First Blood Film & Microscope Calibration',
    location: 'Hematology Lab Bench 3 · MUST Campus',
    date: 'Semester 1 · Fall 2023',
    category: 'Labs & Practicals',
    description: 'When all 12 of us stood around the oil immersion lenses trying to spot our first eosinophil without breaking the coverslip.',
    story: 'Nobody forgets their first blood smear. Hands trembling with the spreader slide, Leishman stain spilling onto white lab coats, and our teacher walking up to inspect. We spent two hours arguing whether a cell was a monocyte or a large lymphocyte. We laughed until our sides hurt.',
    taggedRolls: ['FA23-MLT-001', 'FA23-MLT-004', 'FA23-MLT-017', 'FA23-MLT-019'],
    likes: 34,
  },
  {
    id: 'mem-2',
    title: 'The Rain, MUST Admin Lawns & Cafeteria Chai',
    location: 'Student Cafeteria & Central Lawn',
    date: 'Spring 2024',
    category: 'Campus Life',
    description: 'Post-lecture downpour that canceled the 2 PM microbiology session, turning into a 3-hour chai marathon.',
    story: 'It started pouring over the Mirpur hills. Instead of heading to the library, all 12 of us huddled under the cafeteria canopy. Someone ordered 12 cups of hot doodh-patti and samosas. We spoke about where we would all be in 2027 and vowed never to lose touch.',
    taggedRolls: ['FA23-MLT-003', 'FA23-MLT-006', 'FA23-MLT-041', 'FA23-MLT-050'],
    likes: 48,
  },
  {
    id: 'mem-3',
    title: 'The Legendary Histopathology Viva Survival',
    location: 'Department Examination Hall',
    date: 'Semester 2 Finals',
    category: 'Labs & Practicals',
    description: 'Surviving rapid-fire slide identification where every second determined our semester GPA.',
    story: 'Outside the viva room, the tension was thick enough to cut with a microtome blade. Arslan was handing out last-minute formula sheets, Tayyab was delivering motivational speeches, and Moiz was keeping everyone calm. When the last brother stepped out smiling, we celebrated like we had won the World Cup.',
    taggedRolls: ['FA23-MLT-015', 'FA23-MLT-030', 'FA23-MLT-039', 'FA23-MLT-051'],
    likes: 42,
  },
  {
    id: 'mem-4',
    title: 'Hostel Midnight Marathons & Exam Cramming',
    location: 'Mirpur Boys Hostel Room 14',
    date: 'Midterm Week 2024',
    category: 'Hostel & Nights',
    description: 'Whiteboard covered in metabolic pathways, 4 AM instant noodles, and testing each other on clinical biochemistry.',
    story: 'The night before the biochemistry paper. Two whiteboards, four laptops, and tea cups stacked like pyramids. Whenever someone began dozing off, Ahmed Khurshid would crack a joke or put on a dramatic lecture recap. Those 4 AM talks are what true brotherhood is made of.',
    taggedRolls: ['FA23-MLT-001', 'FA23-MLT-006', 'FA23-MLT-017', 'FA23-MLT-050'],
    likes: 56,
  },
  {
    id: 'mem-5',
    title: 'The Great Spectrophotometer Incident',
    location: 'Biochemistry Core Lab',
    date: 'Clinical Enzymology Session',
    category: 'Labs & Practicals',
    description: 'A faulty cuvette reading that had the entire batch recalculating Beer-Lambert laws for three hours.',
    story: 'The absorbance read 2.99 and nobody knew why until Moiz noticed the cuvette was placed backwards. That day became a running inside joke: "Always check your blanks before questioning your destiny."',
    taggedRolls: ['FA23-MLT-003', 'FA23-MLT-004', 'FA23-MLT-030'],
    likes: 29,
  },
  {
    id: 'mem-6',
    title: 'The Oath of 2027: Bound Forever',
    location: 'MUST University Sunset Terrace',
    date: 'Batch Evening Gathering',
    category: 'Brotherhood',
    description: 'Realizing our time here is limited, and promising that graduation in 2027 is merely the commencement of our lifelong bond.',
    story: 'Standing by the terrace overlooking the Mirpur sunset, someone said: "Only a few years left until 2027, boys. Let us make every single day count." We put our hands in the middle. 12 brothers, 1 destiny.',
    taggedRolls: [
      'FA23-MLT-001',
      'FA23-MLT-003',
      'FA23-MLT-004',
      'FA23-MLT-006',
      'FA23-MLT-015',
      'FA23-MLT-017',
      'FA23-MLT-019',
      'FA23-MLT-030',
      'FA23-MLT-039',
      'FA23-MLT-041',
      'FA23-MLT-050',
      'FA23-MLT-051',
    ],
    likes: 67,
  },
];

const STORAGE_KEY = 'must_mlt_batch_memories_v1';

export const getSavedMemories = (): MemoryItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_MEMORIES;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_MEMORIES;
  } catch {
    return INITIAL_MEMORIES;
  }
};

export const saveMemories = (memories: MemoryItem[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memories));
  } catch (e) {
    console.error('Failed to save memories to localStorage', e);
  }
};
