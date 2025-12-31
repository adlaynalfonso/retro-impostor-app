import { View, Text, StyleSheet } from "react-native";

export default function Settings() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>AJUSTES</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#5C6A73",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "white",
    fontSize: 24,
  },
});