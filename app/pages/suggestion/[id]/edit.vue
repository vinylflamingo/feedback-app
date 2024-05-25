<template>
  <div>
    <NuxtLink :to="`/suggestion/${id}`"><- Back</NuxtLink>
    <h1>Edit Page</h1>
    <p>The suggestion id is: {{ id }}</p>
    <Base :apiCall="formType" formId="base-form" :suggestionId="id">
      <EditSuggestions v-if="id !== null && !Number.isNaN(id)" :feedbackId="id"/>
    </Base>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Base from '~/components/Form/Base.vue';
import { SUGGESTION_API_CALLS } from '@/constants/constants';
import { SuggestionApi } from '@/constants/enums';
import EditSuggestions from '~/components/Form/EditSuggestions.vue';

const formType = SUGGESTION_API_CALLS[SuggestionApi.UPDATE_SUGGESTION]; 

const route = useRoute();
const router = useRouter();
const id = ref<number | null>(null);

watch(() => route.params.id, (newId) => {
  const num = Number(newId);
  if (isNaN(num) || num === null || num === undefined) {
    router.push('/404');
  } else {
    id.value = num;
  }
}, { immediate: true });
</script>