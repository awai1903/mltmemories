/**
 * High-performance Asset Preloading Engine
 * Decodes all batch photography and graphics into GPU memory immediately on website load.
 */

import { BATCH_STUDENTS } from '../data/students';

export const CORE_ASSETS: string[] = [
  '/group-photo.jpg',
  '/logo.png',
  '/logo.jpg',
  '/assets/images/must_mlt_logo_1792684746999.jpg',
  '/assets/images/hero_campus_night_1792668356137.jpg',
  '/assets/images/batch_film_cinematic_1792668356841.jpg',
  '/assets/images/time_capsule_relic_1792668357581.jpg',
  '/boys-photos/group.jpg',
  ...BATCH_STUDENTS.filter(
    (s) => s.rollNo !== 'FA23-MLT-001' && s.rollNo !== 'FA23-MLT-006'
  ).map((s) => s.photoUrl),
];

// In-memory image cache to retain decoded image references
const imageMemoryCache = new Map<string, HTMLImageElement>();

/**
 * Preload and decode a single image directly into GPU texture cache
 */
export function preloadImage(src: string): Promise<void> {
  if (imageMemoryCache.has(src)) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.src = src;

    // Use HTMLImageElement.decode() if supported for stutter-free paint
    if (typeof img.decode === 'function') {
      img
        .decode()
        .then(() => {
          imageMemoryCache.set(src, img);
          resolve();
        })
        .catch(() => {
          imageMemoryCache.set(src, img);
          resolve();
        });
    } else {
      (img as HTMLImageElement).onload = () => {
        imageMemoryCache.set(src, img);
        resolve();
      };
      (img as HTMLImageElement).onerror = () => {
        resolve();
      };
    }
  });
}

/**
 * Preload and decode all critical site assets in parallel
 */
export async function preloadAllAssets(): Promise<void> {
  const promises = CORE_ASSETS.map((src) => preloadImage(src));
  await Promise.allSettled(promises);
}

// Immediate eager execution at module evaluation time
if (typeof window !== 'undefined') {
  CORE_ASSETS.forEach((src) => {
    const img = new Image();
    img.src = src;
    if ('decode' in img) {
      img.decode().catch(() => {});
    }
    imageMemoryCache.set(src, img);
  });
}
