<template>
    <NuxtLink v-if="resolvedPath" :to="resolvedPath">
        <div class="flex flex-row items-center justify-start">
            <svg width="7" height="10" viewBox="0 0 7 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path id="Path 2" d="M6 9L2 5L6 1" stroke="#4661E6" stroke-width="2"/>
            </svg>
            <p class="text-greyBlue font-bold text-[13px] ml-3">Go Back</p>
        </div>
    </NuxtLink>
    <span v-else class="disabled-link"><- back</span>
</template>
  
<script setup lang="ts">
import { computed, defineProps } from 'vue';
import { useNavigationStore } from '~/stores/useNavigationStore';

const props = defineProps({
    customPath: {
        type: String,
        default: null
    }
});

const navigationStore = useNavigationStore();
const previousPath = computed(() => navigationStore.getPreviousPath());
const resolvedPath = computed(() => props.customPath || previousPath.value);
</script>

<style scoped>
.disabled-link {
    opacity: 0.5;
    cursor: not-allowed;
}
</style>
