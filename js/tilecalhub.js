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

    const areaSize = roomLength * roomWidth;
    const tileSize = tileLength * tileWidth;
    let tileCount = areaSize / tileSize;
    tileCount *= 1 + (buffer / 100);
    tileCount = Math.ceil(tileCount);

    resultDiv.innerHTML = `
      <p><strong>Total Tiles Needed:</strong> ${tileCount}</p>
      <p><strong>Room Area:</strong> ${areaSize.toFixed(2)} ${unit}²</p>
      <p><strong>Tile Area:</strong> ${tileSize.toFixed(2)} ${unit}²</p>
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
