import React, { useEffect, useMemo, useState } from "react";
import { Pressable, Image, StyleSheet, Text, View } from "react-native";
import { playClickSound } from "../sound/clickSound"; // ajusta ruta si hace falta

type Insets = { top: number; bottom: number; left: number; right: number };

type Props = {
  up: any;
  down: any;
  text: string;

  // ✅ Opcional para que <Link asChild> pueda inyectar su propio onPress
  onPress?: () => void;

  width: number;
  height: number;
  fontSize?: number;

  contentUp?: Insets;
  contentDown?: Insets;

  // ✅ Opcionales para enganchar cosas desde fuera sin romper <Link asChild>
  onPressIn?: () => void;
  onPressOut?: () => void;
};

export default function PixelButton({
  up,
  down,
  text,
  onPress,
  width,
  height,
  fontSize = 30,
  contentUp = { top: 14, bottom: 52, left: 18, right: 18 },
  contentDown = { top: 26, bottom: 40, left: 18, right: 18 },
  onPressIn,
  onPressOut,
}: Props) {
  const [isDown, setIsDown] = useState(false);

  // ✅ Evita recrear objetos (menos re-renders inútiles)
  const sizeStyle = useMemo(() => ({ width, height }), [width, height]);

  // ✅ “Calienta” el decode (reduce micro-lag al primer render)
  useEffect(() => {
    Image.resolveAssetSource(up);
    Image.resolveAssetSource(down);
  }, [up, down]);

  const box = isDown ? contentDown : contentUp;

  return (
    <Pressable
      style={sizeStyle}
      // ✅ Sonido + estado AL TOCAR (no al soltar)
      onPressIn={() => {
        setIsDown(true);
        playClickSound();
        onPressIn?.();
      }}
      onPressOut={() => {
        setIsDown(false);
        onPressOut?.();
      }}
      // ✅ CLAVE: NO pongas fallback (()=>{}) aquí.
      // Si <Link asChild> inyecta onPress, lo usará.
      // Si no, simplemente no pasa nada (no crashea).
      onPress={onPress}
    >
      <View style={sizeStyle}>
        {/* ✅ Renderiza AMBAS siempre; solo cambia opacidad => no hay “lag” */}
        <Image
          source={up}
          style={[styles.img, sizeStyle, { opacity: isDown ? 0 : 1 }]}
          resizeMode="stretch"
        />
        <Image
          source={down}
          style={[styles.img, sizeStyle, { opacity: isDown ? 1 : 0 }]}
          resizeMode="stretch"
        />

        {/* ✅ Texto centrado usando la “caja” A/B (no offsets por px) */}
        <View
          pointerEvents="none"
          style={[
            styles.innerBox,
            {
              top: box.top,
              left: box.left,
              right: box.right,
              bottom: box.bottom,
            },
          ]}
        >
          <Text style={[styles.text, { fontSize }]} numberOfLines={1}>
            {text}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  img: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  innerBox: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontFamily: "PressStart2P",
    color: "#000",
    textAlign: "center",
    includeFontPadding: false,
  },
});