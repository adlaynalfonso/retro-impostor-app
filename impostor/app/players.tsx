import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  useWindowDimensions,
} from "react-native";
import { router } from "expo-router";

import PixelButton from "../src/components/PixelButton";
import { useLanguage } from "../src/i18n/LanguageProvider";
import { fs } from "../src/ui/typography"; // ✅ NUEVO

const MIN_PLAYERS = 3;
const MAX_PLAYERS = 33;
const MIN_IMPOSTORS = 1;

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

// PNGs
const arrowLeftUp = require("../assets/ui/arrow_left_up.png");
const arrowLeftDown = require("../assets/ui/arrow_left_down.png");
const arrowRightUp = require("../assets/ui/arrow_right_up.png");
const arrowRightDown = require("../assets/ui/arrow_right_down.png");

const nextUp = require("../assets/ui/btn_next_up.png");
const nextDown = require("../assets/ui/btn_next_down.png");

const labelBoxUp = require("../assets/ui/label_box_up.png");
const numberBoxUp = require("../assets/ui/number_box_up.png");

export default function PlayersSetupScreen() {
  const { t, lang } = useLanguage(); // ✅ NUEVO: lang
  const { width: W } = useWindowDimensions();

  const [players, setPlayers] = useState(10);
  const [impostors, setImpostors] = useState(1);

  const maxImpostors = useMemo(() => players, [players]);

  // 🔧 TUS VALORES (NO LOS TOCO)
  const SPACE_TOP = 125;
  const SPACE_LABEL_TO_ROW = 50;
  const SPACE_SECTION = 42;
  const SPACE_BEFORE_NEXT = 90;
  const SPACE_BOTTOM = 42;

  // 🔧 AJUSTES FINOS
  const ROW_GAP = 12; // separacion entre flecha - numero - flecha

  // Compensa padding distinto en los PNG de flechas (para que queden simétricas)
  const ARROW_NUDGE_LEFT = 6; // + empuja a la derecha
  const ARROW_NUDGE_RIGHT = -14; // - empuja a la izquierda

  // ✅ Centrado del texto dentro del label (sube/baja)
  const LABEL_TEXT_NUDGE_Y = 2; // prueba 6, 8, 10

  // Tamaños
  const contentW = Math.min(W - 40, 420);
  const arrowW = Math.round(contentW * 0.2);
  const arrowH = Math.round(arrowW * 0.82);
  const numberW = Math.round(contentW * 0.32);
  const numberH = arrowH;
  const labelW = contentW;
  const labelH = Math.round(contentW * 0.22);
  const nextW = Math.round(contentW * 0.92);
  const nextH = Math.round(nextW * 0.42);
  const nextFont = Math.max(30, Math.round(contentW * 0.1)); // ✅ tu valor se mantiene

  // ✅ NUEVO: tamaños por idioma desde typography.ts
  const labelFont = fs(lang, "setup_label");
  const numberFont = fs(lang, "setup_number");
  const nextFontByLang = fs(lang, "setup_next");

  // Lógica
  const incPlayers = () =>
    setPlayers((p) => clamp(p + 1, MIN_PLAYERS, MAX_PLAYERS));
  const decPlayers = () => {
    setPlayers((p) => {
      const np = clamp(p - 1, MIN_PLAYERS, MAX_PLAYERS);
      setImpostors((i) => clamp(i, MIN_IMPOSTORS, np));
      return np;
    });
  };

  const incImpostors = () =>
    setImpostors((i) => clamp(i + 1, MIN_IMPOSTORS, maxImpostors));
  const decImpostors = () =>
    setImpostors((i) => clamp(i - 1, MIN_IMPOSTORS, maxImpostors));

  const goNext = () => {
    router.push({
      pathname: "/names",
      params: { players: String(players), impostors: String(impostors) },
    });
  };

  const ArrowSlot = ({
    dir,
    onPress,
  }: {
    dir: "left" | "right";
    onPress: () => void;
  }) => {
    const isLeft = dir === "left";
    const translateX = isLeft ? ARROW_NUDGE_LEFT : ARROW_NUDGE_RIGHT;

    return (
      <View style={[styles.arrowSlot, { width: arrowW, height: arrowH }]}>
        <View style={{ transform: [{ translateX }] }}>
          <PixelButton
            up={isLeft ? arrowLeftUp : arrowRightUp}
            down={isLeft ? arrowLeftDown : arrowRightDown}
            text=""
            width={arrowW}
            height={arrowH}
            onPress={onPress}
            contentUp={{ top: 0, bottom: 0, left: 0, right: 0 }}
            contentDown={{ top: 0, bottom: 0, left: 0, right: 0 }}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.screen}>
      <View style={{ height: SPACE_TOP }} />

      {/* PLAYERS LABEL */}
      <ImageBackground
        source={labelBoxUp}
        resizeMode="contain"
        style={[styles.labelBg, { width: labelW, height: labelH }]}
      >
        <View style={[styles.labelInner, { paddingTop: LABEL_TEXT_NUDGE_Y }]}>
          <Text style={[styles.labelText, { fontSize: labelFont }]}>
            {t("setup_players")}
          </Text>
        </View>
      </ImageBackground>

      <View style={{ height: SPACE_LABEL_TO_ROW }} />

      {/* PLAYERS ROW */}
      <View style={[styles.row, { width: contentW, gap: ROW_GAP }]}>
        <ArrowSlot dir="left" onPress={decPlayers} />

        <View style={{ width: numberW, height: numberH }}>
          <Image
            source={numberBoxUp}
            resizeMode="contain"
            style={styles.absFill}
          />
          <View style={styles.numberOverlay}>
            <Text style={[styles.numberText, { fontSize: numberFont }]}>
              {players}
            </Text>
          </View>
        </View>

        <ArrowSlot dir="right" onPress={incPlayers} />
      </View>

      <View style={{ height: SPACE_SECTION }} />

      {/* IMPOSTORS LABEL */}
      <ImageBackground
        source={labelBoxUp}
        resizeMode="contain"
        style={[styles.labelBg, { width: labelW, height: labelH }]}
      >
        <View style={[styles.labelInner, { paddingTop: LABEL_TEXT_NUDGE_Y }]}>
          <Text style={[styles.labelText, { fontSize: labelFont }]}>
            {t("setup_impostors")}
          </Text>
        </View>
      </ImageBackground>

      <View style={{ height: SPACE_LABEL_TO_ROW }} />

      {/* IMPOSTORS ROW */}
      <View style={[styles.row, { width: contentW, gap: ROW_GAP }]}>
        <ArrowSlot dir="left" onPress={decImpostors} />

        <View style={{ width: numberW, height: numberH }}>
          <Image
            source={numberBoxUp}
            resizeMode="contain"
            style={styles.absFill}
          />
          <View style={styles.numberOverlay}>
            <Text style={[styles.numberText, { fontSize: numberFont }]}>
              {impostors}
            </Text>
          </View>
        </View>

        <ArrowSlot dir="right" onPress={incImpostors} />
      </View>

      <View style={{ height: SPACE_BEFORE_NEXT }} />

      {/* ✅ NEXT con animación real (pos A arriba / pos B presionado) */}
      <PixelButton
        up={nextUp}
        down={nextDown}
        text={t("setup_next")}
        width={nextW}
        height={nextH}
        fontSize={nextFontByLang}
        textColor="#ffffffff" // ✅ NUEVO: color del texto NEXT
        onPress={goNext}
        // A (arriba): sube el texto un poco
        contentUp={{ top: 38, bottom: 42, left: 26, right: 26 }}
        // B (presionado): baja el texto (simula hundido)
        contentDown={{ top: 58, bottom: 42, left: 26, right: 26 }}
      />

      <View style={{ height: SPACE_BOTTOM }} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#9368A1",
    alignItems: "center",
  },

  labelBg: {
    alignSelf: "center",
  },
  labelInner: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  labelText: {
    fontFamily: "PressStart2P",
    color: "#646464ff",
    textAlign: "center",
    includeFontPadding: false,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  arrowSlot: {
    alignItems: "center",
    justifyContent: "center",
  },

  absFill: {
    position: "absolute",
    inset: 0,
  },
  numberOverlay: {
    position: "absolute",
    inset: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  numberText: {
    fontFamily: "PressStart2P",
    color: "#000000ff",
    includeFontPadding: false,
  },
});