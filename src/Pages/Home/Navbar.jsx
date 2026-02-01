import { useEffect, useState } from "react";
import { Link } from "react-scroll";
import { useTranslation } from "react-i18next";

function Navbar() {
  const [navActive, setNavActive] = useState(false);
  const { t, i18n } = useTranslation();

  const toggleNav = () => {
    setNavActive((current) => !current);
  };

  const closeMenu = () => {
    setNavActive(false);
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 500) {
        closeMenu();
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (window.innerWidth <= 1200) {
      closeMenu();
    }
  }, []);

  return (
    <nav className={`navbar ${navActive ? "active" : ""}`}>
      <div className="navbar__logo">
        <img src="./img/logo.svg" alt="John David Tchomgui" />
      </div>
      <button
        type="button"
        className={`nav__hamburger ${navActive ? "active" : ""}`}
        onClick={toggleNav}
        aria-label="Toggle navigation"
        aria-expanded={navActive}
        aria-controls="primary-navigation"
      >
        <span className="nav__hamburger__line"></span>
        <span className="nav__hamburger__line"></span>
        <span className="nav__hamburger__line"></span>
      </button>
      <div
        id="primary-navigation"
        className={`navbar--items ${navActive ? "active" : ""}`}
      >
        <ul>
          <li>
            <Link
              onClick={closeMenu}
              activeClass="navbar--active--content"
              spy={true}
              smooth={true}
              offset={-70}
              duration={500}
              to="heroSection"
              className="navbar--content"
            >
              {t('navbar.home')}
            </Link>
          </li>
          <li>
            <Link
              onClick={closeMenu}
              activeClass="navbar--active--content"
              spy={true}
              smooth={true}
              offset={-70}
              duration={500}
              to="MySkills"
              className="navbar--content"
            >
              {t('navbar.skills')}
            </Link>
          </li>
          <li>
            <Link
              onClick={closeMenu}
              activeClass="navbar--active--content"
              spy={true}
              smooth={true}
              offset={-70}
              duration={500}
              to="AboutMe"
              className="navbar--content"
            >
              {t('navbar.about')}
            </Link>
          </li>
          <li>
            <Link
              onClick={closeMenu}
              activeClass="navbar--active--content"
              spy={true}
              smooth={true}
              offset={-70}
              duration={500}
              to="MyPortfolio"
              className="navbar--content"
            >
              {t('navbar.portfolio')}
            </Link>
          </li>
          <li>
            <Link
              onClick={closeMenu}
              activeClass="navbar--active--content"
              spy={true}
              smooth={true}
              offset={-70}
              duration={500}
              to="testimonial"
              className="navbar--content"
            >
              {t('navbar.testimonials')}
            </Link>
          </li>
          <li>
            <Link
              onClick={closeMenu}
              activeClass="navbar--active--content"
              spy={true}
              smooth={true}
              offset={-70}
              duration={500}
              to="Contact"
              className="navbar--content"
            >
              {t('navbar.contact')}
            </Link>
          </li>
        </ul>
      </div>
      <div className="navbar--actions">
        <div className="language--toggle">
          <button
            onClick={() => changeLanguage('fr')}
            className={`lang--btn ${i18n.language === 'fr' ? 'active' : ''}`}
            title="Français"
          >
            FR
          </button>
          <button
            onClick={() => changeLanguage('en')}
            className={`lang--btn ${i18n.language === 'en' ? 'active' : ''}`}
            title="English"
          >
            EN
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
