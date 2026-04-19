'use client';

import { Search, MapPin, ChevronDown, Sparkles, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface JobSearchHeaderProps {
  onSearch: (filters: { title: string; location: string }) => void;
}

export default function JobSearchHeader({ onSearch }: JobSearchHeaderProps) {
  return (
    <div className="relative border-b border-white/5 pb-12 pt-8 overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -mr-64 -mt-64 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex items-center gap-3 mb-8">
          <Terminal className="size-5 text-primary opacity-60" />
          <h1 className="text-3xl md:text-5xl font-heading font-black tracking-tighter text-white uppercase leading-none">
            Mission_Registry
          </h1>
          <Sparkles className="size-6 text-primary animate-pulse" />
        </div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-col md:flex-row items-stretch gap-2 p-2 rounded-[2rem] bg-white/[0.03] backdrop-blur-3xl border border-white/10 shadow-3xl"
        >
          <div className="flex-1 relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 size-4 text-white/20 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search by title, skill, or sector..."
              className="w-full h-16 pl-14 pr-6 bg-transparent text-sm text-white font-medium focus:outline-none placeholder:text-white/20"
            />
          </div>

          <div className="w-[1px] bg-white/5 hidden md:block" />

          <div className="flex-1 relative group">
            <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 size-4 text-white/20 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Deploy location (City, Planet...)"
              className="w-full h-16 pl-14 pr-6 bg-transparent text-sm text-white font-medium focus:outline-none placeholder:text-white/20"
            />
          </div>

          <Button className="h-16 px-12 rounded-[1.4rem] font-heading font-black text-xs uppercase tracking-[0.2em] bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95">
            Initialize Search
          </Button>
        </motion.div>

        <div className="flex flex-wrap items-center gap-3 mt-8">
          {[
            'Job Type', 
            'On-site/Remote', 
            'Experience Level', 
            'Compensation'
          ].map((filter, i) => (
            <Button 
              key={i}
              variant="outline" 
              size="sm" 
              className="rounded-xl h-10 px-5 text-[9px] font-black uppercase tracking-widest border-white/10 bg-white/5 text-white/40 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all"
            >
              {filter} <ChevronDown className="size-3.5 ml-2.5 opacity-40" />
            </Button>
          ))}
          <div className="flex-1" />
          <Button variant="link" size="sm" className="text-primary font-black uppercase tracking-[0.2em] text-[9px] h-10 hover:scale-105 transition-transform">
            Expanded Filters
          </Button>
        </div>
      </div>
    </div>
  );
}
