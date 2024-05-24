// nuxt.config.js
export default defineNuxtConfig({
  typescript: {
    strict: false,
    typeCheck: false,
  },
  modules: ['@pinia/nuxt'],
  devtools: { enabled: true },
});