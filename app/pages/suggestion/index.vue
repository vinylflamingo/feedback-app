<template>
    <Base :apiCall="formType" formId="base-form">
        <NewSuggestion />
    </Base>
</template>



<script setup lang="ts">
console.log("new suggestion route called.")
import Base from '~/components/Form/Base.vue';
import { SUGGESTION_API_CALLS } from '~/constants/api-calls';
import { SuggestionApi } from '@/constants/enums';
import NewSuggestion from '~/components/Form/NewSuggestion.vue';
const formType = SUGGESTION_API_CALLS[SuggestionApi.CREATE_SUGGESTION_V2];

</script>