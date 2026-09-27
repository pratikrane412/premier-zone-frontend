import client from './client';

export const playersApi = {
  // Get paginated players with search, filters, and ordering
  getAll: async (params = {}) => {
    const response = await client.get('/api/players/', { params });
    return response.data;
  },

  // Get single player detail
  getById: async (id) => {
    const response = await client.get(`/api/players/${id}/`);
    return response.data;
  },

  // Compare two players (radar stats + league percentiles)
  compare: async (player1Id, player2Id) => {
    const response = await client.get('/api/players/compare/', {
      params: { player1: player1Id, player2: player2Id },
    });
    return response.data;
  },

  // Get leaderboards across top metrics
  getLeaderboards: async () => {
    const response = await client.get('/api/leaderboards/');
    return response.data;
  },

  // Get all teams (details=true returns stadiums and official CDN badges)
  getTeams: async (details = true) => {
    const response = await client.get('/api/teams/', {
      params: { details },
    });
    return response.data;
  },

  // Legacy team player lookup
  searchTeamPlayers: async (teamName) => {
    const response = await client.get('/teams/search', {
      params: { team_name: teamName },
    });
    return response.data;
  },

  // Trigger live EPL sync from official API
  syncLiveEpl: async () => {
    const response = await client.post('/sync/live-epl/');
    return response.data;
  },
};
