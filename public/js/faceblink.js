// faceblink.js
import vision from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3";
const { FaceLandmarker, FilesetResolver } = vision;

// ——— exported API callbacks ———
let blinkCallback       = data => console.log('blink:', data);
let toggleStateCallback = (isRunning, isForce) =>
  console.log('Blink detection running=', isRunning, 'force=', isForce);

// ——— internal state ———
let faceLandmarker;
const video = document.createElement('video');
video.autoplay = video.playsInline = true;
video.style.display = 'none';
document.body.appendChild(video);

let blinkRunning   = false;
let videoStream    = null;
let lastVideoTime  = -1;
let isBlinkLeft    = false;
let isBlinkRight   = false;
const BLINK_THRESH = 0.5;

// ——— load the model ———
async function createFaceLandmarker() {
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
  // signal ready
  document.dispatchEvent(new Event('FaceBlinkReady'));
}
createFaceLandmarker();

// ——— per-frame loop ———
async function predictWebcam() {
  if (!blinkRunning || !faceLandmarker) {
    requestAnimationFrame(predictWebcam);
    return;
  }
  const nowMs = Date.now();
  if (video.currentTime !== lastVideoTime) {
    lastVideoTime  = video.currentTime;
    const results  = faceLandmarker.detectForVideo(video, nowMs);
    const shapes   = results.faceBlendshapes?.[0]?.categories;
    if (shapes) {
      const leftScore  = shapes.find(s=>s.categoryName==='eyeBlinkLeft').score;
      const rightScore = shapes.find(s=>s.categoryName==='eyeBlinkRight').score;

      // both-eyes blink
      if (leftScore > BLINK_THRESH && rightScore > BLINK_THRESH) {
        blinkCallback({ blinkType: 'both', leftScore, rightScore });
        isBlinkLeft = isBlinkRight = true;
      } else {
        // left-only
        if (leftScore > BLINK_THRESH && !isBlinkLeft) {
          blinkCallback({ blinkType: 'left', leftScore, rightScore });
          isBlinkLeft = true;
        } else if (leftScore <= BLINK_THRESH) {
          isBlinkLeft = false;
        }
        // right-only
        if (rightScore > BLINK_THRESH && !isBlinkRight) {
          blinkCallback({ blinkType: 'right', leftScore, rightScore });
          isBlinkRight = true;
        } else if (rightScore <= BLINK_THRESH) {
          isBlinkRight = false;
        }
      }
    }
  }
  requestAnimationFrame(predictWebcam);
}

// ——— start/stop/toggle ———
function startBlinkRecognition(force = false) {
  if (!navigator.mediaDevices?.getUserMedia) {
    console.error("Webcam not supported");
    return;
  }
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      videoStream = stream;
      video.srcObject = stream;
      blinkRunning = true;
      toggleStateCallback(true, force);
      video.addEventListener("loadeddata", predictWebcam);
    })
    .catch(err => console.error(err));
}

function stopBlinkRecognition(force = false) {
  blinkRunning = false;
  if (videoStream) {
    videoStream.getTracks().forEach(t => t.stop());
    videoStream = null;
  }
  toggleStateCallback(false, force);
}

function toggleBlinkRecognition() {
  blinkRunning
    ? stopBlinkRecognition(true)
    : startBlinkRecognition(true);
}

function turnOnBlinkRecognition()  { if (!blinkRunning) startBlinkRecognition(false); }
function turnOffBlinkRecognition() { if ( blinkRunning) stopBlinkRecognition(false); }

// ——— registration functions ———
function setBlinkCallback(cb)       { blinkCallback = cb; }
function setToggleStateCallback(cb) { toggleStateCallback = cb; }

window.FaceBlink = {
  setBlinkCallback,
  setToggleStateCallback,
  toggleBlinkRecognition,
  turnOnBlinkRecognition,
  turnOffBlinkRecognition
};
