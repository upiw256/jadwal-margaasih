import React, { useEffect, useRef } from "react";
import { View, ScrollView, Dimensions, ActivityIndicator } from "react-native";
import Card from "./Card"; // Import the Card component

const { width } = Dimensions.get('window');

export default function Hero({ cardContents, loading }) {
  const scrollViewRef = useRef(null);
  let currentIndex = 0;

  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollViewRef.current) {
        currentIndex = (currentIndex + 1) % cardContents.length;
        scrollViewRef.current.scrollTo({ x: currentIndex * width, animated: true });
      }
    }, 3000); // Auto-slide every 3 seconds

    return () => clearInterval(interval);
  }, [cardContents]);

  return (
    <ScrollView
      ref={scrollViewRef}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
    >
      <View className="flex-row">
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          cardContents.map((content, index) => (
            <View key={index} style={{ width }}>
              <Card content={content} />
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}
