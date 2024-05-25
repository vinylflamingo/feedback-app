<template>
  <div>
    <TextField fieldName="username" labelText="Username" :input-type="usernameType"/>
    <TextField fieldName="password" labelText="Password" :input-type="passwordType" />
  </div>
</template>

<script setup lang="ts">
import { FormTextTypes } from '@/constants/enums'
import TextField from '@/elements/SingleLineTextField.vue';

const usernameType = FormTextTypes.TEXT;
const passwordType = FormTextTypes.PASSWORD;
</script>