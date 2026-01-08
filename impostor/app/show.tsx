// impostor/app/show.tsx
import React, { useEffect, useMemo } from "react";
import { View, Text, StyleSheet, BackHandler, Image } from "react-native";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import PixelButton from "../src/components/PixelButton";
import { useLanguage } from "../src/i18n/LanguageProvider";
import { APP_BACKGROUND } from "../src/ui/colors";

// ✅ TUS BOTONES (SIN TEXTO)
const playAgainUp = require("../assets/ui/btn_play_again_up.png");
const playAgainDown = require("../assets/ui/btn_play_again_down.png");

const homeIconUp = require("../assets/ui/btn_home_icon_up.png");
const homeIconDown = require("../assets/ui/btn_home_icon_down.png");

// Impostores random
function pickUniqueIndices(count: number, max: number) {
  const set = new Set<number>();
  while (set.size < count) set.add(Math.floor(Math.random() * max));
  return Array.from(set);
}

export default function ShowScreen() {
  const { lang } = useLanguage();
  const navigation = useNavigation();

  const params = useLocalSearchParams<{
    order?: string;
    impostorIndices?: string;
    word?: string;
  }>();

  // ✅ Bloquear back (gesto iOS + botón Android)
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

  const word = String(params.word ?? "PIZZA");
  const impostorNames = impostorIndices.map((idx) => order[idx]).filter(Boolean);

  // ✅ Tamaños originales del PNG (NO ESCALA)
  const playSize = Image.resolveAssetSource(playAgainUp);
  const homeSize = Image.resolveAssetSource(homeIconUp);

  const PLAY_W = playSize?.width ?? 360;
  const PLAY_H = playSize?.height ?? 136;

  const HOME_W = homeSize?.width ?? 240;
  const HOME_H = homeSize?.height ?? 110;

  // ✅ Controles manuales (solo para mover, NO para escalar)
  const GAP_AFTER_TEXT = 18;
  const GAP_BETWEEN_BTNS = 14;

  // Si lo quieres un pelín más abajo/arriba todo el bloque:
  const SCREEN_Y_OFFSET = 0; // + baja, - sube

  const goHome = () => router.replace("/");

  const playAgainSamePlayers = () => {
    let newWord = word;
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const mod = require("../src/game/words");
      if (mod?.getRandomWord) newWord = mod.getRandomWord(lang);
    } catch {}

    const impostorCount = Math.max(1, Math.min(impostorIndices.length || 1, order.length));
    const newImpostors = pickUniqueIndices(impostorCount, order.length);

    router.replace({
      pathname: "/round",
      params: {
        order: JSON.stringify(order),
        i: "0",
        impostorIndices: JSON.stringify(newImpostors),
        word: String(newWord),
      },
    });
  };

  return (
    <View style={[styles.screen, { backgroundColor: APP_BACKGROUND }]}>
      <View
  style={{
    width: "100%",
    alignItems: "center", // 👈 CLAVE
    transform: [{ translateY: SCREEN_Y_OFFSET }],
  }}
>
        {/* ✅ TEXTOS (estos sí “se ajustan” al ancho) */}
        <Text
          style={styles.title}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.65}
        >
          {lang === "es" ? "RESULTADO" : "RESULT"}
        </Text>

        <Text style={styles.label} numberOfLines={1}>
          {lang === "es" ? "IMPOSTOR:" : "IMPOSTOR:"}
        </Text>

        <Text
          style={styles.value}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.55}
        >
          {impostorNames.length ? impostorNames.join(", ") : "???"}
        </Text>

        <Text style={[styles.label, { marginTop: 10 }]} numberOfLines={1}>
          {lang === "es" ? "PALABRA:" : "WORD:"}
        </Text>

        <Text
          style={styles.word}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.55}
        >
          {word}
        </Text>

        <View style={{ height: GAP_AFTER_TEXT }} />

        {/* ✅ BOTONES (tamaño ORIGINAL del PNG, sin texto) */}
        <PixelButton
          up={playAgainUp}
          down={playAgainDown}
          text=""
          width={PLAY_W}
          height={PLAY_H}
          fontSize={1}
          textColor="transparent"
          onPress={playAgainSamePlayers}
          contentUp={{ top: 0, bottom: 0, left: 0, right: 0 }}
          contentDown={{ top: 0, bottom: 0, left: 0, right: 0 }}
        />

        <View style={{ height: GAP_BETWEEN_BTNS }} />

        <PixelButton
          up={homeIconUp}
          down={homeIconDown}
          text=""
          width={HOME_W}
          height={HOME_H}
          fontSize={1}
          textColor="transparent"
          onPress={goHome}
          contentUp={{ top: 0, bottom: 0, left: 0, right: 0 }}
          contentDown={{ top: 0, bottom: 0, left: 0, right: 0 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center", // ✅ centra todo
    paddingHorizontal: 18,
  },

  // ✅ Para que el texto “se alargue” a lo ancho de pantalla
  title: {
    fontFamily: "PressStart2P",
    color: "#fff",
    fontSize: 26,
    lineHeight: 30,
    includeFontPadding: false,
    textAlign: "center",
    width: "100%",
    maxWidth: 520,
    paddingHorizontal: 14,
    marginBottom: 10,
  },

  label: {
    fontFamily: "PressStart2P",
    color: "rgba(255,255,255,0.85)",
    fontSize: 14,
    lineHeight: 18,
    includeFontPadding: false,
    textAlign: "center",
    width: "100%",
    maxWidth: 520,
    paddingHorizontal: 14,
  },

  value: {
    fontFamily: "PressStart2P",
    color: "#fff",
    fontSize: 34, // máximo (luego se reduce si hace falta)
    lineHeight: 40,
    includeFontPadding: false,
    textAlign: "center",
    width: "100%",
    maxWidth: 520,
    paddingHorizontal: 14,
  },

  word: {
    fontFamily: "PressStart2P",
    color: "#fff",
    fontSize: 44, // máximo (luego se reduce si hace falta)
    lineHeight: 52,
    includeFontPadding: false,
    textAlign: "center",
    width: "100%",
    maxWidth: 520,
    paddingHorizontal: 14,
  },
});