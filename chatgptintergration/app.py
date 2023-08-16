import speech_recognition as sr
import os
import webbrowser
import openai
from config import apikey
import datetime
import random
import numpy as np

chatStr = ""

def chat(query):
    global chatStr
    print(chatStr)
    openai.api_key = apikey
    chatStr += f"Welcome to A.I. Labs: {query}\n A.I. Labs: "
    response = openai.Completion.create(
        model="text-davinci-003",
        prompt= chatStr,
        temperature=0.7,
        max_tokens=256,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0
    )
    # todo: Wrap this inside of a  try catch block
    say(response["choices"][0]["text"])
    chatStr += f"{response['choices'][0]['text']}\n"
    return response["choices"][0]["text"]


def ai(prompt):
    openai.api_key = apikey
    text = f"OpenAI response for Prompt: {prompt} \n *********\n\n"

    response = openai.Completion.create(
        model="gpt-3.5-turbo", #model="text-davinci-003",
        prompt=prompt,
        temperature=0.6, #0.7
        max_tokens=198, #256
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0
    )
    # todo: Wrap this inside of a  try catch block
    # print(response["choices"][0]["text"])
    text += response["choices"][0]["text"]
    if not os.path.exists("Openai"):
        os.mkdir("Openai")

    # with open(f"Openai/prompt- {random.randint(1, 2343434356)}", "w") as f:
    with open(f"Openai/{''.join(prompt.split('intelligence')[1:]).strip() }.txt", "w") as f:
        f.write(text)

def say(text):
    os.system(f'say "{text}"')

def takeCommand():
    r = sr.Recognizer()
    with sr.Microphone() as source:
        r.pause_threshold =  1
        audio = r.listen(source)
        try:
            print("Recognizing...")
            query = r.recognize_google(audio, language="en-US")
            print(f"User said: {query}")
            return query
        except Exception as e:
            return "Some Error Occurred. Sorry from A.I. Labs"

if _name_ == '_main_':
    print('Welcome to QuantumBlack A.I. Labs ')
   # say("Welcome to InvoCreate A.I....  My name is Michael. How can i help you today?")
    say("Welcome to Quantum Black A.I. Labs..  I am a smart chatBot developed by Quantum Black A.I.. How can i help you today?")
    while True:
        print("Listening...")
        query = takeCommand()
        # say(query)
        chat(query)