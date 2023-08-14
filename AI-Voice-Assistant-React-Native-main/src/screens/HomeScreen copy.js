import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import Voice from '@react-native-community/voice';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {apiCall} from '../api/openAI';
import Features from '../components/features';
import Tts from 'react-native-tts';
import LottieView from 'lottie-react-native';
import bot from '../../assets/images/bot.json';
import LinearGradient from 'react-native-linear-gradient';

const App = () => {
  const [result, setResult] = useState('');
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [speaking, setSpeaking] = useState(false);
  const scrollViewRef = useRef();

  const speechStartHandler = e => {
    console.log('speech start event', e);
  };
  const speechEndHandler = e => {
    setRecording(false);
    console.log('speech stop event', e);
  };
  const speechResultsHandler = e => {
    console.log('speech event: ', e);
    const text = e.value[0];
    setResult(text);
  };

  const speechErrorHandler = e => {
    console.log('speech error: ', e);
  };

  const startRecording = async () => {
    setRecording(true);
    Tts.stop();
    try {
      await Voice.start('en-GB'); // en-US
    } catch (error) {
      console.log('error', error);
    }
  };
  const stopRecording = async () => {
    try {
      await Voice.stop();
      setRecording(false);
      fetchResponse();
    } catch (error) {
      console.log('error', error);
    }
  };
  const clear = () => {
    Tts.stop();
    setSpeaking(false);
    setLoading(false);
    setMessages([]);
  };

  const fetchResponse = async () => {
    if (result.trim().length > 0) {
      setLoading(true);
      let newMessages = [...messages];
      newMessages.push({role: 'user', content: result.trim()});
      setMessages([...newMessages]);

      // scroll to the bottom of the view
      updateScrollView();

      // fetching response from chatGPT with our prompt and old messages
      apiCall(result.trim(), newMessages).then(res => {
        console.log('got api data');
        setLoading(false);
        if (res.success) {
          setMessages([...res.data]);
          setResult('');
          updateScrollView();

          // now play the response to user
          startTextToSpeach(res.data[res.data.length - 1]);
        } else {
          Alert.alert('Error', res.msg);
        }
      });
    }
  };

  const updateScrollView = () => {
    setTimeout(() => {
      scrollViewRef?.current?.scrollToEnd({animated: true});
    }, 200);
  };

  const startTextToSpeach = message => {
    if (!message.content.includes('https')) {
      setSpeaking(true);
      // playing response with the voice id and voice speed
      Tts.speak(message.content, {
        iosVoiceId: 'com.apple.ttsbundle.Samantha-compact',
        rate: 0.5,
      });
    }
  };

  const stopSpeaking = () => {
    Tts.stop();
    setSpeaking(false);
  };

  useEffect(() => {
    // voice handler events
    Voice.onSpeechStart = speechStartHandler;
    Voice.onSpeechEnd = speechEndHandler;
    Voice.onSpeechResults = speechResultsHandler;
    Voice.onSpeechError = speechErrorHandler;

    // text to speech events
    Tts.setDefaultLanguage('en-IE');
    Tts.addEventListener('tts-start', event => console.log('start', event));
    Tts.addEventListener('tts-finish', event => {
      console.log('finish', event);
      setSpeaking(false);
    });
    Tts.addEventListener('tts-cancel', event => console.log('cancel', event));

    return () => {
      // destroy the voice instance after component unmounts
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  return (
    <View className="flex-1 bg-black">
       <LinearGradient
        style={{flex:1}}
        start={{ x: 0, y: 0 }}
        end={{x: 1, y: 1 }} colors={['#47092a', '#081245']}
      >
      {/* <StatusBar barStyle="dark-content" /> */}
      <SafeAreaView
        style={{
          display: 'flex',
          flex: 1,
          justifyContent: 'space-between',
        }}>
        {/* bot icon */}
        <View className="flex-row justify-center">
        {!recording ? <Text
          style={{fontSize: wp(5)}}
          className="text-center tracking-wider font-semibold text-white-600">
          Listening...
        </Text> : <></>}
        </View>

        <View className="flex-row justify-center">
        <LottieView
            style={{width:'100%', height:500}}
            source={require('../../assets/images/siri.json')}
            autoPlay
            loop
          />
        </View>

        <View>
          {messages.length > 0 ? (
            <View className="space-y-2 flex-1">
              <Text
                className="text-gray-700 font-semibold ml-1"
                style={{fontSize: wp(5)}}>
                Assistant
              </Text>

              <View
                style={{height: hp(58)}}
                className="bg-neutral-200 rounded-3xl p-4">
                <ScrollView
                  ref={scrollViewRef}
                  bounces={false}
                  className="space-y-4"
                  showsVerticalScrollIndicator={false}>
                  {messages.map((message, index) => {
                    if (message.role == 'assistant') {
                      if (message.content.includes('https')) {
                        // result is an ai image
                        return (
                          <View key={index} className="flex-row justify-start">
                            <View className="p-2 flex rounded-2xl bg-emerald-100 rounded-tl-none">
                              <Image
                                source={{uri: message.content}}
                                className="rounded-2xl"
                                resizeMode="contain"
                                style={{height: wp(60), width: wp(60)}}
                              />
                            </View>
                          </View>
                        );
                      } else {
                        // chat gpt response
                        return (
                          <View
                            key={index}
                            style={{width: wp(70)}}
                            className="bg-emerald-100 p-2 rounded-xl rounded-tl-none">
                            <Text
                              className="text-neutral-800"
                              style={{fontSize: wp(4)}}>
                              {message.content}
                            </Text>
                          </View>
                        );
                      }
                    } else {
                      // user input text
                      return (
                        <View key={index} className="flex-row justify-end">
                          <View
                            style={{width: wp(70)}}
                            className="bg-white p-2 rounded-xl rounded-tr-none">
                            <Text style={{fontSize: wp(4)}}>
                              {message.content}
                            </Text>
                          </View>
                        </View>
                      );
                    }
                  })}
                </ScrollView>
              </View>
            </View>
          ) : (
            <></>
          )}
        </View>

        {/* recording, clear and stop buttons */}
        <View style={{display:"flex" }} className="flex justify-center items-center">
       
          {loading ? (
             <LottieView
             style={{width: 130, height:130}}
             source={require('../../assets/images/without_sound.json')}
             autoPlay
             loop
           />
          ) : recording ? (
            <TouchableOpacity className="space-y-2" onPress={stopRecording}>
              {/* recording stop button */}
              <LottieView
              style={{width: 130, height:130}}
              source={require('../../assets/images/without_sound.json')}
              autoPlay
              loop
            />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={startRecording}>
              {/* recording start button */}
              <LottieView
              style={{width: 130, height:130}}             source={require('../../assets/images/mic.json')}
              autoPlay
              loop
            />
            </TouchableOpacity>
          )}
          {messages.length > 0 && (
            <TouchableOpacity
              onPress={clear}
              className="bg-neutral-400 rounded-3xl p-2 absolute right-10">
              <Text className="text-white font-semibold">Clear</Text>
            </TouchableOpacity>
          )}
          {speaking && (
            <TouchableOpacity
              onPress={stopSpeaking}
              className="bg-red-400 rounded-3xl p-2 absolute left-10">
              <Text className="text-white font-semibold">Stop</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

export default App;
