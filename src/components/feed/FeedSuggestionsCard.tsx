'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FeedSuggestionsCard() {
  const suggestions = [
    { name: 'Google Workspace', industry: 'Company • Software', avatar: null },
    { name: 'Satya Nadella', industry: 'CEO at Microsoft', avatar: null },
    { name: 'NVIDIA AI Labs', industry: 'Company • Semiconductors', avatar: null },
  ];

  return (
    <Card className="shadow-sm border-border/60">
      <CardHeader className="p-3 pb-0 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-bold">Add to your feed</CardTitle>
        <Info className="size-3.5 text-muted-foreground cursor-help" />
      </CardHeader>
      <CardContent className="p-3 pt-3 space-y-4">
        {suggestions.map((item, i) => (
          <div key={i} className="flex gap-3">
            <div className="size-10 rounded-sm bg-muted flex items-center justify-center border shrink-0">
               <span className="text-[10px] font-bold text-muted-foreground/60">{item.name[0]}</span>
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-[13px] font-bold truncate">{item.name}</p>
              <p className="text-[11px] text-muted-foreground line-clamp-1">{item.industry}</p>
              <Button variant="outline" size="sm" className="mt-2 h-7 rounded-full border-muted-foreground/40 hover:bg-muted font-bold text-xs">
                <Plus className="size-3.5 mr-1" /> Follow
              </Button>
            </div>
          </div>
        ))}
        
        <button className="text-[13px] font-bold text-muted-foreground hover:text-primary transition-colors mt-2 w-full text-left">
          View all recommendations →
        </button>
      </CardContent>
    </Card>
  );
}
