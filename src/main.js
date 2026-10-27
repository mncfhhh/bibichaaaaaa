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

// 2. Génération de la Galaxie
const particleGeo = new THREE.SphereGeometry(0.2, 8, 8);
const particleMat = new THREE.MeshBasicMaterial({ color: 0xff69b4 }); 
const particles = new THREE.Group();

for(let i = 0; i < 300; i++) {
    const mesh = new THREE.Mesh(particleGeo, particleMat);
    const radius = 4 + Math.random() * 14;
    const angle = Math.random() * Math.PI * 2;

    mesh.position.x = Math.cos(angle) * radius;
    mesh.position.z = Math.sin(angle) * radius;
    mesh.position.y = (Math.random() - 0.5) * 2; 

    // Stocker les données de trajectoire
    mesh.userData = { angle, radius, speed: 0.002 + Math.random() * 0.005 };
    particles.add(mesh);
}
scene.add(particles);

// 3. Animation et Rendu
function animate() {
    requestAnimationFrame(animate);

    particles.children.forEach(p => {
        p.userData.angle += p.userData.speed;
        p.position.x = Math.cos(p.userData.angle) * p.userData.radius;
        p.position.z = Math.sin(p.userData.angle) * p.userData.radius;
    });

    renderer.render(scene, camera);
}
animate();
