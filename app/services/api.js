import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000', // Update this with your API's base URL
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
});

export default {
  async login(username, password) {
    try {
      console.log("calling api....");
      const response = await apiClient.post('/token', { username, password });
      console.log("API response:", response.data);
      return response.data;
    } catch (error) {
      console.error("API error:", error.response ? error.response.data : error.message);
      throw new Error('Failed to log in');
    }
  },

  setAuthToken(token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  },

  clearAuthToken() {
    delete apiClient.defaults.headers.common['Authorization'];
  }
};