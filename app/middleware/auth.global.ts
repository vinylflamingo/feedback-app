// middleware/auth.global.ts

import { defineNuxtRouteMiddleware, navigateTo } from '#imports'
import { useAuthStore } from '~/stores/useAuthStore'
import { useRuntimeConfig } from '#imports'
import api from '~/services/api'

export default defineNuxtRouteMiddleware((to, from) => {

  if (to.path === '/login') {
    return
  }
  const config = useRuntimeConfig()

  const authStore = useAuthStore()
  const token = authStore.getToken
  const tokenExpiration = authStore.getTokenExpiration
  const tokenLifetime = parseInt(config.public.TOKEN_LIFETIME)
  const tokenRefreshMargin = parseInt(config.public.TOKEN_REFRESH_MARGIN)

  if (!token) {
    return navigateTo('/login')
  }

  if (token && tokenExpiration) {
    const expirationDate = new Date(tokenExpiration)
    const currentTime = new Date()
    const timeDifference = (expirationDate.getTime() - currentTime.getTime()) / 1000 // Difference in seconds

    const minutesUntilExpiration = timeDifference / 60 // Convert to minutes
    const minutesUntilRefresh = minutesUntilExpiration - tokenRefreshMargin;
    console.log(`Token will refresh in ${minutesUntilRefresh} minutes`)

    if (timeDifference <= 0) {
      authStore.clearToken();
      return navigateTo('/login');
    }
    
    if (minutesUntilExpiration <= 0) {
      return navigateTo('/login');
    }
    
    if (minutesUntilRefresh <= 0) {
      api.refreshAuthToken();
    }
    
    if (to.path === '/'){
      return navigateTo('dashboard')
    }

  }
})