<template>
    <h1>Create New Feedback</h1>
    <div>
      <SingleLineTextField 
        fieldName="title" 
        labelText="Feedback Title" 
        description="Add a short, descriptive headline"
        :input-type="titleType"/>
      <DropdownField 
        fieldName="category" 
        labelText="Category" 
        description="Choose a category for your feedback"
        :options="categoryOptions"
      />
      <MultiLineTextField 
        fieldName="detail" 
        labelText="Feedback Detail" 
        description="Include any specific comments on what should be improved, added, etc."
      />
    </div>
  </template>
  
  <script setup lang="ts">
  import { FormTextTypes, Category } from '@/constants/enums'
  import SingleLineTextField from '@/components/Elements/SingleLineTextField.vue'
  import DropdownField from '@/components/Elements/DropdownField.vue';  
  import MultiLineTextField from '../Elements/MultiLineTextField.vue';
  const titleType = FormTextTypes.TEXT;
  const categoryOptions = Object.values(Category) as string[];
  </script>