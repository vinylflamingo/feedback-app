<template>
  <form @submit.prevent="handleSubmit(props)" :id="props.formId">
    <slot></slot>
  </form>
  <p>{{ errorMessage }}</p>
</template>

<script setup lang="ts">
import { type ApiFunction } from '@/constants/api-calls';
import { defineProps, withDefaults } from 'vue';

const emit = defineEmits(['form-submitted']);

interface FormComponentProps {
  apiCall: ApiFunction;
  formId?: string;
  returnUrl?: string,
  suggestionId?: number | null
  buttonText?: string
}

const props = withDefaults(defineProps<FormComponentProps>(), {
  formId: "base-form"
});

function stringIsNullOrEmpty(str: string | undefined): boolean {
  return !str || str.trim() === '';
}

let errorMessage = ref('');

const handleSubmit = async (props: FormComponentProps) => {
  const formData: Record<string, any> = {};
  const formElements = (document.querySelector(`#${props.formId}`) as HTMLFormElement).elements;
  for (const element of Array.from(formElements)) {
    const inputElement = element as HTMLInputElement | HTMLTextAreaElement;
    if (inputElement.name) {
      formData[inputElement.name] = inputElement.value;
    }
  }
  

  try {
    let response;

    if (props.suggestionId !== undefined && props.suggestionId !== null) {
      response = await props.apiCall(props.suggestionId, formData);
      console.log("response", response)
    } else {
      response = await props.apiCall(formData);
    }

    if (response.status === 200) {
      console.log("sending form emit");
      emit("form-submitted", response);
    }


    if (typeof response === 'number' && !isNaN(response)) {
      const path = "/suggestion/" + response;
      await navigateTo(path)
    }

  } catch (error) {
    console.log("Error caught in Base Form")
    if (error instanceof Error) {
      errorMessage.value = error.message;
    } else {
      errorMessage.value = String(error);
    }
  }

  if (!stringIsNullOrEmpty(props.returnUrl)) {
    navigateTo(props.returnUrl); 
  }
};
</script>