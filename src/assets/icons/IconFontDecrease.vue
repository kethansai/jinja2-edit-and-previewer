<template>
  <svg :width="size" :height="size" viewBox="0 0 16 16" fill="none">
    <text
      x="1"
      y="13"
      font-size="12"
      fill="currentColor"
      font-weight="600"
      font-family="Arial"
    >
      A
    </text>
    <text
      x="10"
      y="13"
      font-size="8"
      fill="currentColor"
      font-weight="500"
      font-family="Arial"
    >
      A
    </text>
    <path
      d="M10 3 L14 3"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
    />
  </svg>
</template>
<script setup>
defineProps({ size: { type: [Number, String], default: 15 } });
</script>
