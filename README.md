# POSI — 2025 Redesign v2.1
## foundfounded.com inspired · Ultra-minimal · Impact · 5-Font Typography System

---

## 🎯 디자인 컨셉
| 항목 | 내용 |
|------|------|
| **참고** | foundfounded.com (서울 크리에이티브 스튜디오) |
| **철학** | Ultra-minimal · Typographic Impact · Less is More |
| **컬러** | Light `#F5F4F0` / Dark `#0A0A0A` + Accent `#FF6B2B` |
| **폰트** | 5-Font System (아래 참고) |
| **로고** | SVG 인라인 — 워드마크 + **Neon Lime 도트** |

---

## 🔤 타이포그래피 전략 (v2.1 신규)

| 변수 | 폰트명 | 스타일/무드 | 활용 영역 |
|------|--------|------------|----------|
| `--font-kr` | **Pretendard Variable** | 모던함, 극강 가독성, 중립성 | GNB 메뉴, 프로젝트 설명, 본문, 태그 |
| `--font-title` | **Clash Display** | 과감함, 브루탈리즘, 시각적 타격감 | Hero 초대형 타이틀, 숫자, 마키 |
| `--font-en` | **Inter** | IT/Tech 감성, 미니멀리즘 | 영문 UI, 버튼, 캡션, 레이블 |
| `--font-luxury` | **Playfair Display** | 하이엔드, 우아함, 매거진 무드 | Contact 빅 타이틀 (이탤릭 강조) |
| *(국문 포인트)* | **Pretendard Bold** | 신뢰감, 단단함 | About 헤드라인, 섹션 제목 |

> **Sandoll Gothic Neo1**은 웹폰트 CDN이 공개되지 않아 Pretendard Bold로 대체 적용

---

## ✅ 구현 기능

### 디자인
- **라이트 / 다크 테마 전환** (localStorage 저장)
- **초대형 Outlined 타이포** Hero (stroke-only text)
- **배경 그리드 라인** (버티컬 세로선)
- **서비스 리스트** — Accordion-style hover rows
- **KT&G 전용 클라이언트 섹션** (PMI·BAT·IQOS·Lil·Vuse 완전 제거)
- `"기밀 유지 계약에 따라 공개 불가"` 문구 포함

### 인터랙션
- 커스텀 커서 (Lag + Big/Click 상태)
- 로더 스크린 (SVG 로고 + Progress bar)
- Scroll Reveal (IntersectionObserver)
- Hero 패럴랙스 스크롤
- 카운터 롤업 애니메이션
- 마그네틱 버튼
- 서비스 행 Hover Dim 효과
- Work 그리드 필터
- Process 카드 3D Tilt

---

## 📂 파일 구조
```
index.html
css/style.css
js/main.js
README.md
```

## 🔗 앵커 URI
| 섹션 | 앵커 |
|------|------|
| Hero | `#hero` |
| About | `#about` |
| Service | `#service` |
| Work | `#work` |
| Contact | `#contact` |

---

## ⚠️ 클라이언트 노출 정책
- **공개**: KT&G
- **비공개**: PMI / BAT / IQOS / Lil / Vuse (기밀 유지 계약)

---

## 🚀 다음 단계
- [ ] 실제 포트폴리오 이미지 교체
- [ ] 정확한 연락처 정보 입력
- [ ] 영문 버전 분기
- [ ] 문의폼 실제 전송 연동

*POSI Creative Team × HARU AI · 2025–2026*
