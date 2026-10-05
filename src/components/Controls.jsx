import Icon from "../Icon";
import { useLang } from "../i18n";

export default function Controls({ floating = false }) {
  const { lang, theme, t, toggleLang, toggleTheme } = useLang();
  const dark = theme === "dark";

  return (
    <div className={floating ? "controls controls-floating" : "controls"}>
      <button type="button" className="ctl-btn ctl-lang" onClick={toggleLang} aria-label={t("Switch language")}>
        <span className={lang === "en" ? "on" : ""}>EN</span>
        <span className={lang === "es" ? "on" : ""}>ES</span>
      </button>
      <button
        type="button"
        className="ctl-btn ctl-theme"
        onClick={toggleTheme}
        aria-label={dark ? t("Switch to light mode") : t("Switch to dark mode")}
      >
        <Icon name={dark ? "sun" : "moon"} size={18} />
      </button>
    </div>
  );
}
