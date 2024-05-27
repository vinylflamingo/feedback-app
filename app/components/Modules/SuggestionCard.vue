<template>
    <div class="m-4 w-[327px] h-[200px] pt-[27px] pb-[24px] bg-white flex flex-col rounded-xl px-7">
        <div class="grid grid-cols-2 grid-rows-4 h-full w-full">
            <div class="order-1 flex flex-col align-top text-left col-span-2 row-span-4 ">
                <h3 class="font-bold font-size-[13px] text-darkerBlue pb-[10px]" >{{ props.suggestion.title }}</h3>
                <p class="leading-relaxed text-greyBlue tracking-tight font-jost font-regular">{{ props.suggestion.detail}}</p>
                <span>{{ props.suggestion.category }}</span>
            </div>
            <div class="order-2 row-span-2 col-span-1 w-full height-full flex justify-start">
                {{ props.suggestion.upvote_count }}
            </div>
            <div class="order-3 row-span-2 col-span-1 w-full height-full flex justify-end">
                {{ props.suggestion.comments.length }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Suggestion } from '~/types';
const props = defineProps<{ suggestion: Suggestion }>();
</script>ß