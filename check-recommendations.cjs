const assert=require('node:assert/strict');
global.window={};require('./dist/catalog.js');
const products=window.TRIPICK_CATALOG.products;
const {recommend}=require('./dist/recommendation-engine.js');
const countries=['KR','JP','TW','FR'];
assert.equal(new Set(products.map(p=>p.id)).size,products.length);
let checked=0;
for(const country of countries){
 assert(products.filter(p=>p.country===country).length>=5,`${country}: diverse catalog`);
 assert(recommend(products,{country,mode:'quick',pick:'share',budget:50000}).length,`${country}: initial quick pick has candidates`);
 for(const recipient of ['friend','family','partner','colleague','me'])for(const taste of ['all','craft','tea','design','food'])for(const budget of [30000,50000,100000]){
  const result=recommend(products,{country,recipient,taste,budget});
  assert(result.every(p=>p.country===country&&p.price<=budget&&(taste==='all'||p.category===taste)),`${country}: country, category and budget boundaries`);
  if(taste==='all')assert(result.length,`${country}: affordable candidates`);
  checked++;
 }
 for(const pick of ['share','light','local']){
  const r=recommend(products,{country,mode:'quick',pick,budget:50000});assert(r.every(p=>p.country===country&&p.picks.includes(pick)&&p.price<=50000));
 }
}
const ids=c=>recommend(products,c).slice(0,3).map(p=>p.id);
assert.notDeepEqual(ids({recipient:'family',taste:'design'}),ids({recipient:'partner',taste:'design'}));
assert.notDeepEqual(ids({taste:'tea',budget:30000}),ids({taste:'tea',budget:100000}));
assert.deepEqual(ids({}),ids({country:'JP'}));
assert.deepEqual(recommend(products,{country:'XX'}),[]);
assert.deepEqual(recommend(products,{budget:1}),[]);
assert.deepEqual(recommend(products,{budget:'invalid'}),[]);
const fs=require('node:fs');for(const p of products){
 assert(countries.includes(p.country));assert(Number.isFinite(p.amount)&&p.amount>0);assert(Number.isFinite(p.price)&&p.price>0);
 assert.equal(p.price,Math.round(p.amount*p.comparisonRate),`${p.id}: accurate comparison conversion`);
 assert(['KRW','USD','TWD','EUR'].includes(p.currency));assert(fs.existsSync('dist/'+p.image));assert.equal(new URL(p.url).protocol,'https:');
}
console.log(`Passed: ${checked} country/recipient/taste/budget combinations, quick filters, ranking, invalid and empty states, ${products.length} local product images.`);
