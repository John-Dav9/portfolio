import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { Card, Panel } from "./ui";

const formatSize = (bytes) => (bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} Mo` : `${Math.round(bytes / 1024)} Ko`);

export default function FilesPanel() {
  const [files, setFiles] = useState(null);
  const [copied, setCopied] = useState("");
  const load = () => api("/admin/uploads").then(setFiles);

  useEffect(() => {
    load();
  }, []);

  const remove = async (file) => {
    if (!window.confirm(`Supprimer ${file.original_name} ? Les pages qui l'utilisent afficheront une image manquante.`)) return;
    await api(`/admin/uploads/${file.id}`, { method: "DELETE" });
    load();
  };
  const copy = async (url) => {
    await navigator.clipboard?.writeText(url);
    setCopied(url);
  };

  return (
    <Panel title="Fichiers" description="Images et PDF téléversés sur votre VPS. Les images sont converties en WebP et redimensionnées automatiquement.">
      {files?.length === 0 && <Card>Aucun fichier téléversé.</Card>}
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {files?.map((file) => (
          <li key={file.id}>
            <Card className="flex h-full flex-col gap-3">
              {file.kind === "image" ? (
                <img src={file.url} alt="" loading="lazy" className="aspect-video w-full rounded-lg object-cover" />
              ) : (
                <div className="flex aspect-video items-center justify-center rounded-lg border border-line font-mono text-slate-400">PDF</div>
              )}
              <p className="truncate text-sm text-slate-200" title={file.original_name}>
                {file.original_name}
              </p>
              <p className="text-xs text-slate-500">{formatSize(file.size)}</p>
              <div className="mt-auto flex gap-2">
                <button type="button" className="btn-ghost cursor-pointer px-3 py-1.5 text-sm" onClick={() => copy(file.url)}>
                  {copied === file.url ? "Copié ✓" : "Copier l'URL"}
                </button>
                <button type="button" className="btn-ghost cursor-pointer px-3 py-1.5 text-sm hover:border-red-400" onClick={() => remove(file)}>
                  Supprimer
                </button>
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
