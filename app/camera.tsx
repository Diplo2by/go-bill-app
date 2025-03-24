import React, { useRef, useState } from 'react';
import { Text, TouchableOpacity, View, ActivityIndicator, Alert } from 'react-native';
import { CameraType, CameraView, CameraViewRef, useCameraPermissions } from 'expo-camera';
import { Link } from 'expo-router';
import { useFonts } from 'expo-font';
import { Montserrat_400Regular, Montserrat_500Medium, Montserrat_600SemiBold, Montserrat_700Bold, Montserrat_400Regular_Italic } from '@expo-google-fonts/montserrat';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from "axios"

const Camera = () => {
    const [facing, setFacing] = useState<CameraType>('back');
    const [perms, requestPerms] = useCameraPermissions();
    const [isCapturing, setIsCapturing] = useState(false);
    const cameraRef = useRef<CameraView>(null);

    // Load Montserrat font family
    const [fontsLoaded] = useFonts({
        MontserratRegular: Montserrat_400Regular,
        MontserratMedium: Montserrat_500Medium,
        MontserratSemiBold: Montserrat_600SemiBold,
        MontserratBold: Montserrat_700Bold,
        MontserratItalic: Montserrat_400Regular_Italic,
    });

    if (!fontsLoaded || !perms) {
        return (
            <View className="flex-1 items-center justify-center bg-green-100">
                <ActivityIndicator size="large" color="#10b981" />
                <Text
                    style={{ fontFamily: 'MontserratMedium' }}
                    className="mt-4 text-emerald-700"
                >
                    Loading camera...
                </Text>
            </View>
        );
    }

    if (!perms.granted) {
        return (
            <View className="flex-1 items-center justify-center bg-green-100 px-6">
                <View className="w-20 h-20 rounded-full bg-white items-center justify-center mb-6 shadow-md">
                    <Ionicons name="camera-outline" size={40} color="#10b981" />
                </View>

                <Text
                    style={{ fontFamily: 'MontserratSemiBold' }}
                    className="text-2xl text-emerald-700 mb-3 text-center"
                >
                    Camera Access Needed
                </Text>

                <Text
                    style={{ fontFamily: 'MontserratRegular' }}
                    className="text-gray-600 mb-8 text-center"
                >
                    We need camera access to scan your restaurant bills for calorie estimation
                </Text>

                <TouchableOpacity
                    onPress={requestPerms}
                    className="px-8 py-4 rounded-xl bg-emerald-500 shadow-md"
                >
                    <Text
                        style={{ fontFamily: 'MontserratBold' }}
                        className="text-white text-lg"
                    >
                        Grant Permission
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    const toggleFacing = () => {
        setFacing(curr => (curr === 'back' ? "front" : "back"));
    };

    const handleCapture = async () => {
        if (!cameraRef.current) return;
        setIsCapturing(true);

        try {
            const photo = await cameraRef.current.takePictureAsync({
                quality: 0.7,
                base64: false,
            });
            await uploadImage(photo?.uri || "")

        } catch (error) {
            console.error('Error capturing or uploading image:', error);
            Alert.alert(
                'Error',
                'Failed to capture or process image. Please try again.',
                [{ text: 'OK' }]
            );
        } finally {
            setIsCapturing(false)
        }
    };


    const uploadImage = async (uri: string) => {
        // Prepare Payload
        const formData = new FormData();

        // Get file name from URI
        const uriParts = uri.split('/');
        const fileName = uriParts[uriParts.length - 1];

        // Append the image to form data
        formData.append('image', {
            uri: uri,
            name: fileName,
            type: 'image/jpeg',
        } as any);

        try {
            setIsCapturing(true);

            console.log('Uploading image to:', 'https://go-bill.vercel.app/api/analyze-bill');

            const response = await axios.post(
                'https://go-bill.vercel.app/api/analyze-bill',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    timeout: 30000, // 30 second  timeout
                }
            );

            console.log('Upload successful:', response.data);

            Alert.alert(
                'Success',
                'Bill analyzed successfully!',
                [{ text: 'OK' }]
            );

        } catch (error) {
            console.error('Upload failed:', error);

            if (axios.isAxiosError(error)) {
                console.log('Response status:', error.response?.status);
                console.log('Response data:', error.response?.data);
            }

            Alert.alert(
                'Upload Failed',
                'Could not analyze the bill. Please try again.',
                [{ text: 'OK' }]
            );
        }
    };

    return (
        <SafeAreaView className=' flex-1'>
            <View className="flex-1 items-center">
                <CameraView className="flex-1" facing={facing} ref={cameraRef}
                    style={{
                        height: "100%",
                        width: "100%"
                    }}
                >
                    {/* Header */}
                    <View className="pt-12 pb-2 px-4 flex-row justify-between items-center bg-black/30 backdrop-blur-md">
                        <Link href="/" asChild>
                            <TouchableOpacity>
                                <View className="w-10 h-10 rounded-full bg-white/20 items-center justify-center">
                                    <Ionicons name="arrow-back" size={24} color="#ffffff" />
                                </View>
                            </TouchableOpacity>
                        </Link>

                        <Text
                            style={{ fontFamily: 'MontserratBold' }}
                            className="text-white text-xl"
                        >
                            Scan Bill
                        </Text>

                        <TouchableOpacity onPress={toggleFacing}>
                            <View className="w-10 h-10 rounded-full bg-white/20 items-center justify-center">
                                <Ionicons name="camera-reverse-outline" size={22} color="#ffffff" />
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* Scanning Guide Overlay */}
                    <View className="flex-1 items-center justify-center p-8">
                        <View className="w-72 h-96 border-2 border-dashed border-white/70 rounded-lg">
                            <View className="absolute -top-4 left-1/2 -ml-24 bg-black/50 px-4 py-1 rounded-full">
                                <Text
                                    style={{ fontFamily: 'MontserratMedium' }}
                                    className="text-white text-sm"
                                >
                                    Align bill within frame
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View className="pb-10 pt-6 items-center justify-center bg-black/30 backdrop-blur-md">
                        <TouchableOpacity
                            onPress={handleCapture}
                            disabled={isCapturing}
                            className="items-center"
                        >
                            <View className="w-16 h-16 rounded-full bg-white border-4 border-emerald-500 items-center justify-center mb-2">
                                {isCapturing ? (
                                    <ActivityIndicator color="#10b981" size="large" />
                                ) : (
                                    <View className="w-12 h-12 rounded-full bg-emerald-500" />
                                )}
                            </View>
                            <Text
                                style={{ fontFamily: 'MontserratSemiBold' }}
                                className="text-white"
                            >
                                {isCapturing ? "Processing..." : "Capture"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </CameraView>
            </View>
        </SafeAreaView>
    );
};

export default Camera;