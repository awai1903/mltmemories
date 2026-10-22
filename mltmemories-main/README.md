# MUST BS MLT BOYS — OUR LEGACY
### Digital Memory Book & Interactive 3D Archive · FA23 Batch

A cinematic, interactive tribute dedicated to the 12 brothers of the **BS Medical Laboratory Technology (BS MLT)** batch at **MUST University (Mirpur University of Science and Technology)**.

> *“We Came as Students. We Leave as Brothers.”*  
> *One Batch. Countless Memories. One Legacy.*

---

## 🏛 The 12 Roster Members
1. **FA23-MLT-001** — Adil Javed
2. **FA23-MLT-003** — Abdul Moiz
3. **FA23-MLT-004** — Abdur Rehman
4. **FA23-MLT-006** — Ahmed Khurshid
5. **FA23-MLT-015** — Arslan Shabbir
6. **FA23-MLT-017** — Awais Sultan
7. **FA23-MLT-019** — Faizan Ahmed
8. **FA23-MLT-030** — Usman Saeed
9. **FA23-MLT-039** — Atta Ur Rehman
10. **FA23-MLT-041** — Tayyab Ali Khan
11. **FA23-MLT-050** — Qasim Azad
12. **FA23-MLT-051** — Aman Naveed

---

## 📸 How to Replace Placeholder Avatars with Real Photos

The application is architected with a unified photo lookup system keyed to each student's roll number.

1. **Locate the photo directory:**
   Navigate to the `public/boys-photos/` directory in this project.

2. **Add portrait images named with each student's exact Roll Number:**
   - `public/boys-photos/FA23-MLT-001.jpg`
   - `public/boys-photos/FA23-MLT-003.jpg`
   - `public/boys-photos/FA23-MLT-004.jpg`
   - `public/boys-photos/FA23-MLT-006.jpg`
   - `public/boys-photos/FA23-MLT-015.jpg`
   - `public/boys-photos/FA23-MLT-017.jpg`
   - `public/boys-photos/FA23-MLT-019.jpg`
   - `public/boys-photos/FA23-MLT-030.jpg`
   - `public/boys-photos/FA23-MLT-039.jpg`
   - `public/boys-photos/FA23-MLT-041.jpg`
   - `public/boys-photos/FA23-MLT-050.jpg`
   - `public/boys-photos/FA23-MLT-051.jpg`

3. **Automatic Fallback:**
   If a photo is missing or still being collected, the website automatically displays an elegant antique-gold monogram badge with the student's initials and BS MLT insignia.

4. **Rebuilding and Redeployment:**
   Note: Simply dropping files into a local folder does not automatically propagate to a live production build. When updating assets in production, run:
   ```bash
   npm run build
   ```
   and redeploy the resulting bundle so static assets are bundled and served by the web server.

---

## 🌟 Key Features
- **Cinematic 3D Tilted Photo Ring**: Orbit containing all 12 brothers with real-time Three.js lighting, elliptical tilt, auto-rotation, mouse/touch drag controls, play/pause controls, and static fallback.
- **Roster Directory & Live Search**: Instant search by student name or roll number with card views and detailed modal biographies.
- **Memory Wall**: Interactive campus chapters (First Day, Practical Labs, Canteen Chronicles, Friends & Laughter, Exam Prep, University Events) with photo placeholder expanders.
- **Our Journey Timeline**: Chronological narrative of milestones with interactive milestone viewer.
- **Time Capsule Relic**: Sealed future vault modal concept for future batch messages.
- **Batch Film Premiere Experience**: Cinematic preview player modal with ambient soundtrack simulator, chapter markers, and director notes.
