// ✅ 单位转换函数
const toMM = (val, unit) => {
  const converters = { mm: 1, cm: 10, inch: 25.4 };
  return val * (converters[unit] || 1);
};

// ✅ 模式名 → 绘图函数映射
const drawingStrategies = {
  grid: drawGrid,
  herringbone: drawHerringbone,
  // 可扩展更多模式...
};

// ✅ 主绘图入口
function generatePreview() {
  const params = new URLSearchParams(window.location.search);
  const length = parseFloat(params.get('length'));
  const width = parseFloat(params.get('width'));
  const tileLength = parseFloat(params.get('tileLength'));
  const tileWidth = parseFloat(params.get('tileWidth'));
  const unit = params.get('unit') || 'mm';
  const pattern = params.get('pattern') || 'grid';

  if ([length, width, tileLength, tileWidth].some(isNaN)) {
    alert("参数错误：请返回重新输入");
    return;
  }

  const canvas = document.createElement('canvas');
  const isPortrait = length >= width;
  canvas.width = isPortrait ? 595 : 842;
  canvas.height = isPortrait ? 842 : 595;
  const ctx = canvas.getContext('2d');

  const roomLengthMM = toMM(length, unit);
  const roomWidthMM = toMM(width, unit);
  const tileLengthMM = toMM(tileLength, unit);
  const tileWidthMM = toMM(tileWidth, unit);

  if (tileLengthMM > roomLengthMM || tileWidthMM > roomWidthMM) {
    drawError(ctx, canvas, "瓷砖尺寸不能大于房间尺寸");
    return;
  }

  const { startX, startY, scale } = calculateLayout(canvas, roomLengthMM, roomWidthMM);

  const drawer = drawingStrategies[pattern] || drawingStrategies.grid;
  drawer(ctx, startX, startY, tileWidthMM, tileLengthMM, scale, roomWidthMM, roomLengthMM);

  addAnnotations(ctx, canvas, startX, startY, roomLengthMM, roomWidthMM, scale, unit);
  document.getElementById('previewContainer').appendChild(canvas);
}

// ✅ 网格图绘制
function drawGrid(ctx, startX, startY, tileW, tileH, scale, roomW, roomH) {
  let count = 1;
  const rows = Math.ceil(roomH / tileH);
  const cols = Math.ceil(roomW / tileW);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = startX + c * tileW * scale;
      const y = startY + r * tileH * scale;
      const overflow = (c + 1) * tileW > roomW || (r + 1) * tileH > roomH;
      drawSingleTile(ctx, x, y, tileW * scale, tileH * scale, count++, overflow);
    }
  }
}

// ✅ 人字形图绘制
function drawHerringbone(ctx, startX, startY, tileW, tileH, scale, roomW, roomH) {
  const angle = Math.PI / 4;
  const tileSize = Math.max(tileW, tileH) * scale;
  const patternWidth = tileSize * Math.cos(angle) * 2;
  const patternHeight = tileSize * Math.sin(angle);
  let count = 1;

  ctx.save();
  ctx.translate(startX, startY);

  for (let y = 0; y < roomH * scale + patternHeight; y += patternHeight) {
    for (let x = 0; x < roomW * scale + patternWidth; x += patternWidth) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(-angle);
      drawSingleTile(ctx, 0, 0, tileW * scale, tileH * scale, count++);
      ctx.restore();

      ctx.save();
      ctx.translate(x + patternWidth / 2, y);
      ctx.rotate(angle);
      drawSingleTile(ctx, 0, 0, tileW * scale, tileH * scale, count++);
      ctx.restore();
    }
  }
  ctx.restore();
}

// ✅ 单块瓷砖绘制（支持溢出红框）
function drawSingleTile(ctx, x, y, w, h, num, isOverflow = false) {
  ctx.strokeStyle = isOverflow ? 'red' : 'black';
  ctx.strokeRect(x, y, w, h);
  ctx.fillStyle = isOverflow ? 'red' : '#000';
  ctx.font = `${Math.max(10, w * 0.1)}px Arial`;
  ctx.textAlign = 'center';
  ctx.fillText(num, x + w / 2, y + h / 2 + 5);
}

// ✅ 画布布局参数
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
    startY: margin + adSpace / 2 + (drawableHeight - roomLengthMM * scale) / 2,
    scale
  };
}

// ✅ 注解标注
function addAnnotations(ctx, canvas, startX, startY, roomL, roomW, scale, unit) {
  ctx.fillStyle = "#000";
  ctx.font = "14px Arial";

  ctx.save();
  ctx.translate(20, canvas.height / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText(`Length: ${roomL}mm (${(roomL / 1000).toFixed(2)}m)`, 0, 0);
  ctx.restore();

  ctx.fillText(`Width: ${roomW}mm (${(roomW / 1000).toFixed(2)}m)`, canvas.width / 2, startY - 20);
  ctx.fillText(`Scale 1:${Math.round(1 / scale)}`, 50, canvas.height - 30);

  ctx.fillStyle = "rgba(0,0,0,0.2)";
  ctx.font = "12px Arial";
  ctx.fillText("www.tilecalhub.com", canvas.width - 100, canvas.height - 20);
}

// ✅ 错误提示画面
function drawError(ctx, canvas, msg) {
  ctx.fillStyle = "#FFF";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#F00";
  ctx.font = "20px Arial";
  ctx.textAlign = 'center';
  ctx.fillText(msg, canvas.width / 2, canvas.height / 2);
}

// ✅ 高清导出 PDF
function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const originalCanvas = document.querySelector('canvas');
  const scaledCanvas = document.createElement('canvas');
  const scale = 2;
  scaledCanvas.width = originalCanvas.width * scale;
  scaledCanvas.height = originalCanvas.height * scale;
  const ctx = scaledCanvas.getContext('2d');
  ctx.scale(scale, scale);
  ctx.drawImage(originalCanvas, 0, 0);

  const pdf = new jsPDF({
    orientation: scaledCanvas.width > scaledCanvas.height ? 'landscape' : 'portrait',
    unit: 'mm',
    compress: true
  });

  pdf.addImage(scaledCanvas.toDataURL('image/png'), 'PNG', 0, 0, 210, 297);
  pdf.save('tile-layout.pdf');
}

window.onload = generatePreview;
