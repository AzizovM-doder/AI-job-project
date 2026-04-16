export enum JobType {
  FullTime = 'FullTime',
  PartTime = 'PartTime',
  Remote = 'Remote',
  Hybrid = 'Hybrid'
}

export enum ExperienceLevel {
  Junior = 'Junior',
  Middle = 'Middle',
  Senior = 'Senior'
}

export enum ApplicationStatus {
  Pending = 'Pending',
  Reviewing = 'Reviewing',
  Accepted = 'Accepted',
  Rejected = 'Rejected',
  Withdrawn = 'Withdrawn'
}

export interface Job {
  id: number;
  organizationId: number;
  title: string | null;
  description: string | null;
  salaryMin: number;
  salaryMax: number;
  location: string | null;
  jobType: JobType;
  experienceLevel: ExperienceLevel;
  experienceRequired: number;
  categoryId: number;
  createdAt: string;
}

export interface JobApplication {
  id: number;
  jobId: number;
  userId: number;
  status: ApplicationStatus;
  appliedAt: string;
}

export interface JobWithMatchDto {
  job: Job;
  matchScore: number;
  matchSummary: string | null;
}

export interface ApplicantWithMatchDto {
  application: JobApplication;
  user?: {
    id: number;
    userName?: string;
    email?: string;
  };
  userProfileAbout: string | null;
  experienceYears: number;
  matchScore: number;
  matchSummary: string | null;
}

export interface JobCategory {
  id: number;
  name: string | null;
}

export interface JobSkill {
  id: number;
  jobId: number;
  skillId: number;
  skillName?: string;
}

// Paged Results
export interface JobPagedResult {
  items: Job[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface JobApplicationPagedResult {
  items: JobApplication[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface JobWithMatchDtoPagedResult {
  items: JobWithMatchDto[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface ApplicantWithMatchDtoPagedResult {
  items: ApplicantWithMatchDto[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

// DTOs for Mutations
export interface CreateJobDto {
  organizationId: number;
  title: string | null;
  description: string | null;
  salaryMin: number;
  salaryMax: number;
  location: string | null;
  jobType: JobType;
  experienceLevel: ExperienceLevel;
  experienceRequired: number;
  categoryId: number;
}

export interface UpdateJobDto {
  organizationId: number;
  title: string | null;
  description: string | null;
  salaryMin: number;
  salaryMax: number;
  location: string | null;
  jobType: JobType;
  experienceLevel: ExperienceLevel;
  experienceRequired: number;
  categoryId: number;
}

export interface CreateJobApplicationDto {
  jobId: number;
  userId: number;
}

export interface UpdateJobApplicationDto {
  id: number;
  jobId: number;
  userId: number;
  status: ApplicationStatus;
  appliedAt: string;
}

export interface CreateJobSkillDto {
  jobId: number;
  skillId: number;
}

export interface CreateJobCategoryDto {
  name: string | null;
}
