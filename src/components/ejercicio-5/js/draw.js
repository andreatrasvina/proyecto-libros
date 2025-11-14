const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const rect = canvas.getBoundingClientRect();
const dpr = window.devicePixelRatio || 1;
let width = rect.width * dpr;
let height = rect.height * dpr;

function resizeCanvas() {

  // Ajusta el tamaño interno del canvas a su tamaño en CSS * DPR
  canvas.width = width;
  canvas.height = height;

  // Corrige la escala para que las coordenadas estén en "CSS píxeles"
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  draw();
}

//Funcion principal del dibujado
function draw() {
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.width / dpr;
  const h = canvas.height / dpr;

  ctx.clearRect(0, 0, w, h);

  drawElevationAxis(ctx, elevationAxis); // Eje de elevacion

  fillBelowCurveDots(ctx, terrainCurve, w, h, "#432004", 1, 8); // Relleno con puntos bajo la superficie del terreno
  drawCurve(ctx, terrainCurve, w, h);         // superficie terreno

  fillBelowCurve(ctx, waterTableCurve, w, h, waterTableCurve.color); //Relleno del nivel freatico  
  drawCurve(ctx, waterTableCurve, w, h);    // nivel freatico
}

// Definición del eje de elevación
const elevationAxis = {
  x: width * 0.1,
  y: height - 10,
  height: height * 0.85,
  max: 140,
  step: 10
};

function drawElevationAxis(ctx, axis) {
  const { x, y, height, max, step } = axis;

  ctx.beginPath();
  ctx.moveTo(x, y - height);
  ctx.lineTo(x, y);
  ctx.stroke();

  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";
  ctx.font = "14px Arial";
  ctx.fillText("Elevation", x, y - height - 20);
  ctx.fillText("(ft)", x, y - height - 5);
  ctx.restore();

  ctx.font = "12px Arial";
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";

  const numSteps = max / step;
  const pxPerStep = height / numSteps;

  for (let i = 0; i <= numSteps; i++) {
    const value = i * step;
    const ty = y - i * pxPerStep;

    ctx.beginPath();
    ctx.moveTo(x, ty);
    ctx.lineTo(x + 10, ty);
    ctx.stroke();

    ctx.fillText(value.toString(), x - 5, ty);
  }
}

// Definicion de la curva de la superficie del terreno
const terrainCurve = {
  color: "#432004",
  points: [
    { x: 0.15, y: 0.15 },
    { x: 0.30, y: 0.19 },
    { x: 0.45, y: 0.25 },
    { x: 0.60, y: 0.29 },
    { x: 0.75, y: 0.35 },
    { x: 0.90, y: 0.44 },
    { x: 1.00, y: 0.55 }
  ]
};

// Definicion de la curva del nivel freático
const waterTableCurve = {
  color: "#50a2ff",
  points: [
    { x: 0.15, y: 0.20 },
    { x: 0.30, y: 0.24 },
    { x: 0.45, y: 0.30 },
    { x: 0.60, y: 0.34 },
    { x: 0.75, y: 0.40 },
    { x: 0.90, y: 0.49 },
    { x: 1.00, y: 0.60 }
  ]
};

//Funcion para dibujar curvas
function drawCurve(ctx, curve, w, h) {
  const pts = curve.points;
  if (!pts.length) return;
  ctx.strokeStyle = curve.color;

  ctx.beginPath();
  ctx.moveTo(pts[0].x * w, pts[0].y * h);

  for (let i = 1; i < pts.length; i++) {
    ctx.lineTo(pts[i].x * w, pts[i].y * h);
  }

  ctx.stroke();

  ctx.strokeStyle = "#000";
}

//Rellena el area bajo la curva con agua
function fillBelowCurve(ctx, curve, w, h, fillColor) {
  const pts = curve.points;
  if (!pts.length) return;

  ctx.beginPath();

  ctx.moveTo(pts[0].x * w, pts[0].y * h);

  for (let i = 1; i < pts.length; i++) {
    ctx.lineTo(pts[i].x * w, pts[i].y * h);
  }

  const lastX = pts[pts.length - 1].x * w;
  const firstX = pts[0].x * w;

  ctx.lineTo(lastX, h);
  ctx.lineTo(firstX, h);
  ctx.closePath();

  ctx.fillStyle = fillColor;
  ctx.globalAlpha = 0.25; 
  ctx.fill();
  ctx.globalAlpha = 1.0;
}

// Obtiene la coordenada Y normalizada en la curva para una X normalizada dada
function getYOnCurve(curve, xNorm) {
  const pts = curve.points;

  if (xNorm < pts[0].x || xNorm > pts[pts.length - 1].x) return null;

  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i];
    const p1 = pts[i + 1];

    if (xNorm >= p0.x && xNorm <= p1.x) {
      const t = (xNorm - p0.x) / (p1.x - p0.x);
      return p0.y + (p1.y - p0.y) * t;
    }
  }
  return null;
}

// Rellena con puntos el area bajo el nivel del terreno
function fillBelowCurveDots(ctx, curve, w, h, dotColor = "#666", dotRadius = 1.2, spacing = 10) {
  ctx.fillStyle = dotColor;

  for (let row = 0; ; row++) {
    const y = row * spacing;
    if (y > h) break;

    const offset = (row % 2) ? spacing / 2 : 0;

    for (let x = offset; x <= w; x += spacing) {
      const xNorm = x / w;
      const yNormCurve = getYOnCurve(curve, xNorm);
      if (yNormCurve == null) continue;

      const yCurve = yNormCurve * h;

      if (y >= yCurve) {
        ctx.beginPath();
        ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
