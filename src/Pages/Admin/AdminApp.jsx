import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";
import MessagesPanel from "./MessagesPanel";
import TestimonialsPanel from "./TestimonialsPanel";
import CvPanel from "./CvPanel";
import TextsPanel from "./TextsPanel";
import SitePanel from "./SitePanel";
import SkillsPanel from "./SkillsPanel";
import ProjectsPanel from "./ProjectsPanel";
import TimelinePanel from "./TimelinePanel";
import FilesPanel from "./FilesPanel";
import { Field } from "./ui";

const TABS = [
  { id: "messages", label: "Messages" },
  { id: "testimonials", label: "Avis" },
  { id: "cv", label: "CV" },
  { id: "texts", label: "Textes" },
  { id: "site", label: "Liens & images" },
  { id: "skills", label: "Compétences" },
  { id: "projects", label: "Projets" },
  { id: "timeline", label: "Parcours" },
  { id: "files", label: "Fichiers" },
];

function useNoIndex() {
  useEffect(() => {
    document.title = "Admin | john-d.dev";
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);
}

function Login({ onLoggedIn, enabled }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api("/admin/login", { method: "POST", body: { email, password } });
      onLoggedIn();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-5">
      <form onSubmit={submit} className="flex w-full max-w-sm flex-col gap-5 rounded-3xl border border-line bg-panel p-8">
        <p className="font-mono text-slate-100">
          john-d<span className="text-accent">.dev</span> <span className="text-slate-500">/ admin</span>
        </p>
        <h1 className="text-2xl font-bold text-white">Connexion</h1>
        {!enabled && (
          <p className="rounded-xl border border-amber-400/40 p-3 text-sm text-amber-200">
            L'espace admin n'est pas configuré : renseignez ADMIN_EMAIL et ADMIN_PASSWORD_HASH dans server/.env.
          </p>
        )}
        <Field label="E-mail" type="email" autoComplete="username" required value={email} onChange={setEmail} />
        <Field label="Mot de passe" type="password" autoComplete="current-password" required value={password} onChange={setPassword} />
        {error && <p className="text-sm text-red-400" role="alert">{error}</p>}
        <button type="submit" disabled={busy || !enabled} className="btn-primary cursor-pointer justify-center disabled:opacity-60">
          {busy ? "Connexion…" : "Se connecter"}
        </button>
        <Link to="/" className="text-center text-sm text-slate-400 hover:text-white">
          ← Retour au site
        </Link>
      </form>
    </div>
  );
}

function Dashboard({ onLoggedOut, mailEnabled }) {
  const [tab, setTab] = useState("messages");
  const [content, setContent] = useState(null);
  const [badges, setBadges] = useState({});
  const [error, setError] = useState("");

  const loadContent = useCallback(() => api("/admin/content").then(setContent).catch((e) => setError(e.message)), []);
  useEffect(() => {
    loadContent();
    api("/admin/messages").then((rows) => setBadges((b) => ({ ...b, messages: rows.filter((m) => !m.read_at).length }))).catch(() => {});
    api("/admin/testimonials").then((rows) => setBadges((b) => ({ ...b, testimonials: rows.filter((t) => t.status === "pending").length }))).catch(() => {});
  }, [loadContent]);

  const selectTab = (id) => {
    setTab(id);
    // Content editors start from what is saved on the server.
    if (!["messages", "testimonials", "files"].includes(id)) loadContent();
    window.scrollTo(0, 0);
  };

  const logout = async () => {
    await api("/admin/logout", { method: "POST" }).catch(() => {});
    onLoggedOut();
  };

  const setBadge = (id) => (count) => setBadges((b) => ({ ...b, [id]: count }));
  const panels = {
    messages: <MessagesPanel onCountChange={setBadge("messages")} />,
    testimonials: <TestimonialsPanel onCountChange={setBadge("testimonials")} />,
    files: <FilesPanel />,
    cv: content && <CvPanel content={content} />,
    texts: content && <TextsPanel content={content} />,
    site: content && <SitePanel content={content} />,
    skills: content && <SkillsPanel content={content} />,
    projects: content && <ProjectsPanel content={content} />,
    timeline: content && <TimelinePanel content={content} />,
  };

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="sticky top-0 z-40 border-b border-line bg-ink/95 backdrop-blur lg:h-screen lg:border-r lg:border-b-0">
        <div className="flex items-center justify-between gap-3 px-5 py-4 lg:flex-col lg:items-start lg:py-6">
          <p className="shrink-0 font-mono text-slate-100">
            john-d<span className="text-accent">.dev</span> <span className="hidden text-slate-500 sm:inline lg:inline">/ admin</span>
          </p>
          <label htmlFor="admin-tab" className="sr-only">Section</label>
          <select id="admin-tab" className="field max-w-[55%] py-2 text-sm lg:hidden" value={tab} onChange={(e) => selectTab(e.target.value)}>
            {TABS.map(({ id, label }) => (
              <option key={id} value={id}>
                {label}
                {badges[id] ? ` (${badges[id]})` : ""}
              </option>
            ))}
          </select>
        </div>
        <nav className="hidden px-3 lg:block" aria-label="Sections de l'admin">
          <ul className="flex flex-col gap-1">
            {TABS.map(({ id, label }) => (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => selectTab(id)}
                  aria-current={tab === id ? "page" : undefined}
                  className={`flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                    tab === id ? "bg-accent/15 text-white" : "text-slate-400 hover:bg-panel hover:text-white"
                  }`}
                >
                  {label}
                  {badges[id] > 0 && <span className="rounded-full bg-accent px-2 py-0.5 font-mono text-xs text-ink">{badges[id]}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="hidden flex-col gap-2 px-5 pt-6 text-sm lg:flex">
          <Link to="/" target="_blank" className="text-slate-400 hover:text-white">Voir le site ↗</Link>
          <button type="button" onClick={logout} className="cursor-pointer text-left text-slate-400 hover:text-white">Se déconnecter</button>
        </div>
      </aside>

      <main className="min-w-0 px-5 py-8 md:px-8">
        {!mailEnabled && (
          <p className="mb-6 rounded-xl border border-amber-400/40 p-3 text-sm text-amber-200">
            Notifications e-mail désactivées : renseignez SMTP_* dans server/.env pour être prévenu des nouveaux messages.
          </p>
        )}
        {error && <p className="mb-6 text-red-400">{error}</p>}
        <div key={tab}>{panels[tab] ?? <p className="text-slate-400">Chargement…</p>}</div>
        <div className="mt-10 flex gap-4 text-sm lg:hidden">
          <Link to="/" target="_blank" className="text-slate-400 hover:text-white">Voir le site ↗</Link>
          <button type="button" onClick={logout} className="cursor-pointer text-slate-400 hover:text-white">Se déconnecter</button>
        </div>
      </main>
    </div>
  );
}

export default function AdminApp() {
  useNoIndex();
  const [status, setStatus] = useState(null);
  const [error, setError] = useState("");

  const refresh = useCallback(
    () =>
      api("/admin/status")
        .then(setStatus)
        .catch(() => setError("API injoignable. Le service « api » tourne-t-il ?")),
    []
  );
  useEffect(() => {
    refresh();
  }, [refresh]);

  if (error) return <p className="p-8 text-red-400">{error}</p>;
  if (!status) return <p className="p-8 text-slate-400">Chargement…</p>;
  if (!status.authenticated) return <Login enabled={status.enabled} onLoggedIn={refresh} />;
  return <Dashboard mailEnabled={status.mail} onLoggedOut={refresh} />;
}
