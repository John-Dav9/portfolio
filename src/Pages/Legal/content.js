import siteContent from "../../data/site.json";

// Legal page texts. Paragraphs and list items accept the limited HTML allowed by RichText.
const { owner, hosting } = siteContent;
const UPDATED = { fr: "septembre 2026", en: "September 2026" };
const HOST = `${hosting.name}, ${hosting.address} — <a href="${hosting.website}">${hosting.website.replace("https://", "")}</a>`;
const EMAILJS_PRIVACY = '<a href="https://www.emailjs.com/legal/privacy-policy/">EmailJS</a>';
const CNIL = '<a href="https://www.cnil.fr/fr/plaintes">CNIL</a>';

export const LEGAL_CONTENT = {
  legalNotice: {
    fr: {
      title: "Mentions légales",
      updated: UPDATED.fr,
      sections: [
        {
          heading: "Éditeur du site",
          paragraphs: [
            `Ce site est un portfolio personnel édité à titre non professionnel par <strong>${owner.name}</strong>.`,
            'Contact : via le <a href="/#Contact">formulaire de contact</a>.',
            `Directeur de la publication : ${owner.name}.`,
          ],
        },
        {
          heading: "Hébergement",
          paragraphs: [HOST],
        },
        {
          heading: "Propriété intellectuelle",
          paragraphs: [
            `Les textes, photographies, logos et le code de ce site sont la propriété de ${owner.name}, sauf mention contraire. Toute reproduction sans autorisation préalable est interdite.`,
            "Les marques et logos des projets et technologies cités appartiennent à leurs propriétaires respectifs.",
          ],
        },
        {
          heading: "Données personnelles",
          paragraphs: [
            'Le traitement des données transmises via le formulaire de contact est décrit dans la <a href="/privacy-policy">politique de confidentialité</a>.',
          ],
        },
      ],
    },
    en: {
      title: "Legal notice",
      updated: UPDATED.en,
      sections: [
        {
          heading: "Publisher",
          paragraphs: [
            `This website is a personal portfolio published on a non-professional basis by <strong>${owner.name}</strong>.`,
            'Contact: through the <a href="/#Contact">contact form</a>.',
            `Publication director: ${owner.name}.`,
          ],
        },
        {
          heading: "Hosting",
          paragraphs: [HOST],
        },
        {
          heading: "Intellectual property",
          paragraphs: [
            `The texts, photographs, logos and code of this website belong to ${owner.name} unless stated otherwise. Reproduction without prior permission is prohibited.`,
            "Trademarks and logos of the projects and technologies mentioned belong to their respective owners.",
          ],
        },
        {
          heading: "Personal data",
          paragraphs: [
            'How data sent through the contact form is processed is described in the <a href="/privacy-policy">privacy policy</a>.',
          ],
        },
      ],
    },
  },

  privacyPolicy: {
    fr: {
      title: "Politique de confidentialité",
      updated: UPDATED.fr,
      sections: [
        {
          heading: "Responsable du traitement",
          paragraphs: [
            `${owner.name}, joignable via le <a href="/#Contact">formulaire de contact</a>.`,
          ],
        },
        {
          heading: "Données collectées",
          paragraphs: ["Ce site ne collecte des données personnelles que lorsque vous utilisez le formulaire de contact :"],
          items: [
            "prénom, nom et adresse e-mail (obligatoires) ;",
            "numéro de téléphone (facultatif) ;",
            "sujet et contenu de votre message.",
          ],
        },
        {
          heading: "Ce que le site ne fait pas",
          items: [
            "aucun outil de mesure d'audience ni de publicité ;",
            "aucun cookie ;",
            "aucune base de données : les messages ne sont pas stockés sur le site ;",
            "aucune revente ni cession de vos données.",
          ],
        },
        {
          heading: "Finalité et base légale",
          paragraphs: [
            "Vos données servent uniquement à répondre à votre demande. Le traitement repose sur votre consentement, exprimé en cochant la case du formulaire (article 6.1.a du RGPD).",
          ],
        },
        {
          heading: "Destinataires",
          paragraphs: [
            `Le message est transmis par le service ${EMAILJS_PRIVACY}, qui l'achemine vers la boîte e-mail de ${owner.name}. Ce prestataire peut traiter les données en dehors de l'Union européenne ; consultez sa politique de confidentialité pour connaître les garanties appliquées.`,
          ],
        },
        {
          heading: "Durée de conservation",
          paragraphs: [
            "Les messages sont conservés dans la messagerie le temps nécessaire au traitement de votre demande, et au plus 3 ans après le dernier échange.",
            `Les journaux techniques du serveur (adresse IP, date, page demandée) sont conservés pour une durée limitée, à des fins de sécurité, chez l'hébergeur ${hosting.name}.`,
          ],
        },
        {
          heading: "Stockage local",
          paragraphs: [
            "Le site enregistre votre choix de langue (FR/EN) dans le stockage local de votre navigateur (localStorage). Cette information ne quitte pas votre appareil et vous pouvez l'effacer à tout moment via les réglages de votre navigateur.",
          ],
        },
        {
          heading: "Vos droits",
          paragraphs: ["Conformément au RGPD, vous disposez des droits suivants :"],
          items: [
            "accès, rectification et effacement de vos données ;",
            "limitation et opposition au traitement ;",
            "portabilité ;",
            "retrait de votre consentement à tout moment.",
          ],
        },
        {
          heading: "Exercer vos droits",
          paragraphs: [
            `Écrivez via le <a href="/#Contact">formulaire de contact</a>. Si vous estimez que vos droits ne sont pas respectés, vous pouvez adresser une réclamation à la ${CNIL}.`,
          ],
        },
      ],
    },
    en: {
      title: "Privacy policy",
      updated: UPDATED.en,
      sections: [
        {
          heading: "Data controller",
          paragraphs: [`${owner.name}, reachable through the <a href="/#Contact">contact form</a>.`],
        },
        {
          heading: "Data collected",
          paragraphs: ["This website only collects personal data when you use the contact form:"],
          items: [
            "first name, last name and email address (required);",
            "phone number (optional);",
            "subject and content of your message.",
          ],
        },
        {
          heading: "What this website does not do",
          items: [
            "no analytics or advertising tools;",
            "no cookies;",
            "no database: messages are not stored on the website;",
            "no sale or transfer of your data.",
          ],
        },
        {
          heading: "Purpose and legal basis",
          paragraphs: [
            "Your data is used only to answer your request. Processing is based on your consent, given by ticking the form checkbox (Article 6(1)(a) GDPR).",
          ],
        },
        {
          heading: "Recipients",
          paragraphs: [
            `Your message is sent through the ${EMAILJS_PRIVACY} service, which delivers it to ${owner.name}'s mailbox. This provider may process data outside the European Union; see its privacy policy for the safeguards it applies.`,
          ],
        },
        {
          heading: "Retention",
          paragraphs: [
            "Messages are kept in the mailbox for as long as needed to handle your request, and at most 3 years after the last exchange.",
            `Server technical logs (IP address, date, requested page) are kept for a limited period for security purposes by the host, ${hosting.name}.`,
          ],
        },
        {
          heading: "Local storage",
          paragraphs: [
            "The website saves your language choice (FR/EN) in your browser's local storage (localStorage). This information never leaves your device and you can clear it at any time in your browser settings.",
          ],
        },
        {
          heading: "Your rights",
          paragraphs: ["Under the GDPR, you have the right to:"],
          items: [
            "access, rectify and erase your data;",
            "restrict or object to processing;",
            "data portability;",
            "withdraw your consent at any time.",
          ],
        },
        {
          heading: "Exercising your rights",
          paragraphs: [
            `Write through the <a href="/#Contact">contact form</a>. If you believe your rights are not respected, you can lodge a complaint with the ${CNIL} (French data protection authority) or your local authority.`,
          ],
        },
      ],
    },
  },

  termsOfService: {
    fr: {
      title: "Conditions d'utilisation",
      updated: UPDATED.fr,
      sections: [
        {
          heading: "Objet",
          paragraphs: [
            `Ce site présente le parcours, les compétences et les projets de ${owner.name}. En le consultant, vous acceptez les présentes conditions.`,
          ],
        },
        {
          heading: "Utilisation du formulaire de contact",
          paragraphs: [
            "Le formulaire est destiné aux demandes professionnelles (freelance, collaboration, emploi…). Tout envoi abusif, publicitaire ou automatisé est interdit.",
          ],
        },
        {
          heading: "Propriété intellectuelle",
          paragraphs: [
            'Les contenus du site sont protégés. Voir les <a href="/legal-notice">mentions légales</a>.',
          ],
        },
        {
          heading: "Liens externes",
          paragraphs: [
            "Le site renvoie vers des sites tiers (GitHub, projets en ligne, réseaux sociaux). Leur contenu et leurs pratiques relèvent de leurs éditeurs respectifs.",
          ],
        },
        {
          heading: "Responsabilité",
          paragraphs: [
            "Les informations sont fournies à titre indicatif et peuvent évoluer. L'éditeur s'efforce de les tenir à jour mais ne garantit pas l'absence d'erreurs ni la disponibilité permanente du site.",
          ],
        },
        {
          heading: "Droit applicable",
          paragraphs: ["Les présentes conditions sont régies par le droit français."],
        },
      ],
    },
    en: {
      title: "Terms of use",
      updated: UPDATED.en,
      sections: [
        {
          heading: "Purpose",
          paragraphs: [
            `This website presents the background, skills and projects of ${owner.name}. By browsing it, you accept these terms.`,
          ],
        },
        {
          heading: "Use of the contact form",
          paragraphs: [
            "The form is intended for professional requests (freelance, collaboration, jobs…). Abusive, advertising or automated submissions are prohibited.",
          ],
        },
        {
          heading: "Intellectual property",
          paragraphs: ['The website content is protected. See the <a href="/legal-notice">legal notice</a>.'],
        },
        {
          heading: "External links",
          paragraphs: [
            "The website links to third-party sites (GitHub, live projects, social networks). Their content and practices are the responsibility of their publishers.",
          ],
        },
        {
          heading: "Liability",
          paragraphs: [
            "Information is provided for guidance and may change. The publisher strives to keep it up to date but does not guarantee it is error-free or that the website is always available.",
          ],
        },
        {
          heading: "Governing law",
          paragraphs: ["These terms are governed by French law."],
        },
      ],
    },
  },

  cookieSettings: {
    fr: {
      title: "Cookies",
      updated: UPDATED.fr,
      sections: [
        {
          heading: "Aucun cookie sur ce site",
          paragraphs: [
            "Ce site n'utilise aucun cookie, ni de mesure d'audience, ni publicitaire. Aucun bandeau de consentement n'est donc nécessaire.",
          ],
        },
        {
          heading: "Stockage local",
          paragraphs: [
            "Seule votre préférence de langue est enregistrée dans le stockage local de votre navigateur (clé <strong>language</strong>). Elle n'est jamais transmise et peut être effacée via les réglages de votre navigateur.",
          ],
        },
        {
          heading: "Polices de caractères",
          paragraphs: [
            "Les polices sont hébergées sur ce serveur : aucune requête n'est envoyée à un service tiers comme Google Fonts.",
          ],
        },
        {
          heading: "Contenus tiers",
          paragraphs: [
            "Les sites externes vers lesquels pointent les liens (GitHub, LinkedIn, projets, CV hébergés en ligne) peuvent déposer leurs propres cookies lorsque vous les consultez. Ils relèvent de leurs propres politiques.",
          ],
        },
      ],
    },
    en: {
      title: "Cookies",
      updated: UPDATED.en,
      sections: [
        {
          heading: "No cookies on this website",
          paragraphs: [
            "This website uses no cookies, whether for analytics or advertising. No consent banner is therefore required.",
          ],
        },
        {
          heading: "Local storage",
          paragraphs: [
            "Only your language preference is saved in your browser's local storage (key <strong>language</strong>). It is never transmitted and can be cleared in your browser settings.",
          ],
        },
        {
          heading: "Fonts",
          paragraphs: [
            "Fonts are served from this server: no request is sent to third-party services such as Google Fonts.",
          ],
        },
        {
          heading: "Third-party content",
          paragraphs: [
            "External sites reached through links (GitHub, LinkedIn, projects, CVs hosted online) may set their own cookies when you visit them. Their own policies apply.",
          ],
        },
      ],
    },
  },
};
