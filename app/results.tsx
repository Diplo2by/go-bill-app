import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Link, useLocalSearchParams } from 'expo-router'
import { Montserrat_400Regular, Montserrat_500Medium, Montserrat_600SemiBold, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import { useFonts } from 'expo-font';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { ApiResponse, formattedCalorieCount } from '@/util/script';

const results = () => {

    const { data } = useLocalSearchParams();

    let apiResponse: ApiResponse | null = null;

    try {
        apiResponse = data ? JSON.parse(data as string) : null;
    } catch (error) {
        console.error('Error parsing response data:', error);

    }

    const [fontsLoaded] = useFonts({
        MontserratRegular: Montserrat_400Regular,
        MontserratMedium: Montserrat_500Medium,
        MontserratSemiBold: Montserrat_600SemiBold,
        MontserratBold: Montserrat_700Bold,
    });

    if (!fontsLoaded) {
        return (
            <View className="flex-1 items-center justify-center bg-green-100">
                <ActivityIndicator size="large" color="#10b981" />
                <Text className="mt-4 text-emerald-700">Loading results...</Text>
            </View>
        );
    }

    if (!apiResponse || !apiResponse.success) {
        return (
            <SafeAreaView className="flex-1 bg-green-100">
                <View className="pt-6 px-6">
                    <View className="bg-white rounded-2xl p-6 shadow-md">
                        <View className="w-16 h-16 rounded-full bg-red-100 items-center justify-center mb-4 mx-auto">
                            <Ionicons name="alert-circle-outline" size={32} color="#ef4444" />
                        </View>

                        <Text
                            style={{ fontFamily: 'MontserratSemiBold' }}
                            className="text-xl text-gray-800 text-center mb-2"
                        >
                            Analysis Failed
                        </Text>

                        <Text
                            style={{ fontFamily: 'MontserratRegular' }}
                            className="text-gray-600 text-center mb-6"
                        >
                            We couldn't analyze your bill. Please try again.
                        </Text>

                        <Link href="/camera" asChild>
                            <TouchableOpacity>
                                <View className="p-4 rounded-xl bg-emerald-500 shadow-sm">
                                    <Text
                                        style={{ fontFamily: 'MontserratBold' }}
                                        className="text-white text-center"
                                    >
                                        Try Again
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </Link>
                    </View>
                </View>
            </SafeAreaView>
        );
    }

    const foodItems = Object.entries(apiResponse.data).map(([name, calories]) => ({
        name,
        calories
    }));

    const totalCalories = foodItems.reduce((sum, item) => sum + item.calories, 0);

    const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const copyToClipboard = async () => {
        if (!apiResponse || !apiResponse.success) {
            Alert.alert("Error", "No data available to copy");
            return;
        }
        const clipboardText = formattedCalorieCount(apiResponse)
        await Clipboard.setStringAsync(clipboardText as string)
    }

    return (
        <SafeAreaView className="flex-1 bg-green-100">
            <View className="pt-6 px-6 mb-4">
                <View className="flex-row items-center justify-between">
                    <Link href="/" replace asChild>
                        <TouchableOpacity>
                            <View className="w-10 h-10 rounded-full bg-white items-center justify-center shadow-sm">
                                <Ionicons name="home-outline" size={22} color="#10b981" />
                            </View>
                        </TouchableOpacity>
                    </Link>

                    <Text
                        style={{ fontFamily: 'MontserratBold' }}
                        className="text-2xl text-emerald-700"
                    >
                        Results
                    </Text>

                    <View className="w-10" />
                </View>
            </View>

            <View className="px-6 mb-4">
                <View className="bg-white rounded-2xl p-6 shadow-md">
                    <View className="items-center mb-4">
                        <View className="w-16 h-16 rounded-full bg-emerald-100 items-center justify-center mb-2">
                            <Ionicons name="restaurant-outline" size={30} color="#10b981" />
                        </View>

                        <Text
                            style={{ fontFamily: 'MontserratSemiBold' }}
                            className="text-xl text-gray-800"
                        >
                            Meal Analysis
                        </Text>

                        <Text
                            style={{ fontFamily: 'MontserratRegular' }}
                            className="text-gray-500 text-sm"
                        >
                            {currentDate}
                        </Text>
                    </View>

                    <View className="bg-emerald-50 rounded-xl p-4 mb-2">
                        <Text
                            style={{ fontFamily: 'MontserratMedium' }}
                            className="text-emerald-800 text-center text-lg"
                        >
                            Total Calories
                        </Text>
                        <Text
                            style={{ fontFamily: 'MontserratBold' }}
                            className="text-emerald-600 text-center text-3xl"
                        >
                            {totalCalories}
                        </Text>
                    </View>
                </View>
            </View>

            <ScrollView className="flex-1 px-6 mb-4">
                <Text
                    style={{ fontFamily: 'MontserratSemiBold' }}
                    className="text-lg text-emerald-700 mb-3"
                >
                    Items Detected ({foodItems.length})
                </Text>

                {foodItems.map((item, index) => (
                    <View
                        key={index}
                        className="bg-white rounded-xl p-4 mb-3 shadow-sm flex-row justify-between items-center"
                    >
                        <View className="flex-1">
                            <Text
                                style={{ fontFamily: 'MontserratMedium' }}
                                className="text-gray-800 text-lg"
                            >
                                {item.name}
                            </Text>
                        </View>

                        <View className="bg-emerald-100 px-3 py-1 rounded-full">
                            <Text
                                style={{ fontFamily: 'MontserratSemiBold' }}
                                className="text-emerald-700"
                            >
                                {item.calories} cal
                            </Text>
                        </View>
                    </View>
                ))}
            </ScrollView>


            <View className="px-6 mb-8">
                <View className="flex-row space-x-3 gap-2">
                    <TouchableOpacity className="flex-1" onPress={copyToClipboard}>
                        <View className="p-4 rounded-xl bg-emerald-500 shadow-sm">
                            <Text
                                style={{ fontFamily: 'MontserratBold' }}
                                className="text-white text-center"
                            >
                                Copy to Clipboard
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <Link href="/camera" asChild>
                        <TouchableOpacity className="flex-1">
                            <View className="p-4 rounded-xl bg-white border border-emerald-200 shadow-sm">
                                <Text
                                    style={{ fontFamily: 'MontserratBold' }}
                                    className="text-emerald-700 text-center"
                                >
                                    Scan New Bill
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </Link>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default results

