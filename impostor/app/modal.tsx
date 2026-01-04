import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Link } from "expo-router";

export default function ModalScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>THIS IS A MODAL</Text>

      <Link href="/" dismissTo asChild>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>GO HOME</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontFamily: "PressStart2P",
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginBottom: 32,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: "#fff",
  },
  buttonText: {
    fontFamily: "PressStart2P",
    fontSize: 12,
    color: "#fff",
    textAlign: "center",
  },
});