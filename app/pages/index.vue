<template>
  <div v-if="isAuthenticated">
    <h1>Authentication successful.</h1>
  </div>
  <div v-else>
    <Login />
  </div>
</template>

<script setup lang="js">
import { useAuth } from '~/composables/useAuth';
const { isAuthenticated } = useAuth();
</script>