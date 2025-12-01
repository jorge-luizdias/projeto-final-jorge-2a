import { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList } from "react-native";

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
  {
    id: 1,
    nome: "Ragnar, o Escudo de Ferro",
    imagem: guerreiro,
    icone: rostoGuerreiro,
    info: {
      classe: "Tank",
      dificuldade: "Fácil",
      forca: 8,
      defesa: 9,
      descricao:
        "Ragnar é um veterano das Terras Cinzentas. Resistência absurda e defesa altíssima.",
    },
  },
  {
    id: 2,
    nome: "Lyanna, a Lâmina Carmesim",
    imagem: guerreira,
    icone: rostoGuerreira,
    info: {
      classe: "Lutadora",
      dificuldade: "Média",
      forca: 7,
      defesa: 7,
      descricao:
        "Golpes rápidos e acrobáticos, mortal em combates próximos.",
    },
  },
  {
    id: 3,
    nome: "Azerion, o Arcanista Perdido",
    imagem: feiticeiro,
    icone: rostoFeiticeiro,
    info: {
      classe: "Mago",
      dificuldade: "Difícil",
      forca: 10,
      defesa: 3,
      descricao:
        "Feitiços devastadores, mas extremamente frágil.",
    },
  },
  {
    id: 4,
    nome: "Eridian, a Flecha Fantasma",
    imagem: arqueira,
    icone: rostoArqueira,
    info: {
      classe: "Atiradora",
      dificuldade: "Média",
      forca: 6,
      defesa: 5,
      descricao:
        "Ataques rápidos à distância e grande precisão.",
    },
  },
  {
    id: 5,
    nome: "Corujo, o Guardião da Luz",
    imagem: corujo,
    icone: rostoCorujo,
    info: {
      classe: "Suporte",
      dificuldade: "Fácil",
      forca: 4,
      defesa: 6,
      descricao:
        "Cura aliados e fortalece toda a equipe.",
    },
  },
  {
    id: 6,
    nome: "Brutus King, o Punho do Caos",
    imagem: king,
    icone: rostoKing,
    info: {
      classe: "Brutamonte",
      dificuldade: "Média",
      forca: 9,
      defesa: 8,
      descricao:
        "Puro dano físico e agressividade.",
    },
  },
  {
    id: 7,
    nome: "Drax, o Pirata das Sombras",
    imagem: pirata,
    icone: rostoPirata,
    info: {
      classe: "Assassino",
      dificuldade: "Difícil",
      forca: 7,
      defesa: 4,
      descricao:
        "Crítico e veneno, especialista em emboscadas.",
    },
  },
];

export default function Page() {
  const [selecionado, setSelecionado] = useState(personagens[0]);
  const [tela, setTela] = useState("selecao"); // seleção → taverna

  if (tela === "taverna") {
    return (
      <View style={styles.taverna}>
        <Text style={styles.tavernaTitulo}>Taverna de Aetheryon</Text>
        <Image
          source={selecionado.imagem}
          style={{ width: 250, height: 250, resizeMode: "contain" }}
        />
        <Text style={styles.tavernaNome}>{selecionado.nome}</Text>

        <TouchableOpacity
          style={styles.botaoVoltar}
          onPress={() => setTela("selecao")}
        >
          <Text style={{ color: "white", fontSize: 20 }}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Seleção de Personagem</Text>

      <View style={styles.content}>
        {/* GRID */}
        <View style={styles.gridContainer}>
          <FlatList
            data={personagens}
            numColumns={2}
            keyExtractor={(item) => item.id}
            columnWrapperStyle={{ justifyContent: "space-between" }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.card,
                  selecionado.id === item.id && styles.cardAtivo,
                ]}
                onPress={() => setSelecionado(item)}
              >
                <Image source={item.icone} style={styles.cardImg} />
              </TouchableOpacity>
            )}
          />
        </View>

        {/* PREVIEW */}
        <View style={styles.preview}>
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

          <TouchableOpacity
            style={styles.botaoSelecionar}
            onPress={() => setTela("taverna")}
          >
            <Text style={{ color: "black", fontSize: 22, fontFamily: "PixelBold" }}>
              Entrar na Taverna
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// ESTILOS
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d0d0f",
    padding: 20,
  },

  title: {
    fontSize: 40,
    fontFamily: "PixelBold",
    color: "white",
    textAlign: "center",
    marginBottom: 20,
  },

  content: {
    flexDirection: "row",
    flex: 1,
  },

  gridContainer: {
    width: "40%",
    paddingRight: 10,
  },

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

  cardAtivo: {
    borderColor: "#e5c07b",
  },

  cardImg: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  preview: {
    width: "60%",
    alignItems: "center",
  },

  previewBox: {
    width: "85%",
    height: "55%",
    backgroundColor: "#1a1a1c",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: "#e5c07b",
  },

  previewImg: {
    width: "85%",
    height: "85%",
    resizeMode: "contain",
  },

  previewNome: {
    marginTop: 15,
    color: "white",
    fontSize: 33,
    fontFamily: "PixelBold",
  },

  infoBox: {
    marginTop: 15,
    width: "80%",
    padding: 15,
    backgroundColor: "#121214",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#e5c07b",
  },

  infoLinha: {
    color: "white",
    fontSize: 16,
    marginBottom: 4,
    fontFamily: "PixelMedium",
  },

  infoDesc: {
    marginTop: 10,
    color: "#cfcfcf",
    fontSize: 14,
    fontFamily: "PixelMedium",
  },

  botaoSelecionar: {
    marginTop: 20,
    backgroundColor: "#e5c07b",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 12,
  },

  /** TAVERNA */
  taverna: {
    flex: 1,
    backgroundColor: "#0d0d0f",
    alignItems: "center",
    justifyContent: "center",
  },

  tavernaTitulo: {
    fontSize: 40,
    color: "white",
    fontFamily: "PixelBold",
    marginBottom: 20,
  },

  tavernaNome: {
    marginTop: 10,
    fontSize: 28,
    color: "white",
    fontFamily: "PixelBold",
  },

  botaoVoltar: {
    marginTop: 25,
    backgroundColor: "#444",
    padding: 12,
    borderRadius: 10,
  },
});
