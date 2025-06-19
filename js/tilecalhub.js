
window.calculateTiles = function() {
  const shape = document.getElementById("tileShape").value;
  const unit = document.getElementById("unitSelect").value;
  const roomLength = parseFloat(document.getElementById("roomLength").value) || 0;
  const roomWidth = parseFloat(document.getElementById("roomWidth").value) || 0;
  const tileLength = parseFloat(document.getElementById("tileLength").value) || 0;
  const tileWidth = parseFloat(document.getElementById("tileWidth").value) || 0;
  const bufferPercent = parseFloat(document.getElementById("buffer").value) || 0;

  const convertToMeters = (value, unit) => {
    if (unit === "mm") return value / 1000;
    if (unit === "cm") return value / 100;
    if (unit === "inch") return value * 0.0254;
    return value;
  };

  const rL = convertToMeters(roomLength, unit);
  const rW = convertToMeters(roomWidth, unit);
  const tL = convertToMeters(tileLength, unit);
  const tW = convertToMeters(tileWidth, unit);

  const roomAreaSqM = rL * rW;
  const roomAreaSqFt = roomAreaSqM * 10.7639;
  const tileAreaSqM = tL * tW;

  let tilesNeeded = tileAreaSqM > 0 ? roomAreaSqM / tileAreaSqM : 0;
  let bufferTiles = Math.ceil(tilesNeeded * (bufferPercent / 100));
  let totalTiles = Math.ceil(tilesNeeded + bufferTiles);

  const result = document.getElementById("result");
  result.innerHTML = `
    <p>🟩 Room Area: ${roomAreaSqM.toFixed(2)} m² (${roomAreaSqFt.toFixed(2)} ft²)</p>
    <p>🧱 Tile Area: ${tileAreaSqM.toFixed(4)} m²</p>
    <p>📦 Tiles Needed (no buffer): ${Math.ceil(tilesNeeded)}</p>
    <p>➕ Buffer Tiles (${bufferPercent}%): ${bufferTiles}</p>
    <p>✅ <strong>Total Tiles to Order: ${totalTiles}</strong></p>
  `;

  document.getElementById("previewBtn").classList.remove("hidden");
};

window.goToPreview = function() {
  localStorage.setItem("tileShape", document.getElementById("tileShape").value);
  localStorage.setItem("unit", document.getElementById("unitSelect").value);
  localStorage.setItem("roomLength", document.getElementById("roomLength").value);
  localStorage.setItem("roomWidth", document.getElementById("roomWidth").value);
  localStorage.setItem("tileLength", document.getElementById("tileLength").value);
  localStorage.setItem("tileWidth", document.getElementById("tileWidth").value);
  localStorage.setItem("buffer", document.getElementById("buffer").value);
  window.location.href = "layout-preview.html";
};
