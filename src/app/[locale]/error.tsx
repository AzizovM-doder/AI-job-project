"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import MarsGlobe from "@/components/MarsGlobe";
import { AlertCircle, Terminal, RefreshCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("Errors");
  const { theme } = useTheme();
  const isTerminal = theme === "terminal";

  useEffect(() => {
    // Log the error to an error reporting service
    console.error("SYSTEM_FATAL_ERROR:", error);
  }, [error]);

  return (
    <div className="relative min-h-[100vh] w-full flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Background */}
      {isTerminal ? (
        <div className="absolute inset-0 bg-black z-0">
          <div className="w-full h-full bg-[linear-gradient(rgba(18,16,16,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(18,16,16,0.1)_1px,transparent_1px)] bg-[size:20px_20px] opacity-10" />
        </div>
      ) : (
        <MarsGlobe />
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-xl"
      >
        {isTerminal ? (
          /* KERNEL PANIC / TERMINAL ERROR */
          <div className="bg-black border-2 border-destructive/50 p-8 rounded-none font-mono shadow-[0_0_50px_rgba(255,0,0,0.15)] relative">
            <div className="flex items-center justify-between mb-8 border-b border-destructive/20 pb-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="size-5 text-destructive animate-pulse" />
                <span className="text-destructive font-black uppercase tracking-[0.3em] text-xs">CRITICAL // KERNEL_PANIC</span>
              </div>
              <span className="text-destructive/40 text-[9px]">SIGTERM: 0xDEADBEEF</span>
            </div>
            
            <h1 className="text-destructive text-4xl font-black mb-6 tracking-tighter uppercase leading-none">
              {t("error_title")}
            </h1>
            
            <div className="space-y-4 mb-10 overflow-hidden">
              <p className="text-destructive/90 text-sm font-bold">
                {t("error_description")}
              </p>
              
              <div className="bg-destructive/5 p-4 border border-destructive/10 text-[10px] leading-relaxed text-destructive/60 font-mono">
                [SYSTEM_STACK_DUMP]<br/>
                LOCATION: {window?.location?.pathname || "ROOT"}<br/>
                INTERFACE: ROVER_V2_UPLINK<br/>
                EXCEPTION: {error.message || "UNKNOWN_INTERNAL_ERROR"}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button 
                variant="outline"
                onClick={() => window.location.reload()}
                className="border-destructive/30 text-destructive hover:bg-destructive/10 rounded-none h-14 uppercase font-black text-xs tracking-widest"
              >
                Full Hard Reset
              </Button>
              <Button 
                onClick={() => reset()}
                className="bg-destructive hover:bg-destructive/90 text-white font-black uppercase tracking-[0.2em] rounded-none h-14"
              >
                <RefreshCcw className="mr-2 size-4" /> REBOOT_APP
              </Button>
            </div>
          </div>
        ) : (
          /* CINEMATIC ALERT CARD */
          <div className="glass-card p-10 sm:p-14 rounded-[3rem] border-destructive/10 shadow-3xl backdrop-blur-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-5">
               <AlertCircle className="size-48 text-destructive" />
            </div>

            <div className="relative z-10 flex flex-col items-center text-center">
              <motion.div 
                animate={{ 
                  scale: [1, 1.05, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 5, repeat: Infinity }}
                className="size-20 rounded-2xl bg-destructive/10 flex items-center justify-center mb-8 border border-destructive/20 shadow-inner"
              >
                <AlertCircle className="size-10 text-destructive" />
              </motion.div>

              <h1 className="text-3xl sm:text-4xl font-heading font-black mb-4 tracking-tight uppercase text-foreground">
                {t("error_title")}
              </h1>
              
              <p className="text-muted-foreground text-sm sm:text-base mb-10 leading-relaxed max-w-sm">
                {t("error_description")}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                <Button 
                  variant="outline"
                  size="lg"
                  onClick={() => window.location.href = '/'}
                  className="rounded-2xl h-14 px-8 border-white/5 bg-white/5 hover:bg-white/10 font-heading font-black uppercase tracking-widest text-[11px]"
                >
                  Baseline
                </Button>
                <Button 
                  size="lg"
                  onClick={() => reset()}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-heading font-black uppercase tracking-[0.15em] rounded-2xl h-14 px-10 shadow-lg shadow-primary/20 group relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <RefreshCcw className="size-4 group-hover:rotate-180 transition-transform duration-500" />
                    {t("error_cta")}
                  </span>
                  <div className="absolute inset-x-0 bottom-0 h-0 bg-white/20 group-hover:h-full transition-all" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
