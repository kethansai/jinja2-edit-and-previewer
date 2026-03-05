/**
 * Lightweight HTML formatter / pretty-printer.
 * Handles self-closing tags, inline elements, Jinja template tags,
 * style/script blocks, and preserves <pre> content.
 */

const SELF_CLOSING = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);

const INLINE_ELEMENTS = new Set([
  "a",
  "abbr",
  "acronym",
  "b",
  "bdo",
  "big",
  "br",
  "button",
  "cite",
  "code",
  "dfn",
  "em",
  "i",
  "img",
  "input",
  "kbd",
  "label",
  "map",
  "object",
  "output",
  "q",
  "samp",
  "select",
  "small",
  "span",
  "strong",
  "sub",
  "sup",
  "textarea",
  "time",
  "tt",
  "u",
  "var",
]);

const RAW_TAGS = new Set(["script", "style"]);

/**
 * Format HTML string with indentation.
 * @param {string} html - Raw HTML string
 * @param {string} indentStr - Indent characters (default: 2 spaces)
 * @returns {string} Formatted HTML
 */
export function formatHTML(html, indentStr = "  ") {
  if (!html || !html.trim()) return html || "";

  // Tokenize into tags, text, comments, and Jinja blocks
  const tokens = tokenize(html);
  const lines = [];
  let indent = 0;
  let inRaw = null; // track raw tags like <style>, <script>

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    // Inside raw tag — just push as-is until closing tag
    if (inRaw) {
      if (token.type === "close" && token.tag === inRaw) {
        inRaw = null;
        lines.push(indentStr.repeat(indent) + token.raw.trim());
      } else {
        // Preserve raw content (style/script) with its own indentation
        const rawLines = token.raw.split("\n");
        for (const rl of rawLines) {
          const trimmed = rl.trim();
          if (trimmed) {
            lines.push(indentStr.repeat(indent + 1) + trimmed);
          }
        }
      }
      continue;
    }

    if (token.type === "open") {
      const tagName = token.tag;
      lines.push(indentStr.repeat(indent) + token.raw.trim());

      if (RAW_TAGS.has(tagName)) {
        inRaw = tagName;
        indent++;
      } else if (!SELF_CLOSING.has(tagName) && !token.selfClose) {
        indent++;
      }
    } else if (token.type === "close") {
      indent = Math.max(0, indent - 1);
      lines.push(indentStr.repeat(indent) + token.raw.trim());
    } else if (token.type === "comment" || token.type === "jinja") {
      lines.push(indentStr.repeat(indent) + token.raw.trim());
    } else if (token.type === "text") {
      const text = token.raw.trim();
      if (text) {
        lines.push(indentStr.repeat(indent) + text);
      }
    } else if (token.type === "doctype") {
      lines.push(token.raw.trim());
    }
  }

  return lines.join("\n");
}

/**
 * Tokenize HTML into an array of token objects.
 */
function tokenize(html) {
  const tokens = [];
  let pos = 0;

  while (pos < html.length) {
    // Jinja comment {# ... #}
    if (html.startsWith("{#", pos)) {
      const end = html.indexOf("#}", pos + 2);
      const slice = end === -1 ? html.slice(pos) : html.slice(pos, end + 2);
      tokens.push({ type: "jinja", raw: slice });
      pos += slice.length;
      continue;
    }

    // Jinja block {% ... %} or expression {{ ... }}
    if (html.startsWith("{%", pos) || html.startsWith("{{", pos)) {
      const closer = html[pos + 1] === "%" ? "%}" : "}}";
      const end = html.indexOf(closer, pos + 2);
      const slice = end === -1 ? html.slice(pos) : html.slice(pos, end + 2);
      tokens.push({ type: "jinja", raw: slice });
      pos += slice.length;
      continue;
    }

    // HTML comment <!-- ... -->
    if (html.startsWith("<!--", pos)) {
      const end = html.indexOf("-->", pos + 4);
      const slice = end === -1 ? html.slice(pos) : html.slice(pos, end + 3);
      tokens.push({ type: "comment", raw: slice });
      pos += slice.length;
      continue;
    }

    // DOCTYPE
    if (html.slice(pos, pos + 9).toLowerCase() === "<!doctype") {
      const end = html.indexOf(">", pos);
      const slice = end === -1 ? html.slice(pos) : html.slice(pos, end + 1);
      tokens.push({ type: "doctype", raw: slice });
      pos += slice.length;
      continue;
    }

    // HTML tag
    if (html[pos] === "<") {
      const end = html.indexOf(">", pos);
      if (end === -1) {
        tokens.push({ type: "text", raw: html.slice(pos) });
        break;
      }
      const raw = html.slice(pos, end + 1);
      const isClose = raw[1] === "/";
      const selfClose = raw[raw.length - 2] === "/" || false;

      // Extract tag name
      const nameMatch = raw.match(
        isClose ? /^<\/\s*(\w[\w-]*)/ : /^<\s*(\w[\w-]*)/,
      );
      const tag = nameMatch ? nameMatch[1].toLowerCase() : "";

      if (isClose) {
        tokens.push({ type: "close", tag, raw });
      } else {
        const isSC = selfClose || SELF_CLOSING.has(tag);
        tokens.push({ type: "open", tag, raw, selfClose: isSC });
      }

      pos = end + 1;
      continue;
    }

    // Text content (until next tag or Jinja block)
    let nextSpecial = html.length;
    for (const marker of ["<", "{%", "{{", "{#"]) {
      const idx = html.indexOf(marker, pos);
      if (idx !== -1 && idx < nextSpecial) nextSpecial = idx;
    }
    const text = html.slice(pos, nextSpecial);
    if (text) {
      tokens.push({ type: "text", raw: text });
    }
    pos = nextSpecial;
  }

  return tokens;
}
