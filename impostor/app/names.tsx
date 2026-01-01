import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function NamesScreen() {
  const { players, impostors } = useLocalSearchParams<{
    players?: string;
    impostors?: string;
  }>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pantalla de nombres (placeholder)</Text>
      <Text style={styles.text}>Jugadores: {players}</Text>
      <Text style={styles.text}>Impostores: {impostors}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", alignItems: "center", justifyContent: "center" },
  title: { color: "white", fontSize: 18, marginBottom: 16 },
  text: { color: "white", fontSize: 14, marginTop: 6 },
});