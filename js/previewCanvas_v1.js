
function goToPreview() {
  const length = parseFloat(document.getElementById('roomLength').value);
  const width = parseFloat(document.getElementById('roomWidth').value);
  const tileLength = parseFloat(document.getElementById('tileLength').value);
  const tileWidth = parseFloat(document.getElementById('tileWidth').value);
  const unit = document.getElementById('unitSelect').value;

  if (!length || !width || !tileLength || !tileWidth) {
    alert("Please fill in all required fields.");
    return;
  }

  const toMM = (v, u) => u === 'mm' ? v : u === 'cm' ? v * 10 : u === 'inch' ? v * 25.4 : v;
  const roomLengthMM = toMM(length, unit);
  const roomWidthMM = toMM(width, unit);
  const tileLengthMM = toMM(tileLength, unit);
  const tileWidthMM = toMM(tileWidth, unit);

  const canvas = document.createElement('canvas');
  canvas.width = 595;
  canvas.height = 842;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const margin = 40;
  const drawableWidth = canvas.width - margin * 2;
  const drawableHeight = canvas.height - margin * 2;
  const scaleX = drawableWidth / roomWidthMM;
  const scaleY = drawableHeight / roomLengthMM;
  const scale = Math.min(scaleX, scaleY);

  const drawWidth = roomWidthMM * scale;
  const drawHeight = roomLengthMM * scale;
  const startX = (canvas.width - drawWidth) / 2;
  const startY = (canvas.height - drawHeight) / 2;

  let count = 1;
  const rows = Math.ceil(roomLengthMM / tileLengthMM);
  const cols = Math.ceil(roomWidthMM / tileWidthMM);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = startX + c * tileWidthMM * scale;
      const y = startY + r * tileLengthMM * scale;
      const w = tileWidthMM * scale;
      const h = tileLengthMM * scale;
      const overflow = ((c + 1) * tileWidthMM > roomWidthMM) || ((r + 1) * tileLengthMM > roomLengthMM);
      ctx.strokeStyle = overflow ? 'red' : 'black';
      ctx.strokeRect(x, y, w, h);
      ctx.fillStyle = "#000";
      ctx.font = `${Math.max(8, scale * 0.7)}px Arial`;
      ctx.textAlign = 'center';
      ctx.fillText(count, x + w / 2, y + h / 2 + 4);
      count++;
    }
  }

  ctx.fillStyle = "black";
  ctx.font = "12px Arial";
  ctx.textAlign = 'right';
  ctx.fillText(`Length (${unit}): ${length}`, startX - 10, canvas.height / 2);
  ctx.textAlign = 'center';
  ctx.fillText(`Width (${unit}): ${width}`, canvas.width / 2, startY - 10);
  ctx.textAlign = 'left';
  ctx.fillText("Scale 1:" + Math.round(1 / scale), 40, canvas.height - 25);
  ctx.font = "10px Arial";
  ctx.fillStyle = "#bbb";
  ctx.textAlign = 'right';
  ctx.fillText("www.tilecalhub.com", canvas.width - 10, canvas.height - 10);

  const previewContainer = document.getElementById('previewContainer');
  previewContainer.innerHTML = '';
  previewContainer.appendChild(canvas);
}
