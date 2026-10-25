/* One neutral brand system, restored before the first paint on both sites. */
(() => {
 const choices={white:{label:'White',color:'#ffffff',note:'Fresh white surfaces, crisp black type and Cartman green details.'},black:{label:'Dark',color:'#0b0c0e',note:'Black and graphite surfaces, clear white type and focused green accents.'}};
 const legacy={original:'white',editorial:'white',night:'black',emerald:'black',signature:'white'};
 const media=new Map();
 function pair(light,dark){media.set(light,{light,dark});media.set(dark,{light,dark});}
 pair('assets/cartman-logo.webp','assets/brand/wordmark-dark.webp');
 pair('assets/brand/wordmark-white.webp','assets/brand/wordmark-dark.webp');
 pair('assets/cartman-app-icon.webp','assets/brand/icon-dark.webp');
 pair('assets/brand/icon-white.webp','assets/brand/icon-dark.webp');
 for(const id of ['chicken','spaghetti','chicken-combo','iced-tea','rice','eggs','coffee','noodles','adobo','sinigang','lumpia','rice-extra','latte','americano','pandesal','turon','veg','banana','tomato','milk'])pair('assets/menu/'+id+'.webp','assets/dark/menu/'+id+'.webp');
 for(const id of ['service-food','grocery-branded','service-parcel','errands-branded','lift-service-v2','multi-errands-v2'])pair('assets/'+id+'.webp','assets/dark/services/'+id+'.webp');
 for(const [alias,id] of [['service-grocery','grocery-branded'],['service-errands','errands-branded']])media.set('assets/'+alias+'.webp',{light:'assets/'+alias+'.webp',dark:'assets/dark/services/'+id+'.webp'});
 for(const id of ['rice','eggs','coffee'])media.set('assets/product-'+id+'-v1.webp',{light:'assets/product-'+id+'-v1.webp',dark:'assets/dark/menu/'+id+'.webp'});
 const originals=new WeakMap();
 function refresh(scope=document){
  const images=scope.matches?.('img')?[scope]:scope.querySelectorAll?.('img')||[];
  for(const img of images){
   const src=img.getAttribute('src');const entry=media.get(src);if(!entry)continue;
   let original=originals.get(img);
   if(!original||!Object.values(original).includes(src)){original=entry;originals.set(img,original);}
   let next=selected==='black'||img.closest('.footer')?original.dark:original.light;
   if(next==='assets/cartman-logo.webp')next='assets/brand/wordmark-white.webp';
   if(next==='assets/cartman-app-icon.webp')next='assets/brand/icon-white.webp';
   if(src!==next)img.setAttribute('src',next);
  }
 }
 let selected='black';
 try{const saved=JSON.parse(localStorage.getItem('cartman-appearance'));selected=Object.hasOwn(choices,saved)?saved:(Object.hasOwn(legacy,saved)?legacy[saved]:'black');}catch{/* Dark works without storage. */}
 function apply(value,persist=true){
  if(!Object.hasOwn(choices,value))return;
  const changed=selected!==value;selected=value;
  const root=document.documentElement;root.dataset.appearance=value;root.dataset.theme='balanced';root.classList.add('ui-variant');
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content',choices[value].color);
  document.querySelectorAll('[data-appearance-select]').forEach(s=>s.value=value);
  const note=document.querySelector('#appearance-note');if(note)note.textContent=choices[value].note;
  const status=document.querySelector('#theme-status');if(status)status.textContent=choices[value].label+' theme selected';
  refresh();
  document.querySelector('link[rel="icon"]')?.setAttribute('href','assets/brand/favicon-'+(value==='black'?'dark':'white')+'.png');
  if(persist){try{localStorage.setItem('cartman-appearance',JSON.stringify(value));}catch{/* Session-only selection. */}}
  if(changed&&!matchMedia('(prefers-reduced-motion: reduce)').matches){document.querySelectorAll('.hero-content,.page-intro,.order-hero').forEach(n=>n.animate([{opacity:.8},{opacity:1}],{duration:240,easing:'ease-out'}));}
 }
 window.CartmanAppearance={apply,current:()=>selected,choices,refresh};
 apply(selected,false);
 addEventListener('DOMContentLoaded',()=>apply(selected,false),{once:true});
 new MutationObserver(records=>{for(const record of records){if(record.type==='attributes')refresh(record.target);else for(const node of record.addedNodes)if(node.nodeType===1)refresh(node);}}).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['src']});
 addEventListener('storage',e=>{if(e.key==='cartman-appearance'){try{const saved=JSON.parse(e.newValue);apply(Object.hasOwn(choices,saved)?saved:(Object.hasOwn(legacy,saved)?legacy[saved]:'black'),false);}catch{/* Invalid saved values do not alter the current view. */}}});
})();
