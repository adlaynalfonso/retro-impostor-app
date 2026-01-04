// impostor/src/ui/typography.ts
import type { Lang } from "../i18n/translations";

/**
 * Tokens = “lugares” donde aparece texto.
 * Tú controlas tamaños por idioma aquí.
 */
export type FontToken =
  // Home
  | "home_play"
  | "home_language"
  | "home_settings"

  // Language screen
  | "language_option"

  // Setup (players screen)
  | "setup_label"
  | "setup_number"
  | "setup_next"

  // Settings
  | "settings_title"

  // ===== NAMES SCREEN =====
  | "names_title"
  | "names_addNew"
  | "names_memory"
  | "names_counter"
  | "names_list"
  | "names_empty"

  // Names modal
  | "names_modal_title"
  | "names_modal_input"
  | "names_modal_button"
  | "names_modal_hint";

const fontSizes: Record<Lang, Record<FontToken, number>> = {
  en: {
    // HOME
    home_play: 48,
    home_language: 36,
    home_settings: 36,

    // LANGUAGE
    language_option: 34,

    // SETUP
    setup_label: 25,
    setup_number: 44,
    setup_next: 44,

    // SETTINGS
    settings_title: 36,

    // ===== NAMES =====
    names_title: 34,        // "NAMES"
    names_addNew: 28,       // "ADD NEW"
    names_memory: 26,       // "MEMORY"
    names_counter: 28,      // "0/10"
    names_list: 26,         // nombres dentro del panel
    names_empty: 26,        // "NO NAMES YET"

    // MODAL
    names_modal_title: 16,  // "NEW NAME"
    names_modal_input: 14,  // input text
    names_modal_button: 12, // ADD / CANCEL
    names_modal_hint: 10,   // tip inferior
  },

  es: {
    // HOME
    home_play: 48,
    home_language: 34,
    home_settings: 34,

    // LANGUAGE
    language_option: 38,

    // SETUP
    setup_label: 22,
    setup_number: 44,
    setup_next: 32, // “SIGUIENTE”

    // SETTINGS
    settings_title: 34,

    // ===== NAMES =====
    names_title: 32,        // "NOMBRES"
    names_addNew: 24,       // "AGREGAR"
    names_memory: 12,       // "MEMORIA"
    names_counter: 26,      // "0/10"
    names_list: 24,         // nombres suelen ser más largos en ES
    names_empty: 24,        // "AÚN NO HAY NOMBRES"

    // MODAL
    names_modal_title: 15,
    names_modal_input: 14,
    names_modal_button: 12,
    names_modal_hint: 10,
  },
};

/** Helper: devuelve el size según idioma */
export function fs(lang: Lang, token: FontToken) {
  return fontSizes[lang][token];
}