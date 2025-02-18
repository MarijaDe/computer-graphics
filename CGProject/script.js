import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { TextureLoader } from 'three';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(1, 1.6, 4);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

const textureLoader = new THREE.TextureLoader();
const planeTexture = textureLoader.load('/textures/gravelly_sand_diff_4k.jpg');
const roadTexture = textureLoader.load('/textures/gravel_road_diff_4k.jpg');
const capsuleAmbientTexture = textureLoader.load('/textures/Sci-fi_Metal_Mesh_002_SD/Sci-fi_Metal_Mesh_002_ambientOcclusion.png');
const capsuleBaseTexture = textureLoader.load('/textures/Sci-fi_Metal_Mesh_002_SD/Sci-fi_Metal_Mesh_002_basecolor.png');
const capsuleHeightTexture = textureLoader.load('/textures/Sci-fi_Metal_Mesh_002_SD/Sci-fi_Metal_Mesh_002_height.png');
const capsuleMetallicTexture = textureLoader.load('/textures/Sci-fi_Metal_Mesh_002_SD/Sci-fi_Metal_Mesh_002_metallic.png');
const capsuleNormalTexture = textureLoader.load('/textures/Sci-fi_Metal_Mesh_002_SD/Sci-fi_Metal_Mesh_002_normal.png');
const capsuleRoughnessTexture = textureLoader.load('/textures/Sci-fi_Metal_Mesh_002_SD/Sci-fi_Metal_Mesh_002_roughness.png');
//lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 10;
directionalLight.shadow.camera.top = 4;
directionalLight.shadow.camera.right = 4;
directionalLight.shadow.camera.bottom = -3;
directionalLight.shadow.camera.left = -5;
directionalLight.shadow.radius = 15;
directionalLight.position.set(4,3.5,-2);
scene.add(directionalLight);

const directionalLightHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
scene.add(directionalLightHelper);
directionalLightHelper.visible = false;

const spotLight = new THREE.SpotLight(0xffffff, 25, 10, Math.PI * 0.1, Math.PI * 0.1);
spotLight.castShadow = true;
spotLight.shadow.mapSize.set (1024,1024);
spotLight.shadow.camera.near = 1;
spotLight.shadow.camera.far = 8;
spotLight.position.set(3,3,5);
scene.add(spotLight);
scene.add(spotLight.target);

const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
scene.add(spotLightCameraHelper);
spotLightCameraHelper.visible = false;

const pointLight = new THREE.PointLight(0x7d0000, 2.7);
pointLight.castShadow = true;
pointLight.shadow.mapSize.set(1024,1024);
pointLight.shadow.camera.near = 0.1;
pointLight.shadow.camera.far = 2;
pointLight.position.set(3, 0.3, -2.5);
scene.add(pointLight);

const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera);
scene.add(pointLightCameraHelper);
pointLightCameraHelper.visible = false;


const material = new THREE.MeshStandardMaterial({ 
    roughness: 0.5, 
    metalness: 1, 
    map: capsuleBaseTexture,
    normalMap: capsuleNormalTexture,
    displacementMap: capsuleHeightTexture,
    displacementScale: 0.1,
    roughnessMap: capsuleRoughnessTexture,
    aoMap: capsuleAmbientTexture,
    //metalnessMap: capsuleMetallicTexture
});

const capsule = new THREE.Mesh(new THREE.CapsuleGeometry(0.25,0.2,8,6), material);
capsule.position.y = 0.2;
capsule.position.z = 2.4;
capsule.rotation.x = 90 * (Math.PI / 180);
capsule.geometry.attributes.uv2 = capsule.geometry.attributes.uv;
capsule.castShadow = true;
scene.add(capsule);

//plane
const groundGeometry = new THREE.PlaneGeometry(10, 8, 32, 32);
groundGeometry.rotateX(-Math.PI / 2);
const groundMaterial = new THREE.MeshStandardMaterial({
  color: 0x555555,
  side: THREE.DoubleSide,
  map: planeTexture
});
const plane = new THREE.Mesh(groundGeometry, groundMaterial);
plane.castShadow = false;
plane.receiveShadow = true;
scene.add(plane);

//roads
const roadGeometry = new THREE.PlaneGeometry(10, 0.7, 32, 32);
roadGeometry.rotateX(-Math.PI / 2);
const roadMaterial = new THREE.MeshStandardMaterial({
    color: 0x555555,
    side: THREE.DoubleSide,
    map: roadTexture,
  });
const road = new THREE.Mesh(roadGeometry, roadMaterial);
road.castShadow = false;
road.receiveShadow = true;
road.position.y = 0.001;
road.position.z = 2.2;
scene.add(road);

//barriers
const barrierLoader = new GLTFLoader().setPath('barrier/');
barrierLoader.load('scene.gltf', (gltf) => {
    const barrierMesh = gltf.scene;
    barrierMesh.position.set(0, -0.1, 1);
    barrierMesh.scale.set(0.2,0.2,0.2);
    barrierMesh.rotation.y = 90 * (Math.PI / 180);

    barrierMesh.traverse((child) =>{
        if(child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });
    scene.add(barrierMesh);
});

const barrierLoader2 = new GLTFLoader().setPath('barrier/');
barrierLoader2.load('scene.gltf', (gltf) => {
    const barrierMesh2 = gltf.scene;
    barrierMesh2.position.set(1.5, -0.1, 1.3);
    barrierMesh2.scale.set(0.2,0.2,0.2);
    barrierMesh2.rotation.y = -60 * (Math.PI / 180);

    barrierMesh2.traverse((child) =>{
        if(child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });
    scene.add(barrierMesh2);
});

const barrierLoader3 = new GLTFLoader().setPath('barrier/');
barrierLoader3.load('scene.gltf', (gltf) => {
    const barrierMesh3 = gltf.scene;
    barrierMesh3.position.set(-1.8, -0.1, 1.4);
    barrierMesh3.scale.set(0.2,0.2,0.2);
    barrierMesh3.rotation.y = 60 * (Math.PI / 180);

    barrierMesh3.traverse((child) =>{
        if(child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });
    scene.add(barrierMesh3);
});

const barrierLoader4 = new GLTFLoader().setPath('barrier/');
barrierLoader4.load('scene.gltf', (gltf) => {
    const barrierMesh4 = gltf.scene;
    barrierMesh4.position.set(3.3, -0.1, 1.1);
    barrierMesh4.scale.set(0.2,0.2,0.2);
    barrierMesh4.rotation.y = 20 * (Math.PI / 180);

    barrierMesh4.traverse((child) =>{
        if(child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });
    scene.add(barrierMesh4);
});

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

//let part;
const loader = new GLTFLoader().setPath('public/');
loader.load('scene.gltf', (gltf) => {
    const mesh = gltf.scene;
    mesh.position.set(0, 0.8, -1);
    mesh.scale.set(0.01,0.01,0.01);

    console.log(mesh);
    mesh.traverse((child) =>{
        console.log(child.name);
        if(child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

    // Event Listener for Mouse Click
    window.addEventListener('click', (event) => {
        // Convert Mouse Position to Normalized Device Coordinates (-1 to +1)
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
        // Raycast
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(mesh);
    
        if (intersects.length > 0) {
            showPopup(event.clientX, event.clientY);
        }
    });

    scene.add(mesh);
    //part = mesh.getObjectByName("Object_6");
});

const loader2 = new GLTFLoader().setPath('public/');
loader2.load('scene.gltf', (gltf) => {
    const mesh2 = gltf.scene;
    mesh2.position.set(3, 0.3, -3);
    mesh2.scale.set(0.01,0.01,0.01);
    mesh2.rotation.x = -10 * (Math.PI / 180);
    mesh2.rotation.z = 3 * (Math.PI / 180);

    mesh2.traverse((child) =>{
        if(child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

    // Event Listener for Mouse Click
    window.addEventListener('click', (event) => {
        // Convert Mouse Position to Normalized Device Coordinates (-1 to +1)
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
        // Raycast
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(mesh2);
    
        if (intersects.length > 0) {
            showPopup(event.clientX, event.clientY);
        }
    });

    scene.add(mesh2);
});

const loader3 = new GLTFLoader().setPath('public/');
loader3.load('scene.gltf', (gltf) => {
    const mesh3 = gltf.scene;
    mesh3.position.set(-3, 0.5, -2.2);
    mesh3.scale.set(0.01,0.01,0.01);
    mesh3.rotation.x = -5 * (Math.PI / 180);

    mesh3.traverse((child) =>{
        if(child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

    // Event Listener for Mouse Click
    window.addEventListener('click', (event) => {
        // Convert Mouse Position to Normalized Device Coordinates (-1 to +1)
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
        // Raycast
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(mesh3);
    
        if (intersects.length > 0) {
            showPopup(event.clientX, event.clientY);
        }
    });

    scene.add(mesh3);
});

// Raycaster and Mouse
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Function to Show Popup
function showPopup(x, y) {
    const popup = document.getElementById("popup");
    popup.style.left = `${x}px`;
    popup.style.top = `${y}px`;
    popup.style.display = "block";

    // Hide after 2 seconds
    setTimeout(() => {
        popup.style.display = "none";
    }, 2000);
}

//Animation
function animate() {
    const elapsedTime = clock.getElapsedTime();
    // if(part)
    //     part.rotation.z += 0.1;

    spotLight.target.position.x = Math.cos(elapsedTime) * 4;
    //spotLight.position.z = Math.sin(elapsedTime) * 4;
    //spotLight.position.y = Math.abs(Math.sin(elapsedTime * 3));
    capsule.position.x = Math.sin(elapsedTime) * 4;
    capsule.rotation.y += 0.1;
    // capsule.rotation.x += 0.1;
    //capsule.rotation.z += 0.1;

    controls.update();

    renderer.render(scene, camera);

    requestAnimationFrame(animate);
}

animate();