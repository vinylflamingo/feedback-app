export default defineNuxtConfig({
  modules: [
    '@pinia/nuxt',
  ],
  plugins: ['~/plugins/apiPlugin.ts'],
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
      BASE_URL: process.env.API_URL || 'http://127.0.0.1:8000',
      TOKEN_LIFETIME: process.env.TOKEN_LIFETIME,
      TOKEN_REFRESH_MARGIN: process.env.TOKEN_REFRESH_MARGIN,
    }
  }
})
