/* ============================================================
   도서 목록 섹션 — 상태 + 순수 함수 + 렌더링
   (리액트 포팅을 염두에 두고 filter/sort/paginate 는 상태와
   데이터만 받아 결과를 반환하는 순수 함수로 유지)
   ============================================================ */

const TAG_LABELS = {
  more:     '더보기 도서',
  required: '필독 도서',
};

const PAGE_SIZE = 12;

/* 단일 상태 객체 — 모든 이벤트 핸들러는 이 객체만 갱신한다 */
const listState = {
  category:     'all',
  level:        1,
  requiredOnly: false,
  sort:         'lexile-desc', /* 'lexile-desc' | 'lexile-asc' */
  page:         1,
};

/* ── 순수 함수: 필터 ── */
function filterBooks(books, state) {
  return books.filter((book) => {
    if (state.category !== 'all' && book.category !== state.category) return false;
    if (state.category !== 'all' && book.level !== state.level) return false;
    if (state.requiredOnly && book.tag !== 'required') return false;
    return true;
  });
}

/* ── 순수 함수: 정렬 (렉사일 기준) ── */
function sortBooks(books, sort) {
  const sorted = books.slice();
  sorted.sort((a, b) => (sort === 'lexile-asc' ? a.lexile - b.lexile : b.lexile - a.lexile));
  return sorted;
}

/* ── 순수 함수: 페이지네이션 ── */
function paginateBooks(books, page, pageSize) {
  const start = (page - 1) * pageSize;
  return books.slice(start, start + pageSize);
}

/* ── 순수 함수: 도서 카드 마크업 ── */
function renderBookCard(book) {
  const tagClass = book.tag === 'required' ? 'tag-required' : 'tag-more';
  const tagLabel = TAG_LABELS[book.tag];
  const clearBadge = book.isCleared ? `<img src="resource/imgs/clear.svg" alt="다 읽음" class="clear-badge">` : '';

  return `
    <div class="book-card">
      <div class="book-thumb-wrap" role="button" tabindex="0">
        <img src="resource/imgs/${book.thumb}" alt="${book.title}" class="book-thumb-img">
        ${clearBadge}
        <span class="thumb-badge level-badge">${book.level}단계</span>
        <span class="thumb-badge br-badge">BR${book.br}</span>
      </div>
      <p class="grid-book-title">${book.title}</p>
      <span class="grid-tag ${tagClass}">${tagLabel}</span>
    </div>
  `;
}

/* ── 순수 함수: 1뎁스 탭 마크업 ── */
function renderCategoryTabs(state) {
  return CATEGORIES.map((cat) => {
    const active = cat.id === state.category ? ' active' : '';
    return `<button type="button" class="category-tab-btn${active}" data-category="${cat.id}">${cat.label}</button>`;
  }).join('');
}

/* ── 순수 함수: 2뎁스 필 마크업 (전체 선택 시 빈 문자열) ── */
function renderLevelPills(state) {
  if (state.category === 'all') return '';

  return getLevelsForCategory(state.category).map((lv) => {
    const active = lv === state.level ? ' active' : '';
    return `<button type="button" class="level-pill-btn${active}" data-level="${lv}">${lv}단계</button>`;
  }).join('');
}

/* ── 순수 함수: 페이지네이션 마크업 ── */
function renderPagination(totalItems, state) {
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const current = Math.min(state.page, totalPages);

  let html = '';
  for (let p = 1; p <= totalPages; p++) {
    const active = p === current ? ' active' : '';
    html += `<button type="button" class="page-num-btn${active}" data-page="${p}">${p}</button>`;
  }
  html += `<button type="button" class="page-arrow-btn" data-page="${Math.min(current + 1, totalPages)}" aria-label="다음 페이지">&gt;</button>`;
  html += `<button type="button" class="page-arrow-btn" data-page="${totalPages}" aria-label="마지막 페이지">&gt;&gt;</button>`;
  return html;
}

/* ============================================================
   화면 갱신 — 위 순수 함수들의 결과를 각 컨테이너에 주입
   ============================================================ */
function renderList(state) {
  const filtered = filterBooks(BOOKS, state);
  const sorted   = sortBooks(filtered, state.sort);
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  state.page = Math.min(state.page, totalPages);
  const paged = paginateBooks(sorted, state.page, PAGE_SIZE);

  document.getElementById('bookGrid').innerHTML = paged.map(renderBookCard).join('');
  document.getElementById('listTotal').innerHTML = `총 <strong>${sorted.length}</strong>권`;
  document.getElementById('pagination').innerHTML = renderPagination(sorted.length, state);
}

/* 탭/필까지 포함한 전체 갱신 (1뎁스·2뎁스 변경 시 사용) */
function renderAll(state) {
  document.getElementById('categoryTabs').innerHTML = renderCategoryTabs(state);
  document.getElementById('levelPills').innerHTML   = renderLevelPills(state);
  document.getElementById('levelPillsRow').style.display = state.category === 'all' ? 'none' : '';
  renderList(state);
}

/* ============================================================
   이벤트 바인딩 — 상태 갱신 후 렌더 함수 호출만 수행
   ============================================================ */
(function () {
  document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn.dataset.tab === 'mybook') {
        window.location.href = 'index.html';
        return;
      }
      if (btn.dataset.tab === 'booklist') {
        window.location.href = 'list.html';
        return;
      }
    });
  });

  document.getElementById('categoryTabs').addEventListener('click', (e) => {
    const btn = e.target.closest('.category-tab-btn');
    if (!btn) return;
    listState.category = btn.dataset.category;
    listState.level = getLevelsForCategory(listState.category)[0] || 1;
    listState.page = 1;
    renderAll(listState);
  });

  document.getElementById('levelPills').addEventListener('click', (e) => {
    const btn = e.target.closest('.level-pill-btn');
    if (!btn) return;
    listState.level = Number(btn.dataset.level);
    listState.page = 1;
    renderAll(listState);
  });

  document.getElementById('requiredOnlyCheckbox').addEventListener('change', (e) => {
    listState.requiredOnly = e.target.checked;
    listState.page = 1;
    renderList(listState);
  });

  document.getElementById('sortSelect').addEventListener('change', (e) => {
    listState.sort = e.target.value;
    listState.page = 1;
    renderList(listState);
  });

  document.getElementById('pagination').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-page]');
    if (!btn) return;
    listState.page = Number(btn.dataset.page);
    renderList(listState);
  });

  document.getElementById('bookGrid').addEventListener('click', (e) => {
    if (!e.target.closest('.book-thumb-wrap')) return;
    window.open('learning-popup.html', '_blank', 'width=860,height=700');
  });

  renderAll(listState);
})();
