<template>
    <div class="w-[100vw] h-[72px] gradient-bg drop-shadow flex flex-row justify-between px-6 items-center text-white">
        <div>
            <h1 class="font-bold text-[15px]">
                Frontend Mentor
            </h1>
            <h2 class="font-medium opacity-75 text-[13px]">
                Feedback Board
            </h2>
        </div>
        <MobileMenuButton @click="menuState" />
    </div>
    <div v-show="isOverlayVisible" class="overlay"></div>
    <div :class="['fixed flex flex-col justify-start items-center top-[72px] z-50 h-screen right-0 bg-veryLightBlue w-[80%] max-w-[271px] transition-transform duration-500 transform', isOpen ? 'translate-x-0' : 'translate-x-full']">
        <CategoryMenu :categories="categoryList" class="mt-5"/>
        <RoadmapStats />
    </div>  
</template>

<script setup lang="ts">
import { ref } from 'vue';
import MobileMenuButton from '@/components/Elements/MobileMenuButton.vue';
import CategoryMenu from '../Modules/CategoryMenu.vue';
import { Category } from '@/constants/enums';
import RoadmapStats from '../Modules/RoadmapStats.vue';

const isOpen = ref<boolean>(false);
const isOverlayVisible = ref<boolean>(false);
const categoryList: string[] = Object.values(Category);

const menuState = () => {
    if (isOpen.value) {
        setTimeout(() => {
            if (!isOpen.value) return;  // Check if state is still what we expect
            isOpen.value = false;
            document.body.classList.remove('no-scroll');
            setTimeout(() => {
                if (isOpen.value) return;  // Check if state is still what we expect
                isOverlayVisible.value = false;
            }, 500); // Duration should match the transition duration
        }, 0);
    } else {
        isOpen.value = true;
        isOverlayVisible.value = true;
        document.body.classList.add('no-scroll');
    }
};

</script>

<style scoped>
.gradient-bg {
    background-image: url('data:image/svg+xml,%3Csvg width="100%" height="100%" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="375" height="72" fill="url(%23paint0_radial_0_327)"/%3E%3Cdefs%3E%3CradialGradient id="paint0_radial_0_327" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(389.625 -7.47832) rotate(166.849) scale(407.855 184.218)"%3E%3Cstop stop-color="%23E84D70"/%3E%3Cstop offset="0.530886" stop-color="%23A337F6"/%3E%3Cstop offset="1" stop-color="%2328A7ED"/%3E%3C/radialGradient%3E%3C/defs%3E%3C/svg%3E%0A');
    background-repeat: no-repeat;
    background-size: cover;
}

.overlay {
    position: fixed;
    top: 72px;
    left: 0;
    width: 100%;
    height: calc(100% - 72px);
    background-color: rgba(0, 0, 0, 0.5);
    transition: opacity 0.5s;
    z-index: 49;
    filter: blur(50%);
}
</style>
