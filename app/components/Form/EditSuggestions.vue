<template>
  <div>
    <h1>Edit Feedback</h1>
    <LoadingSvg v-if="loading" />
    <div v-else>
      <SingleLineTextField 
        fieldName="title" 
        labelText="Feedback Title" 
        description="Add a short, descriptive headline"
        :default-value="props.suggestion.title"
        :input-type="titleType"/>
      <DropdownField 
        fieldName="category" 
        labelText="Category" 
        description="Choose a category for your feedback"
        :default-value="props.suggestion.category"
        :options="categoryOptions"
      />
      <DropdownField 
        fieldName="status" 
        labelText="Status" 
        description="Update the status for your feedback"
        :default-value="props.suggestion.status"
        :options="statusOptions"
      />
      <MultiLineTextField 
        fieldName="detail" 
        labelText="Feedback Detail" 
        description="Include any specific comments on what should be improved, added, etc."
        :default-value="props.suggestion.detail"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import LoadingSvg from '../Elements/LoadingSvg.vue';
import { ref, reactive, onMounted } from 'vue';
import { FormTextTypes, Category, Status } from '@/constants/enums';
import SingleLineTextField from '@/components/Elements/SingleLineTextField.vue';
import DropdownField from '@/components/Elements/DropdownField.vue';  
import type { Suggestion } from '~/types';
import MultiLineTextField from '../Elements/MultiLineTextField.vue';

interface EditSuggestionFormProps {
  suggestion: Suggestion;
}

const props = defineProps<EditSuggestionFormProps>();
const titleType = FormTextTypes.TEXT;
const categoryOptions = Object.values(Category) as string[];
const statusOptions = Object.values(Status) as string[];
const loading = ref(true);

onMounted(() => {
  loading.value = false;
});
</script>
