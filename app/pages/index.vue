<template>
  <div class="h-screen">
    <SuggestionListing v-if="suggestions" :suggestions="suggestions"/>
    <LoadingSvg  v-else/>
  </div>
</template>
 
<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { SUGGESTION_API_CALLS } from '~/constants/api-calls';
import { SuggestionApi } from '@/constants/enums';
import SuggestionListing from '@/components/Dashboard/SuggestionListing.vue'
import LoadingSvg from '~/components/Elements/LoadingSvg.vue';
import type { Suggestion } from '@/types';

const route = useRoute();
const router = useRouter();
const id = ref<number | null>(null);

const { data: suggestions, error } = await useAsyncData<Suggestion[]>('dashboard-home', async () => {
  


  return await SUGGESTION_API_CALLS[SuggestionApi.READ_ALL]({limit: 100});
});
if (error.value) {
  console.error('Failed to load suggestions data:', error.value);
  navigateTo('/login')
}
</script>
