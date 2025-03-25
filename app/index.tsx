import { Link } from "expo-router";
import { Image, Text, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from 'expo-font';
import { Montserrat_400Regular, Montserrat_500Medium, Montserrat_600SemiBold, Montserrat_700Bold, Montserrat_400Regular_Italic } from '@expo-google-fonts/montserrat';

export default function Index() {
  // Load Montserrat font family
  const [fontsLoaded] = useFonts({
    MontserratRegular: Montserrat_400Regular,
    MontserratMedium: Montserrat_500Medium,
    MontserratSemiBold: Montserrat_600SemiBold,
    MontserratBold: Montserrat_700Bold,
    MontserratItalic: Montserrat_400Regular_Italic,
  });

  // Optional: Add a loading screen while fonts are loading
  if (!fontsLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-green-100">
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-green-100 font-black">
      <View className="pt-6 px-6">
        <View className="items-center bg-white rounded-3xl py-5 shadow-md">
          <Text className="text-4xl font-bold">
            <Text className="text-emerald-500">Calorie</Text>
            <Text className="text-emerald-700">Scan</Text>
          </Text>

          <View className="flex-row items-center mt-2 px-5">
            <View className="h-px bg-emerald-200 flex-1 mr-3" />
            <Text style={{ fontFamily: 'MontserratItalic' }} className="text-emerald-600">
              bill to calorie made simple
            </Text>
            <View className="h-px bg-emerald-200 flex-1 ml-3" />
          </View>
        </View>
      </View>

      <View className="items-center justify-center py-8 px-6 relative">

        {/* Circle Divs */}

        <View className="absolute w-20 h-20 rounded-full bg-emerald-100 opacity-50 top-4 right-2" />
        <View className="absolute w-12 h-12 rounded-full bg-emerald-200 opacity-40 top-12 left-12" />

        {/* Main image container with shadow and border */}
        <View className="w-64 h-64 rounded-full bg-gradient-to-br from-emerald-50 to-emerald-200 items-center justify-center mb-6 shadow-lg border-2 border-white">
          <View className="w-60 h-60 rounded-full overflow-hidden bg-white items-center justify-center border-4 border-emerald-100">
            <Image
              source={require('@/public/images/canva-bill.png')}
              className="w-40 h-full"
              accessibilityLabel="Illustration of a receipt with food items"
            />
          </View>
        </View>
      </View>

      {/* Feature cards */}
      <View className="px-6 mb-6">
        <View className="bg-white rounded-2xl p-4 mb-4 flex-row items-center shadow-sm border border-emerald-50">
          <View className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 items-center justify-center mr-4">
            <Text className="text-white text-lg">📷</Text>
          </View>
          <View className="flex-1">
            <Text style={{ fontFamily: 'MontserratSemiBold' }} className="text-lg text-emerald-700">
              Quick Scan
            </Text>
            <Text style={{ fontFamily: 'MontserratRegular' }} className="text-gray-600">
              Capture any restaurant bill in seconds
            </Text>
          </View>
        </View>

        <View className="bg-white rounded-2xl p-4 flex-row items-center shadow-sm border border-emerald-50">
          <View className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 items-center justify-center mr-4">
            <Text className="text-white text-lg">🔍</Text>
          </View>
          <View className="flex-1">
            <Text style={{ fontFamily: 'MontserratSemiBold' }} className="text-lg text-emerald-700">
              Smart Analysis
            </Text>
            <Text style={{ fontFamily: 'MontserratRegular' }} className="text-gray-600">
              AI-powered calorie estimation
            </Text>
          </View>
        </View>
      </View>

      <View className="items-center mt-auto mb-10 px-6">
        <Link
          href="/camera"
          replace
          asChild
        >
          <TouchableOpacity>
            <View className="p-4 rounded-3xl shadow-lg w-full bg-green-500">
              <View className="flex-row items-center justify-center">
                <Text style={{ fontFamily: 'MontserratBold' }} className="text-white text-xl mr-2">
                  Scan Now
                </Text>
                <Text className="text-white text-xl">→</Text>
              </View>
            </View>
          </TouchableOpacity>
        </Link>

        <View className="flex-row mt-6 items-center">
          <View className="w-2 h-2 rounded-full bg-emerald-300 mx-1" />
          <View className="w-2 h-2 rounded-full bg-emerald-200 mx-1" />
          <View className="w-2 h-2 rounded-full bg-emerald-200 mx-1" />
        </View>

      </View>
    </SafeAreaView>
  );
}