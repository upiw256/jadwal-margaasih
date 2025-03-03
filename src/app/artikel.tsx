import React, { useState, useCallback, useEffect } from "react";
import {
  Text,
  View,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import Card from "./components/Card"; // Import the Card component
import { fetchArticles } from "./api"; // Import the API call

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

  useEffect(() => {
    fetchArticles()
      .then(data => {
        setCardContents(data);
        setNoMoreData(data.length === 0);
      })
      .catch(error => console.error(error));
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchArticles()
      .then(data => setCardContents(data))
      .catch(error => console.error(error))
      .finally(() => setRefreshing(false));
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
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row">
          {cardContents.slice(0, 3).map((content, index) => (
            <Card key={index} content={content} />
          ))}
        </View>
      </ScrollView>
      <View className="flex flex-col items-center gap-4 text-center mt-4">
        {cardContents.slice(3).map((content, index) => (
          <Card key={index} content={content} />
        ))}
        {loadingMore && <ActivityIndicator size="large" color="#0000ff" />}
        {noMoreData && <Text>Data sudah habis</Text>}
      </View>
    </ScrollView>
  );
}
