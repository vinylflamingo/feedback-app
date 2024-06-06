<template>
    <div>
      <label :for="props.fieldName">{{ props.labelText }}</label>
      <div v-if="props.description">
        <small>{{ props.description }}</small>
      </div>
      <client-only>
        <textarea 
          :name="props.fieldName" 
          :id="props.fieldName" 
          :placeholder="props.placeholder"
          v-model="input" 
          :class="css"
          @input="updateInput"
          maxlength="250"

        />
      </client-only>
      <div v-if="validationMessage" class="">
        {{ validationMessage }}
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, defineProps, onMounted, defineEmits } from 'vue';
  
  interface MultiLineTextFieldElementProps {
    fieldName: string;
    labelText: string;
    description?: string | null;
    defaultValue?: string | null; 
    placeholder?: string | "";
    width?: string;
    height?: string;
  }

  const emit = defineEmits(['updateInput']);

  
  const props = defineProps<MultiLineTextFieldElementProps>();
  const input = ref('');
  const validationMessage = ref<string>('');
  let css = "rounded-xl bg-veryLightBlue p-4 font-regular text-[13px] ";

  if (props.height) css += `h-[${props.height}] `
  if (props.width) css += `w-[${props.width}] `

  const updateInput = (event: Event) => {
    const target = event.target as HTMLTextAreaElement;
    input.value = target.value;
    emit('updateInput', input.value); // Ensure this line is present
  };



  // Initialize input value on mounted
  onMounted(() => {
    input.value = props.defaultValue || '';
  });
  
  // Function to validate input
  const validateInput = (inputValue: string) => {
  };
  
  watch(input, (newValue) => {
    validateInput(newValue);
  }, { immediate: true });
  
  </script>


<!-- 
h-[80px]
w-[279px]
-->
  