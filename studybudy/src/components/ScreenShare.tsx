import React from "react";

const ScreenShare = () => {
  const shareScreen = async () => {
    const options = {
      video: true,
      audio: false,
      surfaceSwitching: "include",
    };

    try {
      const stream = await navigator.mediaDevices.getDisplayMedia(options);
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
          console.log("Screenshot Captured: ", imgUrl);
        }
      }

      const interval = setInterval(captureFrame, 3000);

      stream.getVideoTracks()[0].addEventListener("ended", () => {
        clearInterval(interval);
        console.log("Screen Share Stopped.");
      });
    } catch (error) {
      console.log("Error sharing screen: ", error);
    }
  };
  return (
    <div>
      <button
        className="rounded-xl w-[7vh] h-[7vh] bg-indigo-700 border-1 border-gray-600 hover:bg-indigo-800 hover:border-gray-700 ml-5 items-center justify-center flex"
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
    </div>
  );
};

export default ScreenShare;
