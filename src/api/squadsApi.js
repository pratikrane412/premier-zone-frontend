import client from './client';

export const squadsApi = {
  // Get all squads (user's or public)
  getAll: async () => {
    const response = await client.get('/api/squads/');
    return response.data;
  },

  // Get single squad by ID
  getById: async (id) => {
    const response = await client.get(`/api/squads/${id}/`);
    return response.data;
  },

  // Get shared squad by share code
  getShared: async (shareCode) => {
    const response = await client.get(`/api/squads/shared/${shareCode}/`);
    return response.data;
  },

  // Save new squad
  create: async (squadData) => {
    const response = await client.post('/api/squads/', squadData);
    return response.data;
  },

  // Update existing squad
  update: async (id, squadData) => {
    const response = await client.put(`/api/squads/${id}/`, squadData);
    return response.data;
  },

  // Delete squad
  delete: async (id) => {
    const response = await client.delete(`/api/squads/${id}/`);
    return response.data;
  },
};
