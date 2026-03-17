<template>
  <div class="ve-toolbar">
    <!-- Text formatting group -->
    <div class="ve-toolbar-group">
      <button
        v-for="btn in textFormatBtns"
        :key="btn.cmd"
        class="ve-btn"
        :class="{ active: activeFormats[btn.cmd] }"
        :title="btn.title"
        @mousedown.prevent
        @click="$emit('exec-cmd', btn.cmd)"
      >
        <span class="ve-btn-icon"><component :is="btn.icon" :size="16" /></span>
      </button>
    </div>

    <div class="ve-toolbar-divider"></div>

    <!-- Font family -->
    <div class="ve-toolbar-group">
      <select
        class="ve-select"
        :value="currentFontFamily"
        @change="$emit('font-family', $event.target.value)"
        title="Font family"
      >
        <option value="">Font</option>
        <option
          value="Arial, sans-serif"
          style="font-family: Arial, sans-serif"
        >
          Arial
        </option>
        <option
          value="Helvetica, sans-serif"
          style="font-family: Helvetica, sans-serif"
        >
          Helvetica
        </option>
        <option
          value="'Times New Roman', serif"
          style="font-family: &quot;Times New Roman&quot;, serif"
        >
          Times New Roman
        </option>
        <option value="Georgia, serif" style="font-family: Georgia, serif">
          Georgia
        </option>
        <option
          value="Verdana, sans-serif"
          style="font-family: Verdana, sans-serif"
        >
          Verdana
        </option>
        <option
          value="Tahoma, sans-serif"
          style="font-family: Tahoma, sans-serif"
        >
          Tahoma
        </option>
        <option
          value="'Trebuchet MS', sans-serif"
          style="font-family: &quot;Trebuchet MS&quot;, sans-serif"
        >
          Trebuchet MS
        </option>
        <option
          value="'Courier New', monospace"
          style="font-family: &quot;Courier New&quot;, monospace"
        >
          Courier New
        </option>
        <option
          value="'Lucida Console', monospace"
          style="font-family: &quot;Lucida Console&quot;, monospace"
        >
          Lucida Console
        </option>
        <option
          value="Impact, sans-serif"
          style="font-family: Impact, sans-serif"
        >
          Impact
        </option>
        <option
          value="'Comic Sans MS', cursive"
          style="font-family: &quot;Comic Sans MS&quot;, cursive"
        >
          Comic Sans MS
        </option>
        <option
          value="'Segoe UI', sans-serif"
          style="font-family: &quot;Segoe UI&quot;, sans-serif"
        >
          Segoe UI
        </option>
        <option
          value="Roboto, sans-serif"
          style="font-family: Roboto, sans-serif"
        >
          Roboto
        </option>
        <option
          value="'Open Sans', sans-serif"
          style="font-family: &quot;Open Sans&quot;, sans-serif"
        >
          Open Sans
        </option>
      </select>
    </div>

    <div class="ve-toolbar-divider"></div>

    <!-- Font size -->
    <div class="ve-toolbar-group">
      <select
        class="ve-select ve-select-sm"
        :value="currentFontSize"
        @change="$emit('font-size', $event.target.value)"
        title="Font size"
      >
        <option value="">Size</option>
        <option v-for="s in fontSizes" :key="s" :value="s">{{ s }}</option>
      </select>
    </div>

    <div class="ve-toolbar-divider"></div>

    <!-- Colors -->
    <div class="ve-toolbar-group">
      <ColorPicker
        :model-value="fgColor"
        title="Text color"
        :dark="dark"
        panel-position="below"
        @update:model-value="$emit('fg-color', $event)"
      >
        <span class="ve-btn-icon">
          <IconTextColor :size="16" :color="fgColor" />
        </span>
      </ColorPicker>

      <button
        class="ve-btn"
        title="Highlight"
        @mousedown.prevent
        @click="$emit('bg-color', '#ffe066')"
      >
        <span class="ve-btn-icon">
          <IconHighlight :size="16" color="#ffe066" />
        </span>
      </button>

      <ColorPicker
        :model-value="blockBgColor"
        title="Block background color"
        :dark="dark"
        panel-position="below"
        @update:model-value="$emit('block-bg-color', $event)"
      >
        <span class="ve-btn-icon">
          <IconBlockBackground :size="16" :color="blockBgColor" />
        </span>
      </ColorPicker>

      <button
        class="ve-btn"
        :class="{ active: spacingActive }"
        title="Block padding & margin"
        @mousedown.prevent
        @click="$emit('toggle-spacing')"
      >
        <span class="ve-btn-icon">
          <IconBlockSpacing :size="16" />
        </span>
      </button>
    </div>

    <div class="ve-toolbar-divider"></div>

    <!-- Alignment -->
    <div class="ve-toolbar-group">
      <button
        v-for="btn in alignBtns"
        :key="btn.cmd"
        class="ve-btn"
        :title="btn.title"
        @mousedown.prevent
        @click="$emit('exec-cmd', btn.cmd)"
      >
        <span class="ve-btn-icon"><component :is="btn.icon" :size="16" /></span>
      </button>
    </div>

    <div class="ve-toolbar-divider"></div>

    <!-- Lists -->
    <div class="ve-toolbar-group">
      <button
        class="ve-btn"
        title="Bullet list"
        @mousedown.prevent
        @click="$emit('exec-cmd', 'insertUnorderedList')"
      >
        <span class="ve-btn-icon"><IconBulletList :size="16" /></span>
      </button>
      <button
        class="ve-btn"
        title="Numbered list"
        @mousedown.prevent
        @click="$emit('exec-cmd', 'insertOrderedList')"
      >
        <span class="ve-btn-icon"><IconNumberedList :size="16" /></span>
      </button>
    </div>

    <div class="ve-toolbar-divider"></div>

    <!-- Insert -->
    <div class="ve-toolbar-group">
      <button
        class="ve-btn"
        title="Insert link"
        @mousedown.prevent
        @click="$emit('insert-link')"
      >
        <span class="ve-btn-icon"><IconLink :size="16" /></span>
      </button>
      <button
        class="ve-btn"
        title="Insert image"
        @mousedown.prevent
        @click="$emit('insert-image')"
      >
        <span class="ve-btn-icon"><IconImage :size="16" /></span>
      </button>
      <button
        class="ve-btn"
        title="Insert horizontal rule"
        @mousedown.prevent
        @click="$emit('insert-hr')"
      >
        <span class="ve-btn-icon"><IconHorizontalRule :size="16" /></span>
      </button>
      <button
        class="ve-btn"
        title="Insert table"
        @mousedown.prevent
        @click="$emit('insert-table')"
      >
        <span class="ve-btn-icon"><IconTable :size="16" /></span>
      </button>
    </div>

    <div class="ve-toolbar-divider"></div>

    <!-- Undo / Redo / Clear -->
    <div class="ve-toolbar-group">
      <button
        class="ve-btn"
        title="Undo (Ctrl+Z)"
        @mousedown.prevent
        @click="$emit('exec-cmd', 'undo')"
      >
        <span class="ve-btn-icon"><IconUndo :size="16" /></span>
      </button>
      <button
        class="ve-btn"
        title="Redo (Ctrl+Y)"
        @mousedown.prevent
        @click="$emit('exec-cmd', 'redo')"
      >
        <span class="ve-btn-icon"><IconRedo :size="16" /></span>
      </button>
      <button
        class="ve-btn"
        title="Clear formatting"
        @mousedown.prevent
        @click="$emit('exec-cmd', 'removeFormat')"
      >
        <span class="ve-btn-icon"><IconClearFormat :size="16" /></span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { markRaw } from "vue";
import ColorPicker from "./ColorPicker.vue";
import {
  IconBold,
  IconItalic,
  IconUnderline,
  IconStrikethrough,
  IconAlignLeft,
  IconAlignCenter,
  IconAlignRight,
  IconTextColor,
  IconHighlight,
  IconBlockBackground,
  IconBlockSpacing,
  IconBulletList,
  IconNumberedList,
  IconLink,
  IconImage,
  IconHorizontalRule,
  IconTable,
  IconUndo,
  IconRedo,
  IconClearFormat,
} from "../../assets/icons";

defineProps({
  activeFormats: { type: Object, required: true },
  currentFontSize: { type: String, default: "" },
  currentFontFamily: { type: String, default: "" },
  fgColor: { type: String, default: "#000000" },
  blockBgColor: { type: String, default: "#ffffff" },
  spacingActive: { type: Boolean, default: false },
  dark: { type: Boolean, default: false },
});

defineEmits([
  "exec-cmd",
  "block-format",
  "font-family",
  "font-size",
  "fg-color",
  "bg-color",
  "block-bg-color",
  "toggle-spacing",
  "insert-link",
  "insert-image",
  "insert-hr",
  "insert-table",
]);

const fontSizes = [
  8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72,
];

const textFormatBtns = [
  { cmd: "bold", title: "Bold (Ctrl+B)", icon: markRaw(IconBold) },
  { cmd: "italic", title: "Italic (Ctrl+I)", icon: markRaw(IconItalic) },
  {
    cmd: "underline",
    title: "Underline (Ctrl+U)",
    icon: markRaw(IconUnderline),
  },
  {
    cmd: "strikeThrough",
    title: "Strikethrough",
    icon: markRaw(IconStrikethrough),
  },
];

const alignBtns = [
  { cmd: "justifyLeft", title: "Align left", icon: markRaw(IconAlignLeft) },
  {
    cmd: "justifyCenter",
    title: "Align center",
    icon: markRaw(IconAlignCenter),
  },
  { cmd: "justifyRight", title: "Align right", icon: markRaw(IconAlignRight) },
];
</script>
