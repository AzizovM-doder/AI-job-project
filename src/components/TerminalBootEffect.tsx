'use client';

import React, { useEffect, useRef, useState, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { useTranslations } from 'next-intl';
import * as THREE from 'three';

interface TerminalBootEffectProps {
  isActive: boolean;
}

function WireframeMars() {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useLoader(THREE.TextureLoader, "/mars.jpg");

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.4;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial 
        wireframe
        color="#00ff41"
        emissive="#00ff41"
        emissiveIntensity={1}
      />
    </mesh>
  );
}

export const TerminalBootEffect: React.FC<TerminalBootEffectProps> = ({ isActive }) => {
  const t = useTranslations('Terminal');
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  // System Logs & Progress
  useEffect(() => {
    if (!isActive) {
      setLogs(prev => prev.length > 0 ? [] : prev);
      setProgress(prev => prev > 0 ? 0 : prev);
      return;
    }

    const logStatements = [
      t('secure_uplink'),
      t('scanning_nodes'),
      t('decrypting_console'),
      t('calibrating_models'),
      t('syncing_data'),
      t('overriding_light'),
      t('interface_ready')
    ];

    let currentLog = 0;
    const logInterval = setInterval(() => {
      if (currentLog < logStatements.length) {
        setLogs(prev => [...prev, `[PROCESS] ${logStatements[currentLog]}`].slice(-6));
        currentLog++;
      }
    }, 250);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100;
        return prev + 2.5; 
      });
    }, 50);

    return () => {
      clearInterval(logInterval);
      clearInterval(progressInterval);
    };
  }, [isActive, t]);

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[10000] bg-black overflow-hidden flex flex-col items-center justify-center font-mono"
        >
          <div className="absolute inset-0 z-0 flex items-center justify-center opacity-40">
            <Canvas>
               <Suspense fallback={null}>
                  <PerspectiveCamera makeDefault position={[0, 0, 2.5]} />
                  <ambientLight intensity={0.5} />
                  <pointLight position={[10, 10, 10]} intensity={2} color="#00ff41" />
                  <WireframeMars />
               </Suspense>
            </Canvas>
          </div>

          <div className="absolute inset-0 z-10 bg-[linear-gradient(to_right,#00ff4105_1px,transparent_1px),linear-gradient(to_bottom,#00ff4105_1px,transparent_1px)] bg-[size:40px_40px]" />

          <div className="relative z-20 w-full max-w-lg px-6 flex flex-col gap-12 items-center">
            
            <div className="relative w-64 h-64 flex items-center justify-center">
               <motion.div 
                 animate={{ rotate: 360 }}
                 transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                 className="absolute inset-0 border-2 border-dashed border-[#00ff4130] rounded-full"
               />
               <motion.div 
                 animate={{ scale: [1, 1.1, 1] }}
                 transition={{ duration: 2, repeat: Infinity }}
                 className="text-[#00ff41] text-[10px] font-black tracking-[0.5em] uppercase"
               >
                 {t('uplinking')}
               </motion.div>
               
               <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#00ff41]" />
               <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#00ff41]" />
               <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#00ff41]" />
               <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#00ff41]" />
            </div>

            <div className="w-full h-32 flex flex-col gap-1">
              {logs.map((log, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex gap-4 text-[10px]"
                >
                  <span className="text-[#00ff41] opacity-40">:: {new Date().toLocaleTimeString([], { hour12: false, second: '2-digit' })}</span>
                  <span className="text-[#00ff41] font-bold tracking-widest">{log}</span>
                </motion.div>
              ))}
            </div>

            <div className="w-full flex flex-col gap-3">
              <div className="flex justify-between text-[#00ff41] text-[9px] font-black uppercase tracking-[0.3em]">
                <span>{t('status_sequence')}</span>
                <span>{Math.floor(progress)}% {t('status_complete')}</span>
              </div>
              <div className="h-1 w-full bg-[#00ff4120] relative overflow-hidden rounded-full">
                <motion.div 
                  className="absolute inset-y-0 left-0 bg-[#00ff41]"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          <div className="absolute inset-0 pointer-events-none z-50 opacity-10">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] animate-scanline" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
