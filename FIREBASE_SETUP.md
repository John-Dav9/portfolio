# 🔥 Configuration Firebase - Guide Complet

## ✅ Ce qui a été fait

1. **Installation de Firebase** ✓
   - Package `firebase` installé via npm

2. **Fichiers modifiés** ✓
   - `src/firebase.js` : Configuration Firebase (à compléter)
   - `src/Pages/Home/Testimonials.jsx` : Sauvegarde/chargement des avis
   - `src/Pages/Home/ContactMe.jsx` : Sauvegarde des messages de contact

## 📋 Étapes pour activer Firebase

### 1. Créer un projet Firebase

1. Va sur [Firebase Console](https://console.firebase.google.com/)
2. Clique sur **"Ajouter un projet"**
3. Nom du projet : `react-js-portfolio` (ou ce que tu veux)
4. Active Google Analytics (optionnel)
5. Clique sur **"Créer un projet"**

### 2. Créer une application Web

1. Dans ton projet Firebase, clique sur l'icône **Web** `</>`
2. Nom de l'app : `Portfolio`
3. **NE COCHE PAS** "Firebase Hosting" pour l'instant
4. Clique sur **"Enregistrer l'application"**

### 3. Copier la configuration

Firebase va t'afficher un code comme :

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyD-xxxxxxxxxxxxxxxxxxxxx",
  authDomain: "ton-projet.firebaseapp.com",
  projectId: "ton-projet",
  storageBucket: "ton-projet.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:xxxxxxxxxxxxxx"
};
```

**COPIE ces valeurs** et remplace-les dans `src/firebase.js` :

```javascript
// src/firebase.js
const firebaseConfig = {
  apiKey: "TA_VRAIE_API_KEY",
  authDomain: "TON_VRAIE_AUTH_DOMAIN",
  projectId: "TON_VRAI_PROJECT_ID",
  storageBucket: "TON_VRAI_STORAGE_BUCKET",
  messagingSenderId: "TON_VRAI_MESSAGING_ID",
  appId: "TON_VRAI_APP_ID"
};
```

### 4. Activer Firestore Database

1. Dans Firebase Console, va dans **"Créer une base de données"** (menu de gauche)
2. Choisis **"Firestore Database"**
3. Clique sur **"Créer une base de données"**
4. Mode : Choisis **"Commencer en mode test"** (pour développement)
   - ⚠️ Les règles de sécurité permettront la lecture/écriture pendant 30 jours
5. Région : Choisis `europe-west1` (Belgique) ou `europe-west` (proche de la France)
6. Clique sur **"Activer"**

### 5. Configurer les règles de sécurité (IMPORTANT)

Par défaut, le mode test expire après 30 jours. Pour une app en production, modifie les règles :

1. Va dans **Firestore Database** → **Règles**
2. Remplace par :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Collection des témoignages : lecture publique, écriture authentifiée
    match /testimonials/{testimonialId} {
      allow read: if true;  // Tout le monde peut lire
      allow create: if request.resource.data.author_name is string
                    && request.resource.data.description is string
                    && request.resource.data.count is string;
    }
    
    // Collection des contacts : écriture publique seulement
    match /contacts/{contactId} {
      allow create: if request.resource.data.firstName is string
                    && request.resource.data.email is string
                    && request.resource.data.message is string;
      allow read: if false;  // Personne ne peut lire (sauf via console)
    }
  }
}
```

3. Clique sur **"Publier"**

### 6. Tester l'application

1. Lance ton serveur de développement :
   ```bash
   npm start
   ```

2. **Teste les témoignages** :
   - Va sur la section "Avis"
   - Clique sur le bouton "+" pour ajouter un avis
   - Remplis le formulaire et publie
   - Refresh la page → **l'avis doit rester** ✅

3. **Teste le formulaire de contact** :
   - Remplis le formulaire de contact
   - Envoie le message
   - Va dans Firebase Console → Firestore Database
   - Tu devrais voir une collection `contacts` avec ton message ✅

### 7. Vérifier dans Firebase Console

- Va dans **Firestore Database**
- Tu devrais voir 2 collections :
  - `testimonials` : avec les avis ajoutés
  - `contacts` : avec les messages du formulaire

## 🔒 Sécurité des clés API

⚠️ **ATTENTION** : Les clés Firebase dans `firebase.js` sont **publiques** par design (côté client).

### Pour protéger ton projet :

1. **Configure les règles Firestore** (voir étape 5)
2. **Active App Check** (optionnel, pour bloquer les bots) :
   - Firebase Console → App Check
   - Active reCAPTCHA v3
3. **Limite les domaines autorisés** :
   - Firebase Console → Paramètres du projet → Restrictions de clé API
   - Ajoute ton domaine (ex: `ton-portfolio.com`)

### Variables d'environnement (recommandé)

Pour ne pas exposer les clés dans le code :

1. Crée `.env` à la racine :
```env
REACT_APP_FIREBASE_API_KEY=ta_clé
REACT_APP_FIREBASE_AUTH_DOMAIN=ton_domaine
REACT_APP_FIREBASE_PROJECT_ID=ton_id
REACT_APP_FIREBASE_STORAGE_BUCKET=ton_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=ton_sender
REACT_APP_FIREBASE_APP_ID=ton_app_id
```

2. Modifie `src/firebase.js` :
```javascript
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};
```

3. Ajoute `.env` à `.gitignore` :
```
.env
```

## 🚀 Déploiement

Quand tu déploies sur Heroku/Netlify/Vercel :
- Ajoute les variables d'environnement dans les paramètres du service
- Les règles Firestore fonctionneront automatiquement

## 📊 Fonctionnalités actuelles

### ✅ Témoignages (Testimonials)
- ✓ Lecture des avis depuis Firestore
- ✓ Ajout de nouveaux avis (persistants)
- ✓ Combinaison avis Firebase + avis statiques du JSON
- ✓ Tri par date (plus récents en premier)
- ✓ Indicateur de chargement

### ✅ Formulaire de contact
- ✓ Sauvegarde dans Firestore
- ✓ Envoi parallèle à getform.io (emails)
- ✓ Données structurées (prénom, nom, email, tél, sujet, message)

## 🎯 Prochaines étapes (optionnel)

1. **Panel d'administration** : Créer une page admin pour gérer les avis
2. **Modération** : Approuver les avis avant publication
3. **Notifications** : Email quand un nouveau message arrive
4. **Analytics** : Tracker les visites avec Firebase Analytics
5. **Authentication** : Ajouter Firebase Auth pour un espace admin

---

**Besoin d'aide ?** Reviens me voir ! 🚀
