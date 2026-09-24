import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { LazyMotion, MotionConfig } from "motion/react";
import Layout from "./components/Layout";
import { FocusProvider } from "./components/FocusContext";
import { ContentProvider } from "./components/ContentContext";
import Home from "./Pages/Home/Homescreen";

const LegalPage = lazy(() => import("./Pages/Legal/LegalPage"));
const NotFound = lazy(() => import("./Pages/NotFound"));
const AdminApp = lazy(() => import("./Pages/Admin/AdminApp"));
const loadMotionFeatures = () => import("./motionFeatures").then((mod) => mod.default);

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={loadMotionFeatures} strict>
        <ContentProvider>
        <FocusProvider>
          <Suspense fallback={<div className="min-h-screen" />}>
            <Routes>
              <Route path="/admin/*" element={<AdminApp />} />
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
        </FocusProvider>
        </ContentProvider>
      </LazyMotion>
    </MotionConfig>
  );
}

export default App;
