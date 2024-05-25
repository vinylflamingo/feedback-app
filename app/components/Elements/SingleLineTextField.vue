<template>
  <div>
    <label :for="props.fieldName">{{ props.labelText }}</label>
    <div v-if="props.description">
      <small>{{ props.description }}</small>
    </div>
    <client-only>
      <input 
        :name="props.fieldName" 
        :id="props.fieldName" 
        :type="props.inputType" 
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
import { FormTextTypes } from '@/constants/enums';

interface SingleLineTextFieldElementProps {
  fieldName: string;
  labelText: string;
  inputType: string;
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
  if (props.inputType === FormTextTypes.PASSWORD) {
    if (inputValue.length > 0 && inputValue.length < 5) {
      validationMessage.value = 'Password must be at least 5 characters long.';
    } else {
      validationMessage.value = '';
    }
  }
};

watch(input, (newValue) => {
  validateInput(newValue);
}, { immediate: true });
</script>
