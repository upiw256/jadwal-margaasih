import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, Image, Dimensions } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { fetchArticles } from "../api"; // Import the API call
import { WebView } from 'react-native-webview';

export default function ArtikelDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const { width } = Dimensions.get('window');

  useEffect(() => {
    if (id) {
      fetchArticles()
        .then(data => {
          const article = data.find(item => item.id.toString() === id.toString());
          setContent(article);
        })
        .catch(error => console.error(error))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!content) {
    return <Text>Article not found</Text>;
  }

  return (
    <ScrollView>
      <View style={{ padding: 16 }}>
        <Image
          source={{ uri: "https://sman1margaasih.sch.id/storage/" + content.image }}
          style={{ width: "100%", height: 192, borderRadius: 8 }}
        />
        <Text style={{ color: 'gray', marginTop: 8 }}>
          By: {content.user.name}
        </Text>
        <Text style={{ color: 'gray' }}>
          Published on:{" "}
          {new Date(content.created_at).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Text>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginVertical: 16 }}>{content.title}</Text>
        <WebView
          originWhitelist={['*']}
          source={{ html: `<html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>${content.content}</body></html>` }}
          style={{ height: 400, width: width - 32 }}
          nestedScrollEnabled={true}
        />
      </View>
    </ScrollView>
  );
}
