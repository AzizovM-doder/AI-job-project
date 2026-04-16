'use client';

import { Search, MapPin, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface JobSearchHeaderProps {
  onSearch: (filters: { title: string; location: string }) => void;
}

export default function JobSearchHeader({ onSearch }: JobSearchHeaderProps) {
  return (
    <div className="bg-background border-b border-border/60 pb-8 pt-2">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Find your next opportunity</h1>
        
        <div className="flex flex-col md:flex-row items-stretch gap-0 border rounded-lg overflow-hidden shadow-sm shadow-black/5 bg-card">
          <div className="flex-1 relative border-b md:border-b-0 md:border-r border-border/60">
            <Search className="absolute left-3 top-[17px] size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by title, skill, or company"
              className="w-full h-[48px] pl-10 pr-4 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 z-10 transition-all"
            />
          </div>
          
          <div className="flex-1 relative border-b md:border-b-0 md:border-r border-border/60">
            <MapPin className="absolute left-3 top-[17px] size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="City, state, or zip code"
              className="w-full h-[48px] pl-10 pr-4 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 z-10 transition-all"
            />
          </div>
          
          <Button className="h-[48px] px-8 rounded-none font-bold text-sm bg-primary hover:bg-primary/90 transition-colors">
            Search
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-4">
           <Button variant="outline" size="sm" className="rounded-full h-8 text-xs font-bold border-muted-foreground/40 hover:bg-muted">
             Job Type <ChevronDown className="size-3 ml-1" />
           </Button>
           <Button variant="outline" size="sm" className="rounded-full h-8 text-xs font-bold border-muted-foreground/40 hover:bg-muted">
             On-site/Remote <ChevronDown className="size-3 ml-1" />
           </Button>
           <Button variant="outline" size="sm" className="rounded-full h-8 text-xs font-bold border-muted-foreground/40 hover:bg-muted">
             Experience Level <ChevronDown className="size-3 ml-1" />
           </Button>
           <Button variant="outline" size="sm" className="rounded-full h-8 text-xs font-bold border-muted-foreground/40 hover:bg-muted">
             Salary <ChevronDown className="size-3 ml-1" />
           </Button>
           <div className="flex-1" />
           <Button variant="link" size="sm" className="text-primary font-bold text-xs h-8">
             All filters
           </Button>
        </div>
      </div>
    </div>
  );
}
