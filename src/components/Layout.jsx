import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../Pages/Home/Navbar";
import Footer from "../Pages/Home/Footer";

export default function Layout() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) window.scrollTo(0, 0);
  }, [pathname, hash]);

  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
