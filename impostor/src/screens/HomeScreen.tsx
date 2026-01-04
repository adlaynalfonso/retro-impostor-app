import React from "react";
import { ImageBackground, StyleSheet, useWindowDimensions } from "react-native";
import PixelButton from "../components/PixelButton";

const bg = require("../../assets/images/bg.png");
const btnUp = require("../../assets/ui/btn_up.png");
const btnDown = require("../../assets/ui/btn_down.png");

export default function HomeScreen({ onStart }: { onStart: () => void }) {
  const { width: W } = useWindowDimensions();

  const contentW = Math.min(W - 40, 420);
  const btnW = Math.round(contentW * 0.92);
  const btnH = Math.round(btnW * 0.42);

  return (
    <ImageBackground source={bg} style={styles.container}>
      <PixelButton
        up={btnUp}
        down={btnDown}
        text=""              // ✅ obligatorio (aunque no uses texto)
        width={btnW}         // ✅ obligatorio
        height={btnH}        // ✅ obligatorio
        onPress={onStart}
        contentUp={{ top: 0, bottom: 0, left: 0, right: 0 }}
        contentDown={{ top: 0, bottom: 0, left: 0, right: 0 }}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
});