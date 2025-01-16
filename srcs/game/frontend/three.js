import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';


const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth , window.innerHeight);
renderer.domElement.className = 'three-canvas';
document.body.appendChild(renderer.domElement);

let blender_camera;
let model;

const loader = new GLTFLoader();
loader.load('assets/pongv2.2.glb', (gltf) => {
    scene.add(gltf.scene);
    model = gltf;
}, undefined, (error) => {
    console.error('An error occurred while loading the model:', error);
});

function animate() {
    if (!scene.children.length) {
        requestAnimationFrame(animate);
        return;
    }
    else{
        blender_camera = model.cameras[0];
        const lights = new THREE.AmbientLight(0xfffff);
        scene.add(lights);
        if (blender_camera)
            renderer.render(scene, blender_camera);
        requestAnimationFrame(animate);
    }
}

animate();

const socket = new WebSocket('ws://localhost:8000/ws/game/');

socket.onopen = function(event) {
    console.log('WebSocket connection established');
    socket.send(JSON.stringify({ message: 'Hello Server!' }));
};

socket.onmessage = function(event) {
    const data = JSON.parse(event.data);
    console.log('Message from server:', data);
};

socket.onclose = function(event) {
    console.log('WebSocket connection closed:', event);
};

socket.onerror = function(error) {
    console.error('WebSocket error:', error);
};