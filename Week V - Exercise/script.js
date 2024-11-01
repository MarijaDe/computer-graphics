import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


const scene = new THREE.Scene();

const geometry = new THREE.BufferGeometry();
const count = 10; // Set the number of vertices
const positionsArray = new Float32Array(count * 3); // Create an array for vertex positions

// Generate random positions for vertices
for (let i = 0; i < count * 3; i++) {
    positionsArray[i] = (Math.random() - 0.5) * 4; // Randomize vertex positions
}
const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);
geometry.setAttribute('position', positionsAttribute);

// Change Material
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 }); // Green color
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Ambient light 
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // White light with intensity of 0.5
scene.add(ambientLight);

// Directional light 
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5).normalize();
scene.add(directionalLight);


const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};

// Create camera and set its position
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(2, 2, 5); // Adjust camera position to see the object clearly
scene.add(camera);

// Add controls for interaction
const controls = new OrbitControls(camera, document.body);
controls.enableDamping = false; // Disable damping for immediate response

// Set up renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

// Handle window resizing
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Animation loop
const tick = () => {
    mesh.rotation.x += 0.01; // Rotate mesh around x-axis
    mesh.rotation.y += 0.01; // Rotate mesh around y-axis

    controls.update(); // Update controls
    renderer.render(scene, camera); // Render scene

    window.requestAnimationFrame(tick); // Repeat for next frame
};

tick(); 