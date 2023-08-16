import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Divider } from "primereact/divider";
import { SiriLottieAnimation } from "./SiriLottieAnimation";
import PlayStoreImage from "./assets/download-playtsore.png";
import { useSpeechSynthesis } from 'react-speech-kit';

import { createSpeechlySpeechRecognition } from '@speechly/speech-recognition-polyfill';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';


const host = "https://amazonscrape.byteladz.com";
//const host = "https://api.openai.com/v1/chat";

const appId = 'cd20ba65-7834-410e-ad78-237d879fc940';
const SpeechlySpeechRecognition = createSpeechlySpeechRecognition(appId);
SpeechRecognition.applyPolyfill(SpeechlySpeechRecognition);


const ChatComponent = () => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");
  const [voiceAgain, setvoiceAgain] = useState(false);
  const [chatAssistantLoading, setChatAssistantLoading] = useState(true);
  const [showSpeakingLottie, setshowSpeakingLottie] = useState(false);
  const { speak } = useSpeechSynthesis();

  const handleInputSubmit = async () => {
    setLoading(true);
    const response = await axios.post(
      host+"/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: input },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    setLoading(false);
    setOutput(response.data.choices[0].message.content);
  };

  const [inputText, setInputText] = useState("");
  const [audioUrl, setAudioUrl] = useState("");

  const handleTextToSpeech = async (text) => {
    setLoading(true);
    setAudioUrl("")
    const response = await axios.post(
      "https://api.openai.com/v1/tts",
      {
        text: text,
        voice: "en-US-Wavenet-A", // e.g., 'en-US-Wavenet-A'
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer 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",
        },
        responseType: "arraybuffer", // To get binary audio data
      }
    );
    setLoading(false);

    const blob = new Blob([response.data], { type: "audio/wav" });
    setAudioUrl(URL.createObjectURL(blob));
  };

  // const [transcript, setTranscript] = useState("");
  // const [response, setResponse] = useState("");


  const handleSpeak = async (text) => {
    if ('speechSynthesis' in window) {
      const synth = window.speechSynthesis;
        console.log("synth", synth);
        if (text !== "") {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.rate = 0.8; // Set the rate

         synth.speak(utterance);
        }
     
    } else {
      alert("Speech synthesis is not supported in this browser.");
    }
  };

    const {
    transcript,
    listening,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();
  const startListening = () => SpeechRecognition.startListening({ continuous: true });

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }


  // useEffect(() => {
  //   setshowSpeakingLottie(true)
  //   const recognition =
  //     window.SpeechRecognition ||
  //     window.webkitSpeechRecognition ||
  //     window.mozSpeechRecognition ||
  //     window.msSpeechRecognition;

  //   if (recognition) {
  //     const recognitionInstance = new recognition();
  //     recognitionInstance.continuous = true;
  //     recognitionInstance.interimResults = true;

  //     recognitionInstance.onresult = (event) => {
  //       const results = event.results;
  //       console.log("results", results);
  //       const currentTranscript = results[results.length - 1][0].transcript;
  //       setTranscript(currentTranscript);

  //       if (!results[results.length - 1].isFinal) {
  //         setChatAssistantLoading(false);

  //         return;
  //       }
  //       recognitionInstance.abort();
  //       recognitionInstance.stop();
  //       setshowSpeakingLottie(false)
  //       setChatAssistantLoading(true);

  //       // Call the ChatGPT API with the transcript
  //       axios
  //         .post(
  //           host+"/completions",
  //           {
  //             model: "gpt-3.5-turbo",
  //             messages: [
  //               { role: "system", content: "You are a helpful assistant." },
  //               { role: "user", content: currentTranscript },
  //             ],
  //           },
  //           {
  //             headers: {
  //               "Content-Type": "application/json",
  //             },
  //           }
  //         )
  //         .then((response) => {
  //           setResponse(response.data.choices[0].message.content);
  //           //speak(response.data.choices[0].message.content)
  //           //handleTextToSpeech(response.data.choices[0].message.content)
  //            handleSpeak(response.data.choices[0].message.content)
  //         })
  //         .catch((error) => {
  //           console.error("Error:", error);
  //         })
  //         .finally(() => {
  //           setChatAssistantLoading(false);
  //         });
  //     };

  //     recognitionInstance.start();
  //   } else {
  //     console.error("Web Speech API is not supported in this browser.");
  //   }
  // }, [voiceAgain]);

  return (
    <div>
    <p>Microphone: {listening ? 'on' : 'off'}</p>
    <button
      onTouchStart={startListening}
      onMouseDown={startListening}
      onTouchEnd={SpeechRecognition.stopListening}
      onMouseUp={SpeechRecognition.stopListening}
    >Hold to talk</button>
    <p>{transcript}</p>
  </div>
  );
};

export default ChatComponent;
