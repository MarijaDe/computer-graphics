import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

// Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Ambient light for general illumination
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1); // Point light for focused lighting
pointLight.position.set(5, 10, 5);
pointLight.intensity = 2; // Increase brightness

scene.add(pointLight);

/*const objLoader1 = new OBJLoader();
objLoader1.load(
  './chair 20-02-51-085/ImageToStl.com_painted_wooden_chair_02_4k.obj',
  (obj) => {
    obj.scale.set(0.5, 0.5, 0.5); // Adjust scale
    obj.position.set(0, 0, -5); // Place it directly in front of the camera
    scene.add(obj);
    console.log('Desk model loaded successfully');
  },
  undefined,
  (error) => {
    console.error('Error loading desk model:', error);
  }
); */

import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';

const mtlLoader = new MTLLoader();
mtlLoader.load('./models/desk/Desk_OBJ.mtl', (materials) => {
  materials.preload();
  
  const objLoader = new OBJLoader();
  objLoader.setMaterials(materials);
  
  objLoader.load('./models/desk/Desk OBJ.obj', (obj) => {
    obj.scale.set(0.5, 0.5, 0.5);
    obj.position.set(2, -1, -5);
    scene.add(obj);
    console.log('Desk model with materials loaded successfully');
  });
});





const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

cube.position.set(0, 0, -5); // Place cube in front of the camera

console.log('Scene children:', scene.children);


// Camera Position
camera.position.set(0, 2, 10); // Move back slightly
camera.lookAt(0, 0, -5); // Look at the center of the scene

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
