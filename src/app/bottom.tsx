import { View } from "react-native";
import { Link } from "expo-router";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Bottom = () => {
  const { bottom } = useSafeAreaInsets();
  return (
    <View
      className="flex shrink-0 bg-cyan-700 mt-10"
      style={{
        paddingBottom: bottom,
        position: "absolute",
        bottom: 0,
        width: "100%",
      }}
    >
      <View className="py-4 flex flex-row justify-around">
        <Link
          className="text-md font-medium hover:underline web:underline-offset-4 text-white"
          href="/"
        >
          Home
        </Link>
        <Link
          className="text-md font-medium hover:underline web:underline-offset-4 text-white"
          href="/pages/kelas"
        >
          Kelas
        </Link>
        <Link
          className="text-md font-medium hover:underline web:underline-offset-4 text-white"
          href="/pages/guru"
        >
          Guru
        </Link>
        <Link
          className="text-md font-medium hover:underline web:underline-offset-4 text-white"
          href="/pages/about"
        >
          About
        </Link>
      </View>
    </View>
  );
};

export default Bottom;
