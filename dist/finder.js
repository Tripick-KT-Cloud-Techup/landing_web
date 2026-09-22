(()=>{
  const $=s=>document.querySelector(s), all=window.TRIPICK_CATALOG.products;
  let mode='quick',pick='share',page=0,results=[];
  const modes=[...document.querySelectorAll('[data-mode]')];
  const labels={friend:'친구',family:'가족',partner:'연인',colleague:'동료',me:'나'};
  const categories={tea:'차 · 말차',craft:'공예 · 생활 소품',design:'디자인 · 문구'};
  const money=n=>n.toLocaleString('ko-KR')+'원';
  const selectedText=id=>$(id).selectedOptions[0].textContent;
  function node(tag,cls,text){const n=document.createElement(tag);if(cls)n.className=cls;if(text)n.textContent=text;return n;}
  function conditions(){return {mode,pick,taste:$('#taste').value,recipient:$('#recipient').value,budget:$('#budget').value};}
  function paint(){
    const list=$('#product-results');list.replaceChildren();
    const visible=results.slice(page*3,page*3+3), c=conditions();
    $('#result-context').textContent=mode==='personal'?`${labels[c.recipient]} · ${selectedText('#taste')} · ${selectedText('#budget')}`:`${document.querySelector('[data-pick].active').textContent} · ${selectedText('#budget')}`;
    $('#result-count').textContent=results.length?`${results.length}개 후보 중 ${page*3+1}–${page*3+visible.length}`:'조건에 맞는 후보가 없어요';
    $('#result-status').textContent=`${$('#result-context').textContent}. ${$('#result-count').textContent}`;
    if(!visible.length){const empty=node('div','finder-empty');empty.append(node('strong','','조금 다른 조건으로 찾아볼까요?'),node('p','','선택한 예산과 취향을 모두 만족하는 상품이 아직 없어요. 예산을 늘리거나 취향을 넓혀보세요.'));list.append(empty);}
    visible.forEach(p=>{
      const card=node('article','product-card');
      const media=node('div','product-media'),img=node('img');img.src=p.image;img.alt=p.originalName+' 제품 사진';img.width=128;img.height=144;img.loading='lazy';img.addEventListener('error',()=>{img.hidden=true;media.append(node('span','image-unavailable','사진 준비 중'));},{once:true});media.append(img);
      const content=node('div','product-info');content.append(node('small','product-category',categories[p.category]),node('h4','',p.name));
      let reason=p.description;
      if(mode==='personal'&&p.recipients.includes(c.recipient))reason=(c.recipient==='me'?'나를 위한':`${labels[c.recipient]}에게 건네기 좋은`)+' 픽. '+reason;
      content.append(node('p','product-reason',reason));
      const price=node('div','product-price');price.append(node('strong','',`약 ${money(p.price)}`),node('span','',`US $${p.usd.toFixed(2)}`));content.append(price);
      const details=node('details','product-details');details.append(node('summary','','상품 정보 · 출처'));
      details.append(node('p','',`${p.brand} · ${p.originalName}${p.variant!=='Default Title'?' · '+p.variant:''}`));
      if(!p.availableAtCapture)details.append(node('p','','확인 시 선택 옵션 품절 · 현재 재고는 판매처에서 확인하세요.'));
      const link=node('a','','판매처에서 상품 보기 →');link.href=p.url;link.target='_blank';link.rel='noopener noreferrer';details.append(link);content.append(details);
      card.append(media,content);list.append(card);
    });
    $('#more-products').hidden=results.length<=3;
    $('#more-products').textContent=page*3+3<results.length?'다른 후보 보기 →':'처음 추천으로 돌아가기 →';
    $('#recommendation').classList.add('result-emphasis');
    if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches)list.animate([{opacity:.4,transform:'translateY(7px)'},{opacity:1,transform:'translateY(0)'}],{duration:280,easing:'ease-out'});
  }
  function refresh(){page=0;results=window.TripickRecommendation.recommend(all,conditions());paint();}
  function setMode(next){mode=next;modes.forEach(b=>{const active=b.dataset.mode===mode;b.classList.toggle('active',active);b.setAttribute('aria-selected',String(active));b.tabIndex=active?0:-1;});$('#quick-controls').hidden=mode!=='quick';$('#personal-controls').hidden=mode!=='personal';$('#demo-panel').setAttribute('aria-labelledby',mode==='quick'?'quick-tab':'personal-tab');$('#demo-title').textContent=mode==='quick'?'어떤 선물을 찾고 있나요?':'누구의 미소가 떠오르나요?';$('#demo-subtitle').textContent=mode==='quick'?'나누기 좋은 차부터 작은 소품까지 골라보세요.':'대상과 취향에 맞는 제품을 예산 안에서 찾아요.';refresh();}
  modes.forEach((b,i)=>{b.addEventListener('click',()=>setMode(b.dataset.mode));b.addEventListener('keydown',e=>{let next;if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))next=1-i;else if(e.key==='Home')next=0;else if(e.key==='End')next=1;else return;e.preventDefault();modes[next].focus();setMode(modes[next].dataset.mode);});});
  document.querySelectorAll('[data-pick]').forEach(b=>b.addEventListener('click',()=>{pick=b.dataset.pick;document.querySelectorAll('[data-pick]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',String(x===b));});refresh();}));
  ['#recipient','#taste','#budget'].forEach(id=>$(id).addEventListener('change',refresh));
  $('#recommend-button').addEventListener('click',refresh);
  $('#more-products').addEventListener('click',()=>{page=page*3+3<results.length?page+1:0;paint();});
  if(navigator.modelContext?.registerTool){
    navigator.modelContext.registerTool({name:'preview_tripick_recommendation',description:'Compare real catalog products in the Tripick preview. Prices are reference conversions, not live prices or inventory.',inputSchema:{type:'object',properties:{mode:{type:'string',enum:['quick','personal']},category:{type:'string',enum:['share','light','local','all','craft','tea','design']}},required:['mode']},execute:async({mode:next,category})=>{
      if(!['quick','personal'].includes(next))throw new Error('Invalid mode');
      if(next==='quick'&&['share','light','local'].includes(category)){pick=category;document.querySelectorAll('[data-pick]').forEach(b=>{b.classList.toggle('active',b.dataset.pick===pick);b.setAttribute('aria-pressed',String(b.dataset.pick===pick));});}
      if(next==='personal'&&['all','craft','tea','design'].includes(category))$('#taste').value=category;
      setMode(next);$('#experience').scrollIntoView({behavior:'auto'});
      return {content:[{type:'text',text:JSON.stringify({referenceCatalog:true,count:results.length,products:results.slice(0,3).map(p=>({name:p.name,url:p.url}))})}]};
    }});
  }
  refresh();
})();
