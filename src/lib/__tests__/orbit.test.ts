import { describe, expect, it } from 'vitest';
import {
  HOME,
  formatCountdown,
  haversineKm,
  isDaylight,
  moonPhase,
  nightPath,
  normaliseLon,
  project,
  projectOrthographic,
  quakeColour,
  splitTrack,
  stargazingScore,
  subsolarPoint,
  weatherLabel,
} from '../orbit';

describe('orbit helpers', () => {
  it('projects longitudes and latitudes into viewBox 0..360 x 0..180', () => {
    expect(project(0, 0)).toEqual([180, 90]);
    expect(project(-180, 90)).toEqual([0, 0]);
    expect(normaliseLon(190)).toBeCloseTo(-170, 5);
    const center = projectOrthographic(HOME.lon, HOME.lat, HOME.lon, HOME.lat);
    expect(center.visible).toBe(true);
    expect(center.x).toBeCloseTo(0, 5);
    expect(center.y).toBeCloseTo(0, 5);
    const antipode = projectOrthographic(HOME.lon + 180, -HOME.lat, HOME.lon, HOME.lat);
    expect(antipode.visible).toBe(false);
  });

  it('computes great-circle distance accurately', () => {
    // Barnsley to London (~240-250 km)
    const d = haversineKm(HOME.lat, HOME.lon, 51.5074, -0.1278);
    expect(d).toBeGreaterThan(220);
    expect(d).toBeLessThan(270);
  });

  it('computes sub-solar point and night terminator SVG path', () => {
    const solstice = new Date('2026-06-21T12:00:00Z');
    const sun = subsolarPoint(solstice);
    expect(sun.lat).toBeGreaterThan(22);
    expect(sun.lat).toBeLessThan(24);
    const path = nightPath(sun);
    expect(path.startsWith('M0 180L')).toBe(true);
    expect(path.endsWith('Z')).toBe(true);
    expect(isDaylight(HOME.lat, HOME.lon, sun)).toBe(true);
  });

  it('calculates moon phase and illumination within 0..1', () => {
    const m = moonPhase(new Date('2026-11-01T12:00:00Z'));
    expect(m.phase).toBeGreaterThanOrEqual(0);
    expect(m.phase).toBeLessThan(1);
    expect(m.illumination).toBeGreaterThanOrEqual(0);
    expect(m.illumination).toBeLessThanOrEqual(1);
    expect(m.name.length).toBeGreaterThan(3);
  });

  it('splits orbital ground tracks across the antimeridian', () => {
    const segs = splitTrack([
      { lat: 10, lon: 170 },
      { lat: 12, lon: 179 },
      { lat: 14, lon: -175 },
      { lat: 16, lon: -165 },
    ]);
    expect(segs.length).toBe(2);
  });

  it('formats countdowns, weather labels, stargazing scores and quake colours', () => {
    expect(formatCountdown(90061000)).toBe('T− 1d 01:01:01');
    expect(weatherLabel(0)).toBe('Clear sky');
    expect(stargazingScore(10, false, 0.1).label).toBe('Excellent');
    expect(stargazingScore(10, true, 0.1).label).toBe('Wait for dark');
    expect(quakeColour(6.2)).toBe('#fb7185');
  });
});
