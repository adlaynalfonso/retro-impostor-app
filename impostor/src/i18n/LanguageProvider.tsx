import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { translations, Lang, TranslationKey } from "./translations";

type Vars = Record<string, string | number>;

type LanguageContextType = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey, vars?: Vars) => string;
};

const LanguageContext = createContext<LanguageContextType | null>(null);

function formatVars(text: string, vars?: Vars) {
  if (!vars) return text;
  return Object.keys(vars).reduce((acc, k) => {
    return acc.replaceAll(`{${k}}`, String(vars[k]));
  }, text);
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");

  const t = useCallback(
    (key: TranslationKey, vars?: Vars) => {
      const value = translations[lang][key];

      // ✅ Si falta una key, lo verás INMEDIATO en pantalla y consola
      if (value == null) {
        console.warn(`[i18n] Missing key "${key}" for lang "${lang}"`);
        return String(key);
      }

      return formatVars(value, vars);
    },
    [lang]
  );

  const ctx = useMemo(() => ({ lang, setLang, t }), [lang, t]);

  return <LanguageContext.Provider value={ctx}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
}