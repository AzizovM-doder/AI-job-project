'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  FileText, 
  BrainCircuit, 
  Target, 
  MessageSquare, 
  PenTool, 
  Cpu, 
  Send,
  Loader2,
  Terminal,
  ChevronRight,
  Bot,
  User,
  X,
  CheckCircle2,
  Settings,
  Zap,
  Layout,
  Type
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { useAiQueries } from '@/hooks/queries/useAiQueries';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Space_Grotesk } from 'next/font/google';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] });

// --- TYPES ---
type ToolId = 'ask' | 'analyze-cv' | 'skill-gap' | 'improve-job' | 'draft-letter' | 'draft-message';

interface AiTool {
  id: ToolId;
  icon: any;
  label: string;
  description: string;
  tag: string;
}

const AI_TOOLS: AiTool[] = [
  { id: 'ask', icon: BrainCircuit, label: 'Ask AI', description: 'General intelligence queries', tag: 'LEVEL_01' },
  { id: 'analyze-cv', icon: FileText, label: 'Analyze CV', description: 'Deep dossier DNA parsing', tag: 'D-DNA' },
  { id: 'skill-gap', icon: Target, label: 'Skill Gap', description: 'Career trajectory fit score', tag: 'FIT_SC' },
  { id: 'improve-job', icon: Cpu, label: 'Optimize Post', description: 'Enhance mission specs', tag: 'OP_SYS' },
  { id: 'draft-letter', icon: PenTool, label: 'Draft Letter', description: 'Cover protocols generator', tag: 'COMM_0' },
  { id: 'draft-message', icon: MessageSquare, label: 'Draft Comms', description: 'Perfect tone drafting', tag: 'COMM_1' },
];

const TONES = ['Professional', 'Casual', 'Enthusiastic', 'Formal', 'Bold', 'Concise'];

// --- SUB-COMPONENTS: UI ELEMENTS ---

function TuffToggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 group hover:border-white/10 transition-all">
      <span className="text-[10px] font-black uppercase tracking-widest text-white/40 group-hover:text-white/60 transition-colors">{label}</span>
      <button 
        type="button"
        onClick={() => onChange(!checked)}
        className={cn(
          "w-12 h-6 rounded-full relative transition-all duration-500",
          checked ? "bg-primary shadow-[0_0_15px_rgba(255,77,0,0.3)]" : "bg-white/10"
        )}
      >
        <motion.div 
          animate={{ x: checked ? 26 : 4 }}
          className="absolute top-1 size-4 bg-white rounded-full shadow-lg"
        />
      </button>
    </div>
  );
}

function SectionLabel({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <div className="flex items-center gap-2 mb-4 opacity-40">
      <Icon className="size-3.5 text-primary" />
      <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white">{label}</span>
    </div>
  );
}

// --- MAIN PAGE COMPONENT ---

export default function AiWorkspacePage() {
  const { user } = useAuthStore();
  const userId = user?.userId ? Number(user.userId) : 0;
  
  const [activeToolId, setActiveToolId] = useState<ToolId>('ask');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Form States
  const [prompt, setPrompt] = useState('');
  const [cvText, setCvText] = useState('');
  const [applyToProfile, setApplyToProfile] = useState(true);
  const [syncSkills, setSyncSkills] = useState(true);
  const [jobId, setJobId] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [jobLocation, setJobLocation] = useState('');
  const [experienceRequired, setExperienceRequired] = useState(2);
  const [applyToJob, setApplyToJob] = useState(false);
  const [tone, setTone] = useState('Professional');
  const [extraContext, setExtraContext] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [purpose, setPurpose] = useState('');

  // Queries
  const { 
    useAiAsk, 
    useAiAnalyzeCv, 
    useAiSkillGap, 
    useAiImproveJob, 
    useAiDraftCoverLetter, 
    useAiDraftMessage 
  } = useAiQueries();

  const askMutation = useAiAsk();
  const analyzeCvMutation = useAiAnalyzeCv();
  const improveJobMutation = useAiImproveJob();
  const draftLetterMutation = useAiDraftCoverLetter();
  const draftMessageMutation = useAiDraftMessage();

  const [lastResult, setLastResult] = useState<any>(null);
  
  // Skill Gap is handled manually on click to match Swagger mapping (POST/GET consistency)
  const isSkillGapManual = useAiSkillGap(userId, parseInt(jobId));

  const activeTool = useMemo(() => AI_TOOLS.find(t => t.id === activeToolId)!, [activeToolId]);

  const handleExecute = async () => {
    setLastResult(null);
    const executeToast = toast.loading(`Initializing protocol: ${activeTool.label}...`);

    try {
      let response;
      switch (activeToolId) {
        case 'ask':
          response = await askMutation.mutateAsync({ prompt });
          break;
        case 'analyze-cv':
          response = await analyzeCvMutation.mutateAsync({ userId, cvText, applyToProfile, syncSkills });
          break;
        case 'skill-gap':
          // Re-fetch since it's a GET in Swagger
          await isSkillGapManual.refetch();
          response = isSkillGapManual.data;
          break;
        case 'improve-job':
          response = await improveJobMutation.mutateAsync({ jobId: parseInt(jobId) || null, title: jobTitle, description: jobDescription, location: jobLocation, experienceRequired, applyToJob });
          break;
        case 'draft-letter':
          response = await draftLetterMutation.mutateAsync({ userId, jobId: parseInt(jobId), tone, extraContext });
          break;
        case 'draft-message':
          response = await draftMessageMutation.mutateAsync({ userId, jobId: parseInt(jobId) || null, recipientName, purpose, tone, extraContext });
          break;
      }
      
      // Safely extract the data payload from the API envelope { statusCode, description, data }
      const payload = response?.data !== undefined ? response.data : response;
      setLastResult(payload);
      toast.success('Protocol Executed Successfully', { id: executeToast });
    } catch (err) {
      toast.error('Uplink Synchronous Failure', { id: executeToast });
    }
  };

  const isPending = askMutation.isPending || analyzeCvMutation.isPending || improveJobMutation.isPending || draftLetterMutation.isPending || draftMessageMutation.isPending || isSkillGapManual.isFetching;

  return (
    <div className={cn("flex h-[calc(100vh-140px)] gap-6 overflow-hidden p-6", spaceGrotesk.className)}>
      
      {/* SIDEBAR */}
      <AnimatePresence initial={false}>
        {isSidebarOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 340, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="flex flex-col gap-4 shrink-0"
          >
            <Card className="glass-card bg-black/40 backdrop-blur-3xl border-white/10 rounded-[2.5rem] flex-1 flex flex-col p-6 overflow-hidden shadow-2xl">
               <div className="flex items-center justify-between mb-10 px-2">
                  <div className="flex items-center gap-3">
                     <Terminal className="size-5 text-primary" />
                     <span className="text-[11px] font-black uppercase tracking-[0.3em] text-white">CORE_CO-PROCESSOR</span>
                  </div>
                  <button onClick={() => setIsSidebarOpen(false)} className="size-8 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 text-white/20 hover:text-white transition-all">
                     <X className="size-4" />
                  </button>
               </div>

               <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar pr-2">
                  {AI_TOOLS.map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => { setActiveToolId(tool.id); setLastResult(null); }}
                      className={cn(
                        "w-full flex items-center gap-4 p-5 rounded-[1.8rem] transition-all duration-500 text-left relative overflow-hidden group/btn",
                        activeToolId === tool.id ? "bg-white/10 border border-white/10 shadow-lg" : "hover:bg-white/[0.03] border border-transparent"
                      )}
                    >
                      {activeToolId === tool.id && <motion.div layoutId="active-pill" className="absolute inset-0 bg-primary/20 backdrop-blur-sm -z-10" />}
                      <div className={cn(
                        "size-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-500",
                        activeToolId === tool.id ? "bg-primary text-white scale-110 shadow-primary/20 shadow-2xl" : "bg-white/5 text-white/20 group-hover/btn:text-white/60"
                      )}>
                        <tool.icon className="size-6" />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={cn("text-[12px] font-black uppercase tracking-widest", activeToolId === tool.id ? "text-white" : "text-white/40")}>{tool.label}</span>
                          <span className="text-[8px] font-black text-primary opacity-60 font-mono">{tool.tag}</span>
                        </div>
                        <p className="text-[10px] font-bold text-white/30 truncate uppercase tracking-tight">{tool.description}</p>
                      </div>
                    </button>
                  ))}
               </div>

               <div className="mt-8 pt-8 border-t border-white/5">
                  <div className="bg-white/5 rounded-3xl p-5 border border-white/5 relative overflow-hidden group">
                     <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                           <Zap className="size-4 text-emerald-500" />
                           <span className="text-[11px] font-black uppercase tracking-widest text-white/60">Quantum Quota</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mb-3">
                           <motion.div initial={{ width: 0 }} animate={{ width: '74%' }} className="h-full bg-emerald-500" />
                        </div>
                        <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] text-center">LINK_AVAILABILITY: 74%</p>
                     </div>
                  </div>
               </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN WORKSPACE */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {!isSidebarOpen && (
          <Button variant="ghost" onClick={() => setIsSidebarOpen(true)} className="absolute -left-3 top-6 z-50 rounded-2xl bg-white/5 border border-white/10 size-12 hover:bg-white/10">
             <ChevronRight className="size-5" />
          </Button>
        )}

        <Card className="glass-card flex-1 rounded-[3rem] bg-black/40 backdrop-blur-3xl border-white/10 flex flex-col overflow-hidden shadow-2xl">
          <div className="h-24 border-b border-white/5 flex items-center justify-between px-10 relative shrink-0">
            <div className="flex items-center gap-5">
              <div className="size-14 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-lg shadow-primary/5">
                <activeTool.icon className="size-7 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-black uppercase tracking-widest text-white">{activeTool.label}</h2>
                <div className="flex items-center gap-2 mt-1 opacity-40 italic">
                  <Radio className="size-3 text-emerald-500" />
                  <span className="text-[9px] font-black uppercase tracking-widest leading-none">Protocol_Sync_Active</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeToolId}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-12"
              >
                {/* TOOL INPUT AREA */}
                <div className="lg:col-span-6 space-y-10">
                  <div className="space-y-8">
                    {/* TOOL 1: ASK */}
                    {activeToolId === 'ask' && (
                      <div className="space-y-6">
                        <SectionLabel icon={Layout} label="Intelligence_Probe" />
                        <Textarea 
                          placeholder="Initialize general query protocol..."
                          value={prompt}
                          onChange={e => setPrompt(e.target.value)}
                          className="min-h-[300px] bg-white/[0.03] border-white/10 rounded-[2rem] p-8 text-base font-medium text-white focus:border-primary/50 transition-all placeholder:text-white/10 shadow-inner"
                        />
                      </div>
                    )}

                    {/* TOOL 2: ANALYZE CV */}
                    {activeToolId === 'analyze-cv' && (
                      <div className="space-y-6">
                        <SectionLabel icon={FileText} label="Dossier_Source" />
                        <Textarea 
                          placeholder="Paste full CV / Resume source text..."
                          value={cvText}
                          onChange={e => setCvText(e.target.value)}
                          className="min-h-[250px] bg-white/[0.03] border-white/10 rounded-[2rem] p-8 text-sm font-medium text-white shadow-inner"
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <TuffToggle label="Apply to Profile" checked={applyToProfile} onChange={setApplyToProfile} />
                          <TuffToggle label="Sync Global Skills" checked={syncSkills} onChange={setSyncSkills} />
                        </div>
                      </div>
                    )}

                    {/* TOOL 3: SKILL GAP */}
                    {activeToolId === 'skill-gap' && (
                      <div className="space-y-6">
                        <SectionLabel icon={Target} label="Target_Mission_ID" />
                        <div className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/10 space-y-6">
                          <div className="space-y-3">
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Job Registry ID</span>
                            <Input 
                              type="number"
                              placeholder="Enter Target Job ID..."
                              value={jobId}
                              onChange={e => setJobId(e.target.value)}
                              className="h-14 bg-black/20 border-white/5 rounded-2xl px-6 text-white font-black uppercase tracking-widest"
                            />
                          </div>
                          <p className="text-[10px] text-white/20 font-bold italic leading-relaxed">System will cross-reference your current operative dossier with the registry mission profile.</p>
                        </div>
                      </div>
                    )}

                    {/* TOOL 4: IMPROVE JOB */}
                    {activeToolId === 'improve-job' && (
                      <div className="space-y-6">
                        <SectionLabel icon={Cpu} label="Optimization_Source" />
                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-2">
                             <span className="text-[9px] font-black uppercase text-white/30 ml-2">Registry ID</span>
                             <Input placeholder="Registry ID" value={jobId} onChange={e => setJobId(e.target.value)} className="bg-white/5 border-white/5 h-12 rounded-xl" />
                           </div>
                           <div className="space-y-2">
                             <span className="text-[9px] font-black uppercase text-white/30 ml-2">Mission Title</span>
                             <Input placeholder="Mission Title" value={jobTitle} onChange={e => setJobTitle(e.target.value)} className="bg-white/5 border-white/5 h-12 rounded-xl" />
                           </div>
                        </div>
                        <div className="space-y-2">
                           <span className="text-[9px] font-black uppercase text-white/30 ml-2">Deployment Location</span>
                           <Input placeholder="Location" value={jobLocation} onChange={e => setJobLocation(e.target.value)} className="bg-white/5 border-white/5 h-12 rounded-xl" />
                        </div>
                        <div className="space-y-2">
                           <span className="text-[9px] font-black uppercase text-white/30 ml-2">Current Mission Description</span>
                           <Textarea 
                             placeholder="Paste current job description..."
                             value={jobDescription}
                             onChange={e => setJobDescription(e.target.value)}
                             className="min-h-[150px] bg-white/5 border-white/5 rounded-2xl p-6 shadow-inner"
                           />
                        </div>
                        <TuffToggle label="Execute Registry Update" checked={applyToJob} onChange={setApplyToJob} />
                      </div>
                    )}

                    {/* TOOL 5 & 6: DRAFTING */}
                    {(activeToolId === 'draft-letter' || activeToolId === 'draft-message') && (
                      <div className="space-y-8">
                        <SectionLabel icon={PenTool} label="Communication_Specs" />
                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-2">
                             <span className="text-[9px] font-black uppercase text-white/30 ml-2">Mission ID</span>
                             <Input placeholder="Registry ID" value={jobId} onChange={e => setJobId(e.target.value)} className="bg-white/5 border-white/5 h-12 rounded-xl" />
                           </div>
                           <div className="space-y-2">
                             <span className="text-[9px] font-black uppercase text-white/30 ml-2">Signal Tone</span>
                             <Select value={tone} onValueChange={setTone}>
                               <SelectTrigger className="bg-white/5 border-white/5 h-12 rounded-xl text-white font-bold">
                                 <SelectValue />
                               </SelectTrigger>
                               <SelectContent className="glass-card bg-black border-white/10 rounded-2xl">
                                 {TONES.map(t => <SelectItem key={t} value={t} className="text-xs font-bold">{t}</SelectItem>)}
                               </SelectContent>
                             </Select>
                           </div>
                        </div>
                        {activeToolId === 'draft-message' && (
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                               <span className="text-[9px] font-black uppercase text-white/30 ml-2">Recipient Rank/Name</span>
                               <Input placeholder="Name" value={recipientName} onChange={e => setRecipientName(e.target.value)} className="bg-white/5 border-white/5 h-12 rounded-xl" />
                            </div>
                            <div className="space-y-2">
                               <span className="text-[9px] font-black uppercase text-white/30 ml-2">Signal Purpose</span>
                               <Input placeholder="Purpose" value={purpose} onChange={e => setPurpose(e.target.value)} className="bg-white/5 border-white/5 h-12 rounded-xl" />
                            </div>
                          </div>
                        )}
                        <div className="space-y-2">
                           <span className="text-[9px] font-black uppercase text-white/30 ml-2">Extra Mission Context</span>
                           <Textarea 
                             placeholder="Any additional intelligence to include..."
                             value={extraContext}
                             onChange={e => setExtraContext(e.target.value)}
                             className="min-h-[150px] bg-white/5 border-white/5 rounded-2xl p-6 shadow-inner"
                           />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-6">
                    <Button 
                      onClick={handleExecute}
                      disabled={isPending}
                      className="w-full h-16 rounded-3xl bg-primary text-primary-foreground font-heading font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                      {isPending ? <Loader2 className="size-6 animate-spin" /> : <><Sparkles className="size-5 mr-3" /> Execute Protocol</>}
                    </Button>
                  </div>
                </div>

                {/* TOOL RESULT AREA */}
                <div className="lg:col-span-6 border-l border-white/5 pl-0 lg:pl-12">
                   <SectionLabel icon={Settings} label="Process_Output" />
                   
                   <div className="min-h-[500px] rounded-[2.5rem] bg-white/[0.02] border border-white/5 p-10 relative overflow-hidden flex flex-col items-center justify-center">
                     <AnimatePresence mode="wait">
                       {!lastResult ? (
                         <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center space-y-6">
                            <div className="size-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto animate-pulse">
                              <Terminal className="size-8 text-white/20" />
                            </div>
                            <div className="space-y-2">
                               <p className="text-[11px] font-black uppercase tracking-[0.3em] text-white/30">System Idle</p>
                               <p className="text-[10px] text-white/10 font-bold uppercase tracking-widest max-w-[240px]">Initialize inputs and execute protocol to generate intelligence result.</p>
                            </div>
                         </motion.div>
                       ) : (
                         <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full h-full flex flex-col justify-start">
                             <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-6">
                               <CheckCircle2 className="size-6 text-emerald-500" />
                               <span className="text-[12px] font-black uppercase tracking-widest text-white">Data_Recovered_200_OK</span>
                             </div>

                             <div className="flex-1 overflow-y-auto custom-scrollbar space-y-8 pr-2">
                                {/* TOOL-SPECIFIC RESULT MAPPING */}
                                
                                {activeToolId === 'ask' && (
                                  <p className="text-lg leading-relaxed text-white font-medium">
                                    {typeof lastResult === 'object' 
                                      ? (lastResult.content || lastResult.answer || lastResult.result || lastResult.response || JSON.stringify(lastResult)) 
                                      : (lastResult || "TRANSMISSION_EMPTY")}
                                  </p>
                                )}

                                {activeToolId === 'analyze-cv' && (
                                  <div className="space-y-8">
                                    <div className="space-y-2">
                                      <p className="text-2xl font-black text-primary uppercase">{lastResult.fullName}</p>
                                      <p className="text-sm text-white/60 font-medium">{lastResult.professionalSummary}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <ResultCard label="Exp Years" value={lastResult.experienceYears} />
                                      <ResultCard label="Profile Pulse" value="Stable" />
                                    </div>
                                    <ResultList label="Skills Extracted" items={lastResult.skills} />
                                    <ResultList label="Action Improvements" items={lastResult.howToImprove} color="text-amber-400" />
                                  </div>
                                )}

                                {activeToolId === 'skill-gap' && (
                                  <div className="space-y-8">
                                    <div className="p-8 rounded-[2rem] bg-black/40 border border-white/10 flex flex-col items-center">
                                       <div className="relative size-32 flex items-center justify-center mb-6">
                                          <svg className="size-full" viewBox="0 0 100 100">
                                            <circle cx="50" cy="50" r="45" fill="none" stroke="white" strokeWidth="2" className="opacity-10" />
                                            <motion.circle 
                                              cx="50" cy="50" r="45" fill="none" stroke="oklch(0.6 0.22 25)" strokeWidth="4" strokeLinecap="round" 
                                              initial={{ pathLength: 0 }} 
                                              animate={{ pathLength: (lastResult.matchScore) / 100 }} 
                                              transition={{ duration: 1.5 }} 
                                            />
                                          </svg>
                                          <span className="absolute text-4xl font-black text-white">{lastResult.matchScore}</span>
                                       </div>
                                       <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Trajectory Fit Score</span>
                                    </div>
                                    <p className="text-[15px] font-medium text-white/60 italic leading-relaxed">{lastResult.fitSummary}</p>
                                    <ResultList label="Operational Strengths" items={lastResult.strengths} color="text-emerald-400" />
                                    <ResultList label="Missing Mission Skills" items={lastResult.missingSkills} color="text-rose-400" />
                                  </div>
                                )}

                                {activeToolId === 'improve-job' && (
                                  <div className="space-y-8">
                                    <div className="space-y-2">
                                       <span className="text-[9px] font-black text-primary uppercase tracking-widest">Optimized Signal Header</span>
                                       <p className="text-2xl font-black text-white">{lastResult.improvedTitle}</p>
                                    </div>
                                    <div className="space-y-2">
                                       <span className="text-[9px] font-black text-primary uppercase tracking-widest">Decrypted Description</span>
                                       <p className="text-sm leading-relaxed text-white/70">{lastResult.improvedDescription}</p>
                                    </div>
                                    <ResultList label="Core Skills Sync" items={lastResult.suggestedSkills} />
                                    <ResultList label="Mission Responsibilities" items={lastResult.suggestedResponsibilities} />
                                  </div>
                                )}

                                {(activeToolId === 'draft-letter' || activeToolId === 'draft-message') && (
                                  <div className="space-y-6">
                                    <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                                       <span className="text-[9px] font-black uppercase text-primary tracking-widest">Signal Subject</span>
                                       <p className="text-sm font-black text-white">{lastResult.subject || 'DRAFT_TRANSMISSION'}</p>
                                    </div>
                                    <div className="bg-black/20 rounded-[2rem] p-8 space-y-2 shadow-inner border border-white/5">
                                      <span className="text-[9px] font-black uppercase text-primary tracking-widest">Transmission Content</span>
                                      <div className="text-[14px] leading-relaxed text-white/80 whitespace-pre-wrap font-medium">{lastResult.content}</div>
                                    </div>
                                    <Button onClick={() => { navigator.clipboard.writeText(lastResult.content || ''); toast.success('Signal content copied to buffer'); }} className="w-full bg-white/5 hover:bg-white/10 text-white/40 h-14 rounded-2xl font-black uppercase text-[10px] tracking-widest">Copy to Buffer</Button>
                                  </div>
                                )}
                             </div>
                         </motion.div>
                       )}
                     </AnimatePresence>
                   </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </Card>
      </div>
    </div>
  );
}

// --- HELPER COMPONENTS ---

function ResultCard({ label, value }: { label: string; value: any }) {
  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-1">
      <p className="text-[9px] font-black uppercase tracking-widest text-white/30">{label}</p>
      <p className="text-xl font-black text-white">{value}</p>
    </div>
  );
}

function ResultList({ label, items, color = "text-primary" }: { label: string; items: string[] | null; color?: string }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className={cn("size-1 rounded-full bg-current", color)} />
        <span className={cn("text-[9px] font-black uppercase tracking-widest", color)}>{label}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item, i) => (
          <span key={i} className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[11px] font-bold text-white/70">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

const Radio = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3" fill="currentColor" />
  </svg>
);
