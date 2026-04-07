
/* ─────────────────────────────────────────────────────────────
   NEON COSMOS PORTFOLIO — script.js
   Sections: Cursor · Stars · Nav · Scroll Reveal · Skill Bars
             Counter Animation · Form · Parallax Orbs · Lang Toggle
───────────────────────────────────────────────────────────── */

/* ── CUSTOM CURSOR ──────────────────────────────────────────── */
const dot  = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');

let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animateCursor() {
  dot.style.left = mouseX + 'px';
  dot.style.top  = mouseY + 'px';

  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  ring.style.left = ringX + 'px';
  ring.style.top  = ringY + 'px';

  requestAnimationFrame(animateCursor);
}
animateCursor();


/* ── STARS CANVAS ───────────────────────────────────────────── */
const canvas = document.getElementById('stars-canvas');
const ctx    = canvas.getContext('2d');

let W, H, stars = [];

function resizeCanvas() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}

function initStars() {
  stars = [];
  const count = Math.floor((W * H) / 8000);
  for (let i = 0; i < count; i++) {
    stars.push({
      x:     Math.random() * W,
      y:     Math.random() * H,
      r:     Math.random() * 1.5 + 0.2,
      alpha: Math.random(),
      speed: Math.random() * 0.003 + 0.001,
      phase: Math.random() * Math.PI * 2
    });
  }
}

let tick = 0;
function drawStars() {
  ctx.clearRect(0, 0, W, H);
  tick += 0.01;

  stars.forEach(s => {
    const alpha = s.alpha * (0.35 + 0.65 * Math.sin(tick * s.speed * 100 + s.phase));
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(180, 180, 255, ${alpha.toFixed(3)})`;
    ctx.fill();
  });

  requestAnimationFrame(drawStars);
}

resizeCanvas();
initStars();
drawStars();

window.addEventListener('resize', () => {
  resizeCanvas();
  initStars();
});


/* ── NAV SCROLL ─────────────────────────────────────────────── */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });


/* ── SCROLL REVEAL ──────────────────────────────────────────── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


/* ── SKILL BARS ─────────────────────────────────────────────── */
const barObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fill = entry.target;
      fill.style.width = fill.dataset.w + '%';
      barObserver.unobserve(fill);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.skill-fill').forEach(el => barObserver.observe(el));


/* ── COUNTER ANIMATION ──────────────────────────────────────── */
function animateCounter(el, target) {
  const duration  = 1400;
  const stepTime  = 16;
  const increment = target / (duration / stepTime);
  let current = 0;

  const isSatisfaction = (target === 99);

  const timer = setInterval(() => {
    current = Math.min(current + increment, target);
    el.textContent = Math.floor(current) + (isSatisfaction ? '%' : '+');

    if (current >= target) {
      el.textContent = target + (isSatisfaction ? '%' : '+');
      clearInterval(timer);
    }
  }, stepTime);
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('[data-count]').forEach(num => {
        animateCounter(num, parseInt(num.dataset.count));
      });
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) counterObserver.observe(heroStats);


/* ── CONTACT FORM ───────────────────────────────────────────── */
const contactForm = document.getElementById('contact-form');
const submitBtn   = document.getElementById('submit-btn');

if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();

    const lang = document.documentElement.lang;
    submitBtn.textContent = lang === 'en' ? 'Sending...' : 'Enviando...';
    submitBtn.disabled    = true;
    submitBtn.style.opacity = '0.7';

    setTimeout(() => {
      submitBtn.textContent        = lang === 'en' ? 'Message sent! ✓' : '¡Mensaje enviado! ✓';
      submitBtn.disabled           = false;
      submitBtn.style.opacity      = '1';
      submitBtn.style.background   = '#10b981';
      submitBtn.style.boxShadow    = '0 0 30px rgba(16, 185, 129, 0.4)';
      contactForm.reset();

      setTimeout(() => {
        submitBtn.textContent      = lang === 'en' ? 'Send message ✦' : 'Enviar mensaje ✦';
        submitBtn.style.background = '';
        submitBtn.style.boxShadow  = '';
      }, 4000);
    }, 1200);
  });
}


/* ── PARALLAX ORBS ──────────────────────────────────────────── */
document.addEventListener('mousemove', e => {
  const px = (e.clientX / window.innerWidth  - 0.5) * 24;
  const py = (e.clientY / window.innerHeight - 0.5) * 24;

  document.querySelectorAll('.orb').forEach((orb, i) => {
    const factor = (i % 2 === 0) ? 1 : -0.6;
    orb.style.transform = `translate(${(px * factor).toFixed(2)}px, ${(py * factor).toFixed(2)}px)`;
  });
}, { passive: true });


/* ── SMOOTH ACTIVE NAV LINKS ────────────────────────────────── */
const sections   = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => {
        a.style.color = a.getAttribute('href') === '#' + entry.target.id
          ? 'var(--text)'
          : '';
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));


/* ── LANGUAGE TOGGLE ────────────────────────────────────────── */
let currentLang = 'es';

const langToggleBtn = document.getElementById('lang-toggle');
const langEsSpan    = langToggleBtn.querySelector('.lang-es');
const langEnSpan    = langToggleBtn.querySelector('.lang-en');

function applyLanguage(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;

  // Toggle active indicator on button
  langEsSpan.classList.toggle('active', lang === 'es');
  langEnSpan.classList.toggle('active', lang === 'en');

  // Update all elements with data-es / data-en
  document.querySelectorAll('[data-es][data-en]').forEach(el => {
    const text = lang === 'es' ? el.dataset.es : el.dataset.en;

    // For elements that are not inputs/textareas, update innerHTML
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      // handled separately below via data-placeholder-es/en
    } else {
      el.innerHTML = text;
    }
  });

  // Update placeholders
  document.querySelectorAll('[data-placeholder-es][data-placeholder-en]').forEach(el => {
    el.placeholder = lang === 'es' ? el.dataset.placeholderEs : el.dataset.placeholderEn;
  });

  // Update submit button (not a data-es element, handled via form submit logic)
  if (submitBtn && !submitBtn.disabled) {
    submitBtn.textContent = lang === 'es' ? 'Enviar mensaje ✦' : 'Send message ✦';
  }

  // Update page title
  document.title = lang === 'es'
    ? 'Kevin Pico — Dev Portfolio'
    : 'Kevin Pico — Dev Portfolio';
}

langToggleBtn.addEventListener('click', () => {
  applyLanguage(currentLang === 'es' ? 'en' : 'es');
});