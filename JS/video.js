document.addEventListener("DOMContentLoaded", function() {
    const video = document.getElementById("videoPlayer");
    const playBtn = document.getElementById("play");
    const pauseBtn = document.getElementById("pause");
    const stopBtn = document.getElementById("stop");
    const fastForwardBtn = document.getElementById("fastForward");
    const fullscreenBtn = document.getElementById("fullscreen");
    const volumeSlider = document.getElementById("volume");
    const progressBar = document.getElementById("progressBar");
    const timeInfo = document.getElementById("timeInfo");

    // Play Video
    playBtn.addEventListener("click", () => {
        video.play();
    });

    // Pause Video
    pauseBtn.addEventListener("click", () => {
        video.pause();
    });

    // Stop Video (pausar y reiniciar a 0)
    stopBtn.addEventListener("click", () => {
        video.pause();
        video.currentTime = 0;
        progressBar.value = 0;
        timeInfo.innerText = "0:00 / " + formatTime(video.duration);
    });

    // Fast Forward (adelantar 5 segundos)
    fastForwardBtn.addEventListener("click", () => {
        video.currentTime += 5;
    });

    // Fullscreen
    fullscreenBtn.addEventListener("click", () => {
        if (video.requestFullscreen) {
            video.requestFullscreen();
        } else if (video.mozRequestFullScreen) { // Firefox
            video.mozRequestFullScreen();
        } else if (video.webkitRequestFullscreen) { // Chrome, Safari y Opera
            video.webkitRequestFullscreen();
        } else if (video.msRequestFullscreen) { // IE/Edge
            video.msRequestFullscreen();
        }
    });

    // Control de volumen
    volumeSlider.addEventListener("input", () => {
        video.volume = volumeSlider.value;
    });

    // Actualizar barra de progreso y tiempo total cuando el vídeo carga
    video.addEventListener("loadeddata", () => {
        timeInfo.innerText = "0:00 / " + formatTime(video.duration);
    });

    // Actualizar barra de progreso y tiempo actual durante la reproducción
    video.addEventListener("timeupdate", () => {
        let percentage = (video.currentTime / video.duration) * 100;
        progressBar.value = percentage;
        timeInfo.innerText = formatTime(video.currentTime) + " / " + formatTime(video.duration);
    });

    // Alternar Play/Pause con clic en el vídeo
    video.addEventListener("click", () => {
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    });

    // Cambiar borde del vídeo según estado
    video.addEventListener("play", () => {
        video.classList.add("playing");
        video.classList.remove("paused");
    });

    video.addEventListener("pause", () => {
        video.classList.add("paused");
        video.classList.remove("playing");
    });

    // Formato de tiempo (mm:ss)
    function formatTime(seconds) {
        let min = Math.floor(seconds / 60);
        let sec = Math.floor(seconds % 60);
        return min + ":" + (sec < 10 ? "0" : "") + sec;
    }
});
