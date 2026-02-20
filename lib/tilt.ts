/**
 * Deterministic pseudo-random tilt between -maxDeg and +maxDeg.
 * Uses a simple hash so each (index, seed) pair gets a unique but
 * stable rotation that doesn't repeat in an obvious pattern.
 */
export function tilt(index: number, seed: number, maxDeg = 1.8): number {
  const hash = Math.sin(index * 127.1 + seed * 311.7) * 43758.5453;
  return +((hash - Math.floor(hash)) * maxDeg * 2 - maxDeg).toFixed(2);
}
