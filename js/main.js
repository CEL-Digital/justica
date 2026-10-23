import { statue, camera } from './scene.js';

gsap.registerPlugin(ScrollTrigger);

// Timeline com movimentos bem suaves, mantendo a estátua sempre à direita
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: 'body',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 1
  }
});

// Rotação suave e controlada (apenas um giro parcial elegante)
tl.to(statue.rotation, {
  y: Math.PI * 0.6, // Gira sutilmente para mostrar outro ângulo
  ease: 'none'
}, 0)

// Micro-deslocamento vertical sutil para dar sensação de flutuação/profundidade
.to(statue.position, {
  y: 0.1, // Sobe levemente ao longo da página
  ease: 'none'
}, 0);