import React from "react";
import { View, Text, StyleSheet } from "react-native";
import PixelButton from "../components/PixelButton";

const btnUp = require("../../assets/buttons/btn_primary_up.png");
const btnDown = require("../../assets/buttons/btn_primary_down.png");

type Props = {
  onStart: () => void;
};

export default function HomeScreen({ onStart }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Retro Impostor</Text>

      <PixelButton up={btnUp} down={btnDown} onPress={onStart} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  title: {
    color: "white",
    fontSize: 32,
  },
});