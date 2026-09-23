import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { Card, Panel } from "./ui";

const formatDate = (value) => new Date(`${value}${value.endsWith("Z") ? "" : "Z"}`).toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" });

export default function MessagesPanel({ onCountChange }) {
  const [messages, setMessages] = useState(null);
  const [error, setError] = useState("");

  const load = () =>
    api("/admin/messages")
      .then((rows) => {
        setMessages(rows);
        onCountChange?.(rows.filter((m) => !m.read_at).length);
      })
      .catch((e) => setError(e.message));

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleRead = async (message) => {
    await api(`/admin/messages/${message.id}`, { method: "PATCH", body: { read: !message.read_at } });
    load();
  };
  const remove = async (message) => {
    if (!window.confirm(`Supprimer le message de ${message.first_name} ${message.last_name} ?`)) return;
    await api(`/admin/messages/${message.id}`, { method: "DELETE" });
    load();
  };

  return (
    <Panel title="Messages" description="Messages envoyés depuis le formulaire de contact.">
      {error && <p className="text-red-400">{error}</p>}
      {messages?.length === 0 && <Card>Aucun message pour l'instant.</Card>}
      <ul className="flex flex-col gap-4">
        {messages?.map((message) => (
          <li key={message.id}>
            <Card className={message.read_at ? "opacity-70" : "border-accent/40"}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-white">
                    {!message.read_at && <span className="mr-2 inline-block h-2 w-2 rounded-full bg-accent" aria-label="Non lu" />}
                    {message.first_name} {message.last_name} · <span className="font-normal text-slate-300">{message.subject}</span>
                  </p>
                  <p className="text-sm text-slate-400">
                    <a className="text-accent underline" href={`mailto:${message.email}?subject=${encodeURIComponent(`Re: ${message.subject}`)}`}>
                      {message.email}
                    </a>
                    {message.phone && ` · ${message.phone}`} · {formatDate(message.created_at)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button type="button" className="btn-ghost cursor-pointer px-3 py-1.5 text-sm" onClick={() => toggleRead(message)}>
                    {message.read_at ? "Marquer non lu" : "Marquer lu"}
                  </button>
                  <button type="button" className="btn-ghost cursor-pointer px-3 py-1.5 text-sm hover:border-red-400" onClick={() => remove(message)}>
                    Supprimer
                  </button>
                </div>
              </div>
              <p className="mt-4 whitespace-pre-wrap text-slate-200">{message.message}</p>
            </Card>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
