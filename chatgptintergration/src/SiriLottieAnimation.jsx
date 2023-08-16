import React,{useRef, useEffect} from 'react'
import lottie from "lottie-web";
import animationData from "./assets/siri.json"; // Replace with the actual path

const SiriLottieAnimation = () => {
    const animationContainer = useRef(null);

    useEffect(() => {
   
        lottie.loadAnimation({
          container: animationContainer.current,
          renderer: "svg", // Use 'canvas', 'html', 'svg', or 'webgl'
          loop: true,
          autoplay: true,
          animationData: animationData,
        });
     
  
    }, []);
    return (
        <div ref={animationContainer}></div>
    )
}

export  {SiriLottieAnimation}
