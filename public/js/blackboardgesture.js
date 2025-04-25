// blackboardgesture.js
import { GestureRecognizer, FilesetResolver }
  from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3";

/**
 * Initializes gesture recognition.
 * Calls the provided gestureCallback with an object
 *   { hand, pos: { x, y, z } }
 */
export async function initGesture(gestureCallback) {
  const video = document.getElementById("webcam");
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
  );
  const recognizer = await GestureRecognizer.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
      delegate: "GPU"
    },

    runningMode: "VIDEO"
  });

  // start webcam…
  await navigator.mediaDevices.getUserMedia({
    video: { width: window.innerWidth, height: window.innerHeight }
  }).then(stream => {
    video.srcObject = stream;
    video.onloadedmetadata = () => {
      video.play();
      predict();
    };
  });

  let lastVideoTime = -1;
  function predict() {
    if (video.currentTime !== lastVideoTime) {
      lastVideoTime = video.currentTime;
      const results = recognizer.recognizeForVideo(video, Date.now());
      process(results);
    }
    requestAnimationFrame(predict);
  }

  // landmarks to average: wrist + finger bases
  const PALM_INDICES = [0, 1, 5, 9, 13, 17];

  function toScreen(lm) {
    return {
      x: (1 - lm.x) * window.innerWidth,
      y:     lm.y   * window.innerHeight,
      z: lm.z != null ? lm.z * 100 : 0
    };
  }

  function process(results) {
    let sawLeft = false;

    for (let i = 0; i < results.landmarks.length; i++) {
      const handLabel = results.handednesses[i][0].displayName; 
      const lmList    = results.landmarks[i];

      // compute palm-center screen pos
      let sx = 0, sy = 0, sz = 0;
      PALM_INDICES.forEach(idx => {
        sx += lmList[idx].x;
        sy += lmList[idx].y;
        sz += (lmList[idx].z || 0);
      });
      const n = PALM_INDICES.length;
      const avgNdc = { x: sx/n, y: sy/n, z: sz/n };
      const palmPos = toScreen(avgNdc);

      if (handLabel === "Left") {
        sawLeft = true;
        // feed everything through as before:
        const gesture = results.gestures[i][0].categoryName;
        if (gesture === "Closed_Fist") {
          gestureCallback({ hand: "Left",  gesture: "Closed_Fist", pos: palmPos });
        }
        else if (gesture === "Victory") {
          gestureCallback({ hand: "Left",  gesture: "Victory",     pos: palmPos });
        }
        else {
          gestureCallback({ hand: "Left",  gesture: "None",        pos: palmPos });
        }
      }
      else if (handLabel === "Right") {
        const gesture = results.gestures[i][0].categoryName;

        // compute the same palm-center you use for Left
        let sx = 0, sy = 0, sz = 0;
        PALM_INDICES.forEach(idx => {
          sx += lmList[idx].x;
          sy += lmList[idx].y;
          sz += (lmList[idx].z || 0);
        });
        const n = PALM_INDICES.length;
        const avgNdc = { x: sx/n, y: sy/n, z: sz/n };
        const palmPos = toScreen(avgNdc);
      
        if (gesture === "Closed_Fist") {
          const wristLm = lmList[0];
          const screenPos = toScreen(wristLm);
          const worldZ    = wristLm.z;        // normalized depth, negative = toward camera
          
          gestureCallback({
            hand:    "Right",
            gesture: gesture === "Closed_Fist" ? "Closed_Fist" : "None",
            pos:     gesture === "Closed_Fist"
                     ? { x: screenPos.x, y: screenPos.y, z: worldZ }
                     : null
          });
        } else {
          // any other RH gesture just stops interaction
          gestureCallback({
            hand:    "Right",
            gesture: "None",
            pos:     null
          });
        }
      }

    }

    if (!sawLeft) {
      gestureCallback({ hand: "Left", gesture: "None", pos: null });
    }
  }
}
