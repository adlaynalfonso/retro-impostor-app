// impostor/app/index.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import { Link } from "expo-router";
import PixelButton from "../src/components/PixelButton";
import { useLanguage } from "../src/i18n/LanguageProvider";
import { fs } from "../src/ui/typography";

const btnUp = require("../assets/buttons/btn_primary_up.png");
const btnDown = require("../assets/buttons/btn_primary_down.png");

export default function Home() {
  const { t, lang } = useLanguage();

  return (
    <View style={styles.screen}>
      <View style={styles.column}>
        <Link href="/players" asChild>
          <PixelButton
            up={btnUp}
            down={btnDown}
            text={t("home_play")}
            width={304}
            height={136}
            fontSize={fs(lang, "home_play")}
            contentUp={{ top: 24, bottom: 52, left: 18, right: 18 }}
            contentDown={{ top: 39, bottom: 33, left: 18, right: 18 }}
          />
        </Link>

        <View style={styles.spacer} />

        <Link href="/language" asChild>
          <PixelButton
            up={btnUp}
            down={btnDown}
            text={t("home_language")}
            width={304}
            height={136}
            fontSize={fs(lang, "home_language")}
          />
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#D5A54A",
    alignItems: "center",
    justifyContent: "center",
  },
  column: {
    alignItems: "center",
    justifyContent: "center",
  },
  spacer: {
    height: 34,
  },
});