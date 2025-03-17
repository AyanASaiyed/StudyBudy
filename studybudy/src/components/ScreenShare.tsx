import { useEffect, useState } from "react";

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const ScreenShare = () => {
  const [isSharing, setIsSharing] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [captureInterval, setCaptureInterval] = useState<NodeJS.Timeout | null>(
    null
  );

  useEffect(() => {
    const recognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();

    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = false;
    setRecognition(recognition);
  }, []);

  function startSpeechRecognition() {
    if (!recognition) return;

    recognition!.onstart = () => console.log("Speech recognition started...");
    recognition!.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      console.log("Transcribed Text:", transcript);

      // document.body.innerHTML += <p>Recognized: ${transcript}</p>;
    };

    recognition!.onerror = (event: any) => console.error("Error:", event.error);
    recognition!.onend = () => console.log("Speech recognition ended.");
    recognition!.start();
  }

  const shareScreen = async () => {
    const options = {
      video: true,
      audio: false,
      surfaceSwitching: "include",
    };
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia(options);

      setScreenStream(stream);
      setIsSharing(true);

      const video = document.createElement("video");
      video.srcObject = stream;
      video.play();

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      function captureFrame() {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

          const imgUrl = canvas.toDataURL("image/png");
          console.log("Screenshot Captured:", imgUrl);
        }
      }

      const intervalId = setInterval(captureFrame, 3000);

      stream.getVideoTracks()[0].addEventListener("ended", () => {
        clearInterval(intervalId);
        setRecognition(null);
        console.log("Screen Share Stopped.");
      });

      setCaptureInterval(intervalId);

      stream.getVideoTracks()[0].addEventListener("ended", stopShare);

      startSpeechRecognition();
    } catch (error) {
      console.error("Error sharing screen: ", error);
    }
  };

  const stopShare = () => {
    if (screenStream) {
      screenStream.getTracks().forEach((track) => track.stop());
    }
    if (captureInterval) {
      clearInterval(captureInterval);
      setCaptureInterval(null);
    }

    if (recognition) {
      recognition.stop(); // Stop the microphone
      console.log("Microphone turned off.");
    }

    setScreenStream(null);
    setIsSharing(false);
    setRecognition(null);
    console.log("Screen sharing stopped.");
  };

  return (
    <div className="ml-5 flex items-center justify-center">
      {isSharing ? (
        <button
          className="bg-red-800 hover:bg-red-900 rounded-lg h-[7vh] w-[7vw] border-gray-600"
          onClick={stopShare}
        >
          Stop Sharing
        </button>
      ) : (
        <button
          className="rounded-xl w-[7vh] h-[7vh] bg-indigo-700 border-1 border-gray-600 hover:bg-indigo-800 hover:border-gray-700 items-center justify-center flex"
          onClick={shareScreen}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-projector size-8"
            viewBox="0 0 16 16"
          >
            <path d="M14 7.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0M2.5 6a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1zm0 2a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1z" />
            <path d="M0 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2 1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1H5a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1 2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1z" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default ScreenShare;
