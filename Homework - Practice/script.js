import * as THREE from 'three'

// Step 1: Create the scene
const scene = new THREE.Scene();

// Step 2: Set up the camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 3; // Move the camera 

// Step 3: Create the renderer and add it to the DOM
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Step 4: Create the geometry and material
const geometry = new THREE.SphereGeometry(1, 32, 32); 

// Add a material
const material = new THREE.MeshBasicMaterial({ color: 0x000000 });

// Create the mesh 
const globe = new THREE.Mesh(geometry, material);
scene.add(globe); // Add to the scene

// Step 5: Create a wireframe 
const wireframe = new THREE.WireframeGeometry(geometry); // Turn the geometry into wireframe
const wireframeMaterial = new THREE.LineBasicMaterial({ color: 0xffffff }); // White wireframe
const wireframeLines = new THREE.LineSegments(wireframe, wireframeMaterial);
scene.add(wireframeLines); // Add the wireframe to the scene

// Step 6: Animate rotation
function animate() {
    requestAnimationFrame(animate); // Loop the animation

    // Rotate both the globe and the wireframe for visibility
    globe.rotation.y += 0.01;  // Rotate on Y-axis
    globe.rotation.x += 0.005; // Slight tilt on X-axis

    wireframeLines.rotation.y += 0.01;  // Rotate wireframe in sync
    wireframeLines.rotation.x += 0.005; // Slight tilt in sync

    // Render the scene
    renderer.render(scene, camera);
}

// Start the animation
animate();

// Step 7: Handle window resizing to keep the figure centered
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
