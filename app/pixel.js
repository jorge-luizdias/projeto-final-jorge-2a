import React, { useState, useRef } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  PanResponder,
  SafeAreaView,
  ScrollView,
  Image,
} from "react-native";

// CONFIGURAÇÃO DO CANVAS
const GRID = 20;
const PIXEL = 18;

export default function PixelPage() {
  const [pixels, setPixels] = useState(
    Array(GRID)
      .fill()
      .map(() => Array(GRID).fill("transparent"))
  );

  const [tool, setTool] = useState("brush");
  const [brushSize, setBrushSize] = useState(1);
  const [color, setColor] = useState("#000000");

  const canvasRef = useRef(null);

  // -------------------------
  // Função de pintar pixel
  // -------------------------
  const paint = (x, y) => {
    let newPixels = [...pixels];

    for (let dy = 0; dy < brushSize; dy++) {
      for (let dx = 0; dx < brushSize; dx++) {
        const px = x + dx;
        const py = y + dy;

        if (px < GRID && py < GRID) {
          newPixels[py][px] = tool === "eraser" ? "transparent" : color;
        }
      }
    }

    setPixels(newPixels);
  };

  // -------------------------
  // Ferramenta Balde (Fill)
  // -------------------------
  const fillBucket = (x, y) => {
    const target = pixels[y][x];
    if (target === color) return;

    const newPixels = pixels.map(row => [...row]);

    const stack = [[x, y]];

    while (stack.length) {
      const [cx, cy] = stack.pop();
      if (cx < 0 || cx >= GRID || cy < 0 || cy >= GRID) continue;
      if (newPixels[cy][cx] !== target) continue;

      newPixels[cy][cx] = color;

      stack.push([cx + 1, cy]);
      stack.push([cx - 1, cy]);
      stack.push([cx, cy + 1]);
      stack.push([cx, cy - 1]);
    }

    setPixels(newPixels);
  };

  // -------------------------
  // Detectar dedo arrastando
  // -------------------------
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: evt => handleTouch(evt),
      onPanResponderGrant: evt => handleTouch(evt),
    })
  ).current;

  const handleTouch = evt => {
    canvasRef.current.measure((fx, fy, w, h, px, py) => {
      const touchX = evt.nativeEvent.locationX;
      const touchY = evt.nativeEvent.locationY;

      const x = Math.floor(touchX / PIXEL);
      const y = Math.floor(touchY / PIXEL);

      if (x >= 0 && x < GRID && y >= 0 && y < GRID) {
        if (tool === "fill") fillBucket(x, y);
        else paint(x, y);
      }
    });
  };

  // -------------------------
  // Paleta de cores
  // -------------------------
  const PALETTE = [
    "#000000",
    "#ffffff",
    "#ff0000",
    "#ff7f00",
    "#ffff00",
    "#00ff00",
    "#00ffff",
    "#0000ff",
    "#8b00ff",
    "#ff00aa",
    "#777777",
    "#aaaaaa",
  ];

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        
        {/* ----- TOOLS LATERAL ----- */}
        <View style={styles.tools}>
          <TouchableOpacity
            style={[styles.toolBtn, tool === "brush" && styles.active]}
            onPress={() => setTool("brush")}
          >
            <Image
              source={require("../assets/icons/brush.png")}
              style={styles.icon}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toolBtn, tool === "eraser" && styles.active]}
            onPress={() => setTool("eraser")}
          >
            <Image
              source={require("../assets/icons/eraser.png")}
              style={styles.icon}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toolBtn, tool === "fill" && styles.active]}
            onPress={() => setTool("fill")}
          >
            <Image
              source={require("../assets/icons/bucket.png")}
              style={styles.icon}
            />
          </TouchableOpacity>

          {/* Brush size */}
          <View style={styles.brushSizes}>
            {[1, 2, 3].map(size => (
              <TouchableOpacity
                key={size}
                style={[
                  styles.brushDot,
                  brushSize === size && styles.activeBrush,
                ]}
                onPress={() => setBrushSize(size)}
              />
            ))}
          </View>
        </View>

        {/* ----- CANVAS ----- */}
        <View
          ref={canvasRef}
          style={styles.canvasContainer}
          {...panResponder.panHandlers}
        >
          <Image
            source={require("../assets/grid.png")} 
            style={styles.gridBg}
          />

          <View style={styles.canvas}>
            {pixels.map((row, y) => (
              <View key={y} style={styles.row}>
                {row.map((pixel, x) => (
                  <View
                    key={x}
                    style={[
                      styles.pixel,
                      { backgroundColor: pixel },
                    ]}
                  />
                ))}
              </View>
            ))}
          </View>
        </View>

        {/* ----- PALETA ----- */}
        <View style={styles.palette}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {PALETTE.map(c => (
              <TouchableOpacity
                key={c}
                onPress={() => setColor(c)}
                style={[
                  styles.color,
                  { backgroundColor: c },
                  c === color && styles.selectedColor,
                ]}
              />
            ))}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#1c1c1c",
  },
  container: {
    flex: 1,
    flexDirection: "row",
    padding: 10,
  },

  // TOOLS
  tools: {
    width: 70,
    backgroundColor: "#111",
    padding: 8,
    borderRadius: 10,
    alignItems: "center",
  },
  toolBtn: {
    width: 50,
    height: 50,
    backgroundColor: "#222",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    marginVertical: 5,
  },
  active: {
    borderWidth: 2,
    borderColor: "#ff00aa",
  },
  icon: {
    width: 28,
    height: 28,
    tintColor: "#fff",
  },

  // Brush sizes
  brushSizes: {
    marginTop: 15,
    alignItems: "center",
  },
  brushDot: {
    width: 20,
    height: 20,
    backgroundColor: "#555",
    marginVertical: 4,
    borderRadius: 6,
  },
  activeBrush: {
    backgroundColor: "#ff00aa",
  },

  // Canvas
  canvasContainer: {
    marginLeft: 10,
    backgroundColor: "#ccc",
    padding: 5,
    borderRadius: 12,
    overflow: "hidden",
  },
  gridBg: {
    position: "absolute",
    width: GRID * PIXEL,
    height: GRID * PIXEL,
    opacity: 0.3,
  },
  canvas: {},
  row: {
    flexDirection: "row",
  },
  pixel: {
    width: PIXEL,
    height: PIXEL,
    borderWidth: 0.3,
    borderColor: "#00000022",
  },

  // Palette
  palette: {
    position: "absolute",
    bottom: 10,
    left: 90,
    right: 10,
    height: 60,
    backgroundColor: "#111",
    borderRadius: 12,
    paddingHorizontal: 10,
    justifyContent: "center",
  },
  color: {
    width: 40,
    height: 40,
    marginHorizontal: 4,
    borderRadius: 6,
  },
  selectedColor: {
    borderWidth: 2,
    borderColor: "#fff",
  },
});
