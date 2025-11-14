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

  const meters = [120, 110, 100, 90, 80, 70]; // Niveles de agua en metros
  const waterLevelXs = [0.32, 0.478, 0.669, 0.80, 0.90, 0.955];
  waterLevelXs.forEach((xNorm, i) => {
    drawWaterLevelLine(ctx, waterTableCurve, meters[i], w, h, xNorm, "#000", 2);
  });

  wells.forEach(well => drawWell(ctx, well, w, h));
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
  ctx.lineWidth = 3;

  ctx.beginPath();
  ctx.moveTo(pts[0].x * w, pts[0].y * h);

  for (let i = 1; i < pts.length; i++) {
    ctx.lineTo(pts[i].x * w, pts[i].y * h);
  }

  ctx.stroke();

  ctx.lineWidth = 1;
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

// Dibuja una línea vertical desde el nivel del agua hasta la parte inferior del canvas para mostrar el nivel del agua
function drawWaterLevelLine(ctx, curve, metersValue, w, h, xNorm, color = "#000", lineWidth = 3) {
  const yNorm = getYOnCurve(curve, xNorm);
  if (yNorm == null) return;

  const x = xNorm * w;
  const y = yNorm * h;

  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;

  ctx.beginPath();
  ctx.moveTo(x, h);
  ctx.lineTo(x, y);
  ctx.stroke();

   const text = metersValue.toString();
  ctx.font = "14px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const paddingX = 6;
  const paddingY = 3;

  // Medidas del texto
  const metrics = ctx.measureText(text);
  const textWidth = metrics.width;
  const textHeight = 14; // tamaño aproximado de la fuente

  // Coordenadas del rectángulo
  const rectX = x - (textWidth / 2) - paddingX;
  const rectY = h*0.92;
  const rectW = textWidth + paddingX * 2;
  const rectH = textHeight + paddingY * 2;

  // Fondo blanco semitransparente
  ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
  ctx.fillRect(rectX, rectY, rectW, rectH);

  // Texto encima
  ctx.fillStyle = color;
  ctx.fillText(text, x, h*0.95);

  ctx.restore();
}

// Definicion y dibujo de los pozos
const wells = [
  {
    xNorm: 0.55,
    yNorm: 0.40,
    lengthNorm: 0.2,
    thickness: 10,  
    angleDeg: 0, 
    fill: "#ffffff",
    stroke: "#000000",
    waterColor: "#50a2ff"
  }
];

function drawWell(ctx, well, w, h) {
  const {
    xNorm,
    yNorm,
    lengthNorm,
    thickness,
    angleDeg = 0,
    fill,
    stroke,
    waterColor
  } = well;

  // --- 1. Definimos el pozo en coordenadas locales ---
  // Origen (0,0) = esquina INFERIOR IZQUIERDA (eje de giro)
  const baseX = xNorm * w;      // eje en X = borde izquierdo inferior
  const baseY = yNorm * h;      // fondo del pozo

  const height = lengthNorm * Math.min(w, h);
  const t = thickness;

  // Rectángulo sin rotar (local)
  const BL = { x: 0,   y: 0 };         // Bottom Left  (eje)
  const BR = { x: t,   y: 0 };         // Bottom Right
  const TL = { x: 0,   y: -height };   // Top Left
  const TR = { x: t,   y: -height };   // Top Right

  const rad = angleDeg * Math.PI / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  function rot(p) {
    return {
      x: baseX + p.x * cos - p.y * sin,
      y: baseY + p.x * sin + p.y * cos,
    };
  }

  // Pasar a coordenadas de canvas
  const BLw = rot(BL);
  const BRw = rot(BR);
  const TLw = rot(TL);
  const TRw = rot(TR);

  ctx.save();

  // === A) Tubo del pozo (blanco) ===
  ctx.fillStyle = fill;
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.moveTo(TLw.x, TLw.y);
  ctx.lineTo(TRw.x, TRw.y);
  ctx.lineTo(BRw.x, BRw.y);
  ctx.lineTo(BLw.x, BLw.y);
  ctx.closePath();
  ctx.fill();

  // === B) Agua dentro del pozo, con superficie HORIZONTAL ===
  const yNormWater = getYOnCurve(waterTableCurve, xNorm); // usamos x del borde izquierdo
  if (yNormWater != null) {
    const yWater = yNormWater * h;  // coordenada global de la superficie

    // Y mínimo y máximo dentro del tubo
    const wellTopY = Math.min(TLw.y, TRw.y);
    const wellBottomY = Math.max(BLw.y, BRw.y);

    // Si el agua está por debajo del fondo → no se ve
    if (yWater <= wellBottomY) {
      // Si el agua supera la boca, consideramos el tubo lleno:
      if (yWater <= wellTopY) {
        // Agua llena todo el tubo
        ctx.fillStyle = waterColor || "#50a2ff";
        ctx.globalAlpha = 0.6;
        ctx.beginPath();
        ctx.moveTo(TLw.x, TLw.y);
        ctx.lineTo(TRw.x, TRw.y);
        ctx.lineTo(BRw.x, BRw.y);
        ctx.lineTo(BLw.x, BLw.y);
        ctx.closePath();
        ctx.fill();
        ctx.globalAlpha = 1.0;
      } else {
        // Agua parcial: top horizontal en y = yWater
        // Intersecciones con paredes izquierda (TL-BL) y derecha (TR-BR)
        const tL = (yWater - BLw.y) / (TLw.y - BLw.y);
        const tR = (yWater - BRw.y) / (TRw.y - BRw.y);

        const waterTopLeft = {
          x: BLw.x + (TLw.x - BLw.x) * tL,
          y: yWater
        };

        const waterTopRight = {
          x: BRw.x + (TRw.x - BRw.x) * tR,
          y: yWater
        };

        // topRight.y === topLeft.y  ✅
        ctx.fillStyle = waterColor || "#50a2ff";
        ctx.globalAlpha = 0.6;

        ctx.beginPath();
        ctx.moveTo(waterTopLeft.x,  waterTopLeft.y);
        ctx.lineTo(waterTopRight.x, waterTopRight.y);
        ctx.lineTo(BRw.x,           BRw.y);
        ctx.lineTo(BLw.x,           BLw.y);
        ctx.closePath();
        ctx.fill();

        ctx.globalAlpha = 1.0;
      }
    }
  }

  // === C) Contorno del tubo por encima del agua ===
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(TLw.x, TLw.y);
  ctx.lineTo(TRw.x, TRw.y);
  ctx.lineTo(BRw.x, BRw.y);
  ctx.lineTo(BLw.x, BLw.y);
  ctx.closePath();
  ctx.stroke();

  // === D) Rayitas en el fondo (perpendiculares al pozo) ===
  const stripeLen = t * 0.8;
  const stripeGap = t * 0.4;

  // vector eje (de TL a BL)
  const axis = { x: BLw.x - TLw.x, y: BLw.y - TLw.y };
  const axisLen = Math.hypot(axis.x, axis.y) || 1;
  const ux = axis.x / axisLen;
  const uy = axis.y / axisLen;

  // normal para las rayas
  const nx = -uy;
  const ny =  ux;

  // centro del fondo (entre BL y BR)
  const baseCenter = { x: (BLw.x + BRw.x) / 2, y: (BLw.y + BRw.y) / 2 };

  for (let i = 0; i < 3; i++) {
    const d = (i + 1) * stripeGap;
    const cxStripe = baseCenter.x - ux * d;
    const cyStripe = baseCenter.y - uy * d;

    const sx1 = cxStripe - nx * (stripeLen / 2);
    const sy1 = cyStripe - ny * (stripeLen / 2);
    const sx2 = cxStripe + nx * (stripeLen / 2);
    const sy2 = cyStripe + ny * (stripeLen / 2);

    ctx.beginPath();
    ctx.moveTo(sx1, sy1);
    ctx.lineTo(sx2, sy2);
    ctx.stroke();
  }

  ctx.restore();
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
