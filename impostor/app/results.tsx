// impostor/app/results.tsx
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Modal, Pressable, BackHandler } from "react-native";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import PixelButton from "../src/components/PixelButton";
import { useLanguage } from "../src/i18n/LanguageProvider";
import { APP_BACKGROUND } from "../src/ui/colors";

// ✅ Usa tus PNG de "NEXT" (según tu carpeta /assets/ui)
const nextUp = require("../assets/ui/btn_next_up.png");
const nextDown = require("../assets/ui/btn_next_down.png");

export default function ResultsPromptScreen() {
  const { lang } = useLanguage();
  const navigation = useNavigation();

  const params = useLocalSearchParams<{
    order?: string;
    impostorIndices?: string;
    word?: string;
  }>();

  const [confirmOpen, setConfirmOpen] = useState(false);

  // ✅ BLOQUEAR BACK (gesto iOS + botón Android) como en “SI SOY”
  useEffect(() => {
    navigation.setOptions?.({ gestureEnabled: false });
    const sub = BackHandler.addEventListener("hardwareBackPress", () => true);
    return () => sub.remove();
  }, [navigation]);

  // ✅ Textos (ES / EN)
  const titleText = lang === "es" ? "TODOS LISTOS" : "ALL READY";

  const infoText =
    lang === "es"
      ? "TOCA EL BOTÓN MOSTRAR PARA CONOCER LA PALABRA Y AL IMPOSTOR."
      : "TAP SHOW TO REVEAL THE WORD AND THE IMPOSTOR.";

  const buttonText = lang === "es" ? "MOSTRAR" : "SHOW";

  const confirmTitle =
    lang === "es"
      ? "¿ESTÁS SEGURO DE QUERER CONOCER LOS RESULTADOS?"
      : "ARE YOU SURE YOU WANT TO SEE THE RESULTS?";

  const yesText = lang === "es" ? "SÍ" : "YES";
  const noText = lang === "es" ? "NO" : "NO";

  // ✅ CONTROLES MANUALES (ajústalos tú)
  const TITLE_TOP = 120; // 👈 SUBE ESTE NÚMERO PARA BAJAR “TODOS LISTOS”
  const INFO_TOP = 95;   // distancia entre título y recuadro
  const BTN_TOP = 150;   // baja/sube el botón (más = más abajo)

  // ✅ Tamaño del botón
  const BTN_W = 360;
  const BTN_H = 136;

  const goShow = () => {
    setConfirmOpen(false);
    router.replace({
      pathname: "/show",
      params: {
        order: String(params.order ?? "[]"),
        impostorIndices: String(params.impostorIndices ?? "[]"),
        word: String(params.word ?? "PIZZA"),
      },
    });
  };

  return (
    <View style={[styles.screen, { backgroundColor: APP_BACKGROUND }]}>
      {/* ✅ TÍTULO GRANDE ARRIBA (1 línea) */}
      <View style={{ marginTop: TITLE_TOP }}>
        <Text
          style={styles.title}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.6}
        >
          {titleText}
        </Text>
      </View>

      {/* ✅ RECUADRO INFORMATIVO */}
      <View style={{ marginTop: INFO_TOP }}>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>{infoText}</Text>
        </View>
      </View>

      {/* ✅ BOTÓN MÁS ABAJO */}
      <View style={{ marginTop: BTN_TOP }}>
        <PixelButton
          up={nextUp}
          down={nextDown}
          text={buttonText}
          width={BTN_W}
          height={BTN_H}
          fontSize={lang === "es" ? 34 : 28} // separado por idioma
          textColor="#ffffff"
          onPress={() => setConfirmOpen(true)}
          // Ajusta estos si quieres centrar mejor el texto
          contentUp={{ top: 28, bottom: 46, left: 28, right: 28 }}
          contentDown={{ top: 42, bottom: 28, left: 28, right: 28 }}
        />
      </View>

      {/* ✅ MODAL CONFIRMACIÓN (tipo "add new") */}
      <Modal transparent visible={confirmOpen} animationType="fade">
        <View style={styles.modalBack}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{confirmTitle}</Text>

            <View style={styles.modalRow}>
              <Pressable
                onPress={() => setConfirmOpen(false)}
                style={styles.modalBtn}
              >
                <Text style={styles.modalBtnText}>{noText}</Text>
              </Pressable>

              <Pressable onPress={goShow} style={styles.modalBtn}>
                <Text style={styles.modalBtnText}>{yesText}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
  },

  title: {
    fontFamily: "PressStart2P",
    color: "#fff",
    fontSize: 34,
    lineHeight: 36,
    includeFontPadding: false,
    textAlign: "center",
    paddingHorizontal: 18,
  },

  infoBox: {
    backgroundColor: "#5D6B86",
    paddingHorizontal: 18,
    paddingVertical: 16,
    maxWidth: 520,
    marginHorizontal: 20,
  },
  infoText: {
    fontFamily: "PressStart2P",
    color: "#fff",
    fontSize: 18,
    lineHeight: 26,
    includeFontPadding: false,
    textAlign: "center",
  },

  modalBack: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  modalCard: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#E7E7E7",
    borderWidth: 2,
    borderColor: "#111",
    padding: 16,
  },
  modalTitle: {
    fontFamily: "PressStart2P",
    color: "#111",
    fontSize: 14,
    lineHeight: 22,
    includeFontPadding: false,
    textAlign: "center",
    marginBottom: 14,
  },
  modalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 2,
    borderColor: "#111",
    backgroundColor: "#DADADA",
    alignItems: "center",
    justifyContent: "center",
  },
  modalBtnText: {
    fontFamily: "PressStart2P",
    color: "#111",
    fontSize: 14,
    includeFontPadding: false,
    textAlign: "center",
  },
});