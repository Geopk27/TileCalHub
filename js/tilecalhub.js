
document.getElementById('unitSelect').addEventListener('change', function () {
  const unit = this.value;
  document.querySelectorAll('.unit-label').forEach(el => el.textContent = unit);
});

const patternsByShape = {
  square: ['Grid', 'Diamond', 'Chequerboard', 'Staggered Bond'],
  rectangle: ['Offset', 'One-Third Offset', 'Stepladder', 'Stacked Horizontal', 'Stacked Vertical', 'Herringbone', 'Block Herringbone', 'Basket Weave'],
  plank: ['Offset', 'Herringbone', 'Double Herringbone', 'Chevron']
};

document.getElementById('tileShape').addEventListener('change', function () {
  const shape = this.value;
  const patternSelect = document.getElementById('patternSelect');
  patternSelect.innerHTML = '';

  if (patternsByShape[shape]) {
    patternsByShape[shape].forEach(pattern => {
      const opt = document.createElement('option');
      opt.value = pattern.toLowerCase().replace(/\s+/g, '-');
      opt.textContent = pattern;
      patternSelect.appendChild(opt);
    });
  }
});

document.getElementById('tileShape').dispatchEvent(new Event('change'));

function calculateTiles() {
  const length = parseFloat(document.getElementById('roomLength').value);
  const width = parseFloat(document.getElementById('roomWidth').value);
  const tileLength = parseFloat(document.getElementById('tileLength').value);
  const tileWidth = parseFloat(document.getElementById('tileWidth').value);
  const buffer = parseFloat(document.getElementById('buffer').value || 0);
  const unit = document.getElementById('unitSelect').value;

  if (!length || !width || !tileLength || !tileWidth) {
    alert("Please fill in all required fields.");
    return;
  }

  const toMeters = (value, unit) => {
    if (unit === "mm") return value / 1000;
    if (unit === "cm") return value / 100;
    if (unit === "inch") return value * 0.0254;
    return value;
  };

  const roomLengthM = toMeters(length, unit);
  const roomWidthM = toMeters(width, unit);
  const tileLengthM = toMeters(tileLength, unit);
  const tileWidthM = toMeters(tileWidth, unit);

  const roomAreaSqM = roomLengthM * roomWidthM;
  const tileAreaSqM = tileLengthM * tileWidthM;

  const tilesNeededBase = roomAreaSqM / tileAreaSqM;
  const bufferTiles = tilesNeededBase * (buffer / 100);
  const totalTiles = tilesNeededBase + bufferTiles;

  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = `
    <p><strong>Room Area:</strong> ${roomAreaSqM.toFixed(2)} m² / ${(roomAreaSqM * 10.764).toFixed(2)} ft²</p>
    <p><strong>Tiles Needed (before buffer):</strong> ${Math.ceil(tilesNeededBase)} pcs</p>
    <p><strong>Wastage Buffer:</strong> ${buffer}% = ${Math.ceil(bufferTiles)} pcs</p>
    <p><strong>Total Tiles Required:</strong> ${Math.ceil(totalTiles)} pcs</p>
  `;

  document.getElementById('previewBtn').classList.remove('hidden');
}

function goToPreview() {
  // 1. Get all input values
  const length = document.getElementById('roomLength').value;
  const width = document.getElementById('roomWidth').value;
  const tileLength = document.getElementById('tileLength').value;
  const tileWidth = document.getElementById('tileWidth').value;
  const unit = document.getElementById('unitSelect').value;

  // 2. Check if all required fields are filled
  if (!length || !width || !tileLength || !tileWidth) {
    alert("Please fill in all required fields");
    return;
  }

  // 3. Prepare parameters to pass
  const params = new URLSearchParams();
  params.append('length', length);
  params.append('width', width);
  params.append('tileLength', tileLength);
  params.append('tileWidth', tileWidth);
  params.append('unit', unit);

  // 4. Redirect to preview page with parameters
  window.location.href = 'layout-preview.html?' + params.toString();
}