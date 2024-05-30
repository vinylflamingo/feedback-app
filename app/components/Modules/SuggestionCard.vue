<template>
    <div class="m-4 w-[327px] h-[200px] py-5 px-6 bg-white flex flex-col rounded-[10px] drop-shadow-sm cursor-pointer"
         @click="goToDetailPage">
        <div class="grid grid-cols-2 grid-rows-4 h-full w-full text-[13px] font-jost">
            <div class="order-1 flex flex-col align-top text-left col-span-2 row-span-4 items-start justify-between mb-3">
                <h3 class="font-bold text-darkerBlue pb-[10px]">{{ suggestion.title }}</h3>
                <p class="leading-relaxed text-greyBlue tracking-tight font-regular">
                    {{ suggestion.detail }}
                </p>
                    <CategoryBubble :category="props.suggestion.category"></CategoryBubble>
            </div>
            <div class="order-2 row-span-2 col-span-1 p-4 bg-lightBlue rounded-[10px] mt-2
                        w-16 h-8 flex justify-start-center items-center flex-row cursor-pointer"
                 @click.stop="toggleUpvote">
                <svg width="9" height="7" viewBox="0 0 9 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 6L4 2L8 6" stroke="#4661E6" stroke-width="2"/>
                </svg>
                <span class="text-[13px] font-bold text-darkerBlue ml-[10px]">{{ suggestion.upvote_count }}</span>
            </div>
            <div class="order-3 row-span-2 col-span-1 w-full height-full flex justify-end flex-row items-end mb-2">
                <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.62074 16H1.34534L2.24718 15.0895C2.73344 14.5986 3.0371 13.9601 3.11873 13.2674C1.03637 11.8878 0 9.88917 0 7.79388C0 3.92832 3.51913 0 9.0305 0C14.8692 0 18 3.61479 18 7.45522C18 11.321 14.8361 14.9333 9.0305 14.9333C8.0135 14.9333 6.95226 14.7963 6.00478 14.5448C5.10787 15.4735 3.89262 16 2.62074 16Z" fill="#CDD2EE"/>
                </svg>
                <div class="text-darkBlue font-bold text-[13px] pl-2 items-end flex flex-col leading-none">
                    {{ suggestion.comments.length }}

                </div>

            </div>
        </div>
    </div> 
</template>

<script setup lang="ts">
import type { Suggestion } from '~/types';
import CategoryBubble from '../Elements/CategoryBubble.vue';

const props = defineProps<{ suggestion: Suggestion }>();

const goToDetailPage = () => {
    navigateTo(`/suggestion/${props.suggestion.id}`);
};

const toggleUpvote = async () => {
    console.log("updoot toggled")
};
</script>
