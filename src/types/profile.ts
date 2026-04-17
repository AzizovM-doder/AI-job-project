export enum ExperienceLevel {
  Junior = 'Junior',
  Middle = 'Middle',
  Senior = 'Senior'
}

export enum LanguageLevel {
  Beginner = 'Beginner',
  Elementary = 'Elementary',
  Intermediate = 'Intermediate',
  Advanced = 'Advanced',
  Native = 'Native'
}

export interface UserProfile {
  id: number;
  userId: number;
  firstName: string | null;
  lastName: string | null;
  headline?: string | null;
  about?: string | null;
  location?: string | null;
  photoUrl?: string | null;
  backgroundPhotoUrl?: string | null;
  birthDate?: string | null;
  createdAt?: string;
}

export interface UserCandidateProfile {
  id: number;
  userId: number;
  firstName: string | null;
  lastName: string | null;
  aboutMe: string | null;
  experienceYears: number;
  expectedSalary: number;
  cvFileUrl: string | null;
}

export interface Education {
  id: number;
  userId: number;
  institution: string | null;
  degree: string | null;
  startYear: number;
  endYear: number;
}

export interface Experience {
  id: number;
  userId: number;
  companyName: string | null;
  position: string | null;
  startDate: string;
  endDate: string | null;
}

export interface Skill {
  id: number;
  name: string | null;
  description: string | null;
}

export interface ProfileSkill {
  id: number;
  profileId: number;
  skillId: number;
  skillName?: string | null;
  endorsementsCount: number;
}

export interface ProfileLanguage {
  id: number;
  profileId: number;
  languageId: number;
  languageName?: string;
  level: LanguageLevel;
}

export interface Recommendation {
  id: number;
  authorId: number;
  recipientId: number;
  content: string | null;
  createdAt: string;
}

// DTOs for Mutations
export interface CreateProfileDto {
  userId: number;
  firstName: string | null;
  lastName: string | null;
  headline: string | null;
  about: string | null;
  location: string | null;
  photoUrl: string | null;
  backgroundPhotoUrl: string | null;
  birthDate: string | null;
}

export interface UpdateProfileDto {
  id: number;
  firstName: string | null;
  lastName: string | null;
  headline: string | null;
  about: string | null;
  location: string | null;
  photoUrl: string | null;
  backgroundPhotoUrl: string | null;
}

export interface CreateCandidateProfileDto {
  userId: number;
  firstName: string | null;
  lastName: string | null;
  aboutMe: string | null;
  experienceYears: number;
  expectedSalary: number;
  cvFileUrl: string | null;
}

export interface CreateEducationDto {
  userId: number;
  institution: string | null;
  degree: string | null;
  startYear: number;
  endYear: number;
}

export interface CreateExperienceDto {
  userId: number;
  companyName: string | null;
  position: string | null;
  startDate: string;
  endDate: string | null;
}

export interface CreateProfileSkillDto {
  profileId: number;
  skillId: number;
  endorsementsCount?: number;
}

export interface CreateProfileLanguageDto {
  profileId: number;
  languageId: number;
  level: LanguageLevel;
}

export interface CreateRecommendationDto {
  recipientId: number;
  content: string | null;
}
