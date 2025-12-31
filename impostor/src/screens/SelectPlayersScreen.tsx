import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

type Props = {
  onNext: (players: number) => void;
};

export default function SelectPlayersScreen({ onNext }: Props) {
  const [players, setPlayers] = useState(3);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¿Cuántos jugadores?</Text>

      <View style={styles.row}>
        <Pressable
          style={styles.smallBtn}
          onPress={() => setPlayers((p) => Math.max(3, p - 1))}
        >
          <Text style={styles.smallBtnText}>-</Text>
        </Pressable>

        <Text style={styles.number}>{players}</Text>

        <Pressable
          style={styles.smallBtn}
          onPress={() => setPlayers((p) => Math.min(24, p + 1))}
        >
          <Text style={styles.smallBtnText}>+</Text>
        </Pressable>
      </View>

      <Pressable style={styles.nextBtn} onPress={() => onNext(players)}>
        <Text style={styles.nextBtnText}>Continuar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    gap: 18,
  },
  title: { color: "white", fontSize: 24 },
  row: { flexDirection: "row", alignItems: "center", gap: 20 },
  smallBtn: {
    width: 60,
    height: 60,
    borderWidth: 2,
    borderColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  smallBtnText: { color: "white", fontSize: 28 },
  number: { color: "white", fontSize: 48, width: 90, textAlign: "center" },
  nextBtn: {
    marginTop: 10,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: "white",
  },
  nextBtnText: { color: "white", fontSize: 18 },
});