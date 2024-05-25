<template>
    <div v-if="isAuthenticated">
      <h1>Authentication successful.</h1>
    </div>
    <div>Dashboard component will be here</div>
</template>

<script setup lang="ts">

const { isAuthenticated } = useAuth();
</script>