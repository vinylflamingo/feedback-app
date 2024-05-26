<template>
  <div>
    <NuxtLink :to="`/suggestion/${id}`"><- Back</NuxtLink>
    <h1>Edit Page</h1>
    <p>The suggestion id is: {{ id }}</p>
    <Base :apiCall="formApiCall" formId="base-form" :suggestionId="id">
      <EditSuggestions v-if="suggestion" :suggestion="suggestion"/>
      <div v-else>Loading...</div>
    </Base>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Base from '~/components/Form/Base.vue';
import { SUGGESTION_API_CALLS } from '@/constants/constants';
import { SuggestionApi } from '@/constants/enums';
import EditSuggestions from '~/components/Form/EditSuggestions.vue';
import type { Suggestion } from '~/types';

const route = useRoute();
const router = useRouter();
const id = ref<number | null>(null);
const formApiCall = SUGGESTION_API_CALLS[SuggestionApi.UPDATE_SUGGESTION];

const fetchSuggestion = async (suggestionId: number) => {
  if (isNaN(suggestionId) || suggestionId === null || suggestionId === undefined) {
    await router.push('/404');
    throw new Error('Invalid ID');
  }
  id.value = suggestionId;
  return await SUGGESTION_API_CALLS[SuggestionApi.GET_SUGGESTION](id.value);
};

const { data: suggestion, error, refresh } = await useAsyncData<Suggestion>('suggestion-edit', () => fetchSuggestion(Number(route.params.id)));

watch(
  () => route.params.id,
  async (newId) => {
    if (newId) {
      const suggestionId = Number(newId);
      if (isNaN(suggestionId) || suggestionId === null || suggestionId === undefined) {
        await router.push('/404');
        throw new Error('Invalid ID');
      }
      id.value = suggestionId;
      await refresh();
    }
  },
  { immediate: true }
);

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

if (error.value) {
  console.error('Failed to load suggestion data:', error.value);
  router.push('/404');
}
</script>
