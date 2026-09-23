# Portfolio – John Tchomgui

Portfolio React bilingue (français/anglais), avec React Router, i18next et un formulaire de contact EmailJS. Le site est désormais statique : aucun backend de contenu, aucune connexion administrateur et aucun stockage de messages côté site.

## Installation et développement

Node.js >= 20.19.0 et npm sont nécessaires. Utiliser npm et le fichier `package-lock.json` pour les installations reproductibles.

```sh
npm ci --legacy-peer-deps
npm start
```

Le paramètre `--legacy-peer-deps` reste nécessaire avec les contraintes actuelles de Create React App et TypeScript. Les dépendances de construction présentent encore des alertes de sécurité ; le retrait du backend ne les corrige pas.

## Modifier les contenus

- `src/locales/fr.json` et `src/locales/en.json` : textes traduits, dont le message d’accueil (`hero.description` et `hero.description_continued`). La suite du message accepte les liens HTML nettoyés par `src/utils/richText.jsx`.
- `src/data/site.json` : images d’accueil, lien du bouton CV, liens de CV par langue et réseaux sociaux.
- `src/data/index.json` : compétences, projets et témoignages publiés.
- `public/img/` : images locales.

Les anciennes routes `/admin/*` ont été retirées. Les témoignages locaux restent visibles, mais le dépôt de nouveaux avis et l’édition depuis un dashboard nécessitent un nouveau backend. Les contenus présents uniquement dans l’ancienne base distante n’ont pas été importés ; les fichiers locaux constituent le contenu affiché.

Le formulaire envoie directement le message via EmailJS. Il ne conserve plus de copie dans une base de données. Voir `EMAILJS_SETUP.md` pour la configuration du service et du modèle.

Après une modification de contenu, reconstruire puis redéployer le site.

## Compilation et prévisualisation

```sh
npm run build
npm run serve
```

Publier le contenu de `build/` sur l’hébergement statique. Le serveur doit rediriger les routes de l’application vers `index.html` ; `nginx.conf` fournit cette configuration.

## Docker et VPS

```sh
docker build -t portfolio .
docker run --rm -p 4001:80 portfolio
```

Le fichier `docker-compose.yml` existant est prévu pour un dossier parent contenant le projet dans `app/` et un réseau externe `mon-reseau`. Le workflow `.github/workflows/deploy-vps.yml` utilise cette organisation sur le VPS. Pour utiliser Compose directement à la racine du dépôt, adapter le contexte de construction à `.` et préparer le réseau.

Aucun déploiement distant n’est effectué par les commandes locales de compilation.
