import { defineNuxtPlugin, useCookie, useRuntimeConfig } from '#app'
import axios from 'axios'
import qs from 'qs'
import api from '@/services/api'
import { useAuthStore } from '~/stores/useAuthStore'
import type { AuthCookies, EncryptedCookie } from '~/types'


export const TOKEN_COOKIE: string = 'auth_token'
export const TOKEN_EXPIRATION_COOKIE: string = 'auth_token_expiration'
export const TOKEN_USER_ID: string = "current_user_id"
export const TOKEN_ENCRYPTED_COOKIE: string = `
wxknAeEJfYz8G34AeaPbmtIhJcbn6ItT
eGxztBjrRjFUCcsgJD2n0dQCV0Tc2pQn
XAn1QoHlgiXIS82N7skVCCkt7w0lszcJ
1ZGAFY6zmXiemz1YfOoiNeh0HsF2gciz
auHS8eREXUtxmsHYeYOrFFc9we8gn0yn
ILsK3DH27FiMbOb5Ujh2etqp18dMVtP7
BQ2ylQ3nDvoFwzg4sDOpGN7694ka8r3b
9DTwNlztzf8kcSHCV7cxvlU4poKjz4Zs
DgfRKCTAKUm1VdJiaKujfo1Q8ff4FKUh
iqtjGiJyLtj9o5QTMQDtyjrWd25yy3Iu
rV18uNUwfUKrgHHJ8lSAodxKNN4UcmIC
qmVruam3pSUCPpGQX9YqLpaGExfMqpoJ
XZJ59L1pcc3KI8froYFtsMcpwjrgsLsN
KwEvL70uMRvdMmmOGjLbaGShNOgbZkoK
t1eMmFPc7GeSeuzhR8ycfXYNcoQsnDVC
7o2HDjP9MZiRmWDk5k1naiewGGUiN7a6
8Bm7u12fQfOVd8azySKGsVqN5AzfMYnQ
TWe0I3a2mLqvvwH1wVIVjDtPprsjF0YF
1RxAHpDbSrUeV9HuxC0dczs55ji1DdYw
w8Qb597iOuQwECWWLIBtCDSvmflFlASe
AlBbwqd6k7yj3x2lkQjpTvLM20w6EY9l
Dunb9kD10elKaKqnsEEQHc0XS9Auhr3R
TjOzD3nj509tnFNZGu6iuvkcotB2Do92
`

export default defineNuxtPlugin(async (nuxtApp) => {
  const authStore = useAuthStore()
  const runtimeConfig = useRuntimeConfig()
  const config = useRuntimeConfig()

  const baseUrl: string = config.public.BASE_URL || "https://localhost:8000"
  const apiClient = axios.create({
    baseURL: baseUrl,
    headers: {
      'Content-Type': 'application/json'
    },
    paramsSerializer: params => qs.stringify(params, { arrayFormat: 'brackets' })
  })
  
  const cookies: AuthCookies = {
    tokenCookie: useCookie(TOKEN_COOKIE),
    expirationCookie: useCookie(TOKEN_EXPIRATION_COOKIE),
    userCookie: useCookie(TOKEN_USER_ID),
  }

  api.setApiClient(apiClient)
  api.initialize(authStore, runtimeConfig, cookies)
  nuxtApp.provide('api', api)
})
