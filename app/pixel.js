// PixelPage.js
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  PanResponder,
  SafeAreaView,
  ScrollView,
  Text,
  Platform,
} from "react-native";

/*
  Componente unificado para Web + Mobile.
  - Usa locationX/locationY quando possível.
  - Para web, usa getBoundingClientRect() para converter clientX/clientY em coords relativos.
  - Para RN, usa onLayout para pegar posição do canvas (apenas para medidas se necessário).
*/

const GRID = 24;     // número de pixels por lado (aumente/diminua)
const PIXEL = 20;    // tamanho do pixel em px -> controla o tamanho do canvas

export default function PixelPage() {
  const [pixels, setPixels] = useState(
    Array.from({ length: GRID }, () => Array(GRID).fill("transparent"))
  );

  const [tool, setTool] = useState("brush"); // 'brush' | 'eraser' | 'fill'
  const [brushSize, setBrushSize] = useState(1);
  const [color, setColor] = useState("#000000");

  const canvasRef = useRef(null);
  const rectRef = useRef(null); // guarda bounding rect no web
  const isDrawing = useRef(false);

  // paleta
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

  // Função para clonar a matriz (imutable)
  const clonePixels = old =>
    old.map(row => {
      return [...row];
    });

  // Pinta com brush (considera brushSize)
  const paintAt = (x, y) => {
    if (x < 0 || x >= GRID || y < 0 || y >= GRID) return;

    const newPixels = clonePixels(pixels);

    for (let dy = 0; dy < brushSize; dy++) {
      for (let dx = 0; dx < brushSize; dx++) {
        const px = x + dx;
        const py = y + dy;
        if (px >= 0 && px < GRID && py >= 0 && py < GRID) {
          newPixels[py][px] = tool === "eraser" ? "transparent" : color;
        }
      }
    }

    setPixels(newPixels);
  };

  // Fill (flood fill)
  const fillBucket = (sx, sy) => {
    if (sx < 0 || sx >= GRID || sy < 0 || sy >= GRID) return;
    const target = pixels[sy][sx];
    const replacement = tool === "eraser" ? "transparent" : color;
    if (target === replacement) return;

    const newPixels = clonePixels(pixels);
    const stack = [[sx, sy]];

    while (stack.length) {
      const [cx, cy] = stack.pop();
      if (cx < 0 || cx >= GRID || cy < 0 || cy >= GRID) continue;
      if (newPixels[cy][cx] !== target) continue;

      newPixels[cy][cx] = replacement;

      stack.push([cx + 1, cy]);
      stack.push([cx - 1, cy]);
      stack.push([cx, cy + 1]);
      stack.push([cx, cy - 1]);
    }

    setPixels(newPixels);
  };

  // Converte evento para coordenadas do grid (x,y)
  const getGridCoordsFromEvent = evt => {
    // 1) React Native touch events often provide locationX/locationY relative to the target
    if (evt && evt.nativeEvent && typeof evt.nativeEvent.locationX === "number") {
      const lx = evt.nativeEvent.locationX;
      const ly = evt.nativeEvent.locationY;
      const gx = Math.floor(lx / PIXEL);
      const gy = Math.floor(ly / PIXEL);
      return { x: gx, y: gy };
    }

    // 2) Web: use clientX/clientY with bounding rect
    try {
      if (canvasRef.current && canvasRef.current.getBoundingClientRect) {
        const rect = canvasRef.current.getBoundingClientRect();
        // evt might be a native browser MouseEvent or a React synthetic event with clientX
        const clientX = evt.clientX ?? (evt.nativeEvent && evt.nativeEvent.clientX);
        const clientY = evt.clientY ?? (evt.nativeEvent && evt.nativeEvent.clientY);
        if (typeof clientX === "number" && typeof clientY === "number") {
          const lx = clientX - rect.left;
          const ly = clientY - rect.top;
          const gx = Math.floor(lx / PIXEL);
          const gy = Math.floor(ly / PIXEL);
          return { x: gx, y: gy };
        }
      }
    } catch (e) {
      // ignore
    }

    // fallback: (0,0)
    return { x: -1, y: -1 };
  };

  // Handler único que decide entre paint e fill
  const handlePointer = (evt, isStart = false) => {
    const { x, y } = getGridCoordsFromEvent(evt);
    if (x < 0 || y < 0 || x >= GRID || y >= GRID) return;

    if (isStart && tool === "fill") {
      fillBucket(x, y);
    } else if (tool === "fill" && !isStart) {
      // não pinta ao arrastar quando a ferramenta é fill
      return;
    } else {
      paintAt(x, y);
    }
  };

  // ---- PANRESPONDER para React Native ----
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: e => {
        isDrawing.current = true;
        handlePointer(e, true);
      },
      onPanResponderMove: e => {
        if (!isDrawing.current) return;
        handlePointer(e, false);
      },
      onPanResponderRelease: () => {
        isDrawing.current = false;
      },
      onPanResponderTerminate: () => {
        isDrawing.current = false;
      },
    })
  ).current;

  // ---- Eventos para Web (mouse) ----
  useEffect(() => {
    if (Platform.OS === "web" && canvasRef.current) {
      const node = canvasRef.current;
      let mouseDown = false;

      const onMouseDown = e => {
        mouseDown = true;
        isDrawing.current = true;
        handlePointer(e, true);
      };
      const onMouseMove = e => {
        if (!mouseDown) return;
        handlePointer(e, false);
      };
      const onMouseUp = e => {
        mouseDown = false;
        isDrawing.current = false;
      };

      node.addEventListener("mousedown", onMouseDown);
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);

      // save bounding rect for performance (optional)
      const updateRect = () => {
        if (node.getBoundingClientRect) {
          rectRef.current = node.getBoundingClientRect();
        }
      };
      updateRect();
      window.addEventListener("resize", updateRect);

      return () => {
        node.removeEventListener("mousedown", onMouseDown);
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
        window.removeEventListener("resize", updateRect);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasRef.current, tool, brushSize, color, pixels]);

  // centraliza e aumenta: container estilizado no stylesheet

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.appRow}>
        {/* Toolbar esquerda */}
        <View style={styles.tools}>
          <TouchableOpacity
            style={[styles.toolBtn, tool === "brush" && styles.active]}
            onPress={() => setTool("brush")}
          >
            <Text style={styles.toolText}>Brush</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toolBtn, tool === "eraser" && styles.active]}
            onPress={() => setTool("eraser")}
          >
            <Text style={styles.toolText}>Eraser</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toolBtn, tool === "fill" && styles.active]}
            onPress={() => setTool("fill")}
          >
            <Text style={styles.toolText}>Fill</Text>
          </TouchableOpacity>

          <View style={styles.sep} />

          <Text style={styles.label}>Brush size</Text>
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

        {/* Area central do canvas */}
        <View style={styles.centerArea}>
          <View style={styles.canvasWrapper}>
            {/* Container do canvas — usamos ref para web; em RN panResponder é aplicado aqui */}
            <View
              ref={canvasRef}
              style={[
                styles.canvasContainer,
                { width: GRID * PIXEL, height: GRID * PIXEL },
              ]}
              {...(Platform.OS !== "web" ? panResponder.panHandlers : {})}
              onLayout={() => {
                // para RN: podemos usar onLayout se precisar de medidas
                // no web usamos getBoundingClientRect diretamente
              }}
            >
              {/* Grid de pixels */}
              <View style={styles.canvas}>
                {pixels.map((row, ry) => (
                  <View key={ry} style={styles.row}>
                    {row.map((col, rx) => (
                      <View
                        key={rx}
                        style={[
                          styles.pixel,
                          {
                            width: PIXEL,
                            height: PIXEL,
                            backgroundColor: col,
                          },
                        ]}
                      />
                    ))}
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Paleta e ações abaixo do canvas */}
          <View style={styles.controlsRow}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.palette}>
              {PALETTE.map(c => (
                <TouchableOpacity
                  key={c}
                  onPress={() => setColor(c)}
                  style={[
                    styles.color,
                    { backgroundColor: c },
                    color === c && styles.selectedColor,
                  ]}
                />
              ))}
            </ScrollView>

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() =>
                  setPixels(Array.from({ length: GRID }, () => Array(GRID).fill("transparent")))
                }
              >
                <Text style={styles.actionText}>Clear</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => {
                  // inverter cores para visualizar (exemplo)
                  const inverted = clonePixels(pixels).map(row =>
                    row.map(cell => (cell === "transparent" ? "#ffffff" : cell))
                  );
                  setPixels(inverted);
                }}
              >
                <Text style={styles.actionText}>Example</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

// --------- STYLES ----------
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#1b1b1b",
  },
  appRow: {
    flex: 1,
    flexDirection: "row",
    padding: 12,
  },

  // TOOLS (left)
  tools: {
    width: 92,
    backgroundColor: "#0f0f0f",
    borderRadius: 10,
    padding: 8,
    alignItems: "center",
    marginRight: 12,
  },
  toolBtn: {
    width: 70,
    height: 42,
    backgroundColor: "#222",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    marginVertical: 6,
  },
  active: {
    borderWidth: 2,
    borderColor: "#ff33bb",
  },
  toolText: {
    color: "#fff",
    fontSize: 12,
  },
  sep: {
    height: 10,
  },
  label: {
    color: "#ccc",
    fontSize: 11,
    marginTop: 8,
  },
  brushSizes: {
    marginTop: 8,
    alignItems: "center",
  },
  brushDot: {
    width: 22,
    height: 22,
    backgroundColor: "#444",
    marginVertical: 6,
    borderRadius: 6,
  },
  activeBrush: {
    backgroundColor: "#ff33bb",
  },

  // center area
  centerArea: {
    flex: 1,
    alignItems: "center",
  },
  canvasWrapper: {
    marginTop: 6,
    backgroundColor: "#ccc",
    padding: 6,
    borderRadius: 10,
    // força a área de trabalho ficar centralizada e não empurrar o layout
    alignItems: "center",
    justifyContent: "center",
  },
  canvasContainer: {
    // dimensões definidas inline (GRID*PIXEL)
    backgroundColor: "#e9e9e9",
    borderRadius: 6,
    overflow: "hidden",
    display: "flex",
  },
  canvas: {
    // o grid é composto de rows
  },
  row: {
    flexDirection: "row",
  },
  pixel: {
    borderWidth: 0.5,
    borderColor: "#bdbdbd",
  },

  // controls baixo
  controlsRow: {
    width: "100%",
    marginTop: 12,
    alignItems: "center",
  },
  palette: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  color: {
    width: 36,
    height: 36,
    marginHorizontal: 6,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#00000000",
  },
  selectedColor: {
    borderColor: "#fff",
    borderWidth: 2,
  },
  actionButtons: {
    flexDirection: "row",
    marginTop: 10,
  },
  actionBtn: {
    backgroundColor: "#222",
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 6,
    borderRadius: 8,
  },
  actionText: {
    color: "#fff",
    fontSize: 13,
  },
});
