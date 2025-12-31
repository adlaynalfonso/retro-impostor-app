import { Audio } from "expo-av";

let sound: Audio.Sound | null = null;
let loading = false;

export async function playClickSound() {
  try {
    // Evita cargar 2 veces a la vez
    if (loading) return;

    // Carga 1 sola vez
    if (!sound) {
      loading = true;
      sound = new Audio.Sound();
      await sound.loadAsync(require("../../assets/sfx/click.wav"));
      await sound.setVolumeAsync(1.0);
      loading = false;
    }

    // Rebobina y reproduce
    await sound.setPositionAsync(0);
    await sound.playAsync();
  } catch (e) {
    // Si falla, no rompas la app
    // (si quieres luego lo logueamos)
  } finally {
    loading = false;
  }
}