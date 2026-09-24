import { useState } from "react";
import { Card, Panel, SaveBar, uploadFile, useContentSaver } from "./ui";

const PROFILES = [
  ["dev", "Développeur web"],
  ["data", "Data Analyst"],
];
const LANGS = [
  ["fr", "Français"],
  ["en", "Anglais"],
];

export default function CvPanel({ content }) {
  const [cv, setCv] = useState(content.cv);
  const [status, save] = useContentSaver("cv");
  const [uploading, setUploading] = useState("");
  const [error, setError] = useState("");

  const onFile = async (profile, lang, file) => {
    if (!file) return;
    setError("");
    setUploading(`${profile}-${lang}`);
    try {
      const uploaded = await uploadFile(file, "cv");
      setCv((current) => ({ ...current, [profile]: { ...current[profile], [lang]: uploaded.id } }));
    } catch (e) {
      setError(e.message);
    } finally {
      setUploading("");
    }
  };

  return (
    <Panel title="CV" description="Téléversez vos CV en PDF (10 Mo max). Ils sont stockés sur votre VPS et proposés aux visiteurs depuis le bouton « Voir mon CV ».">
      {error && <p className="text-red-400">{error}</p>}
      <div className="grid gap-4 md:grid-cols-2">
        {PROFILES.map(([profile, profileLabel]) => (
          <Card key={profile} className="flex flex-col gap-4">
            <h2 className="font-semibold text-white">{profileLabel}</h2>
            {LANGS.map(([lang, langLabel]) => {
              const file = cv[profile][lang];
              const inputId = `cv-${profile}-${lang}`;
              return (
                <div key={lang} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line p-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-200">{langLabel}</p>
                    {file ? (
                      <a className="text-sm text-accent underline" href={`/uploads/${file}`} target="_blank" rel="noreferrer">
                        Voir le PDF
                      </a>
                    ) : (
                      <p className="text-sm text-slate-500">Aucun fichier</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <label htmlFor={inputId} className="btn-ghost cursor-pointer px-3 py-1.5 text-sm">
                      {uploading === `${profile}-${lang}` ? "Envoi…" : file ? "Remplacer" : "Téléverser"}
                    </label>
                    <input id={inputId} type="file" accept="application/pdf" className="sr-only" onChange={(e) => onFile(profile, lang, e.target.files?.[0])} />
                    {file && (
                      <button
                        type="button"
                        className="btn-ghost cursor-pointer px-3 py-1.5 text-sm hover:border-red-400"
                        onClick={() => setCv((current) => ({ ...current, [profile]: { ...current[profile], [lang]: null } }))}
                      >
                        Retirer
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </Card>
        ))}
      </div>
      <p className="text-sm text-slate-400">Sans aucun CV, le bouton renvoie vers le lien de secours défini dans « Liens & images ».</p>
      <SaveBar status={status} onSave={() => save(cv)} />
    </Panel>
  );
}
