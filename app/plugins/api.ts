import { defineNuxtPlugin, useRuntimeConfig } from '#app'
import axios from 'axios'
import qs from 'qs'
import api from '@/services/api'
import { useAuthStore } from '~/stores'
import { useCookie } from '#app'

let isRefreshing = false

export default defineNuxtPlugin(async (nuxtApp) => {
  const config = useRuntimeConfig()
  const env = config.public as { [key: string]: string }
  const authStore = useAuthStore()

  const baseUrl: string = env.BASE_URL || "https://localhost:8000"
  console.log('Initializing API client with baseURL:', baseUrl)

  const apiClient = axios.create({
    baseURL: baseUrl,
    headers: {
      'Content-Type': 'application/json'
    },
    paramsSerializer: params => qs.stringify(params, { arrayFormat: 'brackets' })
  })

  const existingTokenCookie = useCookie(api.TOKEN_COOKIE)
  const existingToken = existingTokenCookie.value

  if (existingToken) {
    authStore.setToken(existingToken)

    const expirationCookie = useCookie(api.TOKEN_EXPIRATION_COOKIE)
    const expirationValue = expirationCookie.value

    if (expirationValue) {
      const expirationTimestamp = Date.parse(expirationValue as string)
      if (expirationTimestamp) {
        const expirationDate = new Date(expirationTimestamp).toISOString()
        authStore.setTokenExpiration(expirationDate)
        
        if (new Date(expirationDate) <= new Date()) {
          console.log('Token expired. Clearing token.')
          authStore.clearToken()
        } else {
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${existingToken}`
        }
      }
    }
  }

  apiClient.interceptors.request.use(
    async (config) => {
      await checkTokenExpiration(apiClient)
      const token = authStore.getToken
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`
      }
      return config
    },
    (error) => Promise.reject(error)
  )

  api.setApiClient(apiClient)
  
  const isBuildTime = process.env.BUILD_TIME === 'true'
  console.log("is build time?", isBuildTime)
  if (isBuildTime) {
    api.enableBuildMode()
    
    console.log("automatic login injected.")
   // await api.login({username: process.env.BUILD_ADMIN_USERNAME, password: process.env.BUILD_ADMIN_PASSWORD})
    
  }

  nuxtApp.provide('api', api)
})

async function checkTokenExpiration(apiClient: any) {
  const authStore = useAuthStore()
  if (authStore.tokenExpiration === null) return
  const tokenExpiration = new Date(authStore.getTokenExpiration!)
  const currentTime = new Date()

  const tokenLifetime = parseInt(process.env.TOKEN_LIFETIME || '60') * 60 // Convert to seconds
  const tokenRefreshMargin = parseInt(process.env.TOKEN_REFRESH_MARGIN || '59') * 60 // Convert to seconds

  const timeDifference = (tokenExpiration.getTime() - currentTime.getTime()) / 1000
  const minutesUntilRefresh = Math.ceil(timeDifference / 60) // Ceil to account for partial minutes

  console.log("refresh token activates in", minutesUntilRefresh, "minutes")

  if (timeDifference > 0 && timeDifference <= tokenRefreshMargin && !isRefreshing) {
    isRefreshing = true
    console.log('Refreshing token...')
    refreshAuthToken(apiClient) // Purposefully removed await so refreshes don't stop the application, and failures don't break subsequent requests
  }
}

export const refreshAuthToken = async (apiClient: any): Promise<string | null> => {
  console.log("token refresh triggered")
  const authStore = useAuthStore()
  const tokenCookie = useCookie(api.TOKEN_COOKIE)
  const tokenExpirationCookie = useCookie(api.TOKEN_EXPIRATION_COOKIE)
  const tokenLifetime = parseInt(process.env.TOKEN_LIFETIME || '60') // Lifetime in minutes

  try {
    const response = await apiClient.post('/refresh_token', {}, {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const newToken = response.data.access_token
    authStore.setToken(newToken)
    tokenCookie.value = newToken

    const expiresIn = tokenLifetime * 60 // Convert minutes to seconds
    const expirationDate = new Date()
    expirationDate.setSeconds(expirationDate.getSeconds() + expiresIn)
    authStore.setTokenExpiration(expirationDate.toISOString())
    tokenExpirationCookie.value = expirationDate.toISOString()

    return newToken
  } catch (error: any) {
    console.error('Error refreshing token:', error)
    authStore.clearToken()
    return null
  } finally {
    isRefreshing = false
  }
}
