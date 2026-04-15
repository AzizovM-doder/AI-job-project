import api from '@/src/lib/api';

export interface UserProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  title?: string;
  bio?: string;
  skills: string[];
  education: any[];
  experience: any[];
}

export const profileService = {
  getProfile: async (): Promise<UserProfile> => {
    const response = await api.get('/Profile');
    return response.data.data;
  },

  updateProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
    const response = await api.put('/Profile', data);
    return response.data.data;
  },

  updateSkills: async (skills: string[]): Promise<void> => {
    await api.post('/Profile/Skills', { skills });
  },

  getPublicProfile: async (userId: string): Promise<UserProfile> => {
    const response = await api.get(`/Users/${userId}/Profile`);
    return response.data.data;
  },
};
