import { Tabs } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useFonts } from "expo-font";

export default function TabLayout() {
  const [fontsLoaded] = useFonts({
    PixelBold: require("../assets/fonts/PixelifySans-Bold.ttf"),
    PixelRegular: require("../assets/fonts/PixelifySans-Regular.ttf"),
    PixelMedium: require("../assets/fonts/PixelifySans-Medium.ttf"),
    PixelSemiBold: require("../assets/fonts/PixelifySans-SemiBold.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Página Inicial",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="pageone"
        options={{
          title: "Obrigatório",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome name="tag" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="pagetwo"
        options={{
          title: "Livre",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome name="free-code-camp" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="aboutme"
        options={{
          title: "Sobre Mim",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="nature-people" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
