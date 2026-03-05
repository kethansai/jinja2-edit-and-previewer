<template>
  <svg :width="size" :height="size" viewBox="0 0 16 16" fill="none">
    <rect
      x="2"
      y="2"
      width="12"
      height="10"
      rx="1.5"
      fill="none"
      stroke="currentColor"
      stroke-width="1.2"
    />
    <rect x="2" y="13" width="12" height="2" rx="0.5" :fill="color" />
  </svg>
</template>
<script setup>
defineProps({
  size: { type: [Number, String], default: 16 },
  color: { type: String, default: "#ffff00" },
});
</script>
