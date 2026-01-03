import React, { useEffect, useMemo, useState } from "react";
import { Stack } from "expo-router";
import { View } from "react-native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Asset } from "expo-asset";

import { LanguageProvider } from "../src/i18n/LanguageProvider";

// ⛔ Mantiene el splash visible hasta que TODO esté listo
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    PressStart2P: require("../assets/fonts/PressStart2P-Regular.ttf"),
  });

  const [assetsReady, setAssetsReady] = useState(false);

  // ✅ Assets reales que usas en HOME y LANGUAGE
  const assetsToPreload = useMemo(
    () => [
      // Botones primarios (HOME + LANGUAGE)
      require("../assets/buttons/btn_primary_up.png"),
      require("../assets/buttons/btn_primary_down.png"),

      // Players screen
      require("../assets/ui/arrow_left_up.png"),
      require("../assets/ui/arrow_left_down.png"),
      require("../assets/ui/arrow_right_up.png"),
      require("../assets/ui/arrow_right_down.png"),
      require("../assets/ui/btn_next_up.png"),
      require("../assets/ui/btn_next_down.png"),
      require("../assets/ui/label_box_up.png"),
      require("../assets/ui/number_box_up.png"),
    ],
    []
  );

  useEffect(() => {
    let cancelled = false;

    async function prepare() {
      if (!fontsLoaded) return;

      try {
        // ✅ Precarga y decodifica TODO antes de mostrar pantallas
        await Promise.all(
          assetsToPreload.map((asset) =>
            Asset.fromModule(asset).downloadAsync()
          )
        );
      } catch {
        // No bloqueamos la app si falla algo
      } finally {
        if (!cancelled) {
          setAssetsReady(true);
          SplashScreen.hideAsync().catch(() => {});
        }
      }
    }

    prepare();

    return () => {
      cancelled = true;
    };
  }, [fontsLoaded, assetsToPreload]);

  // ⛔ No renderiza NADA hasta que fuentes + imágenes estén listas
  if (!fontsLoaded || !assetsReady) {
    return <View style={{ flex: 1, backgroundColor: "#000" }} />;
  }

  return (
    <LanguageProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "none", // ✅ corte seco, sin transiciones
          contentStyle: { backgroundColor: "#000" },
        }}
      />
    </LanguageProvider>
  );
}