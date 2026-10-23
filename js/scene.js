import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const canvas = document.querySelector('#bg');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(35, innerWidth / innerHeight, 0.1, 100);
camera.position.set(0, 0, 6);

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.SRGBColorSpace;

// Luz e reflexos
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

const key = new THREE.DirectionalLight(0xffe2b0, 2);
key.position.set(3, 4, 5);
scene.add(key);

const statue = new THREE.Group();
scene.add(statue);

// --- GERENCIADOR DE CARREGAMENTO ---
const progressBar = document.querySelector('.loader-progress');
const loaderElement = document.querySelector('#loader');

const manager = new THREE.LoadingManager();

// Atualiza a barra de progresso conforme os assets são baixados
manager.onProgress = (url, itemsLoaded, itemsTotal) => {
  const progress = (itemsLoaded / itemsTotal) * 100;
  if (progressBar) {
    progressBar.style.width = `${progress}%`;
  }
};

// Quando o carregamento estiver 100% completo
manager.onLoad = () => {
  if (progressBar) {
    progressBar.style.width = '100%';
  }

  // Pequeno atraso (400ms) para o usuário apreciar o 100% preenchido
  setTimeout(() => {
    if (loaderElement) {
      loaderElement.classList.add('fade-out');
      
      // Remove totalmente o elemento do DOM após a animação para liberar cliques
      setTimeout(() => {
        loaderElement.style.display = 'none';
      }, 800); // Deve corresponder ao tempo do CSS (0.8s)
    }
  }, 400);
};

// Carregar o modelo passando o manager
new GLTFLoader(manager).load(
  'assets/models/justica/scene.gltf',
  (gltf) => {
    const model = gltf.scene;

    model.rotation.y = Math.PI / -1.4;

    renderer.toneMappingExposure = 0.5;
    const keyLight = new THREE.DirectionalLight(0xffe2b0, 1.5);
    keyLight.position.set(-3, 3, 2);
    scene.add(keyLight);

    const rim = new THREE.DirectionalLight(0xc9a24b, 3);
    rim.position.set(3, 2, -4);
    scene.add(rim);

    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    model.scale.setScalar(3 / size.y);

    const box2 = new THREE.Box3().setFromObject(model);
    const center = box2.getCenter(new THREE.Vector3());
    model.position.sub(center);

    statue.add(model);
    statue.position.x = 0.5;
    statue.position.y = -0.4;
    statue.position.z = 4.2;
  },
  undefined,
  (error) => console.error('Erro ao carregar o modelo:', error)
);

// Exemplo opcional para afastar/ajustar a estátua em telas menores no scene.js:
const mediaQuery = window.matchMedia('(max-width: 768px)');

function handleTabletChange(e) {
  if (e.matches) {
    // No mobile, joga a estátua um pouco mais para o fundo ou centraliza com opacidade reduzida
    statue.position.x = 0; 
    statue.position.z = 3.5;
    if (renderer) renderer.toneMappingExposure = 0.3; // Deixa mais sutil para não brigar com o texto
  } else {
    statue.position.x = 0.9;
    statue.position.z = 4.2;
    if (renderer) renderer.toneMappingExposure = 0.5;
  }
}

mediaQuery.addListener(handleTabletChange);
handleTabletChange(mediaQuery);

function animate() {
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

export { statue, camera };