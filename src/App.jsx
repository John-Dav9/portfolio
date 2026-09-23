import "./App.css";
import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./Pages/Home/Homescreen";

const LegalPage = lazy(() => import("./Pages/Legal/LegalPage"));
const NotFound = lazy(() => import("./Pages/NotFound"));

function App() {
  return (
    <div className="App">
      <Suspense fallback={<div className="legal-page" />}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/legal-notice" element={<LegalPage page="legalNotice" />} />
            <Route path="/privacy-policy" element={<LegalPage page="privacyPolicy" />} />
            <Route path="/terms-of-service" element={<LegalPage page="termsOfService" />} />
            <Route path="/cookies-settings" element={<LegalPage page="cookieSettings" />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
