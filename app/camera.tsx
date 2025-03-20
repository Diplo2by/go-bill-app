import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera'

const camera = () => {
    const [facing, setFacing] = useState<CameraType>('front');
    const [perms, requestPerms] = useCameraPermissions();

    if (!perms) {
        return (
            <View className=' flex-1 items-center justify-center'>
                <Text>
                    Hol up your camera is loading

                </Text>
            </View>
        )
    }

    if (!perms.granted) {
        return (
            <View className='flex-1 items-center justify-center'>
                <Text className=' italic font-bold text-2xl'>
                    We need your permission to show the camera
                </Text>
                <Button onPress={requestPerms} title='grant perms' />
            </View>
        )
    }

    const toggleFacing = () => {
        setFacing(curr => (curr === 'back' ? "front" : "back"))
    }

    return (
        <View className=' flex-1 items-center justify-center w-full h-full'>
            <CameraView className='flex-1 w-full' facing={facing}>
                <View className=' flex-1 items-center justify-center' >
                    <TouchableOpacity className='p-2 text-white bg-black rounded-lg active:scale-105' onPress={toggleFacing}>
                        <Text className=' italic font-bold text-2xl text-white'>
                            Flip camera hehe
                        </Text>
                    </TouchableOpacity>
                </View>

            </CameraView>
        </View>
    )
}

export default camera

