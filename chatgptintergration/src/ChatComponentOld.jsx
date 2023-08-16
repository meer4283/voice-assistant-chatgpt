import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Divider } from "primereact/divider";
import { SiriLottieAnimation } from "./SiriLottieAnimation";
import PlayStoreImage from "./assets/download-playtsore.png";
import { useSpeechSynthesis } from 'react-speech-kit';

const host = "https://amazonscrape.byteladz.com";
//const host = "https://api.openai.com/v1/chat";

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

  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");


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

  useEffect(() => {
    setshowSpeakingLottie(true)
    const recognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition ||
      window.mozSpeechRecognition ||
      window.msSpeechRecognition;

    if (recognition) {
      const recognitionInstance = new recognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;

      recognitionInstance.onresult = (event) => {
        const results = event.results;
        console.log("results", results);
        const currentTranscript = results[results.length - 1][0].transcript;
        setTranscript(currentTranscript);

        if (!results[results.length - 1].isFinal) {
          setChatAssistantLoading(false);

          return;
        }
        recognitionInstance.abort();
        recognitionInstance.stop();
        setshowSpeakingLottie(false)
        setChatAssistantLoading(true);

        // Call the ChatGPT API with the transcript
        axios
          .post(
            host+"/completions",
            {
              model: "gpt-3.5-turbo",
              messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: currentTranscript },
              ],
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
          .then((response) => {
            setResponse(response.data.choices[0].message.content);
            //speak(response.data.choices[0].message.content)
            //handleTextToSpeech(response.data.choices[0].message.content)
             handleSpeak(response.data.choices[0].message.content)
          })
          .catch((error) => {
            console.error("Error:", error);
          })
          .finally(() => {
            setChatAssistantLoading(false);
          });
      };

      recognitionInstance.start();
    } else {
      console.error("Web Speech API is not supported in this browser.");
    }
  }, [voiceAgain]);

  return (
    <div
      style={{
        background: 'url("assets/signin-2.jpg") no-repeat',
        backgroundSize: "cover",
        height: "100vh",
      }}
      className="px-4 py-5 md:px-6 lg:px-8"
    >
      <div className="flex flex-wrap">
        <div
          className="w-full lg:w-6 p-4 lg:p-7 flex flex-column "
          style={{ backgroundColor: "rgba(255,255,255,.7)" }}
        >
          {/* <img src="assets/images/blocks/logos/bastion-purple.svg" alt="Image" height="50" className="mb-6" /> */}
          <div className="scroll-height-100">
            <div className="text-xl text-black-alpha-90 font-500 mb-3">
              Your Answer
            </div>
            <p className="text-black-alpha-50 line-height-3 mt-0 mb-6 scroll-height-100">
              {output}
            </p>
            {/* <ul className="list-none p-0 m-0">
                <li className="flex align-items-start mb-4">
                    <div>
                        <span className="flex align-items-center justify-content-center bg-purple-400" style={{ width: '38px', height: '38px', borderRadius: '10px' }}>
                            <i className="text-xl text-white pi pi-inbox"></i>
                        </span>
                    </div>
                    <div className="ml-3">
                        <span className="font-medium text-black-alpha-90">Unlimited Inbox</span>
                        <p className="mt-2 mb-0 text-black-alpha-50 line-height-3">Tincidunt nunc pulvinar sapien et. Vitae purus faucibus ornare suspendisse sed nisi lacus sed viverra. </p>
                    </div>
                </li>
                <li className="flex align-items-start mb-4">
                    <div>
                        <span className="flex align-items-center justify-content-center bg-purple-400" style={{ width: '38px', height: '38px', borderRadius: '10px' }}>
                            <i className="text-xl text-white pi pi-shield"></i>
                        </span>
                    </div>
                    <div className="ml-3">
                        <span className="font-medium text-black-alpha-90">Premium Security</span>
                        <p className="mt-2 mb-0 text-black-alpha-50 line-height-3">Scelerisque purus semper eget duis at tellus at urna. Sed risus pretium quam vulputate.</p>
                    </div>
                </li>
                <li className="flex align-items-start">
                    <div>
                        <span className="flex align-items-center justify-content-center bg-purple-400" style={{ width: '38px', height: '38px', borderRadius: '10px' }}>
                            <i className="text-xl text-white pi pi-globe"></i>
                        </span>
                    </div>
                    <div className="ml-3">
                        <span className="font-medium text-black-alpha-90">Cloud Backups Inbox</span>
                        <p className="mt-2 mb-0 text-black-alpha-50 line-height-3">Egestas sed tempus urna et. Auctor elit sed vulputate mi sit amet mauris commodo.</p>
                    </div>
                </li>
            </ul> */}
          </div>

          <div className="scroll-height-100">
            {/* <div className="text-xl text-black-alpha-90 font-500 mb-3">
              Your Voice
            </div>
            <p className="text-black-alpha-50 line-height-3 mt-0 mb-6 scroll-height-100">
            {audioUrl && <audio controls src={audioUrl} />}
            </p> */}

            <p>Your message: {transcript}</p>
            <p>Response from Assistant: {response}</p>
          </div>

          {/* <div className="scroll-height-100">
            <a href="https://drive.google.com/file/d/1LKiFiwUaTn0UtND9yTlZGFZ9n93v43u_/view?usp=sharing">
            <img width={150} src={PlayStoreImage} />
            </a>
            
          </div> */}
        </div>
        <div className="w-full lg:w-6 p-4 lg:p-7 surface-card">
          <div className="text-900 text-2xl font-medium mb-6">
            Solve Any Problem
          </div>
          <label htmlFor="email3" className="block text-900 font-medium mb-2">
            Ask Any Question
          </label>
          <InputText
            value={input}
            onChange={(e) => {
              setInput(e?.target?.value);
            }}
            type="text"
            placeholder="Type your message..."
            className="w-full mb-4"
          />

          <Button
            label="Submit your request"
            onClick={() => {
              handleInputSubmit();
            }}
            icon="pi pi-user"
            disabled={loading}
            loading={loading}
            className="w-full"
          />

          <Divider align="center" className="my-6">
            <span className="text-600 font-normal text-sm">OR</span>
          </Divider>

          <div className="text-900 text-2xl font-medium mb-6">
            Talk To Assistant
          </div>
          {/* <label htmlFor="email3" className="block text-900 font-medium mb-2">
            Press and speak you want{" "}
          </label> */}
          {/* <InputText
            type="text"
            placeholder="Type your message..."
            className="w-full mb-4"
            value={inputText}
            onChange={(e) => {
              setInputText(e?.target?.value);
            }}
          /> */}

          {showSpeakingLottie === true && <SiriLottieAnimation />}
          <Button
            label={chatAssistantLoading ? "Listening" : "Start Listening"}
            icon="pi pi-github"
            className="w-full p-button-secondary"
            onClick={() => {
              setvoiceAgain(!voiceAgain);
              // handleTextToSpeech();
            }}
            disabled={chatAssistantLoading}
          />

{audioUrl && (
        <div>
          <audio controls>
            <source src={audioUrl} type="audio/wav" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;
