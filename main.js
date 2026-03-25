/* ============================================================
   NEXUS GROUP — Main Script
   Three.js background · GSAP ScrollTrigger reveals · Carousel
   ============================================================ */

'use strict';

// ─── GSAP ScrollTrigger Registration ────────────────────────
gsap.registerPlugin(ScrollTrigger);
// Prevent mobile URL-bar resize from causing scroll "jumps"
ScrollTrigger.config({ ignoreMobileResize: true });

/* ============================================================
   1. THREE.JS — Particle Starfield + Floating Hero Mesh
   ============================================================ */
(function initThree() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 40;

  // ── Particle Stars ──────────────────────────────────────────
  const starCount = 2800;
  const starGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(starCount * 3);
  const colors    = new Float32Array(starCount * 3);
  const palette = [
    new THREE.Color('#16a34a'),
    new THREE.Color('#22c55e'),
    new THREE.Color('#10b981'),
    new THREE.Color('#059669'),
    new THREE.Color('#047857'),
  ];
  for (let i = 0; i < starCount; i++) {
    positions[i * 3 + 0] = (Math.random() - 0.5) * 300;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 300;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 300;
    const c = palette[Math.floor(Math.random() * palette.length)];
    colors[i * 3 + 0] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }
  starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  starGeo.setAttribute('color',    new THREE.BufferAttribute(colors, 3));
  const starMat = new THREE.PointsMaterial({
    size: 0.35,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    depthWrite: false,
  });
  const stars = new THREE.Points(starGeo, starMat);
  scene.add(stars);



  // ── Lights ──────────────────────────────────────────────────
  const ambientLight = new THREE.AmbientLight(0xaaaaaa, 1.5);
  scene.add(ambientLight);
  const light1 = new THREE.PointLight(0x16a34a, 3, 60);
  light1.position.set(10, 10, 20);
  scene.add(light1);
  const light2 = new THREE.PointLight(0x10b981, 2, 60);
  light2.position.set(-10, -10, 20);
  scene.add(light2);

  // ── Mouse parallax ──────────────────────────────────────────
  const mouse = { x: 0, y: 0 };
  window.addEventListener('mousemove', e => {
    mouse.x = (e.clientX / window.innerWidth  - 0.5) * 2;
    mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // ── Scroll offset ───────────────────────────────────────────
  let scrollY = 0;
  window.addEventListener('scroll', () => { scrollY = window.scrollY; });

  // ── Animation Loop ───────────────────────────────────────────
  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    // Stars slow rotation
    stars.rotation.y = t * 0.012;
    stars.rotation.x = t * 0.005;



    // Camera drift from scroll
    camera.position.y = -scrollY * 0.012;
    camera.position.x = mouse.x * 1.5;

    renderer.render(scene, camera);
  }
  animate();

  // ── Resize ──────────────────────────────────────────────────
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();


/* ============================================================
   2. NAV — Scrolled class + hamburger
   ============================================================ */
(function initNav() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const links = document.getElementById('nav-links');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });

  hamburger && hamburger.addEventListener('click', () => {
    links.classList.toggle('open');
  });

  // Close menu on link click
  links && links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => links.classList.remove('open'));
  });
})();


/* ============================================================
   3. SCROLL REVEAL — Intersection Observer
   ============================================================ */
(function initReveal() {
  // GSAP powered reveals for services (with delay)
  gsap.utils.toArray('.reveal-up').forEach((el) => {
    const delay = parseFloat(el.style.getPropertyValue('--delay')) || 0;
    gsap.fromTo(el,
      { opacity: 0, y: 55 },
      {
        opacity: 1, y: 0,
        duration: 0.85,
        delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none',
        }
      }
    );
  });

  gsap.utils.toArray('.reveal-left').forEach((el) => {
    gsap.fromTo(el,
      { opacity: 0, x: -55 },
      {
        opacity: 1, x: 0,
        duration: 0.85,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none',
        }
      }
    );
  });

  gsap.utils.toArray('.reveal-right').forEach((el) => {
    gsap.fromTo(el,
      { opacity: 0, x: 55 },
      {
        opacity: 1, x: 0,
        duration: 0.85,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none',
        }
      }
    );
  });
})();


/* ============================================================
   4. STAT COUNTERS
   ============================================================ */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isObserving && entry.isIntersecting) {
        entry.isObserving = true;
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        const tick = () => {
          current = Math.min(current + step, target);
          el.textContent = Math.floor(current);
          if (current < target) requestAnimationFrame(tick);
          else el.textContent = target;
        };
        tick();
      }
    });
  }, { threshold: 0.3 });
  counters.forEach(c => observer.observe(c));
})();


/* ============================================================
   5. COMPANIES CAROUSEL
   ============================================================ */
(function initCarousel() {
  const inner  = document.getElementById('companies-inner');
  const prevBtn = document.getElementById('cnav-prev');
  const nextBtn = document.getElementById('cnav-next');
  const dots    = document.querySelectorAll('.cnav-dot');
  if (!inner) return;

  const cards     = inner.querySelectorAll('.company-card');
  const totalCards = cards.length;
  let current = 0;

  function getCardWidth() {
    if (cards[0]) {
      const style = getComputedStyle(inner);
      const gap = parseFloat(style.gap) || 24;
      return cards[0].offsetWidth + gap;
    }
    return 384;
  }

  function goTo(idx) {
    current = Math.max(0, Math.min(idx, totalCards - 1));
    const offset = current * getCardWidth();
    inner.style.transform = `translateX(-${offset}px)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  prevBtn && prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn && nextBtn.addEventListener('click', () => goTo(current + 1));
  dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));

  // Auto-play
  let autoTimer = setInterval(() => goTo((current + 1) % totalCards), 4000);
  inner.parentElement.addEventListener('mouseenter', () => clearInterval(autoTimer));
  inner.parentElement.addEventListener('mouseleave', () => {
    autoTimer = setInterval(() => goTo((current + 1) % totalCards), 4000);
  });

  // Touch drag
  let startX = 0;
  inner.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  inner.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
  });

  // 3D tilt on mouse move per card
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top  + rect.height / 2;
      const rx = ((e.clientY - cy) / (rect.height / 2)) * 6;
      const ry = ((e.clientX - cx) / (rect.width  / 2)) * -6;
      card.style.transform = `translateY(-10px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();


/* ============================================================
   6. WORLD MAP CANVAS — dot grid with highlighted regions
   ============================================================ */
(function drawWorldMap() {
  const canvas = document.getElementById('map-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;

  // A simplified set of [col, row] dot coordinates representing continents
  // Grid: 70 cols × 40 rows → each dot ~10px
  const COLS = 70, ROWS = 40;
  const dw = W / COLS, dh = H / ROWS;

  // Very simplified continent mask (1 = land, 0 = ocean)
  // Encoded as region ranges [colStart, colEnd, rowStart, rowEnd]
  const continents = [
    // North America
    { c:[6,18], r:[4,18], color: '#10b981' },
    // South America
    { c:[10,20], r:[18,36], color: '#10b981' },
    // Europe
    { c:[27,40], r:[4,16], color: '#22c55e' },
    // Africa
    { c:[28,42], r:[16,34], color: '#10b981' },
    // Asia
    { c:[40,68], r:[3,22], color: '#059669' },
    // Australia
    { c:[54,65], r:[24,34], color: '#059669' },
    // Greenland
    { c:[14,22], r:[1,7], color: '#10b981' },
    // Middle East
    { c:[39,48], r:[14,22], color: '#10b981' },
    // India
    { c:[46,54], r:[16,26], color: '#059669' },
    // Japan / SE Asia
    { c:[60,70], r:[14,24], color: '#059669' },
  ];

  // Build a color map for each dot position
  const colorMap = {};
  continents.forEach(cont => {
    for (let c = cont.c[0]; c < cont.c[1]; c++) {
      for (let r = cont.r[0]; r < cont.r[1]; r++) {
        // Add slight randomness to not be perfectly rectangular
        if (Math.random() > 0.18) {
          colorMap[`${c},${r}`] = cont.color;
        }
      }
    }
  });

  let animFrame = 0;
  function draw() {
    ctx.clearRect(0, 0, W, H);
    animFrame++;

    for (let c = 0; c < COLS; c++) {
      for (let r = 0; r < ROWS; r++) {
        const key = `${c},${r}`;
        if (!colorMap[key]) continue;

        const x = c * dw + dw / 2;
        const y = r * dh + dh / 2;
        const baseColor = colorMap[key];

        // Pulse effect on a few dots
        const isPulsing = (c + r + animFrame) % 120 < 10;
        const radius    = isPulsing ? dw * 0.45 : dw * 0.28;
        const alpha     = isPulsing ? 1 : 0.55;

        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = baseColor;
        ctx.fill();

        if (isPulsing) {
          ctx.globalAlpha = 0.15;
          ctx.beginPath();
          ctx.arc(x, y, dw * 1.1, 0, Math.PI * 2);
          ctx.fillStyle = baseColor;
          ctx.fill();
        }
      }
    }
    ctx.globalAlpha = 1;

    // Connection lines between key hubs
    const hubs = [
      { c: 10, r: 10 }, // Americas
      { c: 33, r: 10 }, // Europe
      { c: 50, r: 10 }, // Asia
      { c: 40, r: 20 }, // Middle East
      { c: 58, r: 29 }, // Australia
    ];
    ctx.strokeStyle = 'rgba(22,163,74,0.3)';
    ctx.lineWidth = 0.8;
    for (let i = 0; i < hubs.length - 1; i++) {
      const a = hubs[i];
      const b = hubs[i + 1];
      ctx.beginPath();
      ctx.moveTo(a.c * dw + dw / 2, a.r * dh + dh / 2);
      // Bezier arc
      const mx = (a.c + b.c) / 2 * dw;
      const my = Math.min(a.r, b.r) * dh - dh * 3;
      ctx.quadraticCurveTo(mx, my, b.c * dw + dw / 2, b.r * dh + dh / 2);
      ctx.stroke();
    }

    requestAnimationFrame(draw);
  }
  draw();
})();


/* ============================================================
   7. SECTION BACKGROUND PARALLAX via GSAP
   ============================================================ */
(function initParallax() {
  gsap.to('#about', {
    backgroundPositionY: '30%',
    ease: 'none',
    scrollTrigger: {
      trigger: '#about',
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    }
  });
})();


/* ============================================================
   8. COMPANIES SECTION — GSAP stagger entrance
   ============================================================ */
(function initCompaniesAnim() {
  gsap.from('#companies .section-header', {
    opacity: 0, y: 40,
    duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: { trigger: '#companies', start: 'top 80%' }
  });
})();


/* ============================================================
   9. ACTIVE NAV LINK highlight on scroll
   ============================================================ */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navAs = document.querySelectorAll('.nav-links a');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 140) current = sec.id;
    });
    navAs.forEach(a => {
      a.style.color = '';
      if (a.getAttribute('href') === `#${current}`) {
        a.style.color = 'var(--accent-1)';
      }
    });
  });
})();

/* ============================================================
   10. CARD NAVIGATION WITH LOADING SCREEN
   ============================================================ */
(function initCompanyCardNavigation() {
  const card = document.querySelector('.company-card[data-link]');
  const loader = document.getElementById('page-loader');
  if (!card) return;

  const goToDetails = () => {
    const targetUrl = card.getAttribute('data-link');
    if (!targetUrl) return;

    if (loader) {
      loader.classList.add('show');
      loader.setAttribute('aria-hidden', 'false');
    }

    setTimeout(() => {
      window.location.href = targetUrl;
    }, 700);
  };

  card.addEventListener('click', goToDetails);
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      goToDetails();
    }
  });
})();
