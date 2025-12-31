import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { View } from "react-native";
import { LanguageProvider } from "../src/i18n/LanguageProvider";

export default function RootLayout() {
  const [loaded] = useFonts({
    PressStart2P: require("../assets/fonts/PressStart2P-Regular.ttf"),
  });

  if (!loaded) return <View />;

  return (
    <LanguageProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "fade",
          contentStyle: { backgroundColor: "#000" },
        }}
      />
    </LanguageProvider>
  );
}