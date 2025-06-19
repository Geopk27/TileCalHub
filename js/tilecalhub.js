
function calculateTiles() {
  const length = parseFloat(document.getElementById('roomLength').value);
  const width = parseFloat(document.getElementById('roomWidth').value);
  const tileLength = parseFloat(document.getElementById('tileLength').value);
  const tileWidth = parseFloat(document.getElementById('tileWidth').value);
  const buffer = parseFloat(document.getElementById('buffer').value);
  const unit = document.getElementById('unitSelect').value;

  if (!length || !width || !tileLength || !tileWidth) {
    alert("Please fill in all required fields.");
    return;
  }

  const toMM = (value, unit) => {
    if (unit === "mm") return value;
    if (unit === "cm") return value * 10;
    if (unit === "inch") return value * 25.4;
    return value;
  };

  const roomLengthMM = toMM(length, unit);
  const roomWidthMM = toMM(width, unit);
  const tileLengthMM = toMM(tileLength, unit);
  const tileWidthMM = toMM(tileWidth, unit);

  const roomAreaSqM = (roomLengthMM * roomWidthMM) / 1e6;
  const roomAreaSqFt = roomAreaSqM * 10.7639;
  const tileAreaSqM = (tileLengthMM * tileWidthMM) / 1e6;

  const totalTiles = Math.ceil((roomAreaSqM / tileAreaSqM) * (1 + buffer / 100));
  const tilesBeforeBuffer = Math.ceil(roomAreaSqM / tileAreaSqM);
  const bufferTiles = totalTiles - tilesBeforeBuffer;

  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = `
    <p><strong>Room Area:</strong> ${roomAreaSqM.toFixed(2)} m² / ${roomAreaSqFt.toFixed(2)} ft²</p>
    <p><strong>Tiles Needed:</strong> ${tilesBeforeBuffer} tiles</p>
    <p><strong>Wastage Buffer:</strong> ${buffer}% (${bufferTiles} extra tiles)</p>
    <p><strong>Total Tiles Required:</strong> ${totalTiles} tiles</p>
  `;

  document.getElementById('previewBtn').classList.remove('hidden');
}
