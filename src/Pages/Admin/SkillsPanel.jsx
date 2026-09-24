import { useState } from "react";
import { BilingualField, Card, Field, ListItemActions, moveItem, Panel, SaveBar, SelectField, useContentSaver } from "./ui";

const EMPTY_SKILL = { id: "", focus: "dev", tag: "", title: { fr: "", en: "" }, tools: "", description: { fr: "", en: "" } };

export default function SkillsPanel({ content }) {
  const [skills, setSkills] = useState(content.skills);
  const [status, save] = useContentSaver("skills");
  const update = (index, patch) => setSkills((list) => list.map((item, i) => (i === index ? { ...item, ...patch } : item)));

  return (
    <Panel
      title="Compétences"
      description="L'ordre compte : sur grand écran, les cartes 1, 2, 7 et 8 sont larges."
      actions={
        <button type="button" className="btn-ghost cursor-pointer" onClick={() => setSkills([...skills, { ...EMPTY_SKILL, id: `skill-${skills.length + 1}` }])}>
          + Ajouter
        </button>
      }
    >
      {skills.map((skill, index) => (
        <Card key={index} className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-semibold text-white">
              {index + 1}. {skill.title.fr || "Nouvelle compétence"}
            </h2>
            <ListItemActions index={index} count={skills.length} onMove={(a, b) => setSkills(moveItem(skills, a, b))} onRemove={(i) => setSkills(skills.filter((_, j) => j !== i))} />
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="Identifiant" value={skill.id} onChange={(id) => update(index, { id })} hint="minuscules, chiffres, tirets" />
            <SelectField
              label="Profil"
              value={skill.focus}
              onChange={(focus) => update(index, { focus })}
              options={[
                ["dev", "Dev"],
                ["data", "Data"],
                ["both", "Les deux"],
              ]}
            />
            <Field label="Étiquette (style code)" value={skill.tag} onChange={(tag) => update(index, { tag })} />
          </div>
          <BilingualField label="Titre" value={skill.title} onChange={(title) => update(index, { title })} />
          <Field label="Outils (affichés sur la carte)" value={skill.tools} onChange={(tools) => update(index, { tools })} />
          <BilingualField label="Description (fenêtre de détail)" multiline value={skill.description} onChange={(description) => update(index, { description })} />
        </Card>
      ))}
      <SaveBar status={status} onSave={() => save(skills)} />
    </Panel>
  );
}
