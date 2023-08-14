import {View, Text, SafeAreaView, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LottieView from 'lottie-react-native';

export default function WelcomeScreen() {
  const navigation = useNavigation();
  return (
    <SafeAreaView className="flex-1 flex justify-around bg-black">
      {/* title */}
      <View className="space-y-2">
        <Text
          style={{fontSize: wp(5)}}
          className="text-center tracking-wider font-semibold text-gray-600">
          ChatBot by AJI Labs
        </Text>
      </View>

      {/* assistant image */}
      <View className="flex-row justify-center">
        <LottieView
          style={{height: wp(75), width: wp(75)}}
          source={require('../../assets/images/bot.json')}
          autoPlay
          loop
        />
      </View>

      {/* start button */}
      <TouchableOpacity
        onPress={() => navigation.navigate('Home')}
        className="bg-emerald-600 mx-5 p-4 rounded-2xl">
        <Text
          style={{fontSize: wp(6)}}
          className="text-center font-bold text-white">
          Get Started
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
