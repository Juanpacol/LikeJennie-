import GlobeIcon from "../icons/GlobeIcon";
import { useLanguage } from "../../context/LanguageContext";

// Botón de idioma: ícono de mundo y el código del idioma activo. Un toque alterna entre inglés y español.
function LanguageToggle({ className = "" }) {
  const { lang, toggleLang, t } = useLanguage();

  return (
    <button
      type="button"
      onClick={toggleLang}
      aria-label={t("nav.switchTo")}
      title={t("nav.language")}
      className={`relative flex items-center gap-1.5 after:absolute after:-inset-2 after:content-[''] ${className}`}
    >
      <GlobeIcon className="h-6 w-6" />
      <span className="font-mono text-[11px] uppercase tracking-[0.2em]">{lang}</span>
    </button>
  );
}

export default LanguageToggle;
