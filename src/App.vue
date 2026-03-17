<template>
  <el-container class="app-container" :class="{ dark: isDark }">
    <!-- Toolbar -->
    <el-header class="app-toolbar" height="54px">
      <div class="toolbar-left">
        <span class="app-logo">
          <span class="logo-icon">⚗️</span>
          <span class="logo-text">Jinja Previewer</span>
          <el-tag
            size="small"
            type="info"
            effect="plain"
            round
            class="logo-badge"
            >v2</el-tag
          >
        </span>
      </div>

      <div class="toolbar-right">
        <el-select
          v-model="selectedTemplate"
          placeholder="Load Template..."
          size="small"
          class="template-dropdown"
          @change="onTemplateSelect"
        >
          <el-option label="+ New Template" value="__new__" />
          <el-option-group v-if="customTemplates.length" label="My Templates">
            <el-option
              v-for="ct in customTemplates"
              :key="'custom-' + ct.id"
              :label="ct.name"
              :value="'custom-' + ct.id"
            >
              <span style="float: left">{{ ct.name }}</span>
              <span
                style="
                  float: right;
                  color: var(--el-text-color-secondary);
                  font-size: 11px;
                  cursor: pointer;
                  margin-left: 12px;
                "
                title="Delete template"
                @click.stop="deleteTemplate(ct.id)"
                >✕</span
              >
            </el-option>
          </el-option-group>
          <el-option-group label="Built-in Examples">
            <el-option
              v-for="(ex, idx) in examples"
              :key="'example-' + idx"
              :label="ex.name"
              :value="'example-' + idx"
            />
          </el-option-group>
        </el-select>

        <el-tooltip content="Toggle preview panel" placement="bottom">
          <el-button
            :type="showPreview ? 'primary' : 'default'"
            size="small"
            :icon="ViewIcon"
            @click="showPreview = !showPreview"
            plain
          >
            Preview
          </el-button>
        </el-tooltip>

        <el-divider direction="vertical" />

        <el-tooltip content="Copy rendered output" placement="bottom">
          <el-button
            size="small"
            :icon="CopyDocument"
            @click="handleCopy"
            plain
          >
            Copy
          </el-button>
        </el-tooltip>

        <el-tooltip content="Download as HTML file" placement="bottom">
          <el-button
            size="small"
            :icon="Download"
            @click="handleDownload"
            plain
          >
            Export
          </el-button>
        </el-tooltip>

        <el-divider direction="vertical" />

        <el-tooltip
          :content="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          placement="bottom"
        >
          <el-switch
            v-model="isDark"
            :active-action-icon="Moon"
            :inactive-action-icon="Sunny"
            inline-prompt
          />
        </el-tooltip>

        <el-divider direction="vertical" />

        <el-tooltip content="User guide & documentation" placement="bottom">
          <el-button
            size="small"
            :icon="QuestionFilled"
            @click="showDocs = true"
            circle
          />
        </el-tooltip>
      </div>
    </el-header>

    <!-- Main Content -->
    <el-main class="app-main">
      <Splitpanes class="default-theme" @resize="onResize">
        <!-- Left: Template Editor (full height) -->
        <Pane :size="showPreview ? leftPaneSize : 100" :min-size="15">
          <TemplateEditor
            v-model="template"
            :dark="isDark"
            :active-template-name="activeTemplateName"
          />
        </Pane>

        <!-- Right: Preview + Variables / Filters (toggled) -->
        <Pane v-if="showPreview" :size="rightPaneSize" :min-size="20">
          <Splitpanes
            class="default-theme"
            horizontal
            @resize="onVerticalResize"
          >
            <!-- Preview section -->
            <Pane :size="showDataPanel ? previewPaneSize : 100" :min-size="20">
              <div class="right-pane-preview">
                <PreviewPanel
                  :output="renderedOutput"
                  :error="renderError"
                  :dark="isDark"
                  :show-configure="showDataPanel"
                  @toggle-configure="showDataPanel = !showDataPanel"
                />
              </div>
            </Pane>

            <!-- Data panel: Variables & Custom Filters tabs -->
            <Pane v-if="showDataPanel" :size="dataPaneSize" :min-size="10">
              <div class="right-pane-data">
                <div class="data-panel-header">
                  <el-tabs v-model="activeDataTab" class="data-tabs">
                    <el-tab-pane label="Variables" name="variables" />
                    <el-tab-pane label="Custom Filters" name="filters" />
                  </el-tabs>
                </div>
                <div class="data-panel-body">
                  <ContextEditor
                    v-show="activeDataTab === 'variables'"
                    v-model="context"
                    :dark="isDark"
                    hide-header
                  />
                  <FiltersEditor
                    v-show="activeDataTab === 'filters'"
                    v-model="customFiltersCode"
                    :dark="isDark"
                    hide-header
                    @filtersChange="onFiltersChange"
                  />
                </div>
              </div>
            </Pane>
          </Splitpanes>
        </Pane>
      </Splitpanes>
    </el-main>

    <!-- Status Bar -->
    <el-footer class="app-statusbar" height="28px">
      <div class="status-left">
        <el-icon v-if="!renderError" color="var(--el-color-success)"
          ><SuccessFilled
        /></el-icon>
        <el-icon v-else color="var(--el-color-danger)"
          ><CircleCloseFilled
        /></el-icon>
        <span v-if="!renderError" class="status-text"
          >Rendered successfully</span
        >
        <span v-else class="status-text status-error">{{ renderError }}</span>
      </div>
      <div class="status-right">
        <span class="status-text">
          Nunjucks {{ nunjucksNote }} · Auto-save {{ autoSaveStatus }}
        </span>
      </div>
    </el-footer>

    <!-- Global custom modal -->
    <CustomModal :dark="isDark" />

    <!-- Documentation drawer -->
    <DocsDrawer v-model="showDocs" :dark="isDark" />
  </el-container>
</template>

<script setup>
import { ref, computed, watch, onMounted, shallowRef } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  CopyDocument,
  Download,
  Moon,
  Sunny,
  SuccessFilled,
  CircleCloseFilled,
  View as ViewIcon,
  QuestionFilled,
} from "@element-plus/icons-vue";
import { Splitpanes, Pane } from "splitpanes";
import "splitpanes/dist/splitpanes.css";

import TemplateEditor from "./components/TemplateEditor.vue";
import ContextEditor from "./components/ContextEditor.vue";
import FiltersEditor from "./components/FiltersEditor.vue";
import PreviewPanel from "./components/PreviewPanel.vue";
import CustomModal from "./components/CustomModal.vue";
import DocsDrawer from "./components/DocsDrawer.vue";

import { renderTemplate } from "./utils/renderer.js";
import { copyToClipboard, downloadFile } from "./utils/export.js";
import { examples } from "./data/examples.js";
import { useAutoSave } from "./composables/useAutoSave.js";

// --- Auto-save ---
const {
  template,
  context,
  customFiltersCode,
  theme,
  activeTemplateId,
  restore,
  loadCustomTemplates,
  createCustomTemplate,
  updateCustomTemplate,
  deleteCustomTemplate,
} = useAutoSave({
  template: examples[0].template,
  context: examples[0].context,
  customFiltersCode: "",
  theme: "light",
});

const isDark = computed({
  get: () => theme.value === "dark",
  set: (val) => {
    theme.value = val ? "dark" : "light";
  },
});

// --- Theme handling ---
watch(
  isDark,
  (dark) => {
    document.documentElement.classList.toggle("dark", dark);
  },
  { immediate: true },
);

// --- Templates ---
const selectedTemplate = ref("example-0");
const customTemplates = ref([]);

// Save current edits back to the active custom template periodically
let syncTimer = null;
watch(
  [template, context],
  () => {
    if (
      activeTemplateId.value &&
      selectedTemplate.value?.startsWith("custom-")
    ) {
      clearTimeout(syncTimer);
      syncTimer = setTimeout(() => {
        updateCustomTemplate(activeTemplateId.value, {
          template: template.value,
          context: context.value,
        });
        // Keep local list in sync
        const ct = customTemplates.value.find(
          (t) => t.id === activeTemplateId.value,
        );
        if (ct) {
          ct.template = template.value;
          ct.context = context.value;
        }
      }, 1500);
    }
  },
  { deep: true },
);

function onTemplateSelect(val) {
  if (val === "__new__") {
    // Reset selection to previous value while dialog is open
    const prev = selectedTemplate.value;
    selectedTemplate.value = prev;
    ElMessageBox.prompt("Enter a name for the new template:", "New Template", {
      confirmButtonText: "Create",
      cancelButtonText: "Cancel",
      inputPattern: /\S+/,
      inputErrorMessage: "Template name cannot be empty",
    })
      .then(({ value: name }) => {
        const defaultHtml = "<div><p>Welcome</p></div>";
        const entry = createCustomTemplate(name.trim(), defaultHtml, "{}");
        customTemplates.value.push(entry);
        template.value = defaultHtml;
        context.value = "{}";
        activeTemplateId.value = entry.id;
        selectedTemplate.value = "custom-" + entry.id;
        ElMessage.success(`Created template "${name.trim()}"`);
      })
      .catch(() => {
        // Cancelled — keep previous selection
        selectedTemplate.value = prev;
      });
    return;
  }

  if (val.startsWith("example-")) {
    const idx = parseInt(val.replace("example-", ""), 10);
    const ex = examples[idx];
    if (ex) {
      template.value = ex.template;
      context.value = ex.context;
      customFiltersCode.value = ex.filters || "";
      activeTemplateId.value = null;
      ElMessage.success(`Loaded "${ex.name}" template`);
    }
  } else if (val.startsWith("custom-")) {
    const id = val.replace("custom-", "");
    const ct = customTemplates.value.find((t) => t.id === id);
    if (ct) {
      template.value = ct.template;
      context.value = ct.context;
      activeTemplateId.value = ct.id;
      ElMessage.success(`Loaded "${ct.name}" template`);
    }
  }
}

function deleteTemplate(id) {
  const ct = customTemplates.value.find((t) => t.id === id);
  const name = ct?.name || "template";
  ElMessageBox.confirm(
    `Are you sure you want to delete "${name}"?`,
    "Delete Template",
    {
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      type: "warning",
    },
  )
    .then(() => {
      deleteCustomTemplate(id);
      customTemplates.value = customTemplates.value.filter((t) => t.id !== id);
      // If the deleted one was active, switch to first example
      if (activeTemplateId.value === id) {
        activeTemplateId.value = null;
        selectedTemplate.value = "example-0";
        template.value = examples[0].template;
        context.value = examples[0].context;
      }
      ElMessage.success(`Deleted "${name}"`);
    })
    .catch(() => {});
}

// --- Active template name ---
const activeTemplateName = computed(() => {
  if (activeTemplateId.value) {
    const ct = customTemplates.value.find(
      (t) => t.id === activeTemplateId.value,
    );
    if (ct) return ct.name;
  }
  const sel = selectedTemplate.value;
  if (sel && sel.startsWith("example-")) {
    const idx = parseInt(sel.replace("example-", ""), 10);
    if (examples[idx]) return examples[idx].name;
  }
  return "Untitled";
});

// --- Preview & data panel ---
const showPreview = ref(false);
const showDataPanel = ref(true);
const activeDataTab = ref("variables");

// --- Documentation ---
const showDocs = ref(false);
const customFilters = shallowRef({});

function onFiltersChange(filters) {
  customFilters.value = filters;
}

// --- Rendering ---
const renderedOutput = ref("");
const renderError = ref(null);
const nunjucksNote = "(Jinja2-compatible)";
const autoSaveStatus = ref("enabled");

let renderTimer = null;

async function doRender() {
  let parsedContext = {};
  try {
    parsedContext = JSON.parse(context.value || "{}");
  } catch (e) {
    renderError.value = `JSON Error: ${e.message}`;
    renderedOutput.value = "";
    return;
  }

  const result = await Promise.resolve(
    renderTemplate(template.value, parsedContext, customFilters.value),
  );
  if (result.error) {
    renderError.value = result.error;
    renderedOutput.value = "";
  } else {
    renderError.value = null;
    renderedOutput.value = result.output;
  }
}

function debouncedRender() {
  clearTimeout(renderTimer);
  renderTimer = setTimeout(doRender, 300);
}

watch([template, context, customFilters], debouncedRender, { immediate: true });

// --- Pane sizes ---
const leftPaneSize = ref(50);
const rightPaneSize = ref(50);
const previewPaneSize = ref(60);
const dataPaneSize = ref(40);

function onResize(panes) {
  if (panes.length >= 2) {
    leftPaneSize.value = panes[0].size;
    rightPaneSize.value = panes[1].size;
  }
}

function onVerticalResize(panes) {
  if (panes.length >= 2) {
    previewPaneSize.value = panes[0].size;
    dataPaneSize.value = panes[1].size;
  }
}

// --- Export ---
function handleCopy() {
  if (!renderedOutput.value) {
    ElMessage.warning("Nothing to copy");
    return;
  }
  copyToClipboard(renderedOutput.value).then((ok) => {
    if (ok) ElMessage.success("Copied to clipboard!");
    else ElMessage.error("Failed to copy");
  });
}

function handleDownload() {
  if (!renderedOutput.value) {
    ElMessage.warning("Nothing to export");
    return;
  }
  downloadFile(renderedOutput.value, "output.html", "text/html");
  ElMessage.success("File downloaded!");
}

// --- Restore saved state on mount ---
onMounted(() => {
  // Load custom templates list
  customTemplates.value = loadCustomTemplates();

  const restored = restore();
  if (restored) {
    // Determine which template was active
    if (activeTemplateId.value) {
      const ct = customTemplates.value.find(
        (t) => t.id === activeTemplateId.value,
      );
      if (ct) {
        selectedTemplate.value = "custom-" + ct.id;
      } else {
        // Custom template was deleted, fall back
        activeTemplateId.value = null;
        selectedTemplate.value = "example-0";
      }
    } else {
      // Match against built-in examples
      const matchIdx = examples.findIndex(
        (ex) => ex.template === template.value,
      );
      selectedTemplate.value =
        matchIdx >= 0 ? "example-" + matchIdx : "example-0";
    }

    autoSaveStatus.value = "restored";
    setTimeout(() => {
      autoSaveStatus.value = "enabled";
    }, 2000);
  }
});
</script>

<style>
/* Global styles for splitpanes dark theme compatibility */
.dark .splitpanes--vertical > .splitpanes__splitter,
.dark .splitpanes--horizontal > .splitpanes__splitter {
  background-color: var(--el-border-color-darker) !important;
}

.splitpanes.default-theme .splitpanes__splitter {
  background-color: var(--el-border-color-lighter);
  min-width: 5px;
  min-height: 5px;
  transition: background-color 0.2s ease;
}

.splitpanes.default-theme .splitpanes__splitter:hover {
  background-color: var(--el-color-primary-light-5);
}
</style>

<style scoped>
.app-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--el-bg-color);
}

.app-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  border-bottom: 1px solid var(--el-border-color-lighter);
  background: linear-gradient(
    135deg,
    var(--el-bg-color) 0%,
    var(--el-bg-color-page) 100%
  );
  z-index: 10;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}

.toolbar-left,
.toolbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.app-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  font-size: 16px;
  color: var(--el-text-color-primary);
  user-select: none;
  letter-spacing: -0.3px;
}

.logo-icon {
  font-size: 22px;
}

.logo-badge {
  font-size: 10px;
  padding: 0 6px;
  height: 18px;
  line-height: 18px;
}

.app-main {
  flex: 1;
  padding: 0;
  overflow: hidden;
}

.app-main :deep(.splitpanes) {
  height: 100%;
}

/* Right pane: Preview on top, Variables on bottom */
.right-pane-preview {
  height: 100%;
  overflow: hidden;
}

.right-pane-data {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.data-panel-header {
  flex-shrink: 0;
  padding: 0 12px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.data-panel-header :deep(.el-tabs) {
  --el-tabs-header-height: 36px;
}

.data-panel-header :deep(.el-tabs__header) {
  margin: 0;
}

.data-panel-header :deep(.el-tabs__nav-wrap::after) {
  display: none;
}

.data-panel-body {
  flex: 1;
  overflow: hidden;
  min-height: 0;
}

.template-dropdown {
  width: 180px;
}

.app-statusbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  border-top: 1px solid var(--el-border-color-lighter);
  background: var(--el-bg-color);
  font-size: 11px;
  letter-spacing: 0.2px;
}

.status-left,
.status-right {
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-text {
  color: var(--el-text-color-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 500px;
}

.status-error {
  color: var(--el-color-danger);
}
</style>
