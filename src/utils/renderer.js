import nunjucks from 'nunjucks'

/**
 * Create a Nunjucks environment configured to behave like Jinja2.
 * Registers extra filters that exist in Jinja2 but not in Nunjucks.
 */
function createEnvironment(customFilters = {}) {
  const env = new nunjucks.Environment(null, {
    autoescape: true,
    throwOnUndefined: false,
    trimBlocks: true,
    lstripBlocks: true,
  })

  // --- Built-in Jinja2-compatible filters ---

  env.addFilter('tojson', (val, indent) => {
    return JSON.stringify(val, null, indent || 0)
  })

  env.addFilter('pprint', (val) => {
    return JSON.stringify(val, null, 2)
  })

  env.addFilter('default', (val, defaultVal, boolean) => {
    if (boolean) {
      return val ? val : defaultVal
    }
    return val !== undefined && val !== null ? val : (defaultVal !== undefined ? defaultVal : '')
  })

  // Override lower/upper to handle non-string values (booleans, numbers, etc.)
  env.addFilter('lower', (val) => String(val).toLowerCase())
  env.addFilter('upper', (val) => String(val).toUpperCase())

  // Jinja2's format filter: "%.2f" | format(val)
  env.addFilter('format', function (formatStr, ...args) {
    let result = formatStr
    // Handle printf-style %s, %d, %f, %.Nf
    let argIndex = 0
    result = result.replace(/%(?:(\d+)\$)?([+-]?)(\d*)?(?:\.(\d+))?([sdfeEgGoxXbcr%])/g,
      (match, pos, sign, width, precision, type) => {
        if (type === '%') return '%'
        const val = pos ? args[parseInt(pos) - 1] : args[argIndex++]
        if (val === undefined) return match
        switch (type) {
          case 's': return String(val)
          case 'd':
          case 'i': return Math.floor(Number(val)).toString()
          case 'f':
          case 'F': {
            const p = precision !== undefined ? parseInt(precision) : 6
            return Number(val).toFixed(p)
          }
          case 'e': return Number(val).toExponential(precision ? parseInt(precision) : undefined)
          case 'E': return Number(val).toExponential(precision ? parseInt(precision) : undefined).toUpperCase()
          case 'g':
          case 'G': return Number(val).toPrecision(precision ? parseInt(precision) : undefined)
          case 'o': return Math.floor(Number(val)).toString(8)
          case 'x': return Math.floor(Number(val)).toString(16)
          case 'X': return Math.floor(Number(val)).toString(16).toUpperCase()
          default: return String(val)
        }
      })
    return result
  })

  env.addFilter('int', (val) => parseInt(val, 10) || 0)
  env.addFilter('float', (val) => parseFloat(val) || 0.0)
  env.addFilter('string', (val) => String(val))

  env.addFilter('truncate', (str, length, end) => {
    length = length || 255
    end = end || '...'
    if (typeof str !== 'string') return str
    if (str.length <= length) return str
    return str.substring(0, length - end.length) + end
  })

  env.addFilter('wordcount', (str) => {
    if (typeof str !== 'string') return 0
    return str.trim().split(/\s+/).filter(Boolean).length
  })

  env.addFilter('center', (str, width) => {
    str = String(str)
    width = width || 80
    if (str.length >= width) return str
    const pad = width - str.length
    const left = Math.floor(pad / 2)
    const right = pad - left
    return ' '.repeat(left) + str + ' '.repeat(right)
  })

  env.addFilter('filesizeformat', (bytes) => {
    bytes = Number(bytes)
    if (isNaN(bytes)) return '0 Bytes'
    const units = ['Bytes', 'kB', 'MB', 'GB', 'TB']
    let i = 0
    while (bytes >= 1000 && i < units.length - 1) {
      bytes /= 1000
      i++
    }
    return (i === 0 ? bytes : bytes.toFixed(1)) + ' ' + units[i]
  })

  env.addFilter('map', (arr, attr) => {
    if (!Array.isArray(arr)) return arr
    return arr.map((item) => item[attr])
  })

  env.addFilter('selectattr', (arr, attr, testVal) => {
    if (!Array.isArray(arr)) return arr
    if (testVal !== undefined) {
      return arr.filter((item) => item[attr] === testVal)
    }
    return arr.filter((item) => !!item[attr])
  })

  env.addFilter('rejectattr', (arr, attr, testVal) => {
    if (!Array.isArray(arr)) return arr
    if (testVal !== undefined) {
      return arr.filter((item) => item[attr] !== testVal)
    }
    return arr.filter((item) => !item[attr])
  })

  env.addFilter('groupby', (arr, attr) => {
    if (!Array.isArray(arr)) return arr
    const groups = {}
    arr.forEach((item) => {
      const key = item[attr]
      if (!groups[key]) groups[key] = { grouper: key, list: [] }
      groups[key].list.push(item)
    })
    return Object.values(groups)
  })

  env.addFilter('unique', (arr) => {
    if (!Array.isArray(arr)) return arr
    return [...new Set(arr)]
  })

  env.addFilter('min', (arr) => {
    if (!Array.isArray(arr)) return arr
    return Math.min(...arr)
  })

  env.addFilter('max', (arr) => {
    if (!Array.isArray(arr)) return arr
    return Math.max(...arr)
  })

  env.addFilter('sum', (arr, attr) => {
    if (!Array.isArray(arr)) return 0
    if (attr) return arr.reduce((sum, item) => sum + (Number(item[attr]) || 0), 0)
    return arr.reduce((sum, val) => sum + (Number(val) || 0), 0)
  })

  env.addFilter('items', (obj) => {
    if (typeof obj !== 'object' || obj === null) return []
    return Object.entries(obj)
  })

  env.addFilter('dictsort', (obj) => {
    if (typeof obj !== 'object' || obj === null) return []
    return Object.entries(obj).sort((a, b) => a[0].localeCompare(b[0]))
  })

  // --- Register user-defined custom filters ---
  if (customFilters && typeof customFilters === 'object') {
    Object.entries(customFilters).forEach(([name, fn]) => {
      if (typeof fn === 'function') {
        env.addFilter(name, fn)
      }
    })
  }

  return env
}

/**
 * Parse custom filters code (JS object literal) into an object of functions.
 * @param {string} code - JS code defining an object of filter functions
 * @returns {{ filters: object|null, error: string|null }}
 */
export function parseCustomFilters(code) {
  if (!code || !code.trim()) {
    return { filters: {}, error: null }
  }

  try {
    // Wrap in parens to make it an expression, then evaluate
    const fn = new Function(`"use strict"; return (${code.trim()});`)
    const filters = fn()
    if (typeof filters !== 'object' || filters === null) {
      return { filters: null, error: 'Custom filters must be an object: { filterName: (val) => ... }' }
    }
    // Validate all values are functions
    for (const [key, val] of Object.entries(filters)) {
      if (typeof val !== 'function') {
        return { filters: null, error: `Filter "${key}" must be a function` }
      }
    }
    return { filters, error: null }
  } catch (e) {
    return { filters: null, error: `Filter parse error: ${e.message}` }
  }
}

/**
 * Render a Jinja2/Nunjucks template string with the given context.
 * @param {string} templateStr - The template source
 * @param {object} context - Template variables
 * @param {object} customFilters - User-defined filter functions
 * @returns {{ output: string|null, error: string|null }}
 */
export function renderTemplate(templateStr, context = {}, customFilters = {}) {
  try {
    const env = createEnvironment(customFilters)
    const output = env.renderString(templateStr, context)
    return { output, error: null }
  } catch (e) {
    return { output: null, error: e.message }
  }
}
