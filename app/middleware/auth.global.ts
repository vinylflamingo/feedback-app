// middleware/auth.global.ts

import { defineNuxtRouteMiddleware, navigateTo } from '#imports'
import { useAuthStore } from '~/stores'
import { useRuntimeConfig } from '#imports'

export default defineNuxtRouteMiddleware((to, from) => {
  console.log("auth middleware activated")

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
    console.log('No token found. Redirecting to login.')
    return navigateTo('/login')
  }

  if (token && tokenExpiration) {
    const expirationDate = new Date(tokenExpiration)
    const currentTime = new Date()
    const timeDifference = (expirationDate.getTime() - currentTime.getTime()) / 1000 // Difference in seconds

    const minutesUntilExpiration = timeDifference / 60 // Convert to minutes
    const minutesUntilRefresh = minutesUntilExpiration - tokenRefreshMargin;

    console.log("minutes until expiration: ", minutesUntilExpiration)
    console.log(`Token will refresh in ${minutesUntilRefresh} minutes`)

    if (timeDifference <= 0) {
      console.log('Token expired. Clearing token and redirecting to login.')
      authStore.clearToken()
      return navigateTo('/login')
    }

    console.log('Token is valid. Proceeding to route.')
  }
})
