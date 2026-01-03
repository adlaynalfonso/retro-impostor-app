import React, { useMemo, useState } from "react";
import { Pressable, View, Image, StyleSheet, Text } from "react-native";
import { playClickSound } from "../../../sound/clickSound";

type Props = {
  width: number;
  height: number;

  countText: string;
  isMemory: boolean;

  onPressCounter: () => void;
  onPressMemory: () => void;
};

// ✅ Assets
// - counter_box_down.png: counter abajo (memory arriba)
// - btn_memory_down.png: memory abajo (counter arriba)
const counterDownFull = require("../../../../assets/ui/counter_box_down.png");
const memoryDownFull = require("../../../../assets/ui/btn_memory_down.png");

export default function ToggleBar({
  width,
  height,
  countText,
  isMemory,
  onPressCounter,
  onPressMemory,
}: Props) {
  // pressedSide solo para que se vea “down” mientras estás tocando
  const [pressedSide, setPressedSide] = useState<"counter" | "memory" | null>(null);

  const displayImg = useMemo(() => {
    if (pressedSide === "counter") return counterDownFull;
    if (pressedSide === "memory") return memoryDownFull;
    // estado estable
    return isMemory ? memoryDownFull : counterDownFull;
  }, [pressedSide, isMemory]);

  const leftW = Math.round(width * 0.42);
  const rightW = width - leftW;

  return (
    <View style={{ width, height }}>
      <Image source={displayImg} resizeMode="stretch" style={styles.absFill} />

      {/* HITBOX IZQUIERDA (COUNTER) */}
      <Pressable
        style={[styles.hit, { width: leftW, height, left: 0 }]}
        onPressIn={() => {
          setPressedSide("counter");
          playClickSound();
        }}
        onPressOut={() => setPressedSide(null)}
        onPress={() => onPressCounter()}
      />

      {/* HITBOX DERECHA (MEMORY) */}
      <Pressable
        style={[styles.hit, { width: rightW, height, right: 0 }]}
        onPressIn={() => {
          setPressedSide("memory");
          playClickSound();
        }}
        onPressOut={() => setPressedSide(null)}
        onPress={() => onPressMemory()}
      />

      {/* TEXTOS ENCIMA (posicionados para tu arte) */}
      <View pointerEvents="none" style={styles.textLayer}>
        <View style={[styles.counterArea, { width: leftW, height }]}>
          <Text style={styles.counterText} numberOfLines={1}>
            {countText}
          </Text>
        </View>

        <View style={[styles.memoryArea, { width: rightW, height }]}>
          <Text style={styles.memoryText} numberOfLines={1}>
            memory
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  absFill: { position: "absolute", inset: 0 },
  hit: { position: "absolute", top: 0 },

  textLayer: { position: "absolute", inset: 0, flexDirection: "row" },

  counterArea: {
    alignItems: "center",
    justifyContent: "center",
  },
  memoryArea: {
    alignItems: "center",
    justifyContent: "center",
  },
  counterText: {
    fontFamily: "PressStart2P",
    fontSize: 20,
    color: "#111",
    includeFontPadding: false,
    transform: [{ translateY: 2 }],
  },
  memoryText: {
    fontFamily: "PressStart2P",
    fontSize: 20,
    color: "#111",
    includeFontPadding: false,
    transform: [{ translateY: 2 }],
  },
});