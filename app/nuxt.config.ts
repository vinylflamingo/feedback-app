import { readFileSync } from 'fs';
import path from 'path';

export default defineNuxtConfig({
  modules: [
    '@pinia/nuxt',
  ],
  plugins: ['~/plugins/api.ts'],
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  runtimeConfig: {
    public: {
      BASE_URL: process.env.BASE_URL || 'http://127.0.0.1:8000',
      TOKEN_LIFETIME: process.env.TOKEN_LIFETIME,
      TOKEN_REFRESH_MARGIN: process.env.TOKEN_REFRESH_MARGIN,
      BUILD_ADMIN_USERNAME: process.env.BUILD_ADMIN_USERNAME,
      BUILD_ADMIN_PASSWORD: process.env.BUILD_ADMIN_PASSWORD,
    },
  },
  routeRules: {
    '/': { prerender: true },
    '/suggestions/**': { prerender: true }
  }
});
