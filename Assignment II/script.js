import * as THREE from 'three';

// Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Classroom Walls (A Cube)
const roomSize = 20;
const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xd3d3d3, side: THREE.BackSide });
const roomGeometry = new THREE.BoxGeometry(roomSize, roomSize, roomSize);
const room = new THREE.Mesh(roomGeometry, wallMaterial);
scene.add(room);

// Camera Position
camera.position.set(0, 2, 8);

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();
