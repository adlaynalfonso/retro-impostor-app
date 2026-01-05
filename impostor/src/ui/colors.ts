/**
 * Color de fondo para rounds.
 * H = aleatorio
 * S = fija (consistencia)
 * L = rango seguro (no blanco / no negro)
 */
export function getRoundBackgroundColor() {
  const hue = Math.floor(Math.random() * 360); // color aleatorio
  const saturation = 50; // 👈 controla intensidad (50–70 recomendado)
  const lightness = 35 + Math.floor(Math.random() * 20); 
  // rango 35–55 → nunca negro ni blanco

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}