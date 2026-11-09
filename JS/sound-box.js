// sound-box.js (como un header.js) - módulo de ganancia del ejercicio funcional

// Inyecta HTML
const html = `
<div id="sound-box">
  <div class="header">
    <span>Sound Control</span>
  </div>
  <div class="content">
    <button id="playBtn">Reproducir riff</button>

    <label for="gainSlider">Ganancia Node:</label>
    <input type="range" id="gainSlider" name="gainSlider" min="0" max="2" step="0.01" value="1">

    <label for="pan">Panorámica</label>
    <input type="range" id="pan" name="pan" min="-1" max="1" step="0.01" value="0">

    <canvas id="visualizer"></canvas>
  </div>
</div>
`;
document.body.insertAdjacentHTML('beforeend', html);