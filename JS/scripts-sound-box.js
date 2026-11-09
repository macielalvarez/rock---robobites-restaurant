// script-sound-box.js (actualizado para usar gainSlider del ejercicio funcional)
function initSoundBox() {
  const box = document.getElementById("sound-box");
  if (!box) return;

  const AudioContext = window.AudioContext || window.webkitAudioContext;
  const audioCtx = new AudioContext();

  let source;
  const gainNode = audioCtx.createGain();
  const panNode = new StereoPannerNode(audioCtx);
  const analyser = audioCtx.createAnalyser();

  // Conexión del grafo
  gainNode.connect(panNode).connect(analyser).connect(audioCtx.destination);

  // Sliders
  const gainSlider = document.getElementById("gainSlider");
  const panSlider = document.getElementById("pan");

  gainSlider.addEventListener("input", () => {
    const value = parseFloat(gainSlider.value);
    gainNode.gain.setValueAtTime(value, audioCtx.currentTime);
  });

  panSlider.addEventListener("input", () => {
    const value = parseFloat(panSlider.value);
    panNode.pan.setValueAtTime(value, audioCtx.currentTime);
  });

  // Visualizador
  const canvas = document.getElementById("visualizer");
  const ctx = canvas?.getContext("2d");

  if (canvas && ctx) {
    function drawVisualizer() {
      requestAnimationFrame(drawVisualizer);
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteTimeDomainData(dataArray);

      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.lineWidth = 2;
      ctx.strokeStyle = "lime";
      ctx.beginPath();

      const sliceWidth = canvas.width / bufferLength;
      let x = 0;
      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * canvas.height / 2;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
        x += sliceWidth;
      }
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
    }
    drawVisualizer();
  }

  // Reproducción del sonido
  const playBtn = document.getElementById("playBtn");
  playBtn.addEventListener("click", async () => {
    try {
      const response = await fetch("../AUDIO/riff.mp3");
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
      source = audioCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(gainNode);
      source.start();
    } catch (err) {
      console.error("Error al reproducir audio:", err);
    }
  });
}

// Ejecutar cuando el DOM esté cargado y el contenedor esté en el DOM
window.addEventListener("load", () => {
  if (document.getElementById("sound-box")) {
    initSoundBox();
  } else {
    const observer = new MutationObserver(() => {
      if (document.getElementById("sound-box")) {
        observer.disconnect();
        initSoundBox();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }
});