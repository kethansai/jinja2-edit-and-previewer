<template>
  <div class="editor-container">
    <div class="editor-header">
      <span class="editor-title">
        <el-icon><Filter /></el-icon>
        Custom Filters (JS)
      </span>
      <el-tag v-if="error" type="danger" size="small" effect="dark" style="margin-left: auto;">
        Error
      </el-tag>
      <el-tag v-else-if="hasFilters" type="success" size="small" effect="plain" style="margin-left: auto;">
        {{ filterCount }} filter{{ filterCount !== 1 ? 's' : '' }}
      </el-tag>
    </div>
    <div class="editor-hint">
      Define an object of filter functions, e.g. <code>{ reverse: (val) =&gt; val.split('').reverse().join('') }</code>
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
import { ref, computed, watch } from 'vue'
import { Codemirror } from 'vue-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'
import { EditorView } from 'codemirror'
import { Filter } from '@element-plus/icons-vue'
import { parseCustomFilters } from '../utils/renderer.js'

const props = defineProps({
  modelValue: { type: String, default: '' },
  dark: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'filtersChange'])

const code = ref(props.modelValue)
const error = ref(null)
const filterCount = ref(0)
const hasFilters = computed(() => filterCount.value > 0)

watch(() => props.modelValue, (val) => {
  if (val !== code.value) {
    code.value = val
    validateAndEmitFilters(val)
  }
})

const extensions = computed(() => {
  const exts = [
    javascript(),
    EditorView.lineWrapping,
  ]
  if (props.dark) {
    exts.push(oneDark)
  }
  return exts
})

function validateAndEmitFilters(val) {
  const result = parseCustomFilters(val)
  error.value = result.error
  if (result.filters) {
    filterCount.value = Object.keys(result.filters).length
    emit('filtersChange', result.filters)
  } else {
    emit('filtersChange', {})
  }
}

function onUpdate(val) {
  emit('update:modelValue', val)
  validateAndEmitFilters(val)
}

// Initial parse
validateAndEmitFilters(props.modelValue)
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
</style>
