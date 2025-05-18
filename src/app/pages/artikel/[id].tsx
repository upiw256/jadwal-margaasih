import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Image,
  Dimensions,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchArticles } from "../../api";
import { WebView } from "react-native-webview";

export default function ArtikelDetail() {
  const { id } = useLocalSearchParams();
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { width } = Dimensions.get("window");

  useEffect(() => {
    const fetchArticleData = async () => {
      if (id) {
        try {
          const data = await fetchArticles();
          const article = data.find(
            (item: any) => item.id.toString() === id.toString()
          );
          setContent(article);
        } catch (error) {
          console.error("Error fetching article:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchArticleData();
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0ea5e9" />
      </View>
    );
  }

  if (!content) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-gray-600">Artikel tidak ditemukan.</Text>
      </View>
    );
  }

  return (
    <ScrollView className="pb-16">
      <View className="p-4">
        <Image
          source={{
            uri: `https://sman1margaasih.sch.id/storage/${content.image}`,
          }}
          className="w-full h-48 rounded-lg mb-4"
          resizeMode="cover"
        />

        <Text className="text-gray-500 mb-1">By: {content.user.name}</Text>
        <Text className="text-gray-500 mb-3">
          Published on:{" "}
          {new Date(content.created_at).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Text>

        <Text className="text-2xl font-bold text-gray-800 mb-4">
          {content.title}
        </Text>

        <WebView
          originWhitelist={["*"]}
          source={{
            html: `
              <html>
                <head>
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <style>
                    body { font-size: 16px; color: #1f2937; padding: 0 10px; }
                    img { max-width: 100%; height: auto; border-radius: 8px; }
                  </style>
                </head>
                <body>${content.content}</body>
              </html>
            `,
          }}
          style={{ height: 400, width: width - 32, marginBottom: 32 }}
          nestedScrollEnabled={true}
        />
      </View>
    </ScrollView>
  );
}
