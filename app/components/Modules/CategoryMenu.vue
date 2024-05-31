<template>
  <div class="w-[223px] h-[178px] bg-white rounded-xl">
    <div class="justify-center items-center flex w-full h-full p-6">
      <div class="flex flex-row flex-wrap justify-start items-center align-middle object-center gap-2">
        <CategoryBubble
          v-for="category in options"
          :key="category"
          :category="category"
          :active="category === activeCategory"
          @click="setActiveCategory(category)"
          class="max-w-fit cursor-pointer sh"
        />
      </div>
    </div>
  </div> 
</template>

<script setup lang="ts">
import { ref } from 'vue';
import CategoryBubble from '../Elements/Interactive/CategoryBubble.vue';

interface CategoryMenuProps {
  categories: string[];
}

const emit = defineEmits(['update-category']);
const props = defineProps<CategoryMenuProps>();

const options = ref<string[]>(props.categories);
options.value.unshift("All");

const activeCategory = ref<string | null>(options.value[0]);

const setActiveCategory = (category: string) => {
  if (activeCategory.value !== category) {  // Ensure category is actually changing
    activeCategory.value = category;
    emit('update-category', { key: category, value: category });
  }
};
</script>
