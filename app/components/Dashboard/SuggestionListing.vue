<template>
    <div class="flex flex-col justify-center items-center">
      <div v-if="loading" class="h-screen w-screen flex items-center justify-center">
        <LoadingSvg />
      </div>
      <div v-else="loading" class="flex flex-col items-center justify-center h-full w-full">
        <SuggestionCard v-for="suggestion in props.suggestions" :suggestion="suggestion" />
      </div>
    </div>

</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import type { Suggestion } from '~/types';
import SuggestionCard from '../Modules/SuggestionCard.vue';
import LoadingSvg from '../Elements/Utility/LoadingSvg.vue';
const props = defineProps<{ suggestions: Suggestion[] }>();
const loading = ref(true);

onMounted(() => {
  loading.value = false;
});
</script>