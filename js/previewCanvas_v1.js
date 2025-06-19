
// Automatically run when page loads
window.onload = function() {
  // 1. Get parameters from URL
  const urlParams = new URLSearchParams(window.location.search);
  
  const length = parseFloat(urlParams.get('length'));
  const width = parseFloat(urlParams.get('width'));
  const tileLength = parseFloat(urlParams.get('tileLength'));
  const tileWidth = parseFloat(urlParams.get('tileWidth'));
  const unit = urlParams.get('unit');

  // 2. Verify all required parameters exist
  if (isNaN(length) || isNaN(width) || isNaN(tileLength) || isNaN(tileWidth)) {
    alert("Missing required parameters, please go back and calculate first");
    return;
  }

  // 3. Call the drawing function
  drawPreview(length, width, tileLength, tileWidth, unit);
};

// Drawing function
function drawPreview(length, width, tileLength, tileWidth, unit) {
  // Unit conversion function
  const toMM = (value, unit) => {
    if (unit === "mm") return value;
    if (unit === "cm") return value * 10;
    if (unit === "inch") return value * 25.4;
    return value;
  };

  // Convert all units to millimeters
  const roomLengthMM = toMM(length, unit);
  const roomWidthMM = toMM(width, unit);
  const tileLengthMM = toMM(tileLength, unit);
  const tileWidthMM = toMM(tileWidth, unit);

  // Create canvas
  const canvas = document.createElement('canvas');
  canvas.width = 595;
  canvas.height = 842;
  const ctx = canvas.getContext('2d');
  
  // Draw white background
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Calculate drawing area and scale
  const margin = 40;
  const drawableWidth = canvas.width - 2 * margin;
  const drawableHeight = canvas.height - 2 * margin;

  let scaleX = drawableWidth / roomWidthMM;
  let scaleY = drawableHeight / roomLengthMM;
  let scale = Math.min(scaleX, scaleY);

  const startX = (canvas.width - roomWidthMM * scale) / 2;
  const startY = (canvas.height - roomLengthMM * scale) / 2;

  // Draw tiles
  let count = 1;
  const rows = Math.ceil(roomLengthMM / tileLengthMM);
  const cols = Math.ceil(roomWidthMM / tileWidthMM);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = startX + c * tileWidthMM * scale;
      const y = startY + r * tileLengthMM * scale;
      const w = tileWidthMM * scale;
      const h = tileLengthMM * scale;

      const overflowX = (c + 1) * tileWidthMM > roomWidthMM;
      const overflowY = (r + 1) * tileLengthMM > roomLengthMM;

      ctx.strokeStyle = (overflowX || overflowY) ? 'red' : 'black';
      ctx.strokeRect(x, y, w, h);

      ctx.fillStyle = "#000";
      ctx.font = `${Math.max(8, scale * 0.8)}px Arial`;
      ctx.fillText(count, x + w / 2 - 5, y + h / 2 + 4);
      count++;
    }
  }

  // Add text information
  ctx.fillStyle = "black";
  ctx.font = "12px Arial";
  ctx.fillText("Length: " + (roomLengthMM / 1000).toFixed(2) + " m", startX - 35, canvas.height / 2);
  ctx.fillText("Width: " + (roomWidthMM / 1000).toFixed(2) + " m", canvas.width / 2, startY - 10);
  ctx.fillText("Scale 1:" + Math.round(1 / scale), 50, canvas.height - 20);

  ctx.font = "10px Arial";
  ctx.fillStyle = "#ccc";
  ctx.fillText("www.tilecalhub.com", canvas.width - 120, canvas.height - 10);

  // Add canvas to page
  const previewContainer = document.getElementById('previewContainer');
  previewContainer.innerHTML = '';
  previewContainer.appendChild(canvas);
}

// PDF download function (not implemented yet)
function downloadPDF() {
  alert("PDF download feature coming soon");
}