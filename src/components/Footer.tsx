'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { 
  Terminal, 
  Twitter, 
  Linkedin, 
  Github, 
  Orbit, 
  Compass, 
  ShieldCheck, 
  Cpu,
  Globe
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Space_Grotesk } from 'next/font/google';
import { useState, useEffect } from 'react';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] });

export default function Footer() {
  const t = useTranslations('Footer');
  const locale = useLocale();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const year = mounted ? new Date().getFullYear() : 2026;

  return (
    <footer className="relative z-20 pb-12 pt-20 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[300px] bg-primary/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[200px] bg-accent/5 rounded-full blur-[100px] -z-10" />

      <div className={cn("max-w-7xl mx-auto px-4 md:px-8", spaceGrotesk.className)}>
        <div className="glass-card rounded-[3rem] p-12 lg:p-16 border-white/5 bg-background/5 backdrop-blur-2xl shadow-2xl relative overflow-hidden group">
          {/* Subtle Scanline Effect */}
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_4px,3px_100%] opacity-20" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 relative z-10">
            {/* Brand Column */}
            <div className="lg:col-span-4 space-y-8">
              <Link href={`/${locale}`} className="flex items-center gap-4 group/logo">
                <div className="size-14 rounded-2xl bg-primary flex items-center justify-center shadow-[0_0_30px_rgba(var(--primary),0.3)] transition-transform duration-500 group-hover/logo:scale-110">
                  <Orbit className="text-primary-foreground size-8" />
                </div>
                <div>
                   <h3 className="text-2xl font-black tracking-tighter uppercase leading-none">
                     Mars <span className="text-primary">Job</span>
                   </h3>
                   <p className="text-[10px] font-black tracking-[0.4em] uppercase text-primary/60 mt-2">
                     Establishing New Horizons
                   </p>
                </div>
              </Link>
              
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs font-medium opacity-70">
                {t('tagline') || "The premier professional network for the Martian colonization era. Connecting pioneers across the Red Planet."}
              </p>

              <div className="flex items-center gap-4">
                {[
                  { icon: Twitter, href: "#" },
                  { icon: Linkedin, href: "#" },
                  { icon: Github, href: "#" },
                  { icon: Globe, href: "#" }
                ].map((social, i) => (
                  <motion.a
                    key={i}
                    href={social.href}
                    whileHover={{ scale: 1.2, y: -5 }}
                    className="size-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors"
                  >
                    <social.icon className="size-5" />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Links Columns */}
            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
              <div className="space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/80">
                  {t('platform') || "Exploration"}
                </h4>
                <ul className="space-y-4">
                  <li><Link href={`/${locale}/jobs`} className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"><Compass className="size-4 opacity-0 group-hover:opacity-100 -ml-6 group-hover:ml-0 transition-all" /> {t('jobs') || "Missions"}</Link></li>
                  <li><Link href={`/${locale}/feed`} className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"><Orbit className="size-4 opacity-0 group-hover:opacity-100 -ml-6 group-hover:ml-0 transition-all" /> {t('feed') || "Main Hub"}</Link></li>
                  <li><Link href={`/${locale}/networking`} className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"><Cpu className="size-4 opacity-0 group-hover:opacity-100 -ml-6 group-hover:ml-0 transition-all" /> {t('networking') || "Crew Registry"}</Link></li>
                </ul>
              </div>

              <div className="space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/80">
                  {t('company') || "Sector 7"}
                </h4>
                <ul className="space-y-4">
                  <li><a href="#" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">{t('about') || "Mars Initiative"}</a></li>
                  <li><a href="#" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">{t('contact') || "Comms Tower"}</a></li>
                  <li><a href="#" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">{t('status') || "Uptime Monitor"}</a></li>
                </ul>
              </div>

              <div className="space-y-6 col-span-2 sm:col-span-1">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/80">
                  {t('legal') || "Protocols"}
                </h4>
                <ul className="space-y-4">
                  <li><a href="#" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"><ShieldCheck className="size-4 text-emerald-500/60" /> {t('privacy') || "Security"}</a></li>
                  <li><a href="#" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">{t('terms') || "Bylaws"}</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50">
                Mars-Surface Data Link: <span className="text-primary/70">CONNECTED</span>
              </p>
            </div>
            
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-50">
              © {year} Martian Unified Recruitment Services (MURS). {t('rights') || "All Galactic Rights Reserved."}
            </p>

            <div className="flex items-center gap-4 bg-white/5 rounded-full px-5 py-2 border border-white/10">
              <div className="flex items-center gap-2 text-[10px] font-black text-primary/80 tracking-widest uppercase">
                <Terminal className="size-3" />
                <span>v3.1.0-STABLE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
