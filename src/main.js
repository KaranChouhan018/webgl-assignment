import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { FresnelMaterial } from './FresnelMaterial.js';
import { setupUI } from './ui.js';
import Stats from 'stats.js';

let scene, camera, renderer, controls;
let sphere;
let material;
let stats;

function init() {

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050505);


    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, window.innerWidth < 768 ? 12 : 8);


    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    document.body.appendChild(renderer.domElement);


    stats = new Stats();
    stats.showPanel(0);
    document.body.appendChild(stats.dom);


    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();


    scene.add(new THREE.AmbientLight(0xffffff, 0.2));


    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.9;


    material = new FresnelMaterial({
        color: 0xc482ff,
        roughness: 0.75,
        metalness: 0.8
    });

    const geometry = new THREE.SphereGeometry(2, 256, 256);
    sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    const loadingScreen = document.querySelector('.loading-overlay');
    const loadingBar = document.querySelector('.loading-bar');

    if (loadingScreen && loadingBar) {
        // Wait for the CSS loading bar animation to finish before fading out
        loadingBar.addEventListener('animationend', () => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => loadingScreen.remove(), 500);
        });
    } else if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        setTimeout(() => loadingScreen.remove(), 500);
    }


    window.addEventListener('resize', onWindowResize);


    setupUI(material);


    renderer.setAnimationLoop(animate);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));


    camera.position.z = window.innerWidth < 768 ? 12 : 8;
}

function animate(time) {
    stats.begin();

    controls.update();



    renderer.render(scene, camera);

    stats.end();
}

// Bootstrap
init();
