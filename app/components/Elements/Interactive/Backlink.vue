<template>
    <NuxtLink v-if="previousPath" :to="previousPath"><- back</NuxtLink>
    <span v-else class="disabled-link"><- back</span>
</template>
  
<script setup lang="ts">
import { useNavigationStore } from '~/stores/useNavigationStore';
import { computed } from 'vue';

const navigationStore = useNavigationStore();
const previousPath = computed(() => navigationStore.getPreviousPath());
</script>

<style scoped>
.disabled-link {
opacity: 0.5;
cursor: not-allowed;
}
</style>
  