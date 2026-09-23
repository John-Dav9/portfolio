import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../Pages/Home/Navbar";
import Footer from "../Pages/Home/Footer";
import ScrollProgress from "./ScrollProgress";
import { Backdrop } from "./motion";

export default function Layout() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) window.scrollTo(0, 0);
  }, [pathname, hash]);

  return (
    <>
      <Backdrop />
      <ScrollProgress />
      <Navbar />
      <main className="overflow-x-clip">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
