import React, { useEffect, useMemo, useState } from "react";
import { View, StyleSheet, useWindowDimensions, Alert, Image } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import PixelButton from "../../components/PixelButton";
import { useLanguage } from "../../i18n/LanguageProvider";

import ToggleBar from "@/screens/names/components/ToggleBar";
import ListPanel from "@/screens/names/components/ListPanel";
import AddNameModal from "@/screens/names/components/AddNameModal";

const STORAGE_KEY = "impostor_saved_names_v1";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function normalizeName(s: string) {
  return s.trim().replace(/\s+/g, " ");
}

// ✅ PNGs (rutas desde src/screens/names/)
const labelNamesUp = require("../../../assets/ui/label_names_up.png");
const nextUp = require("../../../assets/ui/btn_next_up.png");
const nextDown = require("../../../assets/ui/btn_next_down.png");

export default function NamesScreen() {
  const { lang } = useLanguage();
  const { width: W } = useWindowDimensions();

  const { players, impostors } = useLocalSearchParams<{ players?: string; impostors?: string }>();

  const totalPlayers = clamp(parseInt(players ?? "3", 10) || 3, 3, 33);
  const impostorsN = clamp(parseInt(impostors ?? "1", 10) || 1, 1, totalPlayers);

  // estado
  const [memoryMode, setMemoryMode] = useState(false); // false = party, true = memory
  const [partyNames, setPartyNames] = useState<string[]>([]);
  const [savedNames, setSavedNames] = useState<string[]>([]);

  // modal add new
  const [modalOpen, setModalOpen] = useState(false);

  // 🔧 TUS ESPACIADOS (ajústalos tú)
  const SPACE_TOP = 70;
  const SPACE_AFTER_TITLE = 26;
  const SPACE_AFTER_TOGGLE = 26;
  const SPACE_AFTER_ADDNEW = 20;
  const SPACE_BEFORE_NEXT = 28;
  const SPACE_BOTTOM = 26;

  // tamaños responsivos
  const contentW = Math.min(W - 40, 420);

  const titleW = contentW;
  const titleH = Math.round(contentW * 0.22);

  const toggleW = contentW;
  const toggleH = Math.round(contentW * 0.20);

  const addNewW = Math.round(contentW * 0.72);
  const addNewH = Math.round(contentW * 0.18);

  const panelW = contentW;
  const panelH = Math.round(contentW * 1.25);

  const nextW = Math.round(contentW * 0.92);
  const nextH = Math.round(nextW * 0.42);

  // fonts (control manual por pantalla)
  const titleFont = lang === "es" ? 26 : 26;
  const nextFont = lang === "es" ? 26 : 26;

  const countText = `${partyNames.length}/${totalPlayers}`;

  // cargar memoria
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) {
          setSavedNames(arr.filter((x) => typeof x === "string").map(normalizeName));
        }
      } catch {}
    })();
  }, []);

  const persistSavedNames = async (arr: string[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
    } catch {}
  };

  const addToMemory = async (name: string) => {
    const n = normalizeName(name);
    if (!n) return;

    setSavedNames((prev) => {
      const exists = prev.some((x) => x.toLowerCase() === n.toLowerCase());
      const next = exists ? prev : [n, ...prev];
      persistSavedNames(next);
      return next;
    });
  };

  const addToParty = (name: string) => {
    const n = normalizeName(name);
    if (!n) return;

    setPartyNames((prev) => {
      if (prev.length >= totalPlayers) return prev;
      const exists = prev.some((x) => x.toLowerCase() === n.toLowerCase());
      if (exists) return prev;
      return [...prev, n];
    });
  };

  const removeFromParty = (name: string) => {
    setPartyNames((prev) => prev.filter((x) => x !== name));
  };

  const onAddNew = () => setModalOpen(true);

  const onConfirmAddNew = async (name: string) => {
    const n = normalizeName(name);
    if (!n) return;

    addToParty(n);
    await addToMemory(n);
    setModalOpen(false);
  };

  const goNext = () => {
    if (partyNames.length !== totalPlayers) {
      Alert.alert("Faltan nombres", `Necesitas ${totalPlayers} nombres para continuar.`);
      return;
    }

    router.push({
      pathname: "/game",
      params: {
        players: String(totalPlayers),
        impostors: String(impostorsN),
        names: JSON.stringify(partyNames),
      },
    });
  };

  // lista que se muestra
  const listToShow = memoryMode ? savedNames : partyNames;

  // ✅ IMPORTANTE: precalienta title PNG para evitar “parpadeo”
  useEffect(() => {
    Image.resolveAssetSource(labelNamesUp);
  }, []);

  return (
    <View style={styles.screen}>
      <View style={{ height: SPACE_TOP }} />

      {/* TITLE */}
      <View style={{ width: titleW, height: titleH, alignSelf: "center" }}>
        <Image
          source={labelNamesUp}
          resizeMode="contain"
          style={{ width: "100%", height: "100%" }}
        />
        <View style={styles.titleOverlay} pointerEvents="none">
          <View style={{ transform: [{ translateY: 2 }] }}>
            {/* texto “names” es fijo como tu diseño */}
            <View>
              {/* aquí no uso t() porque tu arte dice “names” */}
            </View>
          </View>
        </View>
      </View>

      <View style={{ height: SPACE_AFTER_TITLE }} />

      {/* ✅ TOGGLE BAR (UN SOLO CONTROL) */}
      <ToggleBar
        width={toggleW}
        height={toggleH}
        countText={countText}
        isMemory={memoryMode}
        onPressCounter={() => setMemoryMode(false)}
        onPressMemory={() => setMemoryMode(true)}
      />

      <View style={{ height: SPACE_AFTER_TOGGLE }} />

      {/* ADD NEW (solo en modo normal) */}
      {!memoryMode && (
        <>
          <PixelButton
            up={require("../../../assets/ui/btn_add_new_up.png")}
            down={require("../../../assets/ui/btn_add_new_down.png")}
            text="add new"
            width={addNewW}
            height={addNewH}
            fontSize={lang === "es" ? 22 : 22}
            textColor="#111"
            onPress={onAddNew}
            contentUp={{ top: 10, bottom: 18, left: 16, right: 16 }}
            contentDown={{ top: 16, bottom: 12, left: 16, right: 16 }}
          />
          <View style={{ height: SPACE_AFTER_ADDNEW }} />
        </>
      )}

      {/* LIST PANEL */}
      <ListPanel
        width={panelW}
        height={panelH}
        memoryMode={memoryMode}
        partyNames={partyNames}
        list={listToShow}
        onRemoveParty={removeFromParty}
        onAddParty={addToParty}
      />

      <View style={{ height: SPACE_BEFORE_NEXT }} />

      {/* NEXT */}
      <PixelButton
        up={nextUp}
        down={nextDown}
        text="next"
        width={nextW}
        height={nextH}
        fontSize={nextFont}
        textColor="#111"
        onPress={goNext}
        contentUp={{ top: 28, bottom: 40, left: 26, right: 26 }}
        contentDown={{ top: 42, bottom: 26, left: 26, right: 26 }}
      />

      <View style={{ height: SPACE_BOTTOM }} />

      {/* MODAL */}
      <AddNameModal
        visible={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={onConfirmAddNew}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#C8A35A",
    alignItems: "center",
  },
  titleOverlay: {
    position: "absolute",
    inset: 0,
    alignItems: "center",
    justifyContent: "center",
  },
});