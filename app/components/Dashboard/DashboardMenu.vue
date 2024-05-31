<template>
    <div class="w-[100vw] h-[72px] gradient-bg flex flex-row justify-center px-6 items-center text-white">
        <div class="max-w-3xl flex flex-row justify-between items-center w-full">
            <div>
                <h1 class="font-bold text-[15px]">
                    Frontend Mentor
                </h1>
                <h2 class="font-medium opacity-75 text-[13px]">
                    Feedback Board
                </h2>
            </div>
            <MobileMenuButton @update-open-state="menuState" :openState="isOpenMobileMenu"  />
        </div>
    </div>
    <div class="w-[100vw] h-14 bg-darkBlue justify-center px-6 items-center flex flex-row text-white ">
        <div class="max-w-3xl flex flex-row items-center justify-between w-full h-full">
            <div class="flex-row flex items-center gap-1">
                <span class="text-[13px] font-regular text-lightBlue">Sort By : </span>
                <button class="font-bold text-lightBlue text-[13px] flex flex-row items-center" @click="sortMenuState"> 
                    {{ currentSort }}
                    <svg class="ml-2 mt-[5px]" width="9" height="7" viewBox="0 0 9 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path id="Path 2" d="M1 1L5 5L9 1" stroke="white" stroke-width="2"/>
                    </svg>
                </button>
                <div v-if="isOpenSortOptions" class="w-64 h-48 bg-white rounded-xl flex flex-col items-center justify-between z-20 drop-shadow-2xl absolute top-36">
                    <div v-for="option, index in sortOptions" :key="`sort-key-${option.key}-${index}`" @click="updateSort(option)"
                        :class="['flex flex-col py-2 px-6 w-full h-full border-b-2 border-darkerBlue border-opacity-15', 
                        index === sortOptions.length - 1 ? 'no-border-bottom' : '']">                        
                        <span class="h-full flex flex-row justify-between items-center font-regular text-[16px] text-greyBlue">
                            <p class="cursor-pointer hover:text-purple">
                                {{ option.value }}
                            </p>
                            <div v-if="currentSort === option.value">
                                <svg width="13" height="10" viewBox="0 0 13 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0.968262 4.85894L4.49995 8.39062L11.9999 0.890625" stroke="#AD1FEA" stroke-width="2"/>
                                </svg>
                            </div>
                        </span>
                    </div>
                </div>
            </div>     
            <div>
                <Button :color="buttonColor" :width="buttonWidth" text="+ Add Feedback" to="/suggestion"/>
            </div>
        </div>  
    </div>
    <div v-show="isOverlayVisible" class="overlay"></div>
    <div :class="['fixed flex flex-col justify-start items-center top-[72px] z-50 h-screen right-0 bg-veryLightBlue w-[80%] max-w-[271px] transition-transform duration-100 transform', isOverlayVisible ? 'translate-x-0' : 'translate-x-full']">
        <CategoryMenu :categories="categoryList" class="mt-5" @update-category="updateCategory"/>
        <RoadmapStats />
    </div>  
</template>

<script setup lang="ts">
import { ref, defineEmits} from 'vue';
import MobileMenuButton from '~/components/Elements/Utility/MobileMenuButton.vue';
import CategoryMenu from '../Modules/CategoryMenu.vue';
import { Category, ButtonColor, ButtonWidth, } from '@/constants/enums';
import RoadmapStats from '../Modules/RoadmapStats.vue';
import { SortOptions } from '@/constants/enums';
import Button from '../Elements/Interactive/Button.vue';
import { type SortOption } from '~/types';

const isOpenMobileMenu = ref<boolean>(false);
const isOpenSortOptions = ref<boolean>(false);
const isOverlayVisible = ref<boolean>(false);
const categoryList: string[] = Object.values(Category);
const currentSort = ref<string>("Newest")
const buttonColor = ButtonColor.PURPLE;
const buttonWidth = ButtonWidth.SMALL;

const emit = defineEmits(['update-sort', 'update-category']);

const sortOptions = computed((): SortOption[] => {
    const data = Object.values(SortOptions) as string[];
    const options = data.map((item) => {
        const [key, value] = item.split('|');
        return { key, value } as SortOption;
      });
      return options;
});

const menuState = () => {
    if (isOpenMobileMenu.value) {
        setTimeout(() => {
            if (!isOpenMobileMenu.value) return;  // Check if state is still what we expect
            
            isOpenMobileMenu.value = false;
            document.body.classList.remove('no-scroll');
            setTimeout(() => {
                if (isOpenMobileMenu.value) return;  // Check if state is still what we expect
                isOverlayVisible.value = false;
            }, 100); // Duration should match the transition duration
        }, 0);
    } else {
        isOpenMobileMenu.value = true;
        isOverlayVisible.value = true;
        document.body.classList.add('no-scroll');
    }
};


const sortMenuState = () => {
    if (isOpenSortOptions.value) {
        isOpenSortOptions.value = false;
        //close menu
    } else {
        isOpenSortOptions.value = true;
    }
}

const updateSort = (option: SortOption) => {
    if (currentSort.value != option.value) {
        currentSort.value = option.value
        emit('update-sort', option);
        sortMenuState();
    }   
}

const updateCategory = (category: SortOption) => {
    console.log("emitting up to dashboard.vue")
    emit('update-category', category);
    menuState();
}

</script>

<style scoped>
.gradient-bg {
    background-image: url('/img/header-bg.svg');
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

.no-border-bottom:last-child {
    border-bottom: none;
}
</style>
