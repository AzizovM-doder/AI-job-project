"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import MarsGlobe from "@/components/MarsGlobe";
import { Terminal as TerminalIcon, Home } from "lucide-react";

export default function GlobalNotFound() {
  const router = useRouter();
  const { theme } = useTheme();
  const isTerminal = theme === "terminal";

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-6 bg-black overflow-hidden">
      {/* Background */}
      {isTerminal ? (
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-20 pointer-events-none" />
        </div>
      ) : (
        <MarsGlobe />
      )}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-lg"
      >
        {isTerminal ? (
          <div className="bg-black border-2 border-primary/40 p-10 font-mono shadow-[0_0_30px_rgba(0,255,65,0.15)] relative overflow-hidden group">
            <div className="flex items-center gap-3 mb-6 border-b border-primary/20 pb-4">
              <TerminalIcon className="size-5 text-primary" />
              <span className="text-primary font-black uppercase tracking-widest text-xs">System Alert // IO_EXCEPTION</span>
            </div>
            
            <h1 className="text-primary text-3xl font-black mb-4 tracking-tighter leading-none">
              404: SECTOR_ABSENT
            </h1>
            
            <div className="bg-primary/5 p-4 border border-primary/10 mb-10 border-l-4 border-l-primary leading-relaxed">
              <p className="text-primary/70 text-xs">
                ERROR_CODE: 0x00000404<br/>
                STATUS: UNKNOWN_COORDINATES<br/>
                MESSAGE: The requested data node does not exist in the Martian directory.
              </p>
            </div>

            <Button 
              onClick={() => router.push("/")}
              className="w-full bg-primary hover:bg-primary/90 text-black font-black uppercase tracking-[0.2em] rounded-none h-14"
            >
              /INITIATE_HOME_DRIVE
            </Button>
            
            <div className="absolute inset-x-0 top-0 h-[2px] bg-primary/20 group-hover:top-full transition-all duration-[3s] linear infinite" />
          </div>
        ) : (
          <div className="glass-card p-10 sm:p-14 rounded-[3rem] border-white/5 shadow-3xl backdrop-blur-3xl relative overflow-hidden text-center">
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="size-20 rounded-full bg-primary/10 flex items-center justify-center mb-8 mx-auto border border-primary/20"
            >
              <div className="size-10 rounded-full bg-primary shadow-[0_0_30px_rgba(var(--primary),0.6)]" />
            </motion.div>

            <h1 className="text-4xl font-heading font-black mb-4 tracking-tight uppercase">
              LOST IN ORBIT
            </h1>
            
            <p className="text-muted-foreground text-sm mb-10 opacity-70 leading-relaxed max-w-[280px] mx-auto">
              The coordinate signature you followed has drifted out of sensor range.
            </p>

            <Button 
              size="lg"
              onClick={() => router.push("/")}
              className="min-w-[240px] bg-primary hover:bg-primary/90 text-primary-foreground font-heading font-black uppercase tracking-[0.15em] rounded-2xl h-14 shadow-lg shadow-primary/20 group overflow-hidden relative"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Home className="size-4" />
                Return to Baseline
              </span>
              <div className="absolute inset-x-0 bottom-0 h-0 bg-white/20 group-hover:h-full transition-all" />
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
