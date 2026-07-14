<template>
  <Dashboard />
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import Dashboard from './views/Dashboard.vue'

onMounted(() => {
  document.documentElement.classList.add('dashboard-mode')
  document.body.classList.add('dashboard-mode')
})

onBeforeUnmount(() => {
  document.documentElement.classList.remove('dashboard-mode')
  document.body.classList.remove('dashboard-mode')
})
</script>

<style>
html.dashboard-mode,
body.dashboard-mode,
#app {
  width: 100%;
  height: 100vh;
  height: 100dvh;
  min-height: 100vh;
  min-height: 100dvh;
  overflow: hidden;
  overscroll-behavior: none;
}

body.dashboard-mode {
  margin: 0;
}
</style>
