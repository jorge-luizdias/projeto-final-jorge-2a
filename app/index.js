import { StyleSheet, Text, View } from "react-native";

export default function Page() {
  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <Text style={styles.title}>Página Inicial</Text>
        <Text style={styles.subtitle}>Pré-requisito para a disciplina de DDM</Text>
         <Text style={styles.subtitlee}>Pré-requisito para a disciplina de DDM</Text>
          <Text style={styles.subtitleee}>Pré-requisito para a disciplina de DDM</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
    backgroundColor: "#FFFAF0",
  },
  main: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 960,
    marginHorizontal: "auto",
  },
  title: {
    fontSize: 64,
    fontWeight: "bold",
    fontFamily: "PixelBold" 
  },
  subtitle: {
    fontSize: 36,
    color: "#38434D",
    fontFamily: "PixelMedium"
  },
   subtitlee: {
    fontSize: 36,
    color: "#38434D",
    fontFamily: "PixelRegular"
  },
   subtitleee: {
    fontSize: 36,
    color: "#38434D",
    fontFamily: "PixelSemiBold"
  },
});
