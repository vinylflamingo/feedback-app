<!-- Suggestion Detail Page -->

<template>
  <div>
    <NuxtLink :to="`/suggestion/${id}/edit`">Edit</NuxtLink>
    <h1>Suggestion Detail</h1>
    <p>The suggestion id is: {{ id }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const id = ref<number | null>(null);

onMounted(() => {
  const param = route.params.id;
  const num = Number(param);

  if (isNaN(num) || num === null || num === undefined) {
    router.push('/404');
  } else {
    id.value = num;
  }
});
</script>