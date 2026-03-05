<template>
  <svg :width="size" :height="size" viewBox="0 0 16 16" fill="none">
    <path
      d="M5.5 12L7 8h2l1.5 4"
      stroke="currentColor"
      stroke-width="1.5"
      fill="none"
      stroke-linecap="round"
    />
    <line
      x1="6"
      y1="10.5"
      x2="10"
      y2="10.5"
      stroke="currentColor"
      stroke-width="1.2"
    />
    <rect x="2" y="13" width="12" height="2" rx="0.5" :fill="color" />
  </svg>
</template>
<script setup>
defineProps({
  size: { type: [Number, String], default: 16 },
  color: { type: String, default: "#000000" },
});
</script>
