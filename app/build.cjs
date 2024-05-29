const axios = require('axios');
const qs = require('qs');
const { writeFileSync, mkdirSync } = require('fs');
const path = require('path');
require('dotenv').config();

async function generateRoutes() {
  const tokenLifetime = 5;
  const baseUrl = process.env.BASE_URL || "http://localhost:8000";

  const apiClient = axios.create({
    baseURL: baseUrl,
    headers: {
      'Content-Type': 'application/json',
    },
    paramsSerializer: (params) => {
      return qs.stringify(params, { arrayFormat: 'brackets' });
    },
  });

  const loginData = {
    username: process.env.BUILD_ADMIN_USERNAME,
    password: process.env.BUILD_ADMIN_PASSWORD,
  };

  console.log(loginData);

  try {
    const data = qs.stringify(loginData, { format: 'RFC1738' });
    const response = await apiClient.post('/token', data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const token = response.data.access_token;
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  } catch (error) {
    console.error('Failed to log in:', error);
    throw new Error('Failed to log in');
  }

  const includeArchived = { include_archived: true };

  let suggestions = [];
  try {
    const response = await apiClient.get('/suggestions?limit=10000000', {
      headers: {
        'Content-Type': 'application/json',
      },
      params: includeArchived,
    });
    suggestions = response.data;
  } catch (error) {
    console.error('Failed to read all suggestions:', error);
    throw new Error('Failed to read all suggestions');
  }

  const urls = suggestions.flatMap(suggestion => [
    `/suggestion/${suggestion.id}`,
    `/suggestion/${suggestion.id}/edit`,
  ]);

  const dirPath = path.resolve(__dirname, './.build');
  mkdirSync(dirPath, { recursive: true });

  const filePath = path.join(dirPath, 'staticRoutes.json');
  writeFileSync(filePath, JSON.stringify(urls, null, 2));
  console.log('Routes written to staticRoutes.json');
}

generateRoutes().catch(err => {
  console.error(err);
  process.exit(1);
});
