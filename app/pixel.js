// app/pixel.js
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  PanResponder,
  Alert,
  Platform,
  useWindowDimensions,
} from "react-native";
import Svg, { Rect, Circle, Defs, RadialGradient, Stop } from "react-native-svg";
import { Feather } from "@expo/vector-icons";

const GRID = 64;
const BASE_CANVAS_PX = 512;
const HISTORY_LIMIT = 600;

/* --- PALETA IGUAL AO SEU PRIMEIRO CÓDIGO --- */
const COLORS = [
  "#fff7c5","#f2deb0","#d9b38c","#c99682","#ad6c61","#8d4f4d","#63383f","#3d2439",
  "#ff9a6a","#ff7b6b","#ff5773","#ff3c8f","#d538b8","#a832d4","#6f2bd9","#3b1b9e",
  "#fff96b","#ffe433","#ffbf2f","#ff9133","#ff6737","#e64856","#b63763","#6d2d63",
  "#d0fa5f","#b5f73e","#8bdf4f","#58c46b","#2aa590","#157b9c","#1b4c96","#17348a"
];

export default function PixelArtEditor() {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  const maxCanvas = Math.min(
    BASE_CANVAS_PX,
    Math.floor(Math.min(windowWidth * 0.6, windowHeight * 0.65))
  );

  const cellSize = Math.max(6, Math.floor(maxCanvas / GRID));
  const canvasSize = cellSize * GRID;

  const [pixels, setPixels] = useState(Array(GRID * GRID).fill("#1e1e1e"));
  const pixelsRef = useRef(pixels);
  pixelsRef.current = pixels;

  const [selectedColor, setSelectedColor] = useState("#ff7b6b");
  const [tool, setTool] = useState("brush");
  const [brushSize, setBrushSize] = useState(1);

  const historyRef = useRef([]);
  const historyIndexRef = useRef(-1);

  useEffect(() => {
    pushHistorySnapshot();
  }, []);

  function pushHistorySnapshot() {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      historyRef.current = historyRef.current.slice(
        0,
        historyIndexRef.current + 1
      );
    }
    const snap = pixelsRef.current.slice();
    historyRef.current.push(snap);
    if (historyRef.current.length > HISTORY_LIMIT) historyRef.current.shift();
    historyIndexRef.current = historyRef.current.length - 1;
  }

  function undo() {
    if (historyIndexRef.current <= 0) return;
    historyIndexRef.current -= 1;
    setPixels(historyRef.current[historyIndexRef.current].slice());
  }

  function redo() {
    if (historyIndexRef.current >= historyRef.current.length - 1) return;
    historyIndexRef.current += 1;
    setPixels(historyRef.current[historyIndexRef.current].slice());
  }

  function rcToIdx(r, c) {
    return r * GRID + c;
  }

  function idxToRC(index) {
    return {
      r: Math.floor(index / GRID),
      c: index % GRID,
    };
  }

  function applyBrush(index, color, size = 1) {
    const { r, c } = idxToRC(index);
    const newGrid = pixelsRef.current.slice();

    const half = Math.floor((size - 1) / 2);
    for (let dr = -half; dr <= half; dr++) {
      for (let dc = -half; dc <= half; dc++) {
        const rr = r + dr;
        const cc = c + dc;
        if (rr >= 0 && rr < GRID && cc >= 0 && cc < GRID) {
          newGrid[rcToIdx(rr, cc)] = color;
        }
      }
    }
    setPixels(newGrid);
  }

  function fillAll(color) {
    pushHistorySnapshot();
    setPixels(Array(GRID * GRID).fill(color));
  }

  function clearAll() {
    Alert.alert("Limpar tudo?", "Tem certeza que deseja limpar tudo?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sim",
        style: "destructive",
        onPress: () => {
          pushHistorySnapshot();
          setPixels(Array(GRID * GRID).fill("#1e1e1e"));
        },
      },
    ]);
  }

  function handleTouch(locX, locY, start = false) {
    const col = Math.floor(locX / cellSize);
    const row = Math.floor(locY / cellSize);
    if (col < 0 || col >= GRID || row < 0 || row >= GRID) return;

    const index = rcToIdx(row, col);

    if (start) pushHistorySnapshot();

    if (tool === "brush") applyBrush(index, selectedColor, brushSize);
    if (tool === "eraser") applyBrush(index, "#1e1e1e", brushSize);
    if (tool === "fill" && start) fillAll(selectedColor);
  }

  const isDrawingRef = useRef(false);
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: (evt) => {
        isDrawingRef.current = true;
        const { locationX, locationY } = evt.nativeEvent;
        handleTouch(locationX, locationY, true);
      },
      onPanResponderMove: (evt) => {
        if (!isDrawingRef.current) return;
        const { locationX, locationY } = evt.nativeEvent;
        handleTouch(locationX, locationY, false);
      },
      onPanResponderRelease: () => {
        isDrawingRef.current = false;
      },
    })
  ).current;

  return (
    <SafeAreaView style={styles.app}>

      {/* --- MANTIVE TODO SEU LAYOUT --- */}

      <View style={styles.topMenu}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.topMenuRow}
        >
          <Text style={styles.topMenuText}>File</Text>
          <Text style={styles.topMenuText}>Edit</Text>
          <Text style={styles.topMenuText}>Select</Text>
          <Text style={styles.topMenuText}>Image</Text>
          <Text style={styles.topMenuText}>View</Text>
          <Text style={styles.topMenuText}>Window</Text>
          <Text style={styles.topMenuText}>Help</Text>
        </ScrollView>
        <View style={styles.topRightInfo}>
          <Text style={styles.topMenuTextSmall}>0°</Text>
          <Text style={styles.topMenuTextSmall}>131%</Text>
        </View>
      </View>

      {/* Toolbar esquerda */}
      <View style={styles.leftToolbar}>
        <TouchableOpacity
          onPress={() => setTool("brush")}
          style={[styles.iconBtn, tool === "brush" && styles.iconBtnActive]}
        >
          <Feather name="edit" size={20} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setTool("eraser")}
          style={[styles.iconBtn, tool === "eraser" && styles.iconBtnActive]}
        >
          <Feather name="trash-2" size={20} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setTool("fill")}
          style={[styles.iconBtn, tool === "fill" && styles.iconBtnActive]}
        >
          <Feather name="droplet" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Painel direito */}
      <View style={styles.rightPanel}>
        <View style={styles.colorWheelBox}>
          <Svg width={180} height={180}>
            <Defs>
              <RadialGradient id="wheel" cx="50%" cy="50%" r="50%">
                <Stop offset="0%" stopColor="#fff" />
                <Stop offset="30%" stopColor="#ffefc4" />
                <Stop offset="60%" stopColor="#ff7b7b" />
                <Stop offset="100%" stopColor="#5be4a6" />
              </RadialGradient>
            </Defs>
            <Circle
              cx="90"
              cy="90"
              r="86"
              fill="url(#wheel)"
              stroke="#222"
              strokeWidth={4}
            />
          </Svg>

          <View style={styles.colorHexBox}>
            <Text style={styles.colorHexText}>{selectedColor}</Text>
          </View>
        </View>
      </View>

      {/* Canvas central */}
      <View style={styles.centerArea}>
        <View
          style={[
            styles.canvasWrapper,
            { width: canvasSize + 4, height: canvasSize + 4 },
          ]}
          {...(Platform.OS !== "web" ? panResponder.panHandlers : {})}
        >
          <Svg width={canvasSize} height={canvasSize}>
            {pixels.map((color, index) => {
              const x = (index % GRID) * cellSize;
              const y = Math.floor(index / GRID) * cellSize;
              return (
                <Rect
                  key={index}
                  x={x}
                  y={y}
                  width={cellSize}
                  height={cellSize}
                  fill={color}
                  stroke="#000"
                  strokeWidth={0.2}
                />
              );
            })}
          </Svg>
        </View>
      </View>

      {/* --- AQUI ESTÁ O MENU MÓVEL COM AS CORES IGUAL AO PIXEL.JS SIMPLES --- */}
      <View style={styles.mobilePalette}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {COLORS.map((c, i) => (
            <TouchableOpacity
              key={i}
              style={[
                styles.colorBox,
                { backgroundColor: c },
                selectedColor === c && styles.selectedColor,
              ]}
              onPress={() => {
                setSelectedColor(c);
                setTool("brush");
              }}
            />
          ))}
        </ScrollView>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: "#1b1b1b",
  },

  /* --- MENU SUPERIOR --- */
  topMenu: {
    height: 36,
    backgroundColor: "#111",
    borderBottomWidth: 1,
    borderBottomColor: "#222",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  topMenuRow: { alignItems: "center" },
  topMenuText: { color: "#bdbdbd", marginRight: 18, fontSize: 13 },
  topMenuTextSmall: { color: "#777", marginLeft: 8, fontSize: 12 },
  topRightInfo: { flexDirection: "row", alignItems: "center" },

  /* --- LEFT TOOLBAR --- */
  leftToolbar: {
    position: "absolute",
    left: 8,
    top: 46,
    width: 64,
    alignItems: "center",
  },
  iconBtn: {
    width: 52,
    height: 44,
    borderRadius: 8,
    backgroundColor: "#0f0f0f",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 6,
  },
  iconBtnActive: {
    backgroundColor: "#2c2c2c",
    borderWidth: 2,
    borderColor: "#ff6b2b",
  },

  /* --- RIGHT PANEL --- */
  rightPanel: {
    position: "absolute",
    right: 8,
    top: 46,
    width: 220,
    bottom: 80,
    backgroundColor: "#161616",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#222",
  },

  colorWheelBox: { alignItems: "center", marginBottom: 12 },
  colorHexBox: {
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#0f0f0f",
    borderRadius: 6,
  },
  colorHexText: { color: "#fff", fontSize: 12 },

  /* --- CANVAS --- */
  centerArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  canvasWrapper: {
    backgroundColor: "#0c0c0c",
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#222",
    overflow: "hidden",
  },

  /* --- NOVO MENU DE CORES --- */
  mobilePalette: {
    position: "absolute",
    bottom: 6,
    left: 0,
    right: 0,
    height: 60,
    paddingVertical: 6,
    backgroundColor: "#1a1a1a",
    borderTopWidth: 1,
    borderColor: "#222",
  },

  colorBox: {
    width: 26,
    height: 26,
    marginHorizontal: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#000",
  },

  selectedColor: {
    borderColor: "#fff",
    borderWidth: 2,
  },
});
