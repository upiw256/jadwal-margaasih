import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import Hero from "./components/Hero";
import { fetchArticles } from "./api";
import { useRouter,  Redirect } from "expo-router";
import { useAuth } from "./lib/AuthContext";
const items = [
  {
    name: "Jadwal Kelas",
    icon: require("./assets/icon/calendar.png"),
    url: "/kelas",
  },
  {
    name: "Jadwal Guru",
    icon: require("./assets/icon/teacher_schedule.png"),
    url: "/guru",
  },
  {
    name: "About",
    icon: require("./assets/icon/info.png"),
    url: "/about",
  },
  {
    name: "Data Siswa",
    icon: require("./assets/icon/students.png"),
    url: "/siswa",
  },
  {
    name: "Absensi",
    icon: require("./assets/icon/teachers.png"),
    url: "/absen",
  },
];
export default function HomeScreen() {
  const { authToken, isLoading } = useAuth();
  const router = useRouter();
  const [cardContents, setCardContents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authToken) {
      fetchArticles()
        .then((data) => setCardContents(data))
        .catch((error) => console.error(error))
        .finally(() => setLoading(false));
    }
  }, [authToken]);

  if (isLoading) {
    // Tampilkan loading screen saat sedang load auth state
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!authToken) {
    return <Redirect href="/pages/login" />;
  }

  // Jika sudah login
  return (
    <View className="p-5">
    {cardContents.length > 0 && (
      <Hero cardContents={cardContents} loading={loading} />
    )}
    <Text className="font-bold text-lg mt-5">Menu</Text>
    <View className="flex-row flex-wrap justify-start mt-5 gap-1">
      {items.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={{ alignItems: "center", width: "22%", marginBottom: 10 }}
          onPress={() => router.push(item.url)}
        >
          <View
            className="p-2 bg-gray-200 mb-2"
            style={{
              height: 50,
              width: 50,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image source={item.icon} style={{ width: 24, height: 24 }} />
          </View>
          <Text style={{ fontSize: 10 }}>{item.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
  );
}
