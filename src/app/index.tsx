import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import Hero from "./components/Hero"; // Import the Hero component
import fetchArticles from "./api"; // Import the API call
import { useRouter } from "expo-router"; // Import the router

const items = [
  { name: "Jadwal Kelas", icon: require("./assets/icon/calendar.png"), url: "/kelas" },
  { name: "Jadwal Guru", icon: require("./assets/icon/teacher_schedule.png"), url: "/guru" },
  { name: "About", icon: require("./assets/icon/info.png"), url: "/about" },
  { name: "Data Siswa", icon: require("./assets/icon/students.png"), url: "/pages/siswa" },
    { name: "Absensi", icon: require("./assets/icon/teachers.png"), url: "/pages/absen" },
  //   { name: "Absensi", icon: require("./assets/icon/absen.png"), url: "/absensi" }
];

export default function HomeScreen() {
  const [cardContents, setCardContents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchArticles.fetchArticles()
      .then((data) => setCardContents(data))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

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
              style={{ height: 50, width: 50, justifyContent: 'center', alignItems: 'center' }}
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