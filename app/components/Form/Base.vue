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
  returnUrl?: string,
  suggestionId?: number | null
}

const props = withDefaults(defineProps<FormComponentProps>(), {
  formId: "base-form"
});

function stringIsNullOrEmpty(str: string | undefined): boolean {
  return !str || str.trim() === '';
}

const handleSubmit = async (props: FormComponentProps) => {
  console.log("Form Submitted with props:", props);
  const formData: Record<string, any> = {};

  const formElements = (document.querySelector(`#${props.formId}`) as HTMLFormElement).elements;

  for (const element of Array.from(formElements)) {
    const inputElement = element as HTMLInputElement | HTMLTextAreaElement;
    if (inputElement.name) {
      formData[inputElement.name] = inputElement.value;
    }
  }

  console.log("Collected Form Data before API call:", formData);

  try {
    let response;

    if (props.suggestionId !== undefined && props.suggestionId !== null) {
      response = await props.apiCall(props.suggestionId, formData);
    } else {
      response = await props.apiCall(formData);
    }

    if (typeof response === 'number' && !isNaN(response)) {
      const path = "/suggestion/" + response;
      await navigateTo(path);
    }

    console.log("API call successful with data:", formData);
  } catch (error) {
    console.error('API call failed with error:', error);
  }

  if (!stringIsNullOrEmpty(props.returnUrl)) {
    console.log("Return URL prop passed. Now redirecting... ", props.returnUrl);
    await navigateTo(props.returnUrl);
  }
};
</script>