/* ============================================================
   탭 전환
   ============================================================ */
const tabBtns = document.querySelectorAll('.tab-btn');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    /* 모든 탭에서 active 클래스 제거 후 클릭한 탭에만 부여 */
    tabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

/* ============================================================
   캐러셀 (슬라이드 + 터치 스와이프)
   ============================================================ */
(function () {
  const track    = document.getElementById('cTrack');
  const prevBtn  = document.getElementById('prevBtn');
  const nextBtn  = document.getElementById('nextBtn');
  const viewport = track.parentElement; /* .c-viewport */

  /* 카드 너비와 gap — CSS 값과 반드시 일치시킬 것 */
  const CARD_W = 200;
  const GAP    = 14;
  const STEP   = CARD_W + GAP; /* 한 칸 이동 거리(px) */

  let currentIndex = 0; /* 현재 보이는 첫 번째 카드 인덱스 */

  /* 뷰포트 너비에 따라 동시에 표시 가능한 카드 수 계산 */
  function visibleCount() {
    return Math.floor(viewport.clientWidth / STEP);
  }

  function totalCards() {
    return track.querySelectorAll('.c-card').length;
  }

  /* currentIndex 가 유효 범위를 벗어나지 않도록 클램프 */
  function clampIndex(idx) {
    const max = Math.max(0, totalCards() - visibleCount());
    return Math.max(0, Math.min(idx, max));
  }

  /* 트랙 이동 및 화살표 버튼 활성화 상태 갱신 */
  function render() {
    /* 드래그 종료 후 다시 부드러운 트랜지션 복원 */
    track.style.transition = 'transform 0.3s ease';
    track.style.transform  = `translateX(-${currentIndex * STEP}px)`;

    const max = Math.max(0, totalCards() - visibleCount());

    /* 첫 번째 카드일 때 이전 버튼 반투명 처리 */
    prevBtn.style.opacity = currentIndex === 0 ? '0.35' : '1';
    prevBtn.disabled      = currentIndex === 0;

    /* 마지막 카드일 때 다음 버튼 반투명 처리 */
    nextBtn.style.opacity = currentIndex >= max ? '0.35' : '1';
    nextBtn.disabled      = currentIndex >= max;
  }

  /* ── 버튼 클릭 이벤트 ── */
  prevBtn.addEventListener('click', () => {
    currentIndex = clampIndex(currentIndex - 1);
    render();
  });

  nextBtn.addEventListener('click', () => {
    currentIndex = clampIndex(currentIndex + 1);
    render();
  });

  /* ── 창 크기 변경 시 인덱스 재조정 ── */
  window.addEventListener('resize', () => {
    currentIndex = clampIndex(currentIndex);
    render();
  });

  /* ──────────────────────────────────────────────────────────
     터치 스와이프 지원 (모바일·태블릿)

     touchstart  → 시작 X 좌표 기록
     touchmove   → 트랜지션 제거 후 손가락 따라 트랙 실시간 이동
     touchend    → 스와이프 방향·거리 판단 후 가장 가까운 카드로 스냅
     ────────────────────────────────────────────────────────── */
  let touchStartX = 0;  /* 터치 시작 X 좌표 */
  let isDragging  = false;

  viewport.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].clientX;
    isDragging  = true;
    /* 드래그 중에는 트랜지션을 제거해 손가락에 즉각 반응하게 함 */
    track.style.transition = 'none';
  }, { passive: true });

  viewport.addEventListener('touchmove', (e) => {
    if (!isDragging) return;

    const delta = e.changedTouches[0].clientX - touchStartX;
    /* 현재 인덱스 오프셋에 드래그 변위를 더해 실시간 위치 반영 */
    track.style.transform = `translateX(${-(currentIndex * STEP) + delta}px)`;
  }, { passive: true });

  viewport.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    isDragging = false;

    const swipeDist = touchStartX - e.changedTouches[0].clientX;
    const THRESHOLD = 40; /* 최소 스와이프 거리(px): 이 값 이상이어야 카드 이동 */

    if (Math.abs(swipeDist) >= THRESHOLD) {
      if (swipeDist > 0) {
        /* 왼쪽 스와이프 → 다음 카드로 이동 */
        currentIndex = clampIndex(currentIndex + 1);
      } else {
        /* 오른쪽 스와이프 → 이전 카드로 이동 */
        currentIndex = clampIndex(currentIndex - 1);
      }
    }

    /* 최종 인덱스 위치로 부드럽게 스냅 */
    render();
  }, { passive: true });

  /* 초기 렌더링 */
  render();
})();

/* ============================================================
   지난달 도서 모달
   ============================================================ */
(function () {
  const overlay  = document.getElementById('lastMonthModal');
  const closeBtn = document.getElementById('lmModalClose');
  const trigger  = document.querySelector('.lm-text');

  trigger.addEventListener('click', (e) => {
    e.preventDefault();
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
})();

/* ============================================================
   같은 레벨 도서 리스트 모달
   ============================================================ */
(function () {
  const overlay  = document.getElementById('levelBooksModal');
  const closeBtn = document.getElementById('levelBooksModalClose');
  const trigger  = document.querySelector('.books-more');

  trigger.addEventListener('click', () => {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
})();

/* ============================================================
   명예의 전당
   ============================================================ */
(function () {
  const overlay   = document.getElementById('hallModal');
  const closeBtn  = document.getElementById('modalClose');
  const openTrigger = document.querySelector('.yellow-mini');

  openTrigger.addEventListener('click', (e) => {
    e.preventDefault();
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeModal);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
})();
