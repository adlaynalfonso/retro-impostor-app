// impostor/app/reveal.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet, BackHandler, Image } from "react-native";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import PixelButton from "../src/components/PixelButton";
import { useLanguage } from "../src/i18n/LanguageProvider";
import { APP_BACKGROUND } from "../src/ui/colors";

// 🔴 botón rojo
const redUp = require("../assets/ui/red_btn_up.png");
const redDown = require("../assets/ui/red_btn_down.png");

// ▶️ botón NEXT (NO home)
const nextUp = require("../assets/ui/btn_next_up.png");
const nextDown = require("../assets/ui/btn_next_down.png");

// velocidad reveal / hide
const TICK_MS = 45;
const HIDE_TICK_MS = 30;

type Phase = "idle" | "revealing" | "hiding" | "done";

export default function RevealScreen() {
  const { lang, t } = useLanguage();
  const navigation = useNavigation();

  const params = useLocalSearchParams<{
    order?: string;
    i?: string;
    impostorIndices?: string;
    word?: string;
  }>();

  // 🚫 bloquear back
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

  const isImpostor = impostorIndices.includes(i);
  const secretText = isImpostor ? "IMPOSTOR" : word;

  const displayLen = Math.max("IMPOSTOR".length, word.length);
  const len = secretText.length;

  // ===== CONTROLES =====
  const HINT_FONT = 18;
  const HINT_TOP = -20;
  const RED_BTN_TOP = 100;
  const NEXT_BTN_TOP = 100;
  // ====================

  // tamaño botón rojo
  const redSize = Image.resolveAssetSource(redUp);
  const RED_W = 220;
  const RED_H = Math.round(RED_W / (redSize.width / redSize.height));

  // tamaño NEXT
  const NEXT_W = 360;
  const NEXT_H = 136;

  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  };

  useEffect(() => clearTimer, []);

  const maskedText = useMemo(() => {
    const shown = secretText.slice(0, progress);
    const invisible = "\u00A0".repeat(Math.max(0, displayLen - progress));
    return shown + invisible;
  }, [secretText, progress, displayLen]);

  const hintHold =
    lang === "es"
      ? "DEJA EL BOTÓN ROJO PRESIONADO\nPARA REVELAR LA PALABRA"
      : "HOLD THE RED BUTTON\nTO REVEAL THE WORD";

  const hintNext =
    lang === "es"
      ? "PRESIONA SIGUIENTE PARA VER\nA QUIÉN PASARLE EL CELULAR"
      : "PRESS NEXT TO SEE\nWHO TO PASS THE PHONE TO";

  const startHold = () => {
    if (phase === "done") return;

    setPhase("revealing");
    clearTimer();

    timerRef.current = setInterval(() => {
      setProgress((p) => Math.min(len, p + 1));
    }, TICK_MS);
  };

  const stopHold = () => {
    clearTimer();

    if (progress < len) {
      setPhase("idle");
      return;
    }

    // ocultar palabra SIN animación
    setPhase("hiding");

    timerRef.current = setInterval(() => {
      setProgress((p) => {
        const next = p - 1;
        if (next <= 0) {
          clearTimer();
          setPhase("done");
          return 0;
        }
        return next;
      });
    }, HIDE_TICK_MS);
  };

  const goNextPlayer = () => {
    const nextIndex = i + 1;

    if (nextIndex >= order.length) {
      router.replace({
        pathname: "/results",
        params: {
          order: JSON.stringify(order),
          impostorIndices: JSON.stringify(impostorIndices),
          word,
        },
      } as any);
      return;
    }

    router.replace({
      pathname: "/round",
      params: {
        order: JSON.stringify(order),
        i: String(nextIndex),
        impostorIndices: JSON.stringify(impostorIndices),
        word,
      },
    });
  };

  return (
    <View style={[styles.screen, { backgroundColor: APP_BACKGROUND }]}>
      {/* CARTEL */}
      <View style={{ transform: [{ translateY: HINT_TOP }] }}>
        <View style={styles.hintBox}>
          <Text style={[styles.hint, { fontSize: HINT_FONT }]}>
            {phase === "done" ? hintNext : hintHold}
          </Text>
        </View>
      </View>

      {/* PALABRA */}
      <View style={styles.secretBox}>
        {phase !== "done" ? (
          <Text style={styles.secretText}>{maskedText}</Text>
        ) : (
          <Text style={styles.secretHidden}>{" "}</Text>
        )}
      </View>

      {/* BOTONES */}
      {phase !== "done" ? (
        <View style={{ transform: [{ translateY: RED_BTN_TOP }] }}>
          <PixelButton
            up={redUp}
            down={redDown}
            text=""
            width={RED_W}
            height={RED_H}
            fontSize={1}
            textColor="transparent"
            onPress={() => {}}
            onPressIn={startHold}
            onPressOut={stopHold}
            contentUp={{ top: 0, bottom: 0, left: 0, right: 0 }}
            contentDown={{ top: 0, bottom: 0, left: 0, right: 0 }}
          />
        </View>
      ) : (
        <View style={{ transform: [{ translateY: NEXT_BTN_TOP }] }}>
          <PixelButton
            up={nextUp}
            down={nextDown}
            text={t("setup_next")}
            width={NEXT_W}
            height={NEXT_H}
            fontSize={38}
            textColor="#ffffff"
            onPress={goNextPlayer}
            contentUp={{ top: 44, bottom: 52, left: 18, right: 18 }}
            contentDown={{ top: 39, bottom: 33, left: 18, right: 18 }}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    gap: 18,
  },
  hintBox: {
    backgroundColor: "#5D6B86",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 5,
    borderColor: "rgba(255, 255, 255, 1)",
    maxWidth: 420,
  },
  hint: {
    fontFamily: "PressStart2P",
    color: "#fff",
    textAlign: "center",
    includeFontPadding: false,
    lineHeight: 26,
  },
  secretBox: {
    width: "100%",
    maxWidth: 420,
    minHeight: 90,
    alignItems: "center",
    justifyContent: "center",
  },
  secretText: {
    fontFamily: "PressStart2P",
    color: "#fff",
    fontSize: 28,
    includeFontPadding: false,
    textAlign: "center",
  },
  secretHidden: {
    fontFamily: "PressStart2P",
    color: "transparent",
    fontSize: 28,
    includeFontPadding: false,
  },
});