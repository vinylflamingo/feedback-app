<template>
    <div>
      <div v-if="loading" class="h-screen w-screen flex items-center justify-center">
        <LoadingSvg />
      </div>
        <SuggestionCard v-else v-for="suggestion in props.suggestions" :suggestion="suggestion" />
    </div>

</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import type { Suggestion } from '~/types';
import SuggestionCard from '../Modules/SuggestionCard.vue';
import LoadingSvg from '../Elements/LoadingSvg.vue';
const props = defineProps<{ suggestions: Suggestion[] }>();
const loading = ref(true);

onMounted(() => {
  loading.value = false;
});



</script>