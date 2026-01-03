import React, { useEffect, useMemo, useState } from "react";
import { Pressable, Image, StyleSheet, Text, View } from "react-native";
import { playClickSound } from "../sound/clickSound";

type Insets = { top: number; bottom: number; left: number; right: number };

type Props = {
  up: any;
  down: any;
  text: string;

  onPress?: () => void;

  width: number;
  height: number;
  fontSize?: number;

  contentUp?: Insets;
  contentDown?: Insets;

  onPressIn?: () => void;
  onPressOut?: () => void;

  // ✅ NUEVO: color del texto (opcional)
  textColor?: string;
};

export default function PixelButton({
  up,
  down,
  text,
  onPress,
  width,
  height,
  fontSize = 30,
  contentUp = { top: 14, bottom: 52, left: 18, right: 18 },
  contentDown = { top: 26, bottom: 40, left: 18, right: 18 },
  onPressIn,
  onPressOut,
  textColor = "#000",
}: Props) {
  const [isDown, setIsDown] = useState(false);

  const sizeStyle = useMemo(() => ({ width, height }), [width, height]);

  useEffect(() => {
    Image.resolveAssetSource(up);
    Image.resolveAssetSource(down);
  }, [up, down]);

  const box = isDown ? contentDown : contentUp;

  return (
    <Pressable
      style={sizeStyle}
      onPressIn={() => {
        setIsDown(true);
        playClickSound();
        onPressIn?.();
      }}
      onPressOut={() => {
        setIsDown(false);
        onPressOut?.();
      }}
      onPress={onPress}
    >
      <View style={sizeStyle}>
        <Image
          source={up}
          style={[styles.img, sizeStyle, { opacity: isDown ? 0 : 1 }]}
          resizeMode="stretch"
        />
        <Image
          source={down}
          style={[styles.img, sizeStyle, { opacity: isDown ? 1 : 0 }]}
          resizeMode="stretch"
        />

        <View
          pointerEvents="none"
          style={[
            styles.innerBox,
            { top: box.top, left: box.left, right: box.right, bottom: box.bottom },
          ]}
        >
          <Text style={[styles.text, { fontSize, color: textColor }]} numberOfLines={1}>
            {text}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  img: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  innerBox: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontFamily: "PressStart2P",
    textAlign: "center",
    includeFontPadding: false,
  },
});