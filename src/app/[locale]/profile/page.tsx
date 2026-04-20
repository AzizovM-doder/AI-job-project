'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { PageTransition } from '@/components/PageTransition';
import { useProfileQueries } from '@/hooks/queries/useProfileQueries';
import { useAiQueries } from '@/hooks/queries/useAiQueries';
import { useAuthStore } from '@/store/authStore';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import ProfileHero from '@/components/profile/ProfileHero';
import ProfileAbout from '@/components/profile/ProfileAbout';
import ProfileExperience from '@/components/profile/ProfileExperience';
import ProfileEducation from '@/components/profile/ProfileEducation';
import ProfileSkills from '@/components/profile/ProfileSkills';
import ProfileLanguages from '@/components/profile/ProfileLanguages';
import ProfileEditModal from '@/components/profile/ProfileEditModal';
import ImagePickerModal from '@/components/profile/ImagePickerModal';
import ExperienceModal from '@/components/profile/ExperienceModal';
import EducationModal from '@/components/profile/EducationModal';
import SkillModal from '@/components/profile/SkillModal';
import LanguageModal from '@/components/profile/LanguageModal';
import ProfileRecommendations from '@/components/profile/ProfileRecommendations';
import RecommendationModal from '@/components/profile/RecommendationModal';
import CvUpload from '@/components/profile/CvUpload';
import { useState, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
  Sparkles,
  Settings,
  ExternalLink,
  UploadCloud,
  Loader2,
  ShieldCheck,
  Globe,
  Circle,
  FileText,
  BrainCircuit,
  CheckCircle2,
  AlertTriangle,
  Info,
  ChevronRight
} from 'lucide-react';
import { Experience, Education, ProfileSkill, ProfileLanguage } from '@/types/profile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function ProfilePage() {
  const { user: authUser } = useAuthStore();
  const queryClient = useQueryClient();
  const userId = authUser?.userId ? Number(authUser.userId) : 0;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    useGetProfileByUserId,
    useGetCandidateProfile,
    useGetProfileSkills,
    useGetProfileLanguages,
    useGetExperiencesByUser,
    useGetEducationsByUser,
    useGetRecommendations,
    useDeleteProfileSkill,
    useDeleteProfileLanguage,
    useUpdateProfile,
    useDeleteExperience,
    useDeleteEducation,
    useAddExperience,
    useUpdateExperience,
    useAddEducation,
    useUpdateEducation,
    useAddProfileSkill,
    useAddProfileLanguage,
    useAddRecommendation,
    useDeleteRecommendation,
    useUploadPhoto
  } = useProfileQueries();

  const { useAiAnalyzeCv } = useAiQueries();
  const analyzeCvMutation = useAiAnalyzeCv();

  const { data: profile, isLoading: profileLoading } = useGetProfileByUserId(userId);
  const { data: candidate, isLoading: candidateLoading } = useGetCandidateProfile(userId);

  const profileId = profile?.id || 0;

  const { data: skills } = useGetProfileSkills(profileId);
  const { data: languages } = useGetProfileLanguages(profileId);
  const { data: experiences } = useGetExperiencesByUser(userId);
  const { data: educations } = useGetEducationsByUser(userId);
  const { data: recommendations } = useGetRecommendations(userId);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isExpModalOpen, setIsExpModalOpen] = useState(false);
  const [selectedExp, setSelectedExp] = useState<Experience | null>(null);
  const [isEduModalOpen, setIsEduModalOpen] = useState(false);
  const [selectedEdu, setSelectedEdu] = useState<Education | null>(null);
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [isRecModalOpen, setIsRecModalOpen] = useState(false);

  const updateProfileMutation = useUpdateProfile();
  const deleteSkill = useDeleteProfileSkill();
  const deleteLang = useDeleteProfileLanguage();
  const deleteExp = useDeleteExperience();
  const deleteEdu = useDeleteEducation();
  const deleteRec = useDeleteRecommendation(userId);
  const addRecMutation = useAddRecommendation();

  const addExpMutation = useAddExperience();
  const updateExpMutation = useUpdateExperience();
  const addEduMutation = useAddEducation();
  const updateEduMutation = useUpdateEducation();
  const addSkillMutation = useAddProfileSkill();
  const addLangMutation = useAddProfileLanguage();
  const uploadPhotoMutation = useUploadPhoto();

  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [pickType, setPickType] = useState<'photoUrl' | 'backgroundPhotoUrl'>('photoUrl');

  const handleImageSelect = (value: File | string) => {
    if (typeof value === 'string') {
      const updateData = profile ? { ...profile } : {
        id: 0,
        userId,
        firstName: authUser?.fullName?.split(' ')[0] || 'New',
        lastName: authUser?.fullName?.split(' ')[1] || 'Member',
        headline: '',
        about: '',
        location: '',
        photoUrl: null,
        backgroundPhotoUrl: null
      };

      updateProfileMutation.mutate({
        ...updateData,
        [pickType]: value
      } as any);
    } else {
      uploadPhotoMutation.mutate(value, {
        onSuccess: (url) => {
          const updateData = profile ? { ...profile } : {
            id: 0,
            userId,
            firstName: authUser?.fullName?.split(' ')[0] || 'New',
            lastName: authUser?.fullName?.split(' ')[1] || 'Member',
            headline: '',
            about: '',
            location: '',
            photoUrl: null,
            backgroundPhotoUrl: null
          };

          updateProfileMutation.mutate({
            ...updateData,
            [pickType]: url
          } as any);
        }
      });
    }
  };

  const handleCvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    toast.promise(
      analyzeCvMutation.mutateAsync({
        userId,
        cvText: "Extracted biological resume data...",
        applyToProfile: true,
        syncSkills: true
      }),
      {
        loading: 'AI analyzing dossier DNA...',
        success: (res) => {
          return `Trajectory synced! ${res.data.skills?.length || 0} skills updated.`;
        },
        error: 'AI analysis uplink failed.'
      }
    );
  };

  const openPicker = (type: 'photoUrl' | 'backgroundPhotoUrl') => {
    setPickType(type);
    setIsPickerOpen(true);
  };

  const isLoading = profileLoading || candidateLoading;

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <Skeleton className="h-[400px] w-full rounded-xl" />
        <Skeleton className="h-[200px] w-full rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-[300px] w-full rounded-xl" />
          <Skeleton className="h-[300px] w-full rounded-xl" />
        </div>
      </div>
    );
  }

  const cvData = analyzeCvMutation.data?.data;
  const isFallback = cvData?.notes?.some(n => n.includes('Fallback')) || !cvData?.fullName;

  return (
    <ProtectedRoute>
      <PageTransition className="w-full space-y-8 pb-12">
        <ImagePickerModal
          isOpen={isPickerOpen}
          onClose={() => setIsPickerOpen(false)}
          onSelect={handleImageSelect}
          title={pickType === 'photoUrl' ? "Change Profile Photo" : "Change Cover Image"}
        />

        {/* Modals */}
        <ProfileEditModal key={profile?.id || 'new'} isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} profile={profile!} userId={userId} onSave={(data) => updateProfileMutation.mutate({ ...data, id: profile!.id }, { onSuccess: () => setIsEditModalOpen(false) })} isPending={updateProfileMutation.isPending} />
        <ExperienceModal isOpen={isExpModalOpen} onClose={() => { setIsExpModalOpen(false); setSelectedExp(null); }} experience={selectedExp} userId={userId} onSave={(data) => { if ('id' in data) { updateExpMutation.mutate(data as Experience, { onSuccess: () => { setIsExpModalOpen(false); setSelectedExp(null); } }); } else { addExpMutation.mutate(data, { onSuccess: () => { setIsExpModalOpen(false); setSelectedExp(null); } }); } }} isPending={addExpMutation.isPending || updateExpMutation.isPending} />
        <EducationModal isOpen={isEduModalOpen} onClose={() => { setIsEduModalOpen(false); setSelectedEdu(null); }} education={selectedEdu} userId={userId} onSave={(data) => { if ('id' in data) { updateEduMutation.mutate(data as Education, { onSuccess: () => { setIsEduModalOpen(false); setSelectedEdu(null); } }); } else { addEduMutation.mutate(data, { onSuccess: () => { setIsEduModalOpen(false); setSelectedEdu(null); } }); } }} isPending={addEduMutation.isPending || updateEduMutation.isPending} />
        <SkillModal isOpen={isSkillModalOpen} onClose={() => setIsSkillModalOpen(false)} profileId={profileId} onSave={(data) => { addSkillMutation.mutate(data, { onSuccess: () => setIsSkillModalOpen(false) }); }} isPending={addSkillMutation.isPending} />
        <LanguageModal isOpen={isLanguageModalOpen} onClose={() => setIsLanguageModalOpen(false)} profileId={profileId} onSave={(data) => { addLangMutation.mutate(data, { onSuccess: () => setIsLanguageModalOpen(false) }); }} isPending={addLangMutation.isPending} />
        <RecommendationModal isOpen={isRecModalOpen} onClose={() => setIsRecModalOpen(false)} recipientName={profile?.firstName + ' ' + profile?.lastName} isPending={addRecMutation.isPending} onSave={(data) => { addRecMutation.mutate({ ...data, recipientId: userId }, { onSuccess: () => setIsRecModalOpen(false) }); }} />

        {/* HERO SECTION */}
        <div className="relative">
          <ProfileHero
            profile={profile!}
            candidate={candidate}
            isOwnProfile={true}
            onEdit={() => setIsEditModalOpen(true)}
            onOpenPhotoPicker={() => openPicker('photoUrl')}
            onOpenBackgroundPicker={() => openPicker('backgroundPhotoUrl')}
          />

          <div className="absolute -bottom-6 left-8 right-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 bg-black/60 backdrop-blur-2xl border border-white/10 px-6 py-3 rounded-full shadow-2xl">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Circle className="size-3 text-emerald-500 fill-current animate-pulse" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Online</span>
              </div>
              <div className="w-px h-4 bg-white/10" />
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest text-foreground/70">Verified Crew</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input type="file" ref={fileInputRef} onChange={handleCvUpload} accept=".pdf,.doc,.docx" className="hidden" />
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={analyzeCvMutation.isPending}
                className="bg-primary hover:bg-primary/90 text-primary-foreground h-12 px-8 rounded-full font-black uppercase tracking-tighter shadow-xl shadow-primary/20 gap-2 tuff-motion"
              >
                {analyzeCvMutation.isPending ? <Loader2 className="animate-spin size-4" /> : <UploadCloud className="size-4" />}
                Analyze Dossier
              </Button>
              <Button variant="outline" className="glass h-12 w-12 rounded-full p-0 border-white/10">
                <Settings className="size-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT TABS */}
        <div className="mt-12 glass-card rounded-[2.5rem] overflow-hidden border border-white/5 bg-background/5 backdrop-blur-xl shadow-2xl">
          <Tabs defaultValue="about" className="w-full">
            <div className="border-b border-white/5 bg-black/20 px-8 py-2">
              <TabsList className="bg-transparent h-14 gap-8">
                <TabsTrigger value="about" className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full px-0 font-bold uppercase tracking-widest text-[10px] transition-all">About</TabsTrigger>
                <TabsTrigger value="experience" className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full px-0 font-bold uppercase tracking-widest text-[10px] transition-all">Experience</TabsTrigger>
                <TabsTrigger value="education" className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full px-0 font-bold uppercase tracking-widest text-[10px] transition-all">Education</TabsTrigger>
                <TabsTrigger value="skills" className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full px-0 font-bold uppercase tracking-widest text-[10px] transition-all">Skills</TabsTrigger>
                <TabsTrigger value="dossier" className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full px-0 font-bold uppercase tracking-widest text-[10px] transition-all gap-2">
                  <FileText className="size-3" /> Dossier
                </TabsTrigger>
                <TabsTrigger value="recommendations" className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full px-0 font-bold uppercase tracking-widest text-[10px] transition-all">Recommendations</TabsTrigger>
                <TabsTrigger value="ai-dna" className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full px-0 font-bold uppercase tracking-widest text-[10px] transition-all gap-2">
                  <BrainCircuit className="size-3" /> AI Analysis
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="md:min-h-[600px] md:max-h-[600px] overflow-y-auto custom-scrollbar">
              <TabsContent value="about" className="m-0 p-8 lg:p-12">
                <ProfileAbout aboutMe={profile?.about || candidate?.aboutMe || ''} isOwnProfile={true} profileId={profileId} userId={userId} />
              </TabsContent>
              <TabsContent value="experience" className="m-0 p-8 lg:p-12">
                <ProfileExperience experiences={experiences || []} isOwnProfile={true} onAdd={() => setIsExpModalOpen(true)} onEdit={(exp) => { setSelectedExp(exp); setIsExpModalOpen(true); }} onDelete={(id) => deleteExp.mutate({ id, userId })} />
              </TabsContent>
              <TabsContent value="education" className="m-0 p-8 lg:p-12">
                <ProfileEducation educations={educations || []} isOwnProfile={true} onAdd={() => setIsEduModalOpen(true)} onEdit={(edu) => { setSelectedEdu(edu); setIsEduModalOpen(true); }} onDelete={(id) => deleteEdu.mutate({ id, userId })} />
              </TabsContent>
              <TabsContent value="skills" className="m-0 p-8 lg:p-12">
                <ProfileSkills isOwnProfile={true} skills={skills || []} onAdd={() => setIsSkillModalOpen(true)} onDelete={(id) => deleteSkill.mutate({ id, profileId })} onEndorse={() => { }} />
              </TabsContent>
              <TabsContent value="recommendations" className="m-0 p-8 lg:p-12">
                <ProfileRecommendations recommendations={recommendations || []} isOwnProfile={true} onAdd={() => setIsRecModalOpen(true)} onDelete={(id) => deleteRec.mutate(id)} />
              </TabsContent>
              <TabsContent value="dossier" className="m-0 p-8 lg:p-12 space-y-8">
                 <div className="max-w-2xl mx-auto">
                    <div className="flex items-center gap-4 mb-10">
                       <div className="size-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                          <FileText className="size-6 text-primary" />
                       </div>
                       <div>
                          <h3 className="text-xl font-black uppercase tracking-tighter">Mission Dossier</h3>
                          <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Permanent tactical file for recruitment protocols</p>
                       </div>
                    </div>
                    
                    <CvUpload 
                      userId={userId} 
                      currentCvUrl={candidate?.cvFileUrl} 
                      onSuccess={() => {
                        // Refresh candidate profile to show updated status
                        queryClient.invalidateQueries({ queryKey: ["profiles", "candidate", userId] });
                      }}
                    />

                    <div className="mt-12 p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5">
                       <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-4">Tactical Benefits</h4>
                       <ul className="space-y-4">
                          <li className="flex items-start gap-3">
                             <div className="size-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                             <p className="text-xs text-white/60 leading-relaxed font-medium">Verified dossiers are prioritized by Command during crew selection missions.</p>
                          </li>
                          <li className="flex items-start gap-3">
                             <div className="size-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                             <p className="text-xs text-white/60 leading-relaxed font-medium">Automatic extraction protocols will sync your credentials to the global registry.</p>
                          </li>
                       </ul>
                    </div>
                 </div>
              </TabsContent>

              <TabsContent value="ai-dna" className="m-0 p-8 lg:p-12 space-y-8">
                {cvData ? (
                  <div className="space-y-8">
                    {isFallback && (
                      <div className="bg-amber-500/10 border border-amber-500/20 rounded-3xl p-6 flex items-start gap-4">
                        <AlertTriangle className="size-6 text-amber-500 shrink-0 mt-1" />
                        <div>
                          <h4 className="text-amber-500 font-black uppercase tracking-widest text-xs">Low Fidelity Extraction Detected</h4>
                          <p className="text-xs text-amber-500/70 font-medium mt-1">The system encountered difficulties parsing the biological data. Fallback protocols were initiated. Manual verification is highly recommended.</p>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <Card className="rounded-[2.5rem] bg-white/5 border-white/10 p-8 space-y-6">
                        <h4 className="text-xs font-black uppercase tracking-[0.3em] text-primary flex items-center gap-2">
                          <Info className="size-4" /> Detected Credentials
                        </h4>
                        <div className="space-y-4">
                          <div>
                            <span className="text-[10px] font-black uppercase text-foreground/40 block mb-1">Subject Name</span>
                            <p className="text-lg font-black tracking-tight">{cvData.fullName || "Unresolved"}</p>
                          </div>
                          <div>
                            <span className="text-[10px] font-black uppercase text-foreground/40 block mb-1">Service Duration</span>
                            <p className="text-lg font-black tracking-tight">{cvData.experienceYears} Standard Martian Years</p>
                          </div>
                        </div>
                      </Card>

                      <Card className="rounded-[2.5rem] bg-white/5 border-white/10 p-8 space-y-6">
                        <h4 className="text-xs font-black uppercase tracking-[0.3em] text-emerald-500 flex items-center gap-2">
                          <CheckCircle2 className="size-4" /> Extracted Skill Stack
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {cvData.skills?.map(skill => (
                            <span key={skill} className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-black uppercase text-emerald-400">
                              {skill}
                            </span>
                          ))}
                          {(!cvData.skills || cvData.skills.length === 0) && <p className="text-xs italic text-foreground/30">No skills identified.</p>}
                        </div>
                      </Card>

                      <div className="md:col-span-2 space-y-8">
                        <div className="space-y-4">
                          <h4 className="text-xs font-black uppercase tracking-[0.3em] text-foreground/60">Professional Trajectory Summary</h4>
                          <p className="text-sm font-medium leading-relaxed italic opacity-80">{cvData.professionalSummary || "No summary extracted."}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-amber-500">Dossier Gaps</h4>
                            <div className="space-y-2">
                              {cvData.missingOrWeakSections?.map(section => (
                                <div key={section} className="flex items-center gap-3 p-3 rounded-xl bg-amber-500/5 border border-amber-500/10 text-[11px] font-bold">
                                  <div className="size-1.5 rounded-full bg-amber-500" /> {section}
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-4">
                            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-primary">Priority Improvements</h4>
                            <div className="space-y-2">
                              {cvData.howToImprove?.map(step => (
                                <div key={step} className="flex items-start gap-3 p-3 rounded-xl bg-primary/5 border border-primary/10 text-[11px] font-bold">
                                  <ChevronRight className="size-3 text-primary shrink-0 mt-0.5" /> <span>{step}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="p-6 rounded-[2rem] bg-black/40 border border-white/5 space-y-3">
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-foreground/30 italic">System Execution Logs</h4>
                          <div className="space-y-1">
                            {cvData.notes?.map((note, i) => (
                              <p key={i} className="text-[10px] font-mono text-foreground/40">{`> ${note}`}</p>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-24 text-center">
                    <BrainCircuit className="size-16 text-foreground/10 mb-6" />
                    <h3 className="text-xl font-black uppercase tracking-tighter">AI Core Suspended</h3>
                    <p className="text-sm text-foreground/40 max-w-sm mt-2">Initialize your dossier DNA through CV analysis to activate specialized professional trajectory insights.</p>
                    <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="mt-8 rounded-full border-white/10 glass px-10 font-bold uppercase tracking-widest text-[10px]">
                      Upload for Analysis
                    </Button>
                  </div>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </PageTransition>
    </ProtectedRoute>
  );
}
