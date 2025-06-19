
// Unit switching display
document.getElementById('unitSelect').addEventListener('change', function () {
  const unit = this.value;
  document.querySelectorAll('.unit-label').forEach(el => el.textContent = unit);
});

// Pattern data
const patternsByShape = {
  square: ['Grid', 'Diamond', 'Chequerboard', 'Staggered Bond'],
  rectangle: ['Offset', 'One-Third Offset', 'Stepladder', 'Stacked Horizontal', 'Stacked Vertical', 'Herringbone', 'Block Herringbone', 'Basket Weave'],
  plank: ['Offset', 'Herringbone', 'Double Herringbone', 'Chevron']
};

// Update pattern options based on tile shape
document.getElementById('tileShape').addEventListener('change', function () {
  const shape = this.value;
  const patternSelect = document.getElementById('patternSelect');
  patternSelect.innerHTML = ''; // Clear existing

  if (patternsByShape[shape]) {
    patternsByShape[shape].forEach(pattern => {
      const opt = document.createElement('option');
      opt.value = pattern.toLowerCase().replace(/\s+/g, '-');
      opt.textContent = pattern;
      patternSelect.appendChild(opt);
    });
  }
});

// Trigger once on load
document.getElementById('tileShape').dispatchEvent(new Event('change'));

// Placeholder for calculateTiles
function calculateTiles() {
  alert("Tile calculation logic to be added.");
}

// Placeholder for goToPreview
function goToPreview() {
  alert("Preview logic to be added.");
}
