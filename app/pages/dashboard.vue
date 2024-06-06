<template>
    <div class="max-w-full">
      <DashboardMenu @update-sort="handleSortUpdate" @update-category="handleCategoryUpdate"/>
      <SuggestionListing v-if="suggestions.length" :suggestions="suggestions"/>
      <LoadingSvg v-if="loading" class="h-full"/>
      <div v-if="loading === false && suggestions.length < 1" class="flex items-center justify-center">
        <SuggestionsListingEmpty />
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue';
  import { useAsyncData, useNuxtApp } from '#app';
  import { SUGGESTION_API_CALLS } from '~/constants/api-calls';
  import { SuggestionApi } from '@/constants/enums';
  import SuggestionListing from '@/components/Dashboard/SuggestionListing.vue';
  import LoadingSvg from '~/components/Elements/Utility/LoadingSvg.vue';
  import SuggestionsListingEmpty from '~/components/Modules/SuggestionsListingEmpty.vue';
  import type { Suggestion, SuggestionApiParams } from '@/types';
  import type { SortOption } from '@/types';
  
  const suggestions = ref<Suggestion[]>([]);
  const hasMore = ref<boolean>(true);
  const loading = ref<boolean>(false);
  const previousScrollY = ref(0);

  const currentParams = reactive<SuggestionApiParams>({
    limit: 10,
    skip: 0,
    sort: undefined,
    category: undefined,
  })  
  
  const { data, error } = await useAsyncData<Suggestion[]>('dashboard-home', async () => {
    return await SUGGESTION_API_CALLS[SuggestionApi.READ_SUGGESTIONS](currentParams);
  });
  
  if (error.value) {
    console.error('Failed to load suggestions data:', error.value);
  } else {
    suggestions.value = data.value || [];
    hasMore.value = (data.value?.length ?? 0) === currentParams.limit;
  }
  
  const fetchSuggestions = async (currentSkip: number, sortOption?: string, categoryOption?:string ): Promise<Suggestion[]> => {
    loading.value = true;
    // this line is just to test loading animations.
    //let sleepToAnimate: void = await new Promise(r => setTimeout(() => r(), Math.floor(Math.random() * 6000) + 1)); 
    try {
      const limitPlus = currentParams.limit + 1
      const params: SuggestionApiParams = {       
        limit: limitPlus, 
        skip: currentSkip,
        ...(sortOption && { sort: sortOption }),
        ...(categoryOption && { category: categoryOption })
      }
      const response: Suggestion[] = await SUGGESTION_API_CALLS[SuggestionApi.READ_SUGGESTIONS](params);
      let mutated = response;
      if (response.length > currentParams.limit) {
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
    currentParams.skip += 10
    const newSuggestions: Suggestion[] = (await fetchSuggestions(currentParams.skip, currentParams.sort, currentParams.category));
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

  const handleSortUpdate = async (option: SortOption) => {
    console.log("my update emit", option)
    loading.value = true;
    currentParams.skip = 0;
    currentParams.limit = 10;
    currentParams.sort = option.key;
    suggestions.value = [];
    const newSuggestions = await fetchSuggestions(currentParams.skip, currentParams.sort, currentParams.category)
    suggestions.value = suggestions.value.concat(newSuggestions)

  }

  const handleCategoryUpdate = async (category: SortOption) => {

    console.log("my category emit", category, category)
    loading.value = true;
    currentParams.skip = 0;
    currentParams.limit = 10; 

    if (category.value == 'All') {
      currentParams.category = undefined;
    } else {
      currentParams.category = category.value;
    }

    suggestions.value = [];
    console.log("current params:",currentParams)
    const newSuggestions = await fetchSuggestions(currentParams.skip, currentParams.sort, currentParams.category)
    suggestions.value = suggestions.value.concat(newSuggestions)

  }
  

  onMounted(() => {
    window.addEventListener("scroll", onscroll);
  });

  onUnmounted(() => {
    window.removeEventListener("scroll", onscroll);
  });
  
  </script>

  