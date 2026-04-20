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
   AB WORK STAGE — aristide-inspired focus rail
   ========================================= */
(function initAbWorkStage() {
  var root = document.getElementById('ab-work');
  if (!root) return;

  var PROJECTS = [
    { title: 'RIIZE Display', client: 'LG U+', cat: 'POSM', year: '2024', img: 'https://raw.githubusercontent.com/renee1004/POSI-v2.0/main/images/riize_01.png', desc: 'LG U+ × RIIZE 콜라보 반응형 디스플레이. 매장 내 고객 시선을 집중시키는 대형 POSM으로, 아티스트 이미지와 브랜드 아이덴티티를 극대화했습니다.' },
    { title: 'Membership KIT', client: 'HYBE', cat: 'Package', year: '2021', img: 'https://www.posi.co.kr/storage/9Muoy5efA1LQS9ZlH72VOIw5ALi1bzwnogVN6xQV.png', desc: 'HYBE 아티스트 멤버십 회원 전용 특별 패키지. 팬덤 문화를 반영한 프리미엄 언박싱 경험과 수집 가치를 동시에 설계했습니다.' },
    { title: 'Galaxy Studio', client: 'Cheil', cat: 'Display', year: '2022', img: 'https://raw.githubusercontent.com/renee1004/POSI-v2.0/main/images/S22.png', desc: 'Samsung Galaxy S22 체험존 디스플레이 키트. 제품의 혁신적 기술력을 직접 경험하게 하는 인터랙티브 구조물로 제품 구매 전환율을 높였습니다.' },
    { title: 'ENHYPEN KIT', client: 'HYBE', cat: 'Package', year: '2023', img: 'https://raw.githubusercontent.com/renee1004/POSI-v2.0/main/images/hybe_03.png', desc: 'ENHYPEN 공식 멤버십 패키지 디자인. 그룹의 세계관과 팬덤 정체성을 담은 한정판 콜렉터블 패키지입니다.' },
    { title: 'RIIZE Pop-Up', client: 'LG U+', cat: 'Display', year: '2024', img: 'https://www.posi.co.kr/storage/7UWxQ5ADKahYxLktpZsaKHRi0cBQlSU41w3QMsDw.png', desc: 'RIIZE 팝업 스토어 전체 VM 가이드 및 디스플레이 설계. 브랜드 팝업 공간에서의 몰입형 경험을 극대화한 공간 연출입니다.' },
    { title: 'Special Edition KIT', client: 'HYBE', cat: 'Package', year: '2022', img: 'https://raw.githubusercontent.com/renee1004/POSI-v2.0/main/images/riize_01.png', desc: '아티스트 스페셜 에디션 한정 패키지. 희소성과 소장 가치를 극대화한 구조 설계 및 소재 선정으로 팬덤 반응을 이끌어냈습니다.' },
    { title: 'Samsung Experience', client: 'Cheil', cat: 'Display', year: '2023', img: 'https://raw.githubusercontent.com/renee1004/POSI-v2.0/main/images/S22.png', desc: 'Samsung 플래그십 스토어 체험 키트. 소비자가 제품 기능을 직접 체험할 수 있는 3D 구조물 및 인터랙티브 디스플레이를 설계했습니다.' },
    { title: 'Artist KIT Vol.2', client: 'HYBE', cat: 'Package', year: '2024', img: 'https://raw.githubusercontent.com/renee1004/POSI-v2.0/main/images/hybe_03.png', desc: 'HYBE 아티스트 공식 굿즈 패키지 2탄. 전작의 성공을 바탕으로 더욱 정교해진 구조와 소재로 프리미엄 언박싱 경험을 완성했습니다.' },
    { title: 'Responsive POSM', client: 'LG U+', cat: 'POSM', year: '2023', img: 'https://www.posi.co.kr/storage/9Muoy5efA1LQS9ZlH72VOIw5ALi1bzwnogVN6xQV.png', desc: '다양한 매장 환경에 대응하는 모듈형 POSM 시스템. 공간 크기에 따라 유연하게 변형 가능한 구조로 전국 유통망에 통일된 브랜드 경험을 제공합니다.' },
    { title: 'Limited Box Set', client: 'HYBE', cat: 'Package', year: '2024', img: 'https://www.posi.co.kr/storage/7UWxQ5ADKahYxLktpZsaKHRi0cBQlSU41w3QMsDw.png', desc: '연말 한정판 럭셔리 박스 세트. 자석 개폐 구조와 특수 후가공 인쇄를 적용해 선물용 프리미엄 패키지의 완성도를 높였습니다.' },
    { title: 'Shelf Glorifier', client: 'Samsung', cat: 'POSM', year: '2024', img: 'https://raw.githubusercontent.com/renee1004/POSI-v2.0/main/images/riize_01.png', desc: 'Samsung 제품 진열 글로리파이어. 선반 위 제품을 돋보이게 하는 아크릴 및 LED 구조물로 매장 내 제품 노출도와 구매 의향을 높였습니다.' },
    { title: 'Fan Meeting KIT', client: 'HYBE', cat: 'Package', year: '2023', img: 'https://raw.githubusercontent.com/renee1004/POSI-v2.0/main/images/hybe_03.png', desc: '팬미팅 현장 배포용 스페셜 패키지. 현장의 설렘과 감동을 집으로 가져갈 수 있도록 기획된 기념 패키지로 팬덤 만족도를 극대화했습니다.' },
    { title: 'Brand Display', client: 'Cheil', cat: 'Display', year: '2022', img: 'https://raw.githubusercontent.com/renee1004/POSI-v2.0/main/images/S22.png', desc: '브랜드 아이덴티티를 강화하는 대형 인스토어 디스플레이. 소비자 동선을 고려한 전략적 배치로 브랜드 인지도와 체류 시간을 높였습니다.' },
    { title: 'Premium Gift Set', client: 'Amorepac', cat: 'Package', year: '2024', img: 'https://www.posi.co.kr/storage/9Muoy5efA1LQS9ZlH72VOIw5ALi1bzwnogVN6xQV.png', desc: 'Amorepacific 프리미엄 선물 세트 패키지. 브랜드의 럭셔리 이미지를 담은 친환경 소재 패키지로 ESG 가치와 심미성을 동시에 구현했습니다.' },
    { title: 'Store VM Guide', client: 'Lotte', cat: 'Activation', year: '2023', img: 'https://www.posi.co.kr/storage/7UWxQ5ADKahYxLktpZsaKHRi0cBQlSU41w3QMsDw.png', desc: '롯데 전국 매장 VM 가이드 개발. 시즌별 매장 디스플레이 매뉴얼을 제작해 브랜드 일관성을 유지하면서도 지역 특성에 맞는 연출을 가능하게 했습니다.' }
  ];

  var rail = document.getElementById('ab-rail');
  var stage = document.getElementById('ab-stage');
  var stageImg = document.getElementById('ab-stage-img');
  var stageIndex = document.getElementById('ab-stage-index');
  var stageMeta = document.getElementById('ab-stage-meta');
  var stageTitle = document.getElementById('ab-stage-title');
  var stageClient = document.getElementById('ab-stage-client');
  var stageDesc = document.getElementById('ab-stage-desc');

  var active = 0;
  var currentX = 0;
  var targetX = 0;
  var dragging = false;
  var startX = 0;
  var baseX = 0;
  var lastX = 0;
  var lastT = 0;
  var velocity = 0;
  var rafId = null;

  PROJECTS.forEach(function(p, i) {
    var card = document.createElement('button');
    card.className = 'ab-card' + (i === 0 ? ' is-active' : '');
    card.type = 'button';
    card.setAttribute('data-index', i);
    card.innerHTML =
      '<span class="ab-card-num">' + String(i + 1).padStart(2, '0') + '</span>' +
      '<span class="ab-card-thumb"><img src="' + p.img + '" alt="' + p.title + '" loading="lazy"></span>' +
      '<span class="ab-card-copy"><strong>' + p.title + '</strong><em>' + p.client + '</em></span>';
    card.addEventListener('click', function() {
      setActive(i, true);
    });
    rail.appendChild(card);
  });

  var cards = Array.prototype.slice.call(rail.querySelectorAll('.ab-card'));

  function renderStage(i, animate) {
    var p = PROJECTS[i];
    if (!p) return;
    if (animate) stage.classList.add('is-switching');
    setTimeout(function() {
      stageImg.src = p.img;
      stageImg.alt = p.title;
      stageIndex.textContent = String(i + 1).padStart(2, '0');
      stageMeta.textContent = p.cat + ' · ' + p.year;
      stageTitle.textContent = p.title;
      stageClient.textContent = p.client;
      stageDesc.textContent = p.desc;
      stage.classList.remove('is-switching');
    }, animate ? 120 : 0);
  }

  function centerCard(i) {
    var card = cards[i];
    if (!card) return;
    var railRect = rail.getBoundingClientRect();
    var cardRect = card.getBoundingClientRect();
    var localLeft = (cardRect.left - railRect.left) - currentX;
    targetX = Math.min(0, rail.clientWidth * 0.5 - (localLeft + cardRect.width * 0.5));
  }

  function setActive(i, animate) {
    active = i;
    cards.forEach(function(card, idx) {
      card.classList.toggle('is-active', idx === i);
    });
    renderStage(i, animate);
    centerCard(i);
  }

  function clampTarget() {
    var max = 0;
    var min = Math.min(0, root.clientWidth - rail.scrollWidth - 40);
    targetX = Math.max(min, Math.min(max, targetX));
  }

  function onMove(x) {
    if (!dragging) return;
    var dx = x - startX;
    targetX = baseX + dx;
    clampTarget();
    var now = performance.now();
    velocity = (x - lastX) / Math.max(1, now - lastT);
    lastX = x;
    lastT = now;
  }

  rail.addEventListener('mousedown', function(e) {
    dragging = true;
    root.classList.add('is-dragging');
    startX = e.clientX;
    lastX = e.clientX;
    lastT = performance.now();
    baseX = currentX;
  });

  window.addEventListener('mousemove', function(e) { onMove(e.clientX); });
  window.addEventListener('mouseup', function() {
    if (!dragging) return;
    dragging = false;
    root.classList.remove('is-dragging');
    targetX += velocity * 120;
    clampTarget();
  });

  rail.addEventListener('touchstart', function(e) {
    dragging = true;
    startX = e.touches[0].clientX;
    lastX = startX;
    lastT = performance.now();
    baseX = currentX;
  }, { passive: true });

  rail.addEventListener('touchmove', function(e) {
    onMove(e.touches[0].clientX);
    e.preventDefault();
  }, { passive: false });

  rail.addEventListener('touchend', function() {
    if (!dragging) return;
    dragging = false;
    targetX += velocity * 120;
    clampTarget();
  });

  root.addEventListener('wheel', function(e) {
    targetX -= e.deltaY * 0.9;
    clampTarget();
    e.preventDefault();
  }, { passive: false });

  root.addEventListener('mousemove', function(e) {
    var rect = stage.getBoundingClientRect();
    var xp = (e.clientX - rect.left) / rect.width - 0.5;
    var yp = (e.clientY - rect.top) / rect.height - 0.5;
    stage.style.setProperty('--mx', xp.toFixed(3));
    stage.style.setProperty('--my', yp.toFixed(3));
  });

  function autoSelectFromCenter() {
    var rootRect = root.getBoundingClientRect();
    var center = rootRect.left + rootRect.width * 0.5;
    var nearest = active;
    var minDist = Infinity;
    cards.forEach(function(card, i) {
      var r = card.getBoundingClientRect();
      var c = r.left + r.width * 0.5;
      var d = Math.abs(center - c);
      if (d < minDist) {
        minDist = d;
        nearest = i;
      }
    });
    if (nearest !== active) {
      active = nearest;
      cards.forEach(function(card, idx) {
        card.classList.toggle('is-active', idx === nearest);
      });
      renderStage(nearest, true);
    }
  }

  function loop() {
    currentX += (targetX - currentX) * 0.08;
    rail.style.transform = 'translate3d(' + currentX.toFixed(2) + 'px,0,0)';

    var force = Math.max(-1, Math.min(1, (targetX - currentX) / 90));
    cards.forEach(function(card, i) {
      var rect = card.getBoundingClientRect();
      var rootRect = root.getBoundingClientRect();
      var cx = rect.left + rect.width * 0.5;
      var rx = rootRect.left + rootRect.width * 0.5;
      var dist = (cx - rx) / rootRect.width;
      var curve = Math.sin((i / Math.max(1, cards.length - 1)) * Math.PI);
      var y = curve * Math.abs(force) * 26 * (force > 0 ? -1 : 1);
      var rot = force * 7 + dist * 12;
      var scale = 1 - Math.min(0.12, Math.abs(dist) * 0.22);
      card.style.setProperty('--ty', y.toFixed(2) + 'px');
      card.style.setProperty('--rot', rot.toFixed(3) + 'deg');
      card.style.setProperty('--scale', scale.toFixed(4));
    });

    autoSelectFromCenter();
    rafId = requestAnimationFrame(loop);
  }

  renderStage(0, false);
  clampTarget();
  rafId = requestAnimationFrame(loop);
  window.addEventListener('resize', function() { clampTarget(); centerCard(active); });
  window.addEventListener('beforeunload', function() { cancelAnimationFrame(rafId); });
})();

