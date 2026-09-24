import { useState } from "react";
import { BilingualField, Card, Field, ImageField, ListItemActions, moveItem, Panel, SaveBar, SelectField, useContentSaver, withIds } from "./ui";

const EMPTY_PROJECT = { id: "", isNew: true, domain: "dev", src: "", title: { fr: "", en: "" }, description: { fr: "", en: "" }, repo: "", site: "" };

export default function ProjectsPanel({ content }) {
  const [projects, setProjects] = useState(content.projects);
  const [status, save] = useContentSaver("projects");
  const update = (index, patch) => setProjects((list) => list.map((item, i) => (i === index ? { ...item, ...patch } : item)));

  return (
    <Panel
      title="Projets"
      actions={
        <button
          type="button"
          className="btn-ghost cursor-pointer"
          onClick={() => setProjects([...projects, { ...EMPTY_PROJECT }])}
        >
          + Ajouter
        </button>
      }
    >
      {projects.map((project, index) => (
        <Card key={index} className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-semibold text-white">
              {index + 1}. {project.title.fr || "Nouveau projet"}
            </h2>
            <ListItemActions
              index={index}
              count={projects.length}
              onMove={(a, b) => setProjects(moveItem(projects, a, b))}
              onRemove={(i) => setProjects(projects.filter((_, j) => j !== i))}
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <SelectField
              label="Domaine"
              value={project.domain}
              onChange={(domain) => update(index, { domain })}
              options={[
                ["dev", "Développement web"],
                ["data", "Data"],
              ]}
            />
          </div>
          <BilingualField label="Titre" value={project.title} onChange={(title) => update(index, { title })} />
          <BilingualField label="Description" multiline value={project.description} onChange={(description) => update(index, { description })} />
          <ImageField label="Image (capture d'écran du projet)" value={project.src} onChange={(src) => update(index, { src })} />
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Lien vers le code (GitHub), facultatif" placeholder="https://github.com/…" value={project.repo} onChange={(repo) => update(index, { repo })} />
            <Field label="Lien vers le site en ligne, facultatif" placeholder="https://…" value={project.site} onChange={(site) => update(index, { site })} />
          </div>
        </Card>
      ))}
      <SaveBar status={status} onSave={() => { const saved = withIds(projects); setProjects(saved); save(saved); }} />
    </Panel>
  );
}
