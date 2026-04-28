"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/cn";

const ALLOWED_TAGS = new Set([
  "P",
  "BR",
  "STRONG",
  "B",
  "EM",
  "I",
  "U",
  "S",
  "DEL",
  "MARK",
  "H1",
  "H2",
  "H3",
  "H4",
  "UL",
  "OL",
  "LI",
  "BLOCKQUOTE",
  "A",
  "CODE",
  "PRE",
  "HR",
  "SPAN",
  "DIV",
]);

/**
 * Walk a DOM tree and strip everything that's not on the allow-list.
 * Used at paste time to scrub Word/Docs HTML before it lands in the editor.
 */
function cleanNode(node: Node) {
  const children = Array.from(node.childNodes);
  for (const child of children) {
    if (child.nodeType === Node.ELEMENT_NODE) {
      const el = child as Element;
      const tag = el.tagName.toUpperCase();

      if (!ALLOWED_TAGS.has(tag)) {
        // Replace non-allowed elements with their text/children inline.
        const replacement = document.createDocumentFragment();
        for (const sub of Array.from(el.childNodes)) replacement.appendChild(sub);
        el.replaceWith(replacement);
        cleanNode(replacement);
        continue;
      }

      // Strip every attribute except a tiny allow-list per tag.
      for (const attr of Array.from(el.attributes)) {
        const name = attr.name.toLowerCase();
        const keep =
          (tag === "A" && (name === "href" || name === "title")) ||
          name === "id";
        if (!keep) el.removeAttribute(attr.name);
      }

      if (tag === "A") {
        const a = el as HTMLAnchorElement;
        const href = a.getAttribute("href") ?? "";
        if (!/^(https?:|mailto:|tel:|#|\/)/i.test(href)) {
          a.removeAttribute("href");
        } else {
          a.setAttribute("target", "_blank");
          a.setAttribute("rel", "noopener noreferrer");
        }
      }

      cleanNode(el);
    } else if (child.nodeType !== Node.TEXT_NODE) {
      child.parentNode?.removeChild(child);
    }
  }
}

function cleanPastedHtml(html: string): string {
  // Strip everything before the actual body Word/Docs gives us.
  const parser = new DOMParser();
  const doc = parser.parseFromString(`<div>${html}</div>`, "text/html");
  const root = doc.body.firstElementChild;
  if (!root) return "";

  // Remove style/script blocks completely.
  for (const tag of ["style", "script", "meta", "link", "title"]) {
    for (const el of Array.from(root.getElementsByTagName(tag))) el.remove();
  }
  cleanNode(root);

  // Collapse runs of empty paragraphs.
  return root.innerHTML.replace(/<p>\s*(<br\s*\/?>)?\s*<\/p>/gi, "");
}

type Cmd = {
  id: string;
  label: string;
  hint: string;
  exec: (editor: HTMLDivElement) => void;
  isActive?: () => boolean;
  icon: React.ReactNode;
};

function exec(cmd: string, value?: string) {
  // execCommand is "deprecated" but is still the most reliable way to do
  // contentEditable formatting across all browsers in 2025/26.
  document.execCommand(cmd, false, value);
}

export function RichTextEditor({
  value,
  onChange,
  placeholder,
  minHeight = 180,
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
}) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [, setActiveTick] = useState(0);

  // Keep the DOM in sync when `value` changes externally (e.g. when switching
  // between products in the admin form). We avoid clobbering the DOM during
  // active typing — only sync when the editor is unfocused.
  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    if (document.activeElement === el) return;
    if (el.innerHTML !== value) el.innerHTML = value || "";
  }, [value]);

  const fireChange = () => {
    const el = editorRef.current;
    if (!el) return;
    const html = el.innerHTML.trim();
    onChange(html === "<br>" ? "" : html);
  };

  const isCmdActive = (name: string) => {
    if (typeof document === "undefined") return false;
    try {
      return document.queryCommandState(name);
    } catch {
      return false;
    }
  };

  const isBlock = (tag: string) => {
    if (typeof document === "undefined") return false;
    try {
      const v = document.queryCommandValue("formatBlock");
      return typeof v === "string" && v.toLowerCase() === tag.toLowerCase();
    } catch {
      return false;
    }
  };

  const commands: Cmd[] = [
    {
      id: "bold",
      label: "Bold",
      hint: "Bold (Ctrl/Cmd+B)",
      exec: () => exec("bold"),
      isActive: () => isCmdActive("bold"),
      icon: <span className="font-extrabold">B</span>,
    },
    {
      id: "italic",
      label: "Italic",
      hint: "Italic (Ctrl/Cmd+I)",
      exec: () => exec("italic"),
      isActive: () => isCmdActive("italic"),
      icon: <span className="italic">I</span>,
    },
    {
      id: "underline",
      label: "Underline",
      hint: "Underline (Ctrl/Cmd+U)",
      exec: () => exec("underline"),
      isActive: () => isCmdActive("underline"),
      icon: <span className="underline">U</span>,
    },
    {
      id: "strike",
      label: "Strikethrough",
      hint: "Strikethrough",
      exec: () => exec("strikethrough"),
      isActive: () => isCmdActive("strikethrough"),
      icon: <span className="line-through">S</span>,
    },
    {
      id: "h2",
      label: "Heading",
      hint: "Section heading",
      exec: () => exec("formatBlock", "<h2>"),
      isActive: () => isBlock("h2"),
      icon: <span className="text-[13px] font-bold tracking-tight">H2</span>,
    },
    {
      id: "h3",
      label: "Subheading",
      hint: "Sub heading",
      exec: () => exec("formatBlock", "<h3>"),
      isActive: () => isBlock("h3"),
      icon: <span className="text-[12px] font-bold tracking-tight">H3</span>,
    },
    {
      id: "p",
      label: "Paragraph",
      hint: "Paragraph",
      exec: () => exec("formatBlock", "<p>"),
      isActive: () => isBlock("p"),
      icon: <span className="text-[12px] font-semibold">P</span>,
    },
    {
      id: "ul",
      label: "Bulleted list",
      hint: "Bulleted list",
      exec: () => exec("insertUnorderedList"),
      isActive: () => isCmdActive("insertUnorderedList"),
      icon: <span className="text-base leading-none">•</span>,
    },
    {
      id: "ol",
      label: "Numbered list",
      hint: "Numbered list",
      exec: () => exec("insertOrderedList"),
      isActive: () => isCmdActive("insertOrderedList"),
      icon: <span className="text-[11px] font-bold leading-none">1.</span>,
    },
    {
      id: "quote",
      label: "Quote",
      hint: "Block quote",
      exec: () => exec("formatBlock", "<blockquote>"),
      isActive: () => isBlock("blockquote"),
      icon: <span aria-hidden="true">“”</span>,
    },
    {
      id: "link",
      label: "Add link",
      hint: "Insert / edit link",
      exec: () => {
        const current = document.queryCommandValue("createLink");
        const href = window.prompt("Link URL", current || "https://");
        if (href === null) return;
        const trimmed = href.trim();
        if (trimmed === "") {
          exec("unlink");
        } else if (/^(https?:|mailto:|tel:|#|\/)/i.test(trimmed)) {
          exec("createLink", trimmed);
        } else {
          window.alert("Link must start with https://, http://, mailto:, /, or #");
        }
      },
      icon: (
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
          className="h-3.5 w-3.5"
        >
          <path d="M8.5 11.5a3 3 0 010-4.243l2.122-2.121a3 3 0 014.242 4.242L13.5 10.75a.75.75 0 11-1.06-1.06l1.36-1.36a1.5 1.5 0 10-2.12-2.122L9.56 8.318a1.5 1.5 0 000 2.12.75.75 0 01-1.06 1.06zm3 -3a3 3 0 010 4.243l-2.122 2.121a3 3 0 11-4.242-4.242L6.5 9.25a.75.75 0 011.06 1.06l-1.36 1.36a1.5 1.5 0 102.12 2.122l2.122-2.121a1.5 1.5 0 000-2.122.75.75 0 011.06-1.06z" />
        </svg>
      ),
    },
    {
      id: "clear",
      label: "Clear formatting",
      hint: "Clear formatting",
      exec: () => {
        exec("removeFormat");
        exec("formatBlock", "<p>");
      },
      icon: (
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
          className="h-3.5 w-3.5"
        >
          <path
            fillRule="evenodd"
            d="M14.78 4.22a.75.75 0 010 1.06l-9.5 9.5a.75.75 0 11-1.06-1.06l9.5-9.5a.75.75 0 011.06 0zm-9.5 0a.75.75 0 011.06 0l9.5 9.5a.75.75 0 11-1.06 1.06l-9.5-9.5a.75.75 0 010-1.06z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  ];

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const html = e.clipboardData.getData("text/html");
    const text = e.clipboardData.getData("text/plain");
    if (html) {
      e.preventDefault();
      const cleaned = cleanPastedHtml(html);
      exec("insertHTML", cleaned || escapeText(text));
      fireChange();
      return;
    }
    if (text) {
      e.preventDefault();
      exec("insertHTML", escapeText(text).replace(/\n/g, "<br>"));
      fireChange();
    }
  };

  const handleInput = () => {
    fireChange();
    setActiveTick((t) => t + 1);
  };

  const handleSelectionChange = () => {
    setActiveTick((t) => t + 1);
  };

  const isEmpty = !value || value === "<br>" || value.replace(/<[^>]*>/g, "").trim() === "";

  return (
    <div className="rounded-xl bg-white ring-1 ring-black/10 focus-within:ring-2 focus-within:ring-ss-primary/30">
      <div
        className="flex flex-wrap items-center gap-1 border-b border-black/5 px-1.5 py-1"
        role="toolbar"
        aria-label="Formatting"
      >
        {commands.map((c, idx) => {
          const active = c.isActive?.() ?? false;
          const isSeparator =
            c.id === "h2" || c.id === "ul" || c.id === "link" || c.id === "clear";
          return (
            <span key={c.id} className="contents">
              {idx !== 0 && isSeparator ? (
                <span
                  aria-hidden="true"
                  className="mx-0.5 h-5 w-px self-center bg-black/10"
                />
              ) : null}
              <button
                type="button"
                title={c.hint}
                aria-label={c.label}
                aria-pressed={active}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  editorRef.current?.focus();
                  c.exec(editorRef.current!);
                  fireChange();
                  setActiveTick((t) => t + 1);
                }}
                className={cn(
                  "inline-flex h-7 min-w-[28px] items-center justify-center rounded-md px-1.5 text-[12px] font-semibold text-ss-text/70 transition-colors hover:bg-ss-bg-soft/70",
                  active && "bg-ss-bg-soft text-ss-primary"
                )}
              >
                {c.icon}
              </button>
            </span>
          );
        })}
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onPaste={handlePaste}
        onKeyUp={handleSelectionChange}
        onMouseUp={handleSelectionChange}
        onBlur={fireChange}
        spellCheck
        className={cn(
          "prose-rich relative max-w-none px-3 py-3 text-sm leading-6 text-ss-text/90 outline-none",
          isEmpty && "before:absolute before:inset-x-3 before:top-3 before:pointer-events-none before:text-ss-text/35 before:content-[attr(data-placeholder)]"
        )}
        data-placeholder={placeholder ?? "Start typing or paste from Word/Docs…"}
        style={{ minHeight }}
      />
    </div>
  );
}

function escapeText(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
