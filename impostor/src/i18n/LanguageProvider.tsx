// impostor/src/i18n/LanguageProvider.tsx
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { translations, Lang, TranslationKey } from "./translations";

type Vars = Record<string, string | number>;

type LanguageContextType = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey, vars?: Vars) => string;
};

const LanguageContext = createContext<LanguageContextType | null>(null);

const LANG_KEY = "impostor_lang_v1";

function formatVars(text: string, vars?: Vars) {
  if (!vars) return text;
  return Object.keys(vars).reduce((acc, k) => {
    return acc.replaceAll(`{${k}}`, String(vars[k]));
  }, text);
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, _setLang] = useState<Lang>("en");

  // ✅ Cargar idioma guardado al iniciar
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(LANG_KEY);
        if (saved === "en" || saved === "es") _setLang(saved);
      } catch {}
    })();
  }, []);

  // ✅ setLang que persiste
  const setLang = useCallback((next: Lang) => {
    _setLang(next);
    AsyncStorage.setItem(LANG_KEY, next).catch(() => {});
  }, []);

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

  const ctx = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return <LanguageContext.Provider value={ctx}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
}