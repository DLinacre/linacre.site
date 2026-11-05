import React, { useEffect, useState, useRef, useId } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  ExternalLink,
  Music2,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { ambientAudio } from '../lib/ambientAudio';

interface AmbientMusicPlayerProps {
  className?: string;
  compact?: boolean;
}

const RESTING_LEVELS = [0.15, 0.15, 0.15, 0.15, 0.15];

export default function AmbientMusicPlayer({
  className = '',
  compact = false,
}: AmbientMusicPlayerProps) {
  const [audioState, setAudioState] = useState(() => ambientAudio.getState());
  const [visualLevels, setVisualLevels] = useState<number[]>(RESTING_LEVELS);
  const [showVolumePopup, setShowVolumePopup] = useState(false);
  const animationFrameRef = useRef<number | null>(null);
  const volumeToggleRef = useRef<HTMLButtonElement | null>(null);
  const sliderId = useId();

  // Subscribe to engine state updates and hook browser interaction auto-unlock.
  useEffect(() => {
    const unsubscribe = ambientAudio.subscribe(setAudioState);
    const cleanupUnlock = ambientAudio.registerAutoUnlockListener();
    return () => {
      unsubscribe();
      cleanupUnlock();
    };
  }, []);

  useEffect(() => {
    if (!showVolumePopup) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowVolumePopup(false);
        volumeToggleRef.current?.focus();
      }
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [showVolumePopup]);

  // Keep the equalizer expressive without forcing a React render on every frame.
  useEffect(() => {
    if (
      !audioState.isPlaying ||
      audioState.isMuted ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    let active = true;
    let lastPaint = 0;

    const updateVisualizer = (now: number) => {
      if (!active) return;

      if (now - lastPaint >= 80) {
        const freqData = ambientAudio.getVisualizerData();
        // Sample bass, low-mid, mid, high-mid and high frequency bands.
        const b0 = Math.max(0.15, (freqData[1] || 0) / 255);
        const b1 = Math.max(0.2, (freqData[3] || 0) / 255);
        const b2 = Math.max(0.25, (freqData[6] || 0) / 255);
        const b3 = Math.max(0.18, (freqData[10] || 0) / 255);
        const b4 = Math.max(0.15, (freqData[16] || 0) / 255);
        setVisualLevels([b0, b1, b2, b3, b4]);
        lastPaint = now;
      }

      animationFrameRef.current = requestAnimationFrame(updateVisualizer);
    };

    animationFrameRef.current = requestAnimationFrame(updateVisualizer);

    return () => {
      active = false;
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [audioState.isPlaying, audioState.isMuted]);

  const handlePlayToggle = () => {
    ambientAudio.togglePlay();
  };

  const handleMuteToggle = () => {
    ambientAudio.toggleMute();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value) / 100;
    ambientAudio.setVolume(newVol);
  };

  const currentVolumePercent = audioState.isMuted ? 0 : Math.round(audioState.volume * 100);

  return (
    <div
      className={`relative inline-flex items-center gap-1.5 sm:gap-2 rounded-xl border border-white/[0.08] bg-[#0d111e]/80 p-1 sm:px-2.5 sm:py-1 text-xs font-mono backdrop-blur-md shadow-[0_2px_12px_rgba(0,0,0,0.4)] transition-all ${
        audioState.isPlaying
          ? 'border-[#8fd6ff]/35 shadow-[0_0_15px_rgba(143,214,255,0.12)]'
          : 'hover:border-white/20'
      } ${className}`}
      role="region"
      aria-label="Ambient background music player"
    >
      {/* Play / Pause Button with Autoplay Prompt Glow */}
      <button
        type="button"
        onClick={handlePlayToggle}
        className={`relative inline-flex items-center justify-center h-7 w-7 rounded-lg border transition-all cursor-pointer ${
          audioState.isPlaying
            ? 'border-[#8fd6ff]/60 bg-[#8fd6ff]/15 text-[#8fd6ff] shadow-[0_0_8px_rgba(143,214,255,0.3)]'
            : 'border-white/[0.12] bg-white/[0.04] text-[#9aa3b2] hover:text-white hover:border-[#8fd6ff]/40 hover:bg-[#8fd6ff]/10'
        }`}
        title={
          audioState.isPlaying
            ? `Pause ${audioState.trackTitle}`
            : `Play continuous ambient music: ${audioState.trackTitle}`
        }
        aria-label={audioState.isPlaying ? 'Pause background music' : 'Play background music'}
      >
        {audioState.isLoading ? (
          <span className="h-3 w-3 animate-spin rounded-full border-2 border-[#8fd6ff] border-t-transparent" />
        ) : audioState.isPlaying ? (
          <Pause className="h-3 w-3 fill-current" />
        ) : (
          <Play className="h-3 w-3 fill-current ml-0.5" />
        )}
      </button>

      {/* Subtle Animated Soundwave / Equalizer Bars */}
      <div className="flex h-4 w-5 items-end gap-0.5 px-0.5 py-0.5" aria-hidden="true">
        {visualLevels.map((lvl, idx) => (
          <span
            key={idx}
            className={`w-[2.5px] rounded-full transition-all duration-75 ${
              audioState.isPlaying && !audioState.isMuted
                ? 'bg-gradient-to-t from-[#8fd6ff] to-[#c084fc] shadow-[0_0_6px_rgba(143,214,255,0.5)]'
                : 'bg-white/20'
            }`}
            style={{
              height: `${Math.round(lvl * 100)}%`,
              minHeight: '2px',
            }}
          />
        ))}
      </div>

      {/* Track Title Indicator with Suno External Link */}
      {!compact && (
        <div className="hidden md:flex items-center gap-1.5 pl-0.5 pr-1 text-[11px] text-[#9aa3b2] max-w-[150px] lg:max-w-[180px]">
          <Music2 className="h-3 w-3 text-[#8fd6ff] shrink-0" />
          <a
            href={audioState.sunoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="truncate text-[#eef1f6] hover:text-[#8fd6ff] transition-colors focus:outline-none focus:underline"
            title={`${audioState.trackTitle} by ${audioState.artist} on Suno (opens in new tab)`}
          >
            {audioState.trackTitle}
          </a>
          <a
            href={audioState.sunoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#6b7482] hover:text-[#8fd6ff] transition-colors shrink-0"
            title="Open on Suno"
            aria-label="Open track on Suno"
          >
            <ExternalLink className="h-2.5 w-2.5" />
          </a>
        </div>
      )}

      {/* Mute / Unmute Button */}
      <button
        type="button"
        onClick={handleMuteToggle}
        className={`inline-flex items-center justify-center h-6 w-6 rounded-md transition-colors cursor-pointer ${
          audioState.isMuted
            ? 'text-rose-400 hover:text-rose-300'
            : 'text-[#9aa3b2] hover:text-white'
        }`}
        title={audioState.isMuted ? 'Unmute music' : 'Mute music'}
        aria-label={audioState.isMuted ? 'Unmute background music' : 'Mute background music'}
      >
        {audioState.isMuted ? (
          <VolumeX className="h-3.5 w-3.5" />
        ) : (
          <Volume2 className="h-3.5 w-3.5" />
        )}
      </button>

      {/* Inline desktop slider plus an explicitly available touch control. */}
      <div className="hidden items-center gap-1.5 pl-0.5 sm:flex">
        <label htmlFor={sliderId} className="sr-only">
          Ambient music volume
        </label>
        <input
          id={sliderId}
          type="range"
          min="0"
          max="100"
          value={currentVolumePercent}
          onChange={handleVolumeChange}
          className="h-1.5 w-14 cursor-pointer appearance-none rounded-lg bg-white/10 accent-[#8fd6ff] focus:outline-none focus:ring-1 focus:ring-[#8fd6ff]/50"
          aria-label="Ambient music volume slider"
          title={`Volume: ${currentVolumePercent}%`}
        />
        <span className="w-6 text-[10px] tabular-nums text-[#6b7482]">{currentVolumePercent}%</span>
      </div>

      <button
        ref={volumeToggleRef}
        type="button"
        className="ambient-volume-toggle inline-flex items-center justify-center rounded-md text-[#9aa3b2] hover:text-white sm:hidden"
        aria-label={showVolumePopup ? 'Close music volume controls' : 'Adjust music volume'}
        aria-expanded={showVolumePopup}
        aria-controls={`${sliderId}-popover`}
        onClick={() => setShowVolumePopup(open => !open)}
      >
        <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
      </button>

      <div
        id={`${sliderId}-popover`}
        className={`${showVolumePopup ? 'flex' : 'hidden'} absolute left-0 top-full z-50 mt-2 min-w-[220px] items-center gap-2 rounded-xl border border-white/10 bg-[#0d111e]/95 p-3 shadow-xl backdrop-blur-md sm:hidden`}
        role="group"
        aria-label="Ambient music volume controls"
      >
        <label htmlFor={`${sliderId}-touch`} className="sr-only">
          Ambient music volume
        </label>
        <input
          id={`${sliderId}-touch`}
          type="range"
          min="0"
          max="100"
          value={currentVolumePercent}
          onChange={handleVolumeChange}
          className="h-2 min-w-0 flex-1 cursor-pointer appearance-none rounded-lg bg-white/10 accent-[#8fd6ff]"
          aria-valuetext={`${currentVolumePercent}%`}
        />
        <span className="w-9 text-right text-xs tabular-nums text-[#9aa3b2]">
          {currentVolumePercent}%
        </span>
        <button
          type="button"
          className="ambient-volume-close inline-flex items-center justify-center rounded-md text-[#9aa3b2] hover:text-white"
          aria-label="Close music volume controls"
          onClick={() => {
            setShowVolumePopup(false);
            volumeToggleRef.current?.focus();
          }}
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
