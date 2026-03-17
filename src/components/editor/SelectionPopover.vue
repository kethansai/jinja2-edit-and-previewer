<template>
  <div
    v-if="popover.visible"
    class="ve-sel-popover"
    :class="{ dark }"
    :style="{ top: popover.top + 'px', left: popover.left + 'px' }"
    @mousedown.prevent
  >
    <button
      class="ve-sp-btn"
      :class="{ active: activeFormats.bold }"
      title="Bold"
      @click="$emit('cmd', 'bold')"
    >
      <IconBold :size="15" />
    </button>
    <button
      class="ve-sp-btn"
      :class="{ active: activeFormats.italic }"
      title="Italic"
      @click="$emit('cmd', 'italic')"
    >
      <IconItalic :size="15" />
    </button>
    <button
      class="ve-sp-btn"
      :class="{ active: activeFormats.underline }"
      title="Underline"
      @click="$emit('cmd', 'underline')"
    >
      <IconUnderline :size="15" />
    </button>
    <button
      class="ve-sp-btn"
      :class="{ active: activeFormats.strikeThrough }"
      title="Strikethrough"
      @click="$emit('cmd', 'strikeThrough')"
    >
      <IconStrikethrough :size="15" />
    </button>

    <span class="ve-sp-divider"></span>

    <button class="ve-sp-btn" title="Link" @click="$emit('insert-link')">
      <IconLink :size="15" :stroke-width="1.4" />
    </button>

    <span class="ve-sp-divider"></span>

    <button
      class="ve-sp-btn"
      title="Decrease font size"
      @click="$emit('font-size-down')"
    >
      <IconFontDecrease :size="15" />
    </button>
    <span class="ve-sp-size-label">{{ currentFontSize || "—" }}</span>
    <button
      class="ve-sp-btn"
      title="Increase font size"
      @click="$emit('font-size-up')"
    >
      <IconFontIncrease :size="15" />
    </button>

    <span class="ve-sp-divider"></span>

    <span class="ve-sp-divider"></span>

    <ColorPicker
      :model-value="fgColor"
      title="Text color"
      :dark="dark"
      panel-position="above"
      @update:model-value="$emit('text-color', $event)"
    >
      <IconTextColor :size="15" :color="fgColor" />
    </ColorPicker>
    <button class="ve-sp-btn" title="Highlight" @click="$emit('highlight')">
      <IconHighlightMarker :size="15" />
    </button>
    <button
      class="ve-sp-btn"
      title="Clear formatting"
      @click="$emit('cmd', 'removeFormat')"
    >
      <IconClearFormat :size="15" />
    </button>
  </div>
</template>

<script setup>
import {
  IconBold,
  IconItalic,
  IconUnderline,
  IconStrikethrough,
  IconLink,
  IconFontDecrease,
  IconFontIncrease,
  IconHighlightMarker,
  IconClearFormat,
  IconTextColor,
} from "../../assets/icons";
import ColorPicker from "./ColorPicker.vue";

defineProps({
  popover: { type: Object, required: true },
  activeFormats: { type: Object, required: true },
  currentFontSize: { type: String, default: "" },
  fgColor: { type: String, default: "#000000" },
  dark: { type: Boolean, default: false },
});

defineEmits([
  "cmd",
  "insert-link",
  "font-size-up",
  "font-size-down",
  "highlight",
  "text-color",
]);
</script>
