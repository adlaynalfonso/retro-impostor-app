// impostor/app/round.tsx
import React, { useEffect, useMemo } from "react";
import { View, Text, StyleSheet, BackHandler } from "react-native";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import PixelButton from "../src/components/PixelButton";
import { useLanguage } from "../src/i18n/LanguageProvider";
import { APP_BACKGROUND } from "../src/ui/colors";

const btnUp = require("../assets/buttons/btn_primary_up.png");
const btnDown = require("../assets/buttons/btn_primary_down.png");

export default function RoundScreen() {
  const { t } = useLanguage();
  const navigation = useNavigation();

  const params = useLocalSearchParams<{
    order?: string;
    i?: string;
    impostorIndices?: string;
    word?: string;
  }>();

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

  // 🎯 CONTROL MANUAL DEL BOTÓN
  const SI_SOY_OFFSET_Y = 150; // ⬇️ aumenta para bajarlo, negativo para subirlo

  return (
    <View style={[styles.screen, { backgroundColor: APP_BACKGROUND }]}>
      {/* ✅ NOMBRE DENTRO DE RECUADRO (siempre 1 línea) */}
      <View style={styles.nameBox}>
        <Text
          style={styles.name}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.45}
        >
          {playerName}
        </Text>
      </View>

      {/* ✅ Botón “¡SI SOY!” */}
      <View style={{ transform: [{ translateY: SI_SOY_OFFSET_Y }] }}>
        <PixelButton
          up={btnUp}
          down={btnDown}
          text={`¡${t("round_im")}!`}
          width={340}
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

  // ✅ Recuadro del nombre
  nameBox: {
    backgroundColor: "#5D6B86",
    paddingHorizontal: 20,
    paddingVertical: 16,
    width: "100%",
    maxWidth: 420,
    alignItems: "center",
    justifyContent: "center",
  },

  // ✅ Nombre: base grande, y se encoge automático hasta caber en 1 línea
  name: {
    fontFamily: "PressStart2P",
    color: "#fff",
    textAlign: "center",
    includeFontPadding: false,
    width: "100%",
    fontSize: 64,
    lineHeight: 64,
  },
});