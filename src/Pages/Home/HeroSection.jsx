export default function HeroSection(){
  return (
    <section id="heroSection" className="hero--section">
      <div className="hero--section--content--box">
        <div className="hero--section--content">
          <h1 className="section--title"> 
            <span>John David</span>
          </h1>
          <h2 className="hero--section--title">
            <span className="hero--section-title--color"> Developpeur</span>{" "}
            <br />
            Full Stack
          </h2>
          <p className="hero--section--description">Développeur Full Stack passionné par les technologies numériques et fort d'un parcours riche en expériences diversifiées, je cherche à relever de nouveaux défis dans le domaine du développement web. Ayant suivi un bootcamp intensif en développement web, j'ai acquis des compétences techniques essentielles telles que HTML, CSS, JavaScript, Ruby on Rails, React, et PostgreSQL.
            <br/> Je suis enthousiaste à l'idée de contribuer activement au succès des initiatives ambitieuses et innovantes.
          </p>
        </div>  
        <a href="https://www.canva.com/design/DAGRbJFBCcQ/ENKhhjbSAB3NvhZBzzCISA/view" target="blank">
          <button className="btn btn-primary"> Voir mon CV</button>
        </a>
     </div>
     <div className="hero--section--img">
      <img src="./img/copie 3.JPG" alt=" Hero section" />
     </div>
    </section>
  );
}