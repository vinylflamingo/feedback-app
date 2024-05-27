<template>
  <div>
    <NuxtLink :to="`/suggestion/${id}/edit`">Edit</NuxtLink>
    <h1>Suggestion Detail</h1>
    <SuggestionDetail v-if="suggestion" :suggestion="suggestion"/>
    <LoadingSvg v-else/>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { SUGGESTION_API_CALLS } from '@/constants/constants';
import { SuggestionApi } from '@/constants/enums';
import type { Suggestion } from '~/types';
import SuggestionDetail from '~/components/Dashboard/SuggestionDetail.vue';
import LoadingSvg from '~/components/Elements/LoadingSvg.vue';

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
  return await SUGGESTION_API_CALLS[SuggestionApi.GET_SUGGESTION](id.value);
});

if (error.value) {
  console.error('Failed to load suggestion data:', error.value);
  await router.push('/404');
}

onMounted(() => {
  const suggestionId = Number(route.params.id);
  console.log("Mounted with ID:", suggestionId);
  if (suggestionId) {
    id.value = suggestionId;
  } else {
    console.error('Invalid ID on mount');
    router.push('/404');
  }
});
</script>
