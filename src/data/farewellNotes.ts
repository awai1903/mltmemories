export interface FarewellNote {
  id: string;
  authorName: string;
  authorRole: string;
  note: string;
  timestamp: string;
  likes: number;
}

export const INITIAL_FAREWELL_NOTES: FarewellNote[] = [
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
