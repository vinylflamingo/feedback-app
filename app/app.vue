

<template>
  <NuxtLayout :name="layoutName">
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import api from '@/services/api'

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const config = useRuntimeConfig();

const tokenRefreshMargin: number = Number(config.public.TOKEN_REFRESH_MARGIN) || 10; // Default to 10 minutes
const layoutName = 'main';

onMounted(async () => {
  const tokenExpiration = authStore.getTokenExpiration();
  const currentTime = new Date();
  let remainingTime = 0;

  if (tokenExpiration) {
    remainingTime = (tokenExpiration.getTime() - currentTime.getTime()) / 1000; // Remaining time in seconds
    if (remainingTime > 0) {
      console.log(`Token will expire in ${remainingTime} seconds (${Math.floor(remainingTime / 60)} minutes).`);
      if (remainingTime < tokenRefreshMargin * 60 && remainingTime > 0) { // Check if we need to refresh the token
        console.log("Attempting to refresh token...");
        const newToken = await api.refreshAuthToken();
        if (newToken) {
          console.log("Token refreshed successfully.");
        } else {
          console.log("Failed to refresh token. Clearing token.");
          authStore.clearToken();
        }
      }
    } else {
      console.log("Token has already expired.");
      authStore.clearToken();
    }
  } else {
    console.log("No token expiration date found.");
  }

  console.log("ROUTE IS: ", route.path)
  console.log("Is Authenticated: ", authStore.isAuthenticated); 

  if (!authStore.isAuthenticated && route.path !== "/login") {
    await router.push({
      path: '/login',
      query: {
        returnUrl: route.path
      }
    });
  }
});
</script>
