import { ref, reactive } from 'vue'

// Shared modal state
const modalVisible = ref(false)
const modalState = reactive({
  title: '',
  fields: [],        // [{ key, label, placeholder, defaultValue, type }]
  resolve: null,
  reject: null,
})

/**
 * Open a custom modal dialog that returns a promise.
 * @param {Object} options
 * @param {string} options.title - Modal title
 * @param {Array} options.fields - Array of field definitions:
 *   { key: string, label: string, placeholder?: string, defaultValue?: string, type?: 'text'|'number'|'url' }
 * @returns {Promise<Object|null>} Resolved with field values keyed by `key`, or null if cancelled.
 */
export function openModal({ title, fields }) {
  return new Promise((resolve) => {
    modalState.title = title
    modalState.fields = fields.map(f => ({
      ...f,
      value: f.defaultValue ?? '',
    }))
    modalState.resolve = resolve
    modalVisible.value = true
  })
}

export function confirmModal() {
  const result = {}
  modalState.fields.forEach(f => {
    result[f.key] = f.type === 'number' ? parseInt(f.value) || 0 : f.value
  })
  modalState.resolve?.(result)
  modalVisible.value = false
}

export function cancelModal() {
  modalState.resolve?.(null)
  modalVisible.value = false
}

export function useModal() {
  return {
    modalVisible,
    modalState,
    openModal,
    confirmModal,
    cancelModal,
  }
}
