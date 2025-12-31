import { View, StyleSheet } from "react-native";
import { Link } from "expo-router";
import PixelButton from "../../src/components/PixelButton";

const btnUp = require("../../assets/buttons/btn_primary_up.png");
const btnDown = require("../../assets/buttons/btn_primary_down.png");

export default function Home() {
  return (
    <View style={styles.screen}>
      <View style={styles.column}>
        <Link href="/players" asChild>
          <PixelButton up={btnUp} down={btnDown} onPress={() => {}} />
        </Link>

        <Link href="/language" asChild>
          <PixelButton up={btnUp} down={btnDown} onPress={() => {}} />
        </Link>

        <Link href="/settings" asChild>
          <PixelButton up={btnUp} down={btnDown} onPress={() => {}} />
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#5C6A73", // gris/azulado como tu Figma
    alignItems: "center",
    justifyContent: "center",
  },
  column: {
    gap: 26, // separación entre botones
    alignItems: "center",
  },
});