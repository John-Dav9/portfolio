# Portfolio – John David Tchomgui

Portfolio statique et bilingue (français/anglais) : React 19, Vite, React Router, i18next et formulaire de contact EmailJS. Aucun backend ni base de données.

## Développement

Node.js >= 22.12 (24 recommandé).

```sh
npm ci
npm run dev        # serveur de développement
npm test           # tests Vitest
npm run lint       # ESLint
npm run build      # build de production dans build/
npm run preview    # prévisualisation du build
```

## Modifier les contenus

| Fichier | Contenu |
|---|---|
| `src/data/index.json` | Compétences, projets (`domain`: `dev` ou `data`, `repo`, `site`) et témoignages, au format `{ "fr": ..., "en": ... }` |
| `src/data/site.json` | URL publique (`siteUrl`), images d'accueil, liens CV, réseaux sociaux (vide = masqué), hébergeur, identifiants EmailJS |
| `src/locales/fr.json`, `en.json` | Textes de l'interface. `hero.description_continued` et `about.*` acceptent des liens HTML (nettoyés par `src/utils/richText.jsx`) |
| `src/Pages/Legal/content.js` | Mentions légales, confidentialité, conditions, cookies |
| `public/img/` | Images au format WebP (≈ 800 px de large pour les vignettes, 1200 px pour les projets) |

Les tests (`src/__tests__/content.test.js`) vérifient que chaque contenu existe dans les deux langues et que les images référencées existent.

**URL publique** : renseigner `siteUrl` dans `site.json` (ou la variable `SITE_URL` au build) pour générer le canonical, les URL Open Graph absolues et `sitemap.xml`.

**EmailJS** : les identifiants sont publics par nature. Restreindre les domaines autorisés dans le tableau de bord EmailJS. Les variables `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID` et `VITE_EMAILJS_PUBLIC_KEY` remplacent les valeurs de `site.json`. Voir `EMAILJS_SETUP.md`.

## Docker et déploiement

```sh
docker build -t portfolio .
docker run --rm -p 4001:80 portfolio
```

L'image sert le build avec nginx (`nginx.conf` : fallback SPA, gzip, cache long sur `/assets/`, en-têtes de sécurité et CSP). Si un nouveau service externe est ajouté (analytics, iframe…), mettre à jour la `Content-Security-Policy`.

Le workflow `.github/workflows/deploy-vps.yml` lance lint, tests et build sur chaque push et pull request, puis, seulement si tout passe sur `master`, se connecte au VPS en SSH et exécute `docker compose --project-name portfolio_jd up -d --build` dans le dossier du dépôt. Le réseau Docker externe `mon-reseau` doit exister sur le serveur.
