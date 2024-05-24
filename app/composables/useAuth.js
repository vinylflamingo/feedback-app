// composables/useAuth.js
import { computed } from 'vue';
import { useAuthStore } from '../store/auth'

export function useAuth() {
  const authStore = useAuthStore();

  const isAuthenticated = computed(() => !!authStore.token);

  const login = (token) => {
    authStore.setToken(token);
  };

  const logout = () => {
    authStore.clearToken();
  };

  return {
    isAuthenticated,
    login,
    logout,
  };
}