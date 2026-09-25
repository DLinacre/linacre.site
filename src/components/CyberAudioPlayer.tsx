import { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Repeat, 
  Shuffle, 
  Music, 
  Sparkles, 
  FileUp, 
  Radio, 
  BookOpen, 
  ListMusic
} from 'lucide-react';
import { properMadTracks, Track } from '../data/musicTracks';
import { resolveAssetUrl } from '../lib/assetHelper';
import { audioFx } from '../lib/audioFx';

interface CyberAudioPlayerProps {
  onPlayingChange?: (isPlaying: boolean, currentTrackTitle: string) => void;
}

export default function CyberAudioPlayer({ onPlayingChange }: CyberAudioPlayerProps) {
  const [tracks, setTracks] = useState<Track[]>(properMadTracks);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [dspMode, setDspMode] = useState<'neutral' | 'bass' | 'vocal'>('neutral');
  const [activeTab, setActiveTab] = useState<'lyrics' | 'playlist' | 'story'>('lyrics');
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const biquadFilterRef = useRef<BiquadFilterNode | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animFrameId = useRef<number | null>(null);
  const lyricsContainerRef = useRef<HTMLDivElement | null>(null);

  const currentTrack = tracks[currentIdx] || tracks[0];

  // Notify parent on status change
  useEffect(() => {
    onPlayingChange?.(isPlaying, currentTrack.title);
  }, [isPlaying, currentTrack.title, onPlayingChange]);

  // Audio Context & Analyser Initialization
  const setupAudioContext = () => {
    if (audioCtxRef.current || !audioRef.current) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      analyser.smoothingTimeConstant = 0.8;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowshelf';
      filter.frequency.value = 250;
      filter.gain.value = 0;

      const source = ctx.createMediaElementSource(audioRef.current);
      source.connect(filter);
      filter.connect(analyser);
      analyser.connect(ctx.destination);

      audioCtxRef.current = ctx;
      analyserRef.current = analyser;
      biquadFilterRef.current = filter;
      sourceNodeRef.current = source;
    } catch {
      // Browsers may restrict Web Audio before user gesture or cross-origin
    }
  };

  // DSP Filter adjustment
  useEffect(() => {
    if (!biquadFilterRef.current) return;
    if (dspMode === 'bass') {
      biquadFilterRef.current.type = 'lowshelf';
      biquadFilterRef.current.frequency.value = 200;
      biquadFilterRef.current.gain.value = 8;
    } else if (dspMode === 'vocal') {
      biquadFilterRef.current.type = 'peaking';
      biquadFilterRef.current.frequency.value = 2500;
      biquadFilterRef.current.gain.value = 5;
    } else {
      biquadFilterRef.current.gain.value = 0;
    }
  }, [dspMode]);

  // Visualizer Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const renderVisualizer = () => {
      animFrameId.current = requestAnimationFrame(renderVisualizer);
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      if (analyserRef.current && isPlaying) {
        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyserRef.current.getByteFrequencyData(dataArray);

        const barWidth = (width / bufferLength) * 0.8;
        let x = (width - bufferLength * (barWidth + 2)) / 2;

        for (let i = 0; i < bufferLength; i++) {
          const val = dataArray[i];
          const percent = val / 255;
          const barHeight = Math.max(4, percent * height * 0.9);
          
          // Neon gradient from Cyan to Hot Pink
          const grad = ctx.createLinearGradient(0, height, 0, height - barHeight);
          grad.addColorStop(0, '#00f3ff');
          grad.addColorStop(0.5, '#c084fc');
          grad.addColorStop(1, '#ff007f');

          ctx.fillStyle = grad;
          ctx.shadowBlur = 8;
          ctx.shadowColor = 'rgba(192, 132, 252, 0.6)';
          ctx.fillRect(x, height - barHeight, barWidth, barHeight);

          x += barWidth + 2;
        }
      } else {
        // Idle ambient waves
        const barCount = 24;
        const barWidth = 4;
        const totalW = barCount * (barWidth + 3);
        let x = (width - totalW) / 2;
        const time = Date.now() * 0.003;

        for (let i = 0; i < barCount; i++) {
          const barHeight = Math.sin(time + i * 0.4) * 8 + 12;
          ctx.fillStyle = 'rgba(192, 132, 252, 0.25)';
          ctx.shadowBlur = 0;
          ctx.fillRect(x, height - barHeight, barWidth, barHeight);
          x += barWidth + 3;
        }
      }
    };

    renderVisualizer();
    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [isPlaying]);

  // Track playback handlers
  const handlePlay = async () => {
    setupAudioContext();
    if (audioCtxRef.current?.state === 'suspended') {
      await audioCtxRef.current.resume();
    }
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        setIsPlaying(false);
      });
    }
  };

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      handlePause();
    } else {
      handlePlay();
    }
  };

  const handleTrackSelect = (index: number) => {
    audioFx.playClick();
    setCurrentIdx(index);
    setCurrentTime(0);
    setTimeout(() => {
      handlePlay();
    }, 50);
  };

  const handlePrev = () => {
    audioFx.playClick();
    if (currentTime > 3) {
      if (audioRef.current) audioRef.current.currentTime = 0;
      setCurrentTime(0);
      return;
    }
    const prevIdx = (currentIdx - 1 + tracks.length) % tracks.length;
    setCurrentIdx(prevIdx);
    setTimeout(() => handlePlay(), 50);
  };

  const handleNext = () => {
    audioFx.playClick();
    let nextIdx = (currentIdx + 1) % tracks.length;
    if (isShuffle) {
      nextIdx = Math.floor(Math.random() * tracks.length);
    }
    setCurrentIdx(nextIdx);
    setTimeout(() => handlePlay(), 50);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      if (audioRef.current.duration && !isNaN(audioRef.current.duration)) {
        setDuration(audioRef.current.duration);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    setIsMuted(val === 0);
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.volume = volume || 0.8;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  // Local File Upload
  const handleLocalFileDrop = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    const newCustomTrack: Track = {
      id: `local-${Date.now()}`,
      title: file.name.replace(/\.[^/.]+$/, ''),
      artist: 'David Linacre Local Rig',
      album: 'Rig Audio Deck',
      genre: 'Custom Master',
      duration: '--:--',
      durationSec: 0,
      audioFile: objectUrl,
      coverFile: 'music/covers/barnsley-town.jpg',
      bpm: 'User BPM',
      model: 'Custom Audio File',
      story: `Custom local audio track loaded from ${file.name}.`,
      lyrics: []
    };

    setTracks(prev => [newCustomTrack, ...prev]);
    setCurrentIdx(0);
    setTimeout(() => handlePlay(), 100);
  };

  // Active Lyric calculation
  const activeLyricIndex = useMemo(() => {
    if (!currentTrack.lyrics || currentTrack.lyrics.length === 0) return -1;
    return currentTrack.lyrics.findIndex(l => currentTime >= l.start && currentTime <= l.end);
  }, [currentTrack.lyrics, currentTime]);

  // Scroll active lyric into view smoothly
  useEffect(() => {
    if (activeLyricIndex >= 0 && lyricsContainerRef.current) {
      const activeEl = lyricsContainerRef.current.children[activeLyricIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [activeLyricIndex]);

  const formatSeconds = (sec: number) => {
    if (isNaN(sec) || sec < 0) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="w-full space-y-6">
      
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={resolveAssetUrl(currentTrack.audioFile)}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onEnded={handleNext}
        loop={isLooping}
        preload="metadata"
      />

      {/* Main Studio Deck Container */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0d1222]/90 p-5 sm:p-7 shadow-2xl backdrop-blur-2xl">
        
        {/* Glow Accent */}
        <div className="absolute -top-32 -left-32 h-64 w-64 rounded-full bg-purple-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 h-64 w-64 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />

        {/* Top Header Bar */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-purple-500/30 bg-purple-500/15 text-purple-300 shadow-[0_0_12px_rgba(192,132,252,0.3)]">
              <Music className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-mono text-base font-bold uppercase tracking-wider text-white">
                  PROPER MAD // STUDIO AUDIO DECK
                </h2>
                <span className="rounded bg-pink-500/20 px-2 py-0.5 text-[0.65rem] font-bold text-pink-300">
                  SUNO V6 MASTER
                </span>
              </div>
              <p className="text-xs text-slate-400">
                David Linacre • Northern Rap, Acoustic Storytelling & UK Comedy Anthems
              </p>
            </div>
          </div>

          {/* DSP & Load Local Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* DSP Mode Selector */}
            <div className="flex items-center rounded-xl border border-white/10 bg-white/5 p-1 text-xs font-mono">
              <button
                onClick={() => setDspMode('neutral')}
                className={`rounded-lg px-2.5 py-1 transition-all ${
                  dspMode === 'neutral' ? 'bg-purple-500/30 text-white font-semibold shadow' : 'text-slate-400 hover:text-white'
                }`}
                title="Studio Flat EQ"
              >
                Flat
              </button>
              <button
                onClick={() => setDspMode('bass')}
                className={`rounded-lg px-2.5 py-1 transition-all ${
                  dspMode === 'bass' ? 'bg-pink-500/30 text-pink-300 font-semibold shadow' : 'text-slate-400 hover:text-white'
                }`}
                title="Cyber Bass Boost (+8dB @ 200Hz)"
              >
                Bass+
              </button>
              <button
                onClick={() => setDspMode('vocal')}
                className={`rounded-lg px-2.5 py-1 transition-all ${
                  dspMode === 'vocal' ? 'bg-cyan-500/30 text-cyan-300 font-semibold shadow' : 'text-slate-400 hover:text-white'
                }`}
                title="Vocal & Lyric Presence (+5dB @ 2.5kHz)"
              >
                Vocal
              </button>
            </div>

            {/* Load Local Track */}
            <label className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-mono font-medium text-cyan-300 transition-all hover:bg-cyan-500/20 hover:border-cyan-500/50 shadow-[0_0_10px_rgba(56,189,248,0.2)]">
              <FileUp className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Load Audio File</span>
              <input
                type="file"
                accept="audio/*"
                onChange={handleLocalFileDrop}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Center Section: Cover Art, Visualizer, & Interactive Tabs */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6">
          
          {/* Left Column: Cover & Spectrum Visualizer (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col items-center gap-4">
            
            {/* Album Cover with Glass Reflection & Status Badge */}
            <div className="relative group w-full max-w-[280px] sm:max-w-[320px] aspect-square rounded-2xl overflow-hidden border border-white/15 bg-black/40 shadow-2xl">
              <img
                src={resolveAssetUrl(currentTrack.coverFile)}
                alt={currentTrack.title}
                className={`h-full w-full object-cover transition-transform duration-700 ${
                  isPlaying ? 'scale-105' : 'scale-100 group-hover:scale-102'
                }`}
                onError={(e) => {
                  // Fallback to placeholder if cover isn't loaded
                  (e.target as HTMLImageElement).src = resolveAssetUrl('music/covers/barnsley-town.jpg');
                }}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

              {/* Live Status Pill */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/60 px-3 py-1 text-[0.68rem] font-mono text-white backdrop-blur-md">
                <Radio className={`h-3 w-3 ${isPlaying ? 'text-emerald-400 animate-pulse' : 'text-slate-400'}`} />
                <span>{isPlaying ? 'PLAYING MASTER' : 'PAUSED'}</span>
              </div>

              {/* BPM & Model Chip */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[0.68rem] font-mono text-slate-300">
                <span className="rounded bg-black/60 px-2 py-0.5 border border-white/10 backdrop-blur-md">
                  {currentTrack.bpm}
                </span>
                <span className="rounded bg-black/60 px-2 py-0.5 border border-white/10 backdrop-blur-md text-cyan-300">
                  {currentTrack.genre}
                </span>
              </div>
            </div>

            {/* Real-Time Neon Frequency Spectrum */}
            <div className="w-full max-w-[320px] rounded-xl border border-white/10 bg-[#090d18]/80 p-2 shadow-inner">
              <canvas
                ref={canvasRef}
                width={300}
                height={48}
                className="w-full h-12 rounded"
              />
            </div>

          </div>

          {/* Right Column: Track Info, Tab Content (Lyrics/Playlist/Story), & Full Controls (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-5">
            
            {/* Track Title & Metadata */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-mono text-2xl sm:text-3xl font-black tracking-tight text-white">
                  {currentTrack.title}
                </h3>
              </div>
              <p className="text-sm font-semibold text-purple-300">
                {currentTrack.artist} • <span className="text-slate-400 font-normal">{currentTrack.album}</span>
              </p>
            </div>

            {/* Navigation Tabs for Right Column */}
            <div className="flex items-center gap-2 border-b border-white/10 pb-2">
              <button
                onClick={() => setActiveTab('lyrics')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                  activeTab === 'lyrics'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Live Lyrics</span>
              </button>

              <button
                onClick={() => setActiveTab('playlist')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                  activeTab === 'playlist'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ListMusic className="h-3.5 w-3.5" />
                <span>Tracklist ({tracks.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('story')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                  activeTab === 'story'
                    ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <BookOpen className="h-3.5 w-3.5" />
                <span>Liner Notes</span>
              </button>
            </div>

            {/* Tab Body: High-utility scrolling content */}
            <div className="relative h-48 sm:h-56 overflow-hidden rounded-2xl border border-white/10 bg-[#090d18]/60 p-4">
              
              {/* Tab 1: Live Timestamped Lyrics */}
              {activeTab === 'lyrics' && (
                <div 
                  ref={lyricsContainerRef}
                  className="h-full overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-purple-500/30"
                >
                  {currentTrack.lyrics && currentTrack.lyrics.length > 0 ? (
                    currentTrack.lyrics.map((l, idx) => {
                      const isActive = idx === activeLyricIndex;
                      return (
                        <div
                          key={idx}
                          onClick={() => {
                            if (audioRef.current) {
                              audioRef.current.currentTime = l.start;
                              setCurrentTime(l.start);
                              handlePlay();
                            }
                          }}
                          className={`cursor-pointer rounded-xl px-3 py-1.5 text-sm transition-all duration-300 ${
                            isActive
                              ? 'bg-purple-500/25 text-white font-bold scale-[1.02] border-l-4 border-purple-400 shadow-[0_0_12px_rgba(192,132,252,0.3)] pl-4'
                              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{l.text}</span>
                            <span className="text-[0.65rem] font-mono text-slate-500">
                              {formatSeconds(l.start)}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center text-center text-slate-400 space-y-2">
                      <Music className="h-6 w-6 text-slate-500" />
                      <p className="text-xs">No timestamped lyrics available for this track.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: Playlist Table */}
              {activeTab === 'playlist' && (
                <div className="h-full overflow-y-auto space-y-1.5 pr-2 scrollbar-thin scrollbar-thumb-cyan-500/30">
                  {tracks.map((t, idx) => {
                    const isSelected = idx === currentIdx;
                    return (
                      <div
                        key={t.id}
                        onClick={() => handleTrackSelect(idx)}
                        className={`flex items-center justify-between gap-3 rounded-xl px-3 py-2 cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-200 shadow-[0_0_10px_rgba(56,189,248,0.2)]'
                            : 'text-slate-300 hover:bg-white/5 hover:text-white border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-3 truncate">
                          <span className="font-mono text-xs text-slate-500 w-4">
                            {idx + 1}
                          </span>
                          <span className="font-semibold text-xs sm:text-sm truncate">
                            {t.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 font-mono text-xs text-slate-400 shrink-0">
                          <span className="hidden sm:inline text-[0.68rem] text-slate-500">{t.bpm}</span>
                          <span>{t.duration}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Tab 3: Backstory & Liner Notes */}
              {activeTab === 'story' && (
                <div className="h-full overflow-y-auto pr-2 space-y-3 scrollbar-thin scrollbar-thumb-pink-500/30">
                  <div className="rounded-xl border border-pink-500/20 bg-pink-500/10 p-3 text-xs text-pink-200 leading-relaxed font-sans">
                    <span className="font-bold uppercase tracking-wider block font-mono mb-1 text-pink-300">
                      Story & Inspiration
                    </span>
                    {currentTrack.story || 'David Linacre executive production.'}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="rounded-lg bg-white/5 p-2 text-slate-300">
                      <span className="text-slate-500 block text-[0.68rem]">GENERATION MODEL</span>
                      {currentTrack.model}
                    </div>
                    <div className="rounded-lg bg-white/5 p-2 text-slate-300">
                      <span className="text-slate-500 block text-[0.68rem]">PRIMARY GENRE</span>
                      {currentTrack.genre}
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Scrub Bar & Timestamp */}
            <div className="space-y-1.5 pt-2">
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1.5 bg-slate-700/60 rounded-lg appearance-none cursor-pointer accent-purple-400 hover:accent-cyan-400 transition-colors"
                style={{
                  background: `linear-gradient(to right, #c084fc 0%, #00f3ff ${
                    duration ? (currentTime / duration) * 100 : 0
                  }%, rgba(255,255,255,0.1) ${duration ? (currentTime / duration) * 100 : 0}%)`
                }}
              />
              <div className="flex items-center justify-between font-mono text-[0.72rem] text-slate-400">
                <span>{formatSeconds(currentTime)}</span>
                <span>{formatSeconds(duration || currentTrack.durationSec || 0)}</span>
              </div>
            </div>

            {/* Bottom Transport Controls Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              
              {/* Shuffle & Repeat */}
              <div className="flex items-center gap-1 text-slate-400">
                <button
                  onClick={() => setIsShuffle(prev => !prev)}
                  className={`p-2 rounded-lg transition-all ${
                    isShuffle ? 'text-cyan-300 bg-cyan-500/20' : 'hover:text-white hover:bg-white/5'
                  }`}
                  title={isShuffle ? 'Shuffle Active' : 'Enable Shuffle'}
                >
                  <Shuffle className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setIsLooping(prev => !prev)}
                  className={`p-2 rounded-lg transition-all ${
                    isLooping ? 'text-pink-300 bg-pink-500/20' : 'hover:text-white hover:bg-white/5'
                  }`}
                  title={isLooping ? 'Loop Single Active' : 'Enable Loop'}
                >
                  <Repeat className="h-4 w-4" />
                </button>
              </div>

              {/* Main Playback Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrev}
                  className="p-2.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-all active:scale-95"
                  title="Previous Track"
                >
                  <SkipBack className="h-5 w-5" />
                </button>

                <button
                  onClick={handleTogglePlay}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-purple-500 via-pink-500 to-cyan-400 text-white shadow-[0_0_20px_rgba(192,132,252,0.5)] transition-all hover:scale-105 active:scale-95"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? (
                    <Pause className="h-5 w-5 fill-current" />
                  ) : (
                    <Play className="h-5 w-5 fill-current ml-0.5" />
                  )}
                </button>

                <button
                  onClick={handleNext}
                  className="p-2.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-all active:scale-95"
                  title="Next Track"
                >
                  <SkipForward className="h-5 w-5" />
                </button>
              </div>

              {/* Volume Slider */}
              <div className="flex items-center gap-2 text-slate-400">
                <button
                  onClick={toggleMute}
                  className="p-1.5 hover:text-white transition-colors"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? (
                    <VolumeX className="h-4 w-4 text-pink-400" />
                  ) : (
                    <Volume2 className="h-4 w-4 text-emerald-400" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.02"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-16 sm:w-20 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
