<script setup lang="ts">
import PanaromaViewer from './components/PanaromaViewer.vue';

// const panaramaWidth = 900
// const panaramaHeight = 600
</script>

<template>
  <PanaromaViewer></PanaromaViewer>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
