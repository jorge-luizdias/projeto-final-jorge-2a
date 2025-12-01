import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  PanResponder,
  Platform,
  useWindowDimensions,
  Animated,
} from "react-native";
import Svg, { Rect } from "react-native-svg";
import { Feather } from "@expo/vector-icons";

const GRID = 48;

const COLORS = [
  "#fff7c5","#f2deb0","#d9b38c","#c99682","#ad6c61","#8d4f4d","#63383f","#3d2439",
  "#ff9a6a","#ff7b6b","#ff5773","#ff3c8f","#d538b8","#a832d4","#6f2bd9","#3b1b9e",
  "#fff96b","#ffe433","#ffbf2f","#ff9133","#ff6737","#e64856","#b63763","#6d2d63",
  "#d0fa5f","#b5f73e","#8bdf4f","#58c46b","#2aa590","#157b9c","#1b4c96","#17348a"
];

export default function Pixel() {
  const { width } = useWindowDimensions();
  const cellSize = Math.max(2, Math.floor(width * 0.65 / GRID));
  const canvasSize = cellSize * GRID;

  const [pixels, setPixels] = useState(new Array(GRID * GRID).fill("#1e1e1e"));
  const [color, setColor] = useState("#ff7b6b");
  const [tool, setTool] = useState("brush");
  const [menuOpen, setMenuOpen] = useState(true);

  // ZOOM
  const scale = useRef(new Animated.Value(1)).current;
  const [zoom, setZoom] = useState(1);

  function applyZoom(z) {
    const newZoom = Math.max(0.5, Math.min(z, 4));
    setZoom(newZoom);
    Animated.spring(scale, {
      toValue: newZoom,
      useNativeDriver: true,
    }).start();
  }

  // refs para evitar closures
  const colorRef = useRef(color);
  const toolRef = useRef(tool);
  useEffect(() => { colorRef.current = color; }, [color]);
  useEffect(() => { toolRef.current = tool; }, [tool]);

  const canvasRef = useRef(null);
  const offset = useRef({ x: 0, y: 0 });
  const menuWidth = useRef(new Animated.Value(90)).current;

  function recalcOffset() {
    try {
      if (Platform.OS === "web" && canvasRef.current?.getBoundingClientRect) {
        const rect = canvasRef.current.getBoundingClientRect();
        offset.current = {
          x: rect.left + (window.scrollX || 0),
          y: rect.top + (window.scrollY || 0),
        };
      }
    } catch {}
  }

  function toggleMenu() {
    Animated.timing(menuWidth, {
      toValue: menuOpen ? 0 : 90,
      duration: 180,
      useNativeDriver: false,
    }).start(() => setTimeout(recalcOffset, 20));
    setMenuOpen((v) => !v);
  }

  function getPos(evt) {
    const ev = evt?.nativeEvent || evt || {};

    if (Platform.OS === "web") {
      const ox = ev.offsetX ?? ev.layerX;
      const oy = ev.offsetY ?? ev.layerY;
      if (typeof ox === "number" && typeof oy === "number")
        return { x: ox, y: oy };

      const pageX =
        ev.pageX ??
        ev.clientX ??
        (ev.touches && ev.touches[0]?.pageX) ??
        0;
      const pageY =
        ev.pageY ??
        ev.clientY ??
        (ev.touches && ev.touches[0]?.pageY) ??
        0;

      return { x: pageX - offset.current.x, y: pageY - offset.current.y };
    }

    return {
      x:
        ev.locationX ??
        (ev.touches && ev.touches[0]?.locationX) ??
        ev.pageX ??
        0,
      y:
        ev.locationY ??
        (ev.touches && ev.touches[0]?.locationY) ??
        ev.pageY ??
        0,
    };
  }

  function paintAt(x, y) {
    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);
    if (col < 0 || col >= GRID || row < 0 || row >= GRID) return;

    const idx = row * GRID + col;
    const desired =
      toolRef.current === "eraser" ? "#1e1e1e" : colorRef.current;

    setPixels((prev) => {
      if (prev[idx] === desired) return prev;
      const copy = [...prev];
      copy[idx] = desired;
      return copy;
    });
  }

  const isDrawing = useRef(false);
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: (evt) => {
        isDrawing.current = true;
        const pos = getPos(evt);
        paintAt(pos.x, pos.y);
      },

      onPanResponderMove: (evt) => {
        if (!isDrawing.current) return;
        const pos = getPos(evt);
        paintAt(pos.x, pos.y);
      },

      onPanResponderRelease: () => {
        isDrawing.current = false;
      },

      onPanResponderTerminate: () => {
        isDrawing.current = false;
      },
    })
  ).current;

  const onCanvasLayout = (e) => {
    if (Platform.OS === "web") {
      setTimeout(() => recalcOffset(), 20);
      return;
    }
    const lay = e.nativeEvent.layout;
    offset.current = { x: lay.x, y: lay.y };
  };

  useEffect(() => {
    recalcOffset();
    const t = setTimeout(recalcOffset, 120);
    return () => clearTimeout(t);
  }, [canvasSize]);

  return (
    <SafeAreaView style={styles.app}>
      
      {/* BOTÃO MENU */}
      <TouchableOpacity style={styles.menuToggle} onPress={toggleMenu}>
        <Feather name="menu" size={24} color="#fff" />
      </TouchableOpacity>

      {/* MENU LATERAL */}
      <Animated.View style={[styles.leftBar, { width: menuWidth }]}>
        {menuOpen && (
          <>

            <TouchableOpacity
              style={[styles.toolBtn, tool === "brush" && styles.activeTool]}
              onPress={() => setTool("brush")}
            >
              <Feather name="edit" size={22} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.toolBtn, tool === "eraser" && styles.activeTool]}
              onPress={() => setTool("eraser")}
            >
              <Feather name="slash" size={22} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.toolBtn}
              onPress={() =>
                setPixels(new Array(GRID * GRID).fill("#1e1e1e"))
              }
            >
              <Feather name="trash-2" size={22} color="#fff" />
            </TouchableOpacity>
          </>
        )}
      </Animated.View>

      {/* CANVAS COM ZOOM */}
      <View style={styles.canvasContainer}>
        <Animated.View style={{ transform: [{ scale: scale }] }}>
          <View
            ref={canvasRef}
            onLayout={onCanvasLayout}
            {...panResponder.panHandlers}
            style={{
              width: canvasSize,
              height: canvasSize,
              backgroundColor: "#000",
            }}
          >
            <Svg width={canvasSize} height={canvasSize}>
              {pixels.map((c, i) => {
                const x = (i % GRID) * cellSize;
                const y = Math.floor(i / GRID) * cellSize;
                return (
                  <Rect
                    key={i}
                    x={x}
                    y={y}
                    width={cellSize}
                    height={cellSize}
                    fill={c}
                  />
                );
              })}
            </Svg>
          </View>
        </Animated.View>
      </View>

      {/* BOTÕES DE ZOOM */}
      <View style={styles.zoomButtons}>
        <TouchableOpacity
          onPress={() => applyZoom(zoom + 0.2)}
          style={styles.zoomBtn}
        >
          <Feather name="zoom-in" size={22} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => applyZoom(zoom - 0.2)}
          style={styles.zoomBtn}
        >
          <Feather name="zoom-out" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* PALETA */}
      <View style={styles.colorBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {COLORS.map((c, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => setColor(c)}
              style={[
                styles.colorItem,
                { backgroundColor: c },
                c === color && styles.selectedColor,
              ]}
            />
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  app: { flex: 1, backgroundColor: "#111", flexDirection: "row" },

  menuToggle: {
    position: "absolute",
    top: 14,
    left: 12,
    zIndex: 999,
    padding: 8,
    backgroundColor: "#0008",
    borderRadius: 8,
  },

  leftBar: {
    height: "100%",
    backgroundColor: "#0d0d0d",
    paddingVertical: 18,
    paddingHorizontal: 8,
    overflow: "hidden",
  },

  sectionTitle: {
    color: "#fff",
    marginBottom: 10,
    fontSize: 14,
    opacity: 0.7,
    textAlign: "center",
  },

  toolBtn: {
    width: 60,
    height: 60,
    marginVertical: 8,
    backgroundColor: "#1c1c1c",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  activeTool: { backgroundColor: "#ff7b6b" },

  canvasContainer: {
    flex: 1,
    backgroundColor: "#181818",
    justifyContent: "center",
    alignItems: "center",
  },

  colorBar: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingVertical: 10,
    backgroundColor: "#0d0d0d",
  },

  colorItem: {
    width: 32,
    height: 32,
    borderRadius: 6,
    marginHorizontal: 4,
  },

  selectedColor: {
    borderWidth: 3,
    borderColor: "#fff",
  },

  zoomButtons: {
    position: "absolute",
    top: 70,
    right: 20,
    zIndex: 999,
    alignItems: "center",
  },

  zoomBtn: {
    backgroundColor: "#0008",
    padding: 8,
    borderRadius: 8,
    marginBottom: 10,
  },
});
