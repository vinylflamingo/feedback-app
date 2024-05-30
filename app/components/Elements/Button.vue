<template>
    <NuxtLink :to="props.to">
        <div :class="styling" @mouseover="onHover" @mouseleave="onLeave">
          {{ props.text }}
        </div>
    </NuxtLink>
</template>
  
  <script setup lang="ts">
  import { ButtonColor, ButtonWidth } from '~/constants/enums';
  import { defineProps, ref } from 'vue';
  
  interface ButtonProps {
    color: ButtonColor;
    width: ButtonWidth;
    text: string;
    to: string;
  }
  
  const props = defineProps<ButtonProps>();
  
  const baseClass = `cursor-pointer h-10 px-2 text-[#F2F4FE] text-[13px] flex items-center justify-center rounded-xl m-2 font-semibold ${props.width}`;
  const initialColorClass = props.color;
  const hoverColorClass = `${props.color}-light`; // Adjust this to your actual hover color class
  
  // Reactive class string that updates on hover
  const styling = ref(`${baseClass} ${initialColorClass}`);
  
  const onHover = () => {
    styling.value = `${baseClass} ${hoverColorClass}`;
  };
  
  const onLeave = () => {
    styling.value = `${baseClass} ${initialColorClass}`;
  };
  
  console.log("buttons props:", props);
  </script>

/* Including dynamic classes for Tailwind JIT */
/* 
  bg-purple
  bg-blue
  bg-red
  bg-darkerBlue
  bg-purple-light
  bg-blue-light
  bg-red-light
  bg-darkerBlue-light
  w-fit
  w-full
  w-[134px]
  w-[279px]
*/

  