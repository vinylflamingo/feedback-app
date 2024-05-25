// store/auth.ts
import { defineStore } from 'pinia'

interface AuthState {
  token: string | null,
  user: string | null,
}

export const useAuthStore = defineStore({
  id: 'auth',
  state: (): AuthState => ({
    token: null,
    user: null,
  }),
  getters: {
    isAuthenticated: (state: AuthState) => !!state.token,
  },
  actions: {
    setToken(token: string) {
      this.token = token
    },
    clearToken() {
      this.token = null
    },
  },
})