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
          v-model="input" 
        />
      </client-only>
      <div v-if="validationMessage" class="">
        {{ validationMessage }}
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, defineProps, onMounted } from 'vue';
  
  interface SingleLineTextFieldElementProps {
    fieldName: string;
    labelText: string;
    description?: string | null;
    defaultValue?: string | null; 
  }
  
  const props = defineProps<SingleLineTextFieldElementProps>();
  const input = ref('');
  const validationMessage = ref<string>('');
  
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
  