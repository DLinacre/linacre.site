/**
 * Ambient Continuous Background Audio Engine for linacre.site
 *
 * Implements seamless, perpetual audio looping using Web Audio API with
 * lookahead scheduling and equal-power (cos/sin) crossfading.
 * Eliminates MP3 encoder padding gaps, silences, and loop seams, creating
 * an endless continuous ambient track.
 */

export interface AmbientAudioState {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number; // 0.0 to 1.0
  isUnlocked: boolean;
  isLoading: boolean;
  error: string | null;
  trackTitle: string;
  artist: string;
  sunoUrl: string;
}

export type AmbientAudioListener = (state: AmbientAudioState) => void;

const STORAGE_KEY_VOLUME = 'linacre_ambient_volume';
const STORAGE_KEY_MUTED = 'linacre_ambient_muted';
const STORAGE_KEY_ENABLED = 'linacre_ambient_enabled';

const TRACK_TITLE = 'Pixel Adventure';
const TRACK_ARTIST = 'Linacre';
const SUNO_URL = 'https://suno.com/song/99ac3181-f6f5-491f-8e72-797b7c756cff';
const AUDIO_SRC = '/audio/99ac3181-f6f5-491f-8e72-797b7c756cff.mp3';

function getAudioUrl(): string {
  if (typeof window !== 'undefined' && window.location?.origin && !window.location.origin.startsWith('null')) {
    try {
      return new URL(AUDIO_SRC, window.location.origin).toString();
    } catch {}
  }
  return AUDIO_SRC;
}

// Audio timing constants
const START_TRIM = 0.15; // Skip MP3 encoder silence padding
const LOOP_END = 148.0; // Cut before source audio's natural outro fade
const CROSSFADE_DURATION = 4.0; // 4-second equal-power crossfade
const DEFAULT_VOLUME = 0.35; // Ideal low-fatigue ambient volume
const LOOKAHEAD_SEC = 15.0; // Schedule next loop segment 15s in advance

function createEqualPowerCurves(points = 64) {
  const fadeOut = new Float32Array(points);
  const fadeIn = new Float32Array(points);
  for (let i = 0; i < points; i++) {
    const frac = i / (points - 1);
    fadeOut[i] = Math.cos(frac * 0.5 * Math.PI);
    fadeIn[i] = Math.sin(frac * 0.5 * Math.PI);
  }
  return { fadeOut, fadeIn };
}

const { fadeOut: CURVE_OUT, fadeIn: CURVE_IN } = createEqualPowerCurves(64);

interface PlayingNode {
  source: AudioBufferSourceNode;
  gain: GainNode;
  startTime: number;
  stopTime: number;
  bufferOffset: number;
}

export class AmbientAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private buffer: AudioBuffer | null = null;

  private isPlaying = false;
  private isMuted = false;
  private volume = DEFAULT_VOLUME;
  private isUnlocked = false;
  private isLoading = false;
  private error: string | null = null;
  private userExplicitlyPaused = false;

  private activeNodes: PlayingNode[] = [];
  private schedulerTimer: ReturnType<typeof setInterval> | null = null;
  private nextLoopStartTime = 0;
  private pauseOffset = 0;
  private loadingPromise: Promise<boolean> | null = null;

  private listeners = new Set<AmbientAudioListener>();
  private frequencyData: Uint8Array = new Uint8Array(32);

  // Fallback HTML audio elements if Web Audio buffer decode is unavailable
  private fallbackAudioA: HTMLAudioElement | null = null;
  private fallbackAudioB: HTMLAudioElement | null = null;
  private isFallbackMode = false;

  private cachedState: AmbientAudioState;

  constructor() {
    this.restoreStoredPreferences();
    this.cachedState = this.buildSnapshot();
    this.initVisibilityListener();
  }

  private initVisibilityListener() {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && this.isPlaying) {
        if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume().catch(() => {});
        }
        this.tickScheduler();
      }
    });
  }

  private buildSnapshot(): AmbientAudioState {
    return {
      isPlaying: this.isPlaying,
      isMuted: this.isMuted,
      volume: this.volume,
      isUnlocked: this.isUnlocked,
      isLoading: this.isLoading,
      error: this.error,
      trackTitle: TRACK_TITLE,
      artist: TRACK_ARTIST,
      sunoUrl: SUNO_URL,
    };
  }

  private restoreStoredPreferences() {
    if (typeof window === 'undefined') return;

    try {
      const storedVol = localStorage.getItem(STORAGE_KEY_VOLUME);
      if (storedVol !== null) {
        const parsed = parseFloat(storedVol);
        if (!isNaN(parsed) && parsed >= 0 && parsed <= 1) {
          this.volume = parsed;
        }
      }

      const storedMuted = localStorage.getItem(STORAGE_KEY_MUTED);
      if (storedMuted !== null) {
        this.isMuted = storedMuted === 'true';
      }

      const storedEnabled = localStorage.getItem(STORAGE_KEY_ENABLED);
      if (storedEnabled === 'false') {
        this.userExplicitlyPaused = true;
      }
    } catch {
      // Ignore localStorage access failures
    }
  }

  public getState(): AmbientAudioState {
    return this.cachedState;
  }

  public subscribe(listener: AmbientAudioListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.cachedState = this.buildSnapshot();
    const state = this.cachedState;
    this.listeners.forEach(fn => {
      try {
        fn(state);
      } catch (err) {
        console.error('AmbientAudioListener error:', err);
      }
    });
  }

  private ensureAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;

    if (!this.ctx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

      if (!AudioContextClass) return null;

      try {
        this.ctx = new AudioContextClass();
        this.masterGain = this.ctx.createGain();
        this.analyser = this.ctx.createAnalyser();
        this.analyser.fftSize = 64;
        this.analyser.smoothingTimeConstant = 0.8;

        this.updateMasterVolume(false);
        this.masterGain.connect(this.analyser);
        this.analyser.connect(this.ctx.destination);
      } catch (err) {
        console.warn('Web Audio initialization error:', err);
        return null;
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    return this.ctx;
  }

  private updateMasterVolume(smooth = true) {
    if (this.masterGain && this.ctx) {
      const target = this.isMuted ? 0 : this.volume;
      try {
        if (smooth && this.ctx.state === 'running') {
          this.masterGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.04);
        } else {
          this.masterGain.gain.setValueAtTime(target, this.ctx.currentTime);
        }
      } catch {
        this.masterGain.gain.value = target;
      }
    }

    if (this.isFallbackMode && this.fallbackAudioA) {
      this.fallbackAudioA.volume = this.isMuted ? 0 : this.volume;
      this.fallbackAudioA.muted = this.isMuted;
    }
  }

  public async loadAudio(): Promise<boolean> {
    if (this.buffer) return true;
    if (this.loadingPromise) return this.loadingPromise;

    this.isLoading = true;
    this.error = null;
    this.notify();

    this.loadingPromise = (async () => {
      try {
        const res = await fetch(getAudioUrl());
        if (!res.ok) {
          throw new Error(`Failed to fetch audio: ${res.status}`);
        }
        const arrayBuffer = await res.arrayBuffer();

        const ctx = this.ensureAudioContext();
        if (!ctx) {
          throw new Error('AudioContext not available');
        }

        this.buffer = await new Promise<AudioBuffer>((resolve, reject) => {
          const promise = ctx.decodeAudioData(arrayBuffer, resolve, reject);
          if (promise && typeof promise.then === 'function') {
            promise.then(resolve, reject);
          }
        });

        this.isLoading = false;
        this.notify();
        return true;
      } catch (err) {
        console.warn('Web Audio buffer decode failed, initializing fallback:', err);
        this.isLoading = false;
        this.error = err instanceof Error ? err.message : String(err);
        this.initFallbackMode();
        this.notify();
        return false;
      } finally {
        this.loadingPromise = null;
      }
    })();

    return this.loadingPromise;
  }

  private initFallbackMode() {
    if (typeof window === 'undefined' || this.isFallbackMode) return;
    this.isFallbackMode = true;

    try {
      const src = getAudioUrl();
      this.fallbackAudioA = new Audio(src);
      this.fallbackAudioB = new Audio(src);
      this.fallbackAudioA.preload = 'auto';
      this.fallbackAudioB.preload = 'auto';
    } catch {}
  }

  /**
   * Schedule the initial playback segment (from offset up to LOOP_END)
   */
  private startPlayback(startTime: number, offset = START_TRIM) {
    if (!this.ctx || !this.buffer || !this.isPlaying) return;

    const remainingDuration = Math.max(0.5, LOOP_END - offset);
    const stopTime = startTime + remainingDuration;

    const source = this.ctx.createBufferSource();
    source.buffer = this.buffer;
    const gain = this.ctx.createGain();

    // Initial fade in over 0.2s to prevent click/pop
    const fadeInDuration = Math.min(0.2, remainingDuration * 0.5);
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(1, startTime + fadeInDuration);

    // Fade out at end of this segment
    const fadeOutStart = Math.max(startTime, stopTime - CROSSFADE_DURATION);
    const fadeOutDuration = stopTime - fadeOutStart;
    try {
      gain.gain.setValueCurveAtTime(CURVE_OUT, fadeOutStart, fadeOutDuration);
    } catch {
      gain.gain.setValueAtTime(1, fadeOutStart);
      gain.gain.linearRampToValueAtTime(0, stopTime);
    }

    source.connect(gain);
    gain.connect(this.masterGain!);

    try {
      source.start(startTime, offset);
      source.stop(stopTime);
    } catch (err) {
      console.error('Error starting initial AudioBufferSourceNode:', err);
    }

    const nodeEntry: PlayingNode = { source, gain, startTime, stopTime, bufferOffset: offset };
    this.activeNodes.push(nodeEntry);

    source.onended = () => {
      try {
        source.disconnect();
        gain.disconnect();
      } catch {}
      this.activeNodes = this.activeNodes.filter(n => n !== nodeEntry);
    };

    // Next loop starts exactly at fadeOutStart
    this.nextLoopStartTime = fadeOutStart;

    // Start background lookahead scheduler
    this.startScheduler();
  }

  /**
   * Schedule the next perpetual loop segment with seamless equal-power crossfade
   */
  private scheduleLoopSegment(startTime: number) {
    if (!this.ctx || !this.buffer || !this.isPlaying) return;

    const playDuration = Math.max(10, LOOP_END - START_TRIM);
    const stopTime = startTime + playDuration;

    const source = this.ctx.createBufferSource();
    source.buffer = this.buffer;
    const gain = this.ctx.createGain();

    // Equal-power fade in
    try {
      gain.gain.setValueCurveAtTime(CURVE_IN, startTime, CROSSFADE_DURATION);
    } catch {
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(1, startTime + CROSSFADE_DURATION);
    }

    // Equal-power fade out
    const fadeOutStart = stopTime - CROSSFADE_DURATION;
    try {
      gain.gain.setValueCurveAtTime(CURVE_OUT, fadeOutStart, CROSSFADE_DURATION);
    } catch {
      gain.gain.setValueAtTime(1, fadeOutStart);
      gain.gain.linearRampToValueAtTime(0, stopTime);
    }

    source.connect(gain);
    gain.connect(this.masterGain!);

    try {
      source.start(startTime, START_TRIM);
      source.stop(stopTime);
    } catch (err) {
      console.error('Error starting next loop AudioBufferSourceNode:', err);
    }

    const nodeEntry: PlayingNode = { source, gain, startTime, stopTime, bufferOffset: START_TRIM };
    this.activeNodes.push(nodeEntry);

    source.onended = () => {
      try {
        source.disconnect();
        gain.disconnect();
      } catch {}
      this.activeNodes = this.activeNodes.filter(n => n !== nodeEntry);
    };

    this.nextLoopStartTime = fadeOutStart;
  }

  private startScheduler() {
    this.stopScheduler();
    this.tickScheduler();
    this.schedulerTimer = setInterval(() => {
      this.tickScheduler();
    }, 1000);
  }

  private stopScheduler() {
    if (this.schedulerTimer) {
      clearInterval(this.schedulerTimer);
      this.schedulerTimer = null;
    }
  }

  private tickScheduler() {
    if (!this.isPlaying || !this.ctx || !this.buffer) return;

    // Prune expired nodes
    const now = this.ctx.currentTime;
    this.activeNodes = this.activeNodes.filter(n => n.stopTime > now);

    // Schedule next segments if within lookahead window
    while (this.nextLoopStartTime - now < LOOKAHEAD_SEC) {
      const scheduledTime = Math.max(now + 0.05, this.nextLoopStartTime);
      this.scheduleLoopSegment(scheduledTime);
    }
  }

  public async play(): Promise<void> {
    if (this.isPlaying) return; // Prevent duplicate overlapping playback
    this.isUnlocked = true;
    this.userExplicitlyPaused = false;
    try {
      localStorage.setItem(STORAGE_KEY_ENABLED, 'true');
    } catch {}

    const ctx = this.ensureAudioContext();
    if (ctx && ctx.state === 'suspended') {
      try {
        await ctx.resume();
      } catch {}
    }

    if (!this.buffer) {
      const loaded = await this.loadAudio();
      if (!loaded && this.isFallbackMode) {
        this.playFallback();
        return;
      }
      // If user paused while loading was awaiting, abort
      if (this.userExplicitlyPaused) {
        return;
      }
    }

    if (!this.ctx || !this.buffer) return;

    this.isPlaying = true;
    this.updateMasterVolume(true);

    const now = this.ctx.currentTime;
    const offset = this.pauseOffset > 0 ? this.pauseOffset : START_TRIM;
    this.pauseOffset = 0;

    this.startPlayback(now + 0.05, offset);
    this.notify();
  }

  public pause(): void {
    this.isPlaying = false;
    this.userExplicitlyPaused = true;
    try {
      localStorage.setItem(STORAGE_KEY_ENABLED, 'false');
    } catch {}

    this.stopScheduler();

    if (this.ctx && this.activeNodes.length > 0) {
      const now = this.ctx.currentTime;
      const current = this.activeNodes.find(n => n.startTime <= now && now < n.stopTime) || this.activeNodes[0];
      if (current) {
        const elapsed = Math.max(0, now - current.startTime);
        this.pauseOffset = (current.bufferOffset + elapsed) % LOOP_END;
        if (this.pauseOffset < START_TRIM) {
          this.pauseOffset = START_TRIM;
        }
      }

      this.activeNodes.forEach(n => {
        try {
          n.gain.gain.cancelScheduledValues(now);
          n.gain.gain.setValueAtTime(n.gain.gain.value, now);
          n.gain.gain.linearRampToValueAtTime(0, now + 0.08);
          setTimeout(() => {
            try {
              n.source.stop();
              n.source.disconnect();
              n.gain.disconnect();
            } catch {}
          }, 100);
        } catch {
          try {
            n.source.stop();
          } catch {}
        }
      });
      this.activeNodes = [];
    }

    if (this.isFallbackMode) {
      try {
        this.fallbackAudioA?.pause();
        this.fallbackAudioB?.pause();
      } catch {}
    }

    this.notify();
  }

  public togglePlay(): void {
    if (this.isPlaying) {
      this.pause();
    } else {
      void this.play();
    }
  }

  public setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.volume > 0 && this.isMuted) {
      this.isMuted = false;
      try {
        localStorage.setItem(STORAGE_KEY_MUTED, 'false');
      } catch {}
    }

    try {
      localStorage.setItem(STORAGE_KEY_VOLUME, String(this.volume));
    } catch {}

    this.updateMasterVolume(true);
    this.notify();
  }

  public toggleMute(): void {
    this.isMuted = !this.isMuted;
    try {
      localStorage.setItem(STORAGE_KEY_MUTED, String(this.isMuted));
    } catch {}

    this.updateMasterVolume(true);
    this.notify();
  }

  private playFallback() {
    if (!this.fallbackAudioA) return;
    this.isPlaying = true;
    const vol = this.isMuted ? 0 : this.volume;
    this.fallbackAudioA.volume = vol;
    this.fallbackAudioA.muted = this.isMuted;
    this.fallbackAudioA.loop = true;
    try {
      const playPromise = this.fallbackAudioA.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {});
      }
    } catch {}
    this.notify();
  }

  public getVisualizerData(): Uint8Array {
    if (!this.isPlaying || this.isMuted || !this.analyser) {
      this.frequencyData.fill(0);
      return this.frequencyData;
    }
    try {
      this.analyser.getByteFrequencyData(this.frequencyData);
    } catch {
      this.frequencyData.fill(0);
    }
    return this.frequencyData;
  }

  /**
   * Set up passive interaction listener to respect browser autoplay policies.
   * If the user previously had audio enabled (default: true), the first user
   * click or tap automatically activates the ambient soundtrack seamlessly.
   */
  public registerAutoUnlockListener(): () => void {
    if (typeof window === 'undefined') return () => {};

    let enabledPref = true;
    try {
      const stored = localStorage.getItem(STORAGE_KEY_ENABLED);
      if (stored === 'false') {
        enabledPref = false;
      }
    } catch {}

    if (!enabledPref || this.userExplicitlyPaused) return () => {};

    const handleUserGesture = (e: Event) => {
      // If user interacted directly with the player controls, let the controls handle it
      const target = e.target as HTMLElement | null;
      if (target && target.closest('[data-ambient-player="true"]')) {
        return;
      }

      cleanup();
      if (!this.isPlaying && !this.userExplicitlyPaused) {
        void this.play();
      }
    };

    const cleanup = () => {
      window.removeEventListener('pointerdown', handleUserGesture);
      window.removeEventListener('keydown', handleUserGesture);
      window.removeEventListener('touchstart', handleUserGesture);
    };

    window.addEventListener('pointerdown', handleUserGesture);
    window.addEventListener('keydown', handleUserGesture);
    window.addEventListener('touchstart', handleUserGesture);

    return cleanup;
  }
}

// Global singleton instance for linacre.site
export const ambientAudio = new AmbientAudioEngine();
