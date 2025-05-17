import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
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
      await loginUser(response.token, response.user);
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
    <View className="flex-1 justify-center bg-gray-100 px-6">
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
            color="#3B82F6" // warna biru sama kayak teks sebelumnya
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={handleLogin}
        className={`py-3 rounded-md ${loading ? "bg-gray-400" : "bg-blue-600"}`}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white text-center font-semibold">Masuk</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
