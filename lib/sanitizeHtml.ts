/**
 * Zero-dependency HTML sanitizer used for admin-authored "rich content".
 *
 * It is intentionally conservative: only an explicit allow-list of tags and
 * attributes survives. Everything else is dropped or escaped.
 *
 * The admin form already runs a stricter clean step in the browser using
 * DOMParser when content is pasted from Word/Google Docs. This server-side
 * pass is defence-in-depth so that a malicious payload never reaches the
 * public site even if the browser path is bypassed.
 *
 * Why we don't use a DOM parser here:
 *   - We want this code to run in Node (API routes) without jsdom.
 *   - The trust boundary is admin-only; the goal is to prevent an injected
 *     <script> or onclick attribute from executing on visitors' browsers.
 */

const ALLOWED_TAGS = new Set([
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "s",
  "del",
  "mark",
  "h1",
  "h2",
  "h3",
  "h4",
  "ul",
  "ol",
  "li",
  "blockquote",
  "a",
  "code",
  "pre",
  "hr",
  "span",
  "div",
]);

const ALLOWED_ATTRS: Record<string, Set<string>> = {
  a: new Set(["href", "title", "rel", "target"]),
};

const ALLOWED_PROTOCOLS = /^(https?:|mailto:|tel:|#|\/)/i;

const VOID_TAGS = new Set(["br", "hr"]);

function escapeText(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttr(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

type Token =
  | { type: "text"; value: string }
  | { type: "open"; name: string; attrs: Record<string, string>; selfClose: boolean }
  | { type: "close"; name: string };

function tokenize(html: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  const len = html.length;
  while (i < len) {
    const lt = html.indexOf("<", i);
    if (lt === -1) {
      tokens.push({ type: "text", value: html.slice(i) });
      break;
    }
    if (lt > i) tokens.push({ type: "text", value: html.slice(i, lt) });

    // Comments / CDATA / DOCTYPE — drop entirely.
    if (html.startsWith("<!--", lt)) {
      const end = html.indexOf("-->", lt + 4);
      i = end === -1 ? len : end + 3;
      continue;
    }
    if (html.startsWith("<!", lt) || html.startsWith("<?", lt)) {
      const end = html.indexOf(">", lt + 2);
      i = end === -1 ? len : end + 1;
      continue;
    }

    const gt = html.indexOf(">", lt + 1);
    if (gt === -1) {
      tokens.push({ type: "text", value: html.slice(lt) });
      break;
    }

    const raw = html.slice(lt + 1, gt).trim();
    i = gt + 1;
    if (!raw) continue;

    // Closing tag.
    if (raw.startsWith("/")) {
      const name = raw.slice(1).split(/\s+/)[0]?.toLowerCase();
      if (name) tokens.push({ type: "close", name });
      continue;
    }

    // Opening tag.
    let selfClose = false;
    let body = raw;
    if (body.endsWith("/")) {
      selfClose = true;
      body = body.slice(0, -1).trim();
    }

    const firstSpace = body.search(/\s/);
    const name = (firstSpace === -1 ? body : body.slice(0, firstSpace)).toLowerCase();
    const attrPart = firstSpace === -1 ? "" : body.slice(firstSpace + 1);

    const attrs: Record<string, string> = {};
    const attrRegex = /([a-zA-Z_:][\w:.-]*)\s*(?:=\s*("([^"]*)"|'([^']*)'|([^\s"'<>`]+)))?/g;
    let m: RegExpExecArray | null;
    while ((m = attrRegex.exec(attrPart)) !== null) {
      const k = m[1].toLowerCase();
      const v = m[3] ?? m[4] ?? m[5] ?? "";
      attrs[k] = v;
    }

    tokens.push({ type: "open", name, attrs, selfClose });
  }
  return tokens;
}

/**
 * Sanitize a string of HTML, keeping only an allow-list of tags and
 * attributes. Returns a clean HTML string safe for `dangerouslySetInnerHTML`.
 */
export function sanitizeHtml(input: unknown): string {
  if (typeof input !== "string") return "";
  const trimmed = input.trim();
  if (!trimmed) return "";

  const tokens = tokenize(trimmed);
  const out: string[] = [];
  const openStack: string[] = [];

  for (const t of tokens) {
    if (t.type === "text") {
      out.push(escapeText(t.value));
      continue;
    }
    if (t.type === "open") {
      // Drop dangerous tags entirely — and skip any text inside <script>/<style>
      // by simply not opening them; the matching close is also dropped below.
      if (!ALLOWED_TAGS.has(t.name)) continue;

      const attrAllow = ALLOWED_ATTRS[t.name] ?? new Set<string>();
      const attrParts: string[] = [];
      for (const [k, v] of Object.entries(t.attrs)) {
        if (k.startsWith("on")) continue;
        if (!attrAllow.has(k)) continue;

        if (k === "href") {
          if (!ALLOWED_PROTOCOLS.test(v.trim())) continue;
        }
        attrParts.push(`${k}="${escapeAttr(v)}"`);
      }

      // Force safe defaults for links opened in a new tab.
      if (t.name === "a") {
        const hasTarget = attrParts.some((s) => s.startsWith("target="));
        if (hasTarget) attrParts.push('rel="noopener noreferrer"');
      }

      const open = `<${t.name}${attrParts.length ? " " + attrParts.join(" ") : ""}${
        VOID_TAGS.has(t.name) || t.selfClose ? " /" : ""
      }>`;
      out.push(open);

      if (!VOID_TAGS.has(t.name) && !t.selfClose) {
        openStack.push(t.name);
      }
      continue;
    }
    if (t.type === "close") {
      if (!ALLOWED_TAGS.has(t.name)) continue;
      // Pop any unclosed allowed tags below this one to keep nesting valid.
      const idx = openStack.lastIndexOf(t.name);
      if (idx === -1) continue;
      while (openStack.length - 1 > idx) {
        const top = openStack.pop()!;
        out.push(`</${top}>`);
      }
      openStack.pop();
      out.push(`</${t.name}>`);
    }
  }

  // Auto-close anything still open at EOF.
  while (openStack.length) {
    out.push(`</${openStack.pop()!}>`);
  }

  return out.join("").trim();
}

/** True when the sanitized HTML carries no visible content. */
export function isEmptyHtml(html: string): boolean {
  if (!html) return true;
  const stripped = html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, "")
    .trim();
  return stripped.length === 0;
}
