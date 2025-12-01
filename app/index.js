import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList } from "react-native";
import { useState } from "react";

// IMAGENS DE ROSTO
import rostoGuerreiro from "../assets/rostos/c_guerreiro.png";
import rostoGuerreira from "../assets/rostos/c_guerreira.png";
import rostoFeiticeiro from "../assets/rostos/c_feiticeiro.png";
import rostoArqueira from "../assets/rostos/c_arqueira.png";
import rostoCorujo from "../assets/rostos/c_corujo.png";
import rostoKing from "../assets/rostos/c_king.png";
import rostoPirata from "../assets/rostos/c_pirata.png";

// PERSONAGENS COMPLETOS
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
        "Ragnar é um veterano das Terras Cinzentas. Conhecido por sua resistência absurda, ele avança protegendo aliados e absorvendo danos que destruiriam qualquer outro guerreiro.",
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
        "Lyanna domina técnicas acrobáticas e cortes rápidos. Sua precisão é temida em arenas, onde suas combos mortais derrubam inimigos antes mesmo que percebam seu movimento.",
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
        "Azerion estudou artes proibidas que poucos ousam tocar. Seus feitiços são devastadores, mas seu corpo frágil exige estratégia — um erro de cálculo e ele cai facilmente.",
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
        "Eridian é conhecida por derrubar inimigos antes que eles percebam sua presença. Sua mira impecável e velocidade a tornam letal em ataques à distância.",
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
        "Uma criatura sábia que manipula energia vital. Corujo cura aliados, fortalece a equipe e é essencial em batalhas longas, mantendo todos vivos contra qualquer ameaça.",
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
        "King nasceu para a batalha. Seu estilo é simples: destruir tudo no caminho. Seus golpes esmagam inimigos em segundos, sendo um dos maiores danos físicos do reino.",
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
        "Drax se move como um fantasma entre as sombras. Suas lâminas envenenadas e ataques críticos fazem dele o terror dos mares — e um inimigo imprevisível em combate.",
    },
  },
];

export default function Page() {
  const [selecionado, setSelecionado] = useState(personagens[0]);

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
        </View>

      </View>
    </View>
  );
}

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
    aspectRatio: 1, // deixa sempre quadrado
    marginBottom: 12,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#141416",
    borderWidth: 3,
    borderColor: "transparent",
  },
  
  cardAtivo: {
    borderColor: "#e5c07b",
    shadowColor: "#e5c07b",
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  
  cardImg: {
    width: "100%",
    height: "100%",
    resizeMode: "cover", // <-- AQUI É O SEGREDO (preenche o card inteiro)
  },
  

  preview: {
    width: "60%",
    alignItems: "center",
    justifyContent: "flex-start",
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
});
