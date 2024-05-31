<template>
  <div>
   <LoadingSvg v-if="loading" />
    <div v-else>
      <Backlink />
      <NuxtLink :to="editLink">EDIT</NuxtLink>
      <h1>{{ props.suggestion.title }}</h1>
      <p>category: {{ props.suggestion.category }}</p>
      <p>status: {{ props.suggestion.status }}</p>
      <p>details: {{ props.suggestion.detail }}</p>
      <p>up_votes: {{ props.suggestion.upvote_count }}</p>
      <ul>
        <li v-for="comment in props.suggestion.comments">
          {{ comment.user_id }}
          {{ comment.text }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import type { Suggestion } from '~/types';
import LoadingSvg from '../Elements/Utility/LoadingSvg.vue';
import Backlink from '../Elements/Interactive/Backlink.vue';
import { useRoute } from 'vue-router';


const props = defineProps<{ suggestion: Suggestion }>();
const loading = ref(true);
const editLink = useRoute().path + "/edit"

onMounted(() => {
  loading.value = false;
});
</script>
