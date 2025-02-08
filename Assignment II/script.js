import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const roomSize = 20;
const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xd3d3d3, side: THREE.BackSide });
const roomGeometry = new THREE.BoxGeometry(roomSize, roomSize, roomSize);
const room = new THREE.Mesh(roomGeometry, wallMaterial);
scene.add(room);

// Adjust camera position to be inside the cube
camera.position.set(0, roomSize / 4, roomSize / 3);

// Window texture
const textureLoader = new THREE.TextureLoader();
const windowTexture = textureLoader.load('./public/window/win-text.jpg');

const windowMaterial = new THREE.MeshStandardMaterial({
    map: windowTexture,
    side: THREE.BackSide
});

// Replace one wall with windows
const walls = room.material;
if (Array.isArray(walls)) {
    walls[2] = windowMaterial; // Assuming the third face is the window wall
} else {
    room.material = [
        wallMaterial,
        wallMaterial,
        windowMaterial,
        wallMaterial,
        wallMaterial,
        wallMaterial
    ];
}

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const overheadLight = new THREE.PointLight(0xffffff, 0.8);
overheadLight.position.set(0, roomSize / 2 - 1, 0);
scene.add(overheadLight);

// Function to load OBJ models
function loadOBJModel(path, position, rotation, scale) {
    return new Promise((resolve, reject) => {
        const loader = new OBJLoader();
        loader.load(
            path,
            function (object) {
                object.position.set(position.x, position.y, position.z);
                object.rotation.set(rotation.x, rotation.y, rotation.z);
                object.scale.set(scale, scale, scale);
                scene.add(object);
                resolve(object);
            },
            function (xhr) {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            function (error) {
                console.error('An error happened', error);
                reject(error);
            }
        );
    });
}

// Load chairs and desks
const modelPromises = [];

for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 2; col++) {
        const x = (col - 0.5) * 6;
        const z = (row - 0.5) * 6;

        // Load desk
        modelPromises.push(loadOBJModel('/public/desk/desk.obj', { x, y: 0, z }, { x: 0, y: 0, z: 0 }, 1));

        // Load chairs
        modelPromises.push(loadOBJModel('/public/chair/chair-obj.obj', { x: x - 0.75, y: 0, z: z + 0.75 }, { x: 0, y: Math.PI, z: 0 }, 1));
        modelPromises.push(loadOBJModel('/public/chair/chair-obj.obj', { x: x + 0.75, y: 0, z: z + 0.75 }, { x: 0, y: Math.PI, z: 0 }, 1));
    }
}

Promise.all(modelPromises).then(() => {
    console.log('All models loaded successfully');
}).catch((error) => {
    console.error('Error loading models:', error);
});

// OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();
