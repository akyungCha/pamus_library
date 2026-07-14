/* ============================================================
   도서 목록 페이지(더미)
   (추후 API / 화면 로직과 완전히 분리함)
   ============================================================ */

/* 1뎁스 분류 탭 — levelStart~levelEnd: 해당 라인이 포괄하는 전체 단계 범위 */
const CATEGORIES = [
  { id: 'all',                  label: '전체' },
  { id: 'phonics',               label: '파닉스 단계',      levelStart: 1,  levelEnd: 6  },
  { id: 'pre-stella',            label: '프리스텔라',       levelStart: 7,  levelEnd: 18 },
  { id: 'silver-stella',         label: '실버스텔라',       levelStart: 19, levelEnd: 30 },
  { id: 'bridge-inter-stella',   label: '브릿지/인터스텔라', levelStart: 31, levelEnd: 54 },
  { id: 'gold-stella',           label: '골드스텔라',       levelStart: 55, levelEnd: 74 },
  { id: 'supernova-plus',        label: '슈퍼노바 이후',    levelStart: 75, levelEnd: 81 },
];

/* 2뎁스 단계 필 — 선택된 라인(category)의 levelStart~levelEnd 범위를 그대로 펼친 배열 */
function getLevelsForCategory(categoryId) {
  const cat = CATEGORIES.find((c) => c.id === categoryId);
  if (!cat || !cat.levelStart) return [];
  const levels = [];
  for (let lv = cat.levelStart; lv <= cat.levelEnd; lv++) levels.push(lv);
  return levels;
}

/* 도서 목록 샘플 데이터, isCleared: true 읽은도서 뱃지 스타일 추가 */
const BOOKS = [
  { id: 1,  title: 'Over and Under',      category: 'phonics',             level: 1, br: 100, lexile: 400, tag: 'more',     thumb: 'list_thumb1.png', isCleared: true },
  { id: 2,  title: 'I Can Count to 10!',  category: 'phonics',             level: 1, br: 90,  lexile: 380, tag: 'required', thumb: 'list_thumb2.png', isCleared: true },
  { id: 3,  title: 'Dinosaurs Count!',    category: 'phonics',             level: 1, br: 70,  lexile: 350, tag: 'more',     thumb: 'list_thumb3.png', isCleared: true },
  { id: 4,  title: 'Over and Under',      category: 'phonics',             level: 2, br: 110, lexile: 420, tag: 'required', thumb: 'list_thumb1.png' },
  { id: 5,  title: 'I Can Count to 10!',  category: 'phonics',             level: 2, br: 95,  lexile: 400, tag: 'more',     thumb: 'list_thumb2.png' },
  { id: 6,  title: 'Dinosaurs Count!',    category: 'phonics',             level: 3, br: 80,  lexile: 360, tag: 'more',     thumb: 'list_thumb3.png' },
  { id: 7,  title: 'Amazing Animals',     category: 'pre-stella',          level: 7,  br: 120, lexile: 450, tag: 'required', thumb: 'list_thumb1.png' },
  { id: 8,  title: 'The Little Star',     category: 'pre-stella',          level: 12, br: 130, lexile: 470, tag: 'more',     thumb: 'list_thumb2.png' },
  { id: 9,  title: 'Ocean Friends',       category: 'pre-stella',          level: 18, br: 140, lexile: 500, tag: 'required', thumb: 'list_thumb3.png' },
  { id: 10, title: 'Space Adventure',     category: 'silver-stella',       level: 19, br: 150, lexile: 520, tag: 'more',     thumb: 'list_thumb1.png' },
  { id: 11, title: 'Mystery Island',      category: 'silver-stella',       level: 24, br: 160, lexile: 540, tag: 'required', thumb: 'list_thumb2.png' },
  { id: 12, title: 'The Brave Knight',    category: 'silver-stella',       level: 30, br: 170, lexile: 560, tag: 'more',     thumb: 'list_thumb3.png' },
  { id: 13, title: 'Bridge to Nowhere',   category: 'bridge-inter-stella', level: 31, br: 180, lexile: 600, tag: 'required', thumb: 'list_thumb1.png' },
  { id: 14, title: 'Interstellar Journey',category: 'bridge-inter-stella', level: 42, br: 190, lexile: 620, tag: 'more',     thumb: 'list_thumb2.png' },
  { id: 15, title: 'Galaxy Quest',        category: 'bridge-inter-stella', level: 54, br: 200, lexile: 650, tag: 'required', thumb: 'list_thumb3.png' },
  { id: 16, title: 'Gold Rush',           category: 'gold-stella',         level: 55, br: 210, lexile: 680, tag: 'more',     thumb: 'list_thumb1.png' },
  { id: 17, title: 'The Golden Key',      category: 'gold-stella',         level: 65, br: 220, lexile: 700, tag: 'required', thumb: 'list_thumb2.png' },
  { id: 18, title: 'Stellar Voyage',      category: 'gold-stella',         level: 74, br: 230, lexile: 720, tag: 'more',     thumb: 'list_thumb3.png', isCleared: true },
  { id: 19, title: 'Supernova Rising',    category: 'supernova-plus',      level: 75, br: 240, lexile: 750, tag: 'required', thumb: 'list_thumb1.png', isCleared: true },
  { id: 20, title: 'Beyond the Stars',    category: 'supernova-plus',      level: 81, br: 250, lexile: 800, tag: 'more',     thumb: 'list_thumb2.png', isCleared: true },
];
