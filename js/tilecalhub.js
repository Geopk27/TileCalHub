document.addEventListener('DOMContentLoaded', function () {
  const tileShapeSelect = document.getElementById('tileShape');
  const unitSelect = document.getElementById('unitSelect');
  const roomLengthInput = document.getElementById('roomLength');
  const roomWidthInput = document.getElementById('roomWidth');
  const tileLengthInput = document.getElementById('tileLength');
  const tileWidthInput = document.getElementById('tileWidth');
  const bufferInput = document.getElementById('buffer');
  const resultDiv = document.getElementById('result');
  const previewBtn = document.getElementById('previewBtn');

  function convertToMeters(value, unit) {
    if (unit === 'mm') return value / 1000;
    if (unit === 'cm') return value / 100;
    if (unit === 'inch') return value * 0.0254;
    return value;
  }

  window.calculateTiles = function () {
    const roomLength = parseFloat(roomLengthInput.value);
    const roomWidth = parseFloat(roomWidthInput.value);
    const tileLength = parseFloat(tileLengthInput.value);
    const tileWidth = parseFloat(tileWidthInput.value);
    const buffer = parseFloat(bufferInput.value);
    const unit = unitSelect.value;

    if (isNaN(roomLength) || isNaN(roomWidth) || isNaN(tileLength) || isNaN(tileWidth)) {
      resultDiv.innerHTML = "<p class='text-red-500'>Please enter all dimensions correctly.</p>";
      return;
    }

    const roomLengthM = convertToMeters(roomLength, unit);
    const roomWidthM = convertToMeters(roomWidth, unit);
    const tileLengthM = convertToMeters(tileLength, unit);
    const tileWidthM = convertToMeters(tileWidth, unit);

    const roomAreaSqm = roomLengthM * roomWidthM;
    const tileAreaSqm = tileLengthM * tileWidthM;
    let tileCount = roomAreaSqm / tileAreaSqm;
    const originalTileCount = Math.ceil(tileCount);
    const bufferTiles = Math.ceil(tileCount * (buffer / 100));
    const totalTiles = originalTileCount + bufferTiles;

    const roomAreaSqft = roomAreaSqm * 10.7639;
    const tileAreaSqft = tileAreaSqm * 10.7639;

    resultDiv.innerHTML = `
      <p><strong>🧮 Tiles Needed (Before Buffer):</strong> ${originalTileCount}</p>
      <p><strong>➕ Buffer Tiles (${buffer}%):</strong> ${bufferTiles}</p>
      <p><strong>📦 Total Tiles to Order:</strong> ${totalTiles}</p>
      <hr class="my-2" />
      <p><strong>📏 Room Area:</strong> ${roomAreaSqm.toFixed(2)} m² / ${roomAreaSqft.toFixed(2)} ft²</p>
      <p><strong>🧱 Single Tile Area:</strong> ${tileAreaSqm.toFixed(4)} m² / ${tileAreaSqft.toFixed(2)} ft²</p>
    `;

    previewBtn.classList.remove('hidden');

    // store for preview
    localStorage.setItem('roomLength', roomLength);
    localStorage.setItem('roomWidth', roomWidth);
    localStorage.setItem('tileLength', tileLength);
    localStorage.setItem('tileWidth', tileWidth);
    localStorage.setItem('unit', unit);
  };

  window.goToPreview = function () {
    window.location.href = 'layout-preview.html';
  };
});
