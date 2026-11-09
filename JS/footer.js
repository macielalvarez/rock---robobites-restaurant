document.addEventListener("DOMContentLoaded", function () {
    const footerHTML = `
    <footer class="bg-dark text-white text-center py-3">
        <div class="container">
            <div class="row align-items-center">
                <!-- Sección de información en la izquierda -->
                <div class="col-md-4 text-md-start text-center mb-3 mb-md-0">
                    <h5>Contacto</h5>
                    <p class="mb-1">📍 Dirección: Calle Principal 123, Ciudad</p>
                    <p class="mb-1">📞 Teléfono: +123 456 789</p>
                    <p class="mb-1">✉️ Email: contacto@rockrobobites.com</p>
                    <p>🕒 Horario: Lun-Dom 10:00 - 23:00</p>
                </div>

                <!-- Formulario de contacto en el centro -->
                <div class="col-md-4">
                    <h5>CONTÁCTENOS</h5>
                    <form>
                        <div class="mb-2">
                            <input type="text" class="form-control" placeholder="Nombre" required>
                        </div>
                        <div class="mb-2">
                            <input type="email" class="form-control" placeholder="Correo electrónico" required>
                        </div>
                        <div class="mb-2">
                            <input type="tel" class="form-control" placeholder="Teléfono (Ej: 600 000 000)" pattern="6[0-9]{8}" required>
                        </div>
                        <div class="mb-2">
                            <textarea class="form-control" rows="3" placeholder="Mensaje" required></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary">Enviar</button>
                    </form>
                </div>

                <!-- Mapa en el footer -->
                <div class="col-md-4">
                    <h5>Ubicación</h5>
                    <div id="footer-map"></div>
                </div>
            </div>
        </div>

        <p class="mb-0 mt-3">&copy; 2025 Rock & RoboBites | Todos los derechos reservados</p>
    </footer>
    `;

    // Inserta el footer en el elemento con id "footer"
    document.getElementById('footer').innerHTML = footerHTML;
});
