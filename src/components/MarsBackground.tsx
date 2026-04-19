"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function MarsBackground() {
  const { scrollYProgress } = useScroll();
  
  // Smooth parallax movement
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 45]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.3, 0.6, 0.6, 0.3]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);

  const springY = useSpring(y, { stiffness: 100, damping: 25 });
  const springRotate = useSpring(rotate, { stiffness: 100, damping: 25 });
  const springScale = useSpring(scale, { stiffness: 100, damping: 25 });

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden select-none">
      {/* Primary Mars Body */}
      <motion.div
        style={{
          y: springY,
          rotate: springRotate,
          scale: springScale,
          opacity,
        }}
        className="absolute -right-1/4 -top-1/4 w-[100vw] h-[100vw] lg:w-[70vw] lg:h-[70vw] max-w-[1200px] max-h-[1200px]"
      >
        <Image
          src="/mars.png"
          alt="Mars Background"
          fill
          className="object-contain grayscale-[10%] sepia-[5%] brightness-[0.8]"
          priority
        />
        
        {/* Atmosphere Glow */}
        <div className="absolute inset-0 rounded-full bg-primary/5 blur-[100px]" />
      </motion.div>

      {/* Deep Space Dust / Stars (Subtle Particles) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:100px_100px] opacity-20" />
      
      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] opacity-40" />
    </div>
  );
}
