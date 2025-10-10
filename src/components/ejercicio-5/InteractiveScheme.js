let valoresIniciales = {};


//scrip para el funcionamiento del switch
  const switchInput = document.getElementById(
    "switchInput"
  );
  const manualInputs = document.querySelectorAll(".manualInput");
  const dinamicInputs = document.querySelectorAll(".dinamicInput");

  // Función para transferir los valores entre los inputs
  function transferValues() {
    const grupos = document.querySelectorAll(".inputCont");

    grupos.forEach((grupo) => {
    const rangeInput = grupo.querySelector('input[type="range"]');
    const manualInput = grupo.querySelector(".manualInputs");
    const p = grupo.querySelector("p");

    if (rangeInput && manualInput) {
      if (switchInput.checked) {
        // Modo manual activado: pasar de range a manual
        manualInput.value = rangeInput.value;
      } else {
        // Modo manual desactivado: pasar de manual a range
        const manualValue = parseFloat(manualInput.value);
        if (!isNaN(manualValue) && manualValue >= 0 && manualValue <= 120) {
          rangeInput.value = manualInput.value;

          // Actualizar el contenido del <p> con o sin unidad
          if (p) {
            const tieneUnidad = p.textContent.trim().endsWith("m");
            p.textContent = tieneUnidad
              ? `${rangeInput.value} m`
              : rangeInput.value;
          }
        }
      }
    }
  });
  }


  switchInput?.addEventListener("change", () => {
    transferValues();
    
    if (switchInput.checked) {
      manualInputs.forEach((input) => input.classList.remove("hidden"));
      dinamicInputs.forEach((input) => input.classList.add("hidden"));
    } else {
      manualInputs.forEach((input) => input.classList.add("hidden"));
      dinamicInputs.forEach((input) => input.classList.remove("hidden"));
    }
    
    const valores = getWellValues();
    updateWell(valores);
  }, { passive: true });

  //Script para el funcionamiento de la actualizacion de los elemento p con el valor del input y respetando si son m
  const grupos = document.querySelectorAll(".inputCont");

  grupos.forEach((grupo) => {
    const input = grupo.querySelector(
      'input[type="range"]'
    );
    const p = grupo.querySelector("p");

    if (input && p) {
      const tieneUnidad = p.textContent.trim().endsWith("m");

      input.addEventListener(
        "input",
        () => {
          p.textContent = tieneUnidad ? `${input.value} m` : input.value;
        },
        { passive: true }
      );
    }
  });

  const confirmButton = document.getElementById(
    "confirmButton"
  );

  //Scrip para el funcionamiento del boton reset
  const resetButton = document.getElementById("reset-btn");
  if (resetButton) resetButton.addEventListener("click", resetValues);

  function resetValues() {
    const isManualMode = switchInput.checked;

    const {
      heightWell,
      widthWell,
      xPosWell,
      yPosWell,
      xExitWell,
    } = valoresIniciales;

    // Inputs manuales y dinámicos
    const manualInputs = document.querySelectorAll(".manualInputs");
    const rangeInputs = {
      heightWell: document.getElementById("heigthWell"),
      widthWell: document.getElementById("widthWell"),
      xPosWell: document.getElementById("xPosWell"),
      yPosWell: document.getElementById("yPosWell"),
      xExitWell: document.getElementById("xExitWell"),
    };
    // Restaurar valores según el modo
    if (isManualMode) {
      manualInputs[0].value = heightWell;
      manualInputs[1].value = widthWell;
      manualInputs[2].value = xPosWell;
      manualInputs[3].value = yPosWell;
      manualInputs[4].value = xExitWell;
    } else {
      rangeInputs.heightWell.value = heightWell;
      rangeInputs.widthWell.value = widthWell;
      rangeInputs.xPosWell.value = xPosWell;
      rangeInputs.yPosWell.value = yPosWell;
      rangeInputs.xExitWell.value = xExitWell;

      // Actualizar los <p> con los valores
      const pText = document.querySelectorAll(".dinamicText");
      pText[0].textContent = `${heightWell} m`;
      pText[1].textContent = `${widthWell} m`;
      pText[2].textContent = `${xPosWell}`;
      pText[3].textContent = `${yPosWell}`;
      pText[4].textContent = `${xExitWell}`;
    }

    // Actualizar el pozo con los valores restaurados
    updateWell(valoresIniciales);
    animateWater();
  }

  // Función para extraer los valores actuales de los inputs
  function getWellValues() {
    const heightWellRange = document.getElementById(
      "heigthWell"
    );
    const widthWellRange = document.getElementById(
      "widthWell"
    );
    const xPosWellRange = document.getElementById(
      "xPosWell"
    );
    const yPosWellRange = document.getElementById(
      "yPosWell"
    );
    const xExitWellRange = document.getElementById(
      "xExitWell"
    );

    const manualInputs = document.querySelectorAll(".manualInputs");
    const heightWellManual = manualInputs[0];
    const widthWellManual = manualInputs[1];
    const xPosWellManual = manualInputs[2];
    const yPosWellManual = manualInputs[3];
    const xExitWellManual = manualInputs[4];

    const isManualMode = switchInput.checked;

    const heightWell = isManualMode
      ? parseFloat(heightWellManual.value) || 0
      : parseFloat(heightWellRange.value) || 0;

    const widthWell = isManualMode
      ? parseFloat(widthWellManual.value) || 0
      : parseFloat(widthWellRange.value) || 0;

    const xPosWell = isManualMode
      ? parseFloat(xPosWellManual.value) || 0
      : parseFloat(xPosWellRange.value) || 0;

    const yPosWell = isManualMode
      ? parseFloat(yPosWellManual.value) || 0
      : parseFloat(yPosWellRange.value) || 0;

    const xExitWell = isManualMode
      ? parseFloat(xExitWellManual.value) || 0
      : parseFloat(xExitWellRange.value) || 0;

    console.log("Valores actuales del pozo:");
    console.log("Altura:", heightWell);
    console.log("Ancho:", widthWell);
    console.log("Posición X base:", xPosWell);
    console.log("Posición Y base:", yPosWell);
    console.log("Posición X salida:", xExitWell);

    return {
      heightWell,
      widthWell,
      xPosWell,
      yPosWell,
      xExitWell,
    };
  }

  // Escuchar cambios en los inputs range
  const rangeInputs = document.querySelectorAll('input[type="range"]');
  rangeInputs.forEach((input) => {
    input.addEventListener(
      "input",
      function () {
        console.log("Input range cambiado:", input.id);
        const valores = getWellValues();
        updateWell(valores);
      },
      { passive: true }
    );
  });

  if (confirmButton) {
    confirmButton.addEventListener("click", function (e) {
      e.preventDefault();

      const form = document.querySelector("form");

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      console.log("Botón confirmar presionado");
      const valores = getWellValues();
      updateWell(valores);
    });
  }

  let currentWaterY = null;

  function updateWell(valores) {
    console.log("Actualizando pozo con:", valores);

    const well = document.querySelector(".well");
    const cantidad = document.querySelector(".cantidad");
    const terrain = document.getElementById("terrain");
    const freatico = document.getElementById("freatico");
    const heightInput = document.getElementById("heigthWell");
    const isManualMode = switchInput.checked;

    cantidad.setAttribute("fill", "blue")

    if (!well || !cantidad || !terrain || !heightInput || !freatico) return;

    let { heightWell, widthWell, xPosWell, yPosWell, xExitWell } = valores;
    const angleRad = (-xExitWell * Math.PI) / 180;

    function getTerrainY(x) {
        const totalLength = terrain.getTotalLength();
        let closestPoint = terrain.getPointAtLength(0);
        let closestDistance = Math.abs(closestPoint.x - x);
        const steps = 500;
        for (let i = 1; i <= steps; i++) {
            const point = terrain.getPointAtLength((i / steps) * totalLength);
            const dist = Math.abs(point.x - x);
            if (dist < closestDistance) {
                closestDistance = dist;
                closestPoint = point;
            }
        }
        return closestPoint.y;
    }

    function getFreaticoY(x) {
        const totalLength = freatico.getTotalLength();
        let closestPoint = freatico.getPointAtLength(0);
        let closestDistance = Math.abs(closestPoint.x - x);
        const steps = 500;
        for (let i = 1; i <= steps; i++) {
            const point = freatico.getPointAtLength((i / steps) * totalLength);
            const dist = Math.abs(point.x - x);
            if (dist < closestDistance) {
                closestDistance = dist;
                closestPoint = point;
            }
        }
        return closestPoint.y;
    }

    // Coordenadas del pozo
    const x0 = xPosWell;
    const y0 = yPosWell;
    const w = widthWell;
    const h = heightWell;

    // Esquinas del pozo
    const x1 = x0 + w * Math.cos(angleRad);
    const y1 = y0 - w * Math.sin(angleRad);
    const x2 = x1 - h * Math.sin(angleRad);
    const y2 = y1 - h * Math.cos(angleRad);
    const x3 = x0 - h * Math.sin(angleRad);
    const y3 = y0 - h * Math.cos(angleRad);

    // Ajuste altura salida
    const terrainY = getTerrainY(x1);
    if (y2 > terrainY) {
      heightWell = (y0 - terrainY) / Math.cos(angleRad) + 10;
    }
    else if (y2 <= terrainY) {
      heightWell = (y0 - terrainY) / Math.cos(angleRad) + 10;
    }
    else if(y0 < currentWaterY){
      heightWell = heightWell - currentWaterY;
    }
    else if(y1 < 0)y1 = 0;
    if(heightWell < 10) heightWell = 10;
    if (!isManualMode) {
        heightInput.value = heightWell.toFixed(2);
        const p = heightInput.parentElement.querySelector("p.dinamicInput");
        if (p) p.textContent = `${Math.round(heightWell)} m`;
    }

    // Actualiza el pozo
    const dWell = `M${x0} ${y0} L${x1} ${y1} L${x2} ${y2} L${x3} ${y3} Z`;
    well.setAttribute("d", dWell);

    // 🔹 Nivel de agua
    const nivelFreaticoY = getFreaticoY(x0);
    if (currentWaterY === null) currentWaterY = y0;

    function animateWater() {
        const velocidad = 10;
        cantidad.setAttribute("fill", "rgb(51, 153, 255)")
        // Ajuste gradual del nivel del agua
        if (currentWaterY > nivelFreaticoY) {
            currentWaterY -= velocidad;
            if (currentWaterY < nivelFreaticoY) currentWaterY = nivelFreaticoY;
        } else {
            currentWaterY = nivelFreaticoY;
        }

        // Altura del agua perpendicular al pozo
        const waterHeight = y0 - currentWaterY;

        // Vértices inferiores del pozo
        const xb0 = x0;
        const yb0 = y0;
        const xb1 = x1;
        const yb1 = y1;

        // Proyección de la altura del agua según la inclinación del pozo
        const compensacion = angleRad * 5;
        const dx = waterHeight * Math.sin(angleRad);

        // Esquinas superiores del agua siguiendo la inclinación del pozo
        const xt0 = xb0 - dx - angleRad * 3;
        const xt1 = xb1 - dx - compensacion;

        if (yb0 < currentWaterY || yb1 < currentWaterY) {
        cantidad.setAttribute("fill", "transparent")
        return;
    }
        // Actualiza línea que conecta nivel freatico con el agua
        const freaticoLine = document.getElementById("freaticoToWater");
        if (freaticoLine) {
            freaticoLine.setAttribute("x1", xb0);
            freaticoLine.setAttribute("y1", currentWaterY);
            freaticoLine.setAttribute("x2", xt0);
            freaticoLine.setAttribute("y2", currentWaterY);
        }

        // Actualiza polígono del agua
        const points = [
            [xb0, yb0],
            [xb1, yb1],
            [xt1, currentWaterY],
            [xt0, currentWaterY],
        ]
        .map(p => p.join(","))
        .join(" ");

        cantidad.setAttribute("points", points);

        // Animación continua hasta alcanzar el nivel freatico
        if (currentWaterY > nivelFreaticoY) requestAnimationFrame(animateWater);

        const headChargeText = document.getElementById("headCharge");

        if (headChargeText) {

            let offsetX = xb0 < 30 ? -15 : 20;
            const hValue = 130 - (50 / 130) * x0;

            headChargeText.setAttribute("x", xb0 - offsetX);
            headChargeText.setAttribute("y", currentWaterY);
            headChargeText.textContent = `h = ${Math.round(hValue)}`;
          }
        
    }

    animateWater();

    return { heightWell };
  }

  // Inicializar con los valores por defecto de los inputs
  document.addEventListener(
    "DOMContentLoaded",
    function () {
      valoresIniciales = getWellValues();
      updateWell(valoresIniciales);
    },
    { passive: true }
  );