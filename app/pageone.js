import React, { useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
  Animated,
  ScrollView,
  Dimensions,
} from "react-native";

const { width, height } = Dimensions.get("window");

export default function Page() {
  const [aberto, setAberto] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;

  const totalPaginas = 3;
  const [paginaAtual, setPaginaAtual] = useState(0);

  const abrirDiario = () => {
    setAberto(true);

    Animated.timing(anim, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();
  };

  const proximaPagina = () => {
    if (paginaAtual < totalPaginas - 1) {
      setPaginaAtual(paginaAtual + 1);
    }
  };

  const paginaAnterior = () => {
    if (paginaAtual > 0) {
      setPaginaAtual(paginaAtual - 1);
    }
  };

  const paginas = [
    {
      titulo: "História da Arte Digital",
      conteudo: (
        <>
          <Text style={styles.subtitulo}>O que é Arte Digital?</Text>
          <Text style={styles.texto}>
            Arte Digital é toda produção artística criada com computadores, softwares,
tablets, algoritmos ou qualquer tecnologia eletrônica. Em vez de pincéis e
tintas, os artistas usam programas, códigos e telas digitais.
          </Text>

          <Text style={styles.subtitulo}>1950–1960 • Primeiros Experimentos</Text>
          <Text style={styles.texto}>
            Pesquisadores começaram a criar imagens usando matemática. As obras eram
geradas por computadores gigantes e impressas em plotters, dando origem ao
primeiro contato entre arte e programação.
          </Text>

          <Text style={styles.subtitulo}>1960–1970 • Arte Algorítmica</Text>
          <Text style={styles.texto}>
            Artistas como Vera Molnár e Frieder Nake passaram a usar códigos para gerar
formas e padrões automáticos — uma das bases do design digital atual.
          </Text>
        </>
      ),
    },
    {
      titulo: "Evolução da Arte Digital",
      conteudo: (
        <>
          <Text style={styles.subtitulo}>1970–1980 • Popularização</Text>
          <Text style={styles.texto}>
            Computadores ficaram menores, e os primeiros softwares gráficos surgiram.
Artistas começaram a experimentar pintura digital, vetores e animações.
          </Text>

          <Text style={styles.subtitulo}>1990 • A Era da Internet </Text>
          <Text style={styles.texto}>
            A arte migrou para o mundo virtual: GIFs, sites experimentais, animações
pixeladas e projetos interativos se espalharam pelo mundo.
          </Text>

          <Text style={styles.subtitulo}>2000 • Ferramentas Criativas </Text>
          <Text style={styles.texto}>
            Programas como Photoshop, Illustrator, Blender e Flash transformaram a forma
de criar artes, animações e jogos.
          </Text>
        </>
      ),
    },
    {
      titulo: "Arte Digital Moderna",
      conteudo: (
        <>
          <Text style={styles.subtitulo}>2010+ • O Digital como Universo Artístico </Text>
          <Text style={styles.texto}>
            Modelagem 3D, VR, AR, pixel art, pintura digital e mundos virtuais se tornaram
linguagens importantes para artistas, estúdios e desenvolvedores.
          </Text>

           <Text style={styles.texto}>
            IA, NFTs e Arte Generativa  
Algoritmos começaram a criar imagens, sons e animações. Obras digitais passaram
a existir em blockchain e ganhar valor no mercado.
          </Text>

          <Text style={styles.texto}>
            A arte digital é uma das áreas que mais cresce no mundo. Ela combina criatividade
humana com tecnologia, e continua evoluindo a cada nova ferramenta inventada.
          </Text>
        </>
      ),
    },
  ];

  return (
    <ImageBackground
  source={require("../assets/mesa.png")}
  style={styles.bg}
  imageStyle={{ resizeMode: "cover" }} 
>
      <View style={styles.diarioContainer}>
        {!aberto && (
          <>
            <Image
              source={require("../assets/diario.png")}
              style={styles.diarioFechado}
            />

            <TouchableOpacity style={styles.botao} onPress={abrirDiario}>
              <Text style={styles.botaoTexto}>Abrir</Text>
            </TouchableOpacity>
          </>
        )}

        {aberto && (
          <Animated.View
            style={[
              styles.diarioAberto,
              {
                transform: [
                  {
                    scale: anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.7, 1],
                    }),
                  },
                ],
                opacity: anim,
              },
            ]}
          >
            {/* FECHAR FORA DO CONTAINER */}
            <TouchableOpacity
              style={styles.fecharBtn}
              onPress={() => setAberto(false)}
            >
              <Text style={styles.fecharTxt}>Fechar ✖</Text>
            </TouchableOpacity>

            {/* CONTEÚDO DA PÁGINA */}
            <ScrollView
              style={styles.paginaScroll}
              showsVerticalScrollIndicator={true}
            >
              <Text style={styles.titulo}>{paginas[paginaAtual].titulo}</Text>
              {paginas[paginaAtual].conteudo}
            </ScrollView>

            {/* NAVEGAÇÃO */}
            <View style={styles.navegacao}>
              <TouchableOpacity
                style={[
                  styles.navBtn,
                  paginaAtual === 0 && styles.navBtnDesabilitado,
                ]}
                onPress={paginaAnterior}
                disabled={paginaAtual === 0}
              >
                <Text style={styles.navTexto}>◀</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.navBtn,
                  paginaAtual === totalPaginas - 1 &&
                    styles.navBtnDesabilitado,
                ]}
                onPress={proximaPagina}
                disabled={paginaAtual === totalPaginas - 1}
              >
                <Text style={styles.navTexto}>▶</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
 bg: {
  flex: 1,
  width: "100%",
  height: "100%",
  justifyContent: "center",
  alignItems: "center",
},

  diarioContainer: {
    alignItems: "center",
    width: "100%",
  },

  diarioFechado: {
    width: 240,
    height: 190,
    resizeMode: "contain",
    marginBottom: 20,
  },

  botao: {
    backgroundColor: "#4a3625",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#e5c07b",
  },

  botaoTexto: {
    color: "#f3e6c0",
    fontSize: 22,
    fontFamily: "PixelBold",
  },

  diarioAberto: {
    width: width * 0.9,
    height: height * 0.75,
    backgroundColor: "#f7e6ca",
    borderRadius: 12,
    padding: 20,
    borderWidth: 3,
    borderColor: "#8b6a43",
    alignItems: "center",
  },

  fecharBtn: {
    position: "absolute",
    top: -45,
    right: 0,
    backgroundColor: "#8b6a43",
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 10,
  },

  fecharTxt: {
    fontSize: 18,
    color: "#fff",
    fontFamily: "PixelMedium",
  },

  paginaScroll: {
    width: "100%",
    marginBottom: 10,
  },

  titulo: {
    fontSize: 32,
    textAlign: "center",
    marginBottom: 20,
    color: "#4a3625",
    fontFamily: "PixelBold",
  },

  subtitulo: {
    fontSize: 22,
    marginTop: 10,
    marginBottom: 6,
    color: "#6d4f33",
    fontFamily: "PixelBold",
  },

  texto: {
    fontSize: 18,
    lineHeight: 24,
    color: "#4a3c2c",
    marginBottom: 10,
    fontFamily: "PixelMedium",
  },

  navegacao: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "55%",
    marginTop: 5,
  },

  navBtn: {
    backgroundColor: "#4a3625",
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderRadius: 8,
  },

  navBtnDesabilitado: {
    opacity: 0.4,
  },

  navTexto: {
    fontSize: 20,
    color: "#f3e6c0",
    fontFamily: "PixelBold",
  },
});
