import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Prefs>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/survey" element={<Survey />} />
        <Route path="/cleaning/:slug" element={<Area />} />
        {servicePages.map((s) => (
          <Route key={s.slug} path={`/${s.slug}`} element={<Service slug={s.slug} />} />
        ))}
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/*" element={<Admin />} />
      </Routes>
      <Analytics />
      <SpeedInsights />
    </BrowserRouter>
    </Prefs>
  </React.StrictMode>
);
