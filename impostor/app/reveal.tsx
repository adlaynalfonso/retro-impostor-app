// impostor/app/reveal.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet, BackHandler, Animated, Easing, Image } from "react-native";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import PixelButton from "../src/components/PixelButton";
import { useLanguage } from "../src/i18n/LanguageProvider";

// ✅ TU BOTÓN ROJO (AJUSTA ESTAS RUTAS A TUS PNG REALES)
const redUp = require("../assets/ui/red_btn_up.png");
const redDown = require("../assets/ui/red_btn_down.png");

// ✅ botón tipo Home para “SIGUIENTE”
const homeUp = require("../assets/buttons/btn_primary_up.png");
const homeDown = require("../assets/buttons/btn_primary_down.png");

// velocidad reveal / hide (pixel)
const TICK_MS = 45;
const HIDE_TICK_MS = 30;

type Phase = "idle" | "revealing" | "hiding" | "done";

/** 🎨 fondo random: saturado, NO blanco/negro, evita 2 hex específicos */
function randomBgAvoid() {
  const banned = new Set(["#DC2D2D", "#C5B9D2", "#000000", "#ffffff", "#FFFFFF"]);
  for (let tries = 0; tries < 60; tries++) {
    const hue = Math.floor(Math.random() * 360);
    const saturation = 70;
    const lightness = 40 + Math.floor(Math.random() * 15); // 40–55
    const c = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    if (!banned.has(c)) return c;
  }
  return "hsl(200, 70%, 45%)";
}

export default function RevealScreen() {
  const { lang, t } = useLanguage();
  const navigation = useNavigation();

  const params = useLocalSearchParams<{
    order?: string;
    i?: string;
    impostorIndices?: string;
    word?: string;
  }>();

  // ✅ bloquear back (gesto iOS + botón android)
  useEffect(() => {
    navigation.setOptions?.({ gestureEnabled: false });
    const sub = BackHandler.addEventListener("hardwareBackPress", () => true);
    return () => sub.remove();
  }, [navigation]);

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

  const i = Number(params.i ?? "0") || 0;
  const word = String(params.word ?? "PIZZA");

  const isImpostor = impostorIndices.includes(i);
  const secretText = isImpostor ? "IMPOSTOR" : word;
  const len = secretText.length;

  // ====== CONTROLES MANUALES ======
  const HINT_FONT = 18; // 👈 tamaño del cartel
  const HINT_TOP = -20; // 👈 sube/baja el cartel

  const RED_BTN_TOP = 150; // 👈 sube/baja el botón rojo
  const RED_BTN_SCALE = 1.0; // 👈 SOLO CAMBIA ESTO (0.8 más pequeño, 1.2 más grande) SIN DEFORMAR

  const NEXT_BTN_TOP = 40; // 👈 sube/baja el botón SIGUIENTE
  // ===============================

  // ✅ calcular tamaño real del png (para mantener proporción)
  const redSize = Image.resolveAssetSource(redUp);
  const RED_ASPECT = redSize.width / redSize.height;

  // ancho base “bonito” y escalable (no lo estira)
  const RED_W_BASE = 260; // 👈 si quieres, cambia este, PERO NO “estira”, solo cambia tamaño total
  const RED_W = Math.round(RED_W_BASE * RED_BTN_SCALE);
  const RED_H = Math.round(RED_W / RED_ASPECT);

  // botón home-style
  const NEXT_W = 304;
  const NEXT_H = 136;

  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState(0);

  // ✅ refs para NO depender de estado “viejo”
  const progressRef = useRef(0);
  const phaseRef = useRef<Phase>("idle");
  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  };

  useEffect(() => {
    return () => clearTimer();
  }, []);

  // ✅ texto pixelado (lo revelado + bloques)
  const maskedText = useMemo(() => {
    const shown = secretText.slice(0, progress);
    const hidden = "█".repeat(Math.max(0, len - progress));
    return shown + hidden;
  }, [secretText, progress, len]);

  // ✅ cartel: cambia cuando ya terminó el ciclo
  const hintHold =
    lang === "es"
      ? "DEJA EL BOTÓN ROJO PRESIONADO\nPARA REVELAR LA PALABRA"
      : "HOLD THE RED BUTTON\nTO REVEAL THE WORD";

  const hintNext =
    lang === "es"
      ? "PRESIONA SIGUIENTE PARA VER\nA QUIÉN PASARLE EL CELULAR"
      : "PRESS NEXT TO SEE\nWHO TO PASS THE PHONE TO";

  // ✅ “explosión” simple: scale + fade del botón rojo cuando termina
  const boom = useRef(new Animated.Value(0)).current;
  const boomScale = boom.interpolate({ inputRange: [0, 1], outputRange: [1, 1.25] });
  const boomOpacity = boom.interpolate({ inputRange: [0, 1], outputRange: [1, 0] });

  const startHold = () => {
    if (phaseRef.current === "done" || phaseRef.current === "hiding") return;

    setPhase("revealing");
    clearTimer();

    timerRef.current = setInterval(() => {
      setProgress((p) => Math.min(len, p + 1));
    }, TICK_MS);
  };

  const stopHold = () => {
    if (phaseRef.current !== "revealing") return;

    clearTimer();

    if (progressRef.current < len) {
      setPhase("idle");
      return;
    }

    Animated.timing(boom, {
      toValue: 1,
      duration: 180,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start(() => {
      boom.setValue(0);

      setPhase("hiding");
      clearTimer();

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
    });
  };

  const goNextPlayer = () => {
    const nextIndex = i + 1;

    // ✅ CAMBIO: antes iba directo a /show
    if (nextIndex >= order.length) {
router.replace(
  {
    pathname: "/results",
    params: {
      order: JSON.stringify(order),
      impostorIndices: JSON.stringify(impostorIndices),
      word,
    },
  } as any
);
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
    <View style={[styles.screen, { backgroundColor: bg }]}>
      {/* CARTEL */}
      <View style={{ transform: [{ translateY: HINT_TOP }] }}>
        <Text style={[styles.hint, { fontSize: HINT_FONT }]}>
          {phase === "done" ? hintNext : hintHold}
        </Text>
      </View>

      {/* PALABRA (pixel reveal/hide) */}
      <View style={styles.secretBox}>
        {phase !== "done" ? (
          <Text style={styles.secretText}>{maskedText}</Text>
        ) : (
          <Text style={styles.secretHidden}>{" "}</Text>
        )}
      </View>

      {/* BOTÓN */}
      {phase !== "done" ? (
        <View style={{ transform: [{ translateY: RED_BTN_TOP }] }}>
          <Animated.View style={{ transform: [{ scale: boomScale }], opacity: boomOpacity }}>
            <PixelButton
              up={redUp}
              down={redDown}
              text="" // ✅ sin texto
              width={RED_W}
              height={RED_H} // ✅ calculado con proporción REAL (no se deforma)
              fontSize={1}
              textColor="transparent"
              onPress={() => {}}
              onPressIn={startHold}
              onPressOut={stopHold}
              contentUp={{ top: 0, bottom: 0, left: 0, right: 0 }}
              contentDown={{ top: 0, bottom: 0, left: 0, right: 0 }}
            />
          </Animated.View>
        </View>
      ) : (
        <View style={{ transform: [{ translateY: NEXT_BTN_TOP }] }}>
          <PixelButton
            up={homeUp}
            down={homeDown}
            text={t("setup_next")}
            width={NEXT_W}
            height={NEXT_H}
            fontSize={38}
            textColor="#ffffff"
            onPress={goNextPlayer}
            contentUp={{ top: 24, bottom: 52, left: 18, right: 18 }}
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