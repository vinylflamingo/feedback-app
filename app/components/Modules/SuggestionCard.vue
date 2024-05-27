<template>
    <div class="m-4 w-[327px] h-[200px] py-5 px-6 bg-white flex flex-col rounded-[10px] drop-shadow-sm"
         @click="goToDetailPage">
        <div class="grid grid-cols-2 grid-rows-4 h-full w-full text-[13px] font-jost">
            <div class="order-1 flex flex-col align-top text-left col-span-2 row-span-4 items-start">
                <h3 class="font-bold text-darkerBlue pb-[10px]">{{ suggestion.title }}</h3>
                <p class="leading-relaxed text-greyBlue tracking-tight font-regular">
                    {{ suggestion.detail }}
                </p>
                <span class="text-blue mt-2 p-4 bg-lightBlue w-[111px] h-[30px] font-semibold
                            text-center flex flex-col justify-center rounded-[10px]">
                    {{ suggestion.category }}
                </span>
            </div>
            <div class="order-2 row-span-2 col-span-1 p-4 bg-lightBlue rounded-[10px] mt-2
                        w-16 h-8 flex justify-start-center items-center flex-row cursor-pointer"
                 @click.stop="toggleUpvote">
                <svg width="9" height="7" viewBox="0 0 9 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 6L4 2L8 6" stroke="#4661E6" stroke-width="2"/>
                </svg>
                <span class="text-[13px] font-bold text-darkerBlue ml-[10px]">{{ suggestion.upvote_count }}</span>
            </div>
            <div class="order-3 row-span-2 col-span-1 w-full height-full flex justify-end">
                {{ suggestion.comments.length }}
            </div>
        </div>
    </div> 
</template>

<script setup lang="ts">
import type { Suggestion } from '~/types';
import { useRouter } from 'vue-router';

const props = defineProps<{ suggestion: Suggestion }>();
const router = useRouter();

const goToDetailPage = () => {
    navigateTo(`/suggestion/${props.suggestion.id}`);
};

const toggleUpvote = async () => {
    // Assuming you have a function to toggle upvote
    console.log("updoot toggled")
    // Optionally update UI state here if not using Vuex/Pinia
};
</script>
