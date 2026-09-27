import client from './client';

export const fixturesApi = {
  // Get fixtures with optional gameweek or status filter
  getAll: async (params = {}) => {
    const response = await client.get('/api/fixtures/', { params });
    return response.data;
  },

  // Simulate match outcome
  predict: async (homeTeam, awayTeam) => {
    const response = await client.post('/api/fixtures/predict/', {
      home_team: homeTeam,
      away_team: awayTeam,
    });
    return response.data;
  },

  // PremierZone live match center details
  getMatchCenter: async (fixtureId) => {
    const response = await client.get(`/api/fixtures/${fixtureId}/center/`);
    return response.data;
  },

  // Register fan prediction poll vote
  vote: async (fixtureId, choice) => {
    const response = await client.post(`/api/fixtures/${fixtureId}/center/vote/`, {
      choice,
    });
    return response.data;
  },
};

