// plugins/initAuth.ts
import { defineNuxtPlugin, useCookie } from '#app'
import { useAuthStore } from '@/store/auth'

export default defineNuxtPlugin((nuxtApp) => {
  const authStore = useAuthStore()
  const tokenCookie = useCookie("1023n1212lno12oi12pubd012ud09n12ud90u21d9u12du1n2dn031n3n");
  if (tokenCookie.value) {
    authStore.setToken(tokenCookie.value);
  }
})