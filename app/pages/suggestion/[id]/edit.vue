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
const suggestion = ref<Suggestion | null>(null);
const formApiCall = SUGGESTION_API_CALLS[SuggestionApi.UPDATE_SUGGESTION];

// Watch for route parameter changes
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
      fetchSuggestion(suggestionId);
    }
  },
  { immediate: true }
);

// Fetch the suggestion data
async function fetchSuggestion(suggestionId: number) {
  try {
    const response = await SUGGESTION_API_CALLS[SuggestionApi.GET_SUGGESTION](suggestionId);
    suggestion.value = response;
  } catch (error) {
    console.error('Failed to load suggestion data:', error);
    await router.push('/404');
  }
}

// Ensure the parameter is set on component mount
onMounted(() => {
  const suggestionId = Number(route.params.id);
  console.log("Mounted with ID:", suggestionId);
  if (suggestionId) {
    id.value = suggestionId;
    fetchSuggestion(suggestionId);
  } else {
    console.error('Invalid ID on mount');
    router.push('/404');
  }
});
</script>
