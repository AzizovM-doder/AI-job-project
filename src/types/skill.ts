export interface Skill {
  id: number;
  name: string;
}

export interface ProfileSkill {
  id: number;
  profileId: number;
  skillId: number;
  skillName: string;
  endorsementCount?: number;
}

export interface CreateProfileSkillDto {
  skillName: string;
}

export interface ProfileLanguage {
  id: number;
  profileId: number;
  languageId: number;
  languageName: string;
  proficiencyLevel?: string;
}

export interface CreateProfileLanguageDto {
  languageName: string;
  proficiencyLevel?: string;
}

export interface UpdateProfileLanguageDto {
  proficiencyLevel?: string;
}

export interface Language {
  id: number;
  name: string;
}

export interface Endorsement {
  id: number;
  profileSkillId: number;
  endorserId: number;
  endorserName?: string;
  createdAt: string;
}

export interface CreateEndorsementDto {
  profileSkillId: number;
}

export interface JobSkill {
  id: number;
  jobId: number;
  skillId: number;
  skillName: string;
}

export interface CreateJobSkillDto {
  jobId: number;
  skillName: string;
}
