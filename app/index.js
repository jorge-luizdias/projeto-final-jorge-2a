import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { useState } from "react";

// ✅ IMPORTAÇÃO DIRETA DAS IMAGENS (CORREÇÃO DO ERRO)
import guerreiro from "../assets/guerreiro.png";
import guerreira from "../assets/guerreira.png";
import feiticeiro from "../assets/feiticeiro.png";
import arqueira from "../assets/arqueira.png";
import corujo from "../assets/corujo.png";
import king from "../assets/king.png";
import pirata from "../assets/pirata.png";

const personagens = [
  { id: 1, nome: "Guerreiro", imagem: guerreiro },
  { id: 2, nome: "Guerreira", imagem: guerreira },
  { id: 3, nome: "Feiticeiro", imagem: feiticeiro },
  { id: 4, nome: "Arqueira", imagem: arqueira },
  { id: 5, nome: "Corujo", imagem: corujo },
  { id: 6, nome: "King", imagem: king },
  { id: 7, nome: "Pirata", imagem: pirata },
];

export default function Page() {
  const [selecionado, setSelecionado] = useState(personagens[0]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Seleção de Personagem</Text>

      <View style={styles.menu}>
        {/* LISTA */}
        <View style={styles.lista}>
          {personagens.map((p) => (
  <TouchableOpacity
    key={p.id}
    style={[
      styles.botao,
      selecionado?.id === p.id && styles.botaoAtivo,
    ]}
    onPress={() => setSelecionado(p)}
  >
    <Text style={styles.textoBotao}>{p.nome}</Text>
  </TouchableOpacity>
))}

        </View>

        {/* PREVIEW */}
        <View style={styles.preview}>
          <Image source={selecionado.imagem} style={styles.imagem} />
          <Text style={styles.nomePreview}>{selecionado.nome}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFAF0",
    padding: 20,
  },

  title: {
    fontSize: 42,
    fontFamily: "PixelBold",
    textAlign: "center",
    marginBottom: 20,
  },

  menu: {
    flex: 1,
    flexDirection: "row",
  },

  lista: {
    width: "35%",
    justifyContent: "center",
  },

  botao: {
    backgroundColor: "#DDD",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
  },

  botaoAtivo: {
    backgroundColor: "#A67C52",
  },

  textoBotao: {
    fontSize: 18,
    fontFamily: "PixelMedium",
    textAlign: "center",
  },

  preview: {
    width: "65%",
    alignItems: "center",
    justifyContent: "center",
  },

  imagem: {
    width: 220,
    height: 320,
    resizeMode: "contain",
  },

  nomePreview: {
    fontSize: 28,
    marginTop: 10,
    fontFamily: "PixelBold",
  },
});
