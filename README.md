# Portfolio – John David Tchomgui

Portfolio bilingue (français/anglais) : React 19, Vite, Tailwind CSS v4, Motion, React Router et i18next côté site ; petite API Node.js + SQLite côté serveur. Tout est hébergé sur le VPS (Docker), sans service tiers.

- **Site public** : design « Fusion » (thème sombre, interrupteur Dev/Data). Il embarque une copie du contenu : il reste affiché même si l'API est arrêtée.
- **API** (`server/`) : contenu éditable, messages de contact, avis des visiteurs (modérés), CV et images téléversés, notifications par e-mail.
- **Admin** : `https://john-d.dev/admin` (messages, avis, CV, textes, liens et images, compétences, projets, fichiers).

## Développement

Node.js >= 22.12 (24 recommandé).

```sh
npm ci && npm ci --prefix server
npm run dev --prefix server   # API sur :3001 (base dans server/data/)
npm run dev                   # site sur :5173 (proxy /api et /uploads vers l'API)
npm test && npm test --prefix server
npm run lint
npm run build
```

Pour tester l'admin en local, créer `server/.env` à partir de `server/.env.example` (le hash se génère avec `npm run hash-password --prefix server -- "mot de passe"`).

## Modifier les contenus

En production, tout se modifie depuis **l'admin**. Au premier démarrage, l'API remplit la base avec les fichiers du dépôt :

| Fichier | Rôle |
|---|---|
| `src/data/index.json` | Compétences, projets et avis initiaux ; copie de secours affichée si l'API est indisponible |
| `src/data/site.json` | Liens, images, URL publique et hébergeur initiaux |
| `src/locales/fr.json`, `en.json` | Textes de l'interface (les textes principaux sont ensuite modifiables dans l'admin) |
| `src/Pages/Legal/content.js` | Mentions légales, confidentialité, conditions, cookies |

Ensuite, la base fait foi : modifier ces fichiers n'écrase pas ce qui a été saisi dans l'admin. Pensez à y reporter les changements importants pour que la copie de secours reste proche du site.

## Docker et déploiement

`docker-compose.yml` lance deux conteneurs :

- `portfolio` (nginx) : sert le site et relaie `/api` et `/uploads` vers l'API. Il démarre même si l'API est arrêtée ;
- `api` (Node.js) : base SQLite et fichiers téléversés dans le volume `portfolio-data` (`/data`), non exposé sur Internet.

Le workflow `.github/workflows/deploy-vps.yml` lance lint, tests (site et API) et build à chaque push, puis, si tout passe sur `master`, exécute sur le VPS `docker compose --project-name portfolio_jd up -d --build`.

### Première mise en place sur le VPS

```sh
cd /home/john_david/PORTFOLIO_JD/app
cp server/.env.example server/.env
docker compose -p portfolio_jd build api
docker compose -p portfolio_jd run --rm --no-deps api node scripts/hash-password.js "votre mot de passe"
nano server/.env   # ADMIN_EMAIL, ADMIN_PASSWORD_HASH (coller le hash), SMTP_*
docker compose -p portfolio_jd up -d --build
```

Sans `server/.env`, le site et les formulaires fonctionnent, mais l'admin et les notifications e-mail restent désactivés.

**E-mails (Gmail)** : activer la validation en deux étapes du compte Google, créer un « mot de passe d'application » (Compte Google › Sécurité › Mots de passe des applications), puis renseigner `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=465`, `SMTP_USER` (adresse), `SMTP_PASS` (mot de passe d'application) et `NOTIFY_TO`.

### Sauvegardes

La base est un simple fichier. Instantané cohérent (14 conservés) :

```sh
docker compose -p portfolio_jd exec -T api node scripts/backup.js
```

Tâche quotidienne à 3 h (`crontab -e` sur le VPS) :

```
0 3 * * * cd /home/john_david/PORTFOLIO_JD/app && docker compose -p portfolio_jd exec -T api node scripts/backup.js >/dev/null 2>&1
```

Les instantanés et les fichiers téléversés sont dans le volume Docker `portfolio_jd_portfolio-data` ; copiez-les régulièrement hors du VPS (par exemple avec `docker run --rm -v portfolio_jd_portfolio-data:/data -v "$PWD":/out alpine tar czf /out/portfolio-data.tgz /data`).

### Sécurité

- nginx : CSP stricte (aucune ressource externe), en-têtes de sécurité, cache long sur les fichiers versionnés.
- API : formulaires et admin acceptés uniquement depuis `SITE_ORIGIN`, limitation du nombre d'envois, validation de toutes les données, fichiers vérifiés par leur signature (PDF, images converties en WebP), session admin en cookie `HttpOnly` + `SameSite=Strict` + `Secure`.
