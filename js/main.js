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
  ktgSvg.style.filter = 'drop-shadow(0 0 40px rgba(255,107,43,.45))';
  ktgSvg.style.transition = 'filter .4s';
});
ktgSvg?.addEventListener('mouseleave', () => {
  ktgSvg.style.filter = 'drop-shadow(0 0 30px rgba(255,107,43,.15))';
});

/* ── LOGO ACCENT DOT INTERACTION ─────────────────────────── */
$$('.logo-accent-dot, .l-dot').forEach(dot => {
  dot.style.cursor = 'none';
});

console.log('%c POSI v2 · foundfounded-inspired redesign ',
  'background:#FF6B2B;color:#000;font-weight:700;padding:5px 12px;border-radius:4px;font-size:13px');
