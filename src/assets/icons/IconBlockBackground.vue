<template>
  <svg :width="size" :height="size" viewBox="0 0 16 16" fill="none">
    <rect
      x="1.5"
      y="1.5"
      width="13"
      height="13"
      rx="2"
      :fill="color"
      :opacity="color === '#ffffff' ? 0.2 : 0.35"
      stroke="currentColor"
      stroke-width="1.2"
    />
    <rect x="4" y="5" width="8" height="1.4" rx="0.5" fill="currentColor" />
    <rect x="4" y="8" width="6" height="1.4" rx="0.5" fill="currentColor" />
    <rect x="4" y="11" width="7" height="1.4" rx="0.5" fill="currentColor" />
    <rect x="1.5" y="14" width="13" height="1.5" rx="0.5" :fill="color" />
  </svg>
</template>
<script setup>
defineProps({
  size: { type: [Number, String], default: 16 },
  color: { type: String, default: "#ffffff" },
});
</script>
