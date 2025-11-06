import * as THREE from 'three';
import { GLTFLoader } from 'https://unpkg.com/three@0.162.0/examples/jsm/loaders/GLTFLoader.js';

let scene, camera, renderer;
let grass, sun, doro;
let sunScroll = 0;

const sceneContainer = document.querySelector("#scene-container");
const degToRad = (deg) => deg * (Math.PI / 180);

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, sceneContainer.clientWidth / sceneContainer.clientHeight, 0.1, 1000);
    camera.position.set(0, 2, 8);
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(sceneContainer.clientWidth, sceneContainer.clientHeight);
    sceneContainer.appendChild(renderer.domElement);
    
    loadScene();
}

function loadScene() {
    createGround();
    createSun();
    createLighting();
    loadModel();
}

function createGround() {
    const geometry = new THREE.PlaneGeometry(16, 16);
    const texture = new THREE.TextureLoader().load('assets/grass.jpg');
    const material = new THREE.MeshBasicMaterial({ map: texture });
    
    grass = new THREE.Mesh(geometry, material);
    grass.rotation.x = degToRad(-90);
    grass.position.y = -1;
    scene.add(grass);
}

function createSun() {
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const texture = new THREE.TextureLoader().load('assets/sun.png');
    const material = new THREE.MeshBasicMaterial({ map: texture });
    
    sun = new THREE.Mesh(geometry, material);
    sun.position.set(0, 5, 0);
    scene.add(sun);
}

function createLighting() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 5);
    scene.add(directionalLight);
}

function loadModel() {
    const loader = new GLTFLoader();
    
    loader.load(
        'assets/doro.gltf',
        (gltf) => {
            doro = gltf.scene;
            doro.scale.set(2, 2, 2);
            doro.position.set(0, 0, 0);
            scene.add(doro);
        },
        (xhr) => console.log(`${(xhr.loaded / xhr.total * 100).toFixed(2)}% loaded`),
        (error) => console.error('Error loading model:', error)
    );
}

function animate() {
    requestAnimationFrame(animate);
    
    if (doro) doro.rotation.y += 0.01;
    
    sun.rotation.y += 0.002;
    sunScroll += 1;
    
    sun.position.x = 3 * Math.sin(sunScroll / 500);
    sun.position.z = 3 * Math.cos(sunScroll / 500);
    
    renderer.render(scene, camera);
}

window.addEventListener("wheel", (event) => sunScroll += event.deltaY / 3);

function onWindowResize() {
    camera.aspect = sceneContainer.clientWidth / sceneContainer.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(sceneContainer.clientWidth, sceneContainer.clientHeight);
}

window.addEventListener('resize', onWindowResize, false);

init();
animate();