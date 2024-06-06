<template>
  <div>
   <LoadingSvg v-if="loading" />
    <div v-else>
      <SuggestionCard :suggestion="props.suggestion" />
      <CommentsSection :comments="props.suggestion.comments" />
      <div class="w-[327px] h-[234px] bg-white flex flex-col items-center justify-center rounded-xl">
        <div class="flex flex-row justify-start w-full px-7 mb-7">
          <h3 class="font-bold text-[18px] text-darkBlue">Add Comment</h3>
        </div>
        <Base
          :api-call="apiCall" 
          :suggestion-id="props.suggestion.id" 
          @form-submitted="addCommentToProps">
          <MultiLineTextField 
          class="mb-3"
          fieldName="text" 
          labelText="" 
          description=""
          placeholder="Type your comment here"
          width="279px"
          height="80px"
          @update-input="updateInput"
          />
          <div class="flex flex-row justify-between w-full">
            <p>{{ charactersLeft }} Characters left</p>
            <Button 
              :isFormButton=true 
              :text="buttonText" 
              :color=ButtonColor.PURPLE 
              :width=ButtonWidth.SMALLER
            /> 
          </div>
        </Base>
      </div>
    </div>
  </div> 
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Suggestion } from '~/types';
import LoadingSvg from '../Elements/Utility/LoadingSvg.vue';
import SuggestionCard from '../Modules/SuggestionCard.vue';
import CommentsSection from '../Modules/CommentsSection.vue';
import Base from '../Form/Base.vue'
import { COMMENT_API_CALLS, type ApiFunction } from '~/constants/api-calls';
import { CommentApi } from '~/constants/enums';
import MultiLineTextField from '../Elements/Form/MultiLineTextField.vue';
import type { AxiosResponse } from 'axios';
import type { Comment } from '~/types';
import Button from '../Elements/Interactive/Button.vue';
import { ButtonColor, ButtonWidth } from '~/constants/enums';
import { comment } from 'postcss';

const props = defineProps<{ suggestion: Suggestion }>();
const apiCall: ApiFunction = COMMENT_API_CALLS[CommentApi.ADD_COMMENT];
const loading = ref(true);

let buttonText = "Post Comment"

const maxCharacters = 250;
const commentText = ref("");

const updateInput = (text: string) => {
  commentText.value = text;
}

const charactersLeft = computed(() => {
  return maxCharacters - commentText.value.length;
});


const addCommentToProps = (response: AxiosResponse) => {
  console.log("recieved from emit", response)

  const newComment: Comment = response.data
  props.suggestion.comments.push(newComment)
} 

onMounted(() => {
  loading.value = false;
});
</script>
