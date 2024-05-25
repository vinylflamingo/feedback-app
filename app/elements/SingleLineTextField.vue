<template>
  <div>
    <label :for="props.fieldName">{{ props.labelText }}</label>
    <div v-if="description">
      <small>{{ props.description }}</small>
    </div>
    <client-only>
      <input 
        :name="props.fieldName" 
        :id="props.fieldName" 
        :type="props.inputType" 
        :value="input" 
        @input="updateInput"
      />
    </client-only>
    <div v-if="validationMessage" class="">
      {{ validationMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, watch } from 'vue';
import { FormTextTypes } from '@/constants/enums';

interface TextFieldElementProps {
  fieldName: string;
  labelText: string;
  inputType: string;
  description?: string | null;
}

const props = defineProps<TextFieldElementProps>();
const input = ref('');
const validationMessage = ref<string>('');


const updateInput = (event: Event) => {
  input.value = (event.target as HTMLInputElement).value;
  validateInput(props.inputType);

};

const validateInput = (inputType: string) => {
  if (inputType === FormTextTypes.PASSWORD)
  {
    if (input.value.length > 0 && input.value.length < 4 ) {
      validationMessage.value = 'Password must be at least 5 characters long.';
    } else {
      validationMessage.value = '';
    }
  }



};

watch(input, validateInput);
</script>
