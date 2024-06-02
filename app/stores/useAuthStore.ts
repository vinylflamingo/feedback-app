// store/auth.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null);
  const tokenExpiration = ref<Date | string | null>(null);
  const currentUserId = ref<number | null>(null);

  const isAuthenticated = computed(() => !!token.value);
  const getTokenExpiration = computed(() => tokenExpiration.value);
  const getToken = computed(() => token.value);
  const getCurrentUserId = computed(() => currentUserId.value);

  function setUserId(id: number | null) {
    currentUserId.value = id;
  }

  function setToken(newToken: string | null) {
    token.value = newToken;
  }

  function clearToken() {
    token.value = null;
    tokenExpiration.value = null;
    currentUserId.value = null;
  }

  function setTokenExpiration(expiration: Date | string | null) {
    tokenExpiration.value = expiration;
  }

  return {
    token,
    tokenExpiration,
    currentUserId,
    isAuthenticated,
    getTokenExpiration,
    getToken,
    getCurrentUserId,
    setUserId,
    setToken,
    clearToken,
    setTokenExpiration
  };
});
