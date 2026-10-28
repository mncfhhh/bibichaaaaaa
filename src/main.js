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

// --- Ajout du Cœur 3D au centre ---
const heartGeometry = new THREE.BufferGeometry();
const nbHeartParticles = 1500;
const heartPositions = new Float32Array(nbHeartParticles * 3);

for(let i = 0; i < nbHeartParticles; i++) {
    const t = Math.random() * Math.PI * 2;
    
    // Équation mathématique du cœur (réduite avec * 0.15)
    const x = 16 * Math.pow(Math.sin(t), 3) * 0.15;
    const y = (13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t)) * 0.15;
    const z = (Math.random() - 0.5) * 1.5; // Épaisseur du cœur

    // Légère dispersion
    const i3 = i * 3;
    heartPositions[i3] = x + (Math.random() - 0.5) * 0.2;
    heartPositions[i3 + 1] = y + (Math.random() - 0.5) * 0.2;
    heartPositions[i3 + 2] = z;
}

heartGeometry.setAttribute('position', new THREE.BufferAttribute(heartPositions, 3));

const heartMaterial = new THREE.PointsMaterial({
    color: 0xff1493, // Rose très vif
    size: 0.15,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
});

const heart = new THREE.Points(heartGeometry, heartMaterial);
heart.position.y = 4; // On le place à la bonne hauteur pour la caméra
heart.scale.set(0, 0, 0); // On le cache au début (taille zéro)
scene.add(heart); 


// --- Textes d'Amour Orbitaux ---
const messages = [
    "MON AMOUR ÉTERNEL", "TU ES MAGIQUE", "JOYEUX ANNIVERSAIRE", 
    "JE T'AIME", "MON UNIVERS", "POUR TOUJOURS"
];
const floatingLabels = [];

messages.forEach((msg, index) => {
    // Création de l'élément HTML pour chaque message
    const textDiv = document.createElement('div');
    textDiv.textContent = msg;
    textDiv.style.position = 'absolute';
    textDiv.style.color = '#ffb6c1'; // Rose clair
    textDiv.style.fontFamily = 'Arial, sans-serif';
    textDiv.style.fontWeight = 'bold';
    textDiv.style.fontSize = '12px';
    textDiv.style.letterSpacing = '2px';
    textDiv.style.textShadow = '0 0 10px #ff1493'; // Effet néon
    textDiv.style.pointerEvents = 'none'; // Ne bloque pas les clics
    textDiv.style.display = 'none'; // Masqué au début
    document.body.appendChild(textDiv);
    
    // Position initiale en cercle (rayon de 10)
    const angle = (index / messages.length) * Math.PI * 2;
    const radius = 10; 
    
    floatingLabels.push({
        element: textDiv,
        pos: new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius),
        angle: angle,
        radius: radius
    });
});


// 3. Interactivité et Rendu
let isJourneyStarted = false;

document.getElementById('startBtn').addEventListener('click', () => {
    // Masque l'interface HTML
    document.getElementById('ui-container').style.display = 'none';
    // Déclenche l'animation 3D
    isJourneyStarted = true;
});

let heartScale = 0;

function animate() {
    requestAnimationFrame(animate);

    // Rotation globale de la galaxie
    particles.rotation.y -= 0.002;

    if (isJourneyStarted) {
        if (camera.position.z > 6) {
            // Phase 1 : Le zoom de la caméra
            camera.position.z -= 0.2;
            camera.position.y -= 0.05;
            particles.rotation.y -= 0.01; 
        } else {
            // Phase 2 : Le cœur apparaît et bat
            if (heartScale < 1) {
                heartScale += 0.02;
            }
            const time = Date.now() * 0.005;
            const pulse = heartScale + Math.sin(time) * 0.08 * heartScale;
            
            heart.scale.set(pulse, pulse, pulse);
            heart.rotation.y += 0.005; 

            // Phase 3 : Animation des textes orbitaux
            floatingLabels.forEach(label => {
                label.element.style.display = 'block';
                
                // Faire tourner le texte
                label.angle += 0.003;
                label.pos.x = Math.cos(label.angle) * label.radius;
                label.pos.z = Math.sin(label.angle) * label.radius;

                // Convertir la 3D en 2D pour l'écran
                const vector = label.pos.clone();
                vector.project(camera);

                // Afficher uniquement si le texte est dans le champ de vision
                if (vector.z < 1) {
                    const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
                    const y = -(vector.y * 0.5 - 0.5) * window.innerHeight;
                    label.element.style.left = `${x}px`;
                    label.element.style.top = `${y}px`;
                    label.element.style.transform = 'translate(-50%, -50%)'; 
                } else {
                    label.element.style.display = 'none';
                }
            });
        }
    }

    renderer.render(scene, camera);
}
animate();
