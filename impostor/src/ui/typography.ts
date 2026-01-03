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
  | "settings_title";

const fontSizes: Record<Lang, Record<FontToken, number>> = {
  en: {
    home_play: 48,
    home_language: 36,
    home_settings: 36,

    language_option: 34,

    setup_label: 25,
    setup_number: 44,
    setup_next: 44,

    settings_title: 36,
  },
  es: {
    // Español suele necesitar un poquito menos si la palabra es más larga
    home_play: 48,
    home_language: 34,
    home_settings: 34,

    language_option: 38,

    setup_label: 22,
    setup_number: 44,
    setup_next: 32, // “SIGUIENTE” suele requerir menos que “NEXT”

    settings_title: 34,
  },
};

/** Helper: devuelve el size según idioma */
export function fs(lang: Lang, token: FontToken) {
  return fontSizes[lang][token];
}