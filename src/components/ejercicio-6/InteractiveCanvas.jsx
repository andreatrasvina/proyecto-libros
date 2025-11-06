// src/components/ejercicio6/InteractiveCanvas.jsx
import { useRef, useState, useEffect } from "react";

export default function InteractiveCanvas() {
  const canvasRef = useRef(null);
  const [waterTablePoints, setWaterTablePoints] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  // Parámetros del acuífero basados en el problema
  const aquiferParams = {
    wellA: { x: 100, y: 180, head: 80, label: "A" },
    wellB: { x: 600, y: 280, head: 70, label: "B" },
    river: { y: 350, head: 65 }
  };

  // Dibujo principal del canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    
    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Dibujar fondo y elementos estáticos
    drawStaticElements(ctx, canvas.width, canvas.height);
    
    // Dibujar tabla de agua si existe
    if (waterTablePoints.length > 0) {
      drawWaterTable(ctx, waterTablePoints);
    }
    
    // Dibujar solución si está activa
    if (showSolution) {
      drawEquipotentialLines(ctx, canvas.width, canvas.height);
      drawFlowLines(ctx, canvas.width, canvas.height);
    }
    
    // Dibujar pozos y río
    drawWellsAndRiver(ctx, aquiferParams);
    
  }, [waterTablePoints, showSolution]);

  // Dibujar elementos estáticos
  const drawStaticElements = (ctx, width, height) => {
    // Fondo del acuífero
    ctx.fillStyle = "#e8f4f8";
    ctx.fillRect(0, 0, width, height);
    
    // Superficie del terreno
    ctx.beginPath();
    ctx.moveTo(0, 100);
    ctx.lineTo(width, 100);
    ctx.strokeStyle = "#8B4513";
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Río en la parte inferior
    ctx.fillStyle = "#4a90e2";
    ctx.fillRect(0, height - 50, width, 50);
    
    // Texto del río
    ctx.fillStyle = "#ffffff";
    ctx.font = "14px Arial";
    ctx.fillText("Río (65 m)", 10, height - 20);
  };

  // Dibujar tabla de agua
  const drawWaterTable = (ctx, points) => {
    if (points.length < 2) return;
    
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    
    // Suavizar la curva
    for (let i = 1; i < points.length; i++) {
      const prevPoint = points[i - 1];
      const currentPoint = points[i];
      
      // Curva bezier para suavizado
      const cpX = (prevPoint.x + currentPoint.x) / 2;
      ctx.quadraticCurveTo(cpX, prevPoint.y, currentPoint.x, currentPoint.y);
    }
    
    ctx.strokeStyle = "#0077b6";
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Relleno azul claro sobre la tabla de agua
    ctx.lineTo(canvasRef.current.width, canvasRef.current.height);
    ctx.lineTo(0, canvasRef.current.height);
    ctx.closePath();
    ctx.fillStyle = "rgba(173, 216, 230, 0.3)";
    ctx.fill();
  };

  // Dibujar líneas equipotenciales
  const drawEquipotentialLines = (ctx, width, height) => {
    const equipotentialLevels = [70, 75, 80];
    const colors = ["#ff6b6b", "#51cf66", "#339af0"];
    
    equipotentialLevels.forEach((level, index) => {
      ctx.beginPath();
      ctx.strokeStyle = colors[index];
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      
      const yPosition = height - 50 - (level - 65) * 5; // Escala aproximada
      
      // Curva suavizada para equipotencial
      ctx.moveTo(50, yPosition);
      ctx.bezierCurveTo(
        width / 3, yPosition - 20,
        (2 * width) / 3, yPosition + 10,
        width - 50, yPosition
      );
      
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Etiqueta
      ctx.fillStyle = colors[index];
      ctx.font = "12px Arial";
      ctx.fillText(`${level} m`, width - 80, yPosition - 5);
    });
  };

  // Dibujar líneas de flujo
  const drawFlowLines = (ctx, width, height) => {
    ctx.strokeStyle = "rgba(0, 100, 200, 0.6)";
    ctx.lineWidth = 1.5;
    
    // Varias líneas de flujo perpendiculares a equipotenciales
    for (let i = 1; i <= 4; i++) {
      const startX = 100 + (i * 120);
      
      ctx.beginPath();
      ctx.moveTo(startX, 150);
      
      // Trayectoria curva hacia el río
      ctx.bezierCurveTo(
        startX + 50, 200,
        startX - 30, 280,
        startX, height - 50
      );
      
      ctx.stroke();
      
      // Flecha indicando dirección
      drawArrow(ctx, startX, height - 60, Math.PI / 2, 8);
    }
  };

  // Dibujar flecha
  const drawArrow = (ctx, x, y, angle, size) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-size, -size);
    ctx.moveTo(0, 0);
    ctx.lineTo(size, -size);
    ctx.strokeStyle = "rgba(0, 100, 200, 0.8)";
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.restore();
  };

  // Dibujar pozos y río
  const drawWellsAndRiver = (ctx, params) => {
    // Pozos
    [params.wellA, params.wellB].forEach(well => {
      // Tubo del pozo
      ctx.fillStyle = "#666";
      ctx.fillRect(well.x - 8, 100, 16, well.y - 100);
      
      // Cabeza hidráulica en el pozo
      ctx.fillStyle = "#0077b6";
      const waterHeight = well.y - 20;
      ctx.fillRect(well.x - 6, waterHeight, 12, 20);
      
      // Etiqueta del pozo
      ctx.fillStyle = "#000";
      ctx.font = "bold 14px Arial";
      ctx.fillText(well.label, well.x - 5, 90);
      ctx.fillText(`${well.head} m`, well.x - 15, waterHeight - 5);
    });
  };

  // Manejar clics para dibujar tabla de agua
  const handleCanvasClick = (e) => {
    if (showSolution) return; // No dibujar cuando la solución está visible
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Solo permitir dibujar entre los pozos
    if (x >= aquiferParams.wellA.x && x <= aquiferParams.wellB.x && y > 150 && y < 320) {
      setWaterTablePoints(prev => [...prev, { x, y }]);
    }
  };

  // Reiniciar ejercicio
  const resetExercise = () => {
    setWaterTablePoints([]);
    setShowSolution(false);
  };

  // Mostrar solución
  const showFullSolution = () => {
    if (waterTablePoints.length >= 2) {
      setShowSolution(true);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <div className="text-center">
        <h3 className="text-xl font-bold text-blue-800 mb-2">
          Ejercicio 6 - Flujo en Acuífero No Confinado
        </h3>
        <p className="text-gray-600 mb-4">
          a) Dibuje la tabla de agua haciendo clic entre los pozos A y B<br />
          b) Las líneas equipotenciales (70m, 75m, 80m) y líneas de flujo se mostrarán automáticamente
        </p>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={700}
          height={400}
          onClick={handleCanvasClick}
          className="border-2 border-gray-300 rounded-lg shadow-lg cursor-crosshair bg-white"
        />
        
        {/* Indicador de modo */}
        <div className="absolute top-2 left-2 bg-blue-100 border border-blue-300 rounded px-3 py-1 text-sm">
          {showSolution ? " Solución Visible" : " Modo Dibujo"}
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={resetExercise}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Reiniciar Ejercicio
        </button>
        
        <button
          onClick={showFullSolution}
          disabled={waterTablePoints.length < 2}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 transition"
        >
          Mostrar Solución Completa
        </button>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-gray-700 max-w-md">
        <h4 className="font-semibold text-blue-700 mb-2"> Instrucciones:</h4>
        <ul className="list-disc list-inside space-y-1">
          <li>Haga clic entre los pozos para dibujar la tabla de agua</li>
          <li>La tabla debe conectar el pozo A (80m) con el pozo B (70m)</li>
          <li>La curva debe descender suavemente hacia el río (65m)</li>
          <li>Haga clic en "Mostrar Solución" para ver equipotenciales y líneas de flujo</li>
        </ul>
      </div>

      {showSolution && (
        <div className="bg-green-50 border border-green-300 rounded-lg p-4 text-sm">
          <h4 className="font-semibold text-green-700 mb-2"> Solución Correcta:</h4>
          <p>Las líneas equipotenciales (punteadas) muestran puntos de igual cabeza hidráulica.</p>
          <p>Las líneas de flujo (azules) son perpendiculares a las equipotenciales y muestran la trayectoria del agua hacia el río.</p>
        </div>
      )}
    </div>
  );
}