const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const scale = canvas.width / 100;

// Función auxiliar para dibujar curvas tipo SVG
function drawCurve(points, close=false) {
  ctx.beginPath();
  ctx.moveTo(points[0][0]*scale, points[0][1]*scale);
  for (let i = 1; i < points.length; i+=3) {
    if (points[i+2]) {
      ctx.bezierCurveTo(
        points[i][0]*scale, points[i][1]*scale,
        points[i+1][0]*scale, points[i+1][1]*scale,
        points[i+2][0]*scale, points[i+2][1]*scale
      );
    }
  }
  if (close) ctx.closePath();
  ctx.stroke();
}

// Fondo con puntos marrón
function drawPattern() {
  
}

// Terreno
function drawTerrain() {
  
}

// Nivel freático
function drawFreatico() {
  
}

// Pozo ejemplo
function drawWell() {
  
}

// Nivel de agua
function drawWater() {
  
}

// Niveles marcados (ejemplo: 120m)
function drawLevelText() {
  
}

// Dibujar todo
drawPattern();
drawTerrain();
drawFreatico();
drawWater();
drawWell();
drawLevelText();