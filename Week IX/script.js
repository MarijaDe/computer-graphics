import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(1, 1, 2);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.3);
scene.add(directionalLight);

const spotLight = new THREE.SpotLight(0xffffff, 3.6, 10, Math.PI * 0.3);
scene.add(spotLight);
scene.add(spotLight.target);

const pointLight = new THREE.PointLight(0xffffff, 2.7);
scene.add(pointLight);

const material = new THREE.MeshStandardMaterial({ roughness: 0.7, metalness: 0 });

// Sphere
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
scene.add(sphere);

// Plane
const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.5;
scene.add(plane);

// Box
const box = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), material);
box.position.set(0, 0.25, -0.5);
scene.add(box);

// Cylinder
const cylinder = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 1, 32), material);
cylinder.position.set(1.5, 0.5, -0.5);
scene.add(cylinder);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Resize handling
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

const clock = new THREE.Clock();

function animate() {
    const elapsedTime = clock.getElapsedTime();

    // Sphere animation
    sphere.position.x = Math.cos(elapsedTime) * 1.5;
    sphere.position.z = Math.sin(elapsedTime) * 1.5;
    sphere.position.y = Math.abs(Math.sin(elapsedTime * 3));

    // Box animation
    box.rotation.x = elapsedTime;
    box.rotation.y = elapsedTime;

    // Cylinder animation
    cylinder.position.y = 0.5 + Math.abs(Math.sin(elapsedTime * 2)) * 0.5;

    controls.update();

    renderer.render(scene, camera);

    requestAnimationFrame(animate);
}

animate();
