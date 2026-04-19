'use client';

import { useJobQueries } from '@/hooks/queries/useJobQueries';
import JobCard from './JobCard';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { 
  Rocket, 
  Search, 
  MapPin, 
  LayoutGrid, 
  FilterX, 
  Ghost
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3
    }
  }
};

export default function JobFeed() {
  const { useJobs } = useJobQueries();
  const [pageSize] = useState(10);
  
  const { data, isLoading, isError, refetch } = useJobs({ 
    PageSize: pageSize,
    PageNumber: 1 
  });

  const jobs = data?.items || [];

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-background/5 glass-card rounded-[3rem] border-white/5 gap-6">
        <div className="size-20 bg-destructive/10 rounded-full flex items-center justify-center">
          <Ghost className="size-10 text-destructive animate-bounce" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-xl font-black uppercase tracking-widest text-foreground">Comms Lost</h3>
          <p className="text-muted-foreground text-sm font-medium">Unable to establish connection with the mission database.</p>
        </div>
        <Button 
          onClick={() => refetch()} 
          className="bg-primary text-primary-foreground font-black uppercase tracking-widest rounded-2xl h-12 px-8"
        >
          Re-establish Link
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-card rounded-[2.5rem] p-8 space-y-6">
            <div className="flex gap-6">
              <Skeleton className="size-20 rounded-3xl bg-white/5" />
              <div className="flex-1 space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-1/3 bg-white/5" />
                  <Skeleton className="h-4 w-1/4 bg-white/5" />
                </div>
                <div className="flex gap-4">
                  <Skeleton className="h-4 w-24 bg-white/5" />
                  <Skeleton className="h-4 w-24 bg-white/5" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-background/5 glass-card rounded-[3rem] border-white/5 gap-8 text-center px-6">
        <div className="size-24 bg-white/5 rounded-[2rem] flex items-center justify-center border border-white/10 shadow-inner rotate-12">
          <Rocket className="size-12 text-primary opacity-30" />
        </div>
        <div className="space-y-3">
          <h3 className="text-2xl font-black uppercase tracking-[0.2em] text-foreground">Awaiting Orders</h3>
          <p className="text-muted-foreground text-sm font-medium max-w-sm mx-auto">
            No active missions matching your trajectory at this time. Deployment logs are empty.
          </p>
        </div>
        <Button 
           variant="outline" 
           onClick={() => refetch()}
           className="h-12 border-white/10 bg-white/5 rounded-2xl px-8 font-black uppercase tracking-widest text-[10px] hover:bg-primary/10 hover:text-primary transition-all"
        >
          Scan Deep Space
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Feed Header */}
      <div className="flex flex-col sm:flex-row items-end justify-between gap-6 px-4">
        <div className="space-y-2">
           <h2 className="text-3xl font-black uppercase tracking-tighter text-foreground leading-none">
             Active Missions
           </h2>
           <div className="flex items-center gap-3">
             <div className="size-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/70">
               Live Deployment: {data?.totalCount || 0} SECTORS ONLINE
             </span>
           </div>
        </div>
        
        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-2xl border border-white/5 backdrop-blur-md">
           <Button variant="ghost" size="icon" className="size-10 rounded-xl bg-primary/10 text-primary">
             <LayoutGrid className="size-4" />
           </Button>
           <Button variant="ghost" size="icon" className="size-10 rounded-xl text-muted-foreground opacity-40 hover:opacity-100 transition-opacity">
             <Search className="size-4" />
           </Button>
        </div>
      </div>

      {/* Staggered Feed List */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-8"
      >
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </motion.div>

      {/* Simple Load More / Pagination Area */}
      {data?.hasNext && (
        <div className="flex justify-center pt-8">
           <motion.div
             initial={{ opacity: 0, y: 10 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
           >
             <Button className="h-14 bg-white/5 border border-white/10 hover:bg-white/10 text-foreground uppercase tracking-[0.4em] font-black text-[10px] px-12 rounded-[2rem] glass-card tuff-motion">
               Load More Coordinates
             </Button>
           </motion.div>
        </div>
      )}
    </div>
  );
}
