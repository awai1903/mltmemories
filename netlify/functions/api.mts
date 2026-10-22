import { getStore } from '@netlify/blobs';
import { INITIAL_MEMORIES, type MemoryItem } from '../../src/data/memories';
import { INITIAL_FAREWELL_NOTES, type FarewellNote } from '../../src/data/farewellNotes';
import type { Config } from '@netlify/functions';

// Netlify Blobs keeps these small collections across deploys. This is suitable
// for a low-traffic demo; high-write/concurrent likes should move to a database.
const store = getStore({ name: 'mltmemories-api', consistency: 'strong' });
const KEYS = { memories: 'memories-v1', notes: 'farewell-notes-v1' } as const;
const JSON_HEADERS = { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' };

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), { status, headers: JSON_HEADERS });
}

async function readCollection<T>(key: string, initial: T): Promise<T> {
  const saved = await store.get(key, { type: 'json' }) as T | null;
  if (saved !== null) return saved;
  await store.setJSON(key, initial);
  return initial;
}

async function readBody(req: Request): Promise<Record<string, unknown> | null> {
  const raw = await req.text();
  if (raw.length > 64_000) return null;
  try {
    const value = JSON.parse(raw);
    return value && typeof value === 'object' && !Array.isArray(value) ? value : null;
  } catch {
    return null;
  }
}

function cleanText(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

export default async (req: Request) => {
  const url = new URL(req.url);
  const path = url.pathname.replace(/\/$/, '') || '/';
  const method = req.method.toUpperCase();

  try {
    if (path === '/api/health' && method === 'GET') {
      return json({ status: 'online', timestamp: new Date().toISOString(), batch: 'MUST BS MLT BOYS (FA23 – 2027)', service: 'Netlify Functions API' });
    }

    if (path === '/api/memories' && method === 'GET') {
      return json(await readCollection<MemoryItem[]>(KEYS.memories, INITIAL_MEMORIES));
    }

    if (path === '/api/memories' && method === 'POST') {
      const body = await readBody(req);
      if (!body) return json({ error: 'Invalid JSON or request too large (64 KB max)' }, 400);
      const title = cleanText(body.title, 140);
      if (!title) return json({ error: 'Title is required' }, 400);
      const memories = await readCollection<MemoryItem[]>(KEYS.memories, INITIAL_MEMORIES);
      const newMemory: MemoryItem = {
        id: `mem-${crypto.randomUUID()}`,
        title,
        location: cleanText(body.location, 160) || 'MUST Campus · Mirpur',
        date: cleanText(body.date, 80) || 'Class of 2027 Memory',
        category: ['Labs & Practicals', 'Campus Life', 'Hostel & Nights', 'Brotherhood'].includes(String(body.category)) ? body.category as MemoryItem['category'] : 'Brotherhood',
        description: cleanText(body.description, 500),
        story: cleanText(body.story || body.description, 3000),
        taggedRolls: Array.isArray(body.taggedRolls) ? body.taggedRolls.filter((v): v is string => typeof v === 'string' && /^FA23-MLT-\d{3}$/.test(v)).slice(0, 12) : [],
        imageUrl: cleanText(body.imageUrl, 1000) || undefined,
        likes: 0,
        isUserAdded: true,
      };
      await store.setJSON(KEYS.memories, [newMemory, ...memories].slice(0, 500));
      return json(newMemory, 201);
    }

    const memoryLike = path.match(/^\/api\/memories\/([^/]+)\/like$/);
    if (memoryLike && method === 'POST') {
      const id = decodeURIComponent(memoryLike[1]);
      const memories = await readCollection<MemoryItem[]>(KEYS.memories, INITIAL_MEMORIES);
      const item = memories.find((memory) => memory.id === id);
      if (!item) return json({ error: 'Memory not found' }, 404);
      item.likes = (item.likes || 0) + 1;
      await store.setJSON(KEYS.memories, memories);
      return json({ id, likes: item.likes });
    }

    if (path === '/api/farewell-notes' && method === 'GET') {
      return json(await readCollection<FarewellNote[]>(KEYS.notes, INITIAL_FAREWELL_NOTES));
    }

    if (path === '/api/farewell-notes' && method === 'POST') {
      const body = await readBody(req);
      if (!body) return json({ error: 'Invalid JSON or request too large (64 KB max)' }, 400);
      const authorName = cleanText(body.authorName, 80);
      const note = cleanText(body.note, 1500);
      if (!authorName || !note) return json({ error: 'Author and note are required' }, 400);
      const notes = await readCollection<FarewellNote[]>(KEYS.notes, INITIAL_FAREWELL_NOTES);
      const newNote: FarewellNote = {
        id: `farewell-${crypto.randomUUID()}`,
        authorName,
        authorRole: cleanText(body.authorRole, 100) || 'FA23 Brother',
        note,
        timestamp: new Date().toISOString(),
        likes: 0,
      };
      await store.setJSON(KEYS.notes, [newNote, ...notes].slice(0, 500));
      return json(newNote, 201);
    }

    const noteLike = path.match(/^\/api\/farewell-notes\/([^/]+)\/like$/);
    if (noteLike && method === 'POST') {
      const id = decodeURIComponent(noteLike[1]);
      const notes = await readCollection<FarewellNote[]>(KEYS.notes, INITIAL_FAREWELL_NOTES);
      const note = notes.find((entry) => entry.id === id);
      if (!note) return json({ error: 'Note not found' }, 404);
      note.likes = (note.likes || 0) + 1;
      await store.setJSON(KEYS.notes, notes);
      return json({ id, likes: note.likes });
    }

    return json({ error: 'Not found' }, 404);
  } catch (error) {
    console.error('MLT Memories API error:', error);
    return json({ error: 'Internal server error' }, 500);
  }
};

export const config: Config = {
  path: [
    '/api/health',
    '/api/memories',
    '/api/memories/:id/like',
    '/api/farewell-notes',
    '/api/farewell-notes/:id/like',
  ],
};
