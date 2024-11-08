// Basic Three.js setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xa0d8f1); 

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(60, 90, 120);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); 
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(50, 100, 50);
scene.add(directionalLight);

// OrbitControls for interactive camera
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.1;
controls.minPolarAngle = Math.PI / 4;
controls.maxPolarAngle = Math.PI / 2;
controls.target.set(0, 0, 0);

// Materials
const grassMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 }); // Forest Green
const roadMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 }); // Dark Gray
const buildingMaterial = new THREE.MeshStandardMaterial({ color: 0xdedede });
const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });

const grass = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), grassMaterial); // Reduced size
grass.rotation.x = -Math.PI / 2;
grass.position.y = 0;
scene.add(grass);

// Roads
const roads = [
    { width: 10, height: 85, rotationZ: 120, position: [0, 0.1, 0] },
    { width: 18, height: 45, rotationZ: 0, position: [-28.5, 0.1, -9] },
    { width: 5, height: 30, rotationZ: 0, position: [-35, 0.1, 25] }
];
roads.forEach(road => {
    const roadMesh = new THREE.Mesh(new THREE.PlaneGeometry(road.width, road.height), roadMaterial);
    roadMesh.rotation.x = -Math.PI / 2;
    roadMesh.rotation.z = road.rotationZ * (Math.PI / 180);
    roadMesh.position.set(...road.position);
    scene.add(roadMesh);
});

// Buildings
const building1 = new THREE.Mesh(new THREE.BoxGeometry(12, 5, 5), buildingMaterial);
building1.position.set(-18, 2.5, 20);
building1.rotation.y = 30 * (Math.PI / 180);

const building2 = building1.clone();
building2.position.set(8, 2.5, 5);


const Restaurant = new THREE.Mesh(new THREE.BoxGeometry(12, 5, 20), buildingMaterial);
Restaurant.position.set(-28, 2.5, -20);

scene.add(building1, building2, Restaurant, );

// Animated Sphere
const sphere = new THREE.Mesh(new THREE.SphereGeometry(1, 30, 30), sphereMaterial);
sphere.position.set(-35, 1, 35);
scene.add(sphere);

// Animation for the sphere
gsap.to(sphere.position, {
    z: -30,
    duration: 5,
    repeat: -1,
    yoyo: true,
    ease: "power2.inOut"
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();
