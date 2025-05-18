import React from "react";
import "../global.css";
import { Slot } from "expo-router";
import Header from "./header";
import Bottom from "./bottom";
import { AuthProvider, useAuth } from "./lib/AuthContext";
import { View, StatusBar } from "react-native";

function RootLayout() {
  const { authToken } = useAuth();

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content" // ganti "light-content" jika header kamu gelap
      />
      {authToken && <Header />}
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <Slot />
      </View>
      {authToken && <Bottom />}
    </View>
  );
}

export default function Layout() {
  return (
    <AuthProvider>
      <RootLayout />
    </AuthProvider>
  );
}
