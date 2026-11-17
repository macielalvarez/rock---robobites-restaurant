# Rock & RoboBites

Rock & RoboBites es una aplicación web desarrollada para un restaurante ficticio que combina gastronomía, música y tecnología. La propuesta gira en torno a una experiencia futurista en la que los robots forman parte del restaurante, tanto en su ambientación como en las experiencias interactivas de la web.

El sitio reúne diferentes secciones para consultar el menú, descubrir eventos, realizar reservas y explorar dos experiencias de juego desarrolladas con tecnologías web.

## Funcionalidades

### Página web

- Página de inicio con presentación e historia del restaurante.
- Menú organizado por diferentes tipos de platos.
- Sección de eventos con propuestas para el día y la noche.
- Formulario de reservas con selección de fecha, horario, número de personas y ubicación de la mesa.
- Calendario interactivo para consultar fechas disponibles.
- Gráfico dinámico con información sobre la disponibilidad de mesas.
- Mapa interactivo para mostrar la ubicación del restaurante.
- Elementos multimedia con imágenes, vídeos y música.
- Diseño adaptable a diferentes tamaños de pantalla.

### Juego 2D

- Juego para dos jugadores desarrollado con Canvas 2D.
- Mecánica inspirada en el clásico Pong, con robots como palas y una pelota.
- Selección de nombres para los jugadores.
- Configuración del tamaño de las palas y la velocidad de la pelota.
- Sistema de puntuación y detección de colisiones.

### Experiencia 3D

- Escenario tridimensional creado con Three.js.
- Representación del restaurante mediante un modelo 3D.
- Robot animado con posibilidad de desplazarse por el escenario.
- Controles de movimiento mediante teclado.
- Interacción con objetos del entorno mediante clic.
- Cofre interactivo que muestra un código promocional.

## Tecnologías utilizadas

### Desarrollo web

- HTML5
- CSS3
- JavaScript
- Bootstrap 5

### Mapas y visualización

- Leaflet
- OpenStreetMap
- D3.js

### Juego 2D

- Canvas 2D API
- JavaScript

### Experiencia 3D

- Three.js
- WebGL
- GLTF / GLB

### Otros recursos

- JSON
- Fetch API
- LocalStorage
- FullCalendar
- Web Audio y reproducción multimedia

## Estructura del proyecto

```text
rock-and-robobites-restaurant/
├── AUDIO/             # Archivos de audio
├── CSS/               # Hojas de estilo
├── FONTS/             # Tipografía
├── HTML/              # Páginas de la aplicación
│   ├── index.html
│   ├── menu.html
│   ├── eventos.html
│   ├── reservaciones.html
│   ├── juego.html
│   └── 3d.html
├── IMAGENES/          # Imágenes y recursos gráficos
├── JS/                # Scripts y lógica de la aplicación
├── JSON/              # Datos de reservas
├── MODELOS/           # Modelos 3D
└── README.md
```

## Ejecutar el proyecto

La aplicación está desarrollada con tecnologías frontend y no requiere un proceso de compilación.

Para ejecutarla, es necesario iniciar un servidor local desde la carpeta raíz del proyecto. Por ejemplo, utilizando Python:

```bash
python -m http.server 8000
```

Después, abre en el navegador:

```text
http://localhost:8000/HTML/index.html
```

También puedes utilizar la extensión Live Server de Visual Studio Code.

Es necesaria una conexión a Internet para cargar correctamente las librerías externas y los recursos de mapas.

## Alcance del proyecto

Rock & RoboBites es un proyecto académico de carácter demostrativo. No dispone de un backend ni de una base de datos. La gestión de las reservas se simula en el navegador mediante `localStorage`, por lo que los datos no se envían a un servidor ni representan reservas reales.
