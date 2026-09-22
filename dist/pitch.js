(() => {
  'use strict';
  const chapters = [
    ['welcome', '오프닝'], ['evidence', '문제의 근거'], ['why', '문제 정의'],
    ['last-hours', '출국 5시간 전'], ['experience', '추천 체험'],
    ['ar', '탐색 · 크기 · 길 안내'], ['story', '스토리 카드'], ['delivery', '배송'], ['how', '선물 여정'],
    ['why-ai', '왜 AI인가'], ['business', '수익 모델'], ['market', '초기 시장'],
    ['roadmap', '검증 계획'], ['closing', '감사합니다']
  ];
  const root = document.documentElement;
  const controls = document.getElementById('pitch-controls');
  const chooser = document.getElementById('pitch-chapter');
  const position = document.getElementById('pitch-position');
  const prev = document.getElementById('pitch-prev');
  const next = document.getElementById('pitch-next');
  let active = false;
  let index = 0;
  chapters.forEach(([id, title], i) => {
    const option = document.createElement('option');
    option.value = String(i);
    option.textContent = `${String(i + 1).padStart(2, '0')} · ${title}`;
    chooser.append(option);
  });
  const hashIndex = () => chapters.findIndex(([id]) => `#${id}` === location.hash);
  function show(target, updateUrl = true) {
    index = Math.max(0, Math.min(chapters.length - 1, target));
    chapters.forEach(([id], i) => document.getElementById(id).classList.toggle('pitch-current', i === index));
    chooser.value = String(index);
    position.textContent = `${index + 1} / ${chapters.length}`;
    prev.disabled = index === 0;
    next.disabled = index === chapters.length - 1;
    if (updateUrl) {
      const url = new URL(location.href);
      url.hash = chapters[index][0];
      history.replaceState(null, '', url);
    }
    window.scrollTo({top: 0, behavior: 'instant'});
  }
  function start() {
    active = true;
    root.classList.add('pitch-mode');
    controls.hidden = false;
    const url = new URL(location.href);
    url.searchParams.set('present', '1');
    history.replaceState(null, '', url);
    show(Math.max(0, hashIndex()));
    const current = document.getElementById(chapters[index][0]);
    current.setAttribute('tabindex', '-1');
    current.focus({preventScroll: true});
  }
  function stop() {
    active = false;
    root.classList.remove('pitch-mode');
    controls.hidden = true;
    const url = new URL(location.href);
    url.searchParams.delete('present');
    history.replaceState(null, '', url);
    document.getElementById(chapters[index][0]).scrollIntoView({behavior: 'instant'});
    document.getElementById('pitch-launch').focus({preventScroll: true});
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  }
  document.getElementById('pitch-launch').addEventListener('click', start);
  document.getElementById('pitch-exit').addEventListener('click', stop);
  prev.addEventListener('click', () => show(index - 1));
  next.addEventListener('click', () => show(index + 1));
  chooser.addEventListener('change', () => show(Number(chooser.value)));
  document.getElementById('pitch-fullscreen').addEventListener('click', async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (root.requestFullscreen) await root.requestFullscreen();
      else document.getElementById('pitch-fullscreen').textContent = '브라우저 전체 화면 사용';
    } catch {
      document.getElementById('pitch-fullscreen').textContent = '브라우저 전체 화면 사용';
    }
  });
  document.addEventListener('keydown', event => {
    if (!active || event.altKey || event.ctrlKey || event.metaKey || document.querySelector('dialog[open]')) return;
    if (event.target.closest('input, select, textarea, [contenteditable="true"], [role="tablist"]')) return;
    const keys = ['ArrowRight', 'ArrowLeft', 'PageDown', 'PageUp', 'Home', 'End'];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    if (event.key === 'Home') show(0);
    else if (event.key === 'End') show(chapters.length - 1);
    else show(index + (['ArrowRight', 'PageDown'].includes(event.key) ? 1 : -1));
  });
  document.addEventListener('click', event => {
    const anchor = event.target.closest('a[href^="#"]');
    if (!active || !anchor) return;
    const target = chapters.findIndex(([id]) => `#${id}` === anchor.getAttribute('href'));
    if (target >= 0) { event.preventDefault(); show(target); }
  });
  window.addEventListener('hashchange', () => { if (active && hashIndex() >= 0) show(hashIndex(), false); });
  if (new URLSearchParams(location.search).get('present') === '1') start();
})();
