import client from './client';

export const authApi = {
  register: async (credentials) => {
    const response = await client.post('/api/auth/register/', credentials);
    return response.data;
  },

  login: async (credentials) => {
    const response = await client.post('/api/auth/login/', credentials);
    return response.data;
  },

  getMe: async () => {
    const response = await client.get('/api/auth/me/');
    return response.data;
  },

  refreshToken: async (refresh) => {
    const response = await client.post('/api/auth/refresh/', { refresh });
    return response.data;
  },

  oauthLogin: async (payload) => {
    const response = await client.post('/api/auth/oauth/', payload);
    return response.data;
  },
};
