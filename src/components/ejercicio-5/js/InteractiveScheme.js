let valoresIniciales = {};

const switchInput = document.getElementById("switchInput");
const manualInputs = document.querySelectorAll(".manualInput");
const dinamicInputs = document.querySelectorAll(".dinamicInput");

// Transferir valores entre inputs según modo
function transferValues() {
  const grupos = document.querySelectorAll(".inputCont");

  grupos.forEach((grupo) => {
    const rangeInput = grupo.querySelector('input[type="range"]');
    const manualInput = grupo.querySelector(".manualInputs");
    const p = grupo.querySelector("p");

    if (rangeInput && manualInput) {
      if (switchInput.checked) {
        manualInput.value = rangeInput.value;
      } else {
        const manualValue = parseFloat(manualInput.value);
        if (!isNaN(manualValue) && manualValue >= 0 && manualValue <= 120) {
          rangeInput.value = manualInput.value;
          if (p) {
            const tieneUnidad = p.textContent.trim().endsWith("m");
            p.textContent = tieneUnidad ? `${rangeInput.value} m` : rangeInput.value;
          }
        }
      }
    }
  });
}

// Manejo del switch
switchInput?.addEventListener("change", () => {
  transferValues();
  if (switchInput.checked) {
    manualInputs.forEach((input) => input.classList.remove("hidden"));
    dinamicInputs.forEach((input) => input.classList.add("hidden"));
  } else {
    manualInputs.forEach((input) => input.classList.add("hidden"));
    dinamicInputs.forEach((input) => input.classList.remove("hidden"));
  }
}, { passive: true });

// Actualizar los <p> al mover los range inputs
const grupos = document.querySelectorAll(".inputCont");
grupos.forEach((grupo) => {
  const input = grupo.querySelector('input[type="range"]');
  const p = grupo.querySelector("p");

  if (input && p) {
    const tieneUnidad = p.textContent.trim().endsWith("m");
    input.addEventListener("input", () => {
      p.textContent = tieneUnidad ? `${input.value} m` : input.value;
    }, { passive: true });
  }
});

const resetButton = document.getElementById("reset-btn");
if (resetButton) resetButton.addEventListener("click", resetValues);

// Reset de los valores
function resetValues() {
  const isManualMode = switchInput.checked;

  const {
    heightWell,
    widthWell,
    xPosWell,
    yPosWell,
    xExitWell,
  } = valoresIniciales;

  const manualInputs = document.querySelectorAll(".manualInputs");
  const rangeInputs = {
    heightWell: document.getElementById("heigthWell"),
    widthWell: document.getElementById("widthWell"),
    xPosWell: document.getElementById("xPosWell"),
    yPosWell: document.getElementById("yPosWell"),
    xExitWell: document.getElementById("xExitWell"),
  };

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

    const pText = document.querySelectorAll(".dinamicText");
    pText[0].textContent = `${heightWell} m`;
    pText[1].textContent = `${widthWell} m`;
    pText[2].textContent = `${xPosWell}`;
    pText[3].textContent = `${yPosWell}`;
    pText[4].textContent = `${xExitWell}`;
  }
}

// Obtener valores actuales de los inputs
function getWellValues() {
  const heightWellRange = document.getElementById("heigthWell");
  const widthWellRange = document.getElementById("widthWell");
  const xPosWellRange = document.getElementById("xPosWell");
  const yPosWellRange = document.getElementById("yPosWell");
  const xExitWellRange = document.getElementById("xExitWell");

  const manualInputs = document.querySelectorAll(".manualInputs");
  const isManualMode = switchInput.checked;

  return {
    heightWell: isManualMode ? parseFloat(manualInputs[0].value) || 0 : parseFloat(heightWellRange.value) || 0,
    widthWell: isManualMode ? parseFloat(manualInputs[1].value) || 0 : parseFloat(widthWellRange.value) || 0,
    xPosWell: isManualMode ? parseFloat(manualInputs[2].value) || 0 : parseFloat(xPosWellRange.value) || 0,
    yPosWell: isManualMode ? parseFloat(manualInputs[3].value) || 0 : parseFloat(yPosWellRange.value) || 0,
    xExitWell: isManualMode ? parseFloat(manualInputs[4].value) || 0 : parseFloat(xExitWellRange.value) || 0,
  };
}

// Inicializar valores al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  valoresIniciales = getWellValues();
}, { passive: true });
