import { useState } from "react";
import { Card, Field, Panel, SaveBar, useContentSaver } from "./ui";

const LABELS = {
  "hero.status": ["Badge de disponibilité", false],
  "hero.role.dev": ["Rôle affiché (profil Dev)", false],
  "hero.role.data": ["Rôle affiché (profil Data)", false],
  "hero.pitch.dev": ["Accroche (profil Dev)", true],
  "hero.pitch.data": ["Accroche (profil Data)", true],
  "hero.description_continued": ["Phrase sur la formation (liens HTML autorisés)", true],
  "about.description1": ["À propos – paragraphe 1 (liens HTML autorisés)", true],
  "about.description2": ["À propos – paragraphe 2 (liens HTML autorisés)", true],
  "contact.description": ["Texte de la section Contact", true],
};

export default function TextsPanel({ content }) {
  const [texts, setTexts] = useState(content.texts);
  const [status, save] = useContentSaver("texts");
  const setText = (lang, key, value) => setTexts((current) => ({ ...current, [lang]: { ...current[lang], [key]: value } }));

  return (
    <Panel
      title="Textes"
      description={'Textes principaux du site en français et en anglais. Pour un lien : <a href="https://exemple.com">texte</a>.'}
    >
      {Object.entries(LABELS).map(([key, [label, multiline]]) => (
        <Card key={key} className="grid gap-3 md:grid-cols-2">
          <Field label={`${label} · FR`} multiline={multiline} rows={4} value={texts.fr?.[key]} onChange={(v) => setText("fr", key, v)} />
          <Field label={`${label} · EN`} multiline={multiline} rows={4} value={texts.en?.[key]} onChange={(v) => setText("en", key, v)} />
        </Card>
      ))}
      <SaveBar status={status} onSave={() => save(texts)} />
    </Panel>
  );
}
