// faceblink.js

import vision from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3";
const { FaceLandmarker, FilesetResolver } = vision;

// ——— exported API callbacks ———
let blinkCallback       = () => {};
let toggleStateCallback = () => {};

// ——— internal state ———
let faceLandmarker = null;
let blinkRunning   = false;
let videoStream    = null;
let lastVideoTime  = -1;
const video = document.createElement("video");
video.autoplay = true;
video.playsInline = true;
video.style.display = "none";
document.body.appendChild(video);

// ——— load the model ———
(async function createFaceLandmarker() {
  const resolver = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
  );
  faceLandmarker = await FaceLandmarker.createFromOptions(resolver, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
      delegate: "GPU"
    },
    outputFaceBlendshapes: true,
    runningMode: "VIDEO",
    numFaces: 1
  });
  document.dispatchEvent(new Event("FaceBlinkReady"));
})();

// ——— frame loop ———
async function predictWebcam() {
  if (!blinkRunning || !faceLandmarker) {
    requestAnimationFrame(predictWebcam);
    return;
  }
  const nowMs = Date.now();
  const delta_time = 0.05 //  between predictions
  if (video.currentTime > lastVideoTime + delta_time) {
    lastVideoTime = video.currentTime;
    const results    = faceLandmarker.detectForVideo(video, nowMs);
    const categories = results.faceBlendshapes?.[0]?.categories;
    if (categories && categories.length) {
      // **Pass the raw array** instead of wrapping in an object**
      blinkCallback(categories);
    }
  }
  requestAnimationFrame(predictWebcam);
}

// ——— start/stop controls ———
function startBlinkRecognition(force) {
  if (!navigator.mediaDevices?.getUserMedia) {
    console.error("Webcam not supported");
    return;
  }
  navigator.mediaDevices.getUserMedia({ video: true })
    .then((stream) => {
      videoStream = stream;
      video.srcObject = stream;
      blinkRunning = true;
      lastVideoTime = -1
      toggleStateCallback(true, force);
      video.addEventListener("loadeddata", predictWebcam);
    })
    .catch(console.error);
}

function stopBlinkRecognition(force ) {
  blinkRunning = false;
  if (videoStream) {
    videoStream.getTracks().forEach(t => t.stop());
    videoStream = null;
  }
  toggleStateCallback(false, force);
}


function toggleBlinkRecognition() {
  blinkRunning ? stopBlinkRecognition(true) : startBlinkRecognition(true);
}

function turnOnBlinkRecognition() {
  if (!blinkRunning) startBlinkRecognition(false);
}

function turnOffBlinkRecognition() {
  if (blinkRunning) stopBlinkRecognition(false);
}

// ——— registration functions ———
window.FaceBlink = {
  setBlinkCallback(cb)       { blinkCallback = cb; },
  setToggleStateCallback(cb) { toggleStateCallback = cb; },
  toggleBlinkRecognition,
  turnOnBlinkRecognition,
  turnOffBlinkRecognition
};
