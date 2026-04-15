'use client';

import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { authService } from '@/src/services/auth.service';
import { LoginCredentials } from '@/src/types/auth';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useAuth } from '@/src/context/AuthContext';

export default function LoginPage() {
  const t = useTranslations('Auth');
  const router = useRouter();
  const locale = useLocale();
  const { login } = useAuth();

  const { register, handleSubmit } = useForm<LoginCredentials>();

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      // data = { token, refreshToken } — flat response, no .data wrapper
      login(data);

      // Decode role from JWT to redirect correctly
      const payload = data.token.split('.')[1];
      const claims = JSON.parse(atob(payload));
      const role = claims['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

      toast.success('System Access Granted', {
        description: 'Identity verified. Redirecting to portal...'
      });

      if (role === 'Organization') {
        router.push(`/${locale}/organization/dashboard`);
      } else {
        router.push(`/${locale}/candidate/dashboard`);
      }
    },
    onError: (err: unknown) => {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.message || err.response?.data?.description?.[0] || 'Authentication failed'
        : 'Authentication failed';
      toast.error('System Access Denied', {
        description: msg
      });
    }
  });

  const onSubmit = (data: LoginCredentials) => {
    loginMutation.mutate(data);
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
                disabled={loginMutation.isPending}
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
                disabled={loginMutation.isPending}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? 'PROCESSING...' : t('signIn')}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2 text-xs text-center border-t border-primary/20 pt-4">
          <a href="#" className="hover:text-primary transition-colors">
            {t('forgotPassword')}
          </a>
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
