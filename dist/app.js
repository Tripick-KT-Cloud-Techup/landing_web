// The landing page demonstrates planned product flows with clearly labeled examples.
const iconPaths = {
  search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
  route:'<circle cx="5" cy="5" r="2"/><circle cx="19" cy="19" r="2"/><path d="M7 5h8a4 4 0 0 1 0 8H9a4 4 0 0 0 0 8h8"/>',
  bag:'<rect x="5" y="7" width="14" height="14" rx="3"/><path d="M9 7V5a3 3 0 0 1 6 0v2M9 11v6m6-6v6M8 21v1m8-1v1"/>',
  bolt:'<path d="m13 2-9 12h7l-1 8 10-13h-7l1-7Z"/>',
  heart:'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',
  pin:'<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  scan:'<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5M7 12h10"/>',
  image:'<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8" cy="8" r="1.5"/><path d="m3 17 5-5 4 4 4-6 5 7"/>',
  send:'<path d="m22 2-7 20-4-9L2 9 22 2ZM11 13 22 2"/>',
  box:'<path d="m12 3 9 5v9l-9 5-9-5V8l9-5ZM3 8l9 5 9-5m-9 5v9M7.5 5.5l9 5V15"/>',
  home:'<path d="m3 10 9-8 9 8v11H3V10Zm6 11v-8h6v8"/>'
};
document.querySelectorAll('[data-icon]').forEach(el=>{el.innerHTML=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPaths[el.dataset.icon]||''}</svg>`;});

const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
const revealElements=document.querySelectorAll('.reveal');
if('IntersectionObserver' in window && !reducedMotion.matches){
  const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}});},{threshold:.12});
  revealElements.forEach((el)=>{el.classList.add('reveal-ready');observer.observe(el);});
}
const header=document.querySelector('.header');
const heroPhoto=document.querySelector('.hero-photo');
const journeyLine=document.querySelector('.journey-line');
let scrollQueued=false;
function updateScroll(){
  header.classList.toggle('scrolled',window.scrollY>30);
  if(!reducedMotion.matches && window.scrollY<950)heroPhoto.style.transform=`translateY(${Math.min(window.scrollY*.075,42)}px)`;
  if(journeyLine){const rect=journeyLine.getBoundingClientRect();journeyLine.style.setProperty('--progress',`${Math.min(100,Math.max(0,(window.innerHeight-rect.top)/(window.innerHeight*.58)*100))}%`);}
  scrollQueued=false;
}
window.addEventListener('scroll',()=>{if(!scrollQueued){scrollQueued=true;requestAnimationFrame(updateScroll);}},{passive:true});updateScroll();

let currentMode='quick';
let currentPick='share';
const modeButtons=[...document.querySelectorAll('[data-mode]')];
const resultTitle=document.querySelector('#result-title');
const resultDescription=document.querySelector('#result-description');
const resultDetail=document.querySelector('#result-detail');
const recommendation=document.querySelector('#recommendation');
const quickExamples={
  share:{title:'함께 나누는 로컬 과자',description:'하나씩 나누기 좋은 개별 포장 간식. 동료들의 취향을 모두 몰라도 가볍게 마음을 전할 수 있어요.',detail:'확인할 것 · 수량, 알레르기, 유통기한',tag:'개별 포장'},
  light:{title:'가방에 쏙, 여행 엽서와 작은 문구',description:'작고 가벼운 종이 소품은 짐이 많은 여행에도 부담이 적어요. 여행지의 풍경을 담은 디자인으로 골라보세요.',detail:'확인할 것 · 무게, 포장 크기',tag:'가벼운 선물'},
  local:{title:'여행지의 손길을 담은 공예 소품',description:'지역의 소재와 제작 이야기가 담긴 소품을 찾아보세요. 작은 물건에도 그곳에서만 만난 기억을 담을 수 있어요.',detail:'확인할 것 · 제작지, 크기, 파손 주의',tag:'지역의 이야기'}
};
const personalExamples={
  craft:{title:'일상에 작은 여행, 도자기 찻잔',description:'공예 소품을 좋아하는 {recipient}에게 손에 닿는 질감이 있는 찻잔을 제안해요. 자주 쓰는 물건일수록 여행의 마음도 오래 남아요.',detail:'함께 확인 · 실제 크기와 안전한 포장'},
  tea:{title:'느긋한 시간을 선물하는 차',description:'차와 디저트를 좋아하는 {recipient}에게 향과 원재료를 살펴 고르는 티 선물은 어떨까요? 취향에 맞는 한 잔의 시간을 전해보세요.',detail:'함께 확인 · 원재료, 유통기한, 반입 조건'},
  design:{title:'기록하는 취향을 위한 종이 소품',description:'디자인과 문구를 좋아하는 {recipient}에게 여행지의 감각이 담긴 노트와 엽서를 제안해요. 가볍게 챙기면서도 개성을 전할 수 있어요.',detail:'함께 확인 · 종이 질감과 디자인'}
};
function renderExample(animate=false){
  let result;
  if(currentMode==='quick')result=quickExamples[currentPick];
  else {
    const recipient=document.querySelector('#recipient').selectedOptions[0].textContent;
    const budget=document.querySelector('#budget').selectedOptions[0].textContent;
    const budgetTier=document.querySelector('#budget').value;
    result={...personalExamples[document.querySelector('#taste').value]};
    result.description=result.description.replace('{recipient}',recipient);
    result.detail=`예산 ${budget} · ${budgetTier==='low'?'단품 위주로 살펴보기':budgetTier==='medium'?'단품과 작은 세트 비교하기':'선물 세트와 포장 함께 살펴보기'}`;
    result.tag=`${recipient}에게 전하는 선물`;
  }
  resultTitle.textContent=result.title;resultDescription.textContent=result.description;resultDetail.textContent=result.detail;
  recommendation.querySelector('.result-label').textContent=currentMode==='quick'?'QUICK PICK':'PICKED FOR YOU';
  recommendation.querySelector('.result-tag').textContent=result.tag;
  if(animate&&!reducedMotion.matches)recommendation.animate([{opacity:.35,transform:'translateY(9px)'},{opacity:1,transform:'translateY(0)'}],{duration:420,easing:'ease-out'});
}
function setMode(mode){
  currentMode=mode;
  modeButtons.forEach(button=>{const active=button.dataset.mode===mode;button.classList.toggle('active',active);button.setAttribute('aria-selected',String(active));button.tabIndex=active?0:-1;});
  document.querySelector('#quick-controls').hidden=mode!=='quick';document.querySelector('#personal-controls').hidden=mode!=='personal';
  document.querySelector('#demo-panel').setAttribute('aria-labelledby',mode==='quick'?'quick-tab':'personal-tab');
  document.querySelector('#demo-title').textContent=mode==='quick'?'어떤 선물을 찾고 있나요?':'누구의 미소가 떠오르나요?';
  document.querySelector('#demo-subtitle').textContent=mode==='quick'?'나눠주기 좋은 선물을 빠르게 골라볼까요?':'그 사람의 취향을 조금 알려주세요.';
  renderExample(true);
}
modeButtons.forEach((button,index)=>{
  button.addEventListener('click',()=>setMode(button.dataset.mode));
  button.addEventListener('keydown',event=>{let next;if(['ArrowRight','ArrowDown'].includes(event.key))next=(index+1)%2;else if(['ArrowLeft','ArrowUp'].includes(event.key))next=(index+1)%2;else if(event.key==='Home')next=0;else if(event.key==='End')next=1;else return;event.preventDefault();modeButtons[next].focus();setMode(modeButtons[next].dataset.mode);});
});
document.querySelectorAll('[data-pick]').forEach(button=>button.addEventListener('click',()=>{currentPick=button.dataset.pick;document.querySelectorAll('[data-pick]').forEach(chip=>{const active=chip===button;chip.classList.toggle('active',active);chip.setAttribute('aria-pressed',String(active));});renderExample(true);}));
document.querySelectorAll('#personal-controls select').forEach(select=>select.addEventListener('change',()=>renderExample(true)));
document.querySelector('#recommend-button').addEventListener('click',()=>{renderExample(true);recommendation.classList.remove('result-emphasis');requestAnimationFrame(()=>recommendation.classList.add('result-emphasis'));document.querySelector('#recommend-button').firstChild.textContent='추천 예시 다시 살펴보기 ';});

// Agent-readable presentation controls, where WebMCP is supported.
if(navigator.modelContext && typeof navigator.modelContext.registerTool==='function'){
  navigator.modelContext.registerTool({name:'preview_tripick_recommendation',description:'Show a labeled sample souvenir recommendation on the Tripick landing page. This is a static demonstration, not live AI, stock, pricing or purchasing.',inputSchema:{type:'object',properties:{mode:{type:'string',enum:['quick','personal']},category:{type:'string',enum:['share','light','local','craft','tea','design']}},required:['mode']},execute:async({mode,category})=>{if(!['quick','personal'].includes(mode))throw new Error('Invalid recommendation mode');if(mode==='quick'&&category&&quickExamples[category]){currentPick=category;document.querySelectorAll('[data-pick]').forEach(chip=>{const active=chip.dataset.pick===category;chip.classList.toggle('active',active);chip.setAttribute('aria-pressed',String(active));});}if(mode==='personal'&&category&&personalExamples[category])document.querySelector('#taste').value=category;setMode(mode);document.querySelector('#experience').scrollIntoView({behavior:reducedMotion.matches?'auto':'smooth'});return{content:[{type:'text',text:JSON.stringify({sample:true,title:resultTitle.textContent,description:resultDescription.textContent})}]};}});
}
