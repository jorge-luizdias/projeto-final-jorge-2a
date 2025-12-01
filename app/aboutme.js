import { StyleSheet, Text, View, Image, Animated, Easing } from "react-native";
import { useEffect, useRef } from "react";

export default function AboutMe() {
  const glow = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glow, { toValue: 1, duration: 1400, easing: Easing.ease, useNativeDriver: false }),
        Animated.timing(glow, { toValue: 0.6, duration: 1200, easing: Easing.ease, useNativeDriver: false }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>

      {/* CARD COMPLETO */}
      <Animated.View
        style={[
          styles.card,
          {
            shadowOpacity: glow,
            borderColor: "#ff00ff",
          },
        ]}
      >

        {/* FOTO CENTRALIZADA */}
        <Image
          source={require("../../projeto-final-jorge-2a/assets/avatar.png")}
          style={styles.avatar}
        />

        {/* NOME CENTRALIZADO */}
        <Text style={styles.title}>Jorge Luiz</Text>

        {/* CONTEÚDO ALINHADO À ESQUERDA */}
        <View style={styles.leftBox}>
          <Text style={styles.text}>
            Idade: <Text style={styles.norm}>17</Text>
          </Text>

          <Text style={styles.text}>
            Gênero: Masculino
          </Text>

          <Text style={styles.text}>
            Passatempo: Desenhar, Jogos e quebra-cabeças.
          </Text>
        </View>

      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#080808",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  card: {
    width: "80%",
    maxWidth: 500,
    backgroundColor: "#111",
    paddingVertical: 30,
    paddingHorizontal: 25,
    borderRadius: 20,
    borderWidth: 3,
    shadowColor: "#ff00ff",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 20,
    alignItems: "center", // 🔥 garante centralização da foto + nome
  },

  avatar: {
    width: 150,
    height: 150,
    borderRadius: 12,
    marginBottom: 18,
    borderWidth: 3,
    borderColor: "#ff00ff",
  },

  title: {
    fontFamily: "PixelMedium",
    fontSize: 36,
    color: "#ff00ff",
    marginBottom: 22,
    textAlign: "center", // 🔥 centraliza o nome
  },

  leftBox: {
    width: "100%", // 🔥 garante alinhamento à esquerda
  },

  text: {
    fontFamily: "PixelMedium",
    fontSize: 18,
    color: "#d0d0d0",
    marginBottom: 12,
    lineHeight: 26,
    textAlign: "left",
  },

  norm: {
    fontFamily: "Arial",
    fontSize: 15,
    color: "#d0d0d0",
  },
});
