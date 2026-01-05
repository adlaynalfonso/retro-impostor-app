// impostor/src/i18n/translations.ts
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

    // NAMES SCREEN
    names_title: "NAMES",
    names_addNew: "ADD NEW",
    names_memory: "MEMORY",
    names_empty_party: "NO NAMES YET",
    names_empty_memory: "NO SAVED NAMES",

    // NAMES MODAL
    names_modal_title: "NEW NAME",
    names_modal_placeholder: "TYPE A NAME",
    names_modal_cancel: "CANCEL",
    names_modal_add: "ADD",

    // HINT (usar en modal y/o pantalla)
    names_modal_hint: "TIP: TAP A NAME TO REMOVE IT (ONLY IN NORMAL MODE).",

    // NAMES ALERTS
    names_alert_missing_title: "MISSING NAMES",
    names_alert_missing_body: "YOU NEED {n} NAMES TO CONTINUE.",

    // ROUND
    round_im: "I AM",

    // REVEAL
    reveal_hint: "HOLD THE BUTTON\nTO REVEAL THE WORD",
    reveal_press: "PRESS",
    reveal_impostor: "IMPOSTOR",

    // SHOW
    show_title: "RESULT",
    show_impostors: "IMPOSTOR(S):",
    show_word: "WORD:",
    show_home: "HOME",
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

    // NAMES SCREEN
    names_title: "NOMBRES",
    names_addNew: "AGREGAR",
    names_memory: "MEMORIA",
    names_empty_party: "AÚN NO HAY NOMBRES",
    names_empty_memory: "NO HAY NOMBRES GUARDADOS",

    // NAMES MODAL
    names_modal_title: "NUEVO NOMBRE",
    names_modal_placeholder: "ESCRIBE UN NOMBRE",
    names_modal_cancel: "CANCELAR",
    names_modal_add: "AGREGAR",

    // HINT (usar en modal y/o pantalla)
    names_modal_hint: "TIP: TOCA UN NOMBRE PARA ELIMINARLO (SOLO EN MODO NORMAL).",

    // NAMES ALERTS
    names_alert_missing_title: "FALTAN NOMBRES",
    names_alert_missing_body: "NECESITAS {n} NOMBRES PARA CONTINUAR.",

    // ROUND
    round_im: "SI SOY",

    // REVEAL
    reveal_hint: "DEJA EL BOTÓN PRESIONADO\nPARA REVELAR LA PALABRA",
    reveal_press: "PRESIONA",
    reveal_impostor: "IMPOSTOR",

    // SHOW
    show_title: "RESULTADO",
    show_impostors: "IMPOSTOR(ES):",
    show_word: "PALABRA:",
    show_home: "INICIO",
  },
} as const;

export type TranslationKey = keyof typeof translations.en;