import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { fetchArticles } from "./api"; // Import the API call

export default function ArtikelDetail({ route }) {
  const { id } = route.params;
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles()
      .then(data => {
        const article = data.find(item => item.id === id);
        setContent(article);
      })
      .catch(error => console.error(error))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!content) {
    return <Text>Article not found</Text>;
  }

  return (
    <ScrollView>
      <View className="px-6 py-4">
        <Text className="font-bold text-xl mb-2">{content.title}</Text>
        <Text className="text-gray-700 text-base">{content.content}</Text>
        <Text className="text-gray-500 text-sm mt-2">
          By: {content.user.name}
        </Text>
        <Text className="text-gray-500 text-sm">
          Published on:{" "}
          {new Date(content.created_at).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Text>
      </View>
    </ScrollView>
  );
}
