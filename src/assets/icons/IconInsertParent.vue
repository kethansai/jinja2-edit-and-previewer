<template>
  <svg :width="size" :height="size" viewBox="0 0 16 16" fill="none">
    <!-- Indented child block line -->
    <line
      x1="6"
      y1="13"
      x2="13"
      y2="13"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
    />
    <!-- Parent block line -->
    <line
      x1="3"
      y1="3"
      x2="13"
      y2="3"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
    />
    <!-- Arrow from child up to parent level -->
    <line
      x1="4"
      y1="11"
      x2="4"
      y2="5"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
    />
    <polyline
      points="2,7 4,5 6,7"
      stroke="currentColor"
      stroke-width="1.5"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>

<script setup>
defineProps({
  size: { type: [Number, String], default: 16 },
});
</script>
