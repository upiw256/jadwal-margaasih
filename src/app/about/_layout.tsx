import { View, Text } from "react-native";
import { Image } from "expo-image";
import React from "react";
import { useNavigation } from "@react-navigation/native";
("|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[");

export default function Page() {
  const navigation = useNavigation();
  const blurhash = "LEHV6nWB2yk8pyo0adR*.7kCMdnj"; // Example blurhash value

  return (
    <View className="flex-1 items-center justify-center bg-white p-6">
      <Image
        source={require("../assets/images/image1.jpg")}
        placeholder={{ blurhash }}
        contentFit="cover"
        transition={1000}
        className="w-32 h-32 rounded-full mb-4"
      />
      <Text className="text-2xl font-bold text-gray-800 mb-2">
        Tentang Aplikasi
      </Text>
      <Text className="text-center text-gray-600">
        Aplikasi ini dibuat untuk memudahkan melihat jadwal guru dan kelas,
        datayang diambil bersumber dari dapodik.
      </Text>
    </View>
  );
}
