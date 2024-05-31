<template>
    <div class="flex flex-row justify-between">
        <div class="flex flex-row justify-center items-center">
            <span>
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="4" cy="4" r="4" :fill="`#${props.color}`"/>
                </svg>
            </span>
            <span class="ml-4 font-regular text-[16px] text-greyBlue" >{{ props.title }}</span>
        </div>
        <div class="text-greyBlue font-bold text-[16px]">
            {{ props.count }}
        </div>
    </div>
</template>

<script setup lang="ts">

interface RoadmapStat {
    title: string;
    count: number;
    color: string;
}

const props = defineProps<RoadmapStat>();

</script>