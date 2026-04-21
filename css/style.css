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
   POSI FILM STRIP — aristide style
   lerp + clamp + 10 projects
   ========================================= */
(function initPosiFilmStrip() {
  var strip = document.getElementById('posi-film-strip');
  if (!strip) return;

  var PROJECTS = [
    { title: 'RIIZE Display',      client: 'LG U+',      cat: 'POSM',       year: '2024', img: 'https://raw.githubusercontent.com/renee1004/POSI-v2.0/main/images/riize_01.png',  desc: 'LG U+ × RIIZE 콜라보 디스플레이. 매장 내 고객 시선을 집중시키는 대형 POSM으로, 아티스트 이미지와 브랜드 아이덴티티를 극대화.' },
    { title: 'Membership KIT',     client: 'HYBE',        cat: 'Package',    year: '2021', img: 'https://www.posi.co.kr/storage/9Muoy5efA1LQS9ZlH72VOIw5ALi1bzwnogVN6xQV.png',   desc: 'HYBE 아티스트 멤버십 회원 전용 특별 패키지. 팬덤 문화를 반영한 프리미엄 언박싱 경험과 수집 가치를 동시에 설계.' },
    { title: 'Galaxy Studio',      client: 'Cheil',       cat: 'Display',    year: '2022', img: 'https://raw.githubusercontent.com/renee1004/POSI-v2.0/main/images/S22.png',       desc: 'Samsung Galaxy S22 체험존 디스플레이 키트. 소비자가 제품 기능을 직접 체험할 수 있는 3D 구조물 및 인터랙티브 디스플레이를 설계.' },
    { title: 'ENHYPEN KIT',        client: 'HYBE',        cat: 'Package',    year: '2023', img: 'https://raw.githubusercontent.com/renee1004/POSI-v2.0/main/images/hybe_03.png',   desc: 'ENHYPEN 공식 멤버십 패키지 디자인. 그룹의 세계관과 팬덤 정체성을 담은 한정판 콜렉터블 패키지.' },
    { title: 'LG U+',       client: 'LG U+',       cat: 'Display',    year: '2024', img: 'https://www.posi.co.kr/storage/7UWxQ5ADKahYxLktpZsaKHRi0cBQlSU41w3QMsDw.png',   desc: 'RIIZE 팝업 스토어 전체 VM 가이드 및 디스플레이 설계. 브랜드 팝업 공간에서의 몰입형 경험을 극대화한 공간 연출.' },
    { title: 'LG TWINS',client: 'LG U+',        cat: 'Display',    year: '2025', img: 'https://raw.githubusercontent.com/renee1004/POSI-v2.0/main/images/LG_TWINS_02.jpg',  desc: 'U+ 일상의 틈 X LG TWINS 플랫폼 매장 스디스플레이. LG 트윈스 한국시리즈 우승기원 연출.' },
    { title: 'Samsung Experience', client: 'Cheil',       cat: 'Display',    year: '2023', img: 'https://raw.githubusercontent.com/renee1004/POSI-v2.0/main/images/cheil_photo_booth.png',       desc: 'Samsung galaxy_photo_booth. 카메라의의 혁신적 기술력을 직접 경험하게 하는 인터랙티브 체험킷.' },
    { title: 'SEOUL MY SOUL',   client: '서울시',        cat: 'Display',    year: '2025', img: 'https://raw.githubusercontent.com/renee1004/POSI-v2.0/main/images/hi_seoul.png',   desc: '서울시 서울마이소울 · 해치&소울프렌즈 팝업 스토어 VMD연출.' },
    { title: 'VIP 기프트 카드',    client: 'LG U+',       cat: 'Stationery',       year: '2025', img: 'https://raw.githubusercontent.com/renee1004/POSI-v2.0/main/images/U+틈_05.png',   desc: 'VIP 기프트 카드 디자인 및 제작.' },
    { title: 'TXT Display',    client: 'LG U+',        cat: 'Display',    year: '2025', img: 'https://raw.githubusercontent.com/renee1004/POSI-v2.0/main/images/txt_02.png',   desc: '투모로우바이투게더 콜라보 디스플레이. 매장 내 고객 시선을 집중시키는 대형 POSM으로, 아티스트 이미지와 브랜드 아이덴티티를 극대화.' },
    { title: 'TXT Display',    client: 'LG U+',     cat: 'Display',       year: '2024', img: 'https://raw.githubusercontent.com/renee1004/POSI-v2.0/main/images/txt_01.png',  desc: '투모로우바이투게더 콜라보 디스플레이. 매장 내 고객 시선을 집중시키는 대형 POSM으로, 아티스트 이미지와 브랜드 아이덴티티를 극대화.' },
    { title: 'Belif',    client: 'LG생활건강',        cat: 'VMD',    year: '2020', img: 'https://raw.githubusercontent.com/renee1004/POSI-v2.0/main/images/belif.png',   desc: ' 빌리프 색조모듈 디스플레이.' },
    { title: 'Maplestory 키캡',      client: 'NEXON Japan',       cat: 'Product',    year: '2023', img: 'https://raw.githubusercontent.com/renee1004/POSI-v2.0/main/images/NEXON Japan.png',       desc: '일본 NEXTON의 메이플스토리 굿즈 디자인 및 제작' },
    { title: '귀멸의 칼날 Pop-Up',   client: 'SMG',    cat: 'Popup Store',    year: '2025', img: 'https://raw.githubusercontent.com/renee1004/POSI-v2.0/main/images/귀멸.png',   desc: '귀멸의 칼날 굿즈 팝업스토어 디스플레이 연출.' },
    { title: '주토피아2.png',     client: 'Disny',       cat: 'Popup Store', year: '2025', img: 'https://raw.githubusercontent.com/renee1004/POSI-v2.0/main/images/주토피아2.png',   desc: '더 현대 주토피아2 팝업스토어 디스플레이 연출.' }
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

  /* ── 마우스 Y 트래킹 (물결용) ── */
  var mouseY = 0;
  var targetMouseY = 0;
  strip.addEventListener('mousemove', function(e) {
    targetMouseY = e.clientY;
  });

  /* ── 각 카드 개별 wave 상태 ── */
  var items = track.querySelectorAll('.pfs-item');
  var itemCount = items.length;




  /* ── rAF 루프 — vertical curve wave 효과 ── */
  function loop() {
    var diff = targetX - currentX;
    currentX = lerp(currentX, targetX, 0.072);
    track.style.transform = 'translateX(' + currentX.toFixed(2) + 'px)';
      /* ── 면분할: focusWeight 계산 후 width 적용 ── */
      var stripCx = strip.getBoundingClientRect().left + strip.clientWidth / 2;
      items.forEach(function(item, i) {
        var r   = item.getBoundingClientRect();
        var icx = r.left + r.width / 2;
        var dist    = Math.abs(icx - stripCx);
        var falloff = strip.clientWidth * 0.42;
        var tv  = Math.min(dist / falloff, 1);
        var fw  = Math.max(0, 1 - tv * tv * tv * tv);
        /* 호버한 카드는 최소 0.85 보장 */
        if (hoverIdx === i) fw = Math.max(fw, 0.85);
        focusWeights[i] = fw;
        item.style.width = (SLIVER_W + (SLIVER_FOCUS - SLIVER_W) * fw).toFixed(1) + 'px';
      });
    mouseY = lerp(mouseY, targetMouseY, 0.08);

    var stripRect = strip.getBoundingClientRect();
    var velocity = currentX - targetX;
    var dragForce = Math.max(-1, Math.min(1, velocity / 180));
    var waveAmp = Math.min(42, Math.abs(diff) * 0.12 + Math.abs(velX * 90));

    items.forEach(function(item, i) {
      var t = itemCount <= 1 ? 0 : i / (itemCount - 1);
      var curve = Math.sin(t * Math.PI);
      var edgeLift = Math.cos(t * Math.PI * 2) * 0.5;

      /* 핵심: 중앙이 더 크게 처지고, 양끝은 상대적으로 덜 움직이는 수직 곡선 */
      var yOffset = curve * waveAmp * (-dragForce);
      yOffset += edgeLift * waveAmp * 0.18 * (dragForce > 0 ? 1 : -1);

      /* 마우스 Y에 따라 곡선 강도 미세 조절 */
      if (stripRect.height > 0) {
        var stripCenterY = stripRect.top + stripRect.height / 2;
        var mouseRelY = (mouseY - stripCenterY) / (stripRect.height * 0.5);
        mouseRelY = Math.max(-1, Math.min(1, mouseRelY));
        yOffset += mouseRelY * curve * 10;
      }

      /* 수직 곡선에 맞춘 미세 회전/스케일 */
      var edgeBias = Math.abs(0.5 - t) / 0.5;
      var rotate = dragForce * edgeBias * 0.55;
      var scaleY = 1 - Math.abs(curve * dragForce) * 0.02;
      var scaleX = 1 + Math.abs(curve * dragForce) * 0.008;

      item.style.transform =
        'translateY(' + yOffset.toFixed(2) + 'px)' +
        ' rotate(' + rotate.toFixed(3) + 'deg)' +
        ' scaleX(' + scaleX.toFixed(4) + ')' +
        ' scaleY(' + scaleY.toFixed(4) + ')';
    });

    rafId = requestAnimationFrame(loop);
  }

    /* ── 면분할 + 호버 ── */
    var SLIVER_W     = 72;
    var SLIVER_FOCUS = 420;
    var focusWeights = Array.from(items).map(function(){ return 0; });
    var hoverIdx     = -1;
  
    items.forEach(function(item, i) {
      item.addEventListener('mouseenter', function() {
        if (!isDragging) { item.classList.add('hovered'); hoverIdx = i; }
      });
      item.addEventListener('mouseleave', function() {
        item.classList.remove('hovered'); hoverIdx = -1;
      });
    });

  rafId = requestAnimationFrame(loop);
  
  /* ── 휠 → 수평 이동 ── */
  strip.addEventListener('wheel', function(e) {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      targetX = clamp(targetX - e.deltaY * 2.2, getMinX(), getMaxX());
      e.preventDefault();
    }
  }, { passive: false });

  window.addEventListener('beforeunload', function() {
    cancelAnimationFrame(rafId);
  });

  /* ══════════════════════════════════════
     POSI PROJECT DETAIL OVERLAY
     클릭 → 전체화면 확대 + 스크롤로 닫기
  ══════════════════════════════════════ */
  (function initOverlay() {
    /* 오버레이 DOM 생성 */
    var overlay = document.createElement('div');
    overlay.id = 'pfs-overlay';
    overlay.innerHTML =
      '<div class="pfo-backdrop"></div>' +
      '<div class="pfo-inner">' +
        '<div class="pfo-img-wrap">' +
          '<img class="pfo-img" src="" alt="" />' +
        '</div>' +
        '<div class="pfo-content">' +
          '<div class="pfo-meta">' +
            '<span class="pfo-num"></span>' +
            '<span class="pfo-cat"></span>' +
          '</div>' +
          '<h2 class="pfo-title"></h2>' +
          '<p class="pfo-client"></p>' +
          '<p class="pfo-desc"></p>' +
          '<div class="pfo-scroll-hint"><span>SCROLL TO CLOSE</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 5v14M5 12l7 7 7-7"/></svg></div>' +
        '</div>' +
        '<button class="pfo-close" aria-label="닫기">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 6L6 18M6 6l12 12"/></svg>' +
        '</button>' +
      '</div>';
    document.body.appendChild(overlay);

    var activeIndex = -1;
    var isOpen = false;
    var scrollAccum = 0;
    var SCROLL_THRESHOLD = 120;

    function openOverlay(idx) {
      var p = PROJECTS[idx];
      if (!p) return;
      activeIndex = idx;
      isOpen = true;
      scrollAccum = 0;

      overlay.querySelector('.pfo-img').src = p.img;
      overlay.querySelector('.pfo-img').alt = p.title;
      overlay.querySelector('.pfo-num').textContent = (idx + 1 < 10 ? '0' + (idx + 1) : idx + 1) + ' / ' + PROJECTS.length;
      overlay.querySelector('.pfo-cat').textContent = p.cat + ' · ' + p.year;
      overlay.querySelector('.pfo-title').textContent = p.title;
      overlay.querySelector('.pfo-client').textContent = p.client;
      overlay.querySelector('.pfo-desc').textContent = p.desc || '';

      overlay.classList.add('is-open');
      document.body.classList.add('pfo-lock');
    }

    function closeOverlay() {
      isOpen = false;
      activeIndex = -1;
      overlay.classList.remove('is-open');
      overlay.classList.add('is-closing');
      document.body.classList.remove('pfo-lock');
      setTimeout(function() {
        overlay.classList.remove('is-closing');
      }, 600);
    }

    /* 카드 클릭 이벤트 */
    items.forEach(function(item, i) {
      item.addEventListener('click', function() {
        if (isDragging) return;
        openOverlay(i);
      });
      item.style.cursor = 'pointer';
    });

    /* 닫기 버튼 */
    overlay.querySelector('.pfo-close').addEventListener('click', closeOverlay);

    /* 배경 클릭 닫기 */
    overlay.querySelector('.pfo-backdrop').addEventListener('click', closeOverlay);

    /* 스크롤로 닫기 */
    overlay.addEventListener('wheel', function(e) {
      if (!isOpen) return;
      scrollAccum += Math.abs(e.deltaY);
      var bar = overlay.querySelector('.pfo-scroll-hint span');
      var pct = Math.min(scrollAccum / SCROLL_THRESHOLD, 1);
      if (bar) bar.style.opacity = 0.3 + pct * 0.7;
      if (scrollAccum >= SCROLL_THRESHOLD) closeOverlay();
      e.preventDefault();
    }, { passive: false });

    /* 터치 스와이프 다운으로 닫기 */
    var touchStartY = 0;
    overlay.addEventListener('touchstart', function(e) {
      touchStartY = e.touches[0].clientY;
    }, { passive: true });
    overlay.addEventListener('touchmove', function(e) {
      if (!isOpen) return;
      var dy = e.touches[0].clientY - touchStartY;
      if (dy > 80) closeOverlay();
    }, { passive: true });

    /* ESC 키 닫기 */
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && isOpen) closeOverlay();
    });
  })();

})();
