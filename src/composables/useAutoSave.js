import { ref, watch } from "vue";

const STORAGE_KEY = "jinja-previewer";
const CUSTOM_TEMPLATES_KEY = "jinja-previewer-custom-templates";
const DEBOUNCE_MS = 1000;

/**
 * Generate a short unique id.
 */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

/**
 * Composable for auto-saving and restoring editor state to/from localStorage.
 */
export function useAutoSave(defaults = {}) {
  const template = ref(defaults.template || "");
  const context = ref(defaults.context || "{}");
  const customFiltersCode = ref(defaults.customFiltersCode || "");
  const theme = ref(defaults.theme || "light");
  const activeTemplateId = ref(defaults.activeTemplateId || null);

  // --- Restore from localStorage ---
  function restore() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        if (data.template !== undefined) template.value = data.template;
        if (data.context !== undefined) context.value = data.context;
        if (data.customFiltersCode !== undefined)
          customFiltersCode.value = data.customFiltersCode;
        if (data.theme !== undefined) theme.value = data.theme;
        if (data.activeTemplateId !== undefined)
          activeTemplateId.value = data.activeTemplateId;
        return true;
      }
    } catch (e) {
      console.warn("Failed to restore auto-save:", e);
    }
    return false;
  }

  // --- Debounced save ---
  let saveTimer = null;
  function save() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      try {
        const data = {
          template: template.value,
          context: context.value,
          customFiltersCode: customFiltersCode.value,
          theme: theme.value,
          activeTemplateId: activeTemplateId.value,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (e) {
        console.warn("Failed to auto-save:", e);
      }
    }, DEBOUNCE_MS);
  }

  // Watch all values and auto-save
  watch([template, context, customFiltersCode, theme, activeTemplateId], save, {
    deep: true,
  });

  // --- Clear saved data ---
  function clear() {
    localStorage.removeItem(STORAGE_KEY);
  }

  // --- Custom templates management ---
  function loadCustomTemplates() {
    try {
      const saved = localStorage.getItem(CUSTOM_TEMPLATES_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Failed to load custom templates:", e);
    }
    return [];
  }

  function saveCustomTemplates(templates) {
    try {
      localStorage.setItem(CUSTOM_TEMPLATES_KEY, JSON.stringify(templates));
    } catch (e) {
      console.warn("Failed to save custom templates:", e);
    }
  }

  function createCustomTemplate(name, templateHtml = "", contextJson = "{}") {
    const id = generateId();
    const entry = { id, name, template: templateHtml, context: contextJson };
    const list = loadCustomTemplates();
    list.push(entry);
    saveCustomTemplates(list);
    return entry;
  }

  function updateCustomTemplate(id, updates) {
    const list = loadCustomTemplates();
    const idx = list.findIndex((t) => t.id === id);
    if (idx >= 0) {
      Object.assign(list[idx], updates);
      saveCustomTemplates(list);
      return list[idx];
    }
    return null;
  }

  function deleteCustomTemplate(id) {
    const list = loadCustomTemplates();
    const filtered = list.filter((t) => t.id !== id);
    saveCustomTemplates(filtered);
    return filtered;
  }

  return {
    template,
    context,
    customFiltersCode,
    theme,
    activeTemplateId,
    restore,
    clear,
    loadCustomTemplates,
    saveCustomTemplates,
    createCustomTemplate,
    updateCustomTemplate,
    deleteCustomTemplate,
  };
}
