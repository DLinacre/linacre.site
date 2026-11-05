/**
 * Pure helpers for the Orbit page: solar position, day/night terminator,
 * moon phase, great-circle distance and small formatting utilities.
 * Everything here is deterministic so it can be unit-tested without network.
 */

export const HOME = { name: 'Barnsley', lat: 53.5526, lon: -1.4797 } as const;

const DEG = Math.PI / 180;
const EARTH_RADIUS_KM = 6371;

/** Map a longitude/latitude to the equirectangular viewBox (0 0 360 180). */
export function project(lon: number, lat: number): [number, number] {
  return [normaliseLon(lon) + 180, 90 - lat];
}

/**
 * Orthographic 3D globe projection onto a unit sphere centered at (centerLon, centerLat).
 * Returns x (-1..1), y (-1..1), and visible (true if on the front hemisphere).
 */
export function projectOrthographic(
  lon: number,
  lat: number,
  centerLon: number,
  centerLat: number,
): { x: number; y: number; visible: boolean } {
  const phi = lat * DEG;
  const phi0 = centerLat * DEG;
  const dLambda = (lon - centerLon) * DEG;

  const cosC =
    Math.sin(phi0) * Math.sin(phi) + Math.cos(phi0) * Math.cos(phi) * Math.cos(dLambda);
  const x = Math.cos(phi) * Math.sin(dLambda);
  const y =
    Math.cos(phi0) * Math.sin(phi) - Math.sin(phi0) * Math.cos(phi) * Math.cos(dLambda);

  return { x, y: -y, visible: cosC >= 0 };
}

export function normaliseLon(lon: number): number {
  return ((((lon + 180) % 360) + 360) % 360) - 180;
}

/** Great-circle distance in kilometres. */
export function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const dLat = (lat2 - lat1) * DEG;
  const dLon = (lon2 - lon1) * DEG;
  const a =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * DEG) * Math.cos(lat2 * DEG) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(a)));
}

/**
 * Approximate sub-solar point (where the Sun is directly overhead).
 * Accurate to well under a degree, which is plenty for a world map.
 */
export function subsolarPoint(date: Date): { lat: number; lon: number } {
  const jd = date.getTime() / 86400000 + 2440587.5;
  const n = jd - 2451545.0;
  const L = (280.46 + 0.9856474 * n) % 360;
  const g = ((357.528 + 0.9856003 * n) % 360) * DEG;
  const lambda = (L + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g)) * DEG;
  const epsilon = (23.439 - 0.0000004 * n) * DEG;
  const decl = Math.asin(Math.sin(epsilon) * Math.sin(lambda));
  const ra = Math.atan2(Math.cos(epsilon) * Math.sin(lambda), Math.cos(lambda));
  // Greenwich mean sidereal time in degrees.
  const gmst = (280.46061837 + 360.98564736629 * n) % 360;
  const lon = normaliseLon(ra / DEG - gmst);
  return { lat: decl / DEG, lon };
}

/**
 * SVG path (viewBox 0 0 360 180) covering the night side of the Earth for
 * the given sub-solar point.
 */
export function nightPath(sun: { lat: number; lon: number }, step = 2): string {
  // Avoid division by zero at the equinoxes.
  const decl = Math.abs(sun.lat) < 0.05 ? 0.05 * Math.sign(sun.lat || 1) : sun.lat;
  const tanD = Math.tan(decl * DEG);
  const points: string[] = [];
  for (let lon = -180; lon <= 180; lon += step) {
    const hourAngle = (lon - sun.lon) * DEG;
    const lat = Math.atan(-Math.cos(hourAngle) / tanD) / DEG;
    const [x, y] = project(lon === 180 ? 179.999 : lon, lat);
    points.push(`${x.toFixed(2)} ${y.toFixed(2)}`);
  }
  // Northern-hemisphere summer: the north pole is lit, so night is "below".
  const edge = decl > 0 ? 180 : 0;
  return `M0 ${edge}L${points.join('L')}L360 ${edge}Z`;
}

/** Is the given location currently in daylight? */
export function isDaylight(lat: number, lon: number, sun: { lat: number; lon: number }): boolean {
  const h = (lon - sun.lon) * DEG;
  const altitude =
    Math.sin(lat * DEG) * Math.sin(sun.lat * DEG) +
    Math.cos(lat * DEG) * Math.cos(sun.lat * DEG) * Math.cos(h);
  return altitude > 0;
}

const SYNODIC_MONTH = 29.530588853;
// A known new moon: 2000-01-06 18:14 UTC.
const KNOWN_NEW_MOON = Date.UTC(2000, 0, 6, 18, 14);

export interface MoonPhase {
  /** 0 = new, 0.5 = full, 1 = new again. */
  phase: number;
  /** Illuminated fraction, 0..1. */
  illumination: number;
  ageDays: number;
  name: string;
  daysToFull: number;
}

export function moonPhase(date: Date): MoonPhase {
  const days = (date.getTime() - KNOWN_NEW_MOON) / 86400000;
  const age = ((days % SYNODIC_MONTH) + SYNODIC_MONTH) % SYNODIC_MONTH;
  const phase = age / SYNODIC_MONTH;
  const illumination = (1 - Math.cos(phase * 2 * Math.PI)) / 2;
  const names = [
    'New Moon',
    'Waxing Crescent',
    'First Quarter',
    'Waxing Gibbous',
    'Full Moon',
    'Waning Gibbous',
    'Last Quarter',
    'Waning Crescent',
  ];
  const name = names[Math.floor(phase * 8 + 0.5) % 8];
  const daysToFull = ((0.5 - phase + 1) % 1) * SYNODIC_MONTH;
  return { phase, illumination, ageDays: age, name, daysToFull };
}

/** Split a ground track wherever it crosses the antimeridian. */
export function splitTrack(points: Array<{ lat: number; lon: number }>): string[] {
  const segments: string[] = [];
  let current: string[] = [];
  let prevLon: number | null = null;
  for (const p of points) {
    const lon = normaliseLon(p.lon);
    if (prevLon !== null && Math.abs(lon - prevLon) > 180) {
      if (current.length > 1) segments.push(`M${current.join('L')}`);
      current = [];
    }
    const [x, y] = project(lon, p.lat);
    current.push(`${x.toFixed(2)} ${y.toFixed(2)}`);
    prevLon = lon;
  }
  if (current.length > 1) segments.push(`M${current.join('L')}`);
  return segments;
}

/** "2d 04:13:09" style countdown. Negative values read as "T+". */
export function formatCountdown(ms: number): string {
  const sign = ms < 0 ? 'T+ ' : 'T− ';
  let s = Math.floor(Math.abs(ms) / 1000);
  const d = Math.floor(s / 86400);
  s -= d * 86400;
  const h = Math.floor(s / 3600);
  s -= h * 3600;
  const m = Math.floor(s / 60);
  s -= m * 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${sign}${d > 0 ? `${d}d ` : ''}${pad(h)}:${pad(m)}:${pad(s)}`;
}

/** Human label for a WMO weather interpretation code (Open-Meteo). */
export function weatherLabel(code: number): string {
  if (code === 0) return 'Clear sky';
  if (code <= 2) return 'Partly cloudy';
  if (code === 3) return 'Overcast';
  if (code === 45 || code === 48) return 'Fog';
  if (code >= 51 && code <= 57) return 'Drizzle';
  if (code >= 61 && code <= 67) return 'Rain';
  if (code >= 71 && code <= 77) return 'Snow';
  if (code >= 80 && code <= 82) return 'Showers';
  if (code === 85 || code === 86) return 'Snow showers';
  if (code >= 95) return 'Thunderstorm';
  return 'Unsettled';
}

/** Rough stargazing verdict from cloud cover, daylight and moonlight. */
export function stargazingScore(cloudCover: number, isDay: boolean, moonIllumination: number) {
  if (isDay) return { score: 0, label: 'Wait for dark' };
  const score = Math.max(
    0,
    Math.round(100 - cloudCover * 0.85 - moonIllumination * 25),
  );
  const label =
    score >= 70 ? 'Excellent' : score >= 45 ? 'Decent' : score >= 20 ? 'Poor' : 'Not tonight';
  return { score, label };
}

/** Colour ramp for earthquake magnitude. */
export function quakeColour(mag: number): string {
  if (mag >= 6) return '#fb7185';
  if (mag >= 5) return '#fb923c';
  if (mag >= 4) return '#facc15';
  return '#8fd6ff';
}
