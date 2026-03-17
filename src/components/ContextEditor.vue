<template>
  <div class="editor-container">
    <div v-if="!hideHeader" class="editor-header">
      <span class="editor-title">
        <el-icon><Document /></el-icon>
        Variables (JSON)
      </span>
      <el-tag
        v-if="error"
        type="danger"
        size="small"
        effect="dark"
        style="margin-left: auto"
      >
        Invalid JSON
      </el-tag>
      <el-tag
        v-else
        type="success"
        size="small"
        effect="plain"
        style="margin-left: auto"
      >
        Valid
      </el-tag>
    </div>
    <div class="editor-body">
      <Codemirror
        v-model="code"
        :style="{ height: '100%', width: '100%' }"
        :extensions="extensions"
        @update:modelValue="onUpdate"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { Codemirror } from "vue-codemirror";
import { json } from "@codemirror/lang-json";
import { oneDark } from "@codemirror/theme-one-dark";
import { EditorView } from "codemirror";
import { Document } from "@element-plus/icons-vue";

const props = defineProps({
  modelValue: { type: String, default: "{}" },
  dark: { type: Boolean, default: false },
  hideHeader: { type: Boolean, default: false },
});

const emit = defineEmits(["update:modelValue"]);

const code = ref(props.modelValue);
const error = ref(null);

watch(
  () => props.modelValue,
  (val) => {
    if (val !== code.value) {
      code.value = val;
    }
  },
);

const extensions = computed(() => {
  const exts = [json(), EditorView.lineWrapping];
  if (props.dark) {
    exts.push(oneDark);
  }
  return exts;
});

function onUpdate(val) {
  // Validate JSON
  try {
    JSON.parse(val);
    error.value = null;
  } catch (e) {
    error.value = e.message;
  }
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
}

.editor-title {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--el-text-color-primary);
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
