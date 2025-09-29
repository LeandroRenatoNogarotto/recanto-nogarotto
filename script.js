// Menu mobile
const menuToggleButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
if (menuToggleButton && nav) {
  menuToggleButton.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuToggleButton.setAttribute('aria-expanded', String(isOpen));
  });
}

// Lightbox da galeria
const galleryLinks = Array.from(document.querySelectorAll('.gallery a'));
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.querySelector('.lightbox-image.current');
const lightboxImageNext = document.querySelector('.lightbox-image.next');
const lightboxClose = document.querySelector('.lightbox-close');
const lightboxPrev = document.querySelector('.lightbox-prev');
const lightboxNext = document.querySelector('.lightbox-next');
let currentIndex = -1;

function openLightbox(href, index) {
  if (!lightbox || !lightboxImage) return;
  // transição de abertura mais suave
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  if (lightboxImage.src !== href) {
    lightboxImage.className = 'lightbox-image current slide-in-right';
    lightboxImage.src = href;
    // remove a classe após pintar o frame para acionar a transição
    requestAnimationFrame(() => {
      lightboxImage.className = 'lightbox-image current';
    });
  }
  currentIndex = index ?? -1;
}

function closeLightbox() {
  if (!lightbox || !lightboxImage) return;
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  lightboxImage.src = '';
}

galleryLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    openLightbox(link.href, galleryLinks.indexOf(link));
  });
});

if (lightboxClose) {
  lightboxClose.addEventListener('click', closeLightbox);
}

if (lightbox) {
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
  if (!lightbox || !lightbox.classList.contains('open')) return;
  if (e.key === 'ArrowRight') navigateLightbox(1);
  if (e.key === 'ArrowLeft') navigateLightbox(-1);
});

function navigateLightbox(direction) {
  if (currentIndex < 0) return;
  const total = galleryLinks.length;
  currentIndex = (currentIndex + direction + total) % total;
  const nextEl = galleryLinks[currentIndex];
  const nextHref = nextEl.dataset.full || nextEl.href;
  // animação de transição
  if (!lightboxImageNext) return openLightbox(nextHref, currentIndex);
  lightboxImageNext.className = 'lightbox-image next ' + (direction > 0 ? 'slide-in-right' : 'slide-in-left');
  lightboxImage.className = 'lightbox-image current ' + (direction > 0 ? 'slide-out-left' : 'slide-out-right');
  lightboxImageNext.src = nextHref;
  // quando a imagem carregar, troca as referências
  lightboxImageNext.onload = () => {
    // reseta classes
    lightboxImageNext.className = 'lightbox-image current';
    lightboxImage.className = 'lightbox-image next';
    // swap dos elementos
    const tempSrc = lightboxImage.src;
    lightboxImage.src = lightboxImageNext.src;
    lightboxImageNext.src = tempSrc;
  };
}

if (lightboxPrev) lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
if (lightboxNext) lightboxNext.addEventListener('click', () => navigateLightbox(1));

// Gestos de swipe no mobile + prefetch da próxima imagem
let touchStartX = 0;
let touchEndX = 0;
if (lightbox) {
  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });
  lightbox.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].clientX;
    const delta = touchEndX - touchStartX;
    if (Math.abs(delta) > 40) {
      navigateLightbox(delta < 0 ? 1 : -1);
    }
  }, { passive: true });
}

// Prefetch da próxima imagem no hover/foco para transição instantânea
galleryLinks.forEach((link, idx) => {
  const prefetch = () => {
    const nextIndex = (idx + 1) % galleryLinks.length;
    const href = galleryLinks[nextIndex].dataset.full || galleryLinks[nextIndex].href;
    const img = new Image();
    img.decoding = 'async';
    img.src = href;
  };
  link.addEventListener('mouseenter', prefetch);
  link.addEventListener('focus', prefetch);
});

// Ano dinâmico no rodapé
const yearSpan = document.getElementById('year');
if (yearSpan) {
  yearSpan.textContent = String(new Date().getFullYear());
}

// Pétalas de cerejeira (canvas)
(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canvas = document.getElementById('petals-canvas');
  if (!canvas || prefersReducedMotion) return;

  const ctx = canvas.getContext('2d');
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let width = 0;
  let height = 0;
  let petals = [];
  let wind = 0.2;          // vento atual
  let windTarget = 0.2;    // vento alvo (ajustado pelo scroll)
  let lastScrollY = window.scrollY;

  function resize() {
    width = canvas.clientWidth = window.innerWidth;
    height = canvas.clientHeight = Math.max(window.innerHeight, document.body.scrollHeight);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    spawnInitial();
  }

  class Petal {
    constructor() {
      this.reset(true);
    }

    reset(spawnTop = false) {
      const baseSize = Math.random() * 8 + 6; // 6–14px
      this.x = Math.random() * width;
      this.y = spawnTop ? Math.random() * height * 0.4 : -20 - Math.random() * 60;
      this.size = baseSize;
      this.speedY = 0.5 + Math.random() * 1.2; // queda
      this.amplitude = Math.random() * 18 + 8; // oscilação lateral
      this.phase = Math.random() * Math.PI * 2;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() * 0.02 + 0.01) * (Math.random() < 0.5 ? -1 : 1);
      this.alpha = 0.6 + Math.random() * 0.35;
      this.hue = 340 + Math.random() * 14; // rosa sakura
      this.sat = 75 + Math.random() * 20;
      this.light = 80 + Math.random() * 10;
    }

    update(dt) {
      this.phase += 0.015 * dt;
      this.rotation += this.rotationSpeed * dt;
      const drift = Math.sin(this.phase) * (this.amplitude * 0.02) + wind * 0.8;
      this.x += drift * dt;
      this.y += this.speedY * dt;
      if (this.y - this.size > height + 20 || this.x < -40 || this.x > width + 40) {
        this.reset(false);
      }
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      // pétala em formato de gota usando bezier
      const s = this.size;
      const grad = ctx.createLinearGradient(0, -s, 0, s);
      grad.addColorStop(0, `hsla(${this.hue}, ${this.sat}%, ${this.light}%, 1)`);
      grad.addColorStop(1, `hsla(${this.hue - 10}, ${this.sat - 10}%, ${this.light - 20}%, 0.85)`);
      ctx.fillStyle = grad;

      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.bezierCurveTo(s * 0.9, -s * 0.6, s * 0.9, s * 0.2, 0, s);
      ctx.bezierCurveTo(-s * 0.9, s * 0.2, -s * 0.9, -s * 0.6, 0, -s);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  }

  function spawnInitial() {
    const targetCount = Math.round(Math.min(90, Math.max(28, width * height / 60000)));
    if (petals.length > targetCount) petals.length = targetCount;
    while (petals.length < targetCount) petals.push(new Petal());
  }

  let lastTime = performance.now();
  function frame(now) {
    const dt = Math.min(2.5, (now - lastTime) / 16.67); // normaliza para ~60fps
    lastTime = now;
    // easing do vento
    wind += (windTarget - wind) * 0.02 * dt;
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < petals.length; i++) {
      petals[i].update(dt);
      petals[i].draw();
    }
    requestAnimationFrame(frame);
  }

  let scrollTicking = false;
  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      scrollTicking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - lastScrollY;
        lastScrollY = y;
        // ajusta vento alvo baseado no scroll (direita quando sobe, esquerda quando desce)
        const mapped = Math.max(-0.9, Math.min(0.9, -delta / 600));
        windTarget = 0.2 + mapped;
        scrollTicking = false;
      });
    }
  }, { passive: true });

  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(frame);
})();

// Lazy ativação do mapa
// Mapa já inicia visível (lógica removida do lazy)

