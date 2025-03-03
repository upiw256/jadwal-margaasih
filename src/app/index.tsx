import React, { useState, useCallback, useEffect } from "react";
import {
  Text,
  View,
  Image,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from "react-native";

const API_URL = "https://sman1margaasih.sch.id/api/article";
const AUTH_TOKEN = "Sman1margaasih*";

export default function Page() {
  return (
    <View className="flex flex-1">
      <Content />
    </View>
  );
}

function Content() {
  const [refreshing, setRefreshing] = useState(false);
  const [cardContents, setCardContents] = useState<any[]>([]);
  const [noMoreData, setNoMoreData] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchArticles = async () => {
    try {
      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      });
      const data = await response.json();
      if (!data) {
        throw new Error("No data returned from API");
      }
      if (!Array.isArray(data)) {
        throw new Error("Expected data to be an array, but got " + typeof data);
      }
      setCardContents(data);
      setNoMoreData(data.length === 0);
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchArticles().finally(() => setRefreshing(false));
  }, []);

  const loadMoreContents = () => {
    if (loadingMore || noMoreData) return;
    setLoadingMore(true);
    // Simulate a network request to load more contents
    setTimeout(() => {
      // Here you would fetch more data from the API
      setLoadingMore(false);
    }, 2000);
  };

  const handleScroll = ({ nativeEvent }) => {
    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
    if (layoutMeasurement.height + contentOffset.y >= contentSize.height - 20) {
      loadMoreContents();
    }
  };

  return (
    <ScrollView
      className="flex-1"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      onScroll={handleScroll}
      scrollEventThrottle={16}
    >
      <Text className="text-2xl font-bold text-center mt-4">Artikel</Text>
      <View className="flex flex-col items-center gap-4 text-center">
        {cardContents.map((content, index) => (
          <Card key={index} content={content} />
        ))}
        {loadingMore && <ActivityIndicator size="large" color="#0000ff" />}
        {noMoreData && <Text>Data sudah habis</Text>}
      </View>
    </ScrollView>
  );
}

function Card({ content }) {
  const truncateText = (text: string, maxWords: number) => {
    const words = text.split(" ");
    return words.length > maxWords
      ? words.slice(0, maxWords).join(" ") + "..."
      : text;
  };

  const decodeHtmlEntities = (text: string) => {
    return text
      .replace(/&#(\d+);/g, (_, dec) => {
        return String.fromCharCode(dec);
      })
      .replace(/<p>&nbsp;<\/p>/g, "");
  };
  return (
    <View className="mt-8 w-full max-w-sm rounded-lg overflow-hidden shadow-lg">
      <Image
        source={{
          uri: "https://sman1margaasih.sch.id/storage/" + content.image,
        }}
        style={{ width: "100%", height: 192 }}
      />
      <View className="px-6 py-4">
        <Text className="font-bold text-xl mb-2">{content.title}</Text>
        <Text className="text-gray-700 text-base">
          {truncateText(decodeHtmlEntities(content.content), 20)}
        </Text>
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
    </View>
  );
}
