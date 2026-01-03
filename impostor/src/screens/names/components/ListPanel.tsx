import React from "react";
import { View, StyleSheet, ImageBackground, Text } from "react-native";
import PixelButton from "../../../components/PixelButton";

const listPanelUp = require("../../../../assets/ui/list_panel_up.png");
const plusUp = require("../../../../assets/ui/btn_plus_up.png");
const plusDown = require("../../../../assets/ui/btn_plus_down.png");

type Props = {
  width: number;
  height: number;

  memoryMode: boolean;
  partyNames: string[];
  list: string[];

  onRemoveParty: (name: string) => void;
  onAddParty: (name: string) => void;
};

export default function ListPanel({
  width,
  height,
  memoryMode,
  partyNames,
  list,
  onRemoveParty,
  onAddParty,
}: Props) {
  return (
    <View style={{ width, height }}>
      <ImageBackground source={listPanelUp} resizeMode="stretch" style={styles.absFill} />

      <View style={styles.listArea}>
        {list.length === 0 ? (
          <Text style={styles.emptyText}>{memoryMode ? "No saved names" : "No names yet"}</Text>
        ) : (
          list.slice(0, 12).map((name) => {
            const inParty = partyNames.some((x) => x.toLowerCase() === name.toLowerCase());
            return (
              <View key={name} style={styles.row}>
                <Text
                  style={styles.nameText}
                  numberOfLines={1}
                  onPress={() => {
                    if (!memoryMode) onRemoveParty(name);
                  }}
                >
                  {name}
                </Text>

                {memoryMode && (
                  <View style={{ marginLeft: 10, opacity: inParty ? 0.45 : 1 }}>
                    <PixelButton
                      up={plusUp}
                      down={plusDown}
                      text=""
                      width={44}
                      height={44}
                      onPress={() => {
                        if (!inParty) onAddParty(name);
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  absFill: { position: "absolute", inset: 0 },
  listArea: {
    position: "absolute",
    top: 28,
    left: 22,
    right: 22,
    bottom: 18,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: "rgba(0,0,0,0.12)",
  },
  nameText: {
    flex: 1,
    fontFamily: "PressStart2P",
    fontSize: 18,
    color: "#111",
    includeFontPadding: false,
  },
  emptyText: {
    fontFamily: "PressStart2P",
    fontSize: 22,
    color: "#333",
    includeFontPadding: false,
    marginTop: 12,
  },
});