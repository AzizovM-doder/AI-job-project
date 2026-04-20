'use client';

import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useOrganizationQueries } from '@/hooks/queries/useOrganizationQueries';
import { useUserQueries } from '@/hooks/queries/useUserQueries';
import { toast } from 'sonner';
import { Building2, MapPin, Loader2, Sparkles, Target, Zap } from 'lucide-react';
import { OrganizationType } from '@/types/organization';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateOrganizationModal({ isOpen, onClose }: Props) {
  const { useCreateOrganization } = useOrganizationQueries();
  const { useGetMe } = useUserQueries();
  const { refetch: refetchMe } = useGetMe();
  
  const createMutation = useCreateOrganization();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: OrganizationType.Company as string,
    location: '',
    logoUrl: ''
  });

  const springConfig = { type: "spring", stiffness: 100, damping: 20 } as const;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return toast.error("System Override Required", { description: "Organization designation is mandatory for neural uplink." });

    try {
      await createMutation.mutateAsync(formData);
      toast.success("Identity Merged", { description: "Command Center initialized. Synchronizing sectoral data..." });
      await refetchMe();
      onClose();
      setFormData({ name: '', description: '', type: OrganizationType.Company, location: '', logoUrl: '' });
    } catch (err: any) {
      toast.error("Initialization Failure", { description: err.response?.data?.message || err.message || "Failed to broadcast organization signal." });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[540px] glass backdrop-blur-[80px] border-white/5 rounded-[3rem] shadow-[0_40px_120px_rgba(0,0,0,0.8)] overflow-hidden gap-0 p-0">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        
        <div className="p-8 pb-4">
          <DialogHeader className="relative">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={springConfig}
              className="size-16 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 mx-auto relative group"
            >
              <Building2 className="size-8 text-primary group-hover:scale-110 transition-transform" />
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
            
            <DialogTitle className="text-3xl font-heading font-black uppercase tracking-tighter text-center leading-none">
              Initialize Organization
            </DialogTitle>
            <DialogDescription className="text-center text-[10px] font-bold uppercase tracking-[0.4em] text-primary/60 mt-4">
              Sector 7 Command Deployment Protocol
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="p-8 pt-2 space-y-6">
          <div className="space-y-2 group">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] ml-1 opacity-40 group-focus-within:opacity-100 group-focus-within:text-primary transition-all">Organization Designation</label>
            <div className="relative">
              <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 size-4 opacity-20 group-focus-within:opacity-60 transition-opacity" />
              <Input 
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. AVOEX MARS" 
                className="h-14 pl-14 bg-white/[0.03] border-white/5 focus:border-primary/40 focus:ring-primary/20 rounded-2xl font-heading font-bold uppercase tracking-tight text-base transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2 group">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] ml-1 opacity-40">Tactical Class</label>
              <Select value={formData.type} onValueChange={v => setFormData({ ...formData, type: v })}>
                <SelectTrigger className="h-14 bg-white/[0.03] border-white/5 rounded-2xl font-bold uppercase tracking-widest text-[10px] focus:border-primary/40 focus:ring-0">
                  <SelectValue placeholder="CLASS" />
                </SelectTrigger>
                <SelectContent className="glass-card backdrop-blur-[60px] border-white/10 rounded-2xl p-1 overflow-hidden shadow-2xl">
                  {Object.values(OrganizationType).map(t => (
                    <SelectItem 
                      key={t} 
                      value={t} 
                      className="rounded-xl font-heading font-black uppercase text-[10px] h-10 tracking-widest focus:bg-primary/10 focus:text-primary transition-colors cursor-pointer"
                    >
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 group">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] ml-1 opacity-40">Primary Grid Location</label>
              <div className="relative">
                <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 size-4 opacity-20 group-focus-within:opacity-60" />
                <Input 
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                  placeholder="METROPOLIS BASE" 
                  className="h-14 pl-14 bg-white/[0.03] border-white/5 rounded-2xl font-heading font-bold uppercase tracking-widest text-[10px] focus:border-primary/40 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2 group">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] ml-1 opacity-40">Mission Statement (Encrypted)</label>
            <Textarea 
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="Primary objectives, sectoral goals, and operational directives..." 
              className="min-h-[120px] bg-white/[0.03] border-white/5 focus:border-primary/40 rounded-[1.5rem] p-5 font-medium text-sm resize-none tracking-tight leading-relaxed transition-all"
            />
          </div>

          <DialogFooter className="pt-4 flex !justify-between items-center gap-4">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={onClose}
              className="h-14 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] px-8 hover:bg-white/5 transition-colors border-none"
            >
              Cancel Link
            </Button>
            
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button 
                type="submit" 
                disabled={createMutation.isPending}
                className="h-14 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground text-[10px] font-black uppercase tracking-[0.3em] px-12 shadow-[0_20px_40px_-10px_rgba(var(--primary),0.4)] relative overflow-hidden group border-none transition-all flex items-center gap-3"
              >
                {createMutation.isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <>
                    <Target className="size-4 group-hover:rotate-12 transition-transform" />
                    <span>Inaugurate Base</span>
                    <Sparkles className="absolute -right-3 -top-3 size-14 text-white/10 group-hover:scale-125 transition-transform" />
                  </>
                )}
              </Button>
            </motion.div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
