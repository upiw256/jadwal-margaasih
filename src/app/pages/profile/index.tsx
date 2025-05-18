import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../../lib/AuthContext";
import { router } from "expo-router";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import { updatePassword } from "../../api";

export default function ProfilePage() {
  const { user, logout } = useAuth();

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [secureOld, setSecureOld] = useState(true);
  const [secureNew, setSecureNew] = useState(true);
  const [secureConfirm, setSecureConfirm] = useState(true);

  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-gray-500">Data pengguna tidak ditemukan.</Text>
      </View>
    );
  }

  const userId = user.id;
  const guru = user.teacher || {};
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    user.name
  )}&background=0D8ABC&color=fff`;

  const handleLogout = async () => {
    await logout();
    router.replace("/pages/login");
  };

  const handleUpdatePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Semua field harus diisi");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Password baru dan konfirmasi tidak cocok");
      return;
    }
    setLoading(true);
    try {
      await updatePassword(userId, oldPassword, newPassword, confirmPassword);
      Alert.alert("Sukses", "Password berhasil diubah. Silakan login kembali.");
      await logout();
      router.replace("/pages/login");
    } catch (error) {
      Alert.alert("Error", error.message || "Gagal mengubah password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-100">
      <View className="bg-white p-6 rounded-xl m-4 shadow-lg">
        <View className="items-center mb-6">
          <Image
            source={{ uri: avatarUrl }}
            className="w-24 h-24 rounded-full mb-3"
          />
          <Text className="text-2xl font-bold text-gray-800">{user.name}</Text>
          <Text className="text-sm text-gray-500">{user.email}</Text>
        </View>

        <View className="border-t border-gray-200 pt-4 space-y-4">
          <ProfileItem label="NIP" value={guru.nip || "-"} />
          <ProfileItem
            label="Jenis Kelamin"
            value={guru.jenis_kelamin || "-"}
          />
          <ProfileItem
            label="Tempat, Tanggal Lahir"
            value={`${guru.tempat_lahir || "-"}, ${guru.tanggal_lahir || "-"}`}
          />
          <ProfileItem
            label="Bidang Studi"
            value={guru.bidang_studi_terakhir || "-"}
          />
          <ProfileItem label="Jenis PTK" value={guru.jenis_ptk_id_str || "-"} />
          <View>
            <Text className="text-gray-500 text-sm mb-1">Mata Pelajaran:</Text>
            {guru.subjects?.length > 0 ? (
              guru.subjects.map((sub: any, i: number) => (
                <Text key={i} className="text-base text-gray-800">
                  • {sub.name}
                </Text>
              ))
            ) : (
              <Text className="text-base text-gray-800">-</Text>
            )}
          </View>
        </View>

        <TouchableOpacity
          onPress={() => setShowPasswordForm(!showPasswordForm)}
          className="bg-cyan-700 px-6 py-3 rounded-md items-center mt-8"
        >
          <Text className="text-white font-semibold">
            {showPasswordForm ? "Batal Ubah Password" : "Ubah Password"}
          </Text>
        </TouchableOpacity>

        {showPasswordForm && (
          <View className="mt-4">
            <View className="relative mb-3">
              <TextInput
                placeholder="Password Lama"
                secureTextEntry={secureOld}
                className="bg-gray-600 p-3 rounded-md pr-10"
                value={oldPassword}
                onChangeText={setOldPassword}
              />
              <TouchableOpacity
                className="absolute right-3 top-3"
                onPress={() => setSecureOld(!secureOld)}
              >
                <Feather
                  name={secureOld ? "eye-off" : "eye"}
                  size={20}
                  color="gray"
                />
              </TouchableOpacity>
            </View>

            <View className="relative mb-3">
              <TextInput
                placeholder="Password Baru"
                secureTextEntry={secureNew}
                className="bg-gray-600 p-3 rounded-md pr-10"
                value={newPassword}
                onChangeText={setNewPassword}
              />
              <TouchableOpacity
                className="absolute right-3 top-3"
                onPress={() => setSecureNew(!secureNew)}
              >
                <Feather
                  name={secureNew ? "eye-off" : "eye"}
                  size={20}
                  color="gray"
                />
              </TouchableOpacity>
            </View>

            <View className="relative mb-3">
              <TextInput
                placeholder="Konfirmasi Password Baru"
                secureTextEntry={secureConfirm}
                className="bg-gray-600 p-3 rounded-md pr-10"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity
                className="absolute right-3 top-3"
                onPress={() => setSecureConfirm(!secureConfirm)}
              >
                <Feather
                  name={secureConfirm ? "eye-off" : "eye"}
                  size={20}
                  color="gray"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={handleUpdatePassword}
              className="bg-cyan-700 px-6 py-3 rounded-md items-center"
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-semibold">
                  Simpan Password
                </Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>

      <TouchableOpacity
        onPress={handleLogout}
        className="flex-row items-center bg-red-600 px-6 py-3 rounded-md mx-5 mt-6"
      >
        <MaterialIcons name="logout" size={20} color="#fff" />
        <Text className="text-white font-semibold ml-2">Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const ProfileItem = ({ label, value }: { label: string; value: string }) => (
  <View>
    <Text className="text-gray-500 text-sm mb-1">{label}</Text>
    <Text className="text-base text-gray-800 font-medium">{value}</Text>
  </View>
);
