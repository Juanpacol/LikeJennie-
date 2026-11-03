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

// Busca "grupo.clave" en el diccionario y reemplaza {nombre} por los valores de `vars`.
// Si la clave no existe en el idioma pedido, cae al inglés; si tampoco, devuelve la clave.
function translate(lang, key, vars = {}) {
  const find = (dictionary) => key.split(".").reduce((node, part) => node?.[part], dictionary);
  const text = find(DICTIONARIES[lang]) ?? find(DICTIONARIES[DEFAULT_LANG]);
  if (typeof text !== "string") return key;
  return text.replace(/\{(\w+)\}/g, (match, name) => vars[name] ?? match);
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
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage debe usarse dentro de LanguageProvider");
  return context;
}
