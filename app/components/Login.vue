<template>
  <div>
    <h2>Login</h2>
    <form @submit.prevent="handleSubmit">
      <div>
        <label for="username">Username:</label>
        <input type="text" v-model="username" id="username" required>
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" v-model="password" id="password" required>
      </div>
      <button type="submit">Login</button>
    </form>
    <div v-if="token">
      <h3>Access Token:</h3>
      <p>{{ token }}</p>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useAuth } from '~/composables/useAuth';
import api from '@/services/api';

const { isAuthenticated, login } = useAuth();
const form = reactive({
  username: '',
  password: ''
});

const handleSubmit = async () => {
  try {
    const data = await api.login(form.username, form.password);
    if (data && data.token) {
      login(data.token);
      api.setAuthToken(data.token);
    } else {
      throw new Error('Invalid login response');
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error('Login failed:', error.message);
    } else {
      console.error('Login failed:', error);
    }
  }
};
</script>