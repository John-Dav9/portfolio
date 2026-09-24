import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { BilingualField, Card, Field, ImageField, Panel } from "./ui";

function TestimonialEditor({ item, onChanged }) {
  const [draft, setDraft] = useState({
    authorName: item.author_name,
    authorDesignation: typeof item.author_designation === "string" ? { fr: item.author_designation, en: item.author_designation } : item.author_designation,
    description: { fr: item.description.fr ?? "", en: item.description.en ?? "" },
    rating: item.rating,
    avatar: item.src ?? "",
  });
  const [message, setMessage] = useState("");

  const patch = async (body) => {
    try {
      await api(`/admin/testimonials/${item.id}`, { method: "PATCH", body });
      setMessage("Enregistré.");
      onChanged();
    } catch (error) {
      setMessage(error.message);
    }
  };
  const remove = async () => {
    if (!window.confirm(`Supprimer l'avis de ${item.author_name} ?`)) return;
    await api(`/admin/testimonials/${item.id}`, { method: "DELETE" });
    onChanged();
  };

  return (
    <Card className={item.status === "pending" ? "border-amber-400/50" : ""}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <span className={`rounded-full px-2.5 py-1 font-mono text-xs font-semibold ${item.status === "pending" ? "bg-amber-400 text-ink" : "bg-data text-ink"}`}>
          {item.status === "pending" ? "En attente" : "Publié"}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            className="btn-primary cursor-pointer px-3 py-1.5 text-sm"
            onClick={() => patch({ status: item.status === "pending" ? "approved" : "pending" })}
          >
            {item.status === "pending" ? "Publier" : "Dépublier"}
          </button>
          <button type="button" className="btn-ghost cursor-pointer px-3 py-1.5 text-sm hover:border-red-400" onClick={remove}>
            Supprimer
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="grid gap-3 md:grid-cols-[1fr_120px]">
          <Field label="Nom" value={draft.authorName} onChange={(authorName) => setDraft({ ...draft, authorName })} />
          <Field label="Note (1-5)" type="number" min={1} max={5} value={draft.rating} onChange={(v) => setDraft({ ...draft, rating: Number(v) })} />
        </div>
        <BilingualField label="Fonction" value={draft.authorDesignation} onChange={(authorDesignation) => setDraft({ ...draft, authorDesignation })} />
        <BilingualField label="Avis" multiline value={draft.description} onChange={(description) => setDraft({ ...draft, description })} hint="Traduisez l'avis pour l'autre langue (sinon le texte d'origine est affiché)." />
        <ImageField label="Avatar" value={draft.avatar} onChange={(avatar) => setDraft({ ...draft, avatar })} />
        <div className="flex items-center gap-3">
          <button type="button" className="btn-ghost cursor-pointer px-3 py-1.5 text-sm" onClick={() => patch(draft)}>
            Enregistrer les modifications
          </button>
          <span className="text-sm text-slate-400" role="status">{message}</span>
        </div>
      </div>
    </Card>
  );
}

export default function TestimonialsPanel({ onCountChange }) {
  const [items, setItems] = useState(null);
  const load = () =>
    api("/admin/testimonials").then((rows) => {
      setItems(rows);
      onCountChange?.(rows.filter((t) => t.status === "pending").length);
    });

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Panel title="Avis" description="Les avis envoyés par les visiteurs restent invisibles jusqu'à leur publication.">
      <ul className="flex flex-col gap-4">
        {items?.map((item) => (
          <li key={`${item.id}-${item.status}`}>
            <TestimonialEditor item={item} onChanged={load} />
          </li>
        ))}
      </ul>
    </Panel>
  );
}
