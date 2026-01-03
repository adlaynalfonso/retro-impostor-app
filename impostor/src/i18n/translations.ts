export type Lang = "en" | "es";

export const translations = {
  en: {
    // HOME
    home_play: "PLAY",
    home_language: "LANGUAGE",
    home_settings: "SETTINGS",

    // LANGUAGE
    language_title: "LANGUAGE",
    language_en: "ENGLISH",
    language_es: "SPANISH",

    // SETTINGS
    settings_title: "SETTINGS",

    // SETUP (players / impostors)
    setup_players: "PLAYERS",
    setup_impostors: "IMPOSTORS",
    setup_next: "NEXT",
  },
  es: {
    // HOME
    home_play: "JUGAR",
    home_language: "IDIOMA",
    home_settings: "AJUSTES",

    // LANGUAGE
    language_title: "IDIOMA",
    language_en: "INGLÉS",
    language_es: "ESPAÑOL",

    // SETTINGS
    settings_title: "AJUSTES",

    // SETUP (jugadores / impostores)
    setup_players: "JUGADORES",
    setup_impostors: "IMPOSTORES",
    setup_next: "SIGUIENTE",
  },
} as const;

export type TranslationKey = keyof typeof translations.en;