import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import es from "./es";

const Ctx = createContext(null);

const read = (k) => { try { return localStorage.getItem(k); } catch { return null; } };
const write = (k, v) => { try { localStorage.setItem(k, v); } catch { /* ignore */ } };

const initialLang = () =>
  read("sl-lang") || ((navigator.language || "").toLowerCase().startsWith("es") ? "es" : "en");
const initialTheme = () =>
  read("sl-theme") ||
  (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

// Translate a key for a given language.
export const tl = (lang, key, vars) => {
  const out = lang === "es" && es[key] !== undefined ? es[key] : key;
  return vars ? out.replace(/\{(\w+)\}/g, (_, k) => (vars[k] !== undefined ? vars[k] : "")) : out;
};

export function Prefs({ children }) {
  const [lang, setLang] = useState(initialLang);
  const [theme, setTheme] = useState(initialTheme);

  useEffect(() => {
    document.documentElement.lang = lang;
    write("sl-lang", lang);
  }, [lang]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    write("sl-theme", theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#0a1424" : "#0a2c52");
  }, [theme]);

  const t = useCallback((key, vars) => tl(lang, key, vars), [lang]);

  const value = useMemo(
    () => ({
      lang,
      theme,
      t,
      toggleLang: () => setLang((l) => (l === "en" ? "es" : "en")),
      toggleTheme: () => setTheme((m) => (m === "dark" ? "light" : "dark")),
    }),
    [lang, theme, t]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLang() {
  return useContext(Ctx);
}

// Renders both languages in the same spot and only shows the active one.
// The box always takes the size of the longer text, so switching language
// never moves anything on the page.
export function Bi({ en, es: spanish }) {
  const { lang } = useLang();
  if (en === spanish) return <>{en}</>;
  return (
    <x-t class="bi">
      <x-l class={lang === "en" ? "on" : "off"} aria-hidden={lang === "en" ? undefined : "true"}>{en}</x-l>
      <x-l class={lang === "es" ? "on" : "off"} aria-hidden={lang === "es" ? undefined : "true"}>{spanish}</x-l>
    </x-t>
  );
}

// <T k="English text" /> looks the text up in es.js. `vars` can be an object
// or a function of the language, for text with {placeholders}.
export function T({ k, vars }) {
  const v = (l) => (typeof vars === "function" ? vars(l) : vars);
  return <Bi en={tl("en", k, v("en"))} es={tl("es", k, v("es"))} />;
}
