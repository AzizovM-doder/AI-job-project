'use client';

import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

export default function UnauthorizedPage() {
  const router = useRouter();
  const locale = useLocale();

  return (
    <div className="flex-1 flex flex-col items-center justify-center space-y-8 py-20">
      <div className="relative">
        <div className="absolute inset-0 bg-destructive/20 blur-3xl rounded-full" />
        <ShieldAlert className="size-24 text-destructive relative animate-pulse" />
      </div>

      <div className="text-center space-y-2">
        <h1 className="text-4xl font-black terminal-glow-red uppercase tracking-tighter text-destructive">
          ACCESS_DENIED_v403
        </h1>
        <p className="text-xs text-muted-foreground uppercase tracking-[0.3em] font-mono">
          INSUFFICIENT_SECURITY_CLEARANCE_LEVEL
        </p>
      </div>

      <p className="max-w-md text-center text-sm text-muted-foreground leading-relaxed">
        Your current identity profile does not possess the necessary permissions to access this localized node. 
        Please contact system admin or switch entities.
      </p>

      <div className="flex gap-4">
        <Button 
          variant="outline" 
          onClick={() => router.back()}
          className="border-destructive/30 hover:bg-destructive/10 text-destructive text-[10px] font-bold uppercase tracking-widest"
        >
          <ArrowLeft className="mr-2 size-3" /> RTB_COMMAND
        </Button>
        <Button 
          onClick={() => router.push(`/${locale}`)}
          className="bg-destructive text-destructive-foreground hover:bg-destructive/90 text-[10px] font-bold uppercase tracking-widest"
        >
          <Home className="mr-2 size-3" /> RETURN_TO_ROOT
        </Button>
      </div>
    </div>
  );
}
