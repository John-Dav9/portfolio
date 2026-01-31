import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function CookiesSettings() {
  const navigate = useNavigate();
  const [preferences, setPreferences] = useState({
    essential: true,
    analytics: false,
    marketing: false
  });

  const handleChange = (e) => {
    const { name, checked } = e.target;
    setPreferences(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const saveCookiePreferences = () => {
    localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
    alert('Vos préférences de cookies ont été sauvegardées !');
  };

  return (
    <div className="legal-page">
      <button onClick={() => navigate('/')} className="btn-back">← Retour</button>
      
      <div className="legal-content">
        <h1>Gestion des Cookies</h1>
        
        <section>
          <h2>1. Qu'est-ce qu'un cookie ?</h2>
          <p>
            Les cookies sont de petits fichiers texte stockés sur votre appareil lorsque vous visitez un site web. 
            Ils nous aident à améliorer votre expérience de navigation en mémorisant vos préférences.
          </p>
        </section>

        <section>
          <h2>2. Types de cookies que nous utilisons</h2>
          
          <div className="cookie-type">
            <h3>Cookies essentiels</h3>
            <p>
              Ces cookies sont nécessaires au fonctionnement du site web. Ils ne peuvent pas être désactivés. 
              Ils incluent les cookies de session et de sécurité.
            </p>
            <label>
              <input 
                type="checkbox" 
                name="essential" 
                checked={preferences.essential} 
                disabled
              />
              Cookies essentiels (toujours activés)
            </label>
          </div>

          <div className="cookie-type">
            <h3>Cookies analytiques</h3>
            <p>
              Ces cookies nous aident à comprendre comment vous interagissez avec notre site web. 
              Ils nous permettent d'améliorer les performances et l'expérience utilisateur.
            </p>
            <label>
              <input 
                type="checkbox" 
                name="analytics" 
                checked={preferences.analytics}
                onChange={handleChange}
              />
              Cookies analytiques
            </label>
          </div>

          <div className="cookie-type">
            <h3>Cookies marketing</h3>
            <p>
              Ces cookies sont utilisés pour suivre vos visiteurs sur les sites web. 
              L'intention est d'afficher des publicités pertinentes et engageantes pour chaque utilisateur.
            </p>
            <label>
              <input 
                type="checkbox" 
                name="marketing" 
                checked={preferences.marketing}
                onChange={handleChange}
              />
              Cookies marketing
            </label>
          </div>
        </section>

        <section>
          <h2>3. Comment gérer les cookies</h2>
          <p>
            Vous pouvez gérer vos préférences de cookies en utilisant les paramètres ci-dessus. 
            Vous pouvez également configurer votre navigateur pour refuser les cookies, 
            mais cela peut affecter la fonctionnalité du site web.
          </p>
        </section>

        <section>
          <h2>4. Cookies de tiers</h2>
          <p>
            Nous pouvons utiliser des services tiers qui placent également des cookies sur votre appareil 
            pour des fonctionnalités telles que l'analyse du trafic et les annonces.
          </p>
        </section>

        <section>
          <h2>5. Durée de conservation</h2>
          <p>
            Les cookies essentiels sont supprimés à la fin de votre session. 
            Les autres cookies peuvent être conservés jusqu'à 2 ans, selon votre navigateur et vos paramètres.
          </p>
        </section>

        <section>
          <h2>6. Votre consentement</h2>
          <p>
            En continuant à utiliser ce site web, vous consentez à notre utilisation des cookies 
            selon les paramètres que vous avez sélectionnés.
          </p>
        </section>

        <section>
          <h2>7. Nous contacter</h2>
          <p>
            Si vous avez des questions concernant cette Politique de Cookies, 
            veuillez nous contacter via la page de contact.
          </p>
        </section>

        <div className="cookie-preferences">
          <h2>Gérer vos préférences</h2>
          <button onClick={saveCookiePreferences} className="btn btn-primary">
            Sauvegarder les préférences
          </button>
        </div>

        <p className="last-update">Dernière mise à jour : Janvier 2026</p>
      </div>
    </div>
  );
}
