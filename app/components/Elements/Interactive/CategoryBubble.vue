<template>
  <button>
    <span
      :class="[
        'transition p-4 h-[30px] font-semibold text-center text-[13px] flex flex-col justify-center rounded-[10px]',
        props.active ? 'bg-blue text-white' : 'bg-lightBlue text-blue'
      ]"
    >
      {{ props.category }}
    </span>
  </button>
</template>

<script setup lang="ts">
  interface CategoryBubbleProps {
    category: string;
    active?: boolean;
  }
  
  const props = defineProps<CategoryBubbleProps>();

</script>
  