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
