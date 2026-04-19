'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Lock } from 'lucide-react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';

interface ResetPasswordForm {
  newPassword: string;
  confirmPassword: string;
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const { locale } = useParams();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';

  const { register, handleSubmit, watch, formState: { errors } } = useForm<ResetPasswordForm>();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const onSubmit = async (data: ResetPasswordForm) => {
    if (!token) {
      setErrorMsg('INVALID_RESET_TOKEN — PLEASE_REQUEST_NEW_LINK');
      return;
    }
    setIsLoading(true);
    setErrorMsg('');
    try {
      await api.post('/Auth/reset-password', {
        email,
        token,
        newPassword: data.newPassword,
      });
      setSuccess(true);
      setTimeout(() => router.push(`/${locale}/login`), 3000);
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.description?.[0] ?? 'FAILED_TO_RESET_PASSWORD');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="text-[10px] font-bold tracking-[0.4em] text-primary uppercase">AUTH_RECOVERY_PROTOCOL</div>
          <h1 className="text-3xl font-black tracking-tighter terminal-glow uppercase">NEW_PASSWORD</h1>
          <p className="text-[10px] text-muted-foreground tracking-widest">ENTER_YOUR_NEW_ACCESS_CREDENTIALS</p>
        </div>

        <Card className="border-primary/30 bg-primary/5 rounded-none">
          <CardContent className="p-8">
            {success ? (
              <div className="text-center space-y-4">
                <div className="text-green-400 text-4xl font-black">✓</div>
                <p className="text-[10px] tracking-widest text-green-400 uppercase font-bold">
                  PASSWORD_RESET_SUCCESSFUL
                </p>
                <p className="text-xs text-muted-foreground">REDIRECTING_TO_LOGIN...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <Lock className="size-3" /> NEW_PASSWORD
                  </label>
                  <Input
                    {...register('newPassword', {
                      required: 'PASSWORD_REQUIRED',
                      minLength: { value: 8, message: 'MINIMUM_8_CHARACTERS' },
                    })}
                    type="password"
                    placeholder="••••••••"
                    className="rounded-none"
                  />
                  {errors.newPassword && (
                    <p className="text-destructive text-[10px]">{errors.newPassword.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <Lock className="size-3" /> CONFIRM_PASSWORD
                  </label>
                  <Input
                    {...register('confirmPassword', {
                      required: 'PLEASE_CONFIRM_PASSWORD',
                      validate: (val) => val === watch('newPassword') || 'PASSWORDS_DO_NOT_MATCH',
                    })}
                    type="password"
                    placeholder="••••••••"
                    className="rounded-none"
                  />
                  {errors.confirmPassword && (
                    <p className="text-destructive text-[10px]">{errors.confirmPassword.message}</p>
                  )}
                </div>

                {errorMsg && (
                  <p className="text-destructive text-[10px] tracking-widest">{errorMsg}</p>
                )}

                {!token && (
                  <p className="text-yellow-400 text-[10px] tracking-widest">
                    WARNING: NO_TOKEN_DETECTED — USE_LINK_FROM_EMAIL
                  </p>
                )}

                <Button
                  type="submit"
                  className="w-full rounded-none terminal-glow"
                  disabled={isLoading || !token}
                >
                  {isLoading ? <Loader2 className="animate-spin mr-2 size-4" /> : null}
                  SET_NEW_PASSWORD
                </Button>

                <div className="text-center">
                  <Link
                    href={`/${locale}/forgot-password`}
                    className="text-[10px] text-muted-foreground hover:text-primary tracking-widest"
                  >
                    REQUEST_NEW_RECOVERY_LINK
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
