import React, { useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Asset } from "expo-asset";

import { LanguageProvider } from "../src/i18n/LanguageProvider";

// Mantiene el splash visible hasta que TODO esté listo
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    PressStart2P: require("../assets/fonts/PressStart2P-Regular.ttf"),
  });

  const [assetsReady, setAssetsReady] = useState(false);
  const [appReady, setAppReady] = useState(false);

  // Assets reales que usas
  const assetsToPreload = useMemo(
    () => [
      // Botones primarios (HOME + LANGUAGE)
      require("../assets/buttons/btn_primary_up.png"),
      require("../assets/buttons/btn_primary_down.png"),

      // Si estos existen, déjalos. Si no, bórralos.
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
        await Promise.all(
          assetsToPreload.map((m) => Asset.fromModule(m).downloadAsync())
        );
      } catch (e) {
        // No bloqueamos la app si falla algo
      } finally {
        if (!cancelled) {
          setAssetsReady(true);
        }
      }
    }

    prepare();

    return () => {
      cancelled = true;
    };
  }, [fontsLoaded, assetsToPreload]);

  // Cuando TODO esté listo, marcamos la app como lista
  useEffect(() => {
    if (fontsLoaded && assetsReady) setAppReady(true);
  }, [fontsLoaded, assetsReady]);

  // Oculta el splash exactamente cuando ya vamos a renderizar la app
  useEffect(() => {
    if (!appReady) return;
    SplashScreen.hideAsync().catch(() => {});
  }, [appReady]);

  // No renderiza nada hasta que fuentes + assets estén listos
  if (!appReady) {
    return <View style={{ flex: 1, backgroundColor: "#000" }} />;
  }

  return (
    <LanguageProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "none", // corte seco retro
          contentStyle: { backgroundColor: "#000" },
        }}
      />
    </LanguageProvider>
  );
}