// store/auth.ts
import { defineStore } from 'pinia'

interface AuthState {
  token: string | null;
  tokenExpiration: Date | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: null,
    tokenExpiration: null as Date | null,
  }),
  getters: {
    isAuthenticated: (state: AuthState) => !!state.token,
  },
  actions: {
    setToken(token: string | null) {
      this.token = token
    },
    clearToken() {
      this.token = null
      this.tokenExpiration = null
    },
    setTokenExpiration(expiration: Date | null) {
      this.tokenExpiration = expiration;
    },
    getTokenExpiration() {
      return this.tokenExpiration;
    }
  },
})
