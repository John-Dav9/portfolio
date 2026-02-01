# 📧 Configuration EmailJS - Guide Complet

## 🎯 Objectif
Recevoir des emails professionnels et bien formatés quand quelqu'un soumet le formulaire de contact.

---

## 📝 Étape 1 : Créer un compte EmailJS

1. Va sur **https://www.emailjs.com/**
2. Clique sur **"Sign Up"** (gratuit jusqu'à 200 emails/mois)
3. Inscris-toi avec ton email (ou Gmail)
4. Vérifie ton email et active ton compte

---

## ⚙️ Étape 2 : Configurer un Service Email

1. Une fois connecté, va dans **"Email Services"**
2. Clique sur **"Add New Service"**
3. Choisis ton fournisseur d'email :
   - **Gmail** (recommandé si tu utilises Gmail)
   - **Outlook** 
   - Ou autre selon ton email
4. Connecte ton compte email
5. Note le **Service ID** (ex: `service_abc123`)

---

## 📄 Étape 3 : Créer un Template Email Professionnel

1. Va dans **"Email Templates"**
2. Clique sur **"Create New Template"**
3. Copie-colle ce template professionnel :

### Template Name: `portfolio_contact_form`

### Subject:
```
🔔 Nouveau message de {{from_name}} via votre portfolio
```

### Content (HTML):
```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <style>
        /* Reset */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            padding: 20px;
        }
        
        .email-wrapper {
            max-width: 650px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
        }
        
        /* Header avec gradient moderne */
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: -50%;
            right: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
            animation: pulse 4s ease-in-out infinite;
        }
        
        @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 0.5; }
            50% { transform: scale(1.1); opacity: 0.8; }
        }
        
        .header-content {
            position: relative;
            z-index: 1;
        }
        
        .header h1 {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 10px;
            text-shadow: 0 2px 10px rgba(0,0,0,0.2);
        }
        
        .header .emoji {
            font-size: 48px;
            display: block;
            margin-bottom: 15px;
            filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
        }
        
        .header .date {
            font-size: 14px;
            opacity: 0.95;
            font-weight: 300;
            letter-spacing: 0.5px;
        }
        
        /* Badge de notification */
        .notification-badge {
            display: inline-block;
            background: rgba(255, 255, 255, 0.25);
            backdrop-filter: blur(10px);
            padding: 8px 20px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 600;
            margin-top: 10px;
            border: 1px solid rgba(255,255,255,0.3);
        }
        
        /* Content */
        .content {
            padding: 40px 30px;
        }
        
        .section-title {
            font-size: 20px;
            font-weight: 700;
            color: #2d3748;
            margin-bottom: 25px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .section-title::before {
            content: '';
            width: 4px;
            height: 24px;
            background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
            border-radius: 2px;
        }
        
        /* Info cards modernes */
        .info-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin-bottom: 30px;
        }
        
        .info-card {
            background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
            padding: 18px;
            border-radius: 12px;
            border: 1px solid #e9ecef;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        
        .info-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 4px;
            height: 100%;
            background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
            transform: scaleY(0);
            transition: transform 0.3s ease;
        }
        
        .info-card:hover::before {
            transform: scaleY(1);
        }
        
        .info-card.full-width {
            grid-column: 1 / -1;
        }
        
        .info-label {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #667eea;
            font-weight: 700;
            margin-bottom: 6px;
            display: block;
        }
        
        .info-value {
            font-size: 15px;
            color: #2d3748;
            font-weight: 600;
            word-break: break-word;
        }
        
        .info-value a {
            color: #667eea;
            text-decoration: none;
            transition: color 0.3s ease;
        }
        
        .info-value a:hover {
            color: #764ba2;
            text-decoration: underline;
        }
        
        /* Message box avec style carte */
        .message-section {
            margin-top: 35px;
        }
        
        .message-box {
            background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
            padding: 25px;
            border-radius: 16px;
            border: 2px solid #e9ecef;
            margin-top: 15px;
            position: relative;
            box-shadow: 0 4px 20px rgba(0,0,0,0.05);
        }
        
        .message-box::before {
            content: '"';
            position: absolute;
            top: 10px;
            left: 15px;
            font-size: 60px;
            color: rgba(102, 126, 234, 0.1);
            font-family: Georgia, serif;
            line-height: 1;
        }
        
        .message-text {
            font-size: 15px;
            line-height: 1.8;
            color: #2d3748;
            position: relative;
            z-index: 1;
            white-space: pre-wrap;
        }
        
        /* Call to action button moderne */
        .cta-section {
            text-align: center;
            margin-top: 35px;
            padding-top: 30px;
            border-top: 2px solid #f1f3f5;
        }
        
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            padding: 16px 40px;
            border-radius: 50px;
            font-weight: 600;
            font-size: 15px;
            letter-spacing: 0.5px;
            box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
            transition: all 0.3s ease;
            border: none;
        }
        
        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 15px 40px rgba(102, 126, 234, 0.4);
        }
        
        /* Footer moderne */
        .footer {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            padding: 30px;
            text-align: center;
            border-top: 1px solid #dee2e6;
        }
        
        .footer-text {
            font-size: 13px;
            color: #6c757d;
            line-height: 1.6;
            margin-bottom: 8px;
        }
        
        .footer-link {
            color: #667eea;
            text-decoration: none;
            font-weight: 600;
            transition: color 0.3s ease;
        }
        
        .footer-link:hover {
            color: #764ba2;
        }
        
        .footer-divider {
            width: 50px;
            height: 3px;
            background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
            margin: 15px auto;
            border-radius: 2px;
        }
        
        /* Responsive */
        @media only screen and (max-width: 600px) {
            body {
                padding: 10px;
            }
            
            .email-wrapper {
                border-radius: 12px;
            }
            
            .header {
                padding: 30px 20px;
            }
            
            .header h1 {
                font-size: 22px;
            }
            
            .header .emoji {
                font-size: 36px;
            }
            
            .content {
                padding: 25px 20px;
            }
            
            .info-grid {
                grid-template-columns: 1fr;
                gap: 12px;
            }
            
            .info-card {
                padding: 15px;
            }
            
            .section-title {
                font-size: 18px;
            }
            
            .message-box {
                padding: 20px;
            }
            
            .cta-button {
                padding: 14px 30px;
                font-size: 14px;
                display: block;
                width: 100%;
            }
            
            .footer {
                padding: 25px 20px;
            }
        }
        
        /* Dark mode support (optionnel) */
        @media (prefers-color-scheme: dark) {
            body {
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            }
            
            .email-wrapper {
                background: #2d3748;
            }
            
            .section-title {
                color: #f7fafc;
            }
            
            .info-card {
                background: linear-gradient(135deg, #374151 0%, #2d3748 100%);
                border-color: #4a5568;
            }
            
            .info-label {
                color: #a8b5f5;
            }
            
            .info-value {
                color: #e2e8f0;
            }
            
            .message-box {
                background: linear-gradient(135deg, #374151 0%, #2d3748 100%);
                border-color: #4a5568;
            }
            
            .message-text {
                color: #e2e8f0;
            }
            
            .footer {
                background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
                border-top-color: #4a5568;
            }
            
            .footer-text {
                color: #9ca3af;
            }
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <!-- Header moderne avec gradient -->
        <div class="header">
            <div class="header-content">
                <span class="emoji">📬</span>
                <h1>Nouveau Message de Contact</h1>
                <p class="date">{{submission_date}}</p>
                <div class="notification-badge">✨ Portfolio Web</div>
            </div>
        </div>
        
        <!-- Contenu principal -->
        <div class="content">
            <!-- Section informations de contact -->
            <h2 class="section-title">👤 Informations de Contact</h2>
            
            <div class="info-grid">
                <div class="info-card full-width">
                    <span class="info-label">👨‍💼 Nom complet</span>
                    <div class="info-value">{{from_name}}</div>
                </div>
                
                <div class="info-card">
                    <span class="info-label">📧 Email</span>
                    <div class="info-value">
                        <a href="mailto:{{from_email}}">{{from_email}}</a>
                    </div>
                </div>
                
                <div class="info-card">
                    <span class="info-label">📱 Téléphone</span>
                    <div class="info-value">{{phone_number}}</div>
                </div>
                
                <div class="info-card full-width">
                    <span class="info-label">📌 Sujet</span>
                    <div class="info-value">{{subject}}</div>
                </div>
            </div>
            
            <!-- Section message -->
            <div class="message-section">
                <h2 class="section-title">💬 Message</h2>
                <div class="message-box">
                    <div class="message-text">{{message}}</div>
                </div>
            </div>
            
            <!-- Call to action -->
            <div class="cta-section">
                <a href="mailto:{{from_email}}?subject=Re: {{subject}}" class="cta-button">
                    ↩️ Répondre à {{from_name}}
                </a>
            </div>
        </div>
        
        <!-- Footer moderne -->
        <div class="footer">
            <div class="footer-divider"></div>
            <p class="footer-text">Ce message a été envoyé depuis votre portfolio web</p>
            <p class="footer-text">
                <a href="https://john-david-portfolio.web.app" class="footer-link">
                    john-david-portfolio.web.app
                </a>
            </p>
        </div>
    </div>
</body>
</html>
```

4. Clique sur **"Save"**
5. Note le **Template ID** (ex: `template_xyz789`)

---

## 🔑 Étape 4 : Récupérer ta Public Key

1. Va dans **"Account"** → **"General"**
2. Trouve ta **Public Key** (ex: `abcDEF123xyz`)
3. Copie-la

---

## 💻 Étape 5 : Mettre à jour le code

Ouvre le fichier `/src/Pages/Home/ContactMe.jsx` et remplace les placeholders :

```javascript
await emailjs.send(
  'service_abc123',      // ⬅️ TON Service ID ici
  'template_xyz789',     // ⬅️ TON Template ID ici
  emailParams,
  'abcDEF123xyz'        // ⬅️ TA Public Key ici
);
```

---

## 🎨 Personnalisation du Template

Tu peux personnaliser le template pour inclure :

### Variables disponibles :
- `{{from_name}}` - Nom complet du contact
- `{{from_email}}` - Email du contact
- `{{phone_number}}` - Téléphone complet
- `{{subject}}` - Sujet du message
- `{{message}}` - Message complet
- `{{to_name}}` - Ton nom (John David)
- `{{reply_to}}` - Email de réponse
- `{{submission_date}}` - Date et heure de soumission

### Exemples de personnalisation :

#### 1. **Ajouter ton logo :**
```html
<div class="header">
    <img src="https://ton-site.com/logo.png" alt="Logo" style="height: 50px;">
    <h1>📬 Nouveau Message de Contact</h1>
</div>
```

#### 2. **Changer les couleurs :**
```css
.header {
    background: linear-gradient(135deg, #FF6B6B 0%, #FFE66D 100%);
}
.label {
    color: #FF6B6B;
}
```

#### 3. **Ajouter des emojis dynamiques selon le sujet :**
```html
<div class="info-row">
    <span class="label">Sujet:</span>
    <span>
        {{#if_equals subject "Freelance"}}💼{{/if_equals}}
        {{#if_equals subject "Collaboration"}}🤝{{/if_equals}}
        {{subject}}
    </span>
</div>
```

---

## ✅ Étape 6 : Tester

1. Déploie le site : `npm run build && firebase deploy`
2. Va sur ton portfolio : https://john-david-portfolio.web.app
3. Remplis le formulaire de contact
4. Vérifie ta boîte email !

---

## 🎁 Bonus : Template Alternative (Minimaliste)

Si tu préfères un style plus simple :

```html
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5;">
    <div style="max-width: 500px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px;">
        <h2 style="color: #5e3bee; border-bottom: 3px solid #5e3bee; padding-bottom: 10px;">
            Nouveau Message de {{from_name}}
        </h2>
        
        <p><strong>Email:</strong> {{from_email}}</p>
        <p><strong>Téléphone:</strong> {{phone_number}}</p>
        <p><strong>Sujet:</strong> {{subject}}</p>
        
        <div style="background: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 5px;">
            <p><strong>Message:</strong></p>
            <p>{{message}}</p>
        </div>
        
        <p style="text-align: center; color: #888; font-size: 12px; margin-top: 30px;">
            Envoyé le {{submission_date}}
        </p>
    </div>
</body>
</html>
```

---

## 🔒 Sécurité

✅ **Public Key** : Peut être publique (elle est dans le code frontend)
❌ **Private Key** : Ne JAMAIS la mettre dans le code !
✅ EmailJS gère automatiquement les limites d'envoi (protection anti-spam)

---

## 📊 Suivi des Emails

Dans ton dashboard EmailJS, tu pourras :
- Voir le nombre d'emails envoyés
- Consulter l'historique
- Vérifier les échecs
- Monitorer ton quota (200 emails/mois gratuits)

---

## 🚀 Upgrade (Optionnel)

Si tu dépasses 200 emails/mois :
- **Plan Personal** : 1000 emails/mois pour $15/mois
- **Plan Pro** : Illimité pour $50/mois

---

## 🆘 Dépannage

### Le mail ne part pas ?
1. Vérifie que les 3 IDs sont corrects
2. Regarde la console du navigateur (F12)
3. Vérifie ton quota sur EmailJS
4. Confirme que le service email est bien connecté

### Le format est cassé ?
1. Va dans EmailJS → Templates
2. Clique sur "Test" pour prévisualiser
3. Vérifie que toutes les variables `{{}}` sont bien écrites

### Les accents sont bizarres ?
Ajoute ceci en haut du template :
```html
<meta charset="UTF-8">
```

---

**Voilà ! Tu as maintenant un système d'email professionnel et personnalisé ! 🎉**
