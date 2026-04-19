'use client';

import { useForm } from 'react-hook-form';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { RegisterCredentials } from '@/types/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { UserRound, Building2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Space_Grotesk } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] });

export default function RegisterPage() {
  const t = useTranslations('Auth');
  const router = useRouter();
  const locale = useLocale();
  const { register: registerAction } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<RegisterCredentials>({
    defaultValues: { role: 'Candidate' }
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: RegisterCredentials) => {
    setIsSubmitting(true);
    try {
      await registerAction(data);
    } catch (err: any) {
      // Error handling is inside useAuth
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full py-12">
      <div className="mb-10">
        <h2 className={cn(spaceGrotesk.className, "text-4xl font-black tracking-tighter text-foreground leading-[1.1]")}>
          {t('createNewAccount')}
        </h2>
        <p className="text-muted-foreground mt-3 text-xs uppercase tracking-[0.3em] font-bold opacity-60">
           Select your sector and establish credentials
        </p>
      </div>

      <div className="glass-card overflow-hidden rounded-[2.5rem] p-1 relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5 opacity-50 pointer-events-none" />
        
        <div className="p-8 lg:p-10 relative z-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            {/* Role Selector */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setValue('role', 'Candidate')}
                className={cn(
                  'flex flex-col items-center gap-3 p-5 rounded-2xl border transition-all tuff-motion group/btn',
                  selectedRole === 'Candidate'
                    ? 'border-primary bg-primary/10 shadow-[0_0_20px_rgba(var(--primary),0.1)]'
                    : 'border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20'
                )}
              >
                <div className={cn("p-2 rounded-lg transition-colors", selectedRole === 'Candidate' ? "bg-primary text-primary-foreground" : "bg-white/5 text-foreground/40")}>
                   <UserRound className="size-5" />
                </div>
                <span className={cn("text-[10px] font-black uppercase tracking-widest", selectedRole === 'Candidate' ? "text-primary" : "text-foreground/40")}>
                   {t('candidate')}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setValue('role', 'Organization')}
                className={cn(
                  'flex flex-col items-center gap-3 p-5 rounded-2xl border transition-all tuff-motion group/btn',
                  selectedRole === 'Organization'
                    ? 'border-primary bg-primary/10 shadow-[0_0_20px_rgba(var(--primary),0.1)]'
                    : 'border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20'
                )}
              >
                <div className={cn("p-2 rounded-lg transition-colors", selectedRole === 'Organization' ? "bg-primary text-primary-foreground" : "bg-white/5 text-foreground/40")}>
                   <Building2 className="size-5" />
                </div>
                <span className={cn("text-[10px] font-black uppercase tracking-widest", selectedRole === 'Organization' ? "text-primary" : "text-foreground/40")}>
                   {t('organization')}
                </span>
              </button>
            </div>

            {/* Dynamic Identity Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/70 ml-1">
                {selectedRole === 'Organization' ? t('organizationName') : t('fullName')}
              </label>
              <Input
                {...register('fullName', { 
                  required: selectedRole === 'Organization' ? 'Organization name is required' : 'Full name is required' 
                })}
                placeholder={selectedRole === 'Organization' ? 'CYBERDYNE SYSTEMS' : 'COMMANDER SHEPARD'}
                className="h-12 bg-white/5 border-white/10 focus:border-primary/50 focus:bg-white/10 transition-all font-bold rounded-xl shadow-inner-glow"
                disabled={isSubmitting}
              />
              {errors.fullName && <p className="text-destructive text-[10px] font-bold uppercase ml-1 animate-pulse">{errors.fullName.message}</p>}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/70 ml-1">{t('email')}</label>
              <Input
                {...register('email', { required: 'Email is required' })}
                type="email"
                placeholder="ACCESS_NODE@MARS.COM"
                className="h-12 bg-white/5 border-white/10 focus:border-primary/50 focus:bg-white/10 transition-all font-bold rounded-xl shadow-inner-glow"
                disabled={isSubmitting}
              />
              {errors.email && <p className="text-destructive text-[10px] font-bold uppercase ml-1 animate-pulse">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/70 ml-1">{t('password')}</label>
              <Input
                {...register('password', { required: 'Password is required' })}
                type="password"
                placeholder="SECURE_KEY_PHRASE"
                className="h-12 bg-white/5 border-white/10 focus:border-primary/50 focus:bg-white/10 transition-all font-bold rounded-xl shadow-inner-glow"
                disabled={isSubmitting}
              />
              {errors.password && <p className="text-destructive text-[10px] font-bold uppercase ml-1 animate-pulse">{errors.password.message}</p>}
            </div>

            <Button type="submit" className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-black tracking-[0.3em] uppercase rounded-2xl transition-all shadow-xl shadow-primary/20 mt-4 active:scale-95" disabled={isSubmitting}>
              {isSubmitting ? (
                <><Loader2 className="mr-3 size-5 animate-spin" /> {t('establishingCredentials')}</>
              ) : (
                t('register')
              )}
            </Button>
          </form>
        </div>

        <div className="px-10 py-8 bg-black/40 border-t border-white/5 flex flex-col items-center text-center">
            <button
                onClick={() => router.push(`/${locale}/login`)}
                className="group flex flex-col items-center gap-2"
            >
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/30 group-hover:text-foreground/50 transition-colors">
                    {t('alreadyHaveAccount')}
                </span>
                <span className="text-xs font-black uppercase tracking-widest text-primary border-b border-primary/20 pb-1 group-hover:border-primary transition-all">
                    {t('login')}
                </span>
            </button>
        </div>
      </div>
    </div>
  );
}
