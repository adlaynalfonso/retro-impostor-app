import React, { useState } from "react";
import { Modal, View, Text, TextInput, Pressable, StyleSheet } from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  onConfirm: (name: string) => void;
};

export default function AddNameModal({ visible, onClose, onConfirm }: Props) {
  const [value, setValue] = useState("");

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.back}>
        <View style={styles.card}>
          <Text style={styles.title}>New name</Text>

          <TextInput
            value={value}
            onChangeText={setValue}
            placeholder="Type a name"
            placeholderTextColor="#666"
            style={styles.input}
            autoFocus
          />

          <View style={styles.row}>
            <Pressable
              onPress={() => {
                setValue("");
                onClose();
              }}
              style={styles.btn}
            >
              <Text style={styles.btnText}>Cancel</Text>
            </Pressable>

            <Pressable
              onPress={() => {
                onConfirm(value);
                setValue("");
              }}
              style={styles.btn}
            >
              <Text style={styles.btnText}>Add</Text>
            </Pressable>
          </View>

          <Text style={styles.hint}>Tip: tap a name to remove it (only in normal mode).</Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  back: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#E7E7E7",
    borderWidth: 2,
    borderColor: "#111",
    padding: 16,
  },
  title: {
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
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
  },
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 2,
    borderColor: "#111",
    backgroundColor: "#DADADA",
  },
  btnText: {
    fontFamily: "PressStart2P",
    color: "#111",
    fontSize: 12,
    includeFontPadding: false,
  },
  hint: {
    fontFamily: "PressStart2P",
    color: "#444",
    fontSize: 10,
    marginTop: 12,
    includeFontPadding: false,
  },
});