import { useEffect, useId, useRef, useState } from "react";
import { sanitizeRichText } from "../../utils/richText";

// Accepts what people actually type: "lewagon.com", "https://…", "/page", "nom@mail.com".
export function normalizeUrl(input) {
  const value = input.trim();
  if (!value) return null;
  if (/^(https?:\/\/|mailto:)/i.test(value) || /^\/(?!\/)/.test(value)) return value;
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return `mailto:${value}`;
  if (/^[\w-]+(\.[\w-]+)+(\/\S*)?$/.test(value)) return `https://${value}`;
  return null;
}

function closestLink(node, root) {
  let current = node?.nodeType === Node.TEXT_NODE ? node.parentNode : node;
  while (current && current !== root) {
    if (current.tagName === "A") return current;
    current = current.parentNode;
  }
  return null;
}

function ToolbarButton({ label, onClick, children, active = false, disabled = false }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      // Keep the text selection when the button is pressed.
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`flex h-9 min-w-9 cursor-pointer items-center justify-center gap-1.5 rounded-lg border px-2.5 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
        active ? "border-accent bg-accent/15 text-white" : "border-line text-slate-300 hover:border-accent hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

// WYSIWYG field: bold, italic and links on selected words, stored as sanitized HTML.
export default function RichTextEditor({ label, value, onChange, hint }) {
  const labelId = useId();
  const editorRef = useRef(null);
  const savedRange = useRef(null);
  const editingLink = useRef(null);
  const [linkForm, setLinkForm] = useState(null); // { url, error } while the link box is open
  const [notice, setNotice] = useState("");
  const [inLink, setInLink] = useState(false);

  // Set the content once; afterwards the DOM is the source of truth (keeps the cursor in place).
  useEffect(() => {
    if (editorRef.current) editorRef.current.innerHTML = sanitizeRichText(value || "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onSelectionChange = () => {
      const selection = document.getSelection();
      const root = editorRef.current;
      if (!root || !selection?.anchorNode || !root.contains(selection.anchorNode)) return;
      setInLink(Boolean(closestLink(selection.anchorNode, root)));
    };
    document.addEventListener("selectionchange", onSelectionChange);
    return () => document.removeEventListener("selectionchange", onSelectionChange);
  }, []);

  const emit = () => onChange(sanitizeRichText(editorRef.current.innerHTML));

  const format = (command) => {
    editorRef.current.focus();
    document.execCommand(command);
    emit();
  };

  const openLinkForm = () => {
    const root = editorRef.current;
    const selection = document.getSelection();
    if (!selection?.rangeCount || !root.contains(selection.anchorNode)) {
      setNotice("Cliquez d'abord dans le texte, puis sélectionnez les mots à transformer en lien.");
      return;
    }
    const link = closestLink(selection.anchorNode, root);
    if (!link && selection.isCollapsed) {
      setNotice("Sélectionnez d'abord le ou les mots à transformer en lien (en les surlignant avec la souris).");
      return;
    }
    setNotice("");
    savedRange.current = selection.getRangeAt(0).cloneRange();
    editingLink.current = link;
    setLinkForm({ url: link?.getAttribute("href") ?? "", error: "" });
  };

  const applyLink = (e) => {
    e.preventDefault();
    const url = normalizeUrl(linkForm.url);
    if (!url) {
      setLinkForm({ ...linkForm, error: "Adresse non valide. Exemple : https://www.lewagon.com ou lewagon.com" });
      return;
    }
    const root = editorRef.current;
    root.focus();
    if (editingLink.current && root.contains(editingLink.current)) {
      editingLink.current.setAttribute("href", url);
    } else if (savedRange.current) {
      const selection = document.getSelection();
      selection.removeAllRanges();
      selection.addRange(savedRange.current);
      document.execCommand("createLink", false, url);
    }
    setLinkForm(null);
    emit();
  };

  const removeLink = () => {
    const root = editorRef.current;
    const selection = document.getSelection();
    const link = selection?.anchorNode && closestLink(selection.anchorNode, root);
    if (!link) return;
    link.replaceWith(...link.childNodes);
    setInLink(false);
    emit();
  };

  const onKeyDown = (e) => {
    // A new line stays a simple line break (no blocks the site would not display).
    if (e.key === "Enter") {
      e.preventDefault();
      document.execCommand("insertLineBreak");
    }
  };

  // Pasted text arrives without its original formatting (fonts, colors, styles).
  const onPaste = (e) => {
    e.preventDefault();
    document.execCommand("insertText", false, e.clipboardData.getData("text/plain"));
  };

  return (
    <div className="flex flex-col gap-1.5">
      <span id={labelId} className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
        {label}
      </span>
      <div className="rounded-xl border border-line bg-ink focus-within:border-accent">
        <div className="flex flex-wrap items-center gap-2 border-b border-line p-2" role="toolbar" aria-label={`Mise en forme : ${label}`}>
          <ToolbarButton label="Gras" onClick={() => format("bold")}>
            <strong>G</strong>
          </ToolbarButton>
          <ToolbarButton label="Italique" onClick={() => format("italic")}>
            <em className="font-serif">I</em>
          </ToolbarButton>
          <ToolbarButton label={inLink ? "Modifier le lien" : "Ajouter un lien"} onClick={openLinkForm} active={inLink}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1.5 1.5" />
              <path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1.5-1.5" />
            </svg>
            <span>{inLink ? "Modifier le lien" : "Lien"}</span>
          </ToolbarButton>
          {inLink && (
            <ToolbarButton label="Retirer le lien" onClick={removeLink}>
              Retirer le lien
            </ToolbarButton>
          )}
        </div>

        {linkForm && (
          <form onSubmit={applyLink} className="flex flex-col gap-2 border-b border-line bg-panel p-3">
            <label className="flex flex-col gap-1.5 text-sm text-slate-300">
              Adresse du lien (collez l'adresse de la page)
              <input
                autoFocus
                className="field text-sm"
                placeholder="https://www.exemple.com"
                value={linkForm.url}
                onChange={(e) => setLinkForm({ url: e.target.value, error: "" })}
                onKeyDown={(e) => e.key === "Escape" && setLinkForm(null)}
              />
            </label>
            {linkForm.error && <p className="text-sm text-red-400">{linkForm.error}</p>}
            <div className="flex gap-2">
              <button type="submit" className="btn-primary cursor-pointer px-4 py-2 text-sm">
                Appliquer
              </button>
              <button type="button" className="btn-ghost cursor-pointer px-4 py-2 text-sm" onClick={() => setLinkForm(null)}>
                Annuler
              </button>
            </div>
          </form>
        )}

        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          role="textbox"
          aria-multiline="true"
          aria-labelledby={labelId}
          onInput={emit}
          onKeyDown={onKeyDown}
          onPaste={onPaste}
          onFocus={() => setNotice("")}
          className="rich min-h-28 px-4 py-3 text-sm leading-relaxed text-slate-100 outline-none [&_a]:cursor-text"
        />
      </div>
      {notice && (
        <p className="text-sm text-amber-300" role="status">
          {notice}
        </p>
      )}
      {hint && <span className="text-xs text-slate-500">{hint}</span>}
    </div>
  );
}
