'use strict';
/* ================================================================
   POSI — main.js v2
   Cursor / Loader / Nav / Reveal / Counter / Filter /
   Testimonial / Form / Theme Toggle / Tilt
   ================================================================ */

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* ── THEME ──────────────────────────────────────────────── */
const html = document.documentElement;
const themeBtn = $('#themeToggle');
const saved = localStorage.getItem('posi-theme') || 'light';
html.setAttribute('data-theme', saved);

themeBtn?.addEventListener('click', () => {
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('posi-theme', next);
});

/* ── CURSOR ─────────────────────────────────────────────── */
const cur = $('#cursor');
if (cur && window.matchMedia('(pointer:fine)').matches) {
  let mx = 0, my = 0, cx = 0, cy = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  (function loop() {
    cx += (mx - cx) * .13;
    cy += (my - cy) * .13;
    cur.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`;
    requestAnimationFrame(loop);
  })();
  const hovers = $$('a,button,.svc-row,.wk-item,.brand-logo-box,.proc-item,.cs-tags span');
  hovers.forEach(el => {
    el.addEventListener('mouseenter', () => cur.classList.add('big'));
    el.addEventListener('mouseleave', () => cur.classList.remove('big'));
  });
  document.addEventListener('mousedown', () => cur.classList.add('click'));
  document.addEventListener('mouseup',   () => cur.classList.remove('click'));
}

/* ── LOADER ─────────────────────────────────────────────── */
document.body.style.overflow = 'hidden';
window.addEventListener('load', () => {
  setTimeout(() => {
    $('#loader')?.classList.add('out');
    document.body.style.overflow = '';
    initCounters();
    runReveal();
    initHeadlineAnim();   /* ✅ 이 줄 추가 */
  }, 1900);
});

/* ── NAV ─────────────────────────────────────────────────── */
const nav = $('#nav');
window.addEventListener('scroll', () => {
  nav?.classList.toggle('stuck', window.scrollY > 40);
}, { passive: true });

/* Hamburger */
const ham = $('#hamburger');
const mob = $('#mobOverlay');
ham?.addEventListener('click', () => {
  const open = ham.classList.toggle('open');
  mob?.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});
$$('.mob-nl').forEach(a => a.addEventListener('click', () => {
  ham.classList.remove('open');
  mob.classList.remove('open');
  document.body.style.overflow = '';
}));

/* ── SMOOTH SCROLL ──────────────────────────────────────── */
$$('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    if (!id) return;
    const t = document.getElementById(id);
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

/* ── SCROLL REVEAL ──────────────────────────────────────── */
function runReveal() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('in');
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
  $$('.reveal').forEach(el => io.observe(el));
}
document.addEventListener('DOMContentLoaded', runReveal);

/* ── COUNTER ─────────────────────────────────────────────── */
function initCounters() {
  $$('[data-count]').forEach(el => {
    const target = +el.dataset.count;
    const dur = 1600;
    const step = target / (dur / 16);
    let cur = 0;
    const t = setInterval(() => {
      cur = Math.min(cur + step, target);
      el.textContent = Math.floor(cur).toLocaleString();
      if (cur >= target) { el.textContent = target.toLocaleString(); clearInterval(t); }
    }, 16);
  });
}

/* ── WORK FILTER ─────────────────────────────────────────── */
$$('.wf-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    $$('.wf-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.f;
    $$('.wk-item').forEach(item => {
      const match = f === 'all' || item.dataset.cat === f;
      item.style.transition = 'opacity .4s, transform .4s';
      if (match) {
        item.style.opacity = '1'; item.style.transform = 'scale(1)';
        setTimeout(() => item.classList.remove('hidden'), 10);
      } else {
        item.style.opacity = '0'; item.style.transform = 'scale(.97)';
        setTimeout(() => item.classList.add('hidden'), 420);
      }
    });
  });
});

/* ── SERVICE ROW HOVER RIPPLE ───────────────────────────── */
$$('.svc-row').forEach(row => {
  row.addEventListener('mouseenter', () => {
    $$('.svc-row').forEach(r => { if (r !== row) r.style.opacity = '.45'; });
  });
  row.addEventListener('mouseleave', () => {
    $$('.svc-row').forEach(r => r.style.opacity = '1');
  });
});

/* ── CONTACT FORM ────────────────────────────────────────── */
$('#contactForm')?.addEventListener('submit', e => {
  e.preventDefault();
  const btn = e.target.querySelector('.btn-submit span');
  if (btn) btn.textContent = '전송 중...';
  setTimeout(() => {
    e.target.reset();
    if (btn) btn.textContent = '보내기';
    showToast();
  }, 1400);
});

function showToast() {
  const t = $('#toast');
  if (!t) return;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3200);
}

/* ── HERO PARALLAX ───────────────────────────────────────── */
const heroInner = $('.hero-inner');
window.addEventListener('scroll', () => {
  if (!heroInner) return;
  const y = window.scrollY;
  const vh = window.innerHeight;
  if (y < vh) {
    heroInner.style.transform = `translateY(${y * .18}px)`;
    heroInner.style.opacity   = `${1 - y / (vh * .85)}`;
  }
}, { passive: true });

/* ── SCROLL SPY (nav active) ─────────────────────────────── */
const sections = $$('section[id]');
const navLinks  = $$('.nl');
window.addEventListener('scroll', () => {
  let cur = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 160) cur = s.id; });
  navLinks.forEach(l => l.classList.toggle('nl-active', l.getAttribute('href') === `#${cur}`));
}, { passive: true });

/* ── MAGNETIC BUTTONS ────────────────────────────────────── */
$$('.btn-primary, .btn-ghost, .btn-submit').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const dx = (e.clientX - r.left - r.width / 2) * .25;
    const dy = (e.clientY - r.top  - r.height / 2) * .25;
    btn.style.transform = `translate(${dx}px,${dy}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

/* ── WORK ITEM HOVER DIM ─────────────────────────────────── */
$$('.wk-item').forEach(item => {
  item.addEventListener('mouseenter', () => {
    $$('.wk-item').forEach(i => { if (i !== item) i.style.opacity = '.5'; });
  });
  item.addEventListener('mouseleave', () => {
    $$('.wk-item').forEach(i => i.style.opacity = '1');
  });
});

/* ── PROCESS ITEM TILT ───────────────────────────────────── */
$$('.proc-item').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r  = card.getBoundingClientRect();
    const xp = (e.clientX - r.left) / r.width  - 0.5;
    const yp = (e.clientY - r.top)  / r.height - 0.5;
    card.style.transform = `translateY(-8px) rotateY(${xp*6}deg) rotateX(${-yp*6}deg)`;
    card.style.transition = 'transform .1s';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform .5s cubic-bezier(.19,1,.22,1)';
  });
});

/* ── ACTIVE NAV STYLE ────────────────────────────────────── */
const styleEl = document.createElement('style');
styleEl.textContent = `.nl-active{color:var(--fg)!important} .nl-active::after{width:100%!important}`;
document.head.appendChild(styleEl);

/* ── KT&G LOGO HOVER GLOW ────────────────────────────────── */
const ktgSvg = $('.cs-ktg-svg');
ktgSvg?.addEventListener('mouseenter', () => {
  ktgSvg.style.filter = 'drop-shadow(0 0 40px rgba(255, 107, 43,.45))';
  ktgSvg.style.transition = 'filter .4s';
});
ktgSvg?.addEventListener('mouseleave', () => {
  ktgSvg.style.filter = 'drop-shadow(0 0 30px rgba(255, 107, 43,.15))';
});

/* ── Stack Scroll Active 처리 ── */
const stackItems = document.querySelectorAll('.stack-item');

const stackObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-active');
    } else {
      entry.target.classList.remove('is-active');
    }
  });
}, { threshold: 0.55 });

stackItems.forEach(item => stackObserver.observe(item));

/* ── LOGO ACCENT DOT INTERACTION ─────────────────────────── */
$$('.logo-accent-dot, .l-dot').forEach(dot => {
  dot.style.cursor = 'none';
});

/* ── HEADLINE CHAR ANIMATION (about) ────────────────────── */
function initHeadlineAnim() {
  const headline = document.getElementById('headline-anim');
  if (!headline) return;

  /* ✅ 이미 처리됐으면 스킵 */
  if (headline.querySelector('.char')) return;

  const ems = [...headline.querySelectorAll('em')];

  function splitNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const frag = document.createDocumentFragment();
      [...node.textContent].forEach(ch => {
        if (ch.trim() === '') {
          frag.appendChild(document.createTextNode(ch));
        } else {
          const s = document.createElement('span');
          s.className = 'char';
          s.textContent = ch;
          frag.appendChild(s);
        }
      });
      node.replaceWith(frag);
    } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'BR') {
      [...node.childNodes].forEach(splitNode);
    }
  }

  splitNode(headline);

  ems.forEach(em => {
    em.style.fontStyle = 'normal';
    em.querySelectorAll('.char').forEach(c => c.style.color = 'var(--accent)');
  });

  /* ✅ IntersectionObserver — about 섹션 스크롤 시 실행 */
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        headline.querySelectorAll('.char').forEach((ch, i) => {
          setTimeout(() => ch.classList.add('visible'), i * 45);
        });
        io.disconnect();
      }
    });
  }, { threshold: 0.2 });

  io.observe(headline);
}

console.log('%c POSI v2 · foundfounded-inspired redesign ',
  'background:#FF6B2B;color:#000;font-weight:700;padding:5px 12px;border-radius:4px;font-size:13px');

  /* =========================================
   POSI FILM STRIP — Selected Projects
   ========================================= */

(function initPosiFilmStrip() {
  const container = document.getElementById('posi-film-strip');
  if (!container) return;

  const SLIVER_MIN  = 68;
  const SLIVER_MAX  = 440;
  const MAX_SPEED   = 2000;

  // POSI project data with Unsplash images
  const PROJECTS = [
    { title: 'RIIZE Display',   client: 'LG U+',    cat: 'POSM',    year: '2024', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80' },
    { title: 'Membership KIT', client: 'HYBE',      cat: 'Package', year: '2021', img: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80' },
    { title: 'Galaxy Studio',  client: 'Cheil',     cat: 'Display', year: '2022', img: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&q=80' },
    { title: 'ENHYPEN KIT',    client: 'HYBE',      cat: 'Package', year: '2023', img: 'https://images.unsplash.com/photo-1586495777744-4e6232bf4e7e?w=600&q=80' },
    { title: 'Floor Stand',    client: 'Samsung',   cat: 'POSM',    year: '2024', img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80' },
    { title: 'Brand Pop-Up',   client: 'Amorepac',  cat: 'Display', year: '2023', img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80' },
    { title: 'Eco Series',     client: 'Innisfree', cat: 'Package', year: '2023', img: 'https://images.unsplash.com/photo-1542219550-37153d387c27?w=600&q=80' },
    { title: 'Shelf System',   client: 'Lotte',     cat: 'POSM',    year: '2024', img: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=600&q=80' },
    { title: 'Premium Set',    client: 'Sulwhasoo', cat: 'Package', year: '2024', img: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&q=80' },
    { title: 'Glorifier',      client: 'SK-II',     cat: 'Display', year: '2023', img: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=600&q=80' },
  ];

  // Repeat 3x for wave depth
  const WORKS = [...PROJECTS, ...PROJECTS, ...PROJECTS];

  // Build cursor
  const cursor = document.createElement('div');
  cursor.id = 'pfs-cursor';
  document.body.appendChild(cursor);

  // Build DOM
  const itemEls = WORKS.map((w, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'pfs-item';
    btn.style.width = SLIVER_MIN + 'px';
    btn.setAttribute('aria-label', w.title);

    const img = document.createElement('img');
    img.src = w.img;
    img.alt = w.title;
    img.loading = 'lazy';
    img.draggable = false;

    const vig = document.createElement('div');
    vig.className = 'pfs-vignette';

    const label = document.createElement('div');
    label.className = 'pfs-label';
    label.innerHTML = '<span>' + w.title + '</span>';

    const cap = document.createElement('div');
    cap.className = 'pfs-caption';
    cap.style.background = 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 60%)';
    cap.innerHTML = '<p class="pfs-cat">' + w.cat + ' &middot; ' + w.year + '</p>' +
                    '<h3>' + w.title + '</h3>' +
                    '<p class="pfs-client">' + w.client + '</p>';

    const idx = document.createElement('div');
    idx.className = 'pfs-idx';
    idx.textContent = String((i % PROJECTS.length) + 1).padStart(2, '0');

    btn.appendChild(img);
    btn.appendChild(vig);
    btn.appendChild(label);
    btn.appendChild(cap);
    btn.appendChild(idx);
    container.appendChild(btn);

    btn.addEventListener('click', function() {
      const ri = i % PROJECTS.length;
      // scroll to work section if needed
    });

    return { el: btn, img, vig, label, cap, idx };
  });

  // State
  let mouseX = null;
  let isInside = false;
  let rafId = 0;
  let lastTime = performance.now();
  let weights = WORKS.map(() => 0);

  // Mouse tracking
  container.addEventListener('mousemove', function(e) {
    const r = container.getBoundingClientRect();
    mouseX = e.clientX - r.left;
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';
  });
  container.addEventListener('mouseenter', function() {
    isInside = true;
    cursor.style.opacity = '1';
  });
  container.addEventListener('mouseleave', function() {
    isInside = false;
    mouseX = null;
    cursor.style.opacity = '0';
  });

  // Vertical wheel -> horizontal scroll
  container.addEventListener('wheel', function(e) {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      container.scrollLeft += e.deltaY * 1.4;
      e.preventDefault();
    }
  }, { passive: false });

  // rAF loop
  function loop(now) {
    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;

    // Mouse-driven scroll
    if (isInside && mouseX !== null) {
      const cw = container.clientWidth;
      const norm = (mouseX / cw) * 2 - 1;
      const dead = 0.28;
      if (Math.abs(norm) > dead) {
        const t = (Math.abs(norm) - dead) / (1 - dead);
        const speed = (norm > 0 ? 1 : -1) * t * t * MAX_SPEED;
        container.scrollLeft += speed * dt;
      }
    }

    // Measure focus weights via real DOM positions
    const cRect = container.getBoundingClientRect();
    const cx = cRect.left + cRect.width / 2;
    const falloff = cRect.width * 0.42;

    itemEls.forEach(function(item, i) {
      const r = item.el.getBoundingClientRect();
      const ic = r.left + r.width / 2;
      const dist = Math.abs(ic - cx);
      const t = Math.min(dist / falloff, 1);
      weights[i] = Math.max(0, 1 - t * t * t * t);
    });

    // Apply weights
    itemEls.forEach(function(item, i) {
      const w = weights[i];
      const focused = w > 0.3;
      const iw = SLIVER_MIN + (SLIVER_MAX - SLIVER_MIN) * w;

      item.el.style.width = iw + 'px';

      item.img.style.filter = focused
        ? 'grayscale(0%) brightness(1)'
        : 'grayscale(' + Math.round(100 - w * 70) + '%) brightness(' + (0.5 + w * 0.5).toFixed(2) + ')';
      item.img.style.transform = 'scale(' + (1.06 - w * 0.06).toFixed(3) + ')';

      item.vig.style.background = focused
        ? 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)'
        : 'rgba(0,0,0,0.2)';

      item.label.style.opacity = focused ? '0' : '0.7';

      item.cap.style.opacity   = focused ? '1' : '0';
      item.cap.style.transform = focused ? 'translateY(0)' : 'translateY(10px)';

      item.idx.style.opacity = focused ? '1' : '0';
    });

    rafId = requestAnimationFrame(loop);
  }

  rafId = requestAnimationFrame(loop);

  // Clean up on page unload
  window.addEventListener('beforeunload', function() {
    cancelAnimationFrame(rafId);
  });

})();