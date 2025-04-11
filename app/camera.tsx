import React, { useRef, useState } from 'react';
import { Text, TouchableOpacity, View, ActivityIndicator, Alert, StatusBar } from 'react-native';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { Link, router } from 'expo-router';
import { useFonts } from 'expo-font';
import { Montserrat_400Regular, Montserrat_500Medium, Montserrat_600SemiBold, Montserrat_700Bold, Montserrat_400Regular_Italic } from '@expo-google-fonts/montserrat';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from "axios";
import * as ImagePicker from 'expo-image-picker';

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
                <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
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
                <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
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
            const response = await axios.post(
                process.env.EXPO_PUBLIC_API_URL as string,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    timeout: 30000, // 30 second timeout
                }
            );

            console.log('Upload successful:', response.data);

            router.push({
                pathname: "/results",
                params: { data: JSON.stringify(response.data) }
            })


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
        } finally {
            setIsCapturing(false);
        }
    };

    const pickImage = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
            if (status !== 'granted') {
                Alert.alert('Permission needed', 'We need access to your photos to select bills');
                return;
            }

            const resultImage = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                quality: 0.7,
                mediaTypes: ['images']
            })

            if (!resultImage.canceled && resultImage.assets && resultImage.assets.length > 0) {
                const selectedImg = resultImage.assets[0]
                await uploadImage(selectedImg.uri)
            }

        } catch (error) {
            console.error('Error picking image from gallery:', error);
            Alert.alert(
                'Error',
                'Failed to pick image from gallery. Please try again.',
                [{ text: 'OK' }]
            );
        }
    }

    return (
        <SafeAreaView className="flex-1 bg-black">
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
            <View className="flex-1 items-center">
                <CameraView
                    className="flex-1"
                    facing={facing}
                    ref={cameraRef}
                    style={{
                        height: "100%",
                        width: "100%"
                    }}
                >
                    {/* Header */}
                    <View className="pt-12 pb-3 px-5 flex-row justify-between items-center bg-gradient-to-b from-black/80 to-black/30">
                        <Link href="/" asChild>
                            <TouchableOpacity>
                                <View className="w-10 h-10 rounded-full bg-black/40 items-center justify-center">
                                    <Ionicons name="arrow-back" size={22} color="#ffffff" />
                                </View>
                            </TouchableOpacity>
                        </Link>

                        <Text
                            style={{ fontFamily: 'MontserratBold' }}
                            className="text-white text-lg"
                        >
                            Scan Bill
                        </Text>

                        <TouchableOpacity onPress={toggleFacing}>
                            <View className="w-10 h-10 rounded-full bg-black/40 items-center justify-center">
                                <Ionicons name="camera-reverse-outline" size={20} color="#ffffff" />
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* Scanning Guide Overlay with hints */}
                    <View className="flex-1 items-center justify-center p-8">
                        <View className="w-72 h-[25rem] border-2 border-dashed border-white/80 rounded-lg shadow-2xl">
                            <View className="absolute top-0 left-1/2 -ml-24 bg-emerald-600/90 px-4 py-2 rounded-full shadow-lg">
                                <Text
                                    style={{ fontFamily: 'MontserratMedium' }}
                                    className="text-white text-sm"
                                >
                                    Align bill within frame
                                </Text>
                            </View>

                            {/* Corner markers for better visual guide */}
                            <View className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-emerald-400 rounded-tl-md" />
                            <View className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-emerald-400 rounded-tr-md" />
                            <View className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-emerald-400 rounded-bl-md" />
                            <View className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-emerald-400 rounded-br-md" />

                            {/* Tip text */}
                            <View className="absolute bottom-6 left-0 right-0 items-center">
                                <View className="bg-black/60 px-4 py-2 rounded-lg">
                                    <Text
                                        style={{ fontFamily: 'MontserratRegular' }}
                                        className="text-white text-xs text-center"
                                    >
                                        Ensure good lighting for best results
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Bottom controls bar with visual improvements */}
                    <View className="pb-10 pt-6 bg-gradient-to-t from-black to-black/60">
                        <View className="flex-row items-center justify-center w-full">
                            {/* Left side (Gallery) */}
                            <View className="flex-1 items-center">
                                <TouchableOpacity
                                    onPress={pickImage}
                                    disabled={isCapturing}
                                    className="items-center justify-center"
                                    style={{ opacity: isCapturing ? 0.5 : 1 }}
                                >
                                    <View className="w-14 h-14 rounded-full bg-black/50 border border-white/30 items-center justify-center">
                                        <Ionicons name="images" size={24} color="#10b981" />
                                    </View>
                                    <Text
                                        style={{ fontFamily: 'MontserratMedium' }}
                                        className="text-white mt-2"
                                    >
                                        Gallery
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {/* Center (Camera Button) */}
                            <View className="items-center justify-center px-2">
                                <TouchableOpacity
                                    onPress={handleCapture}
                                    disabled={isCapturing}
                                    className="items-center"
                                >
                                    <View className="w-20 h-20 rounded-full bg-white/10 border-4 border-emerald-500 items-center justify-center mb-2 shadow-lg shadow-emerald-500/50">
                                        {isCapturing ? (
                                            <ActivityIndicator color="#10b981" size="large" />
                                        ) : (
                                            <View className="w-14 h-14 rounded-full bg-emerald-500" />
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

                            {/* Right side (empty but keeping for balance) */}
                            <View className="flex-1" />
                        </View>
                    </View>
                </CameraView>
            </View>
        </SafeAreaView>
    );
};

export default Camera;