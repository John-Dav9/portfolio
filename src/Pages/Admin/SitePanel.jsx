import { useState } from "react";
import { BilingualField, Card, Field, ImageField, Panel, SaveBar, useContentSaver } from "./ui";

const SOCIALS = [
  ["linkedin", "LinkedIn"],
  ["github", "GitHub"],
  ["facebook", "Facebook"],
  ["instagram", "Instagram"],
  ["twitter", "X (Twitter)"],
];

export default function SitePanel({ content }) {
  const [site, setSite] = useState(content.site);
  const [status, save] = useContentSaver("site");
  const update = (section, patch) => setSite((current) => ({ ...current, [section]: { ...current[section], ...patch } }));

  return (
    <Panel title="Liens & images" description="Photos, liens des réseaux sociaux (laisser vide pour masquer une icône) et informations générales.">
      <Card className="flex flex-col gap-4">
        <h2 className="font-semibold text-white">Photos</h2>
        <ImageField label="Photo de l'accueil" value={site.hero.imageUrl} onChange={(imageUrl) => update("hero", { imageUrl })} />
        <ImageField label="Photo « À propos »" value={site.about.imageUrl} onChange={(imageUrl) => update("about", { imageUrl })} />
      </Card>
      <Card className="flex flex-col gap-4">
        <h2 className="font-semibold text-white">Réseaux sociaux</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {SOCIALS.map(([key, label]) => (
            <Field key={key} label={label} placeholder="https://" value={site.socialLinks[key]} onChange={(v) => update("socialLinks", { [key]: v })} />
          ))}
        </div>
        <Field label="Profil GitHub (bouton « Mon GitHub »)" value={site.githubUrl} onChange={(githubUrl) => setSite({ ...site, githubUrl })} />
      </Card>
      <Card className="flex flex-col gap-4">
        <h2 className="font-semibold text-white">Accueil</h2>
        <BilingualField label="Complément du titre" value={site.hero.subtitleSuffix} onChange={(subtitleSuffix) => update("hero", { subtitleSuffix })} />
        <Field
          label="Lien de secours du bouton CV"
          hint="Utilisé seulement si aucun CV n'est téléversé."
          value={site.hero.ctaUrl}
          onChange={(ctaUrl) => update("hero", { ctaUrl })}
        />
      </Card>
      <Card className="flex flex-col gap-4">
        <h2 className="font-semibold text-white">Site et mentions légales</h2>
        <Field label="URL publique" value={site.siteUrl} onChange={(siteUrl) => setSite({ ...site, siteUrl })} />
        <Field label="Nom de l'éditeur" value={site.owner.name} onChange={(name) => update("owner", { name })} />
        <div className="grid gap-3 md:grid-cols-3">
          <Field label="Hébergeur" value={site.hosting.name} onChange={(name) => update("hosting", { name })} />
          <Field label="Adresse de l'hébergeur" value={site.hosting.address} onChange={(address) => update("hosting", { address })} />
          <Field label="Site de l'hébergeur" value={site.hosting.website} onChange={(website) => update("hosting", { website })} />
        </div>
      </Card>
      <SaveBar status={status} onSave={() => save(site)} />
    </Panel>
  );
}
