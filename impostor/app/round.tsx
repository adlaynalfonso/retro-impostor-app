import React, { useEffect, useMemo } from "react";
import { View, Text, StyleSheet, BackHandler } from "react-native";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import PixelButton from "../src/components/PixelButton";
import { useLanguage } from "../src/i18n/LanguageProvider";

const btnUp = require("../assets/buttons/btn_primary_up.png");
const btnDown = require("../assets/buttons/btn_primary_down.png");

/**
 * 🎨 Color estable durante TODA la ronda
 * Saturado, nunca blanco ni negro
 */
function getRoundBackgroundColor() {
  const hue = Math.floor(Math.random() * 360);
  const saturation = 65;
  const lightness = 35 + Math.floor(Math.random() * 20); // 35–55
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

/**
 * 🧠 Tamaño máximo del nombre según longitud
 */
function getBestNameFontSize(name: string) {
  const n = (name ?? "").trim().length;
  if (n <= 4) return 72;
  if (n <= 7) return 64;
  if (n <= 10) return 56;
  if (n <= 14) return 44;
  if (n <= 18) return 36;
  return 30;
}

export default function RoundScreen() {
  const { t } = useLanguage();
  const navigation = useNavigation();

  const params = useLocalSearchParams<{
    order?: string;
    i?: string;
    impostorIndices?: string;
    word?: string;
  }>();

  const backgroundColor = useMemo(() => getRoundBackgroundColor(), []);

  // 🚫 BLOQUEAR BACK (gesto + botón físico)
  useEffect(() => {
    navigation.setOptions?.({ gestureEnabled: false });
    const sub = BackHandler.addEventListener("hardwareBackPress", () => true);
    return () => sub.remove();
  }, [navigation]);

  const order = useMemo(() => {
    try {
      const arr = JSON.parse(params.order ?? "[]");
      return Array.isArray(arr) ? (arr as string[]) : [];
    } catch {
      return [];
    }
  }, [params.order]);

  const impostorIndices = useMemo(() => {
    try {
      const arr = JSON.parse(params.impostorIndices ?? "[]");
      if (!Array.isArray(arr)) return [];
      return arr.map((x) => Number(x)).filter((n) => Number.isFinite(n));
    } catch {
      return [];
    }
  }, [params.impostorIndices]);

  const i = Number(params.i ?? "0") || 0;
  const word = String(params.word ?? "PIZZA");

  // 🛑 Seguridad extra
  if (!order.length || i >= order.length) {
    router.replace({
      pathname: "/show",
      params: {
        order: JSON.stringify(order),
        impostorIndices: JSON.stringify(impostorIndices),
        word,
      },
    });
    return null;
  }

  const playerName = order[i] ?? "";
  const nameFontSize = getBestNameFontSize(playerName);

  const goImHere = () => {
    router.push({
      pathname: "/reveal",
      params: {
        order: JSON.stringify(order),
        i: String(i),
        impostorIndices: JSON.stringify(impostorIndices),
        word,
      },
    });
  };

  // 🎯 CONTROL MANUAL DEL BOTÓN "SI SOY"
  const SI_SOY_OFFSET_Y = 150; // ⬇️ aumenta para bajarlo, negativo para subirlo

  return (
    <View style={[styles.screen, { backgroundColor }]}>
      <Text
        style={[
          styles.name,
          {
            fontSize: nameFontSize,
            lineHeight: Math.round(nameFontSize * 1.15),
          },
        ]}
        numberOfLines={2}
        adjustsFontSizeToFit
        minimumFontScale={0.6}
      >
        {playerName}
      </Text>

      {/* ⬇️ Botón movido manualmente (imagen + texto juntos) */}
      <View style={{ transform: [{ translateY: SI_SOY_OFFSET_Y }] }}>
        <PixelButton
          up={btnUp}
          down={btnDown}
          text={t("round_im")}
          width={304}
          height={136}
          fontSize={38}
          textColor="#ffffff"
          onPress={goImHere}
          contentUp={{ top: 24, bottom: 52, left: 18, right: 18 }}
          contentDown={{ top: 39, bottom: 33, left: 18, right: 18 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
    gap: 28,
  },
  name: {
    fontFamily: "PressStart2P",
    color: "#fff",
    textAlign: "center",
    includeFontPadding: false,
    width: "100%",
    maxWidth: 420,
  },
});