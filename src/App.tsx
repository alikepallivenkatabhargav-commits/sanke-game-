import React from 'react';
import { motion } from 'motion/react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Terminal, Cpu, Radio, Github } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen w-full bg-glitch-black text-glitch-cyan font-sans relative overflow-hidden flex flex-col items-center py-16 px-4">
      {/* Noise and Scanlines */}
      <div className="noise" />
      <div className="scanline" />

      {/* Cryptic Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-6xl flex flex-col md:flex-row justify-between items-start md:items-center mb-24 border-b-4 border-glitch-cyan pb-8 gap-8"
      >
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-glitch-magenta flex items-center justify-center tear">
              <Cpu size={32} className="text-black" />
            </div>
            <h1 
              className="text-6xl md:text-8xl font-display font-black italic glitch-cyan tracking-tighter" 
              data-text="NEON RHYTHM"
            >
              NEON <span className="text-glitch-magenta glitch-magenta">RHYTHM</span>
            </h1>
          </div>
          <p className="text-xs font-mono tracking-[0.5em] text-glitch-white/60">
            [IDENT: SYSTEM_REBUILD_INIT] // [AUTH: MACHINE_LEVEL_G]
          </p>
        </div>

        <nav className="flex gap-12 font-mono">
          {[
            { icon: Terminal, label: '01_CONSOLE' },
            { icon: Radio, label: '02_VOID' },
          ].map((item, i) => (
            <motion.a
              key={i}
              whileHover={{ x: -10, color: '#ff00ff' }}
              className="flex items-center gap-3 text-sm font-bold tracking-widest cursor-pointer"
            >
              <item.icon size={18} />
              {item.label}
            </motion.a>
          ))}
        </nav>
      </motion.header>

      {/* Main Grid */}
      <main className="w-full max-w-7xl grid grid-cols-1 xl:grid-cols-[1fr_450px] gap-20 items-start">
        {/* Snake Interface */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center"
        >
          <div className="raw-border p-2 bg-glitch-magenta/5">
            <div className="bg-glitch-black p-4 md:p-12 border-2 border-glitch-magenta/20">
               <SnakeGame />
            </div>
          </div>
        </motion.section>

        {/* System Side */}
        <motion.aside
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col gap-12"
        >
          <div className="raw-border p-2">
            <MusicPlayer />
          </div>

          {/* Machine Log */}
          <div className="bg-glitch-cyan p-1">
            <div className="bg-glitch-black p-8 font-mono text-[11px] leading-relaxed flex flex-col gap-4">
              <div className="flex justify-between border-b border-glitch-cyan/30 pb-2">
                <span className="text-glitch-cyan font-bold italic underline">KERN_OUTPUT</span>
                <span className="animate-pulse">_READING</span>
              </div>
              <div className="flex flex-col gap-2 opacity-80">
                <p>{`> STREAM_REBUILD: COMPLETE`}</p>
                <p className="text-glitch-magenta">{`> VISUAL_BUFFER: OVERWRITTEN`}</p>
                <p>{`> NOISE_INJECTION: ACTIVE`}</p>
                <p>{`> SYSTEM_STATE: CRYPTIC`}</p>
              </div>
              <div className="pt-4 border-t border-glitch-cyan/30 flex items-center gap-4">
                <div className="w-3 h-3 bg-glitch-magenta animate-ping" />
                <span className="text-glitch-magenta font-bold">WARNING: SENSORY_OVERLOAD_IMMUTABLE</span>
              </div>
            </div>
          </div>
        </motion.aside>
      </main>

      <footer className="mt-40 w-full max-w-6xl border-t-2 border-glitch-cyan/20 pt-12 mb-20 flex justify-between items-center text-[10px] tracking-[1em] opacity-30">
        <span>VOID_DATA // 2026</span>
        <Github size={16} className="cursor-pointer hover:text-glitch-magenta" />
      </footer>
    </div>
  );
}
