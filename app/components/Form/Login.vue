<template>
  <div>
    <SingleLineTextField fieldName="username" labelText="Username" :input-type="usernameType"/>
    <SingleLineTextField fieldName="password" labelText="Password" :input-type="passwordType" />
  </div>
</template>

<script setup lang="ts">
import { FormTextTypes } from '@/constants/enums'
import SingleLineTextField from '@/components/Elements/SingleLineTextField.vue'

const usernameType = FormTextTypes.TEXT;
const passwordType = FormTextTypes.PASSWORD;
</script>