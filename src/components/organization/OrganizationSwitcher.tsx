'use client';

import React, { useState } from 'react';
import { useOrganizationQueries } from '@/hooks/queries/useOrganizationQueries';
import { useAuth } from '@/hooks/useAuth';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Building2, ChevronDown, Plus, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import CreateOrganizationModal from './CreateOrganizationModal';
import { Organization } from '@/types/organization';

export default function OrganizationSwitcher() {
  const { user } = useAuth();
  const { useGetMyOrganizations } = useOrganizationQueries();
  const { data: orgData } = useGetMyOrganizations();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const organizations: Organization[] = Array.isArray(orgData) 
    ? orgData 
    : orgData ? [orgData as unknown as Organization] : [];

  if (user?.role !== 'Organization') return null;

  const springConfig = { type: "spring", stiffness: 100, damping: 20 } as const;

  return (
    <div className="flex items-center gap-4">
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <motion.button 
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="h-12 px-4 rounded-xl glass-card flex items-center gap-3 transition-colors hover:bg-white/10 group relative border-white/5"
          >
             <div className="size-6 rounded-lg bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <Building2 className="size-4" />
             </div>
             
             <div className="flex flex-col items-start pr-1">
               <span className="text-[10px] font-heading font-black uppercase tracking-tight truncate max-w-[140px]">
                 {organizations.length > 0 ? organizations[0].name : "Baseline Access"}
               </span>
               <div className="flex items-center gap-1 -mt-0.5 opacity-50">
                 <ShieldCheck className="size-2.5 text-primary" />
                 <span className="text-[7px] font-bold uppercase tracking-[0.2em]">Verified Corp</span>
               </div>
             </div>

             <ChevronDown className="size-3.5 opacity-30 group-hover:translate-y-0.5 transition-transform group-hover:opacity-100" />
          </motion.button>
        </DropdownMenuTrigger>

        <DropdownMenuContent 
          align="start" 
          className="w-[280px] glass backdrop-blur-[60px] border-white/10 rounded-[2rem] p-2 shadow-2xl z-[10001] animate-in fade-in zoom-in-95 duration-200"
        >
          <div className="px-4 py-3 mb-2">
            <h3 className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40">Your Organizations</h3>
          </div>

          <AnimatePresence>
            {organizations.length > 0 ? (
              organizations.map((org, i) => (
                <DropdownMenuItem 
                  key={org.id} 
                  className="rounded-xl h-14 gap-4 px-3 focus:bg-white/5 focus:text-foreground cursor-pointer group/item mb-1 border border-transparent focus:border-white/5 transition-all"
                >
                  <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center overflow-hidden border border-primary/10 group-hover/item:scale-105 transition-transform">
                    {org.logoUrl ? (
                      <img src={org.logoUrl} className="size-full object-cover" />
                    ) : (
                      <Building2 className="size-5 text-primary" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-heading font-black uppercase tracking-normal">{org.name}</span>
                    <span className="text-[10px] text-muted-foreground truncate max-w-[160px]">{org.location || "Orbit Baseline"}</span>
                  </div>
                </DropdownMenuItem>
              ))
            ) : (
              <div className="p-8 text-center bg-white/5 rounded-2xl border border-dashed border-white/5 mb-2">
                <p className="text-[10px] font-black uppercase opacity-30">No Missions Active</p>
              </div>
            )}
          </AnimatePresence>
          
          <DropdownMenuSeparator className="bg-white/5 my-2" />
          
          <DropdownMenuItem 
            onClick={() => setIsModalOpen(true)}
            className="rounded-xl h-12 gap-3 px-3 bg-primary/10 text-primary focus:bg-primary/20 focus:text-primary cursor-pointer border border-primary/20 transition-all active:scale-95"
          >
            <div className="size-7 rounded-lg bg-primary/20 flex items-center justify-center">
              <Plus className="size-4" />
            </div>
            <span className="text-[10px] font-heading font-black uppercase tracking-widest">Inaugurate Corp</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CreateOrganizationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
