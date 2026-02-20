import api from './api';

const userService = {

  getAllUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },
  
  getCurrentUser: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },

  getUserById: async (userId) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  updateProfile: async (userData) => {
    const response = await api.put('/users/me', userData);
    return response.data;
  },

  searchUsers: async (query) => {
    const response = await api.get(`/users/search?q=${query}`);
    return response.data;
  },

  followUser: async (userId) => {
    const response = await api.post(`/users/${userId}/follow`);
    return response.data;
  },

  unfollowUser: async (userId) => {
    const response = await api.delete(`/users/${userId}/unfollow`);
    return response.data;
  },

  getFollowers: async (userId) => {
    const response = await api.get(`/users/${userId}/followers`);
    return response.data;
  },

  getFollowing: async (userId) => {
    const response = await api.get(`/users/${userId}/following`);
    return response.data;
  },
};

export default userService;