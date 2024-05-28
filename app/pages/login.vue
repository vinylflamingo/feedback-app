<template>
    <div>
        <Base :apiCall="formType" formId="login-form" :returnUrl="returnUrl">
            <Login />
        </Base>
    </div>
</template>

<script setup lang="ts">
import Base from '@/components/Form/Base.vue';
import Login from '@/components/Form/Login.vue';
import { AUTH_API_CALLS } from '~/constants/api-calls';
import { AuthApi } from '@/constants/enums';
const formType = AUTH_API_CALLS[AuthApi.LOGIN];
const route = useRoute()
const router = useRouter()
const returnUrl: string = route.query.returnUrl as string || '/';
console.log("Return Url: ", returnUrl)
</script>