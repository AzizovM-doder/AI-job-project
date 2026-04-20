"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import MarsGlobe from "@/components/MarsGlobe";
import { AlertCircle, RefreshCcw, Terminal as TerminalIcon } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { theme } = useTheme();
  const isTerminal = theme === "terminal";

  useEffect(() => {
    console.error("SYSTEM_FATAL_ERROR:", error);
  }, [error]);

  // Fallback translations (as we are outside the locale segment)
  const content = {
    title: isTerminal ? "SYSTEM MALFUNCTION" : "MISSION CRITICAL FAILURE",
    desc: "A catastrophic error has occurred in the sector downlink. Connection to Mars Base is unstable.",
    cta: isTerminal ? "/REBOOT_INTERFACE" : "Attempt Re-entry",
    reset: isTerminal ? "HARD_RESET" : "Return to Base"
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-6 bg-black overflow-hidden">
      {/* Background */}
      {isTerminal ? (
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-[linear-gradient(rgba(18,16,16,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(18,16,16,0.1)_1px,transparent_1px)] bg-[size:20px_20px] opacity-10" />
        </div>
      ) : (
        <MarsGlobe />
      )}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-xl"
      >
        {isTerminal ? (
          <div className="bg-black border-2 border-primary/50 p-8 font-mono shadow-[0_0_50px_rgba(0,255,65,0.1)]">
            <div className="flex items-center justify-between mb-8 border-b border-primary/20 pb-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="size-5 text-primary animate-pulse" />
                <span className="text-primary font-black uppercase tracking-[0.3em] text-xs">KERNEL_PANIC // 0x505</span>
              </div>
            </div>
            
            <h1 className="text-primary text-4xl font-black mb-6 tracking-tighter uppercase leading-none">
              {content.title}
            </h1>
            
            <div className="bg-primary/5 p-4 border border-primary/10 text-[10px] leading-relaxed text-primary/60 mb-10">
              EXCEPTION: {error.message || "UNKNOWN_INTERNAL_ERROR"}<br/>
              DIGEST: {error.digest || "N/A"}<br/>
              STATUS: CONNECTION_TERMINATED
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline"
                onClick={() => window.location.href = '/'}
                className="border-primary/30 text-primary hover:bg-primary/10 rounded-none h-14 uppercase font-black text-xs"
              >
                {content.reset}
              </Button>
              <Button 
                onClick={() => reset()}
                className="bg-primary hover:bg-primary/90 text-black font-black uppercase tracking-[0.2em] rounded-none h-14"
              >
                {content.cta}
              </Button>
            </div>
          </div>
        ) : (
          <div className="glass-card p-10 sm:p-14 rounded-[3rem] border-white/5 shadow-3xl backdrop-blur-3xl relative overflow-hidden text-center">
            <div className="size-20 rounded-2xl bg-destructive/10 flex items-center justify-center mb-8 mx-auto border border-destructive/20">
              <AlertCircle className="size-10 text-destructive" />
            </div>

            <h1 className="text-3xl font-heading font-black mb-4 tracking-tight uppercase">
              {content.title}
            </h1>
            
            <p className="text-muted-foreground text-sm mb-10 max-w-sm mx-auto opacity-70">
              {content.desc}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              <Button 
                variant="outline"
                size="lg"
                onClick={() => window.location.href = '/'}
                className="rounded-2xl h-14 px-8 border-white/5 bg-white/5 hover:bg-white/10 font-heading font-black uppercase text-[11px]"
              >
                {content.reset}
              </Button>
              <Button 
                size="lg"
                onClick={() => reset()}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-heading font-black uppercase rounded-2xl h-14 px-10 shadow-lg shadow-primary/20"
              >
                <RefreshCcw className="size-4 mr-2" />
                {content.cta}
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
