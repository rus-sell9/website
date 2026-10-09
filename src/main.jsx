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
import NotFound from "./pages/NotFound";
import { servicePages } from "./config";
import { Prefs } from "./i18n";
import "./theme.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function isAdminHost() {
  const h = (window.location.hostname || "").toLowerCase();
  if (h === "admin.slcleaningservices.online" || h.startsWith("admin.")) return true;
  // TEMPORARY: lets the admin be tested on the *.workers.dev test site at /admin-test.
  // Remove this line before going live on the real domain.
  return h.endsWith(".workers.dev") && window.location.pathname.startsWith("/admin-test");
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
            <Route path="/admin" element={<Navigate to="/" replace />} />
            <Route path="/admin/*" element={<Navigate to="/" replace />} />
            <Route path="*" element={<NotFound />} />
          </>
        )}
      </Routes>
      {!adminHost && <Analytics />}
      {!adminHost && <SpeedInsights />}
    </BrowserRouter>
    </Prefs>
  </React.StrictMode>
);
