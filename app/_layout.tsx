import { Stack } from "expo-router";
import '@/app/globals.css'

export default function RootLayout() {
  return <Stack screenOptions={{ headerShown: false }} >
    <Stack.Screen name="index" />
    <Stack.Screen name="camera" />
    <Stack.Screen name="results" />
  </Stack>;
}
