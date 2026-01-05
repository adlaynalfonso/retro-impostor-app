// impostor/app/game.tsx
import React, { useEffect, useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useLanguage } from "../src/i18n/LanguageProvider";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickUniqueIndices(count: number, maxExclusive: number) {
  // retorna indices únicos en [0..maxExclusive-1]
  const pool = Array.from({ length: maxExclusive }, (_, i) => i);
  const shuffled = shuffle(pool);
  return shuffled.slice(0, count);
}

// ✅ lista simple por ahora (luego la hacemos grande y por idioma)
const WORDS = [
  "PIZZA",
  "BURGER",
  "TIGER",
  "OCEAN",
  "ROBOT",
  "BANANA",
  "DRAGON",
  "MUSIC",
  "COFFEE",
  "PLANET",
];

export default function GameScreen() {
  const { t } = useLanguage();

  const params = useLocalSearchParams<{
    players?: string;
    impostors?: string;
    names?: string;
  }>();

  const parsed = useMemo(() => {
    const totalPlayers = clamp(parseInt(params.players ?? "3", 10) || 3, 3, 33);

    // ✅ impostores nunca más que jugadores
    const impostorsN = clamp(
      parseInt(params.impostors ?? "1", 10) || 1,
      1,
      totalPlayers
    );

    let names: string[] = [];
    try {
      const arr = JSON.parse(params.names ?? "[]");
      if (Array.isArray(arr)) names = arr.map((x) => String(x));
    } catch {}

    // seguridad: si viene menos nombres, recorta totalPlayers al tamaño real
    const safeTotal = clamp(totalPlayers, 3, Math.max(3, names.length || 3));
    const safeNames = names.slice(0, safeTotal);

    return {
      totalPlayers: safeTotal,
      impostorsN: clamp(impostorsN, 1, safeTotal),
      names: safeNames,
    };
  }, [params.players, params.impostors, params.names]);

  useEffect(() => {
    // si no hay nombres, vuelve atrás (no debería pasar si tu Names valida)
    if (!parsed.names.length) {
      router.replace("/names");
      return;
    }

    // 1) orden aleatorio
    const order = shuffle(parsed.names);

    // 2) elegir impostores (indices dentro de "order")
    const impostorIndices = pickUniqueIndices(parsed.impostorsN, order.length);

    // 3) palabra aleatoria (por ahora lista simple)
    const word = WORDS[Math.floor(Math.random() * WORDS.length)] ?? "PIZZA";

    // 4) arranca el flujo en round del primer jugador
    router.replace({
      pathname: "/round",
      params: {
        order: JSON.stringify(order),
        i: "0",
        impostorIndices: JSON.stringify(impostorIndices),
        word,
      },
    });
  }, [parsed]);

  return (
    <View style={styles.screen}>
      <Text style={styles.text}>
        {(() => {
          try {
            // si después quieres traducirlo, añadimos key
            // @ts-ignore
            return t("game_loading");
          } catch {
            return "LOADING...";
          }
        })()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  text: {
    fontFamily: "PressStart2P",
    color: "#fff",
    includeFontPadding: false,
    textAlign: "center",
    fontSize: 14,
  },
});