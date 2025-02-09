import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

function init() {
  // Set up the scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x383635); // Set background color

  // Set up the camera
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(5, 5, 5); // Position the camera

  // Create and configure the renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement); // Attach the renderer to the HTML document

  // Load textures
  const textureLoader = new THREE.TextureLoader();
  const floorTexture = textureLoader.load('textures/Cracks_152.jpg');
  const wallTexture = textureLoader.load('textures/Cracks_138.jpg');
  const ceilingTexture = textureLoader.load('textures/Cracks-0748.jpg');

  // Set texture wrapping and repetitions
  [floorTexture, wallTexture, ceilingTexture].forEach(tex => {
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  });
  floorTexture.repeat.set(5, 5); // Repeat the floor texture 5 times both horizontally and vertically
  wallTexture.repeat.set(5, 1); // Repeat the wall texture horizontally 5 times
  ceilingTexture.repeat.set(5, 5); // Repeat the ceiling texture

  // Create the classroom
  const roomMaterials = [
    new THREE.MeshStandardMaterial({ map: wallTexture, side: THREE.BackSide }),    // Left wall
    new THREE.MeshStandardMaterial({ map: wallTexture, side: THREE.BackSide }),    // Right wall
    new THREE.MeshStandardMaterial({ map: ceilingTexture, side: THREE.BackSide }),   // Ceiling
    new THREE.MeshStandardMaterial({ map: floorTexture, side: THREE.BackSide }),     // Floor
    new THREE.MeshStandardMaterial({ map: wallTexture, side: THREE.BackSide }),      // Back wall
    new THREE.MeshStandardMaterial({ map: wallTexture, side: THREE.BackSide })       // Front wall
  ];
  const roomGeometry = new THREE.BoxGeometry(9, 4, 15); // Create a box for the room geometry
  const classroom = new THREE.Mesh(roomGeometry, roomMaterials);
  classroom.receiveShadow = true; // Enable shadows for the room
  scene.add(classroom);

  // Model loading helper function
  /**
   * Loads a GLTF model with specified options like scale, position, and rotation.
   * @param {string} url  - The URL of the GLTF model file.
   * @param {Object} options - Configuration options for the model.
   * @param {THREE.Vector3} [options.scale]
   * @param {THREE.Vector3} [options.position] 
   * @param {THREE.Vector3} [options.rotation] 
   * @param {function} [options.onLoad]
   */
  function loadModel(url, { 
    scale = new THREE.Vector3(1, 1, 1), 
    position = new THREE.Vector3(), 
    rotation = new THREE.Vector3(), 
    onLoad = () => {} 
  } = {}) {
    const loader = new GLTFLoader();
    loader.load(
      url,
      (gltf) => {
        const model = gltf.scene;
        model.scale.copy(scale); // Apply scale
        model.position.copy(position); // Set position
        model.rotation.set(rotation.x, rotation.y, rotation.z); // Apply rotation
        model.traverse(child => {
          if (child.isMesh) {
            child.castShadow = true; // Enable shadow casting for meshes
            child.receiveShadow = true; // Enable shadow receiving for meshes
          }
        });
        scene.add(model); // Add model to the scene
        onLoad(model); // Optional callback after the model is loaded
      },
      undefined,
      (error) => {
        console.error(`Error loading model from ${url}:`, error);
      }
    );
  }

  // Function to Spawn 
  function spawnFurniture(offset) {
    // Load a desk with an offset position
    loadModel('models/school_desk.glb', {
      scale: new THREE.Vector3(4, 3, 4),
      position: new THREE.Vector3(0, -2, -0.6).add(offset)
    });
    // Load two chairs with different positions and rotations
    loadModel('models/school_chair.glb', {
      scale: new THREE.Vector3(3, 3, 3),
      position: new THREE.Vector3(-1, -2, -0.5).add(offset),
      rotation: new THREE.Vector3(0, -Math.PI, 0)
    });
    loadModel('models/school_chair.glb', {
      scale: new THREE.Vector3(3, 3, 3),
      position: new THREE.Vector3(-1.8, -2, -0.5).add(offset),
      rotation: new THREE.Vector3(0, -Math.PI, 0)
    });
  }

  // Spawn multiple sets
  const furnitureOffsets = [
    new THREE.Vector3(2, 0, 2),
    new THREE.Vector3(-2, 0, 2),
    new THREE.Vector3(2, 0, 0),
    new THREE.Vector3(-2, 0, 0),
    new THREE.Vector3(2, 0, -2),
    new THREE.Vector3(-2, 0, -2),
    new THREE.Vector3(2, 0, -4),
    new THREE.Vector3(-2, 0, -4)
  ];
  furnitureOffsets.forEach(offset => spawnFurniture(offset));

  loadModel('models/school_desk.glb', {
    scale: new THREE.Vector3(4, 3, 4),
    position: new THREE.Vector3(-2, -2, 4),
    rotation: new THREE.Vector3(0, -Math.PI, 0)
  });
  loadModel('models/school_chair.glb', {
    scale: new THREE.Vector3(3, 3, 3),
    position: new THREE.Vector3(-0.5, -2, 4.2),
    rotation: new THREE.Vector3(0, 20, 0)
  });

  // Door Model/Barricade
  loadModel('models/Barricade.glb', {
    scale: new THREE.Vector3(1.5, 1.5, 1.5),
    position: new THREE.Vector3(-4.2, -1, 6)
  });

  // --- Function to Add a Window Light ---
  /**
   * Adds a spotlight simulating sunlight coming through a window.
   * @param {THREE.Vector3} lightPos - The position of the light.
   * @param {THREE.Vector3} targetPos - The target position for the spotlight.
   */
  function addWindowLight(lightPos, targetPos) {
    const spotLight = new THREE.SpotLight(0xfdfbd3, 3, 50, Math.PI / 1, 0.5, 2);
    spotLight.position.copy(lightPos); // Set light position
    spotLight.target.position.copy(targetPos); // Set light target
    spotLight.castShadow = true; // Enable shadow casting
    spotLight.shadow.mapSize.width = 1024; // Set shadow map size
    spotLight.shadow.mapSize.height = 1024;
    scene.add(spotLight); // Add light to the scene
    scene.add(spotLight.target); // Add light target
  }

  // Define window positions and light simulation
  const windowPositions = [
    { modelPos: new THREE.Vector3(4.4, -1, 5), lightPos: new THREE.Vector3(4.4, 0, 5), targetPos: new THREE.Vector3(3, -2, 5) },
    { modelPos: new THREE.Vector3(4.4, -1, 2), lightPos: new THREE.Vector3(4.4, 0, 2), targetPos: new THREE.Vector3(3, -2, 2) },
    { modelPos: new THREE.Vector3(4.4, -1, -1), lightPos: new THREE.Vector3(4.4, 0, -1), targetPos: new THREE.Vector3(3, -2, -1) },
    { modelPos: new THREE.Vector3(4.4, -1, -4), lightPos: new THREE.Vector3(4.4, 0, -4), targetPos: new THREE.Vector3(3, -2, -4) },
  ];

  windowPositions.forEach(win => {
    addWindowLight(win.lightPos, win.targetPos); // Add light for each window position
  });
  
  // -Set up orbit controls for the camera
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; // Enable smooth camera movement
  controls.dampingFactor = 0.1;

  // --- Animation Loop ---
  function animate() {
    requestAnimationFrame(animate); // Request next animation frame
    controls.update(); // Update controls
    renderer.render(scene, camera); // Render the scene
  }
  animate();

  // Handle window resizing
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight; // Update camera aspect ratio
    camera.updateProjectionMatrix(); // Update camera projection matrix
    renderer.setSize(window.innerWidth, window.innerHeight); // Resize the renderer
  });
}

init();