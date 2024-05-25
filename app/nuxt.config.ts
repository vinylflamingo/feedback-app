export default defineNuxtConfig({
  modules: [
    '@pinia/nuxt',
  ],
  plugins: ['~/plugins/initAuth.ts'],
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
      apiUrl: process.env.API_URL || 'http://127.0.0.1:8000',
    }
  }
})
