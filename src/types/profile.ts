import { ProfileSkill, ProfileLanguage } from './skill';

export interface Education {
  id: number;
  school: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string;
  description?: string;
}

export interface Experience {
  id: number;
  company: string;
  title: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description?: string;
}

export interface UserProfile {
  id: number;
  userId: number;
  email: string;
  firstName?: string;
  lastName?: string;
  title?: string;
  bio?: string;
  profilePicture?: string;
  skills: string[];
  educations: Education[];
  experiences: Experience[];
  languages: any[];
  personalInterests: any[];
  profileSkills?: ProfileSkill[];
  profileLanguages?: ProfileLanguage[];
}
