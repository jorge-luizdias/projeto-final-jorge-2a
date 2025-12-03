import { Tabs } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import Entypo from "@expo/vector-icons/Entypo";
import { useFonts } from "expo-font";

export default function TabLayout() {
  const [fontsLoaded] = useFonts({
    PixelBold: require("../assets/fonts/PixelifySans-Bold.ttf"),
    PixelRegular: require("../assets/fonts/PixelifySans-Regular.ttf"),
    PixelMedium: require("../assets/fonts/PixelifySans-Medium.ttf"),
    PixelSemiBold: require("../assets/fonts/PixelifySans-SemiBold.ttf"),
  });

  if (!fontsLoaded) return null;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarStyle: {
          backgroundColor: "#0d0d0d",
          borderTopWidth: 0,
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
          elevation: 10,
          shadowColor: "#e5c07b",
          shadowOpacity: 0.2,
          shadowOffset: { width: 0, height: -1 },
        },

        tabBarActiveTintColor: "#e5c07b",
        tabBarInactiveTintColor: "#bbb",

        tabBarLabelStyle: {
          fontFamily: "PixelMedium",
          fontSize: 11,
        },

        tabBarItemStyle: {
          borderRadius: 15,
          marginHorizontal: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Página Inicial",
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome
              name="home"
              size={focused ? 28 : 22}
              color={color}
              style={{
                transform: [{ scale: focused ? 1.2 : 1 }],
              }}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="pageone"
        options={{
          title: "Arte Digital",
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome
              name="book"
              size={focused ? 28 : 22}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="pixel"
        options={{
          title: "Pixelar",
          tabBarIcon: ({ color, focused }) => (
            <Entypo
              name="round-brush"
              size={focused ? 28 : 22}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="aboutme"
        options={{
          title: "Sobre Mim",
          tabBarIcon: ({ color, focused }) => (
            <Feather
              name="coffee"
              size={focused ? 28 : 22}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
