'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { Terminal, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  const t = useTranslations('Footer');
  const locale = useLocale();

  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">

          {/* Brand Column */}
          <div className="space-y-4 lg:col-span-1">
            <Link href={`/${locale}`} className="flex items-center gap-2 group">
              <div className="size-8 rounded-md bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-black text-sm">ai</span>
              </div>
              <span className="font-black tracking-tight">
                AIJOB<span className="text-primary">_SYS</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-[220px]">
              {t('tagline')}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="size-4" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="size-4" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="size-4" />
              </a>
            </div>
          </div>

          {/* Platform Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              {t('platform')}
            </h4>
            <ul className="space-y-2.5">
              <li><Link href={`/${locale}/jobs`} className="text-sm hover:text-primary transition-colors">{t('jobs')}</Link></li>
              <li><Link href={`/${locale}/feed`} className="text-sm hover:text-primary transition-colors">{t('feed')}</Link></li>
              <li><Link href={`/${locale}/ai/tools`} className="text-sm hover:text-primary transition-colors">{t('ai_tools')}</Link></li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              {t('company')}
            </h4>
            <ul className="space-y-2.5">
              <li><a href="#" className="text-sm hover:text-primary transition-colors">{t('about')}</a></li>
              <li><a href="#" className="text-sm hover:text-primary transition-colors">{t('contact')}</a></li>
              <li><a href="#" className="text-sm hover:text-primary transition-colors">{t('status')}</a></li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              {t('legal')}
            </h4>
            <ul className="space-y-2.5">
              <li><a href="#" className="text-sm hover:text-primary transition-colors">{t('terms')}</a></li>
              <li><a href="#" className="text-sm hover:text-primary transition-colors">{t('privacy')}</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {year} AIJOB_SYS. {t('rights')}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Terminal className="size-3.5" />
            <span>v2.0.0 / SYS:ONLINE</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
