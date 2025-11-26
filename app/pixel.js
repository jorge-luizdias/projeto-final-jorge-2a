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
import Svg, { Rect } from "react-native-svg";
import { Feather } from "@expo/vector-icons";

const GRID = 64;             // <- agora 64 × 64
const BASE_CANVAS_MAX = 480; // tamanho ideal para caber na tela
const HISTORY_LIMIT = 600;

const PRIMARY_COLORS = [
  "#000000",
  "#FFFFFF",
  "#FF0000",
  "#00FF00",
  "#0000FF",
  "#FFFF00",
  "#FF00FF",
  "#00FFFF",
];

const VARIATIONS = [
  "#FFA500",
  "#808080",
  "#F2C6A0",
  "#E67E22",
  "#FF6B6B",
  "#FF9472",
  "#FFD166",
  "#A29BFE",
];

export default function PixelArtEditor() {
  const { width: windowWidth } = useWindowDimensions();

  // proteção para celular
  const maxCanvasWidth = Math.min(windowWidth - 20, BASE_CANVAS_MAX);
  const cellSize = Math.max(10, Math.floor(maxCanvasWidth / GRID));
  const canvasSize = cellSize * GRID;

  const [pixels, setPixels] = useState(Array(GRID * GRID).fill("#FFFFFF"));
  const pixelsRef = useRef(pixels);
  pixelsRef.current = pixels;

  const [selectedColor, setSelectedColor] = useState("#000000");
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

    for (let dr = 0; dr < size; dr++) {
      for (let dc = 0; dc < size; dc++) {
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
          setPixels(Array(GRID * GRID).fill("#FFFFFF"));
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
    if (tool === "eraser") applyBrush(index, "#FFFFFF", brushSize);
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

  function IconBtn({ icon, onPress, active }) {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={[styles.iconBtn, active && styles.iconBtnActive]}
      >
        {icon}
      </TouchableOpacity>
    );
  }

  function ColorBtn({ color }) {
    return (
      <TouchableOpacity
        onPress={() => {
          setSelectedColor(color);
          setTool("brush");
        }}
        style={[
          styles.color,
          { backgroundColor: color },
          selectedColor === color && styles.colorSelected,
        ]}
      />
    );
  }

  return (
    <SafeAreaView style={styles.app}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <Text style={styles.title}>Pixel Editor</Text>

        {/* Canvas */}
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
                  stroke="#999"
                  strokeWidth={0.7}
                  onPress={() => {
                    pushHistorySnapshot();
                    if (tool === "brush")
                      applyBrush(index, selectedColor, brushSize);
                    if (tool === "eraser") applyBrush(index, "#FFFFFF", brushSize);
                    if (tool === "fill") fillAll(selectedColor);
                  }}
                />
              );
            })}
          </Svg>
        </View>

        {/* TOOLS */}
        <View style={styles.toolbar}>
          <IconBtn
            active={tool === "brush"}
            onPress={() => setTool("brush")}
            icon={<Feather name="edit" size={20} color="#fff" />}
          />
          <IconBtn
            active={tool === "eraser"}
            onPress={() => setTool("eraser")}
            icon={<Feather name="trash-2" size={20} color="#fff" />}
          />
          <IconBtn
            active={tool === "fill"}
            onPress={() => setTool("fill")}
            icon={<Feather name="droplet" size={20} color="#fff" />}
          />
          <IconBtn
            onPress={undo}
            icon={<Feather name="corner-up-left" size={20} color="#fff" />}
          />
          <IconBtn
            onPress={redo}
            icon={<Feather name="corner-up-right" size={20} color="#fff" />}
          />
        </View>

        {/* BRUSH SIZE */}
        <View style={styles.sizeRow}>
          {[1, 2, 3].map((n) => (
            <TouchableOpacity
              key={n}
              onPress={() => {
                setBrushSize(n);
                setTool("brush");
              }}
              style={[styles.sizeBtn, brushSize === n && styles.sizeBtnActive]}
            >
              <Text style={styles.sizeTxt}>{n}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* PALETTE */}
        <View style={styles.palette}>
          <View style={styles.paletteRow}>
            {PRIMARY_COLORS.map((c) => (
              <ColorBtn color={c} key={c} />
            ))}
          </View>
          <View style={styles.paletteRow}>
            {VARIATIONS.map((c) => (
              <ColorBtn color={c} key={c} />
            ))}
          </View>
        </View>

        {/* CLEAR */}
        <TouchableOpacity style={styles.clearBtn} onPress={clearAll}>
          <Text style={styles.clearTxt}>Limpar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  app: { flex: 1, backgroundColor: "#171717" },

  scrollContent: {
    alignItems: "center",
    paddingVertical: 20,
    paddingBottom: 120,
  },

  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
  },

  canvasWrapper: {
    backgroundColor: "#e6e6e6",
    borderRadius: 10,
    marginBottom: 20,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#999",
  },

  toolbar: {
    flexDirection: "row",
    marginBottom: 18,
  },

  iconBtn: {
    width: 56,
    height: 56,
    borderRadius: 12,
    marginHorizontal: 6,
    backgroundColor: "#0f0f0f",
    justifyContent: "center",
    alignItems: "center",
  },

  iconBtnActive: {
    backgroundColor: "#2c2c2c",
    borderColor: "#ff33bb",
    borderWidth: 2,
  },

  sizeRow: {
    flexDirection: "row",
    marginBottom: 20,
  },

  sizeBtn: {
    width: 42,
    height: 42,
    marginHorizontal: 5,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1f1f1f",
  },

  sizeBtnActive: {
    backgroundColor: "#ff33bb",
  },

  sizeTxt: {
    color: "#fff",
    fontWeight: "bold",
  },

  palette: {
    marginBottom: 24,
  },

  paletteRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginVertical: 4,
  },

  color: {
    width: 34,
    height: 34,
    borderRadius: 8,
    marginHorizontal: 6,
    borderWidth: 2,
    borderColor: "transparent",
  },

  colorSelected: {
    borderColor: "#fff",
    borderWidth: 3,
  },

  clearBtn: {
    backgroundColor: "#c62828",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 14,
  },

  clearTxt: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
