import { Link } from "expo-router";
import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className=" flex-1 px-6 pt-10">
        <View className="items-center mb-8">
          <Text className="text-3xl font-bold text-emerald-600">CalorieScan</Text>
          <Text className="text-base text-gray-500 mt-2 text-center">
            Scan your restaurant bills to track your calories
          </Text>
        </View>
        <View className="items-center justify-center py-6">
          <View className="w-60 h-60 bg-emerald-100 rounded-full items-center justify-center mb-6">
            <Image
              source={require('@/public/images/canva-bill.png')}
              className="w-40 h-full"
              accessibilityLabel="Illustration of a receipt with food items"
            />
          </View>
        </View>

        <View className="mb-10 p-2">
          <View className="flex-row items-center mb-4">
            <View className="w-10 h-10 rounded-full bg-emerald-100 items-center justify-center mr-4">
              <Text className="text-emerald-600 text-lg">📷</Text>
            </View>
            <Text className="text-base flex-1">Scan any restaurant bill instantly</Text>
          </View>

          <View className="flex-row items-center mb-4">
            <View className="w-10 h-10 rounded-full bg-emerald-100 items-center justify-center mr-4">
              <Text className="text-emerald-600 text-lg">🔍</Text>
            </View>
            <Text className="text-base flex-1">Get accurate calorie estimates</Text>
          </View>
        </View>

        <View className="items-center mt-auto mb-10">
          <Link
            href="/camera"
            className="bg-emerald-600 px-10 py-4 rounded-full active:bg-emerald-700 active:scale-95"
          >
            <Text className="text-white font-bold text-lg">Scan Bill</Text>
          </Link>
        </View>

      </View>

    </SafeAreaView>
  );
}
