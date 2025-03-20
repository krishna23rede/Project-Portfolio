// Correct Three.js, OrbitControls, and GLTFLoader imports
import * as THREE from "https://cdn.skypack.dev/three@0.132.2/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/loaders/GLTFLoader.js";

// Create a Three.js Scene
const scene = new THREE.Scene();

// Create a new camera with position and angles
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

// Keep the object in a global variable
let object;

// OrbitControls allow the camera to move around the scene
let controls;

// Initialize GLTFLoader to load the 3D model
const loader = new GLTFLoader();

// Correct file path to your 3D model (ensure correct path)
loader.load(
    `Models/eye/scene.gltf`, // Check if the path is correct
    function (gltf) {
        object = gltf.scene;
        object.scale.set(5, 5, 5); // Optional: Adjust scale if the model is too small

        // Set initial rotation to 90 degrees on Y-axis
        object.rotation.y = Math.PI / -2;

        scene.add(object);
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100).toFixed(2) + '% loaded');
    },
    function (error) {
        console.error('Error loading model:', error);
    }
);

// Create the WebGL renderer and set its size
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// Append the renderer to the HTML container
document.getElementById('container3D').appendChild(renderer.domElement);

// Set camera position to focus on the model
camera.position.z = 50;

// Add directional light
const toplight = new THREE.DirectionalLight(0xffffff, 1);
toplight.position.set(500, 500, 500);
toplight.castShadow = true;
scene.add(toplight);

// Add ambient light
const ambientLight = new THREE.AmbientLight(0x333333, 1);
scene.add(ambientLight);

// Initialize OrbitControls to allow camera movement
controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;

// Track mouse position
let mouse = { x: 0, y: 0 };
let isTrackingEnabled = true; // Toggle to enable/disable tracking

// Track mouse movement
window.addEventListener('mousemove', (event) => {
    if (isTrackingEnabled) {
        // Normalize mouse position to [-1, 1]
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }
});

// Toggle tracking on left-click
window.addEventListener('mousedown', (event) => {
    if (event.button === 0) { // 0 = Left-click
        isTrackingEnabled = !isTrackingEnabled;
        console.log(isTrackingEnabled ? 'Tracking Enabled' : 'Tracking Disabled');
    }
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate the model to follow the mouse position if tracking is enabled
    if (object && isTrackingEnabled) {
        const targetX = mouse.x * Math.PI * 0.25; // Limit rotation on X-axis
        const targetY = mouse.y * Math.PI * -0.25; // Limit rotation on Y-axis
        object.rotation.y = Math.PI / -2 + targetX; // Keep initial rotation + offset
        object.rotation.x = targetY;
    }

    controls.update(); // Required for damping to work
    renderer.render(scene, camera);
}

// Handle window resize to maintain aspect ratio
window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start the animation
animate();
