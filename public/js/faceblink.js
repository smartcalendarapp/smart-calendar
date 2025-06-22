import vision from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3";
const { FaceLandmarker, FilesetResolver } = vision;

/* exported callbacks */
let blinkCallback = () => {};
let toggleCB      = () => {};

/* state */
let lm=null, running=false;
const vid = Object.assign(document.createElement('video'),
                          {autoplay:true,playsInline:true});
vid.style.display='none'; document.body.appendChild(vid);

let stream=null;
let lastInfer = 0;
const INFER_MS = 100;      /* 10 fps */

/* load once */
(async()=>{
  const fsr = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm");
  lm = await FaceLandmarker.createFromOptions(fsr,{
    baseOptions:{modelAssetPath:
      "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
      delegate:"GPU"},
    outputFaceBlendshapes:true,runningMode:"VIDEO",numFaces:1
  });
  document.dispatchEvent(new Event('FaceBlinkReady'));
})();

/* main RAF */
function tick(){
  if(running && lm && vid.readyState>=2 && vid.videoWidth){
    const now = performance.now();
    if(now-lastInfer >= INFER_MS){
      lastInfer = now;
      try{
        const r = lm.detectForVideo(vid, now);
        r.faceBlendshapes?.[0]?.categories && blinkCallback(r.faceBlendshapes[0].categories);
      }catch(e){
        console.warn('skip frame:', e.message);
      }
    }
  }
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);

/* controls */
async function on(){
  if(running) return;
  stream = await navigator.mediaDevices.getUserMedia({video:true});
  vid.srcObject=stream;
  running=true;  lastInfer=0;
  toggleCB(true,false);
}
function off(force){
  if(!running) return;
  running=false;
  stream?.getTracks().forEach(t=>t.stop());
  stream=null;
  toggleCB(false, !!force);
}
function toggle(){ running? off(true): on(true); }

window.FaceBlink={
  setBlinkCallback:cb=>blinkCallback=cb,
  setToggleStateCallback:cb=>toggleCB=cb,
  turnOnBlinkRecognition:on,
  turnOffBlinkRecognition:off,
  toggleBlinkRecognition:toggle
};
