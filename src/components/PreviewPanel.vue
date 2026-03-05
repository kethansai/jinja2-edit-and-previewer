<template>
  <div class="preview-container">
    <div class="preview-header">
      <span class="preview-title">
        <el-icon><View /></el-icon>
        Preview
      </span>
      <div class="preview-actions">
        <el-tooltip content="Refresh preview" placement="bottom">
          <el-button
            size="small"
            circle
            :icon="RefreshIcon"
            @click="refreshPreview"
            class="preview-refresh-btn"
          />
        </el-tooltip>
        <el-segmented v-model="mode" :options="modeOptions" size="small" />
      </div>
    </div>
    <div class="preview-body">
      <!-- Error state -->
      <div v-if="error" class="preview-error">
        <el-icon :size="22"><WarningFilled /></el-icon>
        <div>
          <div class="error-title">Template Error</div>
          <pre class="error-message">{{ error }}</pre>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else-if="!output" class="preview-empty">
        <div class="empty-icon">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <rect
              x="6"
              y="10"
              width="36"
              height="28"
              rx="4"
              stroke="currentColor"
              stroke-width="2"
            />
            <path d="M6 18h36" stroke="currentColor" stroke-width="1.5" />
            <circle cx="11" cy="14" r="1.5" fill="currentColor" />
            <circle cx="16" cy="14" r="1.5" fill="currentColor" />
            <circle cx="21" cy="14" r="1.5" fill="currentColor" />
            <path
              d="M16 28l4-4 3 3 5-5 6 6"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <p class="empty-text">Preview will appear here</p>
        <p class="empty-sub">
          Write a template and add variables to see the rendered output
        </p>
      </div>

      <!-- HTML rendered preview (sandboxed iframe) -->
      <iframe
        v-else-if="mode === 'html'"
        ref="iframeRef"
        :key="iframeKey"
        class="preview-iframe"
        sandbox="allow-same-origin allow-scripts"
        :srcdoc="iframeSrcdoc"
      />

      <!-- Raw text preview -->
      <pre v-else class="preview-raw">{{ output }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import {
  View,
  WarningFilled,
  Refresh as RefreshIcon,
} from "@element-plus/icons-vue";

const props = defineProps({
  output: { type: String, default: "" },
  error: { type: String, default: null },
  dark: { type: Boolean, default: false },
});

const mode = ref("html");
const iframeRef = ref(null);
const iframeKey = ref(0);

const modeOptions = [
  { label: "HTML", value: "html" },
  { label: "Raw", value: "raw" },
];

function refreshPreview() {
  iframeKey.value++;
}

const isHtmlContent = computed(() => {
  if (!props.output) return true;
  const trimmed = props.output.trim();
  return /<[a-z][\s\S]*?>/i.test(trimmed);
});

const iframeSrcdoc = computed(() => {
  const bgColor = props.dark ? "#1a1a2e" : "#ffffff";
  const textColor = props.dark ? "#e0e0e0" : "#333333";
  const content = props.output
    ? isHtmlContent.value
      ? props.output
      : `<pre style="margin:0;white-space:pre-wrap;word-wrap:break-word;font-family:'Cascadia Code','Fira Code','JetBrains Mono',Consolas,monospace;font-size:13px;">${props.output.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>`
    : '<p style="color: #999;">Preview will appear here...</p>';
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      padding: 16px;
      margin: 0;
      background: ${bgColor};
      color: ${textColor};
      line-height: 1.6;
    }
    img { max-width: 100%; height: auto; display: block; }
    p { margin: 0; }
    table { border-collapse: collapse; }
  </style>
</head>
<body>${content}</body>
</html>`;
});
</script>

<style scoped>
.preview-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.preview-header {
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 600;
  border-bottom: 1px solid var(--el-border-color-lighter);
  background: var(--el-bg-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.preview-title {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--el-text-color-primary);
}

.preview-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.preview-body {
  flex: 1;
  overflow: auto;
  position: relative;
}

.preview-iframe {
  width: 100%;
  height: 100%;
  border: none;
  background: white;
}

.preview-raw {
  margin: 0;
  padding: 16px;
  font-family:
    "Cascadia Code", "Fira Code", "JetBrains Mono", Consolas, monospace;
  font-size: 13px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-wrap: break-word;
  color: var(--el-text-color-primary);
}

.preview-error {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  margin: 16px;
  background: var(--el-color-danger-light-9);
  border: 1px solid var(--el-color-danger-light-5);
  border-radius: 10px;
  color: var(--el-color-danger);
}

.error-title {
  font-weight: 700;
  margin-bottom: 6px;
  font-size: 14px;
}

.error-message {
  margin: 0;
  font-family: "Cascadia Code", "Fira Code", monospace;
  font-size: 12px;
  white-space: pre-wrap;
  word-wrap: break-word;
  line-height: 1.5;
}

/* Empty state */
.preview-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 10px;
  color: var(--el-text-color-placeholder);
  user-select: none;
}

.empty-icon {
  opacity: 0.35;
  margin-bottom: 4px;
}

.empty-text {
  font-size: 15px;
  font-weight: 600;
  margin: 0;
}

.empty-sub {
  font-size: 12px;
  opacity: 0.7;
  margin: 0;
}

.preview-refresh-btn {
  margin-right: 6px;
}
</style>
