
// Update unit label dynamically
document.getElementById('unitSelect').addEventListener('change', function () {
  const unit = this.value;
  document.querySelectorAll('.unit-label').forEach(el => el.textContent = unit);
});

// Pattern options for each tile shape
const patternsByShape = {
  square: ['Grid', 'Diamond', 'Chequerboard', 'Staggered Bond'],
  rectangle: ['Offset', 'One-Third Offset', 'Stepladder', 'Stacked Horizontal', 'Stacked Vertical', 'Herringbone', 'Block Herringbone', 'Basket Weave'],
  plank: ['Offset', 'Herringbone', 'Double Herringbone', 'Chevron']
};

// Update pattern dropdown on tile shape change
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

// Initial trigger
document.getElementById('tileShape').dispatchEvent(new Event('change'));

// Calculate tile requirement
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

  // Convert all to meters
  let convertToMeter = (value, unit) => {
    if (unit === "mm") return value / 1000;
    if (unit === "cm") return value / 100;
    if (unit === "inch") return value * 0.0254;
    return value;
  };

  const roomLengthM = convertToMeter(length, unit);
  const roomWidthM = convertToMeter(width, unit);
  const tileLengthM = convertToMeter(tileLength, unit);
  const tileWidthM = convertToMeter(tileWidth, unit);

  const roomAreaSqM = roomLengthM * roomWidthM;
  const tileAreaSqM = tileLengthM * tileWidthM;
  let tileNeeded = roomAreaSqM / tileAreaSqM;
  tileNeeded *= 1 + buffer / 100;

  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = `
    <p><strong>Room Area:</strong> ${roomAreaSqM.toFixed(2)} m² / ${(roomAreaSqM * 10.764).toFixed(2)} ft²</p>
    <p><strong>Tiles Needed:</strong> ${Math.ceil(tileNeeded)} pcs</p>
    <p><strong>Wastage Buffer Applied:</strong> ${buffer}%</p>
  `;

  document.getElementById('previewBtn').classList.remove('hidden');
}

// Placeholder for layout preview
function goToPreview() {
  alert("Preview layout functionality is coming soon.");
}
