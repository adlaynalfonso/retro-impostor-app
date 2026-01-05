// impostor/app/settings.tsx
import { View, Text, StyleSheet } from "react-native";
import { useLanguage } from "../src/i18n/LanguageProvider";
import { fs } from "../src/ui/typography";

export default function Settings() {
  const { t, lang } = useLanguage();

  return (
    <View style={styles.container}>
      <Text style={[styles.text, { fontSize: fs(lang, "settings_title") }]}>
        {t("settings_title")}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#5C6A73",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "white",
    fontFamily: "PressStart2P",
    includeFontPadding: false,
    textAlign: "center",
  },
});