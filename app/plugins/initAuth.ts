// plugins/initAuth.ts
import { defineNuxtPlugin, useCookie } from '#app'
import { useAuthStore } from '@/store/auth'

export default defineNuxtPlugin((nuxtApp) => {
  const authStore = useAuthStore()
  const tokenCookie = useCookie('auth_token')
  if (tokenCookie.value) {
    authStore.setToken(tokenCookie.value)
  }
})