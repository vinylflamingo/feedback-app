// store/auth.ts
import { defineStore } from 'pinia'

export interface AuthState {
  token: string | null;
  tokenExpiration: Date | string | null;
  currentUserId: number | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: null,
    tokenExpiration: null as Date | null,
    currentUserId: null as number | null
  }),
  getters: {
    isAuthenticated: (state: AuthState) => !!state.token,
    getTokenExpiration: (state: AuthState) => state.tokenExpiration,
    getToken: (state: AuthState) => state.token,
    getCurrentUserId: (state: AuthState) => state.currentUserId
  },
  actions: {
    setUserId(id: number | null){
      this.currentUserId = id;
    },
    setToken(token: string | null) {
      this.token = token
    },
    clearToken() {
      this.token = null
      this.tokenExpiration = null
      this.currentUserId = null
    },
    setTokenExpiration(expiration: Date | string| null) {
      this.tokenExpiration = expiration;
    },
  },
})
