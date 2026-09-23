import { Link as RouterLink, useLocation } from "react-router-dom";

// Native anchor on the home page (smooth scrolling comes from CSS); "/#id" elsewhere.
export default function SectionLink({ to, className, onClick, children, ...rest }) {
  const { pathname } = useLocation();

  if (pathname !== "/") {
    return (
      <RouterLink to={`/#${to}`} className={className} onClick={onClick} {...rest}>
        {children}
      </RouterLink>
    );
  }

  return (
    <a href={`#${to}`} className={className} onClick={onClick} {...rest}>
      {children}
    </a>
  );
}
