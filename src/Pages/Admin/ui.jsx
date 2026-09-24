import { useId, useState } from "react";
import { api } from "../../services/api";

export function Panel({ title, description, actions, children }) {
  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          {description && <p className="mt-1 max-w-2xl text-sm text-slate-400">{description}</p>}
        </div>
        {actions}
      </header>
      {children}
    </section>
  );
}

export function Card({ children, className = "" }) {
  return <div className={`rounded-2xl border border-line bg-panel/80 p-5 ${className}`}>{children}</div>;
}

export function Field({ label, value, onChange, multiline = false, rows = 3, hint, ...rest }) {
  const id = useId();
  const Input = multiline ? "textarea" : "input";
  return (
    <label htmlFor={id} className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold tracking-wide text-slate-400 uppercase">{label}</span>
      <Input
        id={id}
        className={`field text-sm ${multiline ? "resize-y" : ""}`}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        rows={multiline ? rows : undefined}
        {...rest}
      />
      {hint && <span className="text-xs text-slate-500">{hint}</span>}
    </label>
  );
}

export function BilingualField({ label, value, onChange, ...rest }) {
  const current = value ?? { fr: "", en: "" };
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <Field label={`${label} (FR)`} value={current.fr} onChange={(fr) => onChange({ ...current, fr })} {...rest} />
      <Field label={`${label} (EN)`} value={current.en} onChange={(en) => onChange({ ...current, en })} {...rest} />
    </div>
  );
}

export function SelectField({ label, value, onChange, options }) {
  const id = useId();
  return (
    <label htmlFor={id} className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold tracking-wide text-slate-400 uppercase">{label}</span>
      <select id={id} className="field text-sm" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </select>
    </label>
  );
}

export async function uploadFile(file, kind) {
  const form = new FormData();
  form.append("kind", kind);
  form.append("file", file);
  return api("/admin/uploads", { method: "POST", form });
}

// Image URL with preview and an upload button (images are converted to WebP by the API).
export function ImageField({ label, value, onChange }) {
  const id = useId();
  const [state, setState] = useState({ busy: false, error: "" });

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setState({ busy: true, error: "" });
    try {
      const uploaded = await uploadFile(file, "image");
      onChange(uploaded.url);
      setState({ busy: false, error: "" });
    } catch (error) {
      setState({ busy: false, error: error.message });
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold tracking-wide text-slate-400 uppercase">{label}</span>
      <div className="flex items-center gap-3">
        {value ? (
          <img src={value} alt="" className="h-16 w-24 shrink-0 rounded-lg border border-line object-cover" />
        ) : (
          <div className="h-16 w-24 shrink-0 rounded-lg border border-dashed border-line" />
        )}
        <input className="field text-sm" value={value ?? ""} onChange={(e) => onChange(e.target.value)} aria-label={`${label} (URL)`} />
        <label htmlFor={id} className="btn-ghost shrink-0 cursor-pointer px-3 py-2 text-sm">
          {state.busy ? "Envoi…" : "Téléverser"}
        </label>
        <input id={id} type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" className="sr-only" onChange={onFile} />
      </div>
      {state.error && <span className="text-xs text-red-400">{state.error}</span>}
    </div>
  );
}

// Saves a content key and reports validation errors from the API.
export function useContentSaver(key) {
  const [status, setStatus] = useState({ state: "idle", message: "" });
  const save = async (value) => {
    setStatus({ state: "saving", message: "" });
    try {
      await api(`/admin/content/${key}`, { method: "PUT", body: value });
      setStatus({ state: "saved", message: "Enregistré. Le site public est à jour." });
    } catch (error) {
      const details = error.issues?.map((issue) => `${issue.path} : ${issue.message}`).join(" · ");
      setStatus({ state: "error", message: details ? `${error.message} ${details}` : error.message });
    }
  };
  return [status, save];
}

export function SaveBar({ status, onSave, label = "Enregistrer" }) {
  return (
    <div className="sticky bottom-0 z-10 -mx-5 flex flex-wrap items-center gap-4 border-t border-line bg-ink/90 px-5 py-4 backdrop-blur md:-mx-8 md:px-8">
      <button type="button" onClick={onSave} disabled={status.state === "saving"} className="btn-primary cursor-pointer disabled:opacity-60">
        {status.state === "saving" ? "Enregistrement…" : label}
      </button>
      <p
        role="status"
        className={`text-sm ${status.state === "error" ? "text-red-400" : status.state === "saved" ? "text-data" : "text-slate-400"}`}
      >
        {status.message}
      </p>
    </div>
  );
}

// Reorder / remove / add controls for list editors.
export function ListItemActions({ index, count, onMove, onRemove }) {
  const base = "cursor-pointer rounded-lg border border-line px-2.5 py-1.5 text-xs text-slate-300 hover:border-accent disabled:opacity-30";
  return (
    <div className="flex gap-2">
      <button type="button" className={base} disabled={index === 0} onClick={() => onMove(index, index - 1)} aria-label="Monter">
        ↑
      </button>
      <button type="button" className={base} disabled={index === count - 1} onClick={() => onMove(index, index + 1)} aria-label="Descendre">
        ↓
      </button>
      <button type="button" className={`${base} hover:border-red-400 hover:text-red-300`} onClick={() => onRemove(index)}>
        Supprimer
      </button>
    </div>
  );
}

export function moveItem(list, from, to) {
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

const slugify = (text) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 36) || "element";

// Items keep their id once saved; new items get one derived from their French title.
export function withIds(list) {
  const used = new Set();
  return list.map((item) => {
    let id = /^[a-z0-9-]{1,40}$/.test(item.id ?? "") && !used.has(item.id) && !item.isNew ? item.id : slugify(item.title?.fr || "");
    let candidate = id;
    for (let n = 2; used.has(candidate); n += 1) candidate = `${id}-${n}`;
    used.add(candidate);
    const { isNew: _isNew, ...rest } = item;
    return { ...rest, id: candidate };
  });
}
