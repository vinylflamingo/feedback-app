<template>
  <div>
    <h1>Edit Feedback</h1>
    <div v-if="loading">Loading...</div>
    <div v-else>
      <SingleLineTextField 
        fieldName="title" 
        labelText="Feedback Title" 
        description="Add a short, descriptive headline"
        :default-value="feedbackData.title"
        :input-type="titleType"/>
      <DropdownField 
        fieldName="category" 
        labelText="Category" 
        description="Choose a category for your feedback"
        :default-value="feedbackData.category"
        :options="categoryOptions"
      />
      <DropdownField 
        fieldName="status" 
        labelText="Status" 
        description="Update the status for your feedback"
        :default-value="feedbackData.status"
        :options="statusOptions"
      />
      <SingleLineTextField 
        fieldName="detail" 
        labelText="Feedback Detail" 
        description="Include any specific comments on what should be improved, added, etc."
        :default-value="feedbackData.detail"
        :input-type="detailType" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { FormTextTypes, Category, Status } from '@/constants/enums';
import SingleLineTextField from '@/components/Elements/SingleLineTextField.vue';
import DropdownField from '@/components/Elements/DropdownField.vue';  
import { SUGGESTION_API_CALLS } from '@/constants/constants';
import { SuggestionApi } from '@/constants/enums';
import type { Suggestion } from '~/types';
import { useRouter } from 'vue-router'


interface EditSuggestionFormProps {
  feedbackId: number;
}

const router = useRouter();
const props = defineProps<EditSuggestionFormProps>();
const titleType = FormTextTypes.TEXT;
const detailType = FormTextTypes.TEXT;
const categoryOptions = Object.values(Category) as string[];
const statusOptions = Object.values(Status) as string[];

const feedbackData: Suggestion = reactive<Suggestion>({
  title: '',
  detail: '',
  category: '',
  status: '',
  completed: false,
  id: 0,
  owner_id: 0,
  comments: [],
  upvote_count: 0
});

const loading = ref(true);

async function notFound() {

  await router.push("/404");
}

const loadFeedback = async (): Promise<boolean> => {
  let result: boolean = false;
  try {
    const response = await SUGGESTION_API_CALLS[SuggestionApi.GET_SUGGESTION](props.feedbackId); 
    Object.assign(feedbackData, response);
    result = true;
  } catch (error) {
    console.error('Failed to load feedback data:', error);
  } finally {
    loading.value = false;
    return result;
  }
};

onMounted(async () => {
  let success = await loadFeedback();
  console.log("success??", success)
  if (!success) {
    await notFound();
  }
});
</script>
