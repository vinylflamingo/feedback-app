<template>
    <div class="flex flex-col justify-center items-center p-11 drop-shadow-sm rounded-xl bg-veryLightBlue mt-[40vh]">
        <Base :apiCall="formType" formId="login-form" :returnUrl="returnUrl">
            <Login />
            <Button :isFormButton=true  text="Login" :color=ButtonColor.PURPLE :width=ButtonWidth.SMALL /> 
        </Base>
    </div>
</template>

<script setup lang="ts">
import Base from '@/components/Form/Base.vue';
import Login from '@/components/Form/Login.vue';
import { AUTH_API_CALLS } from '~/constants/api-calls';
import { AuthApi } from '@/constants/enums';
import Button from '~/components/Elements/Interactive/Button.vue';
import { ButtonColor, ButtonWidth } from '@/constants/enums';


const formType = AUTH_API_CALLS[AuthApi.LOGIN];
const route = useRoute()
const router = useRouter()
const returnUrl: string = route.query.returnUrl as string || '/dashboard';
</script>