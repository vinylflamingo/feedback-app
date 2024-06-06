<template>
  <div class="flex flex-col justify-center items-center mt-6 max-w-[327px]">
    <div class="flex flex-row justify-between items-center w-full mb-3">
      <Backlink custom-path="/dashboard" /><Button :width="buttonWidth" :color="buttonColor" text="Edit Feedback" :to="buttonLink" />
    </div>
    <SuggestionDetail v-if="suggestion" :suggestion="suggestion"/>
    <LoadingSvg v-else/>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { SUGGESTION_API_CALLS } from '~/constants/api-calls';
import { ButtonWidth, ButtonColor, SuggestionApi } from '@/constants/enums';
import type { Suggestion } from '~/types';
import SuggestionDetail from '~/components/Dashboard/SuggestionDetail.vue';
import LoadingSvg from '~/components/Elements/Utility/LoadingSvg.vue';
import Backlink from '~/components/Elements/Interactive/Backlink.vue';
import Button from '~/components/Elements/Interactive/Button.vue';


const route = useRoute();
const router = useRouter();
const id = ref<number | null>(null);

const buttonWidth = ButtonWidth.SMALL;
const buttonColor = ButtonColor.BLUE
const buttonLink = computed(() => `/suggestion/${id.value}/edit`);

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
