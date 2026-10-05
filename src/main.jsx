import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import App from "./App";
import Survey from "./pages/Survey";
import Area from "./pages/Area";
import Service from "./pages/Service";
import Admin from "./pages/admin/Admin";
import { servicePages } from "./config";
import { Prefs } from "./i18n";
import "./theme.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// Admin lives only on the subdomain (admin.slcleaningservices.online).
// The main site never exposes /admin.
function isAdminHost() {
  const h = (window.location.hostname || "").toLowerCase();
  return h === "admin.slcleaningservices.online" || h.startsWith("admin.");
}

const adminHost = isAdminHost();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Prefs>
    <BrowserRouter>
      <Routes>
        {adminHost ? (
          <>
            <Route path="/" element={<Admin />} />
            <Route path="/*" element={<Admin />} />
          </>
        ) : (
          <>
            <Route path="/" element={<App />} />
            <Route path="/survey" element={<Survey />} />
            <Route path="/cleaning/:slug" element={<Area />} />
            {servicePages.map((s) => (
              <Route key={s.slug} path={`/${s.slug}`} element={<Service slug={s.slug} />} />
            ))}
            {/* Hide admin on the public domain */}
            <Route path="/admin" element={<Navigate to="/" replace />} />
            <Route path="/admin/*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
      {!adminHost && <Analytics />}
      {!adminHost && <SpeedInsights />}
    </BrowserRouter>
    </Prefs>
  </React.StrictMode>
);
