import { useState, useRef, useEffect } from "react";

export default function InteractiveCanvas() {
  const canvasRef = useRef(null);
  const [tool, setTool] = useState("waterTable");
  const [lines, setLines] = useState([]);
  const [currentLine, setCurrentLine] = useState([]);

  // Dibuja fondo e interacciones
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibuja imagen base del acuífero (puedes reemplazar el link si lo guardas local)
    const baseImg = new Image();
    baseImg.src = "https://books.gw-project.org/conceptual-and-visual-understanding-of-hydraulic-head-and-groundwater-flow/wp-content/uploads/sites/14/2020/12/image33.png";
    baseImg.onload = () => {
      ctx.drawImage(baseImg, 0, 0, canvas.width, canvas.height);

      // Dibuja las líneas guardadas
      for (const l of lines) {
        ctx.beginPath();
        ctx.moveTo(l.points[0].x, l.points[0].y);
        for (const p of l.points.slice(1)) ctx.lineTo(p.x, p.y);
        ctx.strokeStyle =
          l.type === "waterTable"
            ? "#1E90FF"
            : l.type === "equipotential"
            ? "#FFD700"
            : "#00C853";
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }
    };
  }, [lines]);

  // Eventos del dibujo
  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    setCurrentLine([{ x: e.clientX - rect.left, y: e.clientY - rect.top }]);
  };

  const handleMouseMove = (e) => {
    if (!currentLine.length) return;
    const rect = canvasRef.current.getBoundingClientRect();
    setCurrentLine((prev) => [
      ...prev,
      { x: e.clientX - rect.left, y: e.clientY - rect.top },
    ]);
  };

  const handleMouseUp = () => {
    if (currentLine.length > 1) {
      setLines((prev) => [...prev, { type: tool, points: currentLine }]);
    }
    setCurrentLine([]);
  };

  const clearCanvas = () => setLines([]);

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex space-x-3">
        <button
          onClick={() => setTool("waterTable")}
          className={`px-3 py-1 rounded-lg border ${
            tool === "waterTable"
              ? "bg-blue-500 text-white"
              : "bg-white text-blue-500 border-blue-500"
          }`}
        >
          Línea freática
        </button>
        <button
          onClick={() => setTool("equipotential")}
          className={`px-3 py-1 rounded-lg border ${
            tool === "equipotential"
              ? "bg-yellow-400 text-white"
              : "bg-white text-yellow-500 border-yellow-400"
          }`}
        >
          Equipotencial (70–80 m)
        </button>
        <button
          onClick={() => setTool("flowLine")}
          className={`px-3 py-1 rounded-lg border ${
            tool === "flowLine"
              ? "bg-green-500 text-white"
              : "bg-white text-green-500 border-green-500"
          }`}
        >
          Línea de flujo
        </button>
        <button
          onClick={clearCanvas}
          className="px-3 py-1 rounded-lg border border-gray-400 text-gray-600 hover:bg-gray-100"
        >
          Limpiar
        </button>
      </div>

      <canvas
        ref={canvasRef}
        width={700}
        height={400}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="border border-gray-300 rounded-lg shadow-md cursor-crosshair bg-white"
      />
    </div>
  );
}
