import React, { useEffect, useMemo, useState } from "react";
import { Image, Pressable, StyleSheet, View, Text } from "react-native";
import { playClickSound } from "../../../sound/clickSound";

type Side = "counter" | "memory";
type Insets = { top: number; bottom?: number; left?: number; right?: number };

type Props = {
  width: number;
  height: number;

  countText: string;              // "0/10"
  active: Side;                   // estado real (counter|memory)
  onChange: (next: Side) => void; // cambia estado real

  // ✅ CAMBIO: tamaños separados
  countFontSize: number;          // tamaño de "0/10"
  memoryFontSize: number;         // tamaño de "memory"

  // ✅ texto traducible para "memory"
  memoryText?: string;

  /**
   * Ajuste MANUAL de posiciones:
   * - "Up" = cuando esa parte está levantada
   * - "Down" = cuando esa parte está presionada
   */
  countUpPos?: Insets;
  countDownPos?: Insets;
  memoryUpPos?: Insets;
  memoryDownPos?: Insets;

  /**
   * Ajuste de áreas clic (por si quieres afinar)
   * leftRatio = % que ocupa el lado counter
   */
  leftRatio?: number; // default 0.46

  // (opcional) colores por si un día quieres
  countTextColor?: string;
  memoryTextColor?: string;
};

// PNGs
const counterUp = require("../../../../assets/ui/counter_box_up.png");
const counterDown = require("../../../../assets/ui/counter_box_down.png"); // (memory presionado)

export default function ToggleBar({
  width,
  height,
  countText,
  active,
  onChange,

  // ✅ CAMBIO
  countFontSize,
  memoryFontSize,

  // ✅ texto
  memoryText = "memory",

  // Defaults razonables (ajústalos a tu gusto)
  countUpPos = { left: 38, top: 28 },
  countDownPos = { left: 38, top: 38 },

  memoryUpPos = { right: 28, top: 22 },
  memoryDownPos = { right: 28, top: 32 },

  leftRatio = 0.46,

  countTextColor = "#111",
  memoryTextColor = "#111",
}: Props) {
  // “pressedSide” SOLO para animación instantánea
  const [pressedSide, setPressedSide] = useState<Side | null>(null);

  // ✅ un solo estado visual controla PNG + textos (cero des-sync)
  const visualActive: Side = pressedSide ?? active;

  // En tu arte: counterDown = “memory presionado”
  const showDownImage = useMemo(() => visualActive === "memory", [visualActive]);

  // posiciones: si counter está presionado => count usa DOWN, memory usa UP
  const countBox = visualActive === "counter" ? countDownPos : countUpPos;
  const memoryBox = visualActive === "memory" ? memoryDownPos : memoryUpPos;

  useEffect(() => {
    Image.resolveAssetSource(counterUp);
    Image.resolveAssetSource(counterDown);
  }, []);

  const leftW = width * leftRatio;
  const rightW = width - leftW;

  return (
    <View style={{ width, height }}>
      {/* PNGs superpuestos */}
      <Image
        source={counterUp}
        style={[styles.img, { width, height, opacity: showDownImage ? 0 : 1 }]}
        resizeMode="stretch"
      />
      <Image
        source={counterDown}
        style={[styles.img, { width, height, opacity: showDownImage ? 1 : 0 }]}
        resizeMode="stretch"
      />

      {/* HITBOX izquierda (counter) */}
      <Pressable
        style={[styles.hit, { left: 0, width: leftW, height }]}
        onPressIn={() => {
          setPressedSide("counter");
          playClickSound();
        }}
        onPressOut={() => setPressedSide(null)}
        onPress={() => onChange("counter")}
      />

      {/* HITBOX derecha (memory) */}
      <Pressable
        style={[styles.hit, { left: leftW, width: rightW, height }]}
        onPressIn={() => {
          setPressedSide("memory");
          playClickSound();
        }}
        onPressOut={() => setPressedSide(null)}
        onPress={() => onChange("memory")}
      />

      {/* Texto contador (0/10) */}
      <View
        pointerEvents="none"
        style={[
          styles.textBox,
          {
            left: countBox.left,
            right: countBox.right,
            top: countBox.top,
            bottom: countBox.bottom,
          },
        ]}
      >
        <Text
          style={[styles.text, { fontSize: countFontSize, color: countTextColor }]}
          numberOfLines={1}
        >
          {countText}
        </Text>
      </View>

      {/* Texto memory */}
      <View
        pointerEvents="none"
        style={[
          styles.textBox,
          {
            left: memoryBox.left,
            right: memoryBox.right,
            top: memoryBox.top,
            bottom: memoryBox.bottom,
          },
        ]}
      >
        <Text
          style={[styles.text, { fontSize: memoryFontSize, color: memoryTextColor }]}
          numberOfLines={1}
        >
          {memoryText}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  img: { position: "absolute", top: 0, left: 0 },
  hit: { position: "absolute", top: 0, backgroundColor: "transparent" },

  textBox: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontFamily: "PressStart2P",
    includeFontPadding: false,
    textAlign: "center",
  },
});