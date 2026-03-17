<template>
  <div class="editor-container">
    <div v-if="!hideHeader" class="editor-header">
      <span class="editor-title">
        <el-icon><Filter /></el-icon>
        Custom Filters (JS)
      </span>
      <el-popover placement="bottom-start" :width="360" trigger="click">
        <template #reference>
          <el-button
            size="small"
            text
            type="info"
            style="margin-left: 8px; padding: 2px 6px"
          >
            <el-icon style="margin-right: 4px"><InfoFilled /></el-icon>
            Built-in Filters
          </el-button>
        </template>
        <div class="builtin-filters-popover">
          <div class="builtin-filters-title">Built-in Jinja2 Filters</div>
          <div class="builtin-filters-grid">
            <div
              v-for="f in builtinFilters"
              :key="f.name"
              class="builtin-filter-item"
            >
              <code>{{ f.name }}</code>
              <span class="builtin-filter-desc">{{ f.desc }}</span>
            </div>
          </div>
        </div>
      </el-popover>
      <el-tag
        v-if="error"
        type="danger"
        size="small"
        effect="dark"
        style="margin-left: auto"
      >
        Error
      </el-tag>
      <el-tag
        v-else-if="hasFilters"
        type="success"
        size="small"
        effect="plain"
        style="margin-left: auto"
      >
        {{ filterCount }} filter{{ filterCount !== 1 ? "s" : "" }}
      </el-tag>
    </div>
    <div class="editor-hint">
      Define an object of filter functions, e.g.
      <code>{ reverse: (val) =&gt; val.split('').reverse().join('') }</code>
    </div>
    <div class="editor-body">
      <Codemirror
        v-model="code"
        :style="{ height: '100%', width: '100%' }"
        :extensions="extensions"
        @update:modelValue="onUpdate"
      />
    </div>
    <div v-if="error" class="editor-error">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { Codemirror } from "vue-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";
import { EditorView } from "codemirror";
import { Filter, InfoFilled } from "@element-plus/icons-vue";
import { parseCustomFilters } from "../utils/renderer.js";

const builtinFilters = [
  { name: "default", desc: "Fallback if value is undefined" },
  { name: "lower", desc: "Lowercase string" },
  { name: "upper", desc: "Uppercase string" },
  { name: "int", desc: "Cast to integer" },
  { name: "float", desc: "Cast to float" },
  { name: "string", desc: "Cast to string" },
  { name: "tojson", desc: "Serialize to JSON" },
  { name: "pprint", desc: "Pretty-print JSON" },
  { name: "truncate", desc: "Truncate text to length" },
  { name: "wordcount", desc: "Count words in string" },
  { name: "center", desc: "Center-pad a string" },
  { name: "format", desc: "Printf-style formatting" },
  { name: "filesizeformat", desc: "Human-readable file size" },
  { name: "map", desc: "Extract attribute from items" },
  { name: "selectattr", desc: "Filter items by attribute" },
  { name: "rejectattr", desc: "Reject items by attribute" },
  { name: "groupby", desc: "Group items by attribute" },
  { name: "unique", desc: "Remove duplicates" },
  { name: "min", desc: "Minimum of array" },
  { name: "max", desc: "Maximum of array" },
  { name: "sum", desc: "Sum of array" },
  { name: "items", desc: "Dict to key-value pairs" },
  { name: "dictsort", desc: "Sort dict by keys" },
];

const props = defineProps({
  modelValue: { type: String, default: "" },
  dark: { type: Boolean, default: false },
  hideHeader: { type: Boolean, default: false },
});

const emit = defineEmits(["update:modelValue", "filtersChange"]);

const code = ref(props.modelValue);
const error = ref(null);
const filterCount = ref(0);
const hasFilters = computed(() => filterCount.value > 0);

watch(
  () => props.modelValue,
  (val) => {
    if (val !== code.value) {
      code.value = val;
      validateAndEmitFilters(val);
    }
  },
);

const extensions = computed(() => {
  const exts = [javascript(), EditorView.lineWrapping];
  if (props.dark) {
    exts.push(oneDark);
  }
  return exts;
});

function validateAndEmitFilters(val) {
  const result = parseCustomFilters(val);
  error.value = result.error;
  if (result.filters) {
    filterCount.value = Object.keys(result.filters).length;
    emit("filtersChange", result.filters);
  } else {
    emit("filtersChange", {});
  }
}

function onUpdate(val) {
  emit("update:modelValue", val);
  validateAndEmitFilters(val);
}

// Initial parse
validateAndEmitFilters(props.modelValue);
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

.editor-hint {
  padding: 6px 12px;
  font-size: 11px;
  color: var(--el-text-color-secondary);
  background: var(--el-bg-color-page);
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.editor-hint code {
  background: var(--el-fill-color-light);
  padding: 1px 4px;
  border-radius: 3px;
  font-size: 11px;
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

.editor-error {
  padding: 6px 12px;
  font-size: 12px;
  color: var(--el-color-danger);
  background: var(--el-color-danger-light-9);
  border-top: 1px solid var(--el-color-danger-light-5);
}

.builtin-filters-popover {
  max-height: 320px;
  overflow-y: auto;
}

.builtin-filters-title {
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--el-text-color-primary);
}

.builtin-filters-grid {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.builtin-filter-item {
  display: flex;
  align-items: baseline;
  gap: 8px;
  font-size: 12px;
  line-height: 1.6;
}

.builtin-filter-item code {
  background: var(--el-fill-color-light);
  padding: 1px 5px;
  border-radius: 3px;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
  color: var(--el-color-primary);
}

.builtin-filter-desc {
  color: var(--el-text-color-secondary);
}
</style>
