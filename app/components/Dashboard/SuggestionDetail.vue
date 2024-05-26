<template>
    <div >
      <!-- Render your suggestion details here -->
      <h1>{{ }}</h1>
      <p>{{  }}</p>
    </div>
    <div >
      <p>Loading...</p>
    </div>
  </template>
  
  <script setup lang="ts">
//   import { ref, watch } from 'vue';
//   import { useRoute, useRouter } from 'vue-router';
//   import { SUGGESTION_API_CALLS } from '@/constants/constants';
//   import { SuggestionApi } from '@/constants/enums';
//   import { type Suggestion } from '~/types';
  
//   interface SuggestionDetailProps {
//     suggestion: Suggestion;
//   }
  
//   const props = defineProps<SuggestionDetailProps>();
  
//   const route = useRoute();
//   const router = useRouter();
//   const id = reactive<Suggestion | null>(null);
  
  
//   watch(() => route.params.id, (newId) => {
//     const num = Number(newId);
//     if (isNaN(num) || num === null || num === undefined) {
//       router.push('/404');
//     } else {
//       id.value = num;
//     }
//   }, { immediate: true });
  </script>