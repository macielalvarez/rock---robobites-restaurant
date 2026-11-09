// header.js
document.addEventListener("DOMContentLoaded", function () {
    const headerHTML = `
    <header class="bg-dark">
        <link rel="stylesheet" href="../CSS/estilos.css">
        <div class="container-fluid d-flex justify-content-between align-items-center">
            <a class="navbar-brand text-white" href="index.html">
                <img src="../IMAGENES/logo.jpg" alt="logo" style="width: 80px; height: 80px; max-width: 100%; border-radius: 50%;">
            </a>
            <span class="navbar-text mx-auto text-white">Rock & Robobites</span>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarExampleDefault" aria-controls="navbarExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon" style="filter: invert(1);"></span>
            </button>
        </div>
    </header>
    <nav class="navbar navbar-expand-md bg-dark text-white text-center py-3">
        <div class="container-fluid">
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarExampleDefault" aria-controls="navbarExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon" style="filter: invert(1);"></span>
            </button>
            <div class="collapse navbar-collapse justify-content-center mt-3" id="navbarExampleDefault">
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <a class="nav-link text-white" href="index.html">Inicio</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link text-white" href="menu.html">Menú</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link text-white" href="eventos.html">Eventos</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link text-white" href="reservaciones.html">Reservaciones</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link text-white" href="juego.html">Juego</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link text-white" href="3d.html">3D</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/5.1.3/js/bootstrap.min.js"></script>
    `;
  
    // Inserta el contenido en el elemento con id "header"
    document.getElementById('header').innerHTML = headerHTML;
  });
  