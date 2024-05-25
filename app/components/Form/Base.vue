<template>
  <form @submit.prevent="handleSubmit(props)" :id="props.formId">
    <slot></slot>
    <button type="submit">Submit</button>
  </form>
</template>

<script setup lang="ts">
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
  console.log("props", props);

  console.log("handleSubmit Called.")
  const formData: Record<string, any> = {};

  console.log("empty form data = ", formData)
  const formElements = (document.querySelector(`#${props.formId}`) as HTMLFormElement).elements;
  console.log("Form Elements", formElements)

  for (const element of Array.from(formElements)) {
    const inputElement = element as HTMLInputElement;
    if (inputElement.name) {
      formData[inputElement.name] = inputElement.value;
    }
  }

  console.log("Form Data", formData)

  try {
    await props.apiCall(formData);
  } catch (error) {
    console.error('API call failed:', error);
  }
};
</script>