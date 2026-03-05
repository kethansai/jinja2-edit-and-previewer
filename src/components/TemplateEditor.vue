<template>
  <div class="editor-container">
    <div class="editor-header">
      <span class="editor-title">
        <el-icon><EditPen /></el-icon>
        Template
      </span>
      <div class="editor-mode-toggle">
        <el-segmented v-model="editMode" :options="modeOptions" size="small" />
      </div>
    </div>
    <!-- Code mode -->
    <div v-show="editMode === 'code'" class="editor-body">
      <Codemirror
        v-model="code"
        :style="{ height: '100%', width: '100%' }"
        :extensions="extensions"
        :autofocus="true"
        @update:modelValue="onCodeUpdate"
      />
    </div>
    <!-- Visual mode -->
    <div v-show="editMode === 'visual'" class="editor-body">
      <VisualEditor
        v-model="code"
        :dark="dark"
        @update:modelValue="onVisualUpdate"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { Codemirror } from "vue-codemirror";
import { html } from "@codemirror/lang-html";
import { oneDark } from "@codemirror/theme-one-dark";
import { EditorView } from "codemirror";
import { EditPen } from "@element-plus/icons-vue";
import VisualEditor from "./VisualEditor.vue";
import { formatHTML } from "../utils/htmlFormatter.js";

const props = defineProps({
  modelValue: { type: String, default: "" },
  dark: { type: Boolean, default: false },
});

const emit = defineEmits(["update:modelValue"]);

const code = ref(props.modelValue);
const editMode = ref("code");
let lastMode = "code";

const modeOptions = [
  { label: "< > Code", value: "code" },
  { label: "🖊 Visual", value: "visual" },
];

// Format code when switching from visual to code mode
watch(editMode, (newMode, oldMode) => {
  if (newMode === "code" && oldMode === "visual") {
    const formatted = formatHTML(code.value);
    if (formatted !== code.value) {
      code.value = formatted;
      emit("update:modelValue", formatted);
    }
  }
  lastMode = newMode;
});

watch(
  () => props.modelValue,
  (val) => {
    if (val !== code.value) {
      code.value = val;
    }
  },
);

const extensions = computed(() => {
  const exts = [html(), EditorView.lineWrapping];
  if (props.dark) {
    exts.push(oneDark);
  }
  return exts;
});

function onCodeUpdate(val) {
  code.value = val;
  emit("update:modelValue", val);
}

function onVisualUpdate(val) {
  code.value = val;
  emit("update:modelValue", val);
}
</script>

<style scoped>
.editor-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.editor-header {
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 600;
  border-bottom: 1px solid var(--el-border-color-lighter);
  background: var(--el-bg-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.editor-title {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--el-text-color-primary);
}

.editor-mode-toggle {
  margin-left: auto;
}

.editor-body {
  flex: 1;
  overflow: auto;
}

.editor-body :deep(.cm-editor) {
  height: 100%;
}

.editor-body :deep(.cm-scroller) {
  overflow: auto;
}
</style>
