// impostor/app/show.tsx
import React, { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import PixelButton from "../src/components/PixelButton";
import { useLanguage } from "../src/i18n/LanguageProvider";

const homeUp = require("../assets/buttons/btn_primary_up.png");
const homeDown = require("../assets/buttons/btn_primary_down.png");

function randomBgAvoid() {
  const banned = new Set(["#DC2D2D", "#C5B9D2"]);
  for (let tries = 0; tries < 60; tries++) {
    const hue = Math.floor(Math.random() * 360);
    const saturation = 70;
    const lightness = 40 + Math.floor(Math.random() * 15);
    const c = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    if (!banned.has(c)) return c;
  }
  return "hsl(200, 70%, 45%)";
}

function pickUniqueIndices(count: number, max: number) {
  // count <= max
  const set = new Set<number>();
  while (set.size < count) set.add(Math.floor(Math.random() * max));
  return Array.from(set);
}

export default function ShowScreen() {
  const { lang } = useLanguage();

  const params = useLocalSearchParams<{
    order?: string;
    impostorIndices?: string;
    word?: string;
  }>();

  const bg = useMemo(() => randomBgAvoid(), []);

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

  const impostorNames = impostorIndices
    .map((idx) => order[idx])
    .filter(Boolean);

  const title = lang === "es" ? "RESULTADO" : "RESULT";
  const impostorLabel = lang === "es" ? "IMPOSTOR:" : "IMPOSTOR:";
  const wordLabel = lang === "es" ? "PALABRA:" : "WORD:";

  const playAgainText = lang === "es" ? "JUGAR DE NUEVO" : "PLAY AGAIN";
  const homeText = lang === "es" ? "INICIO" : "HOME";

  const goHome = () => router.replace("/");

  const playAgainSamePlayers = () => {
    // ✅ mismos players (order). Nuevo reparto de impostores y nueva palabra:
    // Para NO romperte el build si todavía estás moviendo words, lo hacemos “safe”.
    let newWord = word;
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const mod = require("../src/game/words");
      if (mod?.getRandomWord) {
        newWord = mod.getRandomWord(lang);
      }
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
    <View style={[styles.screen, { backgroundColor: bg }]}>
      <Text style={styles.title}>{title}</Text>

      <Text style={styles.line}>{impostorLabel}</Text>
      <Text style={styles.big}>
        {impostorNames.length ? impostorNames.join(", ") : "???"}
      </Text>

      <Text style={styles.line}>{wordLabel}</Text>
      <Text style={styles.word}>{word}</Text>

      {/* ✅ Botón grande: jugar de nuevo */}
      <View style={{ marginTop: 18 }}>
        <PixelButton
          up={homeUp}
          down={homeDown}
          text={playAgainText}
          width={304}
          height={136}
          fontSize={26}
          textColor="#ffffff"
          onPress={playAgainSamePlayers}
          contentUp={{ top: 24, bottom: 52, left: 18, right: 18 }}
          contentDown={{ top: 39, bottom: 33, left: 18, right: 18 }}
        />
      </View>

      {/* ✅ Botón pequeño: inicio */}
      <View style={{ marginTop: 12 }}>
        <PixelButton
          up={homeUp}
          down={homeDown}
          text={homeText}
          width={230}
          height={104}
          fontSize={22}
          textColor="#ffffff"
          onPress={goHome}
          contentUp={{ top: 18, bottom: 40, left: 18, right: 18 }}
          contentDown={{ top: 30, bottom: 28, left: 18, right: 18 }}
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
    gap: 10,
    paddingHorizontal: 18,
  },
  title: {
    fontFamily: "PressStart2P",
    color: "#fff",
    fontSize: 18,
    includeFontPadding: false,
    marginBottom: 14,
    textAlign: "center",
  },
  line: {
    fontFamily: "PressStart2P",
    color: "rgba(255,255,255,0.75)",
    fontSize: 12,
    includeFontPadding: false,
  },
  big: {
    fontFamily: "PressStart2P",
    color: "#fff",
    fontSize: 20,
    includeFontPadding: false,
    marginBottom: 12,
    textAlign: "center",
  },
  word: {
    fontFamily: "PressStart2P",
    color: "#fff",
    fontSize: 30,
    includeFontPadding: false,
    marginBottom: 6,
    textAlign: "center",
  },
});