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

$ cat /tmp/main_top.js > /tmp/main_final.js

cat >> /tmp/main_final.js << 'JSEOF'

/* =========================================
   POSI FILM STRIP — aristide style
   lerp + clamp + 10 projects
   ========================================= */
(function initPosiFilmStrip() {
  var strip = document.getElementById('posi-film-strip');
  if (!strip) return;

  var PROJECTS = [
    { title: 'RIIZE Display',   client: 'LG U+',     cat: 'POSM',    year: '2024', img: 'https://www.posi.co.kr/storage/7UWxQ5ADKahYxLktpZsaKHRi0cBQlSU41w3QMsDw.png' },
    { title: 'Membership KIT',  client: 'HYBE',       cat: 'Package', year: '2021', img: 'https://www.posi.co.kr/storage/9Muoy5efA1LQS9ZlH72VOIw5ALi1bzwnogVN6xQV.png' },
    { title: 'Galaxy Studio',   client: 'Cheil',      cat: 'Display', year: '2022', img: 'https://raw.githubusercontent.com/renee1004/POSI-v2.0/main/images/S22_01.png' },
    { title: 'ENHYPEN KIT',     client: 'HYBE',       cat: 'Package', year: '2023', img: 'https://raw.githubusercontent.com/renee1004/POSI-v2.0/main/images/hybe_03.png' },
    { title: 'Floor Stand',     client: 'Samsung',    cat: 'POSM',    year: '2024', img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80' },
    { title: 'Brand Pop-Up',    client: 'Amorepac',   cat: 'Display', year: '2023', img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80' },
    { title: 'Eco Package',     client: 'Innisfree',  cat: 'Package', year: '2023', img: 'https://images.unsplash.com/photo-1542219550-37153d387c27?w=800&q=80' },
    { title: 'Shelf System',    client: 'Lotte',      cat: 'POSM',    year: '2024', img: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&q=80' },
    { title: 'Premium Set',     client: 'Sulwhasoo',  cat: 'Package', year: '2024', img: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&q=80' },
    { title: 'Glorifier',       client: 'SK-II',      cat: 'Display', year: '2023', img: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=800&q=80' }
  ];

  /* 트랙 생성 */
  var track = document.createElement('div');
  track.className = 'pfs-track';
  strip.appendChild(track);

  PROJECTS.forEach(function(w, i) {
    var item = document.createElement('div');
    item.className = 'pfs-item';
    var num = (i + 1) < 10 ? '0' + (i + 1) : String(i + 1);
    item.innerHTML =
      '<div class="pfs-img-wrap">' +
        '<img src="' + w.img + '" alt="' + w.title + '" loading="lazy" draggable="false"/>' +
      '</div>' +
      '<div class="pfs-info">' +
        '<span class="pfs-num">' + num + '</span>' +
        '<span class="pfs-cat">' + w.cat + ' &middot; ' + w.year + '</span>' +
        '<h3 class="pfs-title">' + w.title + '</h3>' +
        '<p class="pfs-client">' + w.client + '</p>' +
      '</div>';
    track.appendChild(item);
  });

  /* DRAG 커서 */
  var cur = document.createElement('div');
  cur.id = 'pfs-cursor';
  cur.innerHTML = '<span>DRAG</span>';
  document.body.appendChild(cur);

  /* 상태 변수 */
  var isDragging = false;
  var startX = 0;
  var baseX = 0;
  var currentX = 0;
  var targetX = 0;
  var velX = 0;
  var lastMouseX = 0;
  var lastT = 0;
  var rafId = null;
  var EDGE_PAD = 80;

  function getMinX() {
    return -(track.scrollWidth - strip.clientWidth + EDGE_PAD);
  }
  function getMaxX() {
    return EDGE_PAD;
  }
  function clamp(val, mn, mx) {
    return Math.min(Math.max(val, mn), mx);
  }
  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  /* 마우스 이벤트 */
  strip.addEventListener('mousemove', function(e) {
    cur.style.transform = 'translate(' + e.clientX + 'px,' + e.clientY + 'px) translate(-50%,-50%)';
    if (!isDragging) return;
    var dx = e.clientX - startX;
    targetX = clamp(baseX + dx, getMinX(), getMaxX());
    velX = (e.clientX - lastMouseX) / Math.max(1, performance.now() - lastT);
    lastMouseX = e.clientX;
    lastT = performance.now();
  });

  strip.addEventListener('mouseenter', function() {
    cur.style.opacity = '1';
  });

  strip.addEventListener('mouseleave', function() {
    cur.style.opacity = '0';
    if (isDragging) endDrag();
  });

  strip.addEventListener('mousedown', function(e) {
    isDragging = true;
    strip.classList.add('is-dragging');
    cur.classList.add('active');
    startX = e.clientX;
    lastMouseX = e.clientX;
    lastT = performance.now();
    baseX = currentX;
    velX = 0;
    e.preventDefault();
  });

  document.addEventListener('mouseup', function() {
    if (isDragging) endDrag();
  });

  /* 터치 */
  strip.addEventListener('touchstart', function(e) {
    isDragging = true;
    startX = e.touches[0].clientX;
    lastMouseX = startX;
    lastT = performance.now();
    baseX = currentX;
    velX = 0;
  }, { passive: true });

  strip.addEventListener('touchmove', function(e) {
    if (!isDragging) return;
    var dx = e.touches[0].clientX - startX;
    targetX = clamp(baseX + dx, getMinX(), getMaxX());
    velX = (e.touches[0].clientX - lastMouseX) / Math.max(1, performance.now() - lastT);
    lastMouseX = e.touches[0].clientX;
    lastT = performance.now();
    e.preventDefault();
  }, { passive: false });

  strip.addEventListener('touchend', function() {
    endDrag();
  });

  function endDrag() {
    isDragging = false;
    strip.classList.remove('is-dragging');
    cur.classList.remove('active');
    targetX = clamp(currentX + velX * 120, getMinX(), getMaxX());
  }

  /* rAF 루프 lerp */
  function loop() {
    var diff = targetX - currentX;
    var skew = diff * 0.025;
    skew = Math.max(-10, Math.min(10, skew));
    currentX = lerp(currentX, targetX, 0.085);
    track.style.transform = 'translateX(' + currentX.toFixed(2) + 'px) skewX(' + skew.toFixed(3) + 'deg)';
    rafId = requestAnimationFrame(loop);
  }

  /* 호버 */
  track.querySelectorAll('.pfs-item').forEach(function(item) {
    item.addEventListener('mouseenter', function() {
      if (!isDragging) item.classList.add('hovered');
    });
    item.addEventListener('mouseleave', function() {
      item.classList.remove('hovered');
    });
  });

  rafId = requestAnimationFrame(loop);

  window.addEventListener('beforeunload', function() {
    cancelAnimationFrame(rafId);
  });
})();
JSEOF

node --check /tmp/main_final.js && echo "✅ 문법 OK" || echo "❌ 오류"
wc -l /tmp/main_final.js
✅ 문법 OK
478 /tmp/main_final.js

})();
