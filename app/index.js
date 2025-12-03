import { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
  Animated,
} from "react-native";

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

// NOVAS IMAGENS
import fundoTaverna from "../assets/taverna.png";
import sapo from "../assets/sapo.png";
import c_sapo from "../assets/rostos/c_sapo.png";

const personagens = [
  {
    id: 1,
    nome: "Ragnar, o Escudo de Ferro",
    imagem: guerreiro,
    icone: rostoGuerreiro,
    info: {
      descricao:
        "Ragnar, o Escudo de Ferro, carrega o peso de mil batalhas em seu machado. Abandonou seu posto de guarda real após uma traição e agora busca redenção nos confins do reino, defendendo os fracos em troca de hidromel e um lugar quente para dormir. Sua lealdade agora é apenas aos oprimidos.",
    },
  },
  {
    id: 2,
    nome: "Lyanna, a Lâmina Carmesim",
    imagem: guerreira,
    icone: rostoGuerreira,
    info: {
      descricao:
        "Nascida em um clã de caçadores nas montanhas, Lyanna é a última de sua linhagem. Seus golpes rápidos e acrobáticos buscam vingança contra a criatura que destruiu sua casa. Ela é uma força da natureza, movida por uma fúria controlada e a sede de justiça.",
    },
  },
  {
    id: 3,
    nome: "Azerion, o Arcanista Perdido",
    imagem: feiticeiro,
    icone: rostoFeiticeiro,
    info: { descricao: "Um estudioso recluso que abriu acidentalmente um portal para o Vazio. Agora, atormentado por visões, ele usa feitiços devastadores para selar a fenda que criou. Sua mente é um campo de batalha, e sua magia, um mal necessário." },
  },
  {
    id: 4,
    nome: "Eridian, a Flecha Fantasma",
    imagem: arqueira,
    icone: rostoArqueira,
    info: { descricao: "Eridian é uma elfa da floresta, conhecida por sua precisão sobrenatural. Ela protege as trilhas antigas e seus aliados, movendo-se como um fantasma entre as árvores. Sua flecha nunca erra, e seu silêncio é sua maior arma." },
  },
  {
    id: 5,
    nome: "Corujo, o Guardião da Luz",
    imagem: corujo,
    icone: rostoCorujo,
    info: { descricao: "Um ser celestial enviado para guiar os aventureiros. Corujo usa o poder da luz para curar e fortalecer seus companheiros. Embora não seja um lutador, sua presença traz esperança e invoca bênçãos protetoras sobre a equipe." },
  },
  {
    id: 6,
    nome: "Brutus King, o Punho do Caos",
    imagem: king,
    icone: rostoKing,
    info: { descricao: "Brutus é um ex-gladiador que trocou a arena pela estrada. Ele busca constantemente o próximo grande desafio, usando pura força física e agressividade em combate. Sua lenda é escrita em cicatrizes e punhos cerrados." },
  },
  {
    id: 7,
    nome: "Drax, o Pirata das Sombras",
    imagem: pirata,
    icone: rostoPirata,
    info: { descricao: "Um mestre da furtividade e veneno. Drax é um pirata sem bandeira, buscando tesouros antigos e segredos. Ele se move na escuridão, e o último som que seus inimigos ouvem é o assobio silencioso de sua lâmina envenenada." },
  },
];

export default function Page() {
  const [selecionado, setSelecionado] = useState(personagens[0]);
  const [tela, setTela] = useState("selecao");

  // ---- ANIMAÇÃO FADE-IN ----
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const fadePersonagem = useRef(new Animated.Value(0)).current;

  // === FALAS DOS PERSONAGENS ===
const falasPorPersonagem = {
  sapo:
    "Ora, ora… seja muito bem-vindo, viajante. Eu sou o Mestre Sapo, guardião destas histórias e observador dos caminhos que se cruzam nesta taverna perdida no tempo.",

  "Ragnar, o Escudo de Ferro":
    "Hmph… esta taverna tem cheiro de paz. Faz tempo que não sinto algo assim. Descanse enquanto pode, viajante. A estrada cobra caro dos fortes… e devora os fracos.",

  "Lyanna, a Lâmina Carmesim":
   "Não estou aqui para beber. Estou atrás de rastros… qualquer pista da criatura que destruiu meu clã. Se souber de algo, fale. Se não… não atrapalhe.",

  "Azerion, o Arcanista Perdido":
   "As paredes desta taverna… elas sussurram. Ouço ecos do Vazio até aqui. Se algo começar a se contorcer no canto da sua visão… respire fundo. É normal. Para mim, pelo menos.",

  "Eridian, a Flecha Fantasma":
    "Estas chamas… este ruído… tão diferentes da serenidade das florestas. Mas fico aqui por um instante. Até o vento me chamar novamente.",

  "Corujo, o Guardião da Luz":
     "Ah, viajante… a luz brilha diferente em você. Seja forte. Toda jornada começa com um pequeno passo — e uma grande coragem.",

  "Brutus King, o Punho do Caos":
    "HAHA! Uma taverna! Finalmente um lugar que não cai quando eu encosto na parede! Se alguém quiser briga, estou aceitando — só por aquecimento.",

  "Drax, o Pirata das Sombras":
    "Lugares como este escondem mais segredos que cofres afundados. Olhe bem… às vezes o tesouro está onde ninguém pensa em procurar.",
};

// Estado do diálogo
const [fala, setFala] = useState("Toque para ouvir o personagem.");

function proximaFala() {
  if (falasPorPersonagem[selecionado.nome]) {
    setFala(falasPorPersonagem[selecionado.nome]);
  } else {
    setFala("...");
  }
}


 useEffect(() => {
  if (tela === "taverna") {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    Animated.timing(fadePersonagem, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }
}, [tela]);

  // === TELA TAVERNA ===
if (tela === "taverna") {
  // Personagens que NÃO podem virar
const personagensFixos = ["Lyanna, a Lâmina Carmesim", "Azerion, o Arcanista Perdido", "Eridian, a Flecha Fantasma", "Corujo, o Guardião da Luz"];
  return (
    <View style={styles.tavernaContainer}>

      {/* Fundo */}
      <Image source={fundoTaverna} style={styles.bgTaverna} />

      {/* --- SCROLL SEM QUEBRAR O POSICIONAMENTO --- */}
      <ScrollView
  contentContainerStyle={styles.tavernaScroll}
  showsVerticalScrollIndicator={false}
>
        <Animated.View
          style={[styles.tavernaConteudo, { opacity: fadeAnim }]}
        >
          {/* Avatar + Nome do personagem */}
          <View style={styles.tavernaHeader}>
            <Image source={c_sapo} style={styles.tavernaAvatar} />
            <Text style={styles.tavernaNome}>Mestre Sapo</Text>
          </View>

          <Text style={styles.tavernaHistoria}>
            Ora, ora… seja muito bem-vindo, viajante! Eu sou conhecido por estas
            bandas como **Mestre Sapo**, o guardião das histórias e observador das
            almas valentes que cruzam esta porta.
            {"\n\n"}
            Esta taverna existe desde os primeiros pixels deste reino. Suas
            paredes já testemunharam batalhas, romances proibidos, artefatos
            misteriosos e planos grandiosos que mudaram o destino de muitos.
            {"\n\n"}
            Heróis costumam descansar por aqui antes de iniciarem sua jornada.
            Alguns chegam feridos, outros famintos… mas todos saem com um
            propósito renovado.
            {"\n\n"}
            Sinta-se à vontade. Tome um lugar, respire fundo e aproveite este
            momento — sua aventura está prestes a ganhar vida.
          </Text>

          {/* Diálogo dos personagens */}
<TouchableOpacity onPress={proximaFala} style={styles.dialogoBox}>
  <Text style={styles.dialogoTexto}>{fala}</Text>
</TouchableOpacity>


          <TouchableOpacity
            style={styles.botaoVoltar}
            onPress={() => setTela("selecao")}
          >
            <Text
              style={{
                color: "white",
                fontFamily: "PixelBold",
                fontSize: 20,
              }}
            >
              Voltar
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>

      {/* Sapo fundo */}
      <Animated.Image
        source={sapo}
        style={[styles.sapo, { opacity: fadeAnim }]}
      />

      {/* PERSONAGEM ESCOLHIDO — atrás do container, com fade-in */}
<Animated.Image
  source={selecionado.imagem}
  style={[
    personagensFixos.includes(selecionado.nome)
      ? styles.personagemTavernaFixo
      : styles.personagemTaverna,
    { opacity: fadePersonagem }
  ]}
/>

    </View>
  );
}

  // === TELA DE SELEÇÃO ===
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Seleção de Personagem</Text>

      <FlatList
        data={personagens}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingVertical: 10 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.cardHorizontal,
              selecionado.id === item.id && styles.cardAtivo,
            ]}
            onPress={() => setSelecionado(item)}
          >
            <Image source={item.icone} style={styles.cardImgHorizontal} />
          </TouchableOpacity>
        )}
      />

      {/* Preview */}
      <View style={styles.preview}>
        <View style={styles.previewBox}>
          <Image source={selecionado.imagem} style={styles.previewImg} />
        </View>

        <Text style={styles.previewNome}>{selecionado.nome}</Text>

        <View style={styles.infoBox}>
          <Text style={styles.sinopseTitulo}>História</Text>
          <Text style={styles.sinopseTexto}>{selecionado.info.descricao}</Text>
        </View>

        <TouchableOpacity style={styles.botaoSelecionar} onPress={() => setTela("taverna")}>
          <Text style={{ color: "black", fontSize: 22, fontFamily: "PixelBold" }}>
            Entrar na Taverna
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// ================= ESTILOS =================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d0d0f",
    paddingBottom: 35,
  },

  title: {
  fontSize: 35,
  fontFamily: "PixelBold",
  color: "#fff",
  textAlign: "center",
  marginBottom: 25,
  letterSpacing: 2,
  borderBottomWidth: 3,
  borderColor: "#e5c07b",
  paddingBottom: 8,
  marginTop: 15,
},

  cardHorizontal: {
    width: 110,
    height: 110,
    marginRight: 12,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#141416",
    borderWidth: 3,
    borderColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },

  cardImgHorizontal: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },

  cardAtivo: {
    borderColor: "#e5c07b",
  },

  preview: {
    marginTop: 20,
    alignItems: "center",
  },

  previewBox: {
    width: "90%",
    height: 300,
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
  color: "#fff",
  fontSize: 30,
  fontFamily: "PixelBold",
  textAlign: "center",
  letterSpacing: 1,
},

  infoBox: {
    marginTop: 20,
    width: "90%",
    padding: 15,
    backgroundColor: "#121214",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#e5c07b",
  },

  sinopseTitulo: {
    fontSize: 22,
    color: "#e5c07b",
    fontFamily: "PixelBold",
    marginBottom: 10,
    textAlign: "center",
  },

  sinopseTexto: {
    fontSize: 16,
    color: "#dcdcdc",
    fontFamily: "PixelMedium",
    textAlign: "center",
    lineHeight: 22,
  },

  botaoSelecionar: {
    marginTop: 25,
    backgroundColor: "#e5c07b",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },

  // ===== TELA DA TAVERNA =====
  tavernaScroll: {
  paddingVertical: 60,  // espaçamento em cima e embaixo
  alignItems: "center",
  width: "100%",        // impede conteúdo de expandir errado
},

  tavernaContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  bgTaverna: {
    position: "absolute",
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  tavernaConteudo: {
  width: "85%",
  backgroundColor: "rgba(0,0,0,0.55)",
  padding: 22,
  borderRadius: 15,
  borderWidth: 3,
  borderColor: "#e5c07b",
},

  tavernaHeader: {
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 12,
},

tavernaAvatar: {
  width: 45,
  height: 45,
  resizeMode: "contain",
  marginRight: 10,
},

tavernaNome: {
  fontSize: 26,
  color: "#e5c07b",
  fontFamily: "PixelBold",
},

  tavernaTitulo: {
    fontSize: 40,
    color: "white",
    fontFamily: "PixelBold",
    textAlign: "center",
    marginBottom: 15,
  },

  tavernaHistoria: {
    color: "#f0e4c3",
    fontSize: 18,
    textAlign: "center",
    lineHeight: 26,
    fontFamily: "PixelMedium",
  },

  sapo: {
    position: "absolute",
    bottom: 10,
    right: -80,
    width: 250,
    height: 150,
    resizeMode: "contain",
  },

  personagemTaverna: {
  position: "absolute",
  bottom: 10,
  left: -80,       // espelho da posição do sapo
  width: 250,
  height: 150,
  resizeMode: "contain",
  transform: [{ scaleX: -1 }], // faz o personagem olhar para o centro
  },

  personagemTavernaFixo: {
  position: "absolute",
  bottom: 10,
  left: -40,
  width: 220,
  height: 150,
  resizeMode: "contain",
  transform: [{ scaleX: 1 }], // não vira
},

  botaoVoltar: {
    marginTop: 22,
    backgroundColor: "#5a4737",
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#e5c07b",
    alignItems: "center",
  },

  dialogoBox: {
  marginTop: 20,
  backgroundColor: "rgba(0,0,0,0.6)",
  padding: 16,
  width: "100%",
  borderRadius: 12,
  borderWidth: 2,
  borderColor: "#e5c07b",
},

dialogoTexto: {
  color: "#fff",
  fontSize: 16,
  fontFamily: "PixelMedium",
  textAlign: "center",
  lineHeight: 22,
},

});
