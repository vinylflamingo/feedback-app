<template>
    <div class="w-[223px] h-[178px] bg-white rounded-xl mt-8">
        <div class="justify-between items-center flex flex-col w-full h-full p-6">
            <div class="flex flex-row justify-between w-full items-center">
                <h3 class="font-bold text-[18px] text-darkBlue">Roadmap</h3>
                <NuxtLink to="/roadmap" class="font-semibold text-[13px] text-blue underline">View</NuxtLink>
            </div>
            <div class="flex flex-col w-full h-[65%;] justify-between">
                <RoadmapStat title="Planned" :count="plannedCount" color="F49F85"/>
                <RoadmapStat title="In Progress" :count="inProgressCount" color="AD1FEA"/>
                <RoadmapStat title="Live" :count="liveCount" color="62BCFA"/>
            </div>
        </div>
    </div>
</template>
  
<script setup lang="ts">
import { SuggestionApi } from '~/constants/enums';
import { SUGGESTION_API_CALLS } from '~/constants/api-calls';
import RoadmapStat from '../Elements/Utility/RoadmapStat.vue';

const { data: counts, error } = await useAsyncData<Record<string, number>>('roadmap-counts', async () => {
    const roadmapCounts = await SUGGESTION_API_CALLS[SuggestionApi.GET_ROADMAP_COUNTS]();
    return {
        'Planned': roadmapCounts['Planned'],
        'In Progress': roadmapCounts['In Progress'],
        'Live': roadmapCounts['Live'],
    };
});

const plannedCount = computed(() => counts?.value?.['Planned'] || 0);
const inProgressCount = computed(() => counts?.value?.['In Progress'] || 0);
const liveCount = computed(() => counts?.value?.['Live'] || 0);

</script>