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

// 2. Génération de la Galaxie (Version Poussière d'Étoiles)
const nbParticules = 4000;
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(nbParticules * 3);
const colors = new Float32Array(nbParticules * 3);

const colorInside = new THREE.Color(0xffffff); // Cœur blanc lumineux
const colorOutside = new THREE.Color(0xff69b4); // Bords roses

const nbBras = 3;

for(let i = 0; i < nbParticules; i++) {
    const i3 = i * 3;
    
    // Rayon et angles pour la spirale
    const radius = Math.random() * 20;
    const spinAngle = radius * 0.4;
    const armAngle = (i % nbBras) * ((Math.PI * 2) / nbBras);
    
    // Dispersion concentrée vers le centre
    const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 2;
    const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 1.5;
    const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 2;

    positions[i3] = Math.cos(armAngle + spinAngle) * radius + randomX;
    positions[i3 + 1] = randomY;
    positions[i3 + 2] = Math.sin(armAngle + spinAngle) * radius + randomZ;

    // Dégradé de couleur selon la distance du centre
    const mixedColor = colorInside.clone();
    mixedColor.lerp(colorOutside, radius / 20);
    
    colors[i3] = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;
}

geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

const material = new THREE.PointsMaterial({
    size: 0.15,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending, // C'est ce qui crée l'effet lumineux !
    vertexColors: true
});

const particles = new THREE.Points(geometry, material);
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
    if (isJourneyStarted && camera.position.z > 6) {
        camera.position.z -= 0.2;
        camera.position.y -= 0.05;
        // Accélère la rotation pendant le zoom
        particles.rotation.y -= 0.01;
    }

    renderer.render(scene, camera);
}
animate();
