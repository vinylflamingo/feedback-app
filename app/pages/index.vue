<template>
    <div v-if="isAuthenticated">
      <h1>Authentication successful.</h1>
    </div>
    <div v-else>
      <Base :apiCall="formType" formId="base-form">
        <Login />
      </Base>
    </div>
</template>

<script setup lang="ts">
import Base from '@/components/Form/Base.vue';
import Login from '@/components/Form/Login.vue';
import { useAuth } from '@/composables/useAuth';
import { AUTH_API_CALLS } from '@/constants/constants';
import { AuthApi } from '@/constants/enums';

const { isAuthenticated } = useAuth();
const formType = AUTH_API_CALLS[AuthApi.LOGIN];
</script>