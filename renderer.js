// ============================================================
//  Bagua Widget — Renderer
// ============================================================

console.log('Renderer loaded');

const canvas = document.getElementById('baguaCanvas');
const ctx = canvas.getContext('2d');

const rotator = document.getElementById('rotator');

// --- Configuration ---
const W = canvas.width;   // 200
const H = canvas.height;  // 200
const CX = W / 2;         // 100
const CY = H / 2;         // 100
const BG_R = 100;         // background circle radius
const YY_R = 61;          // Yin-Yang radius
const RING_INNER = 69;    // inner decorative ring
const RING_OUTER = 92;    // outer decorative ring
const TRIGRAM_R = 81;     // trigram placement radius

// Trigram line drawing config
const TRI_LINE_W = 16;     // full line width (px)
const TRI_LINE_H = 3;      // line height
const TRI_GAP = 3;         // gap between lines
const TRI_YIN_SEG = 6;     // yin segment width (half-line)
const TRI_YIN_GAP = 4;     // gap in broken line

// Trigram data: { pattern (1=yang solid, 0=yin broken, bottom→top), angle, name }
const trigrams = [
  { pattern: [1,0,1], angle: 0,   name: '离' },  // 12:00 top
  { pattern: [0,1,1], angle: 90,  name: '兑' },  //  3:00 right
  { pattern: [0,1,0], angle: 180, name: '坎' },  //  6:00 bottom
  { pattern: [0,0,1], angle: 270, name: '震' },  //  9:00 left
  { pattern: [1,1,0], angle: 315, name: '巽' },  // 10:30 upper-left
  { pattern: [0,0,0], angle: 45,  name: '坤' },  //  1:30 upper-right
  { pattern: [1,0,0], angle: 225, name: '艮' },  //  7:30 lower-left
  { pattern: [1,1,1], angle: 135, name: '乾' },  //  4:30 lower-right
];

// --- Helpers ---
function degToRad(deg) {
  return deg * Math.PI / 180;
}

function trigramPos(angleDeg) {
  const rad = degToRad(angleDeg);
  return {
    x: CX + TRIGRAM_R * Math.sin(rad),
    y: CY - TRIGRAM_R * Math.cos(rad),
  };
}

// --- Drawing Functions ---

function drawOuterRings() {
  // Antique bronze rings — flat, clean
  ctx.strokeStyle = '#8B7D6B';
  ctx.lineWidth = 1.2;

  // Inner thin ring
  ctx.beginPath();
  ctx.arc(CX, CY, RING_INNER, 0, Math.PI * 2);
  ctx.stroke();

  // Outer thin ring
  ctx.beginPath();
  ctx.arc(CX, CY, RING_OUTER, 0, Math.PI * 2);
  ctx.stroke();
}

function drawYinYang() {
  const R = YY_R;
  const r2 = R / 2;

  // --- Yang (ivory white) base circle ---
  ctx.beginPath();
  ctx.arc(CX, CY, R, 0, Math.PI * 2);
  ctx.fillStyle = '#FDFBF7';
  ctx.fill();

  // --- Yin (graphite black) left half ---
  ctx.beginPath();
  ctx.arc(CX, CY, R, Math.PI * 0.5, Math.PI * 1.5);
  ctx.fillStyle = '#3A3C3B';
  ctx.fill();

  // --- White circle at top (fish head — eats into black) ---
  ctx.beginPath();
  ctx.arc(CX, CY - r2, r2, 0, Math.PI * 2);
  ctx.fillStyle = '#FDFBF7';
  ctx.fill();

  // --- Black circle at bottom (fish head — extends into white) ---
  ctx.beginPath();
  ctx.arc(CX, CY + r2, r2, 0, Math.PI * 2);
  ctx.fillStyle = '#3A3C3B';
  ctx.fill();

  // --- Dots (eyes) ---
  const dotR = R * 0.12;

  // Black dot in upper white fish
  ctx.beginPath();
  ctx.arc(CX, CY - r2, dotR, 0, Math.PI * 2);
  ctx.fillStyle = '#3A3C3B';
  ctx.fill();

  // White dot in lower black fish
  ctx.beginPath();
  ctx.arc(CX, CY + r2, dotR, 0, Math.PI * 2);
  ctx.fillStyle = '#FDFBF7';
  ctx.fill();
}

function drawScurve() {
  // S-curve dividing line — antique bronze, like a bronze mirror edge
  const r2 = YY_R / 2;

  ctx.strokeStyle = '#8B7D6B';
  ctx.lineWidth = 1;

  // Upper arc: from top to center, bulges right (clockwise)
  ctx.beginPath();
  ctx.arc(CX, CY - r2, r2, -Math.PI / 2, Math.PI / 2, false);
  ctx.stroke();

  // Lower arc: from center to bottom, bulges left (counterclockwise)
  ctx.beginPath();
  ctx.arc(CX, CY + r2, r2, -Math.PI / 2, Math.PI / 2, true);
  ctx.stroke();
}

function drawTrigrams() {
  for (const t of trigrams) {
    const pos = trigramPos(t.angle);
    const angleRad = degToRad(t.angle);

    // Color: Kan is stone blue, others are ochre
    ctx.fillStyle = t.name === '坎' ? '#5B7B8A' : '#6B4E3D';

    ctx.save();
    ctx.translate(pos.x, pos.y);
    // Rotate so trigram faces outward (base toward center)
    ctx.rotate(angleRad);

    // Total trigram height for centering
    const totalH = 3 * TRI_LINE_H + 2 * TRI_GAP;
    const startY = -totalH / 2;

    for (let i = 0; i < 3; i++) {
      const y = startY + i * (TRI_LINE_H + TRI_GAP);

      if (t.pattern[i] === 1) {
        // Yang: solid line
        ctx.fillRect(-TRI_LINE_W / 2, y, TRI_LINE_W, TRI_LINE_H);
      } else {
        // Yin: broken line (two segments)
        const segW = TRI_YIN_SEG;
        const gap = TRI_YIN_GAP;
        ctx.fillRect(-TRI_LINE_W / 2, y, segW, TRI_LINE_H);
        ctx.fillRect(TRI_LINE_W / 2 - segW, y, segW, TRI_LINE_H);
      }
    }

    ctx.restore();
  }
}

function drawBackground() {
  // Warm rice-paper backdrop — flat, no gradient
  ctx.beginPath();
  ctx.arc(CX, CY, BG_R, 0, Math.PI * 2);
  ctx.fillStyle = '#F2EFE9';
  ctx.fill();
}

function drawBagua() {
  ctx.clearRect(0, 0, W, H);
  drawBackground();
  drawOuterRings();
  drawYinYang();
  drawTrigrams();
}

// --- Interaction ---

// Rotation state
let mode = 'off';             // 'off' | 'slow' | 'fast' | 'charging'
let rotationAngle = 0;
let rotationSpeed = 0;
const SPEED_SLOW = 30;        // deg/sec — ~12s per turn
const SPEED_FAST = 180;       // deg/sec — ~2s per turn
const ACCEL = 80;
const DECEL = 100;
const CHARGE_RATE = 120;      // deg/s² — speed added per second of holding
let targetSpeed = 0;
let chargeElapsed = 0;        // accumulated charge time in seconds
let lastFrameTime = null;
let animFrameId = null;

function animate(timestamp) {
  if (lastFrameTime === null) {
    lastFrameTime = timestamp;
    animFrameId = requestAnimationFrame(animate);
    return;
  }
  const dt = Math.min((timestamp - lastFrameTime) / 1000, 0.1);
  lastFrameTime = timestamp;

  if (mode === 'charging') {
    chargeElapsed += dt;
    targetSpeed = chargeElapsed * CHARGE_RATE; // no upper bound
    rotationSpeed = Math.min(rotationSpeed + ACCEL * dt * 2, targetSpeed);
  } else if (mode !== 'off') {
    rotationSpeed = Math.min(rotationSpeed + ACCEL * dt, targetSpeed);
  } else {
    rotationSpeed = Math.max(rotationSpeed - DECEL * dt, 0);
  }
  rotationAngle = (rotationAngle + rotationSpeed * dt) % 360;
  rotator.style.transform = `rotate(${rotationAngle}deg)`;

  if (rotationSpeed > 0 || mode !== 'off') {
    animFrameId = requestAnimationFrame(animate);
  } else {
    lastFrameTime = null;
    animFrameId = null;
  }
}

function startAnimation() {
  if (!animFrameId) {
    lastFrameTime = null;
    animFrameId = requestAnimationFrame(animate);
  }
}

function setMode(newMode) {
  mode = newMode;
  if (mode === 'slow') { targetSpeed = SPEED_SLOW; chargeElapsed = 0; }
  else if (mode === 'fast') { targetSpeed = SPEED_FAST; chargeElapsed = 0; }
  else if (mode === 'charging') { chargeElapsed = 0; targetSpeed = 0; }
  else { targetSpeed = 0; chargeElapsed = 0; }
  startAnimation();
}

// --- Drag / Click / Double-click / Long-press ---
let dragStartX = null;
let dragStartY = null;
let hasDragged = false;
const DRAG_THRESHOLD = 3;
const LONG_PRESS_MS = 500;
const DOUBLE_CLICK_MS = 400;

let longPressTimer = null;
let singleClickTimer = null;
let pendingClick = false;

function clearTimers() {
  if (longPressTimer) { clearTimeout(longPressTimer); longPressTimer = null; }
  if (singleClickTimer) { clearTimeout(singleClickTimer); singleClickTimer = null; }
}

function onPointerDown(e) {
  dragStartX = e.screenX;
  dragStartY = e.screenY;
  hasDragged = false;
  pendingClick = true;
  widget.setPointerCapture(e.pointerId);
  widget.style.cursor = 'grabbing';

  // Long-press detection — hold to charge speed (no upper limit)
  clearTimers();
  longPressTimer = setTimeout(() => {
    longPressTimer = null;
    pendingClick = false;
    // Start charging — speed builds while holding
    setMode('charging');
  }, LONG_PRESS_MS);
}

function onPointerMove(e) {
  if (dragStartX === null) return;
  const dx = e.screenX - dragStartX;
  const dy = e.screenY - dragStartY;
  if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) {
    hasDragged = true;
    pendingClick = false;
    clearTimers();
    dragStartX = e.screenX;
    dragStartY = e.screenY;
    if (window.electronAPI) {
      window.electronAPI.moveWindow(Math.round(dx), Math.round(dy));
    }
  }
}

function onPointerUp(e) {
  widget.style.cursor = 'grab';
  dragStartX = null;
  dragStartY = null;

  // Cancel long-press timer (pointer lifted before threshold)
  if (longPressTimer) { clearTimeout(longPressTimer); longPressTimer = null; }

  if (hasDragged || !pendingClick) {
    pendingClick = false;
    return;
  }

  pendingClick = false;

  // Detect double-click vs single-click
  if (singleClickTimer) {
    // Second click within window → double-click
    clearTimeout(singleClickTimer);
    singleClickTimer = null;
    // Double-click: stop if spinning, otherwise fast
    setMode(mode === 'off' ? 'fast' : 'off');
  } else {
    // First click → wait to see if it's a double-click
    singleClickTimer = setTimeout(() => {
      singleClickTimer = null;
      // Single click: stop if spinning (any mode), otherwise slow
      setMode(mode === 'off' ? 'slow' : 'off');
    }, DOUBLE_CLICK_MS);
  }
}

// --- Init ---
drawBagua();
console.log('Bagua drawn, canvas:', !!canvas, 'widget:', !!document.getElementById('widget'), 'electronAPI:', !!window.electronAPI);

const widget = document.getElementById('widget');

widget.addEventListener('pointerdown', onPointerDown);
widget.addEventListener('pointermove', onPointerMove);
widget.addEventListener('pointerup', onPointerUp);

// --- Scale ---
const BASE_SIZE = 200;  // widget base size in px
let currentScale = 0.75;
applyScale(currentScale);

function applyScale(scale) {
  currentScale = scale;
  widget.style.transform = `translateX(-50%) scale(${currentScale})`;
  // Resize window to fit scaled widget
  const newSize = Math.round(BASE_SIZE * currentScale);
  if (window.electronAPI) {
    window.electronAPI.resizeWindow(newSize, newSize);
  }
}

// Ctrl + scroll wheel → resize
widget.addEventListener('wheel', (e) => {
  if (!e.ctrlKey) return;
  e.preventDefault();
  const delta = e.deltaY > 0 ? -0.05 : 0.05;
  const newScale = Math.max(0.4, Math.min(1.5, currentScale + delta));
  applyScale(newScale);
}, { passive: false });

// Right click — close app
widget.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  window.close();
});


