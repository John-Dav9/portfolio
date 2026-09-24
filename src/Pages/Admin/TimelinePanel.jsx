import { useState } from "react";
import { BilingualField, Card, Field, ListItemActions, moveItem, Panel, SaveBar, SelectField, useContentSaver, withIds } from "./ui";

const EMPTY_STEP = { id: "", isNew: true, period: "", title: { fr: "", en: "" }, detail: { fr: "", en: "" }, url: "", kind: "dev", current: false };

export default function TimelinePanel({ content }) {
  const [steps, setSteps] = useState(content.timeline ?? []);
  const [status, save] = useContentSaver("timeline");
  const update = (index, patch) => setSteps((list) => list.map((item, i) => (i === index ? { ...item, ...patch } : item)));

  return (
    <Panel
      title="Parcours"
      description="Étapes affichées sous la photo de la section « À propos », de la plus ancienne à la plus récente."
      actions={
        <button type="button" className="btn-ghost cursor-pointer" onClick={() => setSteps([...steps, { ...EMPTY_STEP }])}>
          + Ajouter une étape
        </button>
      }
    >
      {steps.map((step, index) => (
        <Card key={index} className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-semibold text-white">
              {step.period || "Période"} · {step.title.fr || "Nouvelle étape"}
            </h2>
            <ListItemActions index={index} count={steps.length} onMove={(a, b) => setSteps(moveItem(steps, a, b))} onRemove={(i) => setSteps(steps.filter((_, j) => j !== i))} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Période" placeholder="ex. 2024 ou 2021 – 2023" value={step.period} onChange={(period) => update(index, { period })} />
            <SelectField
              label="Couleur du point"
              value={step.kind}
              onChange={(kind) => update(index, { kind })}
              options={[
                ["dev", "Dev (cyan)"],
                ["data", "Data (vert)"],
                ["other", "Autre (gris)"],
              ]}
            />
          </div>
          <BilingualField label="Titre (école, poste…)" value={step.title} onChange={(title) => update(index, { title })} />
          <BilingualField label="Détail (facultatif)" value={step.detail} onChange={(detail) => update(index, { detail })} />
          <Field label="Lien (facultatif)" placeholder="https://…" value={step.url} onChange={(url) => update(index, { url })} />
          <label className="flex items-center gap-3 text-sm text-slate-300">
            <input type="checkbox" className="h-4 w-4 accent-[var(--accent)]" checked={Boolean(step.current)} onChange={(e) => update(index, { current: e.target.checked })} />
            Étape en cours (affiche le badge « en cours »)
          </label>
        </Card>
      ))}
      <SaveBar status={status} onSave={() => { const saved = withIds(steps); setSteps(saved); save(saved); }} />
    </Panel>
  );
}
