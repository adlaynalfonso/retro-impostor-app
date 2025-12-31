import React from "react";
import { View, StyleSheet } from "react-native";
import { router } from "expo-router";
import PixelButton from "../src/components/PixelButton";
import { useLanguage } from "../src/i18n/LanguageProvider";

const btnUp = require("../assets/buttons/btn_primary_up.png");
const btnDown = require("../assets/buttons/btn_primary_down.png");

export default function LanguageScreen() {
  const { t, setLang, lang } = useLanguage();

  return (
    <View style={styles.screen}>
      <View style={styles.column}>
        <PixelButton
          up={btnUp}
          down={btnDown}
          text={t("language_en")}
          width={304}
          height={136}
          fontSize={34}
          // ✅ si quieres centrar perfecto en tu caja clara, puedes ajustar:
          // contentUp={{ top: 24, bottom: 52, left: 18, right: 18 }}
          // contentDown={{ top: 39, bottom: 33, left: 18, right: 18 }}
          onPress={() => {
            if (lang !== "en") setLang("en");
            router.back(); // vuelve a Home
          }}
        />

        <PixelButton
          up={btnUp}
          down={btnDown}
          text={t("language_es")}
          width={304}
          height={136}
          fontSize={34}
          onPress={() => {
            if (lang !== "es") setLang("es");
            router.back();
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#6E68A1",
    alignItems: "center",
    justifyContent: "center",
  },
  column: {
    gap: 34,
    alignItems: "center",
  },
});