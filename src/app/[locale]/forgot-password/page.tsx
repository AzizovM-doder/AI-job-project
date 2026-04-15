'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Mail, ArrowLeft } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import api from '@/src/lib/api';
import Link from 'next/link';

interface ForgotPasswordForm {
  email: string;
}

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { locale } = useParams();
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordForm>();
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const onSubmit = async (data: ForgotPasswordForm) => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      await api.post('/Auth/forgot-password', { email: data.email });
      setSent(true);
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.description?.[0] ?? 'FAILED_TO_SEND_RESET_EMAIL');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="text-[10px] font-bold tracking-[0.4em] text-primary uppercase">AUTH_RECOVERY_PROTOCOL</div>
          <h1 className="text-3xl font-black tracking-tighter terminal-glow uppercase">RESET_ACCESS</h1>
          <p className="text-[10px] text-muted-foreground tracking-widest">
            ENTER_REGISTERED_EMAIL_TO_RECEIVE_RECOVERY_LINK
          </p>
        </div>

        <Card className="border-primary/30 bg-primary/5 rounded-none">
          <CardContent className="p-8">
            {sent ? (
              <div className="text-center space-y-4">
                <div className="text-green-400 text-4xl font-black">✓</div>
                <p className="text-[10px] tracking-widest text-green-400 uppercase font-bold">
                  RECOVERY_LINK_SENT
                </p>
                <p className="text-xs text-muted-foreground">
                  CHECK_YOUR_EMAIL_INBOX_FOR_INSTRUCTIONS
                </p>
                <Button
                  variant="outline"
                  className="rounded-none w-full"
                  onClick={() => router.push(`/${locale}/login`)}
                >
                  RETURN_TO_LOGIN
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <Mail className="size-3" /> EMAIL_ADDRESS
                  </label>
                  <Input
                    {...register('email', {
                      required: 'EMAIL_REQUIRED',
                      pattern: { value: /\S+@\S+\.\S+/, message: 'INVALID_EMAIL_FORMAT' },
                    })}
                    type="email"
                    placeholder="user@example.com"
                    className="rounded-none"
                  />
                  {errors.email && (
                    <p className="text-destructive text-[10px]">{errors.email.message}</p>
                  )}
                </div>

                {errorMsg && (
                  <p className="text-destructive text-[10px] tracking-widest">{errorMsg}</p>
                )}

                <Button type="submit" className="w-full rounded-none terminal-glow" disabled={isLoading}>
                  {isLoading ? <Loader2 className="animate-spin mr-2 size-4" /> : null}
                  SEND_RECOVERY_LINK
                </Button>

                <div className="text-center">
                  <Link
                    href={`/${locale}/login`}
                    className="text-[10px] text-muted-foreground hover:text-primary flex items-center justify-center gap-1 tracking-widest"
                  >
                    <ArrowLeft className="size-3" /> BACK_TO_LOGIN
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
