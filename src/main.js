import './style.css';
import * as THREE from 'three';

// 1. Initialisation de la scène
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 30;
camera.position.y = 10;
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 2. Génération de la Galaxie en Spirale
const particleGeo = new THREE.SphereGeometry(0.15, 8, 8);
const particleMat = new THREE.MeshBasicMaterial({ color: 0xff69b4 }); 
const particles = new THREE.Group();

const nbParticules = 800;
const nbBras = 3;

for(let i = 0; i < nbParticules; i++) {
    const mesh = new THREE.Mesh(particleGeo, particleMat);
    
    // Distribution en spirale
    const radius = Math.random() * 20; 
    const spinAngle = radius * 0.4; 
    const armAngle = (i % nbBras) * ((Math.PI * 2) / nbBras);
    
    // Dispersion aléatoire pour donner du volume
    const randomX = (Math.random() - 0.5) * 2;
    const randomY = (Math.random() - 0.5) * 1.5;
    const randomZ = (Math.random() - 0.5) * 2;

    mesh.position.x = Math.cos(armAngle + spinAngle) * radius + randomX;
    mesh.position.y = randomY;
    mesh.position.z = Math.sin(armAngle + spinAngle) * radius + randomZ;

    particles.add(mesh);
}
scene.add(particles);

// 3. Interactivité et Rendu
let isJourneyStarted = false;

document.getElementById('startBtn').addEventListener('click', () => {
    // Masque l'interface HTML
    document.getElementById('ui-container').style.display = 'none';
    // Déclenche l'animation 3D
    isJourneyStarted = true;
});

function animate() {
    requestAnimationFrame(animate);

    // Rotation globale de la galaxie
    particles.rotation.y -= 0.002;

    // Effet d'aspiration / Zoom au clic
    if (isJourneyStarted && camera.position.z > 2) {
        camera.position.z -= 0.2;
        camera.position.y -= 0.05;
        // Accélère la rotation pendant le zoom
        particles.rotation.y -= 0.01;
    }

    renderer.render(scene, camera);
}
animate();
