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
  const { t } = useLanguage();
  const { width: W, height: H } = useWindowDimensions();

  const [players, setPlayers] = useState<number>(10);
  const [impostors, setImpostors] = useState<number>(1);

  const maxImpostors = useMemo(() => players, [players]);

  // ---------- Layout responsive ----------
  const contentW = Math.min(W - 44, 420);

  // Un poco más pequeñas para que "respire"
  const labelW = contentW;
  const labelH = Math.round(contentW * 0.22);

  // Flechas más hacia el centro
  const arrowW = Math.round(contentW * 0.20);
  const arrowH = Math.round(arrowW * 0.82);

  // Caja del número centrada y estable
  const numberW = Math.round(contentW * 0.30);
  const numberH = arrowH;

  // “Aire”
  const topPad = Math.round(Math.max(52, H * 0.08));
  const sectionGap = Math.round(Math.max(22, contentW * 0.06));
  const rowTop = 12;

  // Next más abajo y un poco más pequeño
  const nextW = Math.round(contentW * 0.92);
  const nextH = Math.round(nextW * 0.42);

  // Texto del botón: evitar que se corte
  const nextFont = Math.max(30, Math.round(contentW * 0.10));

  // ---------- Lógica ----------
  const incPlayers = () => setPlayers((p) => clamp(p + 1, MIN_PLAYERS, MAX_PLAYERS));

  const decPlayers = () => {
    setPlayers((p) => {
      const nextPlayers = clamp(p - 1, MIN_PLAYERS, MAX_PLAYERS);
      setImpostors((imp) => clamp(imp, MIN_IMPOSTORS, nextPlayers));
      return nextPlayers;
    });
  };

  const incImpostors = () => setImpostors((imp) => clamp(imp + 1, MIN_IMPOSTORS, maxImpostors));
  const decImpostors = () => setImpostors((imp) => clamp(imp - 1, MIN_IMPOSTORS, maxImpostors));

  const playersLeftDisabled = players <= MIN_PLAYERS;
  const playersRightDisabled = players >= MAX_PLAYERS;

  const impostorsLeftDisabled = impostors <= MIN_IMPOSTORS;
  const impostorsRightDisabled = impostors >= maxImpostors;

  const goNext = () => {
    router.push({
      pathname: "/names",
      params: { players: String(players), impostors: String(impostors) },
    });
  };

  return (
    <View style={[styles.screen, { paddingTop: topPad }]}>
      {/* JUGADORES */}
      <ImageBackground
        source={labelBoxUp}
        resizeMode="contain"
        style={[styles.labelBox, { width: labelW, height: labelH }]}
      >
        <Text style={styles.labelText}>{t("setup_players")}</Text>
      </ImageBackground>

      <View style={[styles.row, { width: contentW, marginTop: rowTop }]}>
        <View style={{ width: arrowW, height: arrowH, opacity: playersLeftDisabled ? 0.55 : 1 }}>
          <PixelButton
            up={arrowLeftUp}
            down={arrowLeftDown}
            text=""
            width={arrowW}
            height={arrowH}
            onPress={() => {
              if (!playersLeftDisabled) decPlayers();
            }}
            contentUp={{ top: 0, bottom: 0, left: 0, right: 0 }}
            contentDown={{ top: 0, bottom: 0, left: 0, right: 0 }}
          />
        </View>

        {/* Number box centrado */}
        <View style={{ width: numberW, height: numberH, alignItems: "center", justifyContent: "center" }}>
          <Image source={numberBoxUp} resizeMode="contain" style={styles.absFill} />
          <View pointerEvents="none" style={styles.numberOverlay}>
            <Text style={styles.numberText}>{players}</Text>
          </View>
        </View>

        <View style={{ width: arrowW, height: arrowH, opacity: playersRightDisabled ? 0.55 : 1 }}>
          <PixelButton
            up={arrowRightUp}
            down={arrowRightDown}
            text=""
            width={arrowW}
            height={arrowH}
            onPress={() => {
              if (!playersRightDisabled) incPlayers();
            }}
            contentUp={{ top: 0, bottom: 0, left: 0, right: 0 }}
            contentDown={{ top: 0, bottom: 0, left: 0, right: 0 }}
          />
        </View>
      </View>

      <View style={{ height: sectionGap }} />

      {/* IMPOSTORES */}
      <ImageBackground
        source={labelBoxUp}
        resizeMode="contain"
        style={[styles.labelBox, { width: labelW, height: labelH }]}
      >
        <Text style={styles.labelText}>{t("setup_impostors")}</Text>
      </ImageBackground>

      <View style={[styles.row, { width: contentW, marginTop: rowTop }]}>
        <View style={{ width: arrowW, height: arrowH, opacity: impostorsLeftDisabled ? 0.55 : 1 }}>
          <PixelButton
            up={arrowLeftUp}
            down={arrowLeftDown}
            text=""
            width={arrowW}
            height={arrowH}
            onPress={() => {
              if (!impostorsLeftDisabled) decImpostors();
            }}
            contentUp={{ top: 0, bottom: 0, left: 0, right: 0 }}
            contentDown={{ top: 0, bottom: 0, left: 0, right: 0 }}
          />
        </View>

        <View style={{ width: numberW, height: numberH, alignItems: "center", justifyContent: "center" }}>
          <Image source={numberBoxUp} resizeMode="contain" style={styles.absFill} />
          <View pointerEvents="none" style={styles.numberOverlay}>
            <Text style={styles.numberText}>{impostors}</Text>
          </View>
        </View>

        <View style={{ width: arrowW, height: arrowH, opacity: impostorsRightDisabled ? 0.55 : 1 }}>
          <PixelButton
            up={arrowRightUp}
            down={arrowRightDown}
            text=""
            width={arrowW}
            height={arrowH}
            onPress={() => {
              if (!impostorsRightDisabled) incImpostors();
            }}
            contentUp={{ top: 0, bottom: 0, left: 0, right: 0 }}
            contentDown={{ top: 0, bottom: 0, left: 0, right: 0 }}
          />
        </View>
      </View>

      {/* NEXT más abajo */}
      <View style={{ height: Math.round(sectionGap * 1.25) }} />

      <PixelButton
        up={nextUp}
        down={nextDown}
        text={t("setup_next")}
        width={nextW}
        height={nextH}
        fontSize={nextFont}
        onPress={goNext}
        // Ajuste para que “siguiente” no se corte y quede centrado
        contentUp={{ top: 22, bottom: 48, left: 26, right: 26 }}
        contentDown={{ top: 36, bottom: 32, left: 26, right: 26 }}
      />

      {/* aire abajo */}
      <View style={{ height: Math.round(Math.max(26, H * 0.05)) }} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#9368A1",
    alignItems: "center",
  },
  labelBox: {
    alignItems: "center",
    justifyContent: "center",
  },
  // ✅ gris oscuro (en vez de blanco)
  labelText: {
    fontFamily: "PressStart2P",
    fontSize: 18,
    color: "#6A6A6A",
    includeFontPadding: false,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  absFill: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  numberOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  numberText: {
    fontFamily: "PressStart2P",
    fontSize: 44,
    color: "#000",
    includeFontPadding: false,
    textAlign: "center",
  },
});