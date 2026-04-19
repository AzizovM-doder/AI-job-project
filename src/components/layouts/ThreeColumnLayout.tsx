'use client';

import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface ThreeColumnLayoutProps {
  left: ReactNode;
  main: ReactNode;
  right: ReactNode;
  className?: string;
  stickyLeft?: boolean;
  stickyRight?: boolean;
}

export default function ThreeColumnLayout({
  left,
  main,
  right,
  className,
  stickyLeft = true,
  stickyRight = true
}: ThreeColumnLayoutProps) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-12 gap-8 items-start relative z-10", className)}>
      {/* Left Column (Identity/Stats) */}
      <aside className={cn(
        "hidden md:block md:col-span-3",
        stickyLeft && "sticky top-[100px]"
      )}>
        <div className="glass-card rounded-2xl p-6 overflow-hidden">
          {left}
        </div>
      </aside>

      {/* Main Column (Feed/Content) */}
      <main className="col-span-1 md:col-span-9 lg:col-span-6 space-y-6">
        {main}
      </main>

      {/* Right Column (Suggestions/News) */}
      <aside className={cn(
        "hidden lg:block lg:col-span-3",
        stickyRight && "sticky top-[100px]"
      )}>
        <div className="glass-card rounded-2xl p-6 overflow-hidden">
          {right}
        </div>
      </aside>
    </div>
  );
}
