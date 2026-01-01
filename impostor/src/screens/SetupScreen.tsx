// src/screens/SetupScreen.tsx
// (1) Imports
import React, { useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Easing,
  SafeAreaView,
} from "react-native";

// (2) Límites
const MIN_PLAYERS = 3;  // (20)
const MAX_PLAYERS = 33; // (21)
const MIN_IMPOSTORS = 1; // (22)

// (3) Helpers de clamp
function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

// (4) Botón pixel con animación "presionado"
function PixelButton(props: {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  style?: any;
  textStyle?: any;
}) {
  const { label, onPress, disabled, style, textStyle } = props;

  const y = useRef(new Animated.Value(0)).current;     // (49)
  const s = useRef(new Animated.Value(1)).current;     // (50)

  const pressIn = () => {
    Animated.parallel([
      Animated.timing(y, {
        toValue: 2, // baja 2px
        duration: 70,
        useNativeDriver: true,
        easing: Easing.out(Easing.quad),
      }),
      Animated.timing(s, {
        toValue: 0.98,
        duration: 70,
        useNativeDriver: true,
        easing: Easing.out(Easing.quad),
      }),
    ]).start();
  };

  const pressOut = () => {
    Animated.parallel([
      Animated.timing(y, {
        toValue: 0,
        duration: 90,
        useNativeDriver: true,
        easing: Easing.out(Easing.quad),
      }),
      Animated.timing(s, {
        toValue: 1,
        duration: 90,
        useNativeDriver: true,
        easing: Easing.out(Easing.quad),
      }),
    ]).start();
  };

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      onPressIn={pressIn}
      onPressOut={pressOut}
      style={({ pressed }) => [{ opacity: disabled ? 0.5 : 1 }]}
    >
      <Animated.View
        style={[
          styles.pixelBtn,
          style,
          {
            transform: [{ translateY: y }, { scale: s }],
          },
        ]}
      >
        <Text style={[styles.pixelBtnText, textStyle]}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
}

// (5) Flecha pixel (izq/der) con animación presionado, aunque esté en límite
function ArrowButton(props: {
  direction: "left" | "right";
  onPress: () => void; // OJO: si está en límite igual se anima, pero tú decides si cambia número
  disabledVisual?: boolean; // solo para oscurecer
}) {
  const { direction, onPress, disabledVisual } = props;

  const y = useRef(new Animated.Value(0)).current; // (132)
  const s = useRef(new Animated.Value(1)).current; // (133)

  const pressIn = () => {
    Animated.parallel([
      Animated.timing(y, {
        toValue: 2,
        duration: 70,
        useNativeDriver: true,
        easing: Easing.out(Easing.quad),
      }),
      Animated.timing(s, {
        toValue: 0.98,
        duration: 70,
        useNativeDriver: true,
        easing: Easing.out(Easing.quad),
      }),
    ]).start();
  };

  const pressOut = () => {
    Animated.parallel([
      Animated.timing(y, {
        toValue: 0,
        duration: 90,
        useNativeDriver: true,
        easing: Easing.out(Easing.quad),
      }),
      Animated.timing(s, {
        toValue: 1,
        duration: 90,
        useNativeDriver: true,
        easing: Easing.out(Easing.quad),
      }),
    ]).start();
  };

  return (
    <Pressable onPress={onPress} onPressIn={pressIn} onPressOut={pressOut}>
      <Animated.View
        style={[
          styles.arrowBtn,
          { opacity: disabledVisual ? 0.45 : 1 },
          { transform: [{ translateY: y }, { scale: s }] },
        ]}
      >
        <Text style={styles.arrowText}>{direction === "left" ? "◀" : "▶"}</Text>
      </Animated.View>
    </Pressable>
  );
}

// (6) Caja de número con animación "pop" cuando cambia
function NumberBox(props: { value: number }) {
  const { value } = props;
  const pop = useRef(new Animated.Value(1)).current;

  // dispara pop cuando cambia value
  React.useEffect(() => {
    pop.setValue(1);
    Animated.sequence([
      Animated.timing(pop, {
        toValue: 1.15,
        duration: 70,
        useNativeDriver: true,
        easing: Easing.out(Easing.quad),
      }),
      Animated.timing(pop, {
        toValue: 1,
        duration: 70,
        useNativeDriver: true,
        easing: Easing.out(Easing.quad),
      }),
    ]).start();
  }, [value]); // (221)

  return (
    <Animated.View style={[styles.numberBox, { transform: [{ scale: pop }] }]}>
      <Text style={styles.numberText}>{value}</Text>
    </Animated.View>
  );
}

// (7) Screen
export default function SetupScreen({ navigation }: any) {
  // defaults (puedes cambiarlos)
  const [players, setPlayers] = useState<number>(3); // (240)
  const [impostors, setImpostors] = useState<number>(1); // (241)

  const maxImpostors = useMemo(() => players, [players]); // (243)

  // (8) handlers jugadores
  const incPlayers = () => {
    setPlayers((p) => {
      const next = clamp(p + 1, MIN_PLAYERS, MAX_PLAYERS);
      return next;
    });
  };

  const decPlayers = () => {
    setPlayers((p) => {
      const nextPlayers = clamp(p - 1, MIN_PLAYERS, MAX_PLAYERS);

      // si al bajar jugadores, impostores queda > jugadores, ajusta
      setImpostors((imp) => clamp(imp, MIN_IMPOSTORS, nextPlayers)); // (262)

      return nextPlayers;
    });
  };

  // (9) handlers impostores
  const incImpostors = () => {
    setImpostors((imp) => clamp(imp + 1, MIN_IMPOSTORS, maxImpostors));
  };

  const decImpostors = () => {
    setImpostors((imp) => clamp(imp - 1, MIN_IMPOSTORS, maxImpostors));
  };

  // (10) visual disabled (solo para oscurecer flechas)
  const playersLeftDisabled = players <= MIN_PLAYERS; // (279)
  const playersRightDisabled = players >= MAX_PLAYERS; // (280)
  const impostorsLeftDisabled = impostors <= MIN_IMPOSTORS; // (281)
  const impostorsRightDisabled = impostors >= maxImpostors; // (282)

  // (11) Next
  const goNext = () => {
    // aquí solo navegas. Guardarás estos valores donde quieras luego (context/store)
    // navigation.navigate("NamesScreen", { players, impostors });
    if (navigation?.navigate) navigation.navigate("NamesScreen", { players, impostors });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Título */}
        <Text style={styles.title}>JUGAR</Text>

        {/* BLOQUE JUGADORES */}
        <View style={styles.block}>
          <Text style={styles.label}>Jugadores</Text>

          <View style={styles.row}>
            <ArrowButton
              direction="left"
              disabledVisual={playersLeftDisabled}
              onPress={() => {
                // se anima igual; solo cambia si no está bloqueado
                if (!playersLeftDisabled) decPlayers();
              }}
            />

            <NumberBox value={players} />

            <ArrowButton
              direction="right"
              disabledVisual={playersRightDisabled}
              onPress={() => {
                if (!playersRightDisabled) incPlayers();
              }}
            />
          </View>

          <Text style={styles.hint}>Min {MIN_PLAYERS} · Max {MAX_PLAYERS}</Text>
        </View>

        {/* BLOQUE IMPOSTORES */}
        <View style={styles.block}>
          <Text style={styles.label}>Impostores</Text>

          <View style={styles.row}>
            <ArrowButton
              direction="left"
              disabledVisual={impostorsLeftDisabled}
              onPress={() => {
                if (!impostorsLeftDisabled) decImpostors();
              }}
            />

            <NumberBox value={impostors} />

            <ArrowButton
              direction="right"
              disabledVisual={impostorsRightDisabled}
              onPress={() => {
                if (!impostorsRightDisabled) incImpostors();
              }}
            />
          </View>

          <Text style={styles.hint}>Máximo: {maxImpostors}</Text>
        </View>

        {/* BOTÓN SIGUIENTE */}
        <View style={{ height: 18 }} />
        <PixelButton label="SIGUIENTE" onPress={goNext} />
      </View>
    </SafeAreaView>
  );
}

// (12) Styles — cámbialos para que calcen con tu look pixel art
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0B0B0B" }, // (379)
  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 18,
    justifyContent: "flex-start",
    gap: 22,
  },
  title: {
    fontSize: 28,
    color: "#EAEAEA",
    letterSpacing: 2,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 4,
  },
  block: {
    backgroundColor: "#131313",
    borderWidth: 2,
    borderColor: "#2A2A2A",
    borderRadius: 10,
    padding: 14,
    gap: 10,
  },
  label: {
    color: "#EAEAEA",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
  },
  hint: {
    color: "#9A9A9A",
    fontSize: 12,
    letterSpacing: 0.5,
  },

  arrowBtn: {
    width: 58,
    height: 58,
    borderWidth: 2,
    borderColor: "#2A2A2A",
    backgroundColor: "#101010",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  arrowText: {
    color: "#EAEAEA",
    fontSize: 22,
    fontWeight: "900",
  },

  numberBox: {
    flex: 1,
    height: 58,
    borderWidth: 2,
    borderColor: "#2A2A2A",
    backgroundColor: "#0F0F0F",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  numberText: {
    color: "#32D583", // verde retro (cámbialo al tuyo)
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: 2,
  },

  pixelBtn: {
    height: 64,
    borderWidth: 2,
    borderColor: "#2A2A2A",
    backgroundColor: "#101010",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  pixelBtnText: {
    color: "#EAEAEA",
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 2,
  },
});