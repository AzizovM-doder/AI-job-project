'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Users, Contact, UserPlus, Hash, Calendar, FileText, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ManageNetworkSidebar() {
  const items = [
    { icon: Users, label: 'Connections', count: 542 },
    { icon: Contact, label: 'Contacts', count: 1205 },
    { icon: UserPlus, label: 'Following & followers', count: null },
    { icon: Calendar, label: 'Events', count: 3 },
    { icon: FileText, label: 'Pages', count: 42 },
    { icon: Hash, label: 'Hashtags', count: 12 },
  ];

  return (
    <Card className="shadow-sm border-border/60 overflow-hidden">
      <CardContent className="p-0">
        <div className="p-4 border-b border-border/60">
          <h2 className="text-base font-bold">Manage my network</h2>
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
              {item.count !== null && (
                <span className="text-[14px] text-muted-foreground">{item.count}</span>
              )}
            </div>
          ))}
        </div>
        <button className="w-full p-3 text-left border-t border-border/60 flex items-center justify-between hover:bg-muted/60 transition-colors">
          <span className="text-[14px] font-bold text-muted-foreground">Show less</span>
          <ChevronDown className="size-4 text-muted-foreground rotate-180" />
        </button>
      </CardContent>
    </Card>
  );
}
