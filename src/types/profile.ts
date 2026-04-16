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
  aboutMe: string | null;
  experienceYears: number;
  expectedSalary: number;
  cvFileUrl: string | null;
}

export interface MemberProfileDto {
  userId: number;
  firstName: string | null;
  lastName: string | null;
  fullName: string | null;
  aboutMe: string | null;
  experienceYears: number;
}

export interface Education {
  id: number;
  profileId: number;
  schoolName: string | null;
  degree: string | null;
  fieldOfStudy: string | null;
  startDate: string;
  endDate: string;
  grade: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Experience {
  id: number;
  profileId: number;
  companyName: string | null;
  position: string | null;
  description: string | null;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  location: string | null;
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
  skillName: string | null;
  endorsementCount: number;
}

export interface Endorsement {
  id: number;
  endorserId: number;
  profileSkillId: number;
  createdAt: string;
}

export interface Recommendation {
  id: number;
  authorId: number;
  recipientId: number;
  content: string | null;
  createdAt: string;
}

export interface ProfileLanguage {
  id: number;
  profileId: number;
  languageId: number;
  languageName?: string;
  level: LanguageLevel;
}

// DTOs for Mutations
export interface CreateUserProfileDto {
  userId: number;
  firstName: string | null;
  lastName: string | null;
  aboutMe: string | null;
  experienceYears: number;
  expectedSalary: number;
  cvFileUrl: string | null;
}

export interface UpdateUserProfileDto {
  id: number;
  userId: number;
  firstName: string | null;
  lastName: string | null;
  aboutMe: string | null;
  experienceYears: number;
  expectedSalary: number;
  cvFileUrl: string | null;
}

export interface CreateUserEducationDto {
  userId: number;
  institution: string | null;
  degree: string | null;
  startYear: number;
  endYear: number;
}

export interface CreateUserExperienceDto {
  userId: number;
  companyName: string | null;
  position: string | null;
  startDate: string;
  endDate: string | null;
}

export interface CreateProfileSkillDto {
  profileId: number;
  skillId?: number;
  skillName?: string;
}

export interface CreateEndorsementDto {
  profileSkillId: number;
}

export interface CreateRecommendationDto {
  recipientId: number;
  content: string | null;
}

export interface CreateProfileLanguageDto {
  profileId: number;
  languageId: number;
  level: LanguageLevel;
}
