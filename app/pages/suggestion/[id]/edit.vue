<template>
  <div>
    <div class="flex flex-row justify-between">
      <NuxtLink :to="`/suggestion/${id}`"><- Back</NuxtLink><Homelink />
    </div>
    <h1>Edit Page</h1>
    <p>The suggestion id is: {{ id }}</p>
    <Base :apiCall="formApiCall" formId="base-form" :suggestionId="id">
      <EditSuggestions v-if="suggestion" :suggestion="suggestion"/>
      <LoadingSvg v-else/>
    </Base>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import LoadingSvg from '~/components/Elements/LoadingSvg.vue';
import Base from '~/components/Form/Base.vue';
import { SUGGESTION_API_CALLS } from '~/constants/api-calls';
import { SuggestionApi } from '@/constants/enums';
import EditSuggestions from '~/components/Form/EditSuggestions.vue';
import type { Suggestion } from '~/types';
import Homelink from '~/components/Elements/Homelink.vue';

const route = useRoute();
const router = useRouter();
const id = ref<number | null>(null);
const formApiCall = SUGGESTION_API_CALLS[SuggestionApi.UPDATE_SUGGESTION_V2];

const fetchSuggestion = async (suggestionId: number) => {
  if (isNaN(suggestionId) || suggestionId === null || suggestionId === undefined) {
    await navigateTo('/500');
    throw new Error('Invalid ID');
  }
  id.value = suggestionId;
  return await SUGGESTION_API_CALLS[SuggestionApi.READ_SUGGESTIONS_V2]({suggestion_id: id.value, });
};

// Set the id immediately
if (route.params.id) {
  id.value = Number(route.params.id);
} else {
  id.value = null;
}

const { data: suggestion, error, refresh } = await useAsyncData<Suggestion>('suggestion-edit', () => fetchSuggestion(Number(route.params.id)));

watch(
  () => route.params.id,
  async (newId) => {
    if (newId) {
      const suggestionId = Number(newId);
      if (isNaN(suggestionId) || suggestionId === null || suggestionId === undefined) {
        await navigateTo('/404');
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
  if (suggestionId) {
    id.value = suggestionId;
  } else {
    navigateTo('/404');
  }
});

if (error.value) {
  console.error('Failed to load suggestion data:', error.value);
  navigateTo('/500');
}
</script>
