import { getTranslations, getLocale } from 'next-intl/server';
import { Button } from '@/components/ui/button';
import { ArrowRight, Terminal, Globe, Shield } from 'lucide-react';
import Link from 'next/link';

export default async function HomePage() {
  const t = await getTranslations('HomePage');
  const locale = await getLocale();

  return (
    <div className="flex flex-col space-y-24 py-16">

      {/* Hero */}
      <section className="text-center space-y-8 max-w-4xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-xs font-bold tracking-widest uppercase">
          <span className="size-2 rounded-full bg-primary animate-pulse" />
          {t('hero.badge')}
        </div>

        <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[1.05] uppercase">
          {t('hero.headline1')}{' '}
          <span className="gradient-text">
            {t('hero.headline2')}
          </span>
        </h1>

        <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          {t('hero.description')}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link href={`/${locale}/jobs`}>
            <Button size="lg" className="h-12 px-8 font-bold uppercase tracking-wider text-xs gap-2">
              {t('hero.cta_browse')} <ArrowRight className="size-4" />
            </Button>
          </Link>
          <Link href={`/${locale}/register`}>
            <Button size="lg" variant="outline" className="h-12 px-8 font-bold uppercase tracking-wider text-xs">
              {t('hero.cta_register')}
            </Button>
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-3 gap-0 max-w-2xl mx-auto w-full border border-border rounded-lg overflow-hidden">
        {[
          { value: '10K+', label: t('stats.candidates') },
          { value: '500+', label: t('stats.organizations') },
          { value: '3', label: t('stats.languages') },
        ].map((stat, i) => (
          <div key={i} className={`flex flex-col items-center justify-center py-6 px-4 bg-card ${i < 2 ? 'border-r border-border' : ''}`}>
            <span className="text-2xl font-black text-primary">{stat.value}</span>
            <span className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">{stat.label}</span>
          </div>
        ))}
      </section>

      {/* Features Grid */}
      <section className="max-w-6xl mx-auto px-4 w-full space-y-8">
        <div className="text-center space-y-2">
          <p className="sub-label">{t('capabilities')}</p>
          <h2 className="text-3xl font-bold tracking-tight uppercase">{t('built_for_pro')}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Terminal, title: t('features.ai_title'), desc: t('features.ai_desc'), color: 'text-primary' },
            { icon: Globe, title: t('features.network_title'), desc: t('features.network_desc'), color: 'text-accent' },
            { icon: Shield, title: t('features.secure_title'), desc: t('features.secure_desc'), color: 'text-primary' },
          ].map(({ icon: Icon, title, desc, color }, i) => (
            <div key={i} className="group flex flex-col gap-4 p-6 rounded-lg border border-border bg-card hover:border-primary/40 transition-all hover:shadow-lg hover:shadow-primary/5">
              <div className={`size-10 rounded-md bg-primary/10 flex items-center justify-center ${color}`}>
                <Icon className="size-5" />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold uppercase tracking-tight text-sm">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-4xl mx-auto px-4 w-full">
        <div className="relative rounded-xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-accent/10 p-10 text-center space-y-6 overflow-hidden">
          <div className="absolute inset-0 bg-grid-primary/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
          <h2 className="relative text-3xl font-black uppercase tracking-tighter">{t('cta_ready')}</h2>
          <p className="relative text-muted-foreground max-w-md mx-auto text-sm">
            {t('cta_desc')}
          </p>
          <div className="relative flex justify-center gap-3">
            <Link href={`/${locale}/register`}>
              <Button size="lg" className="font-bold uppercase tracking-wider text-xs gap-2 h-11 px-8">
                {t('hero.cta_register')} <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}