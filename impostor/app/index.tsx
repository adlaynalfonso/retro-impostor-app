import React from "react";
import { View, StyleSheet } from "react-native";
import { Link } from "expo-router";
import PixelButton from "../src/components/PixelButton";
import { useLanguage } from "../src/i18n/LanguageProvider";

const btnUp = require("../assets/buttons/btn_primary_up.png");
const btnDown = require("../assets/buttons/btn_primary_down.png");

export default function Home() {
  const { t } = useLanguage();

  return (
    <View style={styles.screen}>
      <View style={styles.column}>
        <View style={styles.item}>
          <Link href="/players" asChild>
            <PixelButton
              up={btnUp}
              down={btnDown}
              text={t("home_play")}
              width={304}
              height={136}
              fontSize={48}
              contentUp={{ top: 24, bottom: 52, left: 18, right: 18 }}
              contentDown={{ top: 39, bottom: 33, left: 18, right: 18 }}
            />
          </Link>
        </View>

        <View style={styles.item}>
          <Link href="/language" asChild>
            <PixelButton
              up={btnUp}
              down={btnDown}
              text={t("home_language")}
              width={304}
              height={136}
              fontSize={36}
            />
          </Link>
        </View>

        <View>
          <Link href="/settings" asChild>
            <PixelButton
              up={btnUp}
              down={btnDown}
              text={t("home_settings")}
              width={304}
              height={136}
              fontSize={36}
            />
          </Link>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#9368A1",
    alignItems: "center",
    justifyContent: "center",
  },
  column: {
    alignItems: "center",
  },
  item: {
    marginBottom: 34, // reemplaza gap
  },
});