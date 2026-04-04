import { BrowserRouter as Router, Routes, Route } from "react-router";
import LoginPage from "./pages/LoginPage";
import ExportsPage from "./pages/ExportsPage.tsx";

import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Home />} />

            <Route path="/exports" element={<ExportsPage />} />
          </Route>

          {/* Auth Layout */}
          <Route path="/login" element={<LoginPage />} />

        </Routes>
      </Router>
    </>
  );
}
