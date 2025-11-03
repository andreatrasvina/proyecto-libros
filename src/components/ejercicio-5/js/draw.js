function initCanvas() {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  function resizeAndDraw() {
    const container = canvas.parentElement;
    const size = Math.min(container.clientWidth, container.clientHeight);

    canvas.width = size;
    canvas.height = size;

    draw();
  }



  function drawTerrain(size) {

    ctx.strokeStyle = '#432004';
    ctx.lineWidth = Math.max(0.1, size * 0.01);
    ctx.lineCap = 'round';

    ctx.beginPath();
    ctx.moveTo(size * 0, size * 0.3);

    ctx.quadraticCurveTo(
      size * 0.5, size * 0.3,
      size, size * 0.6
    );

    ctx.stroke();
  }

  function drawGroundParticles(size) {
    const particleCount = 250;
    const particleSize = 2;
    const minDistance = size * 0.03;

    ctx.fillStyle = '#432004';

    const particles = [];

    function getTerrainY(x) {
      const startY = size * 0.3;
      const controlY = size * 0.3;
      const endY = size * 0.6;

      const t = x / size;
      const y = Math.pow(1 - t, 2) * startY +
        2 * (1 - t) * t * controlY +
        Math.pow(t, 2) * endY;
      return y;
    }

    function isTooClose(newX, newY) {
      for (const particle of particles) {
        const distance = Math.sqrt(
          Math.pow(newX - particle.x, 2) +
          Math.pow(newY - particle.y, 2)
        );
        if (distance < minDistance) {
          return true;
        }
      }
      return false;
    }

    for (let i = 0; i < particleCount; i++) {
      let attempts = 0;
      let placed = false;

      while (!placed && attempts < 100) {
        const x = Math.random() * size;

        const minY = getTerrainY(x);

        const y = minY + Math.random() * (size - minY);

        if (!isTooClose(x, y)) {
          particles.push({ x, y });
          placed = true;
        }

        attempts++;
      }
    }

    for (const particle of particles) {
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particleSize, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawFreaticLevel(size) {

    ctx.fillStyle = 'rgba(80, 162, 255, 0.3)';

    ctx.beginPath();

    ctx.moveTo(size * 0, size * 0.4);


    ctx.quadraticCurveTo(
      size * 0.5, size * 0.4,
      size, size * 0.7
    );

    ctx.lineTo(size, size);
    ctx.lineTo(0, size);
    ctx.lineTo(size * 0, size * 0.4);

    ctx.fill();

    ctx.strokeStyle = '#50a2ff';
    ctx.lineWidth = Math.max(0.1, size * 0.01);
    ctx.lineCap = 'round';

    ctx.beginPath();
    ctx.moveTo(size * 0, size * 0.4);

    ctx.quadraticCurveTo(
      size * 0.5, size * 0.4,
      size, size * 0.7
    );

    ctx.stroke();
  }

  function drawPotentiometricContours(size) {
    ctx.strokeStyle = 'Black';
    ctx.lineWidth = Math.max(0.5, size * 0.003);
    ctx.setLineDash([size * 0.01, size * 0.005]);
    ctx.lineCap = 'round';
    ctx.textAlign = 'center';

    const contours = [
      { level: -120, x: size * 0.1 },
      { level: -110, x: size * 0.25 },
      { level: -100, x: size * 0.4 },
      { level: -95, x: size * 0.525 },
      { level: -90, x: size * 0.65 },
      { level: -80, x: size * 0.8 },
      { level: -70, x: size * 0.95 }
    ];

    function getFreaticY(x) {
      const t = x / size;
      const y = Math.pow(1 - t, 2) * (size * 0.4) +
        2 * (1 - t) * t * (size * 0.4) +
        Math.pow(t, 2) * (size * 0.7);
      return y;
    }
    function drawTextWithBackground(text, x, y, fontSize) {
      ctx.font = `${fontSize}px Arial`;
      const textMetrics = ctx.measureText(text);
      const textWidth = textMetrics.width;
      const textHeight = fontSize;

      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      const padding = fontSize * 0.3;
      ctx.fillRect(
        x - textWidth / 2 - padding,
        y - textHeight - padding + 50,
        textWidth + padding * 2,
        textHeight + padding * 2
      );

      ctx.strokeStyle = 'Black';
      ctx.lineWidth = 1;
      ctx.strokeRect(
        x - textWidth / 2 - padding,
        y - textHeight - padding + 50,
        textWidth + padding * 2,
        textHeight + padding * 2
      );

      ctx.fillStyle = 'Black';
      ctx.fillText(text, x, y + 50);
    }

    contours.forEach(contour => {
      ctx.beginPath();

      const yPosition = size * 0.3 + ((contour.level + 120) / 50) * size * 0.3;

      const freaticY = getFreaticY(contour.x);

      const finalY = Math.min(yPosition, freaticY - size * 0.02);

      ctx.moveTo(contour.x, size);
      ctx.lineTo(contour.x, finalY+45);
      ctx.stroke();

      ctx.fillStyle = 'Black';
      ctx.beginPath();
      ctx.arc(contour.x, finalY, Math.max(2, size * 0.005), 0, Math.PI * 2);
      ctx.fill();

      const fontSize = Math.max(10, size * 0.02);
      drawTextWithBackground(`${contour.level} m`, contour.x, finalY - size * 0.02, fontSize);
    });

    ctx.setLineDash([]);
    ctx.textAlign = 'left';
  }

  function draw() {
    const size = canvas.width;
    ctx.clearRect(0, 0, size, size);

    drawTerrain(size);
    drawFreaticLevel(size);
    drawGroundParticles(size);
    drawPotentiometricContours(size);
  }

  window.addEventListener('resize', resizeAndDraw);
  resizeAndDraw();
}

document.addEventListener('DOMContentLoaded', initCanvas);