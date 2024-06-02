import { defineNuxtPlugin, useCookie, useRuntimeConfig } from '#app'
import axios from 'axios'
import qs from 'qs'
import api from '@/services/api'
import { useAuthStore } from '~/stores/useAuthStore'
import type { AuthCookies, EncryptedCookie } from '~/types'
import { AppCookies } from '~/constants/enums'
import { useUserStore } from '~/stores/useUserStore'


export default defineNuxtPlugin(async (nuxtApp) => {
  const authStore = useAuthStore()
  const runtimeConfig = useRuntimeConfig()
  const config = useRuntimeConfig()
  const userStore = useUserStore()

  const baseUrl: string = config.public.BASE_URL || "https://localhost:8000"
  const apiClient = axios.create({
    baseURL: baseUrl,
    headers: {
      'Content-Type': 'application/json'
    },
    paramsSerializer: params => qs.stringify(params, { arrayFormat: 'brackets' })
  })
  
  const cookies: AuthCookies = {
    tokenCookie: useCookie(AppCookies.TOKEN_COOKIE),
    expirationCookie: useCookie(AppCookies.TOKEN_EXPIRATION_COOKIE),
    userCookie: useCookie(AppCookies.TOKEN_USER_ID),
  }
  

  api.setApiClient(apiClient)
  api.initialize(authStore, runtimeConfig, cookies, userStore)
  nuxtApp.provide('api', api)
})
