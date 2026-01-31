import { useNavigate } from 'react-router-dom';

export default function TermsOfService() {
  const navigate = useNavigate();

  return (
    <div className="legal-page">
      <button onClick={() => navigate('/')} className="btn-back">← Retour</button>
      
      <div className="legal-content">
        <h1>Conditions d'Utilisation</h1>
        
        <section>
          <h2>1. Acceptation des conditions</h2>
          <p>
            En accédant et en utilisant ce site web, vous acceptez d'être lié par ces Conditions d'Utilisation. 
            Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser ce site.
          </p>
        </section>

        <section>
          <h2>2. Utilisation autorisée</h2>
          <p>
            Vous vous engagez à utiliser ce site uniquement à des fins légales et de manière qui ne viole pas les droits d'autrui 
            ou ne restreint pas leur utilisation et leur appréciation du site web.
          </p>
          <p>
            Les comportements interdits incluent :
          </p>
          <ul>
            <li>Harceler ou causer de la détresse ou de l'inconfort</li>
            <li>Offenser la sensibilité d'autres utilisateurs</li>
            <li>Interrompre le déroulement normal des dialogues dans notre site web</li>
            <li>Utiliser un langage offensant</li>
            <li>Contourner les systèmes de sécurité</li>
          </ul>
        </section>

        <section>
          <h2>3. Propriété intellectuelle</h2>
          <p>
            Tout le contenu de ce site web, y compris les textes, graphiques, logos, images et code logiciel, 
            est la propriété de John David ou de ses fournisseurs de contenu et est protégé par les lois internationales sur les droits d'auteur.
          </p>
        </section>

        <section>
          <h2>4. Limitation de responsabilité</h2>
          <p>
            Ce site web est fourni "tel quel" sans aucune garantie. John David ne sera pas responsable de tout dommage 
            ou perte résultant de votre utilisation du site web.
          </p>
        </section>

        <section>
          <h2>5. Liens externes</h2>
          <p>
            Ce site peut contenir des liens vers des sites externes. Nous ne sommes pas responsables du contenu, 
            de la précision ou des pratiques de ces sites externes.
          </p>
        </section>

        <section>
          <h2>6. Modification des conditions</h2>
          <p>
            Nous nous réservons le droit de modifier ces Conditions d'Utilisation à tout moment. 
            Les modifications entreront en vigueur dès leur publication sur le site.
          </p>
        </section>

        <section>
          <h2>7. Résiliation</h2>
          <p>
            Nous nous réservons le droit de suspendre ou de résilier votre accès au site à tout moment 
            et pour quelque raison que ce soit, sans préavis ni responsabilité.
          </p>
        </section>

        <section>
          <h2>8. Loi applicable</h2>
          <p>
            Ces Conditions d'Utilisation sont régies par les lois en vigueur. 
            Tout différend découlant de ou lié à l'utilisation de ce site sera soumis à la juridiction exclusive des tribunaux compétents.
          </p>
        </section>

        <section>
          <h2>9. Nous contacter</h2>
          <p>
            Pour toute question concernant ces Conditions d'Utilisation, veuillez nous contacter via la page de contact.
          </p>
        </section>

        <p className="last-update">Dernière mise à jour : Janvier 2026</p>
      </div>
    </div>
  );
}
