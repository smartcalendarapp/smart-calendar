// blackboard.js

// ————————— Constants —————————
const DRAW_END_DELAY      = 100;    // ms before lifting pen
const DRAW_PLANE_DISTANCE = 5;      // how far out we project drawing
const PAN_END_DELAY       = 100;    // ms grace before stopping pan/rotate

// Eraser settings
const ERASER_PIXEL_RADIUS = 15;     // hit radius in screen pixels
const ERASER_RADIUS       = 0.1;    // cube size in world units

// Stroke smoothing
const SMOOTH_DRAW_ALPHA   = 0.85;

// Right‐hand smoothing & dolly
const RH_SMOOTH_ALPHA     = 0.5;
const DOLLY_SCALE         = 0.0175;

// ————————— State —————————
let drawEndTimer  = null;
let rightEndTimer = null;
let isDrawing     = false;
let lastDrawPos   = null;

let lastRightPos  = null;
let smoothedRH    = null;

const strokes     = [];
let currentStroke = null;

// ————————— Three.js Setup —————————
const canvas   = document.getElementById("threeCanvas");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

const scene    = new THREE.Scene();
scene.background = new THREE.Color(0x1f3b2e);

const camera   = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 2, 10);

scene.add(new THREE.AmbientLight(0x888888));
const light = new THREE.PointLight(0xffffff, 0.8);
light.position.set(0, 10, 10);
scene.add(light);

// ————— Blackboard + Grid Texture —————
const boardSize = 100;
const canvasGrid = document.createElement("canvas");
canvasGrid.width = canvasGrid.height = 512;
const ctx = canvasGrid.getContext("2d");
ctx.strokeStyle = "rgba(255,255,255,0.1)";
ctx.lineWidth = 2;
const step = 512 / 10;
for (let i = 0; i <= 10; i++) {
  ctx.beginPath();
  ctx.moveTo(i * step, 0);
  ctx.lineTo(i * step, 512);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, i * step);
  ctx.lineTo(512, i * step);
  ctx.stroke();
}
const gridTex = new THREE.CanvasTexture(canvasGrid);
gridTex.wrapS = gridTex.wrapT = THREE.RepeatWrapping;
gridTex.repeat.set(boardSize / 10, boardSize / 10);

const boardGeo = new THREE.PlaneGeometry(boardSize, boardSize);
const boardMat = new THREE.MeshPhongMaterial({
  color: 0x1f3b2e,
  map: gridTex,
  side: THREE.DoubleSide,
  shininess: 5,
});
const board = new THREE.Mesh(boardGeo, boardMat);
board.rotation.x = -Math.PI / 2;
board.position.y = -1;
scene.add(board);

// ————— Eraser & Hover Cursors —————
const eraserCursor = new THREE.Mesh(
  new THREE.BoxGeometry(ERASER_RADIUS * 2, ERASER_RADIUS * 2, ERASER_RADIUS * 2),
  new THREE.MeshBasicMaterial({ color: 0xffffff, opacity: 0.5, transparent: true })
);
eraserCursor.visible = false;
scene.add(eraserCursor);

const hoverCursor = new THREE.Mesh(
  new THREE.SphereGeometry(0.03, 8, 8),
  new THREE.MeshBasicMaterial({ color: 0xffffff, opacity: 0.8, transparent: true })
);
hoverCursor.visible = false;
scene.add(hoverCursor);

// ————— Line Material —————
const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 1 });

// ————— Persistence —————
function saveStrokes() {
  const data = strokes.map(s => s.points);
  localStorage.setItem("savedStrokes", JSON.stringify(data));
}
function loadStrokes() {
  const json = localStorage.getItem("savedStrokes");
  if (!json) return;
  try {
    JSON.parse(json).forEach(pointsArray => {
      const geom = new THREE.BufferGeometry();
      geom.setAttribute("position", new THREE.Float32BufferAttribute(pointsArray, 3));
      const line = new THREE.Line(geom, lineMaterial);
      scene.add(line);
      strokes.push({ points: pointsArray, geometry: geom, line });
    });
  } catch (e) {
    console.error("loadStrokes failed:", e);
  }
}

// ————— Helpers —————
function screenToWorld(pos) {
  const ndc = new THREE.Vector3(
    (pos.x / window.innerWidth) * 2 - 1,
    -(pos.y / window.innerHeight) * 2 + 1,
    0.5
  ).unproject(camera);
  const dir = ndc.sub(camera.position).normalize();
  return camera.position.clone().add(dir.multiplyScalar(DRAW_PLANE_DISTANCE));
}

function rebuildStroke(stroke) {
  const attr = new THREE.Float32BufferAttribute(stroke.points, 3);
  stroke.geometry.setAttribute("position", attr);
  stroke.geometry.attributes.position.needsUpdate = true;
}

// 2D-eraser: test every point in screen space
function eraseTouchedLines2D(screenPos) {
  const v = new THREE.Vector3();
  const w = window.innerWidth, h = window.innerHeight;
  for (let i = strokes.length - 1; i >= 0; i--) {
    const stroke = strokes[i];
    const pts = stroke.points;
    let hit = false;

    for (let j = 0; j < pts.length; j += 3) {
      v.set(pts[j], pts[j+1], pts[j+2]);
      v.project(camera);

      // skip any point that doesn't lie in front of the camera &
      // whose NDC x/y would show on screen
      if (v.z < -1 || v.z > 1 || v.x < -1 || v.x > 1 || v.y < -1 || v.y > 1) {
        continue;
      }

      // convert to actual pixel coords
      const x = (v.x * 0.5 + 0.5) * w;
      const y = ( -v.y * 0.5 + 0.5) * h;

      const dx = x - screenPos.x;
      const dy = y - screenPos.y;
      if (dx*dx + dy*dy <= ERASER_PIXEL_RADIUS * ERASER_PIXEL_RADIUS) {
        hit = true;
        break;
      }
    }

    if (hit) {
      scene.remove(stroke.line);
      stroke.geometry.dispose();
      strokes.splice(i, 1);
    }
  }
  saveStrokes();
}


// ————— Drawing —————
function addDrawPoint(pos) {
  const world = screenToWorld(pos);
  const drawPos = lastDrawPos
    ? lastDrawPos.clone().lerp(world, SMOOTH_DRAW_ALPHA)
    : world.clone();
  lastDrawPos = drawPos.clone();

  if (!currentStroke) {
    currentStroke = { points: [] };
    currentStroke.geometry = new THREE.BufferGeometry();
    currentStroke.points.push(drawPos.x, drawPos.y, drawPos.z);
    currentStroke.geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(currentStroke.points, 3)
    );
    currentStroke.line = new THREE.Line(currentStroke.geometry, lineMaterial);
    scene.add(currentStroke.line);
  } else {
    currentStroke.points.push(drawPos.x, drawPos.y, drawPos.z);
    rebuildStroke(currentStroke);
  }
}

function endStroke() {
  if (currentStroke) {
    strokes.push(currentStroke);
    currentStroke = null;
    lastDrawPos = null;
    saveStrokes();
  }
}

// ————— Camera Control —————

function rotateCamera(dx, dy) {
  const s = 0.003;
  if(dx < 0.5 && dx > -0.5) dx = 0;

  camera.rotation.y -= dx * s;
  camera.rotation.x -= dy * s;
}

// ————— Animate & Setup —————
loadStrokes();
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
});
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

// ————— Gesture Callback —————
function handleGesture(data) {
  if (data.hand === "Left") {
    const g = data.gesture;

    // Erase on Victory with pure 2D test
    if (g === "Victory" && data.pos) {
      eraseTouchedLines2D(data.pos);
      const worldPos = screenToWorld(data.pos);
      eraserCursor.position.copy(worldPos);
      eraserCursor.visible = true;
      hoverCursor.visible  = false;
      return;
    }
    eraserCursor.visible = false;

    // Hover
    if (data.pos) {
      hoverCursor.position.copy(screenToWorld(data.pos));
      hoverCursor.visible = true;
    } else {
      hoverCursor.visible = false;
    }

    // Draw on Closed_Fist
    if (g === "Closed_Fist") {
      if (drawEndTimer) { clearTimeout(drawEndTimer); drawEndTimer = null; }
      if (!isDrawing) { endStroke(); isDrawing = true; }
      addDrawPoint(data.pos);
    } else {
      if (isDrawing && !drawEndTimer) {
        drawEndTimer = setTimeout(() => {
          endStroke();
          isDrawing = false;
          drawEndTimer = null;
        }, DRAW_END_DELAY);
      }
    }
  }

  if (data.hand === "Right") {
    const isFist = data.gesture === "Closed_Fist" && data.pos;
    if (isFist) {
      if (!smoothedRH) smoothedRH = { x:data.pos.x, y:data.pos.y };
      smoothedRH.x += (data.pos.x - smoothedRH.x) * RH_SMOOTH_ALPHA;
      smoothedRH.y += (data.pos.y - smoothedRH.y) * RH_SMOOTH_ALPHA;

      if (lastRightPos) {
        let dx = smoothedRH.x - lastRightPos.x;
        let dy = smoothedRH.y - lastRightPos.y;
        rotateCamera(-dx, 0);
        if(dy < 0.5 && dy > -0.5) dy = 0;
        camera.translateZ(-dy * DOLLY_SCALE);
      }
      lastRightPos = { x:smoothedRH.x, y:smoothedRH.y };

      if (rightEndTimer) { clearTimeout(rightEndTimer); rightEndTimer = null; }
    } else if (!rightEndTimer) {
      rightEndTimer = setTimeout(() => {
        lastRightPos = null;
        smoothedRH   = null;
        rightEndTimer = null;
      }, PAN_END_DELAY);
    }
  }
}

// Initialize gesture module (already in your environment)
window.addEventListener("load", () => {
  import("./blackboardgesture.js")
    .then(mod => mod.initGesture(handleGesture))
    .catch(console.error);
});
