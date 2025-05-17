import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  Switch,
} from "react-native";
import { useRouter } from "expo-router";
import { login } from "../../api"; // sesuaikan path
import { useAuth } from "../../lib/AuthContext"; // sesuaikan path
import { Feather } from "@expo/vector-icons";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const router = useRouter();
  const { loginUser } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Email dan password wajib diisi.");
      return;
    }

    setLoading(true);
    try {
      const response = await login(email, password);
      await loginUser(response.token, response.user, rememberMe);
      router.replace("/");
    } catch (error: any) {
      Alert.alert(
        "Login Gagal",
        error.message || "Terjadi kesalahan saat login."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center bg-white px-6">
      <Image
        source={require("../../assets/images/icon_square.png")} // sesuaikan path logo
        className="w-32 h-32 mx-auto mb-6"
      />
      <Text className="text-3xl font-bold text-center text-gray-800 mb-8">
        Login
      </Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        className="bg-white border border-gray-300 rounded-md px-4 py-3 mb-4 text-gray-800"
        placeholderTextColor="#9CA3AF"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <View className="relative mb-6">
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          className="bg-white border border-gray-300 rounded-md px-4 py-3 text-gray-800 pr-12"
          placeholderTextColor="#9CA3AF"
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-3"
          activeOpacity={0.7}
        >
          <Feather
            name={showPassword ? "eye-off" : "eye"}
            size={24}
            color="#0e7490" // warna biru sama kayak teks sebelumnya
          />
        </TouchableOpacity>
      </View>
      <View className="flex-row items-center mb-6">
        <Switch
          value={rememberMe}
          onValueChange={setRememberMe}
          trackColor={{ false: "#ccc", true: "#0e7490" }}
          thumbColor={rememberMe ? "#0284c7" : "#f4f3f4"}
        />
        <Text className="ml-2 text-gray-700">Tetap Login</Text>
      </View>
      <TouchableOpacity
        onPress={handleLogin}
        className={`py-3 rounded-md ${loading ? "bg-gray-400" : "bg-cyan-700"}`}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white text-center font-semibold">Masuk</Text>
        )}
      </TouchableOpacity>
      <View className="absolute bottom-6 w-full items-center">
        <Text className="text-xs text-gray-500 text-center">
          © {new Date().getFullYear()} IT SMAN 1 Margaasih. All rights reserved.
        </Text>
      </View>
    </View>
  );
}
