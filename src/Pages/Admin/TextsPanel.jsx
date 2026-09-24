import { useState } from "react";
import { Card, Field, Panel, SaveBar, useContentSaver } from "./ui";
import RichTextEditor from "./RichTextEditor";

// [label, kind]: "line" = one line, "text" = paragraph, "rich" = paragraph with bold/italic/links.
const LABELS = {
  "hero.status": ["Badge de disponibilité", "line"],
  "hero.role.dev": ["Rôle affiché (profil Dev)", "line"],
  "hero.role.data": ["Rôle affiché (profil Data)", "line"],
  "hero.pitch.dev": ["Accroche (profil Dev)", "text"],
  "hero.pitch.data": ["Accroche (profil Data)", "text"],
  "hero.description_continued": ["Phrase sur la formation", "rich"],
  "about.description1": ["À propos – paragraphe 1", "rich"],
  "about.description2": ["À propos – paragraphe 2", "rich"],
  "contact.description": ["Texte de la section Contact", "text"],
};

export default function TextsPanel({ content }) {
  const [texts, setTexts] = useState(content.texts);
  const [status, save] = useContentSaver("texts");
  const setText = (lang, key, value) => setTexts((current) => ({ ...current, [lang]: { ...current[lang], [key]: value } }));

  return (
    <Panel
      title="Textes"
      description="Textes principaux du site, en français et en anglais. Sélectionnez des mots avec la souris pour les mettre en valeur (couleur du site) ou en faire un lien (cliquez sur « Lien », puis collez l'adresse de la page)."
    >
      {Object.entries(LABELS).map(([key, [label, kind]]) => (
        <Card key={key} className="grid gap-4 md:grid-cols-2">
          {["fr", "en"].map((lang) => {
            const fieldLabel = `${label} · ${lang === "fr" ? "Français" : "Anglais"}`;
            return kind === "rich" ? (
              <RichTextEditor key={lang} label={fieldLabel} value={texts[lang]?.[key]} onChange={(v) => setText(lang, key, v)} />
            ) : (
              <Field
                key={lang}
                label={fieldLabel}
                multiline={kind === "text"}
                rows={4}
                value={texts[lang]?.[key]}
                onChange={(v) => setText(lang, key, v)}
              />
            );
          })}
        </Card>
      ))}
      <SaveBar status={status} onSave={() => save(texts)} />
    </Panel>
  );
}
