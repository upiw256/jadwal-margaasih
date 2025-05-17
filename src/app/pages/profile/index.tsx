import React from "react";
import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import { useAuth } from "../../lib/AuthContext";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

export default function ProfilePage() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-gray-500">Data pengguna tidak ditemukan.</Text>
      </View>
    );
  }

  const guru = user.teacher || {};
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    user.name
  )}&background=0D8ABC&color=fff`;
  const handleLogout = async () => {
    await logout();
    router.replace("/pages/login");
  };
  return (
    <ScrollView className="flex-1 bg-gray-100">
      <View className="bg-white p-6 rounded-xl m-4 shadow-lg">
        <View className="items-center mb-6">
          <Image
            source={{
              uri: avatarUrl,
            }} // ganti dengan foto profil jika ada
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
      </View>
      <TouchableOpacity
        onPress={handleLogout}
        className="flex-row items-center bg-red-600 px-6 py-3 rounded-md mx-5"
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
