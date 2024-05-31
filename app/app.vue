<template>
  <PerfectScrollbar>
    <NuxtLayout name="main">
      <NuxtPage />
    </NuxtLayout>
  </PerfectScrollbar>
</template>

<script setup lang="ts">
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
</script>

<style>
@import 'vue3-perfect-scrollbar/style.css';

.ps {
  max-height: 100%
}
</style>
