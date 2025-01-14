export default function ContactMe() {
  return(
    <section id="Contact" className="contact--section">
      <div>
        <p  className="sub-title"></p>
        <h2>Me Contacter</h2>
        <p className="text-lg"></p>
      </div>
      <form action="https://getform.io/f/bxoovyoa" method= "POST" className="contact--form--container">
        <div className="container">
          <label htmlFor="first-name" className="contact--label">
            <span className="text-md">Prénom</span>
            <input type="text" className="contact--input text-md" name="first-name" id="first-name" required
            />
          </label>
          <label htmlFor="last-name" className="contact--label">
            <span className="text-md">Nom</span>
            <input type="text" className="contact--input text-md" name="last-name" id="last-name" required
            />
          </label>
          <label htmlFor="email" className="contact--label">
            <span className="text-md">E-mail</span>
            <input type="email" className="contact--input text-md" name="email" id="email" required
            />
          </label>
          <label htmlFor="phone-number" className="contact--label">
            <span className="text-md">Numéro de téléphone</span>
            <input type="number" className="contact--input text-md" name="phone-number" id="phone-number" required
            />
          </label>
        </div> 
        <label htmlFor="choode-topic" className="contact--label">
            <span className="text-md">Choisir un sujet</span>
             <select id="choose-topic" className="contact--input text-md">
              <option>Selectionner</option>
              <option>Freelance</option>
              <option>Collaboration</option>
              <option>Autres</option>
             </select>
          </label>
          <label htmlFor="message" className="contact--label">
            <span className="text-md">Message</span>
            <textarea 
              className="contact--input text-md"
              id="message"
              rows="8"
              placeholder="Type your message ..."/>
          </label>
          <label htmlFor="checkbox" className="checkbox--label">
            <input type="checkbox" required name="checkbox" id="checkbox"/>
            <span className="text-sm">J'accepte les termes</span>
          </label>
          <div>
            <button className="btn btn-primary contact--form--btn">Soumettre</button>
          </div>
      </form>
    </section>
  )
}