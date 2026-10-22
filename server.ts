import express from 'express';
import type { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Ensure data persistence directory exists
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const MEMORIES_FILE = path.join(DATA_DIR, 'memories.json');
const FAREWELL_FILE = path.join(DATA_DIR, 'farewell-notes.json');

// Helper to read JSON data safely
function readJsonFile<T>(filePath: string, defaultData: T): T {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(content) as T;
    }
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
  }
  return defaultData;
}

// Helper to write JSON data safely
function writeJsonFile<T>(filePath: string, data: T): void {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
  }
}

// Initial fallback memories
const INITIAL_MEMORIES = [
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

const INITIAL_FAREWELL_NOTES = [
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

// Initialize data if not already present
if (!fs.existsSync(MEMORIES_FILE)) {
  writeJsonFile(MEMORIES_FILE, INITIAL_MEMORIES);
}
if (!fs.existsSync(FAREWELL_FILE)) {
  writeJsonFile(FAREWELL_FILE, INITIAL_FAREWELL_NOTES);
}

// Middleware
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// REST API Endpoints
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    batch: 'MUST BS MLT BOYS (FA23 – 2027)',
    service: 'Full-Stack Free Tier Cloud Backend',
    uptimeSeconds: Math.floor(process.uptime()),
  });
});

// GET all memories
app.get('/api/memories', (_req: Request, res: Response) => {
  const memories = readJsonFile(MEMORIES_FILE, INITIAL_MEMORIES);
  res.json(memories);
});

// POST new memory
app.post('/api/memories', (req: Request, res: Response) => {
  const { title, location, date, category, description, story, taggedRolls, imageUrl } = req.body;
  if (!title) {
    res.status(400).json({ error: 'Title is required' });
    return;
  }

  const memories = readJsonFile(MEMORIES_FILE, INITIAL_MEMORIES);
  const newMemory = {
    id: `mem-${Date.now()}`,
    title: String(title).trim(),
    location: location ? String(location).trim() : 'MUST Campus · Mirpur',
    date: date ? String(date).trim() : 'Class of 2027 Memory',
    category: category || 'Brotherhood',
    description: description ? String(description).trim() : '',
    story: story ? String(story).trim() : String(description || '').trim(),
    taggedRolls: Array.isArray(taggedRolls) ? taggedRolls : [],
    imageUrl: imageUrl || undefined,
    likes: 1,
    isUserAdded: true,
  };

  memories.unshift(newMemory);
  writeJsonFile(MEMORIES_FILE, memories);
  res.status(201).json(newMemory);
});

// POST like a memory
app.post('/api/memories/:id/like', (req: Request, res: Response) => {
  const { id } = req.params;
  const memories = readJsonFile(MEMORIES_FILE, INITIAL_MEMORIES);
  const item = memories.find((m) => m.id === id);
  if (item) {
    item.likes = (item.likes || 0) + 1;
    writeJsonFile(MEMORIES_FILE, memories);
    res.json({ id, likes: item.likes });
  } else {
    res.status(404).json({ error: 'Memory not found' });
  }
});

// GET farewell notes
app.get('/api/farewell-notes', (_req: Request, res: Response) => {
  const notes = readJsonFile(FAREWELL_FILE, INITIAL_FAREWELL_NOTES);
  res.json(notes);
});

// POST farewell note
app.post('/api/farewell-notes', (req: Request, res: Response) => {
  const { authorName, authorRole, note } = req.body;
  if (!authorName || !note) {
    res.status(400).json({ error: 'Author and note are required' });
    return;
  }

  const notes = readJsonFile(FAREWELL_FILE, INITIAL_FAREWELL_NOTES);
  const newNote = {
    id: `farewell-${Date.now()}`,
    authorName: String(authorName).trim(),
    authorRole: authorRole ? String(authorRole).trim() : 'FA23 Brother',
    note: String(note).trim(),
    timestamp: 'Just now',
    likes: 1,
  };

  notes.unshift(newNote);
  writeJsonFile(FAREWELL_FILE, notes);
  res.status(201).json(newNote);
});

// POST like farewell note
app.post('/api/farewell-notes/:id/like', (req: Request, res: Response) => {
  const { id } = req.params;
  const notes = readJsonFile(FAREWELL_FILE, INITIAL_FAREWELL_NOTES);
  const note = notes.find((n) => n.id === id);
  if (note) {
    note.likes = (note.likes || 0) + 1;
    writeJsonFile(FAREWELL_FILE, notes);
    res.json({ id, likes: note.likes });
  } else {
    res.status(404).json({ error: 'Note not found' });
  }
});

// Serve frontend in dev or prod
async function startServer() {
  if (!isProduction) {
    // Development mode: Mount Vite dev server middlewares
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production mode: Serve built static files from dist/
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 MUST BS MLT BOYS Full-Stack Backend running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
