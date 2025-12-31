import { View, Text, StyleSheet } from "react-native";

export default function Players() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pantalla de jugadores</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", alignItems: "center", justifyContent: "center" },
  title: { color: "white", fontSize: 24 },
});