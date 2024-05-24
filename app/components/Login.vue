<template>
  <div>
    <form @submit.prevent="handleSubmit">
      <div>
        <label for="username">Username:</label>
        <input id="username" v-model="username" type="text" />
      </div>
      <div>
        <label for="password">Password:</label>
        <input id="password" v-model="password" type="password" />
      </div>
      <button type="submit">Login</button>
    </form>
    <p v-if="token">Token: {{ token }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/store/auth';
import api from '@/services/api';

const username = ref('');
const password = ref('');
const token = ref(null);

const authStore = useAuthStore();

const handleSubmit = async () => {
  try {
    const response = await api.login(username.value, password.value);
    token.value = response.data.access_token;
    authStore.setToken(token.value);
  } catch (error) {
    console.error('Login failed', error);
  }
};
</script>