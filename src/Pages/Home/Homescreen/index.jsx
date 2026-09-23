import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import AboutMe from "../AboutMe";
import ContactMe from "../ContactMe";
import HeroSection from "../HeroSection";
import MyPortfolio from "../MyPortfolio";
import MySkills from "../MySkills";
import Testimonial from "../Testimonials";
import useDocumentTitle from "../../../utils/useDocumentTitle";

export default function Home() {
  const { hash } = useLocation();
  useDocumentTitle();

  // Arriving from another page via "/#section": scroll once the sections are mounted.
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth" });
  }, [hash]);

  return (
    <>
      <HeroSection />
      <MySkills />
      <AboutMe />
      <MyPortfolio />
      <Testimonial />
      <ContactMe />
    </>
  );
}
