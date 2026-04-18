'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TerminalBootEffectProps {
  isActive: boolean;
}

export const TerminalBootEffect: React.FC<TerminalBootEffectProps> = ({ isActive }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  // Matrix Effect
  useEffect(() => {
    if (!isActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = new Array(columns).fill(1);

    const characters = '0123456789ABCDEF';

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#00FF41'; // Matrix Green
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33);
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, [isActive]);

  // System Logs & Progress
  useEffect(() => {
    if (!isActive) {
      setLogs([]);
      setProgress(0);
      return;
    }

    const logStatements = [
      "INITIALIZING CORE KERNEL...",
      "LOADING NEURAL INTERFACE...",
      "ESTABLISHING SECURE HANDSHAKE...",
      "MOUNTING ENCRYPTED VOLUMES...",
      "CHECKING SYSTEM INTEGRITY...",
      "BYPASSING SECURITY PROTOCOLS...",
      "ACCESSING DATA NODES...",
      "LOADING TERMINAL UI COMPONENTS...",
      "READY FOR INPUT."
    ];

    let currentLog = 0;
    const logInterval = setInterval(() => {
      if (currentLog < logStatements.length) {
        setLogs(prev => [...prev, `[OK] ${logStatements[currentLog]}`].slice(-8));
        currentLog++;
      }
    }, 200);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100;
        return prev + (100 / (2000 / 50)); // Approx 2 seconds
      });
    }, 50);

    return () => {
      clearInterval(logInterval);
      clearInterval(progressInterval);
    };
  }, [isActive]);

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-black overflow-hidden flex flex-col items-center justify-center font-mono"
        >
          {/* Matrix Background */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 opacity-40 pointer-events-none"
          />

          {/* Content Overlay */}
          <div className="relative z-10 w-full max-w-2xl px-8 flex flex-col gap-6">
            {/* Logo */}
            <div className="text-[#00FF41] text-4xl font-bold tracking-tighter self-start mb-4">
              <pre className="leading-tight">
{`   _    ___       _  ____  ____  
  / \\  |_ _]     | |/ __ \\| __ ] 
 / o \\  | |      | | [  ] | |__] 
/_/ \\_\\[___]  \\__| |\\____/|____] `}
              </pre>
            </div>

            {/* Logs Area */}
            <div className="text-[#00FF41]/80 text-sm h-40 overflow-hidden flex flex-col justify-end gap-1 border-l-2 border-[#00FF41]/20 pl-4">
              {logs.map((log, i) => (
                <div key={i} className="flex gap-2">
                  <span className="opacity-50">[{new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
                  <span className="text-[#00FF41]">{log}</span>
                </div>
              ))}
            </div>

            {/* Progress Bar Area */}
            <div className="w-full flex flex-col gap-2">
              <div className="flex justify-between text-[#00FF41] text-xs font-bold uppercase tracking-widest">
                <span>Initializing Core...</span>
                <span>{Math.floor(progress)}%</span>
              </div>
              <div className="w-full h-8 border-2 border-[#00FF41] p-1 flex items-center">
                <div 
                  className="h-full bg-[#00FF41] transition-all duration-75 ease-out flex items-center overflow-hidden"
                  style={{ width: `${progress}%` }}
                >
                  <div className="w-full text-black font-black text-center whitespace-nowrap text-xs">
                    LOADING ACCESS
                  </div>
                </div>
              </div>
              <div className="text-[#00FF41]/40 text-[10px] text-center uppercase tracking-widest">
                Authorized Personnel Only | System Version 4.0.2-LTS
              </div>
            </div>
          </div>

          {/* Glitch Overlay Effect */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] opacity-60" />
          <div className="absolute inset-0 pointer-events-none border-[20px] border-black" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
