<template>
  <div>
    <div v-if="loading">Loading...</div>
    <div v-else>
      <h1>{{ feedbackData.title }}</h1>
      <p>category: {{ feedbackData.category }}</p>
      <p>status: {{ feedbackData.status }}</p>
      <p>details: {{ feedbackData.detail }}</p>
      <p>up_votes: {{ feedbackData.upvote_count }}</p>
      <ul>
        <li v-for="comment in feedbackData.comments">
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

interface EditSuggestionFormProps {
  suggestion: Suggestion;
}

const props = defineProps<EditSuggestionFormProps>();

const feedbackData = reactive<Suggestion>({
  title: props.suggestion.title,
  detail: props.suggestion.detail,
  category: props.suggestion.category,
  status: props.suggestion.status,
  completed: props.suggestion.completed,
  id: props.suggestion.id,
  owner_id: props.suggestion.owner_id,
  comments: props.suggestion.comments,
  upvote_count: props.suggestion.upvote_count,
  archived: props.suggestion.archived
});

const loading = ref(true);

onMounted(() => {
  loading.value = false;
});
</script>
