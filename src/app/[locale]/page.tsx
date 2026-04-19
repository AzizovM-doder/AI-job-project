'use client';

import { Container } from '@/components/ui/Container';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { ArrowRight, Terminal, Globe, Shield, Orbit, Zap, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Space_Grotesk } from 'next/font/google';
import { cn } from '@/lib/utils';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] });

export default function HomePage() {
  const t = useTranslations('HomePage');
  const locale = useLocale();

  return (
    <div className="flex flex-col space-y-32 py-20 relative z-10">

      {/* Hero Section */}
      <section className="text-center">
        <Container className="max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, type: "spring", stiffness: 100, damping: 25 }}
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass border border-primary/20 text-[10px] font-black tracking-[0.3em] uppercase mb-12"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            {t('hero.badge')}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 1, type: "spring", stiffness: 100, damping: 20 }}
            className={cn(spaceGrotesk.className, "text-7xl md:text-9xl font-black tracking-tighter leading-[0.9] uppercase text-white")}
          >
            {t('hero.headline1')}<br />
            <span className="text-primary italic">
              {t('hero.headline2')}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mt-12 font-medium"
          >
            {t('hero.description')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, type: "spring", stiffness: 100, damping: 25 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-16"
          >
            <Link href={`/${locale}/jobs`} className="w-full sm:w-auto">
              <Button size="lg" className="w-full h-14 px-10 font-black uppercase tracking-widest text-[10px] gap-3 rounded-full bg-primary text-primary-foreground hover:scale-105 transition-transform active:scale-95">
                {t('hero.cta_browse')} <ArrowRight className="size-4" />
              </Button>
            </Link>
            <Link href={`/${locale}/register`} className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full h-14 px-10 font-bold uppercase tracking-widest text-[10px] rounded-full glass border-white/20 hover:bg-white/10 transition-all text-white">
                {t('hero.cta_register')}
              </Button>
            </Link>
          </motion.div>
        </Container>
      </section>

      {/* Metrics Section */}
      <section className="w-full">
        <Container className="max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 rounded-3xl overflow-hidden glass border border-white/10">
            {[
              { value: '10K+', label: t('stats.candidates'), icon: Orbit },
              { value: '500+', label: t('stats.organizations'), icon: Shield },
              { value: '3', label: t('stats.languages'), icon: Globe },
            ].map((stat, i) => (
              <motion.div
                key={i}
                whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                className={cn(
                  "flex flex-col items-center justify-center py-10 px-8 transition-colors",
                  i < 2 && "md:border-r border-white/5"
                )}
              >
                <stat.icon className="size-5 text-primary/40 mb-3" />
                <span className={cn(spaceGrotesk.className, "text-4xl font-black text-white italic")}>{stat.value}</span>
                <span className="text-[10px] text-primary font-bold uppercase tracking-[0.3em] mt-2 opacity-60">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Features Showcase */}
      <section className="w-full py-20">
        <Container>
          <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
            <div className="space-y-4 max-w-xl">
              <p className="text-primary font-black uppercase tracking-[0.4em] text-[10px]">
                {t('capabilities')}
              </p>
              <h2 className={cn(spaceGrotesk.className, "text-5xl font-black tracking-tight uppercase text-white leading-none")}>
                Advanced <br /> Martian Protocols
              </h2>
            </div>
            <p className="text-white/40 text-sm max-w-sm uppercase tracking-widest leading-loose font-medium border-l border-white/10 pl-8">
              Decentralized hiring, AI-assisted skill matching, and orbital communication arrays.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Terminal, title: t('features.ai_title'), desc: t('features.ai_desc'), accent: "primary" },
              { icon: Zap, title: t('features.network_title'), desc: t('features.network_desc'), accent: "primary" },
              { icon: BarChart3, title: t('features.secure_title'), desc: t('features.secure_desc'), accent: "primary" },
            ].map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group flex flex-col gap-8 p-10 rounded-[2.5rem] glass-card hover:bg-white/[0.05] transition-all border border-white/5 hover:border-primary/30"
              >
                <div className="size-14 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-[0_0_30px_rgba(var(--primary),0.3)] group-hover:scale-110 transition-transform duration-500">
                  <Icon className="size-7" />
                </div>
                <div className="space-y-4">
                  <h3 className={cn(spaceGrotesk.className, "font-black uppercase tracking-tight text-xl text-white")}>
                    {title}
                  </h3>
                  <p className="text-sm text-white/50 leading-relaxed font-medium">
                    {desc}
                  </p>
                </div>
                <div className="mt-auto pt-8">
                  <div className="h-px w-0 group-hover:w-full bg-primary transition-all duration-700" />
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Footer CTA */}
      <section className="w-full pb-32">
        <Container className="max-w-4xl">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative rounded-[3rem] glass p-16 text-center space-y-8 overflow-hidden group border border-white/10"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-primary/20 rounded-full blur-[120px] -z-10 animate-pulse-glow" />
            
            <h2 className={cn(spaceGrotesk.className, "text-6xl font-black uppercase tracking-tighter text-white")}>
              {t('cta_ready')}
            </h2>
            <p className="text-white/40 max-w-md mx-auto text-sm uppercase tracking-widest font-medium">
              {t('cta_desc')}
            </p>
            <div className="flex justify-center pt-4">
              <Link href={`/${locale}/register`} className="w-full sm:w-auto">
                <Button size="lg" className="w-full h-16 px-12 font-black uppercase tracking-[0.3em] text-[10px] gap-4 rounded-full bg-primary text-primary-foreground shadow-2xl">
                  {t('hero.cta_register')} <ArrowRight className="size-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </Container>
      </section>

    </div>
  );
}
