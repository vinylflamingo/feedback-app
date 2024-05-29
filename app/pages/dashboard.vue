<template>
    <div class="h-screen">
      <SuggestionListing v-if="suggestions.length" :suggestions="suggestions" />
      <div v-else class="h-screen w-screen flex items-center justify-center">
        <LoadingSvg />
      </div>
      <button v-if="hasMore && !loading" @click="loadMore" class="load-more-button">Load More</button>
      <LoadingSvg v-if="loading" />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useAsyncData, useNuxtApp } from '#app';
  import { SUGGESTION_API_CALLS } from '~/constants/api-calls';
  import { SuggestionApi } from '@/constants/enums';
  import SuggestionListing from '@/components/Dashboard/SuggestionListing.vue';
  import LoadingSvg from '~/components/Elements/LoadingSvg.vue';
  import type { Suggestion } from '@/types';
  
  const suggestions = ref<Suggestion[]>([]);
  const limit: number = 10;
  const skip = ref<number>(0);
  const hasMore = ref<boolean>(true);
  const loading = ref<boolean>(false);
  
  const { data, error } = await useAsyncData<Suggestion[]>('dashboard-home', async () => {
    return await SUGGESTION_API_CALLS[SuggestionApi.READ_ALL]({ limit: limit });
  });
  
  if (error.value) {
    console.error('Failed to load suggestions data:', error.value);
  } else {
    suggestions.value = data.value || [];
    hasMore.value = (data.value?.length ?? 0) === limit;
  }
  
  // Function to fetch more suggestions
  const fetchSuggestions = async (currentSkip: number): Promise<Suggestion[]> => {
    console.log("fetching more....")
    loading.value = true;
    let sleepToAnimate: void = await new Promise(r => setTimeout(() => r(), Math.floor(Math.random() * 700) + 1));
    try {
      const response: Suggestion[] = await SUGGESTION_API_CALLS[SuggestionApi.READ_ALL]({ limit: limit + 1, skip: currentSkip });
      let mutatedResponse: Suggestion[] = response;
      if (response.length === 10 + currentSkip + 1) {
        hasMore.value = true;
      }
      loading.value = false;
      console.log("mutated", mutatedResponse)
      return mutatedResponse;
    } catch (err) {
      console.error('Failed to load more suggestions data:', err);
      loading.value = false;
      return [];
    }
  };
  
  const loadMore = async (): Promise<void> => {
    skip.value += 10
    const newSuggestions: Suggestion[] = (await fetchSuggestions(skip.value)).slice(0, -1);
    console.log("Combining suggestion list")
    console.log(newSuggestions)
    console.log(suggestions)
    suggestions.value = suggestions.value.concat(newSuggestions);
    console.log("Migrated suggestion list")
    console.log(suggestions)
  };
  
  </script>
  
  <style scoped>
  .load-more-button {
    display: block;
    margin: 20px 0 20px 40px;
    padding: 10px 20px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  </style>
  