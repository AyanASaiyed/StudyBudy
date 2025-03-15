import React, { useRef, useState } from "react";

declare class ImageCapture {
  constructor(track: MediaStreamTrack);
  grabFrame(): Promise<ImageBitmap>;
}

const CustomPiP = () => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [pipWindow, setPipWindow] = useState<Window | null>(null);

  // Function to open a custom PiP window
  const openCustomPiP = (stream: any) => {
    const pip = window.open(
      "",
      "ScreenSharePiP",
      "width=200,height=100,top=50,left=50"
    );

    if (!pip) {
      alert("Popup blocked! Please allow pop-ups.");
      return;
    }

    setPipWindow(pip);

    pip.document.write(`
      <html>
        <head>
          <title>Screen Share</title>
          <style>
            body { overflow: hidden; text-align: center; font-family: Arial, sans-serif; background: black; color: white; }
            video { width: 100%; height: auto; margin-bottom: 10px; }
            button { padding: 10px; margin: 5px; border: none; cursor: pointer; font-size: 14px; }
            .stop-btn { border-radius: calc(var(--radius) /* 0.25rem = 4px */ + 4px); background: red; color: white; }
            .screenshot-btn { border-radius: calc(var(--radius) /* 0.25rem = 4px */ + 4px); background: blue; color: white; }
          </style>
        </head>
        <body>
          <video id="pip-video" autoplay playsinline></video>
          <br>
          <button class="screenshot-btn" onclick="window.opener.postMessage('TAKE_SCREENSHOT', '*')">Take Screenshot</button>
          <button class="stop-btn" onclick="window.opener.postMessage('STOP_SCREEN_SHARE', '*')">Stop Sharing</button>
        </body>
      </html>
    `);

    pip.document.close();

    pip.onload = () => {
      const videoElement = pip.document.getElementById(
        "pip-video"
      ) as HTMLVideoElement;
      if (videoElement) {
        videoElement.srcObject = stream;
      }
    };

    pip.onbeforeunload = () => {
      stopScreenShare();
    };
  };

  // Function to start screen sharing
  const startScreenShare = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      });

      setStream(screenStream);
      openCustomPiP(screenStream);
    } catch (error) {
      console.error("Error sharing screen:", error);
    }
  };

  // Function to stop screen sharing
  const stopScreenShare = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }

    if (pipWindow) {
      pipWindow.close();
      setPipWindow(null);
    }
  };

  // Function to take a screenshot
  const takeScreenshot = () => {
    if (!stream) return;

    const videoTrack = stream.getVideoTracks()[0];
    const imageCapture = new ImageCapture(videoTrack);

    imageCapture
      .grabFrame()
      .then((bitmap) => {
        const canvas = document.createElement("canvas");
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          throw new Error("Could not get canvas context");
        }
        ctx.drawImage(bitmap, 0, 0, bitmap.width, bitmap.height);

        // Convert canvas to image and download
        const a = document.createElement("a");
        a.href = canvas.toDataURL("image/png");
        a.download = `screenshot-${Date.now()}.png`;
        a.click();
      })
      .catch((error) => console.error("Error capturing screenshot:", error));
  };

  // Listen for messages from the pop-up window
  window.addEventListener("message", (event) => {
    if (event.data === "STOP_SCREEN_SHARE") {
      stopScreenShare();
    } else if (event.data === "TAKE_SCREENSHOT") {
      takeScreenshot();
    }
  });

  return (
    <div>
      {!stream ? (
        <button
          className="rounded-xl px-4 py-2 bg-indigo-700 text-white"
          onClick={startScreenShare}
        >
          Start Screen Share
        </button>
      ) : (
        <button
          className="rounded-xl px-4 py-2 bg-red-600 text-white"
          onClick={stopScreenShare}
        >
          Stop Screen Share
        </button>
      )}
    </div>
  );
};

export default CustomPiP;
