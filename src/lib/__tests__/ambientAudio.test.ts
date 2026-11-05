import { describe, expect, it, beforeEach, vi, afterEach } from 'vitest';
import { AmbientAudioEngine } from '../ambientAudio';

describe('AmbientAudioEngine', () => {
  let engine: AmbientAudioEngine;

  beforeEach(() => {
    localStorage.clear();
    engine = new AmbientAudioEngine();
  });

  afterEach(() => {
    engine.pause();
    vi.restoreAllMocks();
  });

  it('initializes with default volume, unmuted and correct metadata', () => {
    const state = engine.getState();
    expect(state.isPlaying).toBe(false);
    expect(state.isMuted).toBe(false);
    expect(state.volume).toBe(0.35);
    expect(state.trackTitle).toBe('Pixel Adventure');
    expect(state.artist).toBe('Linacre');
    expect(state.sunoUrl).toContain('99ac3181-f6f5-491f-8e72-797b7c756cff');
  });

  it('restores stored volume and mute preferences from localStorage', () => {
    localStorage.setItem('linacre_ambient_volume', '0.72');
    localStorage.setItem('linacre_ambient_muted', 'true');

    const newEngine = new AmbientAudioEngine();
    const state = newEngine.getState();
    expect(state.volume).toBe(0.72);
    expect(state.isMuted).toBe(true);
  });

  it('updates volume and persists to localStorage', () => {
    engine.setVolume(0.85);
    expect(engine.getState().volume).toBe(0.85);
    expect(localStorage.getItem('linacre_ambient_volume')).toBe('0.85');

    // Clamps out-of-range values
    engine.setVolume(1.5);
    expect(engine.getState().volume).toBe(1);

    engine.setVolume(-0.2);
    expect(engine.getState().volume).toBe(0);
  });

  it('automatically unmutes when volume is raised while muted', () => {
    engine.toggleMute();
    expect(engine.getState().isMuted).toBe(true);

    engine.setVolume(0.5);
    expect(engine.getState().isMuted).toBe(false);
    expect(localStorage.getItem('linacre_ambient_muted')).toBe('false');
  });

  it('toggles mute and persists to localStorage', () => {
    engine.toggleMute();
    expect(engine.getState().isMuted).toBe(true);
    expect(localStorage.getItem('linacre_ambient_muted')).toBe('true');

    engine.toggleMute();
    expect(engine.getState().isMuted).toBe(false);
    expect(localStorage.getItem('linacre_ambient_muted')).toBe('false');
  });

  it('notifies subscribers of state changes and allows unsubscribe', () => {
    const listener = vi.fn();
    const unsubscribe = engine.subscribe(listener);

    engine.setVolume(0.5);
    expect(listener).toHaveBeenCalledWith(expect.objectContaining({ volume: 0.5 }));

    unsubscribe();
    listener.mockClear();
    engine.setVolume(0.9);
    expect(listener).not.toHaveBeenCalled();
  });

  it('returns valid frequency data array from getVisualizerData', () => {
    const data = engine.getVisualizerData();
    expect(data).toBeInstanceOf(Uint8Array);
    expect(data.length).toBeGreaterThan(0);
  });

  it('handles pause cleanly and updates state', () => {
    engine.pause();
    expect(engine.getState().isPlaying).toBe(false);
    expect(localStorage.getItem('linacre_ambient_enabled')).toBe('false');
  });

  it('registers and cleans up auto-unlock event listener', () => {
    const addSpy = vi.spyOn(window, 'addEventListener');
    const removeSpy = vi.spyOn(window, 'removeEventListener');

    const cleanup = engine.registerAutoUnlockListener();
    expect(addSpy).toHaveBeenCalledWith('pointerdown', expect.any(Function));

    cleanup();
    expect(removeSpy).toHaveBeenCalledWith('pointerdown', expect.any(Function));
  });

  it('auto-unlock ignores interactions originating inside player controls', () => {
    const playSpy = vi.spyOn(engine, 'play').mockResolvedValue();
    engine.registerAutoUnlockListener();

    // Create player element with attribute
    const playerEl = document.createElement('div');
    playerEl.setAttribute('data-ambient-player', 'true');
    const btn = document.createElement('button');
    playerEl.appendChild(btn);
    document.body.appendChild(playerEl);

    // Dispatch pointerdown on button inside player
    const eventInside = new MouseEvent('pointerdown', { bubbles: true });
    btn.dispatchEvent(eventInside);
    expect(playSpy).not.toHaveBeenCalled();

    // Dispatch pointerdown outside player
    const outsideEl = document.createElement('div');
    document.body.appendChild(outsideEl);
    const eventOutside = new MouseEvent('pointerdown', { bubbles: true });
    outsideEl.dispatchEvent(eventOutside);
    expect(playSpy).toHaveBeenCalledTimes(1);

    document.body.removeChild(playerEl);
    document.body.removeChild(outsideEl);
  });

  it('prevents duplicate overlapping playback when play() is called while already playing', async () => {
    vi.spyOn(engine, 'loadAudio').mockResolvedValue(true);
    // Mock minimal AudioContext
    const mockCtx = {
      state: 'running',
      currentTime: 10,
      createGain: () => ({
        gain: {
          value: 1,
          setValueAtTime: vi.fn(),
          linearRampToValueAtTime: vi.fn(),
          setValueCurveAtTime: vi.fn(),
          setTargetAtTime: vi.fn(),
        },
        connect: vi.fn(),
        disconnect: vi.fn(),
      }),
      createAnalyser: () => ({
        fftSize: 64,
        smoothingTimeConstant: 0.8,
        connect: vi.fn(),
        getByteFrequencyData: vi.fn(),
      }),
      createBufferSource: () => ({
        buffer: null,
        connect: vi.fn(),
        disconnect: vi.fn(),
        start: vi.fn(),
        stop: vi.fn(),
      }),
      destination: {},
      resume: vi.fn().mockResolvedValue(undefined),
    };
    (engine as any).ctx = mockCtx;
    (engine as any).masterGain = mockCtx.createGain();
    (engine as any).buffer = { duration: 153.0 };

    await engine.play();
    expect(engine.getState().isPlaying).toBe(true);

    const startPlaybackSpy = vi.spyOn(engine as any, 'startPlayback');
    // Second play call should be a no-op
    await engine.play();
    expect(startPlaybackSpy).not.toHaveBeenCalled();
  });

  it('cancels playback start if pause is invoked while audio loading is in flight', async () => {
    let resolveLoad!: (val: boolean) => void;
    vi.spyOn(engine, 'loadAudio').mockImplementation(() => {
      return new Promise<boolean>(resolve => {
        resolveLoad = resolve;
      });
    });

    const playPromise = engine.play();
    // User changes mind and presses pause while load is pending
    engine.pause();
    resolveLoad(true);
    await playPromise;

    // Should remain paused
    expect(engine.getState().isPlaying).toBe(false);
  });

  it('updates volume and mute on HTMLMediaElement in fallback mode', () => {
    (engine as any).isFallbackMode = true;
    const mockAudio = {
      volume: 0.35,
      muted: false,
      loop: false,
      play: vi.fn().mockResolvedValue(undefined),
      pause: vi.fn(),
    };
    (engine as any).fallbackAudioA = mockAudio;

    engine.setVolume(0.8);
    expect(mockAudio.volume).toBe(0.8);

    engine.toggleMute();
    expect(mockAudio.muted).toBe(true);
    expect(mockAudio.volume).toBe(0);

    engine.toggleMute();
    expect(mockAudio.muted).toBe(false);
    expect(mockAudio.volume).toBe(0.8);

    engine.pause();
    expect(mockAudio.pause).toHaveBeenCalled();
  });
});
