<template>
  <svg :width="size" :height="size" viewBox="0 0 16 16" fill="none">
    <circle cx="6" cy="4" r="1.2" fill="currentColor" />
    <circle cx="10" cy="4" r="1.2" fill="currentColor" />
    <circle cx="6" cy="8" r="1.2" fill="currentColor" />
    <circle cx="10" cy="8" r="1.2" fill="currentColor" />
    <circle cx="6" cy="12" r="1.2" fill="currentColor" />
    <circle cx="10" cy="12" r="1.2" fill="currentColor" />
  </svg>
</template>
<script setup>
defineProps({ size: { type: [Number, String], default: 14 } });
</script>
