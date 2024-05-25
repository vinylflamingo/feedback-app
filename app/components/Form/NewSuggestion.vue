<template>
    <h1>Create New Feedback</h1>
    <div>
      <TextField fieldName="title" labelText="Feedback Title" :input-type="titleType"/>

      <TextField fieldName="detail" labelText="Feedback Detail" :input-type="detailType" />
    </div>
  </template>
  
  <script setup lang="ts">
  import { FormTextTypes } from '@/constants/enums'
  import TextField from '@/elements/SingleLineTextField.vue';
  import Dropdown field from '@/elements/SingleLineTextField.vue';
  
  const titleType = FormTextTypes.TEXT;
  const detailType = FormTextTypes.TEXT;
  </script>