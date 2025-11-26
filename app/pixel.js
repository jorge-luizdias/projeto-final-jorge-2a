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
} from "react-native";
import Svg, { Rect } from "react-native-svg";
import { Feather } from "@expo/vector-icons";

const GRID = 16; // 16 × 16
const CELL = 22; // tamanho de cada pixel
const HISTORY_LIMIT = 300;

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
  const [pixels, setPixels] = useState(Array(GRID * GRID).fill("#FFFFFF"));
  const pixelsRef = useRef(pixels);
  pixelsRef.current = pixels;

  const [selectedColor, setSelectedColor] = useState("#000000");
  const [tool, setTool] = useState("brush"); // 'brush' | 'eraser' | 'fill'
  const [brushSize, setBrushSize] = useState(1);

  // history (snapshots)
  const historyRef = useRef([]);
  const historyIndexRef = useRef(-1);

  // ensure initial snapshot
  useEffect(() => {
    pushHistorySnapshot(); // initial state
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function pushHistorySnapshot() {
    // cut forward history if we are in the middle
    if (historyIndexRef.current < historyRef.current.length - 1) {
      historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1);
    }
    const snap = pixelsRef.current.slice();
    historyRef.current.push(snap);
    if (historyRef.current.length > HISTORY_LIMIT) historyRef.current.shift();
    historyIndexRef.current = historyRef.current.length - 1;
  }

  function canUndo() {
    return historyIndexRef.current > 0;
  }
  function canRedo() {
    return historyIndexRef.current < historyRef.current.length - 1;
  }

  function undo() {
    if (!canUndo()) return;
    historyIndexRef.current = Math.max(0, historyIndexRef.current - 1);
    const snap = historyRef.current[historyIndexRef.current];
    setPixels(snap.slice());
  }

  function redo() {
    if (!canRedo()) return;
    historyIndexRef.current = Math.min(historyRef.current.length - 1, historyIndexRef.current + 1);
    const snap = historyRef.current[historyIndexRef.current];
    setPixels(snap.slice());
  }

  // helpers coord/index
  function idxToRC(index) {
    return { r: Math.floor(index / GRID), c: index % GRID };
  }
  function rcToIdx(r, c) {
    return r * GRID + c;
  }

  // brush behaviour (option A: expands right and down)
  function applyBrushAtIndex(index, color, size = 1, commit = true) {
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
    if (commit) setPixels(newGrid);
    return newGrid;
  }

  // fill all
  function fillAllWithColor(color) {
    pushHistorySnapshot();
    setPixels(Array(GRID * GRID).fill(color));
  }

  // clear all (with confirm)
  function clearAll() {
    Alert.alert("Limpar tudo?", "Deseja realmente limpar toda a tela?", [
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

  // handle touches: locX/locY relative to SVG wrapper
  function handleTouchAtLocation(locX, locY, isStart = false) {
    const col = Math.floor(locX / CELL);
    const row = Math.floor(locY / CELL);
    if (col < 0 || col >= GRID || row < 0 || row >= GRID) return;
    const index = rcToIdx(row, col);

    if (isStart) pushHistorySnapshot();

    if (tool === "brush") {
      applyBrushAtIndex(index, selectedColor, brushSize);
    } else if (tool === "eraser") {
      applyBrushAtIndex(index, "#FFFFFF", brushSize);
    } else if (tool === "fill" && isStart) {
      // current behavior: fill entire canvas with selected color
      fillAllWithColor(selectedColor);
    }
  }

  // PanResponder for mobile drag painting
  const isDrawingRef = useRef(false);
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        isDrawingRef.current = true;
        const { locationX, locationY } = evt.nativeEvent;
        handleTouchAtLocation(locationX, locationY, true);
      },
      onPanResponderMove: (evt) => {
        if (!isDrawingRef.current) return;
        const { locationX, locationY } = evt.nativeEvent;
        handleTouchAtLocation(locationX, locationY, false);
      },
      onPanResponderRelease: () => {
        isDrawingRef.current = false;
      },
      onPanResponderTerminate: () => {
        isDrawingRef.current = false;
      },
    })
  ).current;

  // rect press (web click)
  function handleRectPress(index) {
    pushHistorySnapshot();
    if (tool === "brush") applyBrushAtIndex(index, selectedColor, brushSize);
    else if (tool === "eraser") applyBrushAtIndex(index, "#FFFFFF", brushSize);
    else if (tool === "fill") fillAllWithColor(selectedColor);
  }

  // UI helpers
  function ColorButton({ color }) {
    const active = color.toLowerCase() === selectedColor.toLowerCase();
    return (
      <TouchableOpacity
        key={color}
        onPress={() => {
          setSelectedColor(color);
          setTool("brush");
        }}
        style={[
          styles.color,
          { backgroundColor: color },
          active && styles.colorSelected,
        ]}
        activeOpacity={0.8}
      />
    );
  }

  // single icon button
  function IconBtn({ onPress, icon, active = false }) {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={[styles.iconBtn, active && styles.iconBtnActive]}
        activeOpacity={0.85}
      >
        {icon}
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={styles.app}>
      <View style={styles.centerWrap}>
        {/* Title */}
        <Text style={styles.title}>Pixel Editor</Text>

        {/* Grid (svg) */}
        <View
          style={styles.canvasWrapper}
          {...(Platform.OS !== "web" ? panResponder.panHandlers : {})}
        >
          <Svg width={GRID * CELL} height={GRID * CELL} style={styles.svg}>
            {pixels.map((color, index) => {
              const x = (index % GRID) * CELL;
              const y = Math.floor(index / GRID) * CELL;
              return (
                <Rect
                  key={index}
                  x={x}
                  y={y}
                  width={CELL}
                  height={CELL}
                  fill={color}
                  stroke="#bdbdbd"
                  strokeWidth={0.5}
                  onPress={() => handleRectPress(index)}
                />
              );
            })}
          </Svg>
        </View>

        {/* TOOLBAR (single horizontal, icons only) */}
        <View style={styles.toolbarContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.toolbarScroll}
          >
            <IconBtn
              onPress={() => setTool("brush")}
              active={tool === "brush"}
              icon={<Feather name="edit" size={20} color={tool === "brush" ? "#ff33bb" : "#fff"} />}
            />
            <IconBtn
              onPress={() => setTool("eraser")}
              active={tool === "eraser"}
              icon={<Feather name="trash-2" size={20} color={tool === "eraser" ? "#ff33bb" : "#fff"} />}
            />
            <IconBtn
              onPress={() => {
                setTool("fill");
              }}
              active={tool === "fill"}
              icon={<Feather name="droplet" size={20} color={tool === "fill" ? "#ff33bb" : "#fff"} />}
            />
            <IconBtn
              onPress={() => undo()}
              icon={<Feather name="corner-up-left" size={20} color="#fff" />}
            />
            <IconBtn
              onPress={() => redo()}
              icon={<Feather name="corner-up-right" size={20} color="#fff" />}
            />
            <IconBtn
              onPress={() => {
                pushHistorySnapshot();
                setPixels(Array(GRID * GRID).fill("#FFFFFF"));
              }}
              icon={<Feather name="trash" size={20} color="#fff" />}
            />
            {/* quick size badges */}
            <IconBtn
              onPress={() => {
                setBrushSize(1);
                setTool("brush");
              }}
              active={brushSize === 1}
              icon={<Text style={styles.sizeTxt}>1</Text>}
            />
            <IconBtn
              onPress={() => {
                setBrushSize(2);
                setTool("brush");
              }}
              active={brushSize === 2}
              icon={<Text style={styles.sizeTxt}>2</Text>}
            />
            <IconBtn
              onPress={() => {
                setBrushSize(3);
                setTool("brush");
              }}
              active={brushSize === 3}
              icon={<Text style={styles.sizeTxt}>3</Text>}
            />
            <View style={{ width: 12 }} />
          </ScrollView>
        </View>

        {/* PALETTE (below toolbar) */}
        <View style={styles.paletteWrap}>
          <View style={styles.paletteRow}>
            {PRIMARY_COLORS.map((c) => (
              <ColorButton key={c} color={c} selected={selectedColor} onPress={() => { setSelectedColor(c); setTool("brush"); }} />
            ))}
          </View>
          <View style={[styles.paletteRow, { marginTop: 8 }]}>
            {VARIATIONS.map((c) => (
              <ColorButton key={c} color={c} selected={selectedColor} onPress={() => { setSelectedColor(c); setTool("brush"); }} />
            ))}
          </View>
        </View>

        {/* CLEAR centered (big red) */}
        <View style={{ marginTop: 16, marginBottom: 28 }}>
          <TouchableOpacity style={styles.clearBtn} onPress={clearAll} activeOpacity={0.9}>
            <Text style={styles.clearTxt}>Limpar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

// small helper component used in palette to keep styles consistent
function ColorButton({ color, selected, onPress }) {
  const active = selected && color.toLowerCase() === selected.toLowerCase();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.color, { backgroundColor: color }, active && styles.colorSelected]}
      activeOpacity={0.85}
    />
  );
}

const styles = StyleSheet.create({
  app: { flex: 1, backgroundColor: "#171717" },
  centerWrap: { alignItems: "center", paddingTop: 12 },

  title: { color: "#fff", fontSize: 20, fontWeight: "700", marginBottom: 10 },

  canvasWrapper: {
    width: GRID * CELL + 4,
    height: GRID * CELL + 4,
    padding: 2,
    backgroundColor: "#e6e6e6",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#b3b3b3",
  },
  svg: {
    backgroundColor: "#fff",
    borderRadius: 6,
  },

  toolbarContainer: {
    width: "100%",
    marginTop: 12,
    alignItems: "center",
  },
  toolbarScroll: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: "center",
  },
  iconBtn: {
    width: 56,
    height: 56,
    borderRadius: 10,
    backgroundColor: "#0f0f0f",
    marginHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.03)",
    shadowColor: "#000",
    shadowOpacity: 0.18,
    elevation: 3,
  },
  iconBtnActive: {
    borderColor: "#ff33bb",
    shadowColor: "#ff33bb",
  },
  sizeTxt: { color: "#fff", fontWeight: "700", fontSize: 14 },

  paletteWrap: { width: "100%", alignItems: "center", marginTop: 10 },
  paletteRow: { flexDirection: "row", justifyContent: "center", alignItems: "center" },
  color: {
    width: 36,
    height: 36,
    borderRadius: 8,
    marginHorizontal: 8,
    borderWidth: 2,
    borderColor: "transparent",
  },
  colorSelected: {
    borderColor: "#fff",
    borderWidth: 3,
    shadowColor: "#000",
    shadowOpacity: 0.15,
  },

  clearBtn: {
    backgroundColor: "#c62828",
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: "center",
  },
  clearTxt: { color: "#fff", fontWeight: "700" },
});
