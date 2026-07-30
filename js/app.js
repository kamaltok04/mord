document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initTiltEffect();
  initStatsCounters();
  initCapabilityClicks();
  initKeywordsCloud();
  initThemeToggle();
  initModals();
  initAudioClicks();
  highlightActiveNav();
});

/* Highlight current active page link */
function highlightActiveNav() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links-list a').forEach(link => {
    const linkPath = link.getAttribute('href');
    if (linkPath === currentPath) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* Particle Background Canvas */
function initParticles() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const count = 35;
  const particles = [];

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2 + 1
    });
  }

  function loop() {
    ctx.clearRect(0, 0, width, height);
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    const color = isDark ? '0, 240, 255' : '74, 127, 167';

    for (let i = 0; i < count; i++) {
      let p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color}, 0.3)`;
      ctx.fill();

      for (let j = i + 1; j < count; j++) {
        let p2 = particles[j];
        let dx = p.x - p2.x;
        let dy = p.y - p2.y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(${color}, ${0.12 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(loop);
  }

  loop();
}

/* 3D Card Tilt Effect */
function initTiltEffect() {
  const cards = document.querySelectorAll('.tilt-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotX = ((y - centerY) / centerY) * -5;
      const rotY = ((x - centerX) / centerX) * 5;

      card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(2px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    });
  });
}

/* Animated Stats Counters */
function initStatsCounters() {
  const targets = document.querySelectorAll('[data-target]');
  if (!targets.length) return;
  
  const animate = (el) => {
    const target = +el.getAttribute('data-target');
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 40));

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        el.innerText = target;
        clearInterval(timer);
      } else {
        el.innerText = current;
      }
    }, 35);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animate(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  targets.forEach(el => observer.observe(el));
}

/* Capability Row Interactive Trigger */
function initCapabilityClicks() {
  const rows = document.querySelectorAll('.capability-row-item');
  rows.forEach(row => {
    row.addEventListener('click', () => {
      const name = row.getAttribute('data-cap-name');
      const desc = row.getAttribute('data-cap-desc');
      openModal(`MORD: ${name}`, desc, 'Run Autonomous Task');
    });
  });
}

/* Keywords Tag Cloud Interactivity */
function initKeywordsCloud() {
  const pills = document.querySelectorAll('.keyword-pill');
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      openModal(`Keyword: ${pill.innerText}`, `Exploring AI Agent Protocol ecosystem applications for ${pill.innerText}.`, 'Filter Applications');
    });
  });
}

/* Theme Switcher */
function initThemeToggle() {
  const switchBtn = document.getElementById('theme-switch');
  if (!switchBtn) return;

  const currentTheme = localStorage.getItem('mord-theme') || 'light';
  document.body.setAttribute('data-theme', currentTheme);

  switchBtn.addEventListener('click', () => {
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    const next = isDark ? 'light' : 'dark';
    document.body.setAttribute('data-theme', next);
    localStorage.setItem('mord-theme', next);
    playBeep(isDark ? 450 : 750);
  });
}

/* Modals */
const overlay = document.getElementById('modal-overlay');
const modalTitle = document.getElementById('modal-title');
const modalSubtitle = document.getElementById('modal-subtitle');
const modalActionBtn = document.getElementById('modal-action-btn');

function openModal(title, subtitle, btnText) {
  if (modalTitle) modalTitle.innerText = title;
  if (modalSubtitle) modalSubtitle.innerText = subtitle;
  if (modalActionBtn) modalActionBtn.innerText = btnText;
  if (overlay) overlay.classList.add('active');
}

function closeModal() {
  if (overlay) overlay.classList.remove('active');
}

function initModals() {
  const closeBtn = document.getElementById('modal-close');
  const openLoginBtn = document.getElementById('open-login-btn');
  const openMenuBtn = document.getElementById('open-menu-btn');

  if (openLoginBtn) openLoginBtn.addEventListener('click', () => openModal('Log in to MORD Portal', 'Access your autonomous AI agent cluster.', 'Log in'));
  if (openMenuBtn) openMenuBtn.addEventListener('click', () => openModal('MORD Protocol Navigation', 'Select a page or feature to explore.', 'Navigate'));

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });
  }

  if (modalActionBtn) {
    modalActionBtn.addEventListener('click', () => {
      alert('Action executed! Protocol state updated.');
      closeModal();
    });
  }
}

/* Audio Click Feedback */
let actx = null;

function initAudioClicks() {
  document.querySelectorAll('button, .social-circle-icon, .capability-row-item, .arrow-circle-btn, .keyword-pill, .step-card-item, .utility-card-item, .phase-card-item').forEach(btn => {
    btn.addEventListener('click', () => playBeep(520));
  });
}

function playBeep(freq = 520) {
  try {
    if (!actx) actx = new (window.AudioContext || window.webkitAudioContext)();
    if (actx.state === 'suspended') actx.resume();

    const osc = actx.createOscillator();
    const gain = actx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, actx.currentTime);

    gain.gain.setValueAtTime(0.03, actx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(actx.destination);

    osc.start();
    osc.stop(actx.currentTime + 0.1);
  } catch (e) {}
}
