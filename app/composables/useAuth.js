// composables/useAuth.js
import { computed } from 'vue';
import { useAuthStore } from '~/stores/auth';

export function useAuth() {
  const authStore = useAuthStore();

  const isAuthenticated = computed(() => authStore.isAuthenticated);

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