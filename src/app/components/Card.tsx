import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function Card({ content }) {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/pages/artikel/${content.id}`);
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View className="mt-8 w-full max-w-sm rounded-lg overflow-hidden shadow-lg">
        <Image
          source={{
            uri: "https://sman1margaasih.sch.id/storage/" + content.image,
          }}
          style={{ width: "100%", height: 192 }}
        />
        <View className="px-6 py-4">
          <Text className="font-bold text-xl mb-2">{content.title}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
