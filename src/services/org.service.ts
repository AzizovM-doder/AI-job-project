import api from '@/src/lib/api';

export const orgService = {
  // Logic for managing organization profile and applicants
  // Job management has been moved to jobService for consistency with /Job API root

  getApplicants: async (jobId: string | number): Promise<any[]> => {
    const response = await api.get(`/Jobs/${jobId}/Applications`); // Keep plural if this is a separate controller, but check /Job docs
    // Check if /Job/{id}/Applications exists in future docs
    return response.data.data;
  },

  // Other Organization-specific methods can be added here
};
