'use client';

import { useForm } from 'react-hook-form';
import { useAuth } from '@/hooks/useAuth';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation'
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoginCredentials } from '@/types/auth';
import { useState } from 'react';
import { Space_Grotesk } from 'next/font/google';
import { cn } from '@/lib/utils';
import { ChevronRight, ShieldCheck } from 'lucide-react';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] });

export default function LoginPage() {
  const t = useTranslations('Auth');
  const locale = useLocale();
  const router = useRouter();
  const { login } = useAuth();
  const { register, handleSubmit } = useForm<LoginCredentials>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: LoginCredentials) => {
    setIsSubmitting(true);
    try {
      await login(data);
    } catch (err: unknown) {
      // Error handling is inside useAuth
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 mb-6"
        >
          <ShieldCheck className="w-6 h-6 text-primary" />
        </motion.div>
        <h2 className={cn(spaceGrotesk.className, "text-4xl font-black tracking-tighter text-foreground leading-[1.1]")}>
          {t('terminalAccess')}
        </h2>
        <p className="text-muted-foreground mt-3 text-xs uppercase tracking-[0.3em] font-bold opacity-60">
          {t('authRequired')}
        </p>
      </div>

      <div className="glass-card overflow-hidden rounded-[2.5rem] p-1 relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5 opacity-50 pointer-events-none" />
        
        <div className="p-8 lg:p-10 relative z-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/70 ml-1">
                {t('email')}
              </label>
              <Input
                {...register('email', { required: true })}
                type="email"
                placeholder="PROPER_ID@MARS.COM"
                className="h-14 bg-white/5 border-white/10 focus:border-primary/50 focus:bg-white/10 transition-all font-bold tracking-tight placeholder:opacity-20 rounded-2xl shadow-inner-glow"
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between ml-1">
                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/70">
                  {t('password')}
                </label>
                <Link 
                  href={`/${locale}/forgot-password`} 
                  className="text-[10px] font-black uppercase tracking-widest text-foreground/40 hover:text-primary transition-colors"
                >
                  {t('forgotPassword')}
                </Link>
              </div>
              <Input
                {...register('password', { required: true })}
                type="password"
                placeholder="••••••••"
                className="h-14 bg-white/5 border-white/10 focus:border-primary/50 focus:bg-white/10 transition-all font-bold rounded-2xl shadow-inner-glow"
                disabled={isSubmitting}
              />
            </div>

            <Button
              type="submit"
              className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-black tracking-[0.3em] uppercase rounded-2xl transition-all group scale-100 active:scale-95 shadow-xl shadow-primary/20"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center space-x-3">
                  <span className="w-5 h-5 border-2 border-primary-foreground/20 border-t-primary-foreground rounded-full animate-spin" />
                  <span className="animate-pulse">SYNCHRONIZING...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center space-x-3">
                  <span>{t('signIn')}</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </form>
        </div>

        <div className="px-10 py-8 bg-black/40 border-t border-white/5 flex flex-col items-center text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/30 mb-6 italic">
                {t('externalClearanceRequired')}
            </p>
            <Button
              variant="outline"
              onClick={() => router.push(`/${locale}/register`)}
              className="w-full border-white/10 bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl h-12 tuff-motion"
            >
              {t('createNewAccount')}
            </Button>
        </div>
      </div>

      <div className="mt-12 text-center pointer-events-none">
        <p className="text-[10px] text-foreground/40 uppercase tracking-[0.4em] font-black opacity-30">
           © 2026 Martian Unified Recruitment Services
        </p>
      </div>
    </div>
  );
}
