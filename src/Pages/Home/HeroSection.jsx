export default function HeroSection(){
  return (
    <section id="heroSection" className="hero--section">
      <div className="hero--section--content--box">
        <div className="hero--section--content">
          <p className="section--title"> Hey I'm John David</p>
          <h1 className="hero--section--title">
            <span className="hero--section-title--color"> Full Stack</span>{" "}
            <br />
            Developer
          </h1>
          <p className="hero--section--description">Lorem ipsum dolor sit amet consectetur adipisicing elit.
            <br/> Id quos harum fuga, eos possimus quam minima distinctio quasi reprehenderit adipisci veniam, voluptatibus dolores nesciunt dolore, fugit debitis sint facilis commodi.
          </p>
        </div>  
        <button className="btn btn-primary"> Get in touch</button>
     </div>
     <div className="hero--section--img">
      <img src="./img/hero_img.jpg" alt=" Hero section" />
     </div>
    </section>
  );
}