import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TextInput,
  Modal,
  Pressable,
  useWindowDimensions,
  Alert,
  ScrollView,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import PixelButton from "../../components/PixelButton";
import { useLanguage } from "../../i18n/LanguageProvider";
import { fs } from "../../ui/typography";

import ToggleBar from "./components/ToggleBar";

const STORAGE_KEY = "impostor_saved_names_v1";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}
function normalizeName(s: string) {
  return s.trim().replace(/\s+/g, " ");
}

// PNGs
const labelNamesUp = require("../../../assets/ui/label_names_up.png");
const listPanelUp = require("../../../assets/ui/list_panel_up.png");

const addNewUp = require("../../../assets/ui/btn_add_new_up.png");
const addNewDown = require("../../../assets/ui/btn_add_new_down.png");

const plusUp = require("../../../assets/ui/btn_plus_up.png");
const plusDown = require("../../../assets/ui/btn_plus_down.png");

const nextUp = require("../../../assets/ui/btn_next_up.png");
const nextDown = require("../../../assets/ui/btn_next_down.png");

type Mode = "counter" | "memory";

export default function NamesScreen() {
  const { t, lang } = useLanguage();
  const { width: W } = useWindowDimensions();

  const { players, impostors } = useLocalSearchParams<{
    players?: string;
    impostors?: string;
  }>();

  const totalPlayers = clamp(parseInt(players ?? "3", 10) || 3, 3, 33);
  const impostorsN = clamp(parseInt(impostors ?? "1", 10) || 1, 1, totalPlayers);

  const [mode, setMode] = useState<Mode>("counter");

  const [partyNames, setPartyNames] = useState<string[]>([]);
  const [savedNames, setSavedNames] = useState<string[]>([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [newName, setNewName] = useState("");

  // ✅ CONTROLES MANUALES DE LAYOUT (aquí mueves TODO sin romper)
  const SPACE_TOP = 70;
  const SPACE_AFTER_TITLE = 38;

  // ToggleBar -> AddNew
  const GAP_AFTER_TOGGLE = 18;

  // “ADD NEW” se mete encima del panel como en tu mock
  const ADDNEW_OVERLAP_ON_PANEL = 18; // 👈 sube/baja el overlap

  // Panel -> Next
  const GAP_AFTER_PANEL = 18;

  // Mover NEXT completo (no solo el texto)
  const NEXT_TOP = 10; // 👈 pon 10/20/30 si quieres bajarlo

  const SPACE_BOTTOM = 26;

  // layout responsive base
  const contentW = Math.min(W - 40, 420);

  const titleW = contentW;
  const titleH = Math.round(contentW * 0.22);

  // ✅ TOGGLE BAR tamaño MANUAL (lo pediste)
  const TOGGLE_W = contentW;
  const TOGGLE_H = 99; // 👈 AJUSTA MANUAL

  const addNewW = Math.round(contentW * 0.72);
  const addNewH = Math.round(contentW * 0.18);

  const nextW = Math.round(contentW * 0.92);
  const nextH = Math.round(nextW * 0.42);
  const nextFont = fs(lang, "setup_next");

  const labelFont = fs(lang, "setup_label");
  const toggleFont = Math.max(18, Math.round(contentW * 0.075));
  const listNameFont = Math.max(18, Math.round(contentW * 0.085));

  const countText = `${partyNames.length}/${totalPlayers}`;

  const memoryMode = mode === "memory";
  const listToShow = memoryMode ? savedNames : partyNames;

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

  const saveToMemory = async (name: string) => {
    const n = normalizeName(name);
    if (!n) return;

    setSavedNames((prev) => {
      const exists = prev.some((x) => x.toLowerCase() === n.toLowerCase());
      const next = exists ? prev : [n, ...prev];
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
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

  const onPressAddNew = () => {
    setNewName("");
    setModalOpen(true);
  };

  const confirmAddNew = async () => {
    const n = normalizeName(newName);
    if (!n) {
      setModalOpen(false);
      return;
    }
    addToParty(n);
    await saveToMemory(n);
    setModalOpen(false);
  };

  const goNext = () => {
    if (partyNames.length !== totalPlayers) {
      Alert.alert(
        t("names_alert_missing_title"),
        t("names_alert_missing_body").replace("{n}", String(totalPlayers))
      );
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

  return (
    <View style={styles.screen}>
      <View style={{ height: SPACE_TOP }} />

      {/* TITLE */}
      <ImageBackground
        source={labelNamesUp}
        resizeMode="contain"
        style={{ width: titleW, height: titleH, alignSelf: "center" }}
      >
        <View style={styles.titleInner}>
          <Text style={[styles.titleText, { fontSize: labelFont }]}>
            {t("names_title")}
          </Text>
        </View>
      </ImageBackground>

      <View style={{ height: SPACE_AFTER_TITLE }} />

      {/* TOGGLE BAR */}
      <ToggleBar
        width={TOGGLE_W}
        height={TOGGLE_H}
        countText={countText}
        active={mode}
        onChange={setMode}
        fontSize={toggleFont}
        // ✅ para que ToggleBar ponga “memory” traducido (si ya lo soporta)
        // si tu ToggleBar todavía no recibe esto, te digo abajo el cambio que falta.
        memoryText={t("names_memory")}
      />

      <View style={{ height: GAP_AFTER_TOGGLE }} />

      {/* ADD NEW (arriba del panel, con overlap). Slot siempre existe para no mover el panel */}
      <View
        style={[
          styles.addNewSlot,
          {
            width: addNewW,
            height: addNewH,
            marginBottom: -ADDNEW_OVERLAP_ON_PANEL,
          },
        ]}
      >
        {!memoryMode && (
          <PixelButton
            up={addNewUp}
            down={addNewDown}
            text={t("names_addNew")}
            width={addNewW}
            height={addNewH}
            fontSize={Math.max(18, Math.round(contentW * 0.075))}
            onPress={onPressAddNew}
            contentUp={{ top: 10, bottom: 18, left: 16, right: 16 }}
            contentDown={{ top: 16, bottom: 12, left: 16, right: 16 }}
          />
        )}
      </View>

      {/* PANEL (✅ ahora la lista es scrolleable dentro del rectángulo gris) */}
      <View style={[styles.panelWrap, { width: contentW }]}>
        <ImageBackground source={listPanelUp} resizeMode="stretch" style={styles.panelBg}>
          <View style={styles.listArea}>
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{ paddingBottom: 24 }}
              showsVerticalScrollIndicator={false}
              bounces={false}
            >
              {listToShow.length === 0 ? (
                <Text style={[styles.emptyText, { fontSize: listNameFont }]}>
                  {memoryMode ? t("names_empty_memory") : t("names_empty_party")}
                </Text>
              ) : (
                listToShow.map((name) => {
                  const inParty = partyNames.some((x) => x.toLowerCase() === name.toLowerCase());

                  return (
                    <View key={name} style={styles.listRow}>
                      <Pressable
                        onPress={() => {
                          if (!memoryMode) removeFromParty(name);
                        }}
                        style={{ flex: 1 }}
                      >
                        <Text
                          style={[styles.nameText, { fontSize: listNameFont }]}
                          numberOfLines={1}
                        >
                          {name}
                        </Text>
                      </Pressable>

                      {memoryMode && (
                        <View style={{ marginLeft: 10, opacity: inParty ? 0.45 : 1 }}>
                          <PixelButton
                            up={plusUp}
                            down={plusDown}
                            text=""
                            width={Math.round(contentW * 0.12)}
                            height={Math.round(contentW * 0.12)}
                            onPress={() => {
                              if (!inParty) addToParty(name);
                            }}
                            contentUp={{ top: 0, bottom: 0, left: 0, right: 0 }}
                            contentDown={{ top: 0, bottom: 0, left: 0, right: 0 }}
                          />
                        </View>
                      )}
                    </View>
                  );
                })
              )}
            </ScrollView>
          </View>
        </ImageBackground>
      </View>

      <View style={{ height: GAP_AFTER_PANEL }} />

      {/* NEXT */}
      <View style={{ marginTop: NEXT_TOP }}>
        <PixelButton
          up={nextUp}
          down={nextDown}
          text={t("setup_next")}
          width={nextW}
          height={nextH}
          fontSize={nextFont}
          onPress={goNext}
          textColor="#ffffff"
          contentUp={{ top: 28, bottom: 40, left: 26, right: 26 }}
          contentDown={{ top: 42, bottom: 26, left: 26, right: 26 }}
        />
      </View>

      <View style={{ height: SPACE_BOTTOM }} />

      {/* MODAL */}
      <Modal transparent visible={modalOpen} animationType="fade">
        <View style={styles.modalBack}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{t("names_modal_title")}</Text>

            <TextInput
              value={newName}
              onChangeText={setNewName}
              placeholder={t("names_modal_placeholder")}
              placeholderTextColor="#666"
              style={styles.input}
              autoFocus
            />

            <View style={styles.modalRow}>
              <Pressable onPress={() => setModalOpen(false)} style={styles.modalBtn}>
                <Text style={styles.modalBtnText}>{t("names_modal_cancel")}</Text>
              </Pressable>

              <Pressable onPress={confirmAddNew} style={styles.modalBtn}>
                <Text style={styles.modalBtnText}>{t("names_modal_add")}</Text>
              </Pressable>
            </View>

            <Text style={styles.modalHint}>{t("names_hint_remove")}</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#C8A35A",
    alignItems: "center",
  },

  titleInner: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 2,
  },
  titleText: {
    fontFamily: "PressStart2P",
    color: "#6A6A6A",
    textAlign: "center",
    includeFontPadding: false,
  },

  addNewSlot: {
    alignItems: "center",
    justifyContent: "center",
    zIndex: 50,
    elevation: 50,
  },

  // ✅ AQUÍ AJUSTAS EL TAMAÑO VERTICAL DEL RECTÁNGULO GRIS
  panelWrap: {
    flex: 1,
    alignSelf: "center",
    minHeight: 320, // 👈 AJUSTE MANUAL (alto mínimo)
    // height: 420,  // 👈 si quieres alto FIJO, descomenta
    zIndex: 1,
    elevation: 1,
  },
  panelBg: {
    flex: 1,
  },

  listArea: {
    position: "absolute",
    top: 28,
    left: 22,
    right: 22,
    bottom: 18,
    overflow: "hidden",
  },
  listRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: "rgba(0,0,0,0.15)",
  },
  nameText: {
    fontFamily: "PressStart2P",
    color: "#111",
    includeFontPadding: false,
  },
  emptyText: {
    fontFamily: "PressStart2P",
    color: "#333",
    includeFontPadding: false,
    marginTop: 12,
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
    marginBottom: 12,
    includeFontPadding: false,
  },
  input: {
    borderWidth: 2,
    borderColor: "#111",
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontFamily: "PressStart2P",
    color: "#111",
    fontSize: 14,
    includeFontPadding: false,
    backgroundColor: "#FFF",
  },
  modalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
  },
  modalBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 2,
    borderColor: "#111",
    backgroundColor: "#DADADA",
  },
  modalBtnText: {
    fontFamily: "PressStart2P",
    color: "#111",
    fontSize: 12,
    includeFontPadding: false,
  },
  modalHint: {
    fontFamily: "PressStart2P",
    color: "#444",
    fontSize: 10,
    marginTop: 12,
    includeFontPadding: false,
  },
});