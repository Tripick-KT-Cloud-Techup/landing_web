(function(root){
  function recommend(products,{mode='personal',pick='share',taste='all',recipient='friend',budget=50000}={}){
    const limit=Number(budget);
    if(!Number.isFinite(limit)||limit<0)return [];
    return products.filter(p=>p.price<=limit && (mode==='quick'?p.picks.includes(pick):(taste==='all'||p.category===taste)))
      .map(p=>({product:p,score:(mode==='personal'&&p.recipients.includes(recipient)?25:0)+Math.min(p.price/Math.max(limit,1),1)*60+(p.availableAtCapture?5:0)}))
      .sort((a,b)=>b.score-a.score||a.product.id.localeCompare(b.product.id)).map(x=>x.product);
  }
  if(typeof module==='object'&&module.exports)module.exports={recommend};
  else root.TripickRecommendation={recommend};
})(typeof window==='object'?window:globalThis);
