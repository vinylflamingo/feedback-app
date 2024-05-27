<template>



  <div id="layout-container" class="font-jost bg-veryLightBlue flex flex-col items-center h-screen w-screen">
    <slot v-if="gateway" />
    <login v-else />
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/store/auth';
import { useRouter, useRoute } from 'vue-router';
import { ref, watch } from 'vue';
import Login from '~/pages/login.vue';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const gateway = ref(authStore.isAuthenticated);

// Watch for route changes
watch(() => route.path, () => {
  gateway.value = authStore.isAuthenticated;
}, { immediate: true });

watch(gateway, (newVal, oldVal) => {
  if (newVal && route.path === '/login') {
    router.push('/'); 
  }
});
</script>
