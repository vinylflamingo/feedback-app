<template>
  <form @submit.prevent="handleSubmit(props)" :id="props.formId">
    <slot></slot>
    <button type="submit">Submit</button>
  </form>
</template>

<script setup lang="ts">
console.log("base.vue mounted")
import { type ApiFunction } from '@/constants/constants';
import { defineProps, withDefaults } from 'vue';

interface FormComponentProps {
  apiCall: ApiFunction;
  formId?: string;
}

const props = withDefaults(defineProps<FormComponentProps>(), {
  formId: "base-form"
});

const handleSubmit = async (props: FormComponentProps) => {
  console.log("Form Submitted with props:", props);
  const formData: Record<string, any> = {};

  const formElements = (document.querySelector(`#${props.formId}`) as HTMLFormElement).elements;

  for (const element of Array.from(formElements)) {
    const inputElement = element as HTMLInputElement;
    if (inputElement.name) {
      formData[inputElement.name] = inputElement.value;
    }
  }

  console.log("Collected Form Data before API call:", formData)

  try {
    await props.apiCall(formData);
    console.log("API call successful with data:", formData);
  } catch (error) {
    console.error('API call failed with error:', error);
  }
};
</script>