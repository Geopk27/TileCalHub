
// 主绘制函数
function generatePreview() {
  const params = new URLSearchParams(window.location.search);
  const length = parseFloat(params.get('length'));
  const width = parseFloat(params.get('width'));
  const tileLength = parseFloat(params.get('tileLength'));
  const tileWidth = parseFloat(params.get('tileWidth'));
  const unit = params.get('unit') || 'mm';

  if ([length, width, tileLength, tileWidth].some(isNaN)) {
    alert("Invalid parameters detected");
    return;
  }

  const canvas = document.createElement('canvas');
  const isPortrait = length >= width;
  canvas.width = isPortrait ? 595 : 842;
  canvas.height = isPortrait ? 842 : 595;
  const ctx = canvas.getContext('2d');

  drawBaseLayout(ctx, canvas);

  const { roomLengthMM, roomWidthMM, tileLengthMM, tileWidthMM } = convertUnits(length, width, tileLength, tileWidth, unit);
  const { startX, startY, scale } = calculateLayout(canvas, roomLengthMM, roomWidthMM);

  drawTileGrid(ctx, startX, startY, tileLengthMM, tileWidthMM, scale, roomLengthMM, roomWidthMM);
  addAnnotations(ctx, canvas, startX, startY, roomLengthMM, roomWidthMM, scale, unit);

  document.getElementById('previewContainer').appendChild(canvas);
}

function convertUnits(length, width, tileLength, tileWidth, unit) {
  const toMM = (val) => {
    const converters = { mm: 1, cm: 10, inch: 25.4 };
    return val * (converters[unit] || 1);
  };

  return {
    roomLengthMM: toMM(length),
    roomWidthMM: toMM(width),
    tileLengthMM: toMM(tileLength),
    tileWidthMM: toMM(tileWidth)
  };
}

function calculateLayout(canvas, roomLengthMM, roomWidthMM) {
  const margin = 50;
  const adSpace = 80;

  const drawableWidth = canvas.width - 2 * margin;
  const drawableHeight = canvas.height - 2 * margin - adSpace;

  const scaleX = drawableWidth / roomWidthMM;
  const scaleY = drawableHeight / roomLengthMM;
  const scale = Math.min(scaleX, scaleY);

  return {
    startX: margin + (drawableWidth - roomWidthMM * scale) / 2,
    startY: margin + adSpace/2 + (drawableHeight - roomLengthMM * scale) / 2,
    scale
  };
}

function drawTileGrid(ctx, startX, startY, tileL, tileW, scale, roomL, roomW) {
  const rows = Math.ceil(roomL / tileL);
  const cols = Math.ceil(roomW / tileW);
  let count = 1;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = startX + c * tileW * scale;
      const y = startY + r * tileL * scale;
      const overflow = (c+1)*tileW > roomW || (r+1)*tileL > roomL;

      ctx.strokeStyle = overflow ? 'red' : 'black';
      ctx.strokeRect(x, y, tileW * scale, tileL * scale);

      ctx.fillStyle = "#000";
      ctx.font = `${Math.max(10, 12 * scale)}px Arial`;
      ctx.textAlign = 'center';
      ctx.fillText(count++, x + tileW*scale/2, y + tileL*scale/2 + 5);
    }
  }
}

function drawBaseLayout(ctx, canvas) {
  ctx.fillStyle = "#FFF";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#F5F5F5";
  ctx.fillRect(0, 0, canvas.width, 60);
  ctx.fillStyle = "#999";
  ctx.textAlign = 'center';
  ctx.fillText("Advertisement Space", canvas.width/2, 40);

  ctx.fillStyle = "#F5F5F5";
  ctx.fillRect(0, canvas.height-60, canvas.width, 60);
}

function addAnnotations(ctx, canvas, startX, startY, roomL, roomW, scale, unit) {
  ctx.fillStyle = "#000";
  ctx.font = "14px Arial";

  ctx.save();
  ctx.translate(20, canvas.height/2);
  ctx.rotate(-Math.PI/2);
  ctx.fillText(`Length: ${roomL}mm (${(roomL/1000).toFixed(2)}m)`, 0, 0);
  ctx.restore();

  ctx.fillText(`Width: ${roomW}mm (${(roomW/1000).toFixed(2)}m)`, canvas.width/2, startY - 20);
  ctx.fillText(`Scale 1:${Math.round(1/scale)}`, 50, canvas.height - 30);

  ctx.fillStyle = "rgba(0,0,0,0.2)";
  ctx.font = "12px Arial";
  ctx.fillText("www.tilecalhub.com", canvas.width - 100, canvas.height - 20);
}

function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const canvas = document.querySelector('canvas');
  const imgData = canvas.toDataURL('image/png');

  const pdf = new jsPDF({
    orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
    unit: 'mm'
  });

  pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
  pdf.save('tile-layout.pdf');
}

window.onload = generatePreview;
