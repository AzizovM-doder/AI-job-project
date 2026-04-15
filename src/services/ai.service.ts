import api from '@/src/lib/api';

export const aiService = {
  analyzeCV: async (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/Ai/AnalyzeCV', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  analyzeSkillGap: async (jobId: string): Promise<any> => {
    const response = await api.get(`/Ai/SkillGap/${jobId}`);
    return response.data;
  },

  generateCoverLetter: async (jobId: string): Promise<any> => {
    const response = await api.post('/Ai/GenerateCoverLetter', { jobId });
    return response.data;
  },

  improveJobDescription: async (description: string): Promise<any> => {
    const response = await api.post('/Ai/ImproveJobDescription', { description });
    return response.data;
  },
};
