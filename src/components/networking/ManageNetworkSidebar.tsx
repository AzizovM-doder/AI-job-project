'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Contact, UserPlus, Hash, Calendar, FileText, ChevronDown } from 'lucide-react';

export default function ManageNetworkSidebar({ connectionsCount, pendingCount }: { connectionsCount?: number; pendingCount?: number }) {
  const t = useTranslations('Networking');

  const items = [
    { icon: Users, label: t('connections'), count: connectionsCount ?? 0 },
    { icon: UserPlus, label: t('tabs.invitations'), count: pendingCount ?? 0 },
    // Only showing items we have real data for
  ];

  return (
    <Card className="shadow-sm border-border/60 overflow-hidden">
      <CardContent className="p-0">
        <div className="p-4 border-b border-border/60">
          <h2 className="text-base font-bold">{t('manage_network')}</h2>
        </div>
        <div className="py-2">
          {items.map((item, i) => (
            <div
              key={i}
              className="px-4 py-2.5 flex items-center justify-between hover:bg-muted/60 cursor-pointer transition-colors group"
            >
              <div className="flex items-center gap-3 text-muted-foreground group-hover:text-foreground">
                <item.icon className="size-5" />
                <span className="text-[14px] font-medium">{item.label}</span>
              </div>
              <span className="text-[14px] text-muted-foreground">{item.count}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
