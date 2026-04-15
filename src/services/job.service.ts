import api from '@/src/lib/api';

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
  createdAt: string;
  companyName?: string; // Optional field for UI backward compatibility if needed
}

export interface PagedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface ApiResponseWrapper<T> {
  statusCode: number;
  description: string[];
  data: T;
}

export const jobService = {
  // GET /api/Job/paged
  getJobsPaged: async (params: {
    Title?: string;
    Location?: string;
    SalaryMin?: number;
    SalaryMax?: number;
    JobType?: string;
    ExperienceLevel?: string;
    OrganizationId?: number;
    CategoryId?: number;
    PageNumber?: number;
    PageSize?: number;
  }): Promise<PagedResponse<Job>> => {
    const response = await api.get('/Job/paged', { params });
    return response.data;
  },

  // GET /api/Job/mine
  getMyJobs: async (): Promise<Job[]> => {
    const response = await api.get('/Job/mine');
    return response.data.data;
  },

  // GET /api/Job/{id}
  getJobById: async (id: number | string): Promise<Job> => {
    const response = await api.get(`/Job/${id}`);
    return response.data.data;
  },

  // POST /api/Job
  createJob: async (jobData: Partial<Job>): Promise<string> => {
    const response = await api.post('/Job', jobData);
    return response.data.data;
  },

  // PUT /api/Job/{id}
  updateJob: async (id: number | string, jobData: Partial<Job>): Promise<string> => {
    const response = await api.put(`/Job/${id}`, jobData);
    return response.data.data;
  },

  // DELETE /api/Job/{id}
  deleteJob: async (id: number | string): Promise<string> => {
    const response = await api.delete(`/Job/${id}`);
    return response.data.data;
  },

  // GET /api/Job/by-organization/{organizationId}
  getByOrganization: async (orgId: number | string): Promise<Job[]> => {
    const response = await api.get(`/Job/by-organization/${orgId}`);
    return response.data.data;
  },

  // GET /api/Job/search
  searchByTitle: async (title: string): Promise<Job[]> => {
    const response = await api.get('/Job/search', { params: { title } });
    return response.data.data;
  },

  // GET /api/Job (all)
  getAllJobs: async (): Promise<Job[]> => {
    const response = await api.get('/Job');
    return response.data.data;
  }
};
