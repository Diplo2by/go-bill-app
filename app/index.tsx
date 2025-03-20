import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View className=" flex-1 items-center justify-center">
      <Text className=" text-5xl text-blue-500 font-bold">Bu omg I am iOS dev!</Text>
      <Link href={"/camera"} className=" p-2 text-white bg-black rounded-lg active:scale-105">Click me 🥹</Link>

    </View>
  );
}
