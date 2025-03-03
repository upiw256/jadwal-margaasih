import { View, Text } from 'react-native'
import React from 'react'
import { useSafeAreaInsets } from "react-native-safe-area-context";
export default function header() {
  const { top } = useSafeAreaInsets();
    return (
      <View style={{ paddingTop: top }} className="bg-cyan-700">
        <View className="px-4 lg:px-6 h-20 flex items-center flex-row justify-between">
          <Text className="font-bold text-lg text-white">SMAN 1 MARGAASIH</Text>
        </View>
      </View>
    );
}
