import { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList, ScrollView } from "react-native";

// IMAGENS DE ROSTO
import rostoGuerreiro from "../assets/rostos/c_guerreiro.png";
import rostoGuerreira from "../assets/rostos/c_guerreira.png";
import rostoFeiticeiro from "../assets/rostos/c_feiticeiro.png";
import rostoArqueira from "../assets/rostos/c_arqueira.png";
import rostoCorujo from "../assets/rostos/c_corujo.png";
import rostoKing from "../assets/rostos/c_king.png";
import rostoPirata from "../assets/rostos/c_pirata.png";

// PERSONAGENS
import guerreiro from "../assets/guerreiro.png";
import guerreira from "../assets/guerreira.png";
import feiticeiro from "../assets/feiticeiro.png";
import arqueira from "../assets/arqueira.png";
import corujo from "../assets/corujo.png";
import king from "../assets/king.png";
import pirata from "../assets/pirata.png";

const personagens = [
  { id: 1, nome: "Ragnar, o Escudo de Ferro", imagem: guerreiro, icone: rostoGuerreiro, info: { classe: "Tank", dificuldade: "Fácil", forca: 8, defesa: 9, descricao: "Ragnar é um veterano das Terras Cinzentas." } },
  { id: 2, nome: "Lyanna, a Lâmina Carmesim", imagem: guerreira, icone: rostoGuerreira, info: { classe: "Lutadora", dificuldade: "Média", forca: 7, defesa: 7, descricao: "Golpes rápidos e mortais." } },
  { id: 3, nome: "Azerion, o Arcanista Perdido", imagem: feiticeiro, icone: rostoFeiticeiro, info: { classe: "Mago", dificuldade: "Difícil", forca: 10, defesa: 3, descricao: "Feitiços devastadores." } },
  { id: 4, nome: "Eridian, a Flecha Fantasma", imagem: arqueira, icone: rostoArqueira, info: { classe: "Atiradora", dificuldade: "Média", forca: 6, defesa: 5, descricao: "Precisão absurda." } },
  { id: 5, nome: "Corujo, o Guardião da Luz", imagem: corujo, icone: rostoCorujo, info: { classe: "Suporte", dificuldade: "Fácil", forca: 4, defesa: 6, descricao: "Cura aliados." } },
  { id: 6, nome: "Brutus King, o Punho do Caos", imagem: king, icone: rostoKing, info: { classe: "Brutamonte", dificuldade: "Média", forca: 9, defesa: 8, descricao: "Força bruta total." } },
  { id: 7, nome: "Drax, o Pirata das Sombras", imagem: pirata, icone: rostoPirata, info: { classe: "Assassino", dificuldade: "Difícil", forca: 7, defesa: 4, descricao: "Especialista em emboscadas." } },
];

export default function Page() {
  const [selecionado, setSelecionado] = useState(personagens[0]);
  const [tela, setTela] = useState("selecao");
  const [gridAberto, setGridAberto] = useState(true);

  if (tela === "taverna") {
    return (
      <View style={styles.taverna}>
        <Text style={styles.tavernaTitulo}>Taverna</Text>
        <Image source={selecionado.imagem} style={styles.tavernaImg} />
        <Text style={styles.tavernaNome}>{selecionado.nome}</Text>

        <TouchableOpacity style={styles.botaoVoltar} onPress={() => setTela("selecao")}>
          <Text style={{ color: "white" }}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Seleção de Personagem</Text>

      <View style={styles.content}>
        {/* PAINEL RETRÁTIL LATERAL */}
        {gridAberto && (
          <View style={styles.gridWrapper}>
            <FlatList
              data={personagens}
              numColumns={2}
              scrollEnabled={false}
              keyExtractor={(item) => item.id.toString()}
              columnWrapperStyle={{ justifyContent: "space-between" }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.card, selecionado.id === item.id && styles.cardAtivo]}
                  onPress={() => setSelecionado(item)}
                >
                  <Image source={item.icone} style={styles.cardImg} />
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        {/* PREVIEW */}
        <View style={[styles.preview, !gridAberto && { width: "100%" }]}>
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => setGridAberto(!gridAberto)}
          >
            <Text style={styles.toggleText}>
              {gridAberto ? "◀ Fechar" : "▶ Abrir"}
            </Text>
          </TouchableOpacity>

          <View style={styles.previewBox}>
            <Image source={selecionado.imagem} style={styles.previewImg} />
          </View>

          <Text style={styles.previewNome}>{selecionado.nome}</Text>

          <View style={styles.infoBox}>
            <Text style={styles.infoLinha}>Classe: {selecionado.info.classe}</Text>
            <Text style={styles.infoLinha}>Dificuldade: {selecionado.info.dificuldade}</Text>
            <Text style={styles.infoLinha}>Força: {selecionado.info.forca}/10</Text>
            <Text style={styles.infoLinha}>Defesa: {selecionado.info.defesa}/10</Text>
            <Text style={styles.infoDesc}>{selecionado.info.descricao}</Text>
          </View>

          <TouchableOpacity style={styles.botaoSelecionar} onPress={() => setTela("taverna")}>
            <Text style={{ color: "black", fontSize: 22, fontFamily: "PixelBold" }}>
              Entrar na Taverna
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

// ================= ESTILOS =================

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d0d0f", padding: 20 },

  title: { fontSize: 36, fontFamily: "PixelBold", color: "white", textAlign: "center", marginBottom: 20 },

  content: { flexDirection: "row", flex: 1 },

  gridWrapper: { width: "35%", paddingRight: 10 },

  card: {
    width: "47%",
    aspectRatio: 1,
    marginBottom: 12,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#141416",
    borderWidth: 3,
    borderColor: "transparent",
  },

  cardAtivo: { borderColor: "#e5c07b" },

  cardImg: { width: "100%", height: "100%", resizeMode: "contain" },

  preview: { width: "65%", alignItems: "center" },

  toggleButton: {
    alignSelf: "flex-start",
    backgroundColor: "#e5c07b",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 10,
  },

  toggleText: { fontWeight: "bold" },

  previewBox: {
    width: "90%",
    height: 280,
    backgroundColor: "#1a1a1c",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: "#e5c07b",
  },

  previewImg: { width: "85%", height: "85%", resizeMode: "contain" },

  previewNome: { marginTop: 15, color: "white", fontSize: 30, fontFamily: "PixelBold" },

  infoBox: {
    marginTop: 15,
    width: "80%",
    padding: 15,
    backgroundColor: "#121214",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#e5c07b",
  },

  infoLinha: { color: "white", fontSize: 16, marginBottom: 4, fontFamily: "PixelMedium" },

  infoDesc: { marginTop: 10, color: "#cfcfcf", fontSize: 14, fontFamily: "PixelMedium" },

  botaoSelecionar: {
    marginTop: 20,
    backgroundColor: "#e5c07b",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 12,
  },

  taverna: { flex: 1, backgroundColor: "#0d0d0f", alignItems: "center", justifyContent: "center" },

  tavernaTitulo: { fontSize: 40, color: "white", fontFamily: "PixelBold", marginBottom: 20 },

  tavernaImg: { width: 250, height: 250, resizeMode: "contain" },

  tavernaNome: { marginTop: 10, fontSize: 28, color: "white", fontFamily: "PixelBold" },

  botaoVoltar: { marginTop: 25, backgroundColor: "#444", padding: 12, borderRadius: 10 },
});
