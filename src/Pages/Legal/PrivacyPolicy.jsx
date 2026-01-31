import { useNavigate } from 'react-router-dom';

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="legal-page">
      <button onClick={() => navigate('/')} className="btn-back">← Retour</button>
      
      <div className="legal-content">
        <h1>Politique de Confidentialité</h1>
        
        <section>
          <h2>1. Introduction</h2>
          <p>
            Chez John David Portfolio, nous respectons votre vie privée et nous nous engageons à protéger vos données personnelles. 
            Cette Politique de Confidentialité explique comment nous collectons, utilisons, divulguons et conservons vos informations.
          </p>
        </section>

        <section>
          <h2>2. Informations que nous collectons</h2>
          <p>
            Nous pouvons collecter les informations suivantes :
          </p>
          <ul>
            <li><strong>Informations de contact :</strong> Nom, adresse e-mail, numéro de téléphone</li>
            <li><strong>Informations de navigation :</strong> Adresse IP, type de navigateur, pages visitées</li>
            <li><strong>Données de formulaire :</strong> Messages de contact et demandes de collaboration</li>
            <li><strong>Cookies :</strong> Pour améliorer votre expérience utilisateur</li>
          </ul>
        </section>

        <section>
          <h2>3. Comment nous utilisons vos informations</h2>
          <p>Nous utilisons vos données pour :</p>
          <ul>
            <li>Répondre à vos demandes de contact</li>
            <li>Améliorer notre site web et nos services</li>
            <li>Analyser les tendances d'utilisation</li>
            <li>Vous envoyer des mises à jour (avec votre consentement)</li>
            <li>Respecter nos obligations légales</li>
          </ul>
        </section>

        <section>
          <h2>4. Partage de vos informations</h2>
          <p>
            Nous ne partageons pas vos informations personnelles avec des tiers, sauf si la loi l'exige ou avec votre consentement explicite.
          </p>
        </section>

        <section>
          <h2>5. Sécurité des données</h2>
          <p>
            Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos données contre l'accès non autorisé, 
            l'altération ou la destruction.
          </p>
        </section>

        <section>
          <h2>6. Vos droits</h2>
          <p>
            Vous avez le droit de :
          </p>
          <ul>
            <li>Accéder à vos données personnelles</li>
            <li>Corriger les informations inexactes</li>
            <li>Demander la suppression de vos données</li>
            <li>Retirer votre consentement à tout moment</li>
          </ul>
        </section>

        <section>
          <h2>7. Modifications de cette politique</h2>
          <p>
            Nous pouvons mettre à jour cette Politique de Confidentialité de temps en temps. 
            Les modifications seront publiées sur cette page avec une date de mise à jour.
          </p>
        </section>

        <section>
          <h2>8. Nous contacter</h2>
          <p>
            Si vous avez des questions concernant cette Politique de Confidentialité, 
            veuillez nous contacter via la page de contact de notre site web.
          </p>
        </section>

        <p className="last-update">Dernière mise à jour : Janvier 2026</p>
      </div>
    </div>
  );
}
