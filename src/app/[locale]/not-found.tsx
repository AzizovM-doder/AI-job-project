"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import MarsGlobe from "@/components/MarsGlobe";
import { Terminal } from "lucide-react";

export default function NotFound() {
  const t = useTranslations("Errors");
  const router = useRouter();
  const { theme } = useTheme();
  const isTerminal = theme === "terminal";

  return (
    <div className="relative min-h-[100vh] w-full flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Visual background based on theme */}
      {isTerminal ? (
        <div className="absolute inset-0 bg-black z-0">
          <div className="w-full h-full bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-20 pointer-events-none" />
        </div>
      ) : (
        <MarsGlobe />
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-lg"
      >
        {isTerminal ? (
          /* Terminal Aesthetics */
          <div className="bg-black border-2 border-primary/40 p-8 rounded-none font-mono shadow-[0_0_30px_rgba(0,255,65,0.15)] relative overflow-hidden group">
            <div className="flex items-center gap-3 mb-6 border-b border-primary/20 pb-4">
              <Terminal className="size-5 text-primary" />
              <span className="text-primary font-black uppercase tracking-widest text-xs">System Alert // IO_EXCEPTION</span>
            </div>
            
            <h1 className="text-primary text-3xl font-black mb-4 tracking-tighter leading-none">
              {t("404_title")}
            </h1>
            
            <div className="bg-primary/5 p-4 border border-primary/10 mb-8 border-l-4 border-l-primary">
              <p className="text-primary/70 text-xs leading-relaxed">
                ERROR_CODE: 0x00000404<br/>
                STATUS: DIRECTORY_NOT_FOUND<br/>
                MESSAGE: {t("404_description")}
              </p>
            </div>

            <Button 
              onClick={() => router.push("/")}
              className="w-full bg-primary hover:bg-primary/90 text-black font-black uppercase tracking-[0.2em] rounded-none h-14"
            >
              /EXECUTE_BOOT_SEQUENCE
            </Button>
            
            {/* Decorative scanline for the card */}
            <div className="absolute inset-x-0 top-0 h-[2px] bg-primary/20 group-hover:top-full transition-all duration-[3s] linear infinite" />
          </div>
        ) : (
          /* Lost in Space Aesthetics */
          <div className="glass-card p-10 sm:p-14 rounded-[2.5rem] flex flex-col items-center text-center border-white/10 shadow-2xl backdrop-blur-3xl">
            <motion.div 
              animate={{ 
                rotate: 360,
                y: [0, -10, 0]
              }}
              transition={{ 
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
              }}
              className="size-24 rounded-full bg-primary/20 flex items-center justify-center mb-8 border border-primary/30"
            >
              <div className="size-12 rounded-full bg-primary shadow-[0_0_40px_rgba(var(--primary),0.5)]" />
            </motion.div>

            <h1 className="text-3xl sm:text-4xl font-heading font-black mb-6 tracking-tight uppercase">
              {t("404_title")}
            </h1>
            
            <p className="text-muted-foreground text-sm sm:text-base mb-10 leading-relaxed max-w-xs">
              {t("404_description")}
            </p>

            <Button 
              size="lg"
              onClick={() => router.push("/")}
              className="min-w-[240px] bg-primary hover:bg-primary/90 text-primary-foreground font-heading font-black uppercase tracking-[0.15em] rounded-2xl h-14 shadow-lg shadow-primary/20 group overflow-hidden relative"
            >
              <span className="relative z-10">{t("404_cta")}</span>
              <div className="absolute inset-x-0 bottom-0 h-0 bg-white/20 group-hover:h-full transition-all" />
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
