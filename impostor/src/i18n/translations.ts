export type Lang = "en" | "es";

export const translations = {
  en: {
    home_play: "PLAY",
    home_language: "LANGUAGE",
    home_settings: "SETTINGS",

    language_title: "LANGUAGE",
    language_en: "ENGLISH",
    language_es: "SPANISH",

    settings_title: "SETTINGS",
  },
  es: {
    home_play: "JUGAR",
    home_language: "IDIOMA",
    home_settings: "AJUSTES",

    language_title: "IDIOMA",
    language_en: "INGLÉS",
    language_es: "ESPAÑOL",

    settings_title: "AJUSTES",
  },
} as const;

export type TranslationKey = keyof typeof translations.en;