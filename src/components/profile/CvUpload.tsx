'use client';

import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  X, 
  FileCheck, 
  Zap,
  Terminal,
  Scan
} from 'lucide-react';
import { useProfileQueries } from '@/hooks/queries/useProfileQueries';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface CvUploadProps {
  userId: number;
  onSuccess?: (url: string) => void;
  currentCvUrl?: string | null;
}

export default function CvUpload({ userId, onSuccess, currentCvUrl }: CvUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { useUploadCV, useUpdateCandidateProfile, useGetCandidateProfile } = useProfileQueries();
  const uploadMutation = useUploadCV();
  const updateProfileMutation = useUpdateCandidateProfile();
  
  // Need current candidate profile data to update just the CV URL
  const { data: candidateProfile } = useGetCandidateProfile(userId);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) validateAndSetFile(selectedFile);
  };

  const validateAndSetFile = (selectedFile: File) => {
    if (selectedFile.type !== 'application/pdf') {
      toast.error('Protocol Error', { description: 'Only PDF dossiers are accepted for parsing.' });
      return;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      toast.error('Data Overflow', { description: 'Dossier exceeds 10MB limit.' });
      return;
    }
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;

    const authToast = toast.loading('Initializing Dossier Upload...');
    
    try {
      // 1. Upload to storage
      const uploadedPath = await uploadMutation.mutateAsync(file);
      
      // 2. Update candidate profile record
      if (candidateProfile) {
        await updateProfileMutation.mutateAsync({
          ...candidateProfile,
          cvFileUrl: uploadedPath,
          userId: userId // Ensure userId is passed correctly
        });
      }

      toast.success('Dossier Synchronized', { id: authToast, description: 'Mission files linked to profile.' });
      setFile(null);
      if (onSuccess) onSuccess(uploadedPath);
    } catch (err) {
      toast.error('Signal Interference', { id: authToast, description: 'Failed to sync dossier to mainframe.' });
    }
  };

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {!file ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              const droppedFile = e.dataTransfer.files[0];
              if (droppedFile) validateAndSetFile(droppedFile);
            }}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "relative group h-48 border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden backdrop-blur-xl",
              isDragging 
                ? "border-primary bg-primary/10" 
                : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/[0.08]"
            )}
          >
            {/* Background Scanner Effect */}
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-scanner" />
            
            <div className="size-14 rounded-2xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Upload className={cn("size-6 transition-colors", isDragging ? "text-primary" : "text-white/20 group-hover:text-primary")} />
            </div>
            
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40 group-hover:text-white transition-colors">
              {isDragging ? 'Release Dossier' : 'Drop CV / Click to Scan'}
            </p>
            <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest mt-2">Maximum Signal: 10MB (PDF Only)</p>
            
            <input 
              ref={fileInputRef}
              type="file" 
              className="hidden" 
              accept=".pdf"
              onChange={handleFileChange}
            />
          </motion.div>
        ) : (
          <motion.div
            key="file-selected"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 rounded-[2rem] bg-black/40 border border-primary/20 backdrop-blur-3xl relative overflow-hidden"
          >
            {uploadMutation.isPending && (
              <motion.div 
                className="absolute inset-0 bg-primary/10 z-0"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
            )}
            
            <div className="relative z-10 flex items-center gap-5">
              <div className="size-16 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/20">
                <FileCheck className="size-8 text-primary" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-black uppercase tracking-widest truncate">{file.name}</span>
                  <span className="text-[8px] font-bold px-2 py-0.5 rounded bg-white/5 text-white/40 border border-white/5">READY</span>
                </div>
                <p className="text-[10px] text-white/30 font-bold uppercase tracking-tight">{(file.size / 1024 / 1024).toFixed(2)} MB • PDF Document</p>
              </div>
              
              {!uploadMutation.isPending && (
                <button 
                  onClick={() => setFile(null)}
                  className="size-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-rose-500/20 hover:text-rose-500 transition-all"
                >
                  <X className="size-5" />
                </button>
              )}
            </div>
            
            <div className="relative z-10 mt-6 flex gap-3">
              <Button 
                onClick={handleUpload}
                disabled={uploadMutation.isPending}
                className="flex-1 h-12 rounded-xl bg-primary font-black uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20"
              >
                {uploadMutation.isPending ? (
                  <>
                    <Loader2 className="size-4 mr-2 animate-spin" />
                    Synchronizing...
                  </>
                ) : (
                  <>
                    <Zap className="size-4 mr-2" />
                    Commit to Profile
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Current File Status */}
      {currentCvUrl && !file && (
        <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="size-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                 <CheckCircle2 className="size-4 text-emerald-500" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500/70">Dossier Online</span>
           </div>
           <a 
            href={currentCvUrl.startsWith('http') ? currentCvUrl : `http://157.180.29.248:8090${currentCvUrl}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-primary transition-colors pr-2"
           >
              Review Source
           </a>
        </div>
      )}
    </div>
  );
}
