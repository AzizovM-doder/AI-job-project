"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Space_Grotesk } from "next/font/google";
import { cn } from "@/lib/utils";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-transparent overflow-hidden selection:bg-primary/30">
      {/* Left Side: Cinematic Area (Empty to show MarsGlobe) */}
      <div className="relative hidden w-1/2 lg:flex items-center justify-center overflow-hidden">
        <div className="relative z-10 text-center px-12">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 100, damping: 25 }}
          >
            <h1 className={cn(spaceGrotesk.className, "text-7xl font-black text-white tracking-tighter uppercase leading-none drop-shadow-2xl")}>
              Mars <br /> <span className="text-primary">Job</span>
            </h1>
            <div className="mt-6 flex items-center justify-center space-x-4">
              <div className="h-px w-12 bg-white/20" />
              <p className="text-white/40 text-sm font-medium tracking-[0.3em] uppercase italic">
                Red Planet Network
              </p>
              <div className="h-px w-12 bg-white/20" />
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 2 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-2"
          >
            <div className="w-0.5 h-32 bg-gradient-to-b from-primary/0 via-primary/50 to-primary/0" />
            <span className="text-[10px] text-white/20 tracking-[0.5em] uppercase vertical-text">
              Establishing Connection
            </span>
          </motion.div>
        </div>
        
        {/* Subtle Gradient to improve form readability on the right */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent pointer-events-none" />
      </div>

      {/* Right Side: Auth Forms */}
      <div className="relative flex w-full flex-col items-center justify-center p-8 lg:w-1/2 bg-background/20 backdrop-blur-md border-l border-white/5">
        <motion.div
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, type: "spring", stiffness: 100, damping: 25 }}
          className="w-full max-w-md"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
