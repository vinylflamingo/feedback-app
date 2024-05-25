<template>
    <div>
      <label :for="props.fieldName">{{ props.labelText }}</label>
      <div v-if="description">
        <small>{{ props.description }}</small>
      </div>
      <client-only>
        <select
            :name="props.fieldName" 
            :id="props.fieldName" 
        >
            <option v-for="item in options">
                {{ item }}
            </option> 


        </select>
        
      </client-only>
      <div v-if="validationMessage" class="">
        {{ validationMessage }}
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, defineProps, watch } from 'vue';
  import { FormTextTypes, FormDropDownOptions, Category, Status } from '@/constants/enums';
   

  interface DropdownFieldElementProps {
    fieldName: string,
    labelText: string,
    description?: string | null,
    options: string[],
  }
  
  const props = defineProps<DropdownFieldElementProps>();




  const validationMessage = ref<string>('');
  
  </script>
  