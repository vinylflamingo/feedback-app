<template>
  <div v-if="isAuthenticated">
    <NuxtPage />
  </div>
  <div v-else>
    <Login />
  </div>
</template>

<script setup>
import { useAuth } from '~/composables/useAuth';
const { isAuthenticated } = useAuth();
</script>