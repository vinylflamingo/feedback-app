<template>
  <div>
    <div class="flex flex-row justify-between">
      <Backlink /><Homelink />
    </div>
    
    <h1>Suggestion Detail</h1>
    <SuggestionDetail v-if="suggestion" :suggestion="suggestion"/>
    <LoadingSvg v-else/>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { SUGGESTION_API_CALLS } from '~/constants/api-calls';
import { SuggestionApi } from '@/constants/enums';
import type { Suggestion } from '~/types';
import SuggestionDetail from '~/components/Dashboard/SuggestionDetail.vue';
import LoadingSvg from '~/components/Elements/Utility/LoadingSvg.vue';
import Backlink from '~/components/Elements/Interactive/Backlink.vue';
import Homelink from '~/components/Elements/Interactive/Homelink.vue';

const route = useRoute();
const router = useRouter();
const id = ref<number | null>(null);

const { data: suggestion, error } = await useAsyncData<Suggestion>('suggestion', async () => {
  const newId = Number(route.params.id);
  if (isNaN(newId) || newId === null || newId === undefined) {
    await router.push('/404');
    throw new Error('Invalid ID');
  }
  id.value = newId;
  return await SUGGESTION_API_CALLS[SuggestionApi.READ_SUGGESTIONS]({ suggestion_id: id.value});
});

if (error.value) {
  console.error('Failed to load suggestion data:', error.value);
  await router.push('/404');
}

onMounted(() => {
  const suggestionId = Number(route.params.id);
  if (suggestionId) {
    id.value = suggestionId;
  } else {
    console.error('Invalid ID on mount');
    router.push('/404');
  }
});
</script>
