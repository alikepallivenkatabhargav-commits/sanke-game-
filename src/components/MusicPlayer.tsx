import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music2 } from 'lucide-react';
import { Track, DUMMY_TRACKS } from '../constants';

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.pause();
      else audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const handleSkip = (direction: 'next' | 'prev') => {
    let nextIndex;
    if (direction === 'next') {
      nextIndex = (currentTrackIndex + 1) % DUMMY_TRACKS.length;
    } else {
      nextIndex = (currentTrackIndex - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length;
    }
    setCurrentTrackIndex(nextIndex);
    setIsPlaying(true);
    // Audio source update triggers metadata load which we handle in useEffect
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log("Play interrupted by user or browser policy"));
      }
    }
  }, [currentTrackIndex, volume, isPlaying]);

  const onTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const onLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="w-full max-w-[400px] bg-black p-8 flex flex-col gap-8 font-mono">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={() => handleSkip('next')}
      />

      <div className="flex gap-6 items-center">
        <motion.div
          key={currentTrack.id}
          className="w-32 h-32 border-4 border-glitch-cyan relative overflow-hidden tear"
        >
          <img
            src={currentTrack.cover}
            alt={currentTrack.title}
            className="w-full h-full object-cover grayscale invert"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-glitch-magenta/20 mix-blend-overlay" />
        </motion.div>

        <div className="flex flex-col gap-2 overflow-hidden">
          <h3 className="text-2xl font-black italic tracking-tighter truncate text-glitch-cyan glitch-cyan" data-text={currentTrack.title}>
            {currentTrack.title}
          </h3>
          <p className="text-[10px] font-bold tracking-[0.4em] text-glitch-magenta truncate">
            {currentTrack.artist}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="relative w-full h-2 bg-glitch-cyan/20 border border-glitch-cyan/30 cursor-pointer" 
             onClick={(e) => {
               const rect = e.currentTarget.getBoundingClientRect();
               const x = e.clientX - rect.left;
               const clickedProgress = x / rect.width;
               if (audioRef.current) audioRef.current.currentTime = clickedProgress * duration;
             }}>
          <motion.div
            className="absolute top-0 left-0 h-full bg-glitch-magenta shadow-[0_0_15px_#ff00ff]"
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', bounce: 0, duration: 0.2 }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-glitch-cyan font-bold tracking-widest">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="flex justify-between items-center px-2">
        <button onClick={() => handleSkip('prev')} className="text-glitch-cyan hover:text-glitch-magenta transition-colors">
          <SkipBack size={32} />
        </button>

        <button
          onClick={togglePlay}
          className={`w-20 h-20 border-4 flex items-center justify-center transition-all ${
            isPlaying ? 'bg-glitch-cyan text-black border-glitch-cyan' : 'bg-black text-glitch-magenta border-glitch-magenta shadow-[4px_4px_0_#00ffff]'
          }`}
        >
          {isPlaying ? <Pause size={40} fill="currentColor" /> : <Play size={40} fill="currentColor" className="ml-2" />}
        </button>

        <button onClick={() => handleSkip('next')} className="text-glitch-cyan hover:text-glitch-magenta transition-colors">
          <SkipForward size={32} />
        </button>
      </div>

      {/* Extreme Visualizer */}
      <div className="flex items-end justify-center gap-1 h-12 border-t-2 border-glitch-cyan/20 pt-4">
        {[...Array(32)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              height: isPlaying ? [4, Math.random() * 40 + 4, 4] : 4,
              backgroundColor: isPlaying ? (Math.random() > 0.5 ? '#00ffff' : '#ff00ff') : '#00ffff44'
            }}
            transition={{
              duration: 0.2 + Math.random() * 0.3,
              repeat: Infinity,
              ease: "linear"
            }}
            className="w-2"
          />
        ))}
      </div>
    </div>
  );
}
