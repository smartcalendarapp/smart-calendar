import { GestureRecognizer, FilesetResolver } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3";

// Global variable to hold the current gesture data (if needed externally)
let currentGesture = null;

// Default callback function for gesture updates (can be overridden)
let gestureCallback = function(gestureData) {
  console.log("Default gesture callback:", gestureData);
};

// Default toggle state callback (can be overridden)
let toggleStateCallback = function(isRunning) {
  console.log("Default toggle state callback. Recognition running:", isRunning);
};

// Function for setting the gesture update callback from external script
function setGestureCallback(callback) {
  gestureCallback = callback;
}

// Function for setting the toggle state callback from external script
function setToggleStateCallback(callback) {
  toggleStateCallback = callback;
}

// Function to update gesture data and call the registered gesture callback
function updateGesture(gestureData) {
  currentGesture = gestureData;
  gestureCallback(gestureData);
}

let gestureRecognizer;
async function createGestureRecognizer() {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
  );
  gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
      delegate: "GPU"
    },
    runningMode: "VIDEO"
  });
}
createGestureRecognizer();

// Create a hidden video element for the webcam stream.
const video = document.createElement("video");
video.autoplay = true;
video.playsInline = true;
video.style.display = "none"; // keep the video hidden
document.body.appendChild(video);

let gestureRecognitionRunning = false;
let videoStream = null;
let lastVideoTime = -1;

// Processes the webcam frames if gesture recognition is active.
async function predictWebcam() {
  if (!gestureRecognitionRunning) {
    return;
  }
  if (!gestureRecognizer) {
    requestAnimationFrame(predictWebcam);
    return;
  }
  const nowInMs = Date.now();
  if (video.currentTime !== lastVideoTime) {
    lastVideoTime = video.currentTime;
    const results = await gestureRecognizer.recognizeForVideo(video, nowInMs);
    if (results.gestures.length > 0) {
      const gestureData = {
        categoryName: results.gestures[0][0].categoryName,
        score: results.gestures[0][0].score,
        handedness: results.handednesses[0][0].displayName,
        landmarks: results.landmarks // optional, if you need landmarks
      };
      updateGesture(gestureData);
    }
  }
  requestAnimationFrame(predictWebcam);
}

// Starts the webcam and gesture recognition.
function startGestureRecognition() {
  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        videoStream = stream;
        video.srcObject = stream;
        gestureRecognitionRunning = true;
        toggleStateCallback(gestureRecognitionRunning); // notify new state
        video.addEventListener("loadeddata", predictWebcam);
      })
      .catch(err => console.error("Error accessing webcam:", err));
  } else {
    console.error("getUserMedia() is not supported by your browser.");
  }
}

// Stops the webcam and gesture recognition.
function stopGestureRecognition() {
  gestureRecognitionRunning = false;
  if (videoStream) {
    videoStream.getTracks().forEach(track => track.stop());
    videoStream = null;
  }
  toggleStateCallback(gestureRecognitionRunning); // notify new state
}

// Toggles gesture recognition on or off.
function toggleGestureRecognition() {
  if (gestureRecognitionRunning) {
    stopGestureRecognition();
  } else {
    startGestureRecognition();
  }
}

// Attach the API to the global window object.
window.HandGesture = {
  setGestureCallback,
  setToggleStateCallback,
  toggleGestureRecognition
};
