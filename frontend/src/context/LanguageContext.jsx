import { createContext, useContext, useEffect, useState } from "react";
import en from "../i18n/en";
import es from "../i18n/es";

const DICTIONARIES = { en, es };
const STORAGE_KEY = "ruby_lang";
const DEFAULT_LANG = "en";

// Idioma guardado en el navegador; si no hay (o el acceso falla) se usa el inglés.
function readStoredLang() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored in DICTIONARIES ? stored : DEFAULT_LANG;
  } catch {
    return DEFAULT_LANG;
  }
}

// Busca "grupo.clave" en el diccionario del idioma; si no existe cae al inglés. Devuelve undefined si
// no hay texto en ninguno de los dos.
function lookup(lang, key) {
  const find = (dictionary) =>
    key.split(".").reduce((node, part) => node?.[part], dictionary);
  const text = find(DICTIONARIES[lang]) ?? find(DICTIONARIES[DEFAULT_LANG]);
  return typeof text === "string" ? text : undefined;
}

// Reemplaza {nombre} por los valores de `vars`.
function fill(text, vars = {}) {
  return text.replace(/\{(\w+)\}/g, (match, name) => vars[name] ?? match);
}

// `fallback` es lo que se devuelve si la clave no existe (por defecto, la propia clave).
function translate(lang, key, vars, fallback = key) {
  const text = lookup(lang, key);
  return text === undefined ? fallback : fill(text, vars);
}

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(readStoredLang);

  // Mantiene <html lang> al día (lectores de pantalla, traductor del navegador) y recuerda la elección.
  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Sin almacenamiento (modo privado): el idioma dura solo esta visita.
    }
  }, [lang]);

  const value = {
    lang,
    setLang,
    toggleLang: () => setLang((current) => (current === "en" ? "es" : "en")),
    t: (key, vars) => translate(lang, key, vars),
    // Para datos que vienen de la base (tallas, colores): si no hay traducción, muestra el valor tal cual.
    tOr: (key, fallback) => translate(lang, key, undefined, fallback),
    // Texto de un error de la API en el idioma actual: usa su `code`; si no hay traducción, su mensaje.
    // `forceLang` fija el idioma (el panel admin siempre va en español).
    tError: (error, forceLang = lang) =>
      translate(
        forceLang,
        `errors.${error?.code}`,
        undefined,
        error?.message ?? "",
      ),
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context)
    throw new Error("useLanguage debe usarse dentro de LanguageProvider");
  return context;
}
