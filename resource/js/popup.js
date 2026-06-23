const STEPS = [
  { label: 'WORDS' },
  { label: 'READING' },
  { label: 'QUIZ' },
  { label: 'WORD\nPRACTICE' },
  { label: 'WORD\nGAME' },
  { label: 'READ\nALOUD' },
  { label: 'FLUENCY' },
];

// true = 완료; 기본값: 0번, 1번 단계 완료 상태
const completed = [true, true, false, false, false, false, false];

function fillPercent() {
  const last = completed.lastIndexOf(true);
  if (last < 0) return 0;
  return (last / (STEPS.length - 1)) * 100;
}

// DOM 트랙을 한 번만 생성
function buildTrack() {
  const container = document.getElementById('trackContainer');
  STEPS.forEach((step, i) => {
    const item = document.createElement('div');
    item.className = 'step-item';
    item.dataset.index = i;

    const circle = document.createElement('div');
    circle.className = 'node-circle';
    circle.textContent = i + 1;

    const label = document.createElement('span');
    label.className = 'node-label';
    label.innerHTML = step.label.replace('\n', '<br>');

    item.appendChild(circle);
    item.appendChild(label);
    item.addEventListener('click', () => onStepClick(i));
    container.appendChild(item);
  });
}

function applyStates() {
  const items = document.querySelectorAll('.step-item');
  items.forEach((item, i) => {
    item.classList.remove('s-completed', 's-incomplete');
    item.classList.add(completed[i] ? 's-completed' : 's-incomplete');
  });
  document.getElementById('trackFill').style.width = fillPercent() + '%';
}

// 클릭 시 완료 ↔ 미완료 토글
function onStepClick(index) {
  completed[index] = !completed[index];
  applyStates();
}

// 초기화
buildTrack();
applyStates();

// 채움을 0으로 고정한 뒤 한 틱 후 애니메이션 시작
const fill = document.getElementById('trackFill');
fill.style.transition = 'none';
fill.style.width = '0%';

const items = document.querySelectorAll('.step-item');

// 노드 바운스 인 애니메이션을 순차적으로 실행
items.forEach((item, i) => {
  setTimeout(() => {
    item.classList.add('animate', 'visible');
    // 애니메이션 종료 후 클래스 제거 (재렌더링 시 즉시 표시되도록)
    item.addEventListener('animationend', () => item.classList.remove('animate'), { once: true });
  }, 150 + i * 110);
});

// 모든 노드가 나타난 후 채움 애니메이션 시작
setTimeout(() => {
  fill.style.transition = 'width 0.9s cubic-bezier(0.4, 0, 0.2, 1)';
  fill.style.width = fillPercent() + '%';
}, 150 + STEPS.length * 110 - 60);
