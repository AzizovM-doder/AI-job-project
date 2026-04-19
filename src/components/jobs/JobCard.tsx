'use client';

import { Job } from '@/types/job';
import { Card, CardContent } from '@/components/ui/card';
import { 
  MapPin, 
  Sparkles, 
  Building2, 
  Bookmark, 
  Clock, 
  ChevronRight, 
  DollarSign, 
  Trophy 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Space_Grotesk } from 'next/font/google';
import { useState, useEffect } from 'react';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] });

export default function JobCard({ job }: { job: Job }) {
  const locale = useLocale();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const timeAgo = mounted 
    ? formatDistanceToNow(new Date(job.createdAt), { addSuffix: true }) 
    : 'Syncing...';

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group"
    >
      <Card
        className={cn(
          "relative overflow-hidden transition-all duration-700 rounded-[2.5rem] border-white/5 bg-white/[0.03] backdrop-blur-2xl hover:bg-white/[0.07] cursor-pointer shadow-[0_20px_60px_rgba(0,0,0,0.3)] hover:shadow-primary/10 hover:-translate-y-1.5",
          spaceGrotesk.className
        )}
        onClick={() => router.push(`/${locale}/jobs/${job.id}`)}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        
        <CardContent className="p-8 relative z-10">
          <div className="flex flex-col sm:flex-row gap-8">
            <div className="size-24 bg-black/40 rounded-[2rem] border border-white/10 flex items-center justify-center shrink-0 shadow-2xl group-hover:border-primary/40 transition-all duration-500 scale-100 group-hover:scale-105">
              <Building2 className="size-10 text-primary/40 group-hover:text-primary transition-colors" />
            </div>

            <div className="flex-1 space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <h2 className="text-2xl font-black text-white tracking-tighter group-hover:text-primary transition-colors leading-none">
                    {job.title || "UNDEFINED MISSION"}
                  </h2>
                  <div className="flex items-center gap-2">
                     <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary/60">SECTOR-7 OPS</span>
                     <span className="text-[9px] text-white/20">•</span>
                     <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 italic">AUTH: PERS-{job.id}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="size-12 rounded-2xl bg-white/5 border border-white/5 text-white/30 hover:bg-primary/20 hover:text-primary transition-all group/btn"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <Bookmark className="size-5 group-hover/btn:fill-current" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                <div className="flex items-center gap-2.5 text-white/60">
                  <MapPin className="size-4 text-primary" />
                  <span className="text-[13px] font-bold tracking-tight">{job.location || "PLANET-WIDE"}</span>
                </div>
                <div className="flex items-center gap-2.5 text-white/60">
                  <DollarSign className="size-4 text-emerald-400" />
                  <span className="text-[13px] font-black tracking-tight">${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2.5 text-white/60">
                  <Clock className="size-4 text-amber-400" />
                  <span className="text-[13px] font-bold tracking-tight italic opacity-80">{timeAgo}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-6 pt-2 border-t border-white/5">
                <div className="flex items-center gap-3">
                  <div className="px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary text-[9px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-primary/5">
                    <Sparkles className="size-3.5 fill-current" />
                    <span>{job.jobType}</span>
                  </div>
                  <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/40 text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                    <Trophy className="size-3.5" />
                    <span>{job.experienceLevel}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                   <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary">Initialize Access</span>
                   <div className="size-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
                    <ChevronRight className="size-4 text-primary" />
                   </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
