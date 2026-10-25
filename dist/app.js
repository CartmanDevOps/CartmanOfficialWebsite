const paths={bag:'M6 7h12l2 14H4L6 7Zm3 0V5a3 3 0 0 1 6 0v2',food:'M4 3v7a2 2 0 0 0 4 0V3M6 3v18M16 3c-3 4-3 9 0 9h3M19 3v18',box:'m3 7 9-5 9 5v10l-9 5-9-5V7Zm0 0 9 5 9-5M12 12v10M8 4l9 5',bolt:'m13 2-9 12h7l-1 8L21 9h-8l1-7',pin:'M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0ZM15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0',shield:'m12 2 9 4v6c0 5-9 10-9 10S3 17 3 12V6l9-4Zm-4 10 3 3 5-6',clock:'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0ZM12 6v6l4 2',heart:'M20 4c-3-3-7-1-8 2-1-3-5-5-8-2-5 5 2 11 8 16 6-5 13-11 8-16',bike:'M8 17a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM24 17a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4 17l5-9 5 9H4M9 8h7l4 9M7 5h4M15 4h3l2 4',shop:'M3 10v11h18V10M2 3h20l-2 7H4L2 3ZM9 21v-7h6v7',check:'m5 12 4 4L19 6',arrow:'M4 12h16m-6-6 6 6-6 6',user:'M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4 22v-3a8 8 0 0 1 16 0v3'};
const icon=(name,cls='')=>`<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${paths[name]||paths.bag}"/></svg>`;
const mark=`<img class="app-brand-icon" src="assets/cartman-app-icon.webp" width="42" height="42" alt="" aria-hidden="true">`;
const brand=(original=false)=>original?`<a href="#/" class="original-brand" aria-label="Cartman PH home"><img src="assets/cartman-logo.webp" alt="Cartman PH — Everything. Delivered."></a>`:`<a href="#/" class="brand" aria-label="Cartman PH home">${mark}<span>CARTMAN<em>PH</em></span></a>`;
const services=[{name:'Food delivery',key:'food',copy:'Meals, snacks, and drinks from local favorites.',label:'Find your next bite',color:'food'},{name:'Groceries',key:'bag',copy:'Fresh produce, pantry staples, and household needs.',label:'Fill your basket',color:'grocery'},{name:'Send a parcel',key:'box',copy:'Documents, gifts, and packages, delivered door to door.',label:'Make a delivery',color:'parcel'},{name:'Pabili & errands',key:'bolt',copy:'Store runs and pickups, with your list and instructions.',label:'Get a helping hand',color:'errands'}];
const $=s=>document.querySelector(s);let slide=0,slideTimer,role='customer';
function bindBase(route,params) {
  if(route==='/')slideshow();
  const trackForm=$('#track-form');
  if(trackForm)trackForm.onsubmit=e=>{e.preventDefault();const reference=new FormData(trackForm).get('reference').trim();const next='/track?id='+encodeURIComponent(reference);if(location.hash==='#'+next)render();else location.hash=next;};
  const logout=$('#logout');
  if(logout)logout.onclick=()=>{localStorage.removeItem('cartman-session');location.hash='/login';toast('You’re logged out.');};
  for(const name of ['partner','support','waitlist','reset']) {
    const form=$('#'+name+'-form');
    if(!form)continue;
    form.onsubmit=e=>{
      e.preventDefault();
      if(name!=='reset'&&!save('cartman-'+name,Object.fromEntries(new FormData(form))))return;
      form.hidden=true;
      const result=$('#'+name+'-result');
      result.innerHTML=`<div class="result" role="status" tabindex="-1"><span class="success-check">✓</span><h3>${name==='reset'?'Recovery flow previewed.':'A little step forward.'}</h3><p>${name==='reset'?'In the live product, recovery instructions would be emailed if an account exists. No email has been sent.':'Your demo details are saved in this browser. They have not been sent to Cartman.'}</p><a class="textlink" href="#/">Back to your day ↗</a></div>`;
      result.querySelector('.result').focus({preventScroll:true});
      toast(name==='reset'?'Recovery preview complete.':'Your demo details have been saved.');
    };
  }
}
const safe=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const read=(key,fallback=null)=>{try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}};
const save=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value));return true}catch{toast('Browser storage is unavailable. This session may not be saved.')}};
function toast(message){$('#toast').textContent=message;$('#toast').classList.add('visible');setTimeout(()=>$('#toast').classList.remove('visible'),4000)}
const serviceCards=()=>serviceCardView();
const steps=()=>stepsView();
const faq=()=>faqView();
let pendingBooking=null;
function estimate(){const base={food:49,grocery:69,parcel:49,errands:89};return base[$('#service-select').value]+Number($('#distance').value)*10}
function forgot(){return intro('Let’s get you back in','Forgot your password?','It happens. Start here to explore the recovery flow.')+`<div class="status-card"><div class="notice">Password recovery is a UI demonstration. No email will be sent.</div><form id="reset-form">${field('Email address','email','email','you@example.com')}<button class="btn full">Preview recovery request ↗</button></form><div id="reset-result"></div><p class="form-foot"><a href="#/login">← Back to login</a></p></div>`}
function legal(type){const privacy=type==='privacy';return intro('The details matter',privacy?'Your privacy matters.':'A few ground rules.','Preview notices for the Cartman PH UI MVP.')+`<article class="prose"><h2>${privacy?'About your information':'About this prototype'}</h2><p>This website is an interactive design prototype. It does not provide real deliveries, payment processing, live support, or production account access.</p><h3>${privacy?'Browser storage':'Demo use'}</h3><p>${privacy?'Demo profiles, bookings, and form entries are saved only in local storage on this device. Passwords are not retained. Use fictional details and avoid sensitive information. Clearing browser storage removes this data.':'All booking amounts, service options, timing, and tracking statuses are illustrative. Confirming a demo booking does not form a delivery contract, charge you, or dispatch a rider.'}</p><h3>Before launch</h3><p>Cartman PH must provide final service coverage, pricing, account security, customer support, and complete legal policies before accepting live customers.</p>${privacy?'<button class="btn outline" id="clear-data">Clear my demo data</button>':'<a class="btn" href="#/services">Explore services ↗</a>'}</article>`}
function render(scroll=true){slideshow.dispose?.();clearInterval(slideTimer);const raw=location.hash.slice(1)||'/';const [route,query]=raw.split('?');const params=new URLSearchParams(query);header();footer();const pages={'/':()=>home(),'/services':()=>servicePage(),'/how-it-works':()=>howPage(),'/login':()=>auth(),'/signup':()=>auth(true),'/forgot-password':forgot,'/book':()=>book(params),'/review':review,'/track':()=>track(params),'/partners':()=>partners(params),'/account':account,'/help':help,'/waitlist':waitlist,'/privacy':()=>legal('privacy'),'/terms':()=>legal('terms'),'/about':()=>aboutPage()};$('#main').innerHTML=`<div class="${route==='/'?'':'wrap'}">${pages[route]?pages[route]():intro('A little detour','This page took a wrong turn.','Let’s get you back to your day.')+'<div style="text-align:center;margin:0 0 60px"><a class="btn" href="#/">Back to home ↗</a></div>'}</div>`;document.title=(route==='/'?'Your day, delivered':route==='/partners'?(params.get('type')==='merchant'?'For merchants':'For riders'):route.slice(1).replaceAll('-',' ').replace(/^./,c=>c.toUpperCase()))+' | Cartman PH';document.body.dataset.page=route.slice(1)||'home';bind(route,params);if(scroll){window.scrollTo({top:0,left:0,behavior:'instant'});$('#main').focus({preventScroll:true})}}
$('.skip').onclick=e=>{e.preventDefault();$('#main').focus();$('#main').scrollIntoView()};
window.addEventListener('hashchange',()=>render());
