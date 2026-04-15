export enum JobType {
  FullTime = 'FullTime',
  PartTime = 'PartTime',
  Remote = 'Remote',
  Hybrid = 'Hybrid',
  Contract = 'Contract',
  Internship = 'Internship'
}

export enum ExperienceLevel {
  Junior = 'Junior',
  Middle = 'Middle',
  Senior = 'Senior',
  EntryLevel = 'EntryLevel',
  Lead = 'Lead',
  Executive = 'Executive'
}

export enum ApplicationStatus {
  Pending = 'Pending',
  Reviewing = 'Reviewing',
  Accepted = 'Accepted',
  Rejected = 'Rejected',
  Withdrawn = 'Withdrawn'
}

export interface JobCategory {
  id: number;
  name: string;
  description?: string;
}

export interface Job {
  id: number;
  organizationId: number;
  title: string;
  description: string;
  salaryMin: number;
  salaryMax: number;
  location: string;
  jobType: JobType;
  experienceLevel: ExperienceLevel;
  experienceRequired: number;
  categoryId: number;
  categoryName?: string;
  isRemote: boolean;
  createdAt: string;
  organizationName?: string;
  requirements?: string[];
  skills?: string[];
}

export interface CreateJobDto {
  title: string;
  description: string;
  location: string;
  jobType: JobType;
  experienceLevel: ExperienceLevel;
  experienceRequired: number;
  salaryMin: number;
  salaryMax: number;
  categoryId: number;
  isRemote: boolean;
}

export interface UpdateJobDto {
  title?: string;
  description?: string;
  location?: string;
  jobType?: JobType;
  experienceLevel?: ExperienceLevel;
  experienceRequired?: number;
  salaryMin?: number;
  salaryMax?: number;
  categoryId?: number;
  isRemote?: boolean;
}

export interface JobApplication {
  id: number;
  jobId: number;
  userId: number;
  status: ApplicationStatus;
  appliedAt: string;
  coverLetter?: string;
  jobTitle?: string;
  organizationName?: string;
  applicantName?: string;
  applicantEmail?: string;
}

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

export interface JobWithMatchDto extends Job {
  matchPercentage: number;
  matchedSkills: string[];
  missingSkills: string[];
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

export interface ApplicantWithMatchDto {
  userId: number;
  fullName: string;
  email: string;
  profileId: number;
  matchPercentage: number;
  matchedSkills: string[];
  missingSkills: string[];
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

export interface ApiResponseWrapper<T> {
  statusCode: number;
  description: string[];
  data: T;
}
