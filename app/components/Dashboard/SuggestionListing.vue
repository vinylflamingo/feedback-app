<template>
    <div>
        <LoadingSvg v-if="loading" />
        <SuggestionCard v-else v-for="suggestion in suggestions" :suggestion="suggestion" />
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