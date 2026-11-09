document.addEventListener("DOMContentLoaded", function() {
    const audio = document.getElementById("audioPlayer");
    const durationEl = document.getElementById("duration");
    const remainingEl = document.getElementById("remaining");
    const fileNameEl = document.getElementById("fileName");
    const statusEl = document.getElementById("status");
    const audioSelectors = document.querySelectorAll("input[name='audioSelect']");

    // Función para formatear el tiempo en mm:ss
    function formatTime(seconds) {
        let min = Math.floor(seconds / 60);
        let sec = Math.floor(seconds % 60);
        return min + ":" + (sec < 10 ? "0" : "") + sec;
    }

    // Evento cuando se carga el audio seleccionado
    audio.addEventListener("loadeddata", () => {
        durationEl.textContent = formatTime(audio.duration);
        remainingEl.textContent = formatTime(audio.duration - audio.currentTime);
    });

    // Evento cuando el audio se reproduce o pausa
    audio.addEventListener("play", () => statusEl.textContent = "Iniciado");
    audio.addEventListener("pause", () => statusEl.textContent = "Pausado");
    audio.addEventListener("ended", () => statusEl.textContent = "Finalizado");

    // Actualizar tiempo restante en tiempo real
    audio.addEventListener("timeupdate", () => {
        remainingEl.textContent = formatTime(audio.duration - audio.currentTime);
    });

    // Cambiar el audio cuando se selecciona otro archivo
    audioSelectors.forEach(selector => {
        selector.addEventListener("change", function() {
            audio.src = this.value;
            fileNameEl.textContent = this.value.split('/').pop(); // Mostrar solo el nombre del archivo
            audio.load();
            audio.play();
        });
    });
});
