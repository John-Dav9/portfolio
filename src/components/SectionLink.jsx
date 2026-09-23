import { Link as ScrollLink } from "react-scroll";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { SCROLL_OPTIONS } from "../utils/sections";

// Smooth-scrolls on the home page; elsewhere navigates to "/#id" and lets Home scroll.
export default function SectionLink({ to, className, onClick, children }) {
  const { pathname } = useLocation();

  if (pathname !== "/") {
    return (
      <RouterLink to={`/#${to}`} className={className} onClick={onClick}>
        {children}
      </RouterLink>
    );
  }

  return (
    <ScrollLink
      to={to}
      href={`#${to}`}
      spy
      activeClass="navbar--active--content"
      className={className}
      onClick={onClick}
      {...SCROLL_OPTIONS}
    >
      {children}
    </ScrollLink>
  );
}
