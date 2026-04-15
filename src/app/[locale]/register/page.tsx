'use client';

import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { authService } from '@/src/services/auth.service';
import { RegisterCredentials } from '@/src/types/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { UserRound, Building2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function RegisterPage() {
  const t = useTranslations('Auth');
  const router = useRouter();
  const locale = useLocale();

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<RegisterCredentials>({
    defaultValues: { role: 'Candidate' }
  });

  const selectedRole = watch('role');

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      localStorage.setItem('accessToken', data.data.accessToken);
      localStorage.setItem('refreshToken', data.data.refreshToken);
      
      toast.success('Registration Successful', {
        description: 'Identity created. Welcome to the network.'
      });

      if (data.data.role === 'Organization') {
        router.push(`/${locale}/organization/dashboard`);
      } else {
        router.push(`/${locale}/candidate/dashboard`);
      }
    },
    onError: (err: any) => {
      // Backend returns { message: "..." } on 400
      const msg = err.response?.data?.message || err.response?.data?.description?.[0] || 'Registration failed. Please try again.';
      toast.error('Registration Failed', {
        description: msg
      });
    }
  });

  const onSubmit = (data: RegisterCredentials) => {
    setError(null);
    registerMutation.mutate(data);
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 min-h-[80vh]">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">{t('createNewAccount')}</CardTitle>
          <CardDescription>Select your role and fill in your details below</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* Role Selector */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setValue('role', 'Candidate')}
                className={cn(
                  'flex flex-col items-center gap-2 p-4 rounded-md border-2 text-xs font-bold uppercase tracking-wider transition-all',
                  selectedRole === 'Candidate'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                )}
              >
                <UserRound className="size-5" />
                {t('candidate')}
              </button>
              <button
                type="button"
                onClick={() => setValue('role', 'Organization')}
                className={cn(
                  'flex flex-col items-center gap-2 p-4 rounded-md border-2 text-xs font-bold uppercase tracking-wider transition-all',
                  selectedRole === 'Organization'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                )}
              >
                <Building2 className="size-5" />
                {t('organization')}
              </button>
            </div>

            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider">Full Name</label>
              <Input
                {...register('fullName', { required: 'Full name is required' })}
                placeholder="John Doe"
                disabled={registerMutation.isPending}
              />
              {errors.fullName && <p className="text-destructive text-xs">{errors.fullName.message}</p>}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider">{t('email')}</label>
              <Input
                {...register('email', { required: 'Email is required' })}
                type="email"
                placeholder="you@example.com"
                disabled={registerMutation.isPending}
              />
              {errors.email && <p className="text-destructive text-xs">{errors.email.message}</p>}
            </div>

            {/* Phone Number */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider">Phone Number <span className="text-muted-foreground font-normal normal-case">(optional)</span></label>
              <Input
                {...register('phoneNumber')}
                type="tel"
                placeholder="+992 00 000 0000"
                disabled={registerMutation.isPending}
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider">{t('password')}</label>
              <Input
                {...register('password', { required: 'Password is required' })}
                type="password"
                placeholder="Min. 1 uppercase, 1 digit, 1 special char"
                disabled={registerMutation.isPending}
              />
              {errors.password && <p className="text-destructive text-xs">{errors.password.message}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
              {registerMutation.isPending ? (
                <><Loader2 className="mr-2 size-4 animate-spin" /> Creating account...</>
              ) : (
                t('register')
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t pt-4">
          <button
            onClick={() => router.push(`/${locale}/login`)}
            className="text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            Already have an account? <span className="font-bold text-foreground">{t('login')}</span>
          </button>
        </CardFooter>
      </Card>
    </div>
  );
}
