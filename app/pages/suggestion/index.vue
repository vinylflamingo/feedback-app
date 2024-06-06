<template>
    <Base :apiCall="formType" formId="base-form">
        <NewSuggestion />
        <Button :isFormButton=true  text="Add Feedback" :color=ButtonColor.PURPLE :width=ButtonWidth.SMALL /> 
    </Base>
</template>



<script setup lang="ts">
import Base from '~/components/Form/Base.vue';
import { SUGGESTION_API_CALLS } from '~/constants/api-calls';
import { SuggestionApi } from '@/constants/enums';
import NewSuggestion from '~/components/Form/NewSuggestion.vue';
const formType = SUGGESTION_API_CALLS[SuggestionApi.CREATE_SUGGESTION];
import Button from '~/components/Elements/Interactive/Button.vue';
import { ButtonColor, ButtonWidth } from '@/constants/enums';

</script>