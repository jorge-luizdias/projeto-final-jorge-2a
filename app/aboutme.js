import { StyleSheet, Text, View, Image, Animated, Easing, ImageBackground, ScrollView } from "react-native";
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
    <ImageBackground
      source={require("../../projeto-final-jorge-2a/assets/quarto.png")}
      style={styles.bg}
      imageStyle={{ resizeMode: "cover" }}
    >
      <View style={styles.container}>

        <Animated.View
          style={[
            styles.card,
            {
              shadowOpacity: glow,
              borderColor: "#e5c07b",
            },
          ]}
        >
          <ScrollView style={{ width: "100%" }} showsVerticalScrollIndicator={false}>

            <View style={{ alignItems: "center" }}>
              <Image
                source={require("../../projeto-final-jorge-2a/assets/avatar.png")}
                style={styles.avatar}
              />

              <Text style={styles.title}>Jorge Luiz</Text>
            </View>

            <View style={styles.leftBox}>
              <Text style={styles.text}>
                Idade: <Text style={styles.norm}>17</Text>
              </Text>

              <Text style={styles.text}>Gênero: Masculino</Text>

              <Text style={styles.textLong}>
                Gosto de desenhar, resolver quebra-cabeças e jogar.
              </Text>

              <Text style={styles.textLong}>
                O intuito deste site é proporcionar uma experiência dentro de um jogo,
                com foco no design pixelado e na interação.
              </Text>
            </View>

          </ScrollView>
        </Animated.View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    width: "100%",
    height: "100%",
  },

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.4)",
  },

  card: {
    width: "80%",              // 🔥 diminui a largura para não quebrar
    maxWidth: 480,
    maxHeight: "85%",          // 🔥 evita estourar em telas pequenas
    backgroundColor: "#111",
    paddingVertical: 25,
    paddingHorizontal: 20,
    borderRadius: 14,
    borderWidth: 3,
    shadowColor: "#e5c07b",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 18,
  },

  avatar: {
    width: 130,
    height: 130,
    borderRadius: 4,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: "#e5c07b",
  },

  title: {
    fontFamily: "PixelMedium",
    fontSize: 28,
    color: "#e5c07b",
    marginBottom: 18,
    textAlign: "center",
  },

  leftBox: {
    width: "100%",
    paddingHorizontal: 3,
  },

  text: {
    fontFamily: "PixelMedium",
    fontSize: 18,
    color: "#f0f0f0",
    marginBottom: 10,
    lineHeight: 26,
  },

  textLong: {
    fontFamily: "PixelMedium",
    fontSize: 16,             // 🔥 menor para caber melhor
    color: "#f0f0f0",
    marginBottom: 14,
    lineHeight: 26,
    textAlign: "justify",     // 🔥 deixa muito mais legível
  },

  norm: {
    fontFamily: "Arial",
    fontSize: 16,
    color: "#d0d0d0",
  },
});
