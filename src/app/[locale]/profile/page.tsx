'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { PageTransition } from '@/components/PageTransition';
import { useProfileQueries } from '@/hooks/queries/useProfileQueries';
import { useAuthStore } from '@/store/authStore';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Settings, ExternalLink } from 'lucide-react';
import { Experience, Education, ProfileSkill, ProfileLanguage } from '@/types/profile';

export default function ProfilePage() {
  const { user: authUser } = useAuthStore();
  const userId = authUser?.userId ? Number(authUser.userId) : 0;

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
    useUpdateCandidateProfile,
    useAddExperience,
    useUpdateExperience,
    useDeleteExperience,
    useAddEducation,
    useUpdateEducation,
    useDeleteEducation,
    useAddProfileSkill,
    useAddProfileLanguage,
    useAddRecommendation,
    useDeleteRecommendation
  } = useProfileQueries();

  // Smart identity fetcher (multi-endpoint fallback logic resides in useGetPublicProfile, 
  // but here we use the specialized useGetProfileByUserId for the owner)
  const { data: profile, isLoading: profileLoading } = useGetProfileByUserId(userId);
  const { data: candidate, isLoading: candidateLoading } = useGetCandidateProfile(userId);
  
  const profileId = profile?.id || 0;

  // Real data queries
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
  
  // NEW: Initialize mutations at top level to avoid hook violation in callbacks
  const addExpMutation = useAddExperience();
  const updateExpMutation = useUpdateExperience();
  const addEduMutation = useAddEducation();
  const updateEduMutation = useUpdateEducation();
  const addSkillMutation = useAddProfileSkill();
  const addLangMutation = useAddProfileLanguage();

  const { useUploadPhoto } = useProfileQueries();
  const uploadPhotoMutation = useUploadPhoto();

  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [pickType, setPickType] = useState<'photoUrl' | 'backgroundPhotoUrl'>('photoUrl');

  const handleImageSelect = (value: File | string) => {
    if (typeof value === 'string') {
      // It's a URL
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
      // It's a File
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

  return (
    <ProtectedRoute>
      <PageTransition className="max-w-5xl mx-auto space-y-6 pb-12">
        <ImagePickerModal
          isOpen={isPickerOpen}
          onClose={() => setIsPickerOpen(false)}
          onSelect={handleImageSelect}
          title={pickType === 'photoUrl' ? "Change Profile Photo" : "Change Cover Image"}
        />

        {/* Header/Hero Section */}
        <ProfileHero 
          profile={profile!} 
          candidate={candidate}
          isOwnProfile={true} 
          onEdit={() => setIsEditModalOpen(true)} 
          onOpenPhotoPicker={() => openPicker('photoUrl')}
          onOpenBackgroundPicker={() => openPicker('backgroundPhotoUrl')}
        />

        <ProfileEditModal
          key={profile?.id || 'new'}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          profile={profile!}
          userId={userId}
          onSave={(data) => {
            updateProfileMutation.mutate({ ...data, id: profile!.id }, {
              onSuccess: () => setIsEditModalOpen(false)
            });
          }}
          isPending={updateProfileMutation.isPending}
        />

        <ExperienceModal
          isOpen={isExpModalOpen}
          onClose={() => { setIsExpModalOpen(false); setSelectedExp(null); }}
          experience={selectedExp}
          userId={userId}
          onSave={(data) => {
            if ('id' in data) {
              updateExpMutation.mutate(data as Experience, {
                onSuccess: () => { setIsExpModalOpen(false); setSelectedExp(null); }
              });
            } else {
              addExpMutation.mutate(data, {
                onSuccess: () => { setIsExpModalOpen(false); setSelectedExp(null); }
              });
            }
          }}
          isPending={addExpMutation.isPending || updateExpMutation.isPending}
        />

        <EducationModal
          isOpen={isEduModalOpen}
          onClose={() => { setIsEduModalOpen(false); setSelectedEdu(null); }}
          education={selectedEdu}
          userId={userId}
          onSave={(data) => {
            if ('id' in data) {
              updateEduMutation.mutate(data as Education, {
                onSuccess: () => { setIsEduModalOpen(false); setSelectedEdu(null); }
              });
            } else {
              addEduMutation.mutate(data, {
                 onSuccess: () => { setIsEduModalOpen(false); setSelectedEdu(null); }
              });
            }
          }}
          isPending={addEduMutation.isPending || updateEduMutation.isPending}
        />

        <SkillModal
          isOpen={isSkillModalOpen}
          onClose={() => setIsSkillModalOpen(false)}
          profileId={profileId}
          onSave={(data) => {
            addSkillMutation.mutate(data, {
              onSuccess: () => setIsSkillModalOpen(false)
            });
          }}
          isPending={addSkillMutation.isPending}
        />

        <LanguageModal
          isOpen={isLanguageModalOpen}
          onClose={() => setIsLanguageModalOpen(false)}
          profileId={profileId}
          onSave={(data) => {
            addLangMutation.mutate(data, {
              onSuccess: () => setIsLanguageModalOpen(false)
            });
          }}
          isPending={addLangMutation.isPending}
        />

        <RecommendationModal 
          isOpen={isRecModalOpen}
          onClose={() => setIsRecModalOpen(false)}
          recipientName={profile?.firstName + ' ' + profile?.lastName}
          isPending={addRecMutation.isPending}
          onSave={(data) => {
            addRecMutation.mutate({ ...data, recipientId: userId }, {
              onSuccess: () => setIsRecModalOpen(false)
            });
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-6">
            <ProfileAbout 
              aboutMe={profile?.about || candidate?.aboutMe || ''} 
              isOwnProfile={true}
              profileId={profileId}
              userId={userId}
            />
            <ProfileExperience 
              experiences={experiences || []} 
              isOwnProfile={true} 
              onAdd={() => setIsExpModalOpen(true)}
              onEdit={(exp) => { setSelectedExp(exp); setIsExpModalOpen(true); }}
              onDelete={(id) => deleteExp.mutate({ id, userId })}
            />
            <ProfileEducation 
              educations={educations || []} 
              isOwnProfile={true} 
              onAdd={() => setIsEduModalOpen(true)}
              onEdit={(edu) => { setSelectedEdu(edu); setIsEduModalOpen(true); }}
              onDelete={(id) => deleteEdu.mutate({ id, userId })}
            />
            <ProfileSkills
              isOwnProfile={true}
              skills={skills || []}
              onAdd={() => setIsSkillModalOpen(true)}
              onDelete={(id) => deleteSkill.mutate({ id, profileId })}
              onEndorse={() => {}} // Endorsements are for others
            />
            <ProfileRecommendations 
              recommendations={recommendations || []}
              isOwnProfile={true}
              onAdd={() => setIsRecModalOpen(true)}
              onDelete={(id) => deleteRec.mutate(id)}
            />
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            <ProfileLanguages
              isOwnProfile={true}
              languages={languages || []}
              onAdd={() => setIsLanguageModalOpen(true)}
              onDelete={(id) => deleteLang.mutate({ id, profileId })}
            />
          </aside>
        </div>
      </PageTransition>
    </ProtectedRoute>
  );
}
