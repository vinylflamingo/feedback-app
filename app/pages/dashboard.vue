<template>
    <div class="">
      <DashboardMenu />
      <SuggestionListing v-if="suggestions.length" :suggestions="suggestions" />
      <div v-else class="flex items-center justify-center">
        <SuggestionsListingEmpty />
      </div>
      <LoadingSvg v-if="loading" />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue';
  import { useAsyncData, useNuxtApp } from '#app';
  import { SUGGESTION_API_CALLS } from '~/constants/api-calls';
  import { SuggestionApi } from '@/constants/enums';
  import SuggestionListing from '@/components/Dashboard/SuggestionListing.vue';
  import LoadingSvg from '~/components/Elements/LoadingSvg.vue';
  import SuggestionsListingEmpty from '~/components/Modules/SuggestionsListingEmpty.vue';
  import type { Suggestion } from '@/types';
  
  const suggestions = ref<Suggestion[]>([]);
  const limit: number = 10;
  const skip = ref<number>(0);
  const hasMore = ref<boolean>(true);
  const loading = ref<boolean>(false);
  const previousScrollY = ref(0);
  
  const { data, error } = await useAsyncData<Suggestion[]>('dashboard-home', async () => {
    return await SUGGESTION_API_CALLS[SuggestionApi.READ_SUGGESTIONS]({ limit: limit, skip:0, sort: "latest" });
  });
  
  if (error.value) {
    console.error('Failed to load suggestions data:', error.value);
  } else {
    suggestions.value = data.value || [];
    hasMore.value = (data.value?.length ?? 0) === limit;
  }
  
  const fetchSuggestions = async (currentSkip: number): Promise<Suggestion[]> => {
    loading.value = true;
    // let sleepToAnimate: void = await new Promise(r => setTimeout(() => r(), Math.floor(Math.random() * 1000) + 1));
    try {
      const limitPlus = limit + 1
      const response: Suggestion[] = await SUGGESTION_API_CALLS[SuggestionApi.READ_SUGGESTIONS]({ limit: limitPlus, skip: currentSkip, sort: "latest" });
      let mutated = response;
      if (response.length > limit) {
        hasMore.value = true;
        mutated.pop();
      } else {
        hasMore.value = false;
      }
      loading.value = false;
      return mutated;
    } catch (err) {
      console.error('Failed to load more suggestions data:', err);
      loading.value = false;
      return [];
    }
  };

  const loadMore = async (): Promise<void> => {
    skip.value += 10
    const newSuggestions: Suggestion[] = (await fetchSuggestions(skip.value));
    suggestions.value = suggestions.value.concat(newSuggestions);
  };

  const onscroll = () => {
  const scrolledTo = window.scrollY + window.innerHeight;
  const threshold = 40;
  const isReachBottom = document.body.scrollHeight - threshold <= scrolledTo;
  const isScrollingDown = window.scrollY > previousScrollY.value;

  if (isScrollingDown && isReachBottom) {
    loadMore()
  }

    previousScrollY.value = window.scrollY;
  };
  

  onMounted(() => {
    window.addEventListener("scroll", onscroll);
  });

  onUnmounted(() => {
    window.removeEventListener("scroll", onscroll);
  });
  
  </script>

  