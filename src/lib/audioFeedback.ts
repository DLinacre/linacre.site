/**
 * Procedural synth audio feedback using Web Audio API
 * Pure mathematical waveforms with zero external network downloads.
 */

let audioCtx: AudioContext | null = null;
let soundEnabled = false;

function getContext(): AudioContext | null {
  if (!audioCtx && typeof window !== 'undefined') {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function toggleSound(): boolean {
  soundEnabled = !soundEnabled;
  if (soundEnabled) {
    const ctx = getContext();
    if (ctx) {
      playBlip(587.33, 0.05); // D5
    } else {
      soundEnabled = false;
    }
  }
  return soundEnabled;
}

export function isSoundEnabled(): boolean {
  return soundEnabled;
}

export function playBlip(freq = 520, duration = 0.04): void {
  if (!soundEnabled) return;
  const ctx = getContext();
  if (!ctx) return;
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.25, ctx.currentTime + duration);
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Ignore audio playback errors if user agent blocked autoplay
  }
}

export function playChime(): void {
  if (!soundEnabled) return;
  [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
    setTimeout(() => playBlip(freq, 0.06), idx * 45);
  });
}
