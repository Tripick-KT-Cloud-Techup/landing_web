const assert=require('node:assert/strict');
global.window={};require('./dist/catalog.js');
const products=window.TRIPICK_CATALOG.products;
const {recommend}=require('./dist/recommendation-engine.js');
assert.equal(products.length,27);
assert.equal(new Set(products.map(p=>p.id)).size,27);
let checked=0;
for(const recipient of ['friend','family','partner','colleague','me'])for(const taste of ['all','craft','tea','design'])for(const budget of [30000,50000,100000]){
 const result=recommend(products,{recipient,taste,budget});
 assert(result.length>0,`${recipient}/${taste}/${budget} has candidates`);
 assert(result.every(p=>p.price<=budget&&(taste==='all'||p.category===taste)));
 const eligible=result.filter(p=>p.recipients.includes(recipient));
 if(eligible.length)assert(result.some(p=>p.recipients.includes(recipient)));
 checked++;
}
for(const pick of ['share','light','local']){
 const r=recommend(products,{mode:'quick',pick,budget:30000});assert(r.length);assert(r.every(p=>p.picks.includes(pick)&&p.price<=30000));
}
const ids=c=>recommend(products,c).slice(0,3).map(p=>p.id);
assert.notDeepEqual(ids({recipient:'family',taste:'design'}),ids({recipient:'partner',taste:'design'}));
assert.notDeepEqual(ids({taste:'tea',budget:30000}),ids({taste:'tea',budget:100000}));
assert.deepEqual(recommend(products,{budget:1}),[]);
assert.deepEqual(recommend(products,{budget:'invalid'}),[]);
const fs=require('node:fs');for(const p of products)assert(fs.existsSync('dist/'+p.image));
console.log(`Passed: ${checked} combinations, quick filters, recipient ranking, budget changes, empty states, 27 local images.`);
