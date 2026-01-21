import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const ScrambleText = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  const [display, setDisplay] = useState('');
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@%&*';

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const start = Date.now();
    
    const update = () => {
      const now = Date.now();
      if (now - start < delay) {
        timeout = setTimeout(update, 100);
        return;
      }

      const progress = Math.min((now - start - delay) / 1000, 1);
      
      let result = '';
      for (let i = 0; i < text.length; i++) {
        if (progress * text.length > i) {
          result += text[i];
        } else {
          result += chars[Math.floor(Math.random() * chars.length)];
        }
      }
      
      setDisplay(result);
      
      if (progress < 1) {
        timeout = setTimeout(update, 50);
      }
    };

    update();
    return () => clearTimeout(timeout);
  }, [text, delay]);

  return <span className="font-mono">{display}</span>;
};

export const Loader: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 bg-[#050505] flex items-center justify-center overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />

      <div className="relative flex flex-col items-center justify-center w-full max-w-lg">
        
        {/* The Core Eye/Iris Animation */}
        <div className="relative w-64 h-64 mb-12">
            {/* Outer Ring */}
            <motion.div 
              className="absolute inset-0 border border-cyan-500/20 rounded-full"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
            
            {/* Rotating Segments */}
            <motion.div 
              className="absolute inset-2 border-t-2 border-r-2 border-cyan-500/60 rounded-full"
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
            
            <motion.div 
              className="absolute inset-6 border-b-2 border-l-2 border-indigo-500/60 rounded-full"
              initial={{ rotate: 0 }}
              animate={{ rotate: -360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />

            {/* Central Iris Assembly */}
            <div className="absolute inset-0 flex items-center justify-center">
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-16 bg-cyan-400/80 rounded-full blur-[1px]"
                        style={{ transformOrigin: "center bottom" }}
                        initial={{ opacity: 0, height: 0, rotate: i * 60 }}
                        animate={{ opacity: [0, 1, 0.5], height: [0, 64, 40] }}
                        transition={{ delay: 0.5 + i * 0.1, duration: 1.5 }}
                    />
                ))}
                
                {/* Core Pulse */}
                <motion.div
                    className="w-4 h-4 bg-white rounded-full shadow-[0_0_20px_rgba(6,182,212,0.8)]"
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.5, 1] }}
                    transition={{ delay: 1.2, duration: 0.5 }}
                />
            </div>
        </div>

        {/* Text Decryption */}
        <div className="relative z-10 text-center space-y-4">
          <motion.h1 
            className="text-6xl md:text-8xl font-display font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-slate-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
          >
            <ScrambleText text="VERITEX" delay={1500} />
          </motion.h1>

          <motion.div 
            className="flex flex-col items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2 }}
          >
            <div className="flex items-center gap-3 text-xs font-mono text-cyan-500 tracking-[0.2em]">
                <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
                <ScrambleText text="INITIALIZING NEURAL CORE..." delay={2200} />
            </div>
            
            {/* High-tech Loading Bar */}
            <div className="w-64 h-1 bg-slate-900 rounded-full overflow-hidden mt-4 relative">
                <motion.div 
                    className="absolute inset-y-0 left-0 bg-cyan-500 shadow-[0_0_10px_#06b6d4]"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 0.5, duration: 3, ease: "easeInOut" }}
                />
            </div>
            
            <motion.div 
                className="flex justify-between w-64 text-[10px] text-slate-600 font-mono mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5 }}
            >
                <span>V.2.6.0</span>
                <span>SECURE_CONNECTION</span>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Cinematic Vignette & Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050505_90%)] pointer-events-none" />
      </div>
    </div>
  );
};