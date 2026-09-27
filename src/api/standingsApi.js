import apiClient from './client';

export const standingsApi = {
  getStandings: async (filter = 'all') => {
    const res = await apiClient.get('/api/standings/', {
      params: { filter },
    });
    return res.data;
  },
};
