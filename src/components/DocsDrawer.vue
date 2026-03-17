<template>
  <el-drawer
    v-model="visible"
    title="User Guide"
    direction="rtl"
    size="55%"
    :class="{ dark: dark }"
    destroy-on-close
  >
    <div class="docs-content">
      <!-- Quick Start -->
      <section class="docs-section">
        <h2>🚀 Quick Start</h2>
        <ol>
          <li>
            Write your <strong>Jinja2 template</strong> in the left editor panel
            using HTML and template syntax.
          </li>
          <li>
            Click <strong>Variables</strong> in the toolbar and define your data
            as JSON in the context panel.
          </li>
          <li>
            The <strong>Preview</strong> panel on the right updates live as you
            type.
          </li>
        </ol>
      </section>

      <!-- Interface Overview -->
      <section class="docs-section">
        <h2>🖥️ Interface Overview</h2>
        <p>The app has four main areas:</p>
        <div class="docs-grid">
          <div class="docs-card">
            <h4>Toolbar</h4>
            <p>Template selector, panel toggles, export, and theme switch.</p>
          </div>
          <div class="docs-card">
            <h4>Template Editor <span class="docs-label">Left</span></h4>
            <p>
              Write Jinja2/HTML with syntax highlighting. Switch to Visual
              (WYSIWYG) mode.
            </p>
          </div>
          <div class="docs-card">
            <h4>Preview Panel <span class="docs-label">Right</span></h4>
            <p>Live rendered output in HTML or Raw text mode.</p>
          </div>
          <div class="docs-card">
            <h4>Status Bar</h4>
            <p>Render status, engine info, and auto-save indicator.</p>
          </div>
        </div>
      </section>

      <!-- Template Syntax -->
      <section class="docs-section">
        <h2>📝 Template Syntax</h2>
        <p>
          Templates use <strong>Jinja2 syntax</strong> (powered by Nunjucks).
          Here are the core constructs:
        </p>

        <h4>Variables</h4>
        <pre class="docs-code" v-text="codeExamples.variables"></pre>

        <h4>Filters</h4>
        <pre class="docs-code" v-text="codeExamples.filters"></pre>

        <h4>Conditionals</h4>
        <pre class="docs-code" v-text="codeExamples.conditionals"></pre>

        <h4>Loops (Arrays)</h4>
        <pre class="docs-code" v-text="codeExamples.loops"></pre>

        <h4>Loops (Objects)</h4>
        <pre class="docs-code" v-text="codeExamples.objectLoops"></pre>

        <h4>Set Variables</h4>
        <pre class="docs-code" v-text="codeExamples.setVars"></pre>

        <h4>Macros</h4>
        <pre class="docs-code" v-text="codeExamples.macros"></pre>
      </section>

      <!-- Context / Variables -->
      <section class="docs-section">
        <h2>📦 Context Variables</h2>
        <p>
          Click the <strong>Variables</strong> button to open the JSON editor.
          Define your template data as a JSON object:
        </p>
        <pre class="docs-code" v-text="codeExamples.contextJson"></pre>
        <p>
          The editor validates JSON in real-time — a green
          <strong>Valid</strong> tag confirms your data is correct, while a red
          <strong>Invalid JSON</strong> tag appears if there's a syntax error.
        </p>
      </section>

      <!-- Built-in Filters -->
      <section class="docs-section">
        <h2>🔧 Built-in Filters</h2>
        <p>These Jinja2-compatible filters are available out of the box:</p>
        <div class="docs-table-wrapper">
          <table class="docs-table">
            <thead>
              <tr>
                <th>Filter</th>
                <th>Description</th>
                <th>Example</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="f in builtinFilters" :key="f.name">
                <td><code v-text="f.name"></code></td>
                <td v-text="f.desc"></td>
                <td><code v-text="f.example"></code></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Custom Filters -->
      <section class="docs-section">
        <h2>⚙️ Custom Filters</h2>
        <p>
          Click the <strong>Filters</strong> button to open the custom filters
          editor. Define filters as a JavaScript object where each value is a
          function:
        </p>
        <pre class="docs-code" v-text="codeExamples.customFiltersDef"></pre>

        <h4>Using in templates:</h4>
        <pre class="docs-code" v-text="codeExamples.customFiltersUsage"></pre>

        <h4>Multi-parameter filters</h4>
        <p>
          The piped value is always the <strong>first argument</strong>.
          Additional arguments go inside parentheses:
        </p>
        <pre class="docs-code" v-text="codeExamples.multiParamDef"></pre>

        <h4>Usage in template:</h4>
        <pre class="docs-code" v-text="codeExamples.multiParamUsage"></pre>
      </section>

      <!-- Visual Editor -->
      <section class="docs-section">
        <h2>🖊️ Visual Editor</h2>
        <p>
          Switch from <strong>Code</strong> to <strong>Visual</strong> mode
          using the toggle at the top of the template editor. The WYSIWYG editor
          lets you build HTML visually.
        </p>
        <h4>Formatting toolbar</h4>
        <ul>
          <li><strong>Text:</strong> Bold, Italic, Underline, Strikethrough</li>
          <li>
            <strong>Headings:</strong> H1–H6, Paragraph, Blockquote, Pre, Div
          </li>
          <li><strong>Alignment:</strong> Left, Center, Right, Justify</li>
          <li>
            <strong>Colors:</strong> Text color &amp; highlight background
          </li>
          <li><strong>Insert:</strong> Link, Image, Horizontal rule, Table</li>
          <li><strong>History:</strong> Undo / Redo</li>
        </ul>
        <h4>Block operations</h4>
        <p>
          Click any block element to select it. A floating toolbar appears with:
        </p>
        <ul>
          <li>
            <strong>Insert Above / Below</strong> — add a new block before or
            after
          </li>
          <li><strong>Insert Inside</strong> — nest a new block as a child</li>
          <li>
            <strong>Wrap with Parent</strong> — wrap the selected block in a new
            container
          </li>
          <li><strong>Drag Handle</strong> — reorder blocks</li>
          <li><strong>Delete</strong> — remove the block</li>
        </ul>
        <h4>Block Spacing Sidebar</h4>
        <p>
          Toggle the spacing panel to control padding, margin, borders,
          border-radius, display, position, flexbox/grid properties, background
          images, and more for the selected element.
        </p>
      </section>

      <!-- Templates -->
      <section class="docs-section">
        <h2>📁 Template Management</h2>
        <h4>Built-in Examples</h4>
        <p>
          Use the dropdown in the toolbar to load one of the pre-made examples:
        </p>
        <ul>
          <li>
            <strong>Welcome Email</strong> — conditionals, loops, variables
          </li>
          <li>
            <strong>Product Card</strong> — filters (truncate, format), pricing
          </li>
          <li>
            <strong>Invoice Table</strong> — table generation, calculations
          </li>
          <li>
            <strong>Config File (YAML)</strong> — non-HTML output, default
            filter
          </li>
          <li><strong>User Dashboard</strong> — grid layout, styled HTML</li>
          <li><strong>Blank</strong> — minimal starter template</li>
        </ul>
        <h4>Custom Templates</h4>
        <ol>
          <li>Select <strong>+ New Template</strong> and enter a name.</li>
          <li>
            Edit the template and context — changes auto-save every 1.5 seconds.
          </li>
          <li>
            To delete, hover over the template name in the dropdown and click
            <strong>✕</strong>.
          </li>
        </ol>
      </section>

      <!-- Preview -->
      <section class="docs-section">
        <h2>👁️ Preview Panel</h2>
        <p>The right panel shows the rendered result in two modes:</p>
        <ul>
          <li>
            <strong>HTML</strong> — rendered in a sandboxed iframe with styled
            tables, images, and responsive CSS.
          </li>
          <li>
            <strong>Raw</strong> — shows the raw output text in a monospace code
            view.
          </li>
        </ul>
        <p>
          If there's a template or JSON error, the panel shows a red error
          message with details.
        </p>
      </section>

      <!-- Exporting -->
      <section class="docs-section">
        <h2>📤 Exporting</h2>
        <ul>
          <li>
            <strong>Copy</strong> — copies the rendered HTML to your clipboard.
          </li>
          <li>
            <strong>Export</strong> — downloads the output as an
            <code>output.html</code> file.
          </li>
        </ul>
      </section>

      <!-- Auto-save & Theme -->
      <section class="docs-section">
        <h2>💾 Auto-Save &amp; Theme</h2>
        <ul>
          <li>
            All your work (template, context, filters, theme, active template)
            is <strong>automatically saved</strong> to your browser's local
            storage every second.
          </li>
          <li>
            On page reload, your session is
            <strong>restored automatically</strong>. The status bar briefly
            shows "Auto-save restored".
          </li>
          <li>
            Use the <strong>🌙/☀️ toggle</strong> in the toolbar to switch
            between dark and light themes. Your preference is remembered.
          </li>
        </ul>
      </section>

      <!-- Tips -->
      <section class="docs-section">
        <h2>💡 Tips &amp; Tricks</h2>
        <ul>
          <li>
            <strong>Resize panels</strong> by dragging the divider between the
            left and right panes.
          </li>
          <li>Chain multiple filters: <code v-text="tips.chain"></code></li>
          <li>
            Use the <code>default</code> filter for fallback values:
            <code v-text="tips.defaultFilter"></code>
          </li>
          <li>
            Custom filters can override built-in filters if they share the same
            name.
          </li>
          <li>
            The template engine has <code>autoescape</code> enabled — HTML in
            variables is escaped by default. Use the <code>safe</code> filter to
            render raw HTML.
          </li>
          <li>
            The <strong>Block Tree</strong> in Visual mode (left sidebar) shows
            the DOM hierarchy — click any node to select it.
          </li>
          <li>
            Use <code v-text="tips.raw"></code> to output literal template tags
            without processing.
          </li>
        </ul>
      </section>
    </div>
  </el-drawer>
</template>

<script setup>
defineProps({
  dark: { type: Boolean, default: false },
});

const visible = defineModel({ type: Boolean, default: false });

const codeExamples = {
  variables: `{{ name }}
{{ user.email }}
{{ items[0] }}`,

  filters: `{{ name | upper }}
{{ price | int }}
{{ description | truncate(100) }}
{{ "%.2f" | format(price) }}
{{ items | map("name") | join(", ") }}`,

  conditionals: `{% if user.is_active %}
  <p>Welcome back, {{ user.name }}!</p>
{% elif user.is_pending %}
  <p>Your account is pending.</p>
{% else %}
  <p>Please sign up.</p>
{% endif %}`,

  loops: `{% for item in items %}
  <li>{{ item.name }} — {{ item.price }}</li>
{% endfor %}`,

  objectLoops: `{# Loop over key-value pairs of an object #}
{% for key, value in settings %}
  <dt>{{ key }}</dt>
  <dd>{{ value }}</dd>
{% endfor %}

{# Access just the keys or values #}
{% for key in settings %}
  <p>{{ key }}: {{ settings[key] }}</p>
{% endfor %}

{# Using dictsort to sort by key #}
{% for key, value in settings | dictsort %}
  <li>{{ key }} = {{ value }}</li>
{% endfor %}`,

  setVars: `{% set greeting = "Hello" %}
{{ greeting }}, {{ name }}!`,

  macros: `{% macro button(label, type="primary") %}
  <button class="btn btn-{{ type }}">{{ label }}</button>
{% endmacro %}

{{ button("Save") }}
{{ button("Cancel", "secondary") }}`,

  contextJson: `{
  "name": "Alice",
  "items": [
    { "name": "Widget", "price": 9.99 },
    { "name": "Gadget", "price": 24.50 }
  ],
  "is_active": true
}`,

  customFiltersDef: `{
  reverse: (val) => val.split('').reverse().join(''),
  currency: (val, symbol) => symbol + parseFloat(val).toFixed(2),
  initials: (name) => name.split(' ').map(w => w[0]).join('')
}`,

  customFiltersUsage: `{{ "hello" | reverse }}        → olleh
{{ 42.5 | currency("$") }}    → $42.50
{{ "John Doe" | initials }}    → JD`,

  multiParamDef: `// Definition:
{
  between: (val, min, max) => val >= min && val <= max,
  pad: (val, width, char) => String(val).padStart(width, char || '0'),
  wrap: (val, before, after) => before + val + after
}`,

  multiParamUsage: `{{ score | between(60, 100) }}      → true / false
{{ "42" | pad(6, "0") }}            → 000042
{{ name | wrap("<b>", "</b>") }}     → <b>Alice</b>`,
};

const tips = {
  chain: "{{ name | lower | truncate(10) }}",
  defaultFilter: '{{ nickname | default("Anonymous") }}',
  raw: "{% raw %} ... {% endraw %}",
};

const builtinFilters = [
  {
    name: "default",
    desc: "Fallback if value is undefined/null",
    example: '{{ name | default("Guest") }}',
  },
  {
    name: "lower",
    desc: "Convert to lowercase",
    example: '{{ "HELLO" | lower }}',
  },
  {
    name: "upper",
    desc: "Convert to uppercase",
    example: '{{ "hello" | upper }}',
  },
  { name: "int", desc: "Cast to integer", example: '{{ "5" | int }}' },
  { name: "float", desc: "Cast to float", example: '{{ "3.14" | float }}' },
  { name: "string", desc: "Cast to string", example: "{{ 42 | string }}" },
  {
    name: "tojson",
    desc: "Serialize to JSON string",
    example: "{{ obj | tojson }}",
  },
  {
    name: "pprint",
    desc: "Pretty-print (indented JSON)",
    example: "{{ obj | pprint }}",
  },
  {
    name: "truncate",
    desc: "Truncate to given length",
    example: "{{ text | truncate(100) }}",
  },
  {
    name: "wordcount",
    desc: "Count words in a string",
    example: "{{ text | wordcount }}",
  },
  {
    name: "center",
    desc: "Center-pad a string",
    example: '{{ "hi" | center(10) }}',
  },
  {
    name: "format",
    desc: "Printf-style formatting",
    example: '{{ "%.2f" | format(price) }}',
  },
  {
    name: "filesizeformat",
    desc: "Human-readable file size",
    example: "{{ 1048576 | filesizeformat }}",
  },
  {
    name: "map",
    desc: "Extract attribute from each item",
    example: '{{ users | map("name") }}',
  },
  {
    name: "selectattr",
    desc: "Keep items where attr is truthy",
    example: '{{ users | selectattr("active") }}',
  },
  {
    name: "rejectattr",
    desc: "Reject items where attr is truthy",
    example: '{{ users | rejectattr("banned") }}',
  },
  {
    name: "groupby",
    desc: "Group items by an attribute",
    example: '{{ items | groupby("category") }}',
  },
  {
    name: "unique",
    desc: "Remove duplicate values",
    example: "{{ [1,2,2,3] | unique }}",
  },
  {
    name: "min",
    desc: "Minimum value in array",
    example: "{{ [3,1,2] | min }}",
  },
  {
    name: "max",
    desc: "Maximum value in array",
    example: "{{ [3,1,2] | max }}",
  },
  { name: "sum", desc: "Sum of array values", example: "{{ [1,2,3] | sum }}" },
  {
    name: "items",
    desc: "Convert dict to key-value pairs",
    example: "{{ obj | items }}",
  },
  {
    name: "dictsort",
    desc: "Sort dict entries by key",
    example: "{{ obj | dictsort }}",
  },
];
</script>

<style scoped>
.docs-content {
  padding: 0 8px 24px;
  font-size: 14px;
  line-height: 1.7;
  color: var(--el-text-color-primary);
}

.docs-section {
  margin-bottom: 28px;
}

.docs-section h2 {
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 12px;
  padding-bottom: 8px;
  border-bottom: 2px solid var(--el-border-color-lighter);
}

.docs-section h4 {
  font-size: 14px;
  font-weight: 600;
  margin: 14px 0 6px;
}

.docs-section p {
  margin: 6px 0;
}

.docs-section ul,
.docs-section ol {
  margin: 6px 0;
  padding-left: 24px;
}

.docs-section li {
  margin: 4px 0;
}

.docs-code {
  background: var(--el-fill-color-light);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 6px;
  padding: 10px 14px;
  font-family:
    "Cascadia Code", "Fira Code", "JetBrains Mono", Consolas, monospace;
  font-size: 12.5px;
  line-height: 1.6;
  overflow-x: auto;
  white-space: pre;
  margin: 8px 0;
}

.docs-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin: 10px 0;
}

.docs-card {
  background: var(--el-fill-color-lighter);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
  padding: 12px 14px;
}

.docs-card h4 {
  margin: 0 0 4px;
  font-size: 13px;
  font-weight: 700;
}

.docs-card p {
  margin: 0;
  font-size: 12.5px;
  color: var(--el-text-color-secondary);
}

.docs-label {
  font-size: 10px;
  font-weight: 600;
  background: var(--el-color-primary-light-8);
  color: var(--el-color-primary);
  padding: 1px 6px;
  border-radius: 4px;
  margin-left: 4px;
  vertical-align: middle;
}

.docs-table-wrapper {
  overflow-x: auto;
  margin: 10px 0;
}

.docs-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12.5px;
}

.docs-table th,
.docs-table td {
  text-align: left;
  padding: 7px 10px;
  border: 1px solid var(--el-border-color-lighter);
}

.docs-table thead th {
  background: var(--el-fill-color-light);
  font-weight: 600;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.docs-table tbody tr:hover {
  background: var(--el-fill-color-lighter);
}

.docs-table code {
  background: var(--el-fill-color);
  padding: 1px 5px;
  border-radius: 3px;
  font-size: 11.5px;
  white-space: nowrap;
}
</style>
