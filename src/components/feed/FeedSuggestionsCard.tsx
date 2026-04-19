'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Info, Zap } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { motion } from 'framer-motion';

const SUGGESTIONS = [
  { id: 1, name: "Google Cloud", industry: "Cloud Computing", avatar: "G" },
  { id: 2, name: "Aziz Rahimov", industry: "Software Engineer", avatar: "A" },
  { id: 3, name: "Next.js Group", industry: "Technology", avatar: "N" },
];

export default function FeedSuggestionsCard() {
  const { user } = useAuthStore();

  if (!user) return null;

  return (
    <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
      <Card className="glass-card bg-white/[0.03] backdrop-blur-2xl border-white/10 rounded-[2rem] overflow-hidden shadow-2xl transition-all duration-500 hover:border-primary/20 mt-1">
        <CardHeader className="p-6 pb-0 flex flex-row items-center justify-between">
          <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 flex items-center gap-2">
            <Zap className="size-3 text-primary" /> Sector Intake
          </CardTitle>
          <Info className="size-3.5 text-white/20 cursor-help hover:text-white/40 transition-colors" />
        </CardHeader>
        <CardContent className="px-6 pb-6 pt-6 flex flex-col gap-6">
          {SUGGESTIONS.length > 0 ? (
            SUGGESTIONS.map((item) => (
              <div key={item.id} className="flex gap-4 items-start group/sug">
                <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center font-black text-white/20 text-xs text-center shrink-0 border border-white/10 overflow-hidden shadow-inner group-hover/sug:border-primary/30 transition-colors">
                  {item.avatar}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-[13px] font-heading font-black text-white truncate leading-tight group-hover/sug:text-primary transition-colors">{item.name}</p>
                  <p className="text-[9px] text-white/30 font-bold uppercase tracking-wider line-clamp-1 mt-1">{item.industry}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 h-8 rounded-xl border-white/10 text-white/60 hover:bg-primary hover:text-primary-foreground hover:border-primary font-black uppercase text-[9px] tracking-widest px-4 transition-all active:scale-95"
                  >
                    <Plus className="size-3.5 mr-1" /> Follow
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-[10px] text-white/20 text-center py-6 italic font-bold uppercase tracking-widest">
              Uplink Silent
            </p>
          )}

          <button className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 hover:text-primary transition-all mt-2 w-full text-center p-3 rounded-2xl bg-white/5 border border-white/5 border-dashed hover:border-primary/40">
            View Expanded Network →
          </button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
