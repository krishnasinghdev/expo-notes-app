import { Stack } from "expo-router";
import { StyleSheet } from "react-native";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        contentStyle: {
          backgroundColor: "#f0f0f0",
        },
        headerStyle: {
          backgroundColor: "#16A34A",
        },
        headerTintColor: "#FFFFFF",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        title: "Notes App 📝",
        headerShown: false,
      }}
    />
  );
}

const styles = StyleSheet.create({
  toggleContainer: {
    marginRight: 10,
    alignItems: "center",
  },

  toggleText: {
    fontSize: 12,
    color: "#fff",
    marginBottom: 8,
  },
});
