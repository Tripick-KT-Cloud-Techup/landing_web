(()=>{
  const $=s=>document.querySelector(s), all=window.TRIPICK_CATALOG.products;
  let mode='quick',pick='share',page=0,results=[];
  let loadingTimers=[];
  const submitLabel=$('#recommend-button').innerHTML;
  const modes=[...document.querySelectorAll('[data-mode]')];
  const labels={friend:'친구',family:'가족',partner:'연인',colleague:'동료',me:'나'};
  const categories={tea:'차 · 말차',craft:'공예 · 생활 소품',design:'디자인 · 문구',food:'디저트 · 먹거리'};
  const countries={KR:'한국',JP:'일본',TW:'대만',FR:'프랑스'};
  const money=n=>n.toLocaleString('ko-KR')+'원';
  const priceText=p=>(p.currency==='KRW'?'':'약 ')+money(p.price);
  const sourcePrice=p=>new Intl.NumberFormat('ko-KR',{style:'currency',currency:p.currency||'USD'}).format(p.amount??p.usd);
  const selectedText=id=>$(id).selectedOptions[0].textContent;
  function node(tag,cls,text){const n=document.createElement(tag);if(cls)n.className=cls;if(text)n.textContent=text;return n;}
  function conditions(){return {country:$('#country').value,mode,pick,taste:$('#taste').value,recipient:$('#recipient').value,budget:$('#budget').value};}
  function openProduct(p,c){
    const body=$('#finder-dialog-content');body.replaceChildren();
    const media=node('div','finder-dialog-product-media'),img=node('img');img.src=p.image;img.alt=p.originalName+' 제품 사진';img.width=320;img.height=210;media.append(img);
    const title=node('h3','',p.name);title.id='finder-dialog-title';
    let reason=p.description;
    if(mode==='personal'&&p.recipients.includes(c.recipient))reason=(c.recipient==='me'?'나를 위한':`${labels[c.recipient]}에게 건네기 좋은`)+' 픽. '+reason;
    const price=node('div','product-price');price.append(node('strong','',priceText(p)));if(p.currency!=='KRW')price.append(node('span','',`판매처 표시가 ${sourcePrice(p)}`));
    body.append(media,node('small','product-category',categories[p.category]),title,node('p','product-reason',reason),price,node('p','',`${p.brand} · ${p.originalName}${p.variant!=='Default Title'?' · '+p.variant:''}`));
    if(p.availableAtCapture===false)body.append(node('p','','확인 시 선택 옵션 품절 · 현재 재고는 판매처에서 확인하세요.'));
    const link=node('a','','판매처에서 상품 보기 →');link.href=p.url;link.target='_blank';link.rel='noopener noreferrer';body.append(link);
    $('#finder-product-dialog').showModal();
  }
  function paint(){
    const list=$('#product-results');list.replaceChildren();
    const visible=results.slice(page*3,page*3+3), c=conditions();
    $('#result-context').textContent=`${countries[c.country]} · `+(mode==='personal'?`${labels[c.recipient]} · ${selectedText('#taste')} · ${selectedText('#budget')}`:`${document.querySelector('[data-pick].active').textContent} · ${selectedText('#budget')}`);
    $('#result-count').textContent=results.length?`${results.length}개 후보 중 ${page*3+1}–${page*3+visible.length}`:'조건에 맞는 후보가 없어요';
    $('#result-status').textContent=`${$('#result-context').textContent}. ${$('#result-count').textContent}`;
    if(!visible.length){const empty=node('div','finder-empty');empty.append(node('strong','','조금 다른 조건으로 찾아볼까요?'),node('p','',`${countries[c.country]}의 등록 상품 중 선택한 조건에 맞는 후보가 아직 없어요. 예산을 늘리거나 선물 종류를 바꿔보세요.`));list.append(empty);}
    visible.forEach(p=>{
      const card=node('article','product-card');
      const media=node('div','product-media'),img=node('img');img.src=p.image;img.alt=p.originalName+' 제품 사진';img.width=128;img.height=144;img.loading='lazy';img.addEventListener('error',()=>{img.hidden=true;media.append(node('span','image-unavailable','사진 준비 중'));},{once:true});media.append(img);
      const content=node('div','product-info');content.append(node('small','product-category',categories[p.category]),node('h4','',p.name));
      const price=node('div','product-price');price.append(node('strong','',priceText(p)));content.append(price);
      const details=node('button','product-details-button','추천 이유 · 상품 정보');details.type='button';details.setAttribute('aria-haspopup','dialog');details.setAttribute('aria-label',`${p.name} 추천 이유 및 상품 정보 보기`);details.addEventListener('click',()=>openProduct(p,c));content.append(details);
      card.append(media,content);list.append(card);
    });
    $('#more-products').hidden=results.length<=3;
    $('#more-products').textContent=page*3+3<results.length?'다른 후보 보기 →':'처음 추천으로 돌아가기 →';
    $('#recommendation').classList.add('result-emphasis');
    if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches)list.animate([{opacity:.4,transform:'translateY(7px)'},{opacity:1,transform:'translateY(0)'}],{duration:280,easing:'ease-out'});
  }
  function cancelLoading(){
    loadingTimers.forEach(clearTimeout);loadingTimers=[];
    $('#recommend-button').disabled=false;
    $('#recommend-button').innerHTML=submitLabel;
    $('#product-results').setAttribute('aria-busy','false');
  }
  function placeholder(loading=false){
    results=[];page=0;
    $('#recommendation').classList.remove('result-emphasis');
    $('.finder-result-top').hidden=true;
    $('#result-context').hidden=true;
    $('#result-count').textContent='';
    $('#more-products').hidden=true;
    const panel=node('div',loading?'finder-wait finder-wait-loading':'finder-wait');
    const symbol=node('span','finder-wait-symbol',loading?'✦':'✧');symbol.setAttribute('aria-hidden','true');
    const title=node('strong','',loading?'여행 조건을 살펴보고 있어요':'어떤 선물이 기다리고 있을까요?');
    title.id='finder-wait-title';
    const description=node('p','',loading?'선택한 여행지와 예산에 맞춰 후보를 좁히고 있어요.':'조건을 고른 뒤 추천 상품 보기를 눌러주세요.');
    description.id='finder-wait-description';
    panel.append(symbol,title,description);
    if(loading){
      const steps=node('div','finder-loading-steps');steps.setAttribute('aria-hidden','true');
      ['조건 확인','후보 비교','추천 정리'].forEach((label,i)=>{const step=node('span',i===0?'active':'',label);steps.append(step);});
      panel.append(steps);
    }
    $('#product-results').replaceChildren(panel);
    $('#result-status').textContent=loading?'선택한 조건에 맞는 기념품을 찾고 있습니다.':'조건을 선택한 후 추천 상품 보기 버튼을 눌러주세요.';
  }
  function refresh(){
    cancelLoading();page=0;results=window.TripickRecommendation.recommend(all,conditions());
    $('.finder-result-top').hidden=false;$('#result-context').hidden=false;paint();
  }
  function conditionsChanged(){
    cancelLoading();
    if(mode==='quick')placeholder();else refresh();
  }
  function requestRecommendation(){
    cancelLoading();placeholder(true);
    $('#product-results').setAttribute('aria-busy','true');
    $('#recommend-button').disabled=true;
    $('#recommend-button').textContent='기념품 고르는 중…';
    const stages=[
      [750,'어울리는 기념품을 비교하고 있어요','선물 종류와 예산에 맞는 상품을 살펴보고 있어요.'],
      [1500,'당신을 위한 픽을 정리하고 있어요','비교하기 좋은 후보를 골라 곧 보여드릴게요.']
    ];
    stages.forEach(([delay,title,description],index)=>loadingTimers.push(setTimeout(()=>{
      $('#finder-wait-title').textContent=title;
      $('#finder-wait-description').textContent=description;
      document.querySelectorAll('.finder-loading-steps span').forEach((step,i)=>step.classList.toggle('active',i<=index+1));
    },delay)));
    loadingTimers.push(setTimeout(refresh,2300));
  }
  function changeCountry(){
    const countryProducts=all.filter(p=>(p.country||'JP')===$('#country').value);
    $('#catalog-count').textContent=`${countryProducts.length}개 제품 큐레이션`;
    [...$('#taste').options].forEach(option=>{option.disabled=option.value!=='all'&&!countryProducts.some(p=>p.category===option.value);});
    if($('#taste').selectedOptions[0].disabled)$('#taste').value='all';
    conditionsChanged();
  }
  function setMode(next){mode=next;modes.forEach(b=>{const active=b.dataset.mode===mode;b.classList.toggle('active',active);b.setAttribute('aria-selected',String(active));b.tabIndex=active?0:-1;});$('#quick-controls').hidden=mode!=='quick';$('#personal-controls').hidden=mode!=='personal';$('#demo-panel').setAttribute('aria-labelledby',mode==='quick'?'quick-tab':'personal-tab');$('#demo-title').textContent=mode==='quick'?'어떤 선물을 찾고 있나요?':'누구의 미소가 떠오르나요?';$('#demo-subtitle').textContent=mode==='quick'?'나누기 좋은 차부터 작은 소품까지 골라보세요.':'대상과 취향에 맞는 제품을 예산 안에서 찾아요.';conditionsChanged();}
  modes.forEach((b,i)=>{b.addEventListener('click',()=>setMode(b.dataset.mode));b.addEventListener('keydown',e=>{let next;if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))next=1-i;else if(e.key==='Home')next=0;else if(e.key==='End')next=1;else return;e.preventDefault();modes[next].focus();setMode(modes[next].dataset.mode);});});
  document.querySelectorAll('[data-pick]').forEach(b=>b.addEventListener('click',()=>{pick=b.dataset.pick;document.querySelectorAll('[data-pick]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',String(x===b));});conditionsChanged();}));
  ['#recipient','#taste','#budget'].forEach(id=>$(id).addEventListener('change',conditionsChanged));
  $('#country').addEventListener('change',changeCountry);
  $('#recommend-button').addEventListener('click',requestRecommendation);
  $('#more-products').addEventListener('click',()=>{page=page*3+3<results.length?page+1:0;paint();});
  $('#pricing-info-button').addEventListener('click',()=>$('#finder-pricing-dialog').showModal());
  document.querySelectorAll('[data-close-dialog]').forEach(button=>button.addEventListener('click',()=>button.closest('dialog').close()));
  document.querySelectorAll('.finder-dialog').forEach(dialog=>dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}));
  if(navigator.modelContext?.registerTool){
    navigator.modelContext.registerTool({name:'preview_tripick_recommendation',description:'Compare real catalog products by country in the Tripick preview. Prices are reference conversions, not live prices or inventory.',inputSchema:{type:'object',properties:{country:{type:'string',enum:['KR','JP','TW','FR']},mode:{type:'string',enum:['quick','personal']},category:{type:'string',enum:['share','light','local','all','craft','tea','design','food']}},required:['mode']},execute:async({country,mode:next,category})=>{
      if(!['quick','personal'].includes(next))throw new Error('Invalid mode');
      if(country&&!Object.hasOwn(countries,country))throw new Error('Invalid country');
      if(country){$('#country').value=country;changeCountry();}
      if(next==='quick'&&['share','light','local'].includes(category)){pick=category;document.querySelectorAll('[data-pick]').forEach(b=>{b.classList.toggle('active',b.dataset.pick===pick);b.setAttribute('aria-pressed',String(b.dataset.pick===pick));});}
      if(next==='personal'&&['all','craft','tea','design','food'].includes(category))$('#taste').value=category;
      setMode(next);refresh();$('#experience').scrollIntoView({behavior:'auto'});
      return {content:[{type:'text',text:JSON.stringify({referenceCatalog:true,count:results.length,products:results.slice(0,3).map(p=>({name:p.name,url:p.url}))})}]};
    }});
  }
  changeCountry();
})();
