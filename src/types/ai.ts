export interface CreateAiPromptDto {
  prompt: string | null;
}

export interface AiCvAnalysisRequestDto {
  userId?: number | null;
  cvText?: string | null;
  cvFileUrl?: string | null;
  applyToProfile: boolean;
  syncSkills: boolean;
}

export interface AiCvAnalysisResultDto {
  fullName: string | null;
  firstName: string | null;
  lastName: string | null;
  professionalSummary: string | null;
  experienceYears: number;
  skills: string[] | null;
  education: string[] | null;
  recommendedRoles: string[] | null;
  notes: string[] | null;
  missingOrWeakSections: string[] | null;
  howToImprove: string[] | null;
  helpfulResources: string[] | null;
  sourceTextPreview: string | null;
}

export interface AiSkillGapResultDto {
  matchScore: number;
  fitSummary: string | null;
  strengths: string[] | null;
  missingSkills: string[] | null;
  nextSteps: string[] | null;
}

export interface AiJobImproveRequestDto {
  jobId?: number | null;
  title?: string | null;
  description?: string | null;
  location?: string | null;
  experienceRequired: number;
  applyToJob: boolean;
}

export interface AiJobImproveResultDto {
  improvedTitle: string | null;
  improvedDescription: string | null;
  suggestedSkills: string[] | null;
  suggestedResponsibilities: string[] | null;
  suggestedBenefits: string[] | null;
}

export interface AiDraftCoverLetterRequestDto {
  userId: number;
  jobId: number;
  tone?: string | null;
  extraContext?: string | null;
}

export interface AiDraftMessageRequestDto {
  userId: number;
  jobId?: number | null;
  recipientName?: string | null;
  purpose?: string | null;
  tone?: string | null;
  extraContext?: string | null;
}

export interface AiDraftResultDto {
  subject: string | null;
  content: string | null;
}

// Responses
export interface AiCvAnalysisResultDtoResponse {
  statusCode: number;
  description: string[] | null;
  data: AiCvAnalysisResultDto;
}

export interface AiSkillGapResultDtoResponse {
  statusCode: number;
  description: string[] | null;
  data: AiSkillGapResultDto;
}

export interface AiJobImproveResultDtoResponse {
  statusCode: number;
  description: string[] | null;
  data: AiJobImproveResultDto;
}

export interface AiDraftResultDtoResponse {
  statusCode: number;
  description: string[] | null;
  data: AiDraftResultDto;
}
