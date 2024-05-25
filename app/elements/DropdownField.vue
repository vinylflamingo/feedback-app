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
            <option v-for="item in getOptions">
                {{ item.message }}
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
    options: string,
  }
  
  const props = defineProps<DropdownFieldElementProps>();


  const getOptions = (props) => {
    const options = [];
    switch (props.options) {
        case CATEGORY:
            for (const value of Object.values(Category)) {
                options.push(value)
                console.log(value);
            }
            return options;
    
        case STATUS:
            for (const value of Object.values(Status)) {
                options.push(value)
                console.log(value);
            }
            return options;
    }

  }



  const validationMessage = ref<string>('');
  
  </script>
  