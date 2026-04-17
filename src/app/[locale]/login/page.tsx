'use client';

import { useForm } from 'react-hook-form';
import { useAuth } from '@/src/hooks/useAuth';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoginCredentials } from '@/src/types/auth';
import axios from 'axios';
import { useState } from 'react';

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
    <div className="flex-1 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">{t('terminalAccess')}</CardTitle>
          <CardDescription className="text-center">
            {t('authRequired')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {t('email')}
              </label>
              <Input
                {...register('email', { required: true })}
                type="email"
                placeholder="you@example.com"
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {t('password')}
              </label>
              <Input
                {...register('password', { required: true })}
                type="password"
                placeholder="********"
                disabled={isSubmitting}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'PROCESSING...' : t('signIn')}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2 text-xs text-center border-t border-primary/20 pt-4">
          <Link href={`/${locale}/forgot-password`} className="hover:text-primary transition-colors">
            {t('forgotPassword')}
          </Link>
          <button
            onClick={() => router.push(`/${locale}/register`)}
            className="hover:text-primary transition-colors"
          >
            {t('createNewAccount')}
          </button>
        </CardFooter>
      </Card>
    </div>
  );
}
