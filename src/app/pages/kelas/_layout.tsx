import React from "react";
import "../global.css";
import { Slot } from "expo-router";
import Header from "./header";
import Bottom from "./bottom";
import { AuthProvider, useAuth } from "./lib/AuthContext";
import { View } from "react-native";

function RootLayout() {
  const { authToken } = useAuth();

  return (
    <View style={{ flex: 1 }}>
      {authToken && <Header />}
      <View style={{ flex: 1 }}>
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
