document.addEventListener("DOMContentLoaded", function () {
    // Al inicio del archivo (variables globales)
    const robotImg = new Image();
    robotImg.src = "../IMAGENES/robot.png";

    const fondoImg = new Image();
    fondoImg.src = "../IMAGENES/resturante.png";

    const pelotaImgs = [
    "../IMAGENES/pelota1.png",
    "../IMAGENES/pelota2.png",
    "../IMAGENES/pelota3.png"
    ];
    let currentPelotaImg = new Image();
    currentPelotaImg.src = pelotaImgs[Math.floor(Math.random() * pelotaImgs.length)];

    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");

    canvas.width = 800;
    canvas.height = 400;

    let jugador1 = "Jugador 1";
    let jugador2 = "Jugador 2";
    let puntos1 = 0;
    let puntos2 = 0;
    let victorias1 = 0;
    let victorias2 = 0;
    let puntuacionMaxima = 10;
    let palaWidth = 50;
    let palaHeight = 50;
    let velocidadPelota = 3;

    let pala1 = { x: 10, y: canvas.height / 2 - palaHeight / 2, speed: 5 };
    let pala2 = { x: canvas.width - 60, y: canvas.height / 2 - palaHeight / 2, speed: 5 };
    let pelota = { x: canvas.width / 2, y: canvas.height / 2, radius: 25, dx: velocidadPelota, dy: velocidadPelota };
    let keys = {};

    document.getElementById("iniciar").addEventListener("click", function () {
        jugador1 = document.getElementById("jugador1").value || "Jugador 1";
        jugador2 = document.getElementById("jugador2").value || "Jugador 2";
        palaHeight = parseInt(document.getElementById("tamanoPala").value) || 50;
        palaWidth = palaHeight;
        velocidadPelota = parseInt(document.getElementById("velocidad").value) || 3;
        puntos1 = 0;
        puntos2 = 0;
        resetPelota();
        gameLoop();
    });

    function resetPelota() {
        currentPelotaImg.src = pelotaImgs[Math.floor(Math.random() * pelotaImgs.length)];
        pelota.x = canvas.width / 2;
        pelota.y = canvas.height / 2;
        pelota.dx = velocidadPelota * (Math.random() > 0.5 ? 1 : -1);
        pelota.dy = velocidadPelota * (Math.random() > 0.5 ? 1 : -1);
    }        

    function drawCourt() {
        // Dibuja la imagen de fondo ocupando todo el canvas
        ctx.drawImage(fondoImg, 0, 0, canvas.width, canvas.height);
      }
      

    function drawPala(pala) {
        ctx.drawImage(robotImg, pala.x, pala.y, palaWidth, palaHeight);
    }

    function drawPelota() {
        ctx.drawImage(
            currentPelotaImg,
            pelota.x - pelota.radius,
            pelota.y - pelota.radius,
            pelota.radius * 2,
            pelota.radius * 2
          );
    }

    function drawPuntaje() {
        ctx.fillStyle = "balck";
        ctx.font = "20px Arial";
        ctx.fillText(`${jugador1}: ${puntos1} (Victorias: ${victorias1})`, 50, 30);
        ctx.fillText(`${jugador2}: ${puntos2} (Victorias: ${victorias2})`, canvas.width - 250, 30);
    }

    function updatePelota() {
        pelota.x += pelota.dx;
        pelota.y += pelota.dy;

        if (pelota.y <= 0 || pelota.y >= canvas.height) pelota.dy *= -1;
        
        if (
            (pelota.x <= pala1.x + palaWidth && pelota.y >= pala1.y && pelota.y <= pala1.y + palaHeight) ||
            (pelota.x >= pala2.x - palaWidth && pelota.y >= pala2.y && pelota.y <= pala2.y + palaHeight)
        ) {
            pelota.dx *= -1;
        }
        
        if (pelota.x < 0) { 
            puntos2++; 
            checkWin();
            resetPelota(); 
        }
        if (pelota.x > canvas.width) { 
            puntos1++; 
            checkWin();
            resetPelota(); 
        }
    }

    function checkWin() {
        if (puntos1 >= puntuacionMaxima) {
            victorias1++;
            puntos1 = 0;
            puntos2 = 0;
            mostrarPopupDescuento();
        } else if (puntos2 >= puntuacionMaxima) {
            victorias2++;
            puntos1 = 0;
            puntos2 = 0;
            mostrarPopupDescuento();
        }
    }

    function updatePala() {
        if (keys["w"] && pala1.y > 0) pala1.y -= pala1.speed;
        if (keys["s"] && pala1.y + palaHeight < canvas.height) pala1.y += pala1.speed;
        if (keys["ArrowUp"] && pala2.y > 0) pala2.y -= pala2.speed;
        if (keys["ArrowDown"] && pala2.y + palaHeight < canvas.height) pala2.y += pala2.speed;
    }

    function gameLoop() {
        drawCourt();
        drawPala(pala1);
        drawPala(pala2);
        drawPelota();
        drawPuntaje();
        updatePelota();
        updatePala();
        requestAnimationFrame(gameLoop);
    }

    window.addEventListener("keydown", (e) => keys[e.key] = true);
    window.addEventListener("keyup", (e) => keys[e.key] = false);


    document.addEventListener("keydown", function(e) {
        // Verifica si se presionó una de las flechas
        if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
          e.preventDefault(); // Bloquea el comportamiento por defecto (scroll)
          // Aquí puedes incluir la lógica para mover la pala
          moverPala(e.key);
        }
    }, false);
      
    function mostrarPopupDescuento() {
        reiniciarCanvas(); // Reinicia el canvas cuando aparece el popup
        const popup = document.createElement("div");
        popup.id = "popupDescuento";
        
        // Establecemos la opacidad inicial a 0 (para animar el fade in)
        popup.style.opacity = "0";
        
        popup.innerHTML = `
            <div class="popup-content">
                <p>¡Felicidades! Obtén un <strong>10% de descuento</strong> en tu próxima compra.</p>
                <button id="cerrarPopup">Cerrar</button>
            </div>`;
        
        document.body.appendChild(popup);
        
        // Forzamos el reflow y aplicamos la transición (fade in)
        setTimeout(() => {
            popup.style.opacity = "1";
        }, 10);
        
        // Al cerrar, aplicamos fade out antes de remover el popup
        document.getElementById("cerrarPopup").addEventListener("click", () => {
            popup.style.opacity = "0";
            // Esperamos la duración de la transición para remover el popup
            setTimeout(() => {
                popup.remove();
                // Opcional: reiniciar la partida
                reiniciarPartida(); // Puedes definir esta función según tus necesidades
            }, 500); // 500ms coincide con la duración de la transición
        });
    }
    

    function reiniciarCanvas() {
        // Limpia el canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      
        // Reinicia las puntuaciones (si se desea)
        puntos1 = 0;
        puntos2 = 0;
        velocidadPelota = 0;
      
        // Reposiciona las palas al centro vertical
        pala1.y = canvas.height / 2 - palaHeight / 2;
        pala2.y = canvas.height / 2 - palaHeight / 2;
      
        // Reinicia la pelota (selecciona una imagen aleatoria y la posiciona en el centro)
        resetPelota();
      
        // Dibuja el campo y los elementos iniciales
        drawCourt();
        drawPala(pala1);
        drawPala(pala2);
        drawPelota();
        drawPuntaje();
      }
      
});
