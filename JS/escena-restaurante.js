import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Escena
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xa0a0a0);

// Cámara
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(10, 6, 18);

// Renderizador
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('main-3D').appendChild(renderer.domElement);

// Luces
scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 1));
const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(0, 200, 100);
scene.add(dirLight);

// Suelo
const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(500, 500),
    new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false })
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// Cargar restaurante
const loader = new GLTFLoader();
loader.load('../MODELOS/restaurante.glb', (gltf) => {
    gltf.scene.scale.set(10, 10, 10);
    scene.add(gltf.scene);
}, undefined, console.error);

// Robot
let robot, mixer, walkAction, isWalking = false;

loader.load('../MODELOS/Rigged robot.glb', (gltf) => {
    robot = gltf.scene;
    robot.scale.set(0.5, 0.5, 0.5);
    robot.position.set(8, 0, 10);
    robot.rotation.y = Math.PI;
    scene.add(robot);

    mixer = new THREE.AnimationMixer(robot);
    const clip = gltf.animations.find(a => a.name.toLowerCase().includes('walk')) || gltf.animations[0];
    if (clip) {
        walkAction = mixer.clipAction(clip);
        walkAction.play();
        walkAction.paused = true;
    }
}, undefined, console.error);

// Cofre flotante
let chest;
loader.load('../MODELOS/Treasure Chest.glb', (gltf) => {
    chest = gltf.scene;
    chest.scale.set(2, 2, 2);
    chest.position.set(-6, 1, -35);
    chest.rotation.y = Math.PI;
    chest.userData.baseY = chest.position.y;
    scene.add(chest);
}, undefined, console.error);

// Movimiento del robot
const keys = {};
document.addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
document.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);

function updateMovement(delta) {
    if (!robot) return;

    const speed = 20 * delta;
    const forward = new THREE.Vector3().subVectors(robot.position, camera.position);
    forward.y = 0;
    forward.normalize();

    const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

    const moving = keys['w'] || keys['a'] || keys['s'] || keys['d'];

    if (moving) {
        if (keys['w']) robot.position.addScaledVector(forward, speed);
        if (keys['s']) robot.position.addScaledVector(forward, -speed);
        if (keys['a']) robot.position.addScaledVector(right, -speed);
        if (keys['d']) robot.position.addScaledVector(right, speed);
    }

    if (walkAction) {
        if (moving && !isWalking) {
            walkAction.paused = false;
            isWalking = true;
        } else if (!moving && isWalking) {
            walkAction.paused = true;
            isWalking = false;
        }
    }
}

// Raycaster para clic sobre el cofre
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
window.addEventListener('click', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    if (chest) {
        const intersects = raycaster.intersectObject(chest, true);
        if (intersects.length > 0) {
            const popup = document.getElementById('popup');
            if (popup) popup.style.display = 'block';
        }
    }
});

// Animación
const clock = new THREE.Clock();
function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();

    updateMovement(delta);

    if (mixer) mixer.update(delta);

    if (robot) {
        // Hacer que el robot dé la espalda a la cámara
        const toCamera = new THREE.Vector3().subVectors(camera.position, robot.position);
        toCamera.y = 0;
        const opposite = robot.position.clone().sub(toCamera.normalize());
        robot.lookAt(opposite);

        // Posición de cámara relativa al robot
        const offset = new THREE.Vector3(0, 6, -10).applyQuaternion(robot.quaternion);
        camera.position.copy(robot.position.clone().add(offset));
        camera.lookAt(robot.position);
    }

    if (chest) {
        const t = clock.getElapsedTime();
        chest.position.y = chest.userData.baseY + Math.sin(t * 2) * 0.2;
    }

    renderer.render(scene, camera);
}
animate();

// Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
