import { Routes, Route } from "react-router-dom";
import AppLayout from "./layouts/AppLayout.jsx";
import IntroductionPage from "./pages/IntroductionPage.jsx";
import PublicStrategyPage from "./pages/strategies/PublicStrategyPage.jsx";
import CookieStrategyPage from "./pages/strategies/CookieStrategyPage.jsx";
import InterceptStrategyPage from "./pages/strategies/InterceptStrategyPage.jsx";
import UiStrategyPage from "./pages/strategies/UiStrategyPage.jsx";

export default function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<IntroductionPage />} />
        <Route path="/strategies/public" element={<PublicStrategyPage />} />
        <Route path="/strategies/cookie" element={<CookieStrategyPage />} />
        <Route path="/strategies/intercept" element={<InterceptStrategyPage />} />
        <Route path="/strategies/ui" element={<UiStrategyPage />} />
      </Routes>
    </AppLayout>
  );
}
