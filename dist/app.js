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
  if(heroPhoto && !reducedMotion.matches && window.scrollY<950)heroPhoto.style.transform=`translateY(${Math.min(window.scrollY*.075,42)}px)`;
  if(journeyLine){const rect=journeyLine.getBoundingClientRect();journeyLine.style.setProperty('--progress',`${Math.min(100,Math.max(0,(window.innerHeight-rect.top)/(window.innerHeight*.58)*100))}%`);}
  scrollQueued=false;
}
window.addEventListener('scroll',()=>{if(!scrollQueued){scrollQueued=true;requestAnimationFrame(updateScroll);}},{passive:true});updateScroll();

