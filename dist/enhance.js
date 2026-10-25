/* Presentation layer. Core local demo state and routing live in app.js. */
const media = {
  hero: 'assets/rider-hero-v2.webp',
  food: 'assets/service-food.webp',
  grocery: 'assets/grocery-branded.webp',
  parcel: 'assets/service-parcel.webp',
  errands: 'assets/errands-branded.webp',
  lift: 'assets/lift-service-v2.webp',
  multi: 'assets/multi-errands-v2.webp'
};
const serviceNames = {food:'Food & drinks',grocery:'Everyday essentials',parcel:'Parcels',errands:'Pabili & errands',lift:'Cartman LIFT',multi:'Multi-stop errands'};
const catalogServices=[...services,{name:'Cartman LIFT',key:'bike',color:'lift',copy:'Get around your neighborhood with Cartman LIFT motorcycle and tricycle rides.',alt:'A Cartman LIFT scooter and covered Philippine sidecar tricycle'},{name:'Multi-stop errands',key:'bolt',color:'multi',copy:'Combine shopping, pickups, and drop-offs in one multi-stop request.',alt:'Bakery bread, groceries, a parcel and documents gathered for multiple errands'}];
const money = value => new Intl.NumberFormat('en-PH',{style:'currency',currency:'PHP',maximumFractionDigits:0}).format(value);
const demoNotice = text => `<div class="notice">${icon('shield')}<span>${text}</span></div>`;

function downloadBadges(){
  return `<div class="download-badges" aria-label="Cartman mobile apps"><a href="#/waitlist?platform=ios" class="download-badge" aria-label="Cartman for iPhone, coming soon. Get launch updates"><svg viewBox="0 0 24 28" fill="currentColor" aria-hidden="true"><path d="M17 5c1-1 2-3 1.7-5-1.6.1-3.5 1.1-4.5 2.3-.9 1-1.7 2.8-1.4 4.4 1.7.2 3.2-.7 4.2-1.7ZM21.6 20c-.5 1.2-.8 1.7-1.5 2.8-1.1 1.6-2.6 3.7-4.5 3.7-1.7 0-2.1-1.1-4.4-1.1-2.2 0-2.7 1.1-4.4 1.1-1.9.1-3.4-1.9-4.5-3.6C-.7 18.2-.9 12.1 1 9.2c1.4-2.1 3.6-3.3 5.7-3.3 1.7 0 2.8 1.1 4.4 1.1 1.5 0 2.5-1.1 4.4-1.1 1.8 0 3.7 1 5 2.6-4.4 2.4-3.7 8.7 1.1 11.5Z"/></svg><span><small>Coming soon on the</small><strong>App Store</strong></span></a><a href="#/waitlist?platform=android" class="download-badge" aria-label="Cartman for Android, coming soon. Get launch updates"><svg viewBox="0 0 24 26" fill="none" aria-hidden="true"><path d="m2 2 13 11L2 24V2Z" fill="#b9d9c0"/><path d="m2 2 17 9-4 2L2 2Z" fill="#e1c78b"/><path d="m2 24 17-9-4-2L2 24Z" fill="#8bbaa0"/><path d="m15 13 4-2 4 2-4 2-4-2Z" fill="#fff6dc"/></svg><span><small>Coming soon on</small><strong>Google Play</strong></span></a></div>`;
}

function themeControl(){
 return `<div class="theme-switcher"><button type="button" class="theme-trigger" aria-label="Change theme" aria-expanded="false" aria-controls="theme-panel"><span class="theme-swatch" aria-hidden="true"><i></i><i></i></span><span class="theme-trigger-label">Theme</span></button><div class="theme-panel" id="theme-panel" hidden><strong>Cartman, in your light.</strong><p>Two ways to see Cartman. The same good things.</p><label class="appearance-label" for="appearance-select">Appearance</label><select id="appearance-select" data-appearance-select aria-describedby="appearance-note">${Object.entries(window.CartmanAppearance.choices).map(([value,data])=>`<option value="${value}" ${window.CartmanAppearance.current()===value?'selected':''}>${data.label}${value==='white'?' · default':''}</option>`).join('')}</select><p id="appearance-note">${window.CartmanAppearance.choices[window.CartmanAppearance.current()].note}</p><div class="theme-preview" aria-hidden="true"><i></i><i></i><i></i><span>BLACK · WHITE · CARTMAN GREEN</span></div><span class="sr-only" id="theme-status" role="status"></span></div></div>`;
}

function header() {
  const route = (location.hash.slice(1)||'/').split('?')[0];
  const currentHref=route==='/partners'?'/partners?type='+(new URLSearchParams(location.hash.split('?')[1]||'').get('type')==='merchant'?'merchant':'rider'):route;
  const nav = [['/services','Services'],['/how-it-works','How it works'],['/partners?type=merchant','For merchants'],['/partners?type=rider','For riders']];
  $('#header').innerHTML = `<div class="wrap nav">${brand(true)}
    <nav class="navlinks" id="main-navigation" aria-label="Main navigation">
      ${nav.map(([href,label])=>`<a href="#${href}" ${currentHref===href?'aria-current="page"':''}>${label}</a>`).join('')}
      <a class="mobile-account" href="order.html#/orders" target="_blank" rel="noopener">My online orders</a>
      <a class="mobile-account" href="order.html#/account" target="_blank" rel="noopener">Your profile</a>
      <a class="mobile-account" href="#/waitlist">Get the app</a>
      <a class="mobile-account" href="#/about">About Cartman</a>
      <a class="mobile-account" href="#/help">Help center</a>
    </nav>
    <div class="nav-actions"><a class="textlink account-link" href="#/waitlist">Get the app</a><a class="btn nav-cta" href="order.html" target="_blank" rel="noopener" aria-label="Order online, opens in a new tab"><span class="cta-desktop" aria-hidden="true">Order online</span><span class="cta-mobile" aria-hidden="true">Order</span>${icon('arrow')}</a>${themeControl()}
    <button class="menu-toggle" aria-label="Open navigation" aria-controls="main-navigation" aria-expanded="false"><span></span><span></span></button></div></div>`;
  header.interactions?.abort();
  header.interactions=new AbortController();
  const toggle = $('.menu-toggle');
  const close = ()=>{$('.navlinks').classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Open navigation');};
  toggle.onclick=()=>{closeTheme();const open=$('.navlinks').classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Close navigation':'Open navigation');};
  toggle.onkeydown=e=>{if(e.key==='Escape')close()};
  $('.navlinks').onkeydown=e=>{if(e.key==='Escape'){close();toggle.focus()}};
  const themeTrigger=$('.theme-trigger');
  const panel=$('#theme-panel');
  const closeTheme=()=>{panel.hidden=true;themeTrigger.setAttribute('aria-expanded','false')};
  themeTrigger.onclick=()=>{const open=panel.hidden;panel.hidden=!open;themeTrigger.setAttribute('aria-expanded',String(open));if(open)close()};
  document.addEventListener('pointerdown',e=>{if(!$('#header').contains(e.target)){close();closeTheme()}},{signal:header.interactions.signal});
  $('.navlinks').addEventListener('click',e=>{if(e.target.closest('a'))close()});
  $('.navlinks').addEventListener('focusout',e=>{if(!$('#header').contains(e.relatedTarget))close()});
  $('#appearance-select').onchange=e=>window.CartmanAppearance.apply(e.target.value);
  $('.theme-switcher').onkeydown=e=>{if(e.key==='Escape'){closeTheme();themeTrigger.focus()}};
  $('.theme-switcher').onfocusout=e=>{if(!e.currentTarget.contains(e.relatedTarget))closeTheme()};
}

function footer() {
  $('#footer').innerHTML=`<div class="footer"><div class="wrap"><div class="footer-grid">
    <div><a class="footer-wordmark" href="#/">${mark}CARTMAN<span>PH</span>↗</a><p>Food, deliveries, rides, and errands.<br>More of your day, connected.</p><span class="footer-origin">PHILIPPINES · EVERYTHING. DELIVERED.</span></div>
    <div><h4>Make it happen</h4><div class="footer-links"><a href="#/services">Explore services</a><a href="order.html" target="_blank" rel="noopener">Order, ride, or run errands</a><a href="order.html#/orders" target="_blank" rel="noopener">My online orders</a><a href="#/how-it-works">How it works</a></div></div>
    <div><h4>Go further with us</h4><div class="footer-links"><a href="#/partners?type=merchant">For merchants</a><a href="#/partners?type=rider">For riders</a><a href="#/about">About Cartman</a><a href="#/waitlist">The Cartman app</a></div></div>
    <div><h4>A helping hand</h4><div class="footer-links"><a href="#/help">Help center</a><a href="#/help?contact=1">Contact support</a><a href="order.html#/account" target="_blank" rel="noopener">Your profile</a></div></div>
    </div><div class="footer-bottom"><span>© ${new Date().getFullYear()} Cartman PH</span><span><a href="#/privacy">Privacy notice</a><a href="#/terms">Terms of use</a></span><span>Local preview · No live services</span></div></div></div>`;
}

function serviceCardView() {
  return `<div class="service-grid photo-services">${catalogServices.map((s,i)=>`<a class="service-card" href="order.html?service=${s.color}" target="_blank" rel="noopener">
    <div class="service-photo"><img src="${media[s.color]}" alt="${s.alt||['A freshly prepared chicken rice bowl and a refreshing drink','Fresh produce and milk in a black Cartman PH grocery bag','Carefully packed kraft parcels','Everyday shopping in a black Cartman PH tote'][i]}" width="600" height="400" loading="lazy" decoding="async"><span class="service-number">0${i+1}</span></div>
    <div class="service-card-body"><div class="service-card-title"><h3>${serviceNames[s.color]}</h3><span class="round-arrow">${icon('arrow')}</span></div><p>${s.copy}</p></div></a>`).join('')}</div>`;
}

function campaignScreen(page=0){
  const body=page===0?`
    <div class="screen-head"><small>GOOD DAY, NEIGHBOR.</small><strong class="screen-title">What sounds<br>good today?</strong><span>${icon('pin')} Your neighborhood</span></div>
    <div class="screen-services screen-photo-services">${[['service-food.webp','Food'],['service-grocery.webp','Groceries'],['lift-service-v2.webp','LIFT'],['multi-errands-v2.webp','Pabili']].map(([src,t])=>`<span><img src="assets/${src}" alt="" width="96" height="72">${t}</span>`).join('')}</div>
    <div class="screen-food-feature screen-section screen-craving"><img src="assets/service-food.webp" alt=""><span>FRESHLY MADE. LOCALLY LOVED.<strong>Big cravings.<br>Local favorites.</strong><small>Find your next favorite ${icon('arrow')}</small></span></div>
    <div class="screen-section screen-meals"><div class="screen-section-heading"><strong>A little taste of home</strong><span>Explore ↗</span></div><div class="screen-meal-grid">${[['filipino-comfort-food.webp','Chicken & rice','Local comfort food','₱149','20–30 min'],['kape-merienda-demo.webp','Kape & merienda','Your afternoon pick','₱89','15–25 min']].map(([src,t,n,p,time])=>`<div class="screen-meal"><div class="screen-meal-photo"><img src="assets/${src}" alt="" width="180" height="120"><span>${time}</span></div><strong>${t}</strong><small>${n}</small><div><b>${p}</b><i>+</i></div></div>`).join('')}</div><small class="screen-menu-note">Sample menu & prices · Explore the demo</small></div>`:page===1?`
    <div class="screen-head"><small>EVERY LITTLE STEP, IN VIEW.</small><strong class="screen-title">Good things.<br>On the way.</strong><span><i class="screen-status-dot"></i> Delivery preview · CM-DEMO</span></div>
    <div class="screen-map screen-section"><svg viewBox="0 0 240 150" fill="none" aria-hidden="true"><path d="M0 35h240M0 75h240M0 115h240M35 0v150M90 0v150M150 0v150M205 0v150" stroke="#fffdf7" stroke-width="12"/><rect x="103" y="9" width="34" height="48" rx="5" fill="#c7d9b7"/><rect x="6" y="86" width="17" height="18" rx="3" fill="#c7d9b7"/><path class="screen-route-line" d="M35 115h55V75h60V35h55" pathLength="1" stroke="#367454" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="35" cy="115" r="8" fill="#fffdf7" stroke="#367454" stroke-width="3"/><circle cx="205" cy="35" r="13" fill="#244f3b"/><path d="m199 35 6-5 6 5v7h-12v-7Z" fill="#fffdf7"/><circle class="screen-route-rider" cx="35" cy="115" r="5" fill="#c8e6a5" stroke="#244f3b" stroke-width="2"/><circle cx="150" cy="75" r="13" fill="#fffdf7" stroke="#367454" stroke-width="2"/><path d="m145 75 4 4 7-8" stroke="#367454" stroke-width="2"/></svg><span class="screen-map-label">Illustrative route · no live GPS</span></div>
    <div class="screen-section screen-tracking"><div class="screen-section-heading"><strong>Your delivery journey</strong><span>In view</span></div><div class="screen-journey-step done"><i>✓</i><span><strong>Order confirmed</strong><small>A little less on your list.</small></span></div><div class="screen-journey-step done"><i>✓</i><span><strong>Picked up with care</strong><small>Fresh from the kitchen.</small></span></div><div class="screen-journey-step current"><i>${icon('bike')}</i><span><strong>On the way to you</strong><small>Your doorstep is next.</small></span></div><div class="screen-progress"><i></i></div></div>
    <div class="screen-care screen-section screen-delivery-meal"><img src="assets/filipino-comfort-food.webp" alt="" width="96" height="96"><span>Good food. Nearly there.<small>Chicken & rice · 1 meal</small><b>Prepared with care ${icon('shield')}</b></span></div>`:`
    <div class="screen-head"><small>A HELPING HAND, A TAP AWAY.</small><strong class="screen-title">Pabili?<br>We’re on it.</strong><span>${icon('pin')} From your neighborhood store</span></div>
    <div class="screen-shop-feature screen-section"><img src="assets/tindahan-banner-v2.webp" alt="" width="900" height="300"><span>YOUR EVERYDAY TINDAHAN<strong>Aling Neneng’s</strong></span></div>
    <div class="screen-section screen-shopping"><div class="screen-section-heading"><strong>Your little shopping list</strong><span>3 items</span></div>${[['product-rice-v1.webp','Bigas','1 kg','₱60'],['product-eggs-v1.webp','Fresh eggs','6 pieces','₱65'],['product-coffee-v1.webp','Coffee sachets','5 pack','₱45']].map(([src,t,n,p])=>`<div class="screen-shopping-row"><img class="screen-product-photo" src="assets/${src}" alt="" width="80" height="80"><span><strong>${t}</strong><small>${n}</small></span><b>${p}</b></div>`).join('')}<div class="screen-budget"><span>Shopping budget<strong>₱300</strong></span><small>Sample values · service fee extra</small></div></div>
    <div class="screen-request screen-section"><span>Review pabili request</span>${icon('arrow')}</div><span class="screen-preview-note">A little help. A little more day.</span>`;
  return `<div class="phone-appbar">${mark}<strong>CARTMAN<span>PH</span></strong><span class="screen-demo">DEMO</span></div><div class="phone-view" data-phone-page="${page}"><div class="phone-page-kicker">${['DISCOVER','DELIVERY TRACKING','PABILI & ERRANDS'][page]}<span>0${page+1} / 03</span></div>${body}</div><div class="screen-navigation">${[['shop','Explore'],['box','Orders'],['bolt','Pabili'],['user','You']].map(([i,t],n)=>`<span class="${n===page?'selected':''}">${icon(i)}<small>${t}</small></span>`).join('')}</div>`;
}

function appPhone(extra='') {
  if(extra==='hero-device')return `<div class="app-phone hero-device" role="img" aria-label="Cartman app preview: Discover your favorites"><div class="phone-top"><span>9:41</span><div class="phone-island"></div><span>▮▮ ▰</span></div><div class="phone-content showcase-content">${campaignScreen(0)}</div></div>`;
  return `<div class="app-phone ${extra}" role="img" aria-label="Cartman app concept for food, essentials, parcels, errands and LIFT rides">
    <div class="phone-top"><span>9:41</span><div class="phone-island"></div><span>▮▮ ▰</span></div><div class="phone-content">
    <div class="phone-brand">${mark}<span>CARTMAN<span>PH</span></span></div><div class="phone-address">${icon('pin')} Deliver to <strong>Your neighborhood⌄</strong></div>
    <p class="phone-greeting">A little help for your day.</p><h3>What sounds<br>good today?</h3>
    <div class="phone-search">⌕ <span>Find your everyday favorites</span></div>
    <div class="phone-categories">${services.map(s=>`<div>${icon(s.key)}<span>${s.color==='food'?'Food':s.color==='grocery'?'Groceries':s.color==='parcel'?'Parcels':'Errands'}</span></div>`).join('')}</div>
    <div class="phone-promo"><span>ONE LITTLE APP.</span><strong>A whole lot<br>of possibilities.</strong><span class="phone-promo-arrow">↗</span></div>
    <div class="phone-favorite"><strong>Something for your day</strong><span>Explore ↗</span></div><img class="phone-food" src="${media.food}" alt="Chicken rice bowl" width="240" height="120" loading="lazy">
    <div class="phone-bottom">${icon('shop')}${icon('box')}${icon('heart')}${icon('user')}</div></div></div>`;
}

function heroInspiration(){return `<aside class="hero-inspiration" aria-label="A little inspiration"><span class="eyebrow">A LITTLE INSPIRATION</span><h2>What’s on your list?</h2>${[['chicken','A familiar favorite','Chicken & rice','order.html#/store/jollibee'],['latte','A well-earned break','Coffee & merienda','order.html#/store/kape'],['rice','A few things to pick up','Plan multiple errands','order.html#/service/multi']].map(([id,kicker,title,href])=>`<a href="${href}" target="_blank" rel="noopener"><img src="assets/menu/${id}.webp" width="80" height="80" alt="" loading="lazy" decoding="async"><span><small>${kicker}</small><strong>${title}</strong></span>${icon('arrow')}</a>`).join('')}<p>Explore sample menus and services in the web demo.</p></aside>`}
function bookingChecklist(){return `<div class="booking-checklist"><span class="eyebrow">BEFORE YOU BOOK</span><h3>A few details. A smoother request.</h3><ul>${['Your pickup and destination addresses','Items, parcel details, or passenger count','Helpful landmarks and delivery notes'].map(t=>`<li>${icon('check')}<span>${t}</span></li>`).join('')}</ul><a class="textlink" href="#/how-it-works">See how it works ${icon('arrow')}</a></div>`}
function home() {
  return `<section class="campaign-hero" data-scene="0" aria-label="Cartman campaign" aria-roledescription="carousel">
    <picture class="hero-picture"><source id="hero-mobile" media="(max-width:767px)" srcset="assets/rider-mobile-v2.webp" width="900" height="1350"><img class="hero-backdrop" id="hero-image" src="${media.hero}" alt="A Cartman PH rider in a black branded uniform on his scooter" width="1672" height="941" fetchpriority="high"></picture>
    <div class="hero-wash"></div><div class="wrap hero-layout"><div class="hero-content">
      <div class="eyebrow">Everything. <span>Delivered.</span></div><h1>Your day.<br><span>Delivered.</span></h1>
      <p class="hero-description" id="campaign-description">Meals, essentials, parcels, and errands.<br>Motorcycle and tricycle rides with LIFT.</p>
      ${downloadBadges()}<div class="hero-web-entry"><span>Prefer a bigger screen?</span><a class="textlink" href="order.html" target="_blank" rel="noopener">Order online ${icon('arrow')}</a><small>Opens the ordering demo in a new tab</small></div>
      <div class="hero-style-detail">${icon('pin')}<span>Made for your neighborhood</span><i aria-hidden="true"></i></div>${heroInspiration()}
    </div><div class="hero-visual"><div class="hero-phone">${appPhone('hero-device')}</div></div></div>
    <div class="wrap campaign-bottom"><span id="campaign-label">01 / MORE LIFE. FEWER ERRANDS.</span><div class="campaign-controls" role="group" aria-label="Slideshow navigation"><div class="dots">${[0,1,2].map(i=>`<button data-slide="${i}" class="${i===0?'active':''}" aria-label="Show campaign ${i+1}" aria-pressed="${i===0}"></button>`).join('')}</div><button class="campaign-next" data-direction="1" aria-label="Next campaign">${icon('arrow')}</button></div></div>
  </section>
  <section class="section service-section"><div class="wrap"><div class="section-head"><div><div class="eyebrow">Your everyday, all in one place</div><h2>Deliveries. Rides. <span>Errands.</span></h2></div><a class="textlink" href="#/services">Explore all services ${icon('arrow')}</a></div>${serviceCardView()}</div></section>
  <section class="section web-order-section"><div class="wrap web-order-panel"><div><div class="eyebrow">YOUR CARTMAN. YOUR WAY.</div><h2>No app? No problem.<br><span>Your neighborhood is online.</span></h2><p>Order meals and essentials, send a parcel, plan errands, or try a Cartman LIFT ride in the web demo.</p><a class="btn" href="order.html" target="_blank" rel="noopener">Open the ordering app ${icon('arrow')}</a><small>New tab · Interactive demo · No real orders or payments</small></div><div class="web-order-preview"><div class="browser-chrome"><i></i><i></i><i></i><span>cartman · order online</span></div><img src="assets/filipino-comfort-food.webp" alt="Filipino comfort food for your next favorite meal" width="800" height="520" loading="lazy"><div class="web-preview-caption"><strong>A little closer to your favorites.</strong><span>Food · Essentials · Parcels · Errands · LIFT</span></div></div></div></section><section class="together-band"><div class="wrap together-grid"><h2>Good things<br><span>move together.</span></h2><div class="together-item">${icon('shop')}<div><h3>Grow with Cartman PH</h3><p>Bring your local business<br>closer to more doorsteps.</p><a href="#/partners?type=merchant" class="btn white">Become a merchant ${icon('arrow')}</a></div></div><div class="together-item">${icon('bike')}<div><h3>Deliver. Ride. Connect.</h3><p>Explore delivery, errand, and<br>LIFT partnership opportunities.</p><a href="#/partners?type=rider" class="btn white">Ride with Cartman ${icon('arrow')}</a></div></div></div></section>
  <section class="section steps-section"><div class="wrap"><div class="section-head"><div><div class="eyebrow">Simple from the start</div><h2>From your first tap <span>to your next stop.</span></h2></div><p>One order, ride, or errand.<br>Three simple steps.</p></div>${stepsView()}</div></section>
  <section class="section app-reminder-section" aria-labelledby="app-launch-heading"><div class="wrap"><div class="app-reminder"><div class="app-launch-icon" aria-hidden="true">${mark}</div><div class="app-launch-copy"><div class="app-launch-meta"><span>THE CARTMAN APP</span><span class="app-launch-status">Coming soon</span></div><h2 id="app-launch-heading">Everything you need. Right in your pocket.</h2><p>Food, essentials, parcels, errands, and LIFT. Coming to iPhone and Android.</p></div><a class="btn" href="#/waitlist">Get launch updates ${icon('arrow')}</a></div></div></section>
  <section class="section faq-section"><div class="wrap faq-layout"><div><div class="eyebrow">Good to know</div><h2>A few questions.<br>Helpful answers.</h2><p>Need a little more help?<br>We’re here for you.</p><a class="textlink" href="#/help">Visit the help center ${icon('arrow')}</a>${bookingChecklist()}</div>${faqView(false)}</div></section>`;
}

function stepsView() {
  return `<div class="steps">${[['pin','01','Tell us what you need.','Choose food, essentials, parcels, errands, or a LIFT ride.'],['box','02','Add your details.','Add addresses, items, passengers, or stops. Review the sample estimate.'],['heart','03','Get back to your day.','Confirm a demo request and explore its simulated progress.']].map(([i,n,t,p])=>`<article class="step"><div class="step-top"><div class="step-icon">${icon(i)}</div><span>${n}</span></div><h3>${t}</h3><p>${p}</p></article>`).join('')}</div>`;
}

function faqView(heading=true) {
  return `<div class="faq">${heading?'<h2>Good questions. Helpful answers.</h2>':''}${[
    ['What can I book with Cartman?','Explore food, groceries, parcels, pabili, multi-stop errands, and Cartman LIFT motorcycle or tricycle rides. Try each service in the separate online demo.'],
    ['Where will Cartman be available?','Launch locations and service coverage are still being finalized. The ordering app uses a demo area; entering an address does not confirm availability.'],
    ['How are service fees and LIFT fares calculated?','Review a sample delivery fee, errand fee, or LIFT fare before confirming in the demo. Shopping budgets are separate from service fees. Actual rates will be confirmed at launch.'],
    ['Can I follow my order, ride, or errands?','After saving a demo request, open My orders to simulate delivery, LIFT, or errand progress. Multi-stop requests show each stop. Live GPS and rider dispatch are not connected.'],
    ['How can I become a partner?','Explore the merchant or rider pages, learn how the partnership works, and save a demo expression of interest. Applications are not sent to a team in this preview.']
  ].map(([q,a])=>`<details><summary>${q}<span class="faq-toggle" aria-hidden="true"></span></summary><p>${a}</p></details>`).join('')}</div>`;
}

function bindFaqMotion(){
 document.querySelectorAll('.faq details').forEach(details=>{
  const summary=details.querySelector('summary');let animation=null,expanded=details.open;
  summary.addEventListener('click',event=>{
   if(event.defaultPrevented||matchMedia('(prefers-reduced-motion: reduce)').matches||!details.animate)return;
   event.preventDefault();
   const from=details.getBoundingClientRect().height;
   expanded=animation?!expanded:!details.open;
   if(animation){animation.onfinish=null;animation.cancel();}
   details.open=true;
   const border=parseFloat(getComputedStyle(details).borderTopWidth)+parseFloat(getComputedStyle(details).borderBottomWidth);
   const to=expanded?details.getBoundingClientRect().height:summary.getBoundingClientRect().height+border;
   details.dataset.faqExpanded=String(expanded);
   animation=details.animate([{height:from+'px'},{height:to+'px'}],{duration:280,easing:'cubic-bezier(.2,.7,.25,1)'});
   animation.onfinish=()=>{details.open=expanded;delete details.dataset.faqExpanded;animation=null;};
  });
 });
}

function intro(eye,title,copy) {
  const route=(location.hash.slice(1)||'/').split('?')[0];
  const scenes={
    '/services':['multi-errands-v2.webp','Bread, groceries and a parcel ready for neighborhood errands','A few things to do. One familiar place.','food','Food & essentials','bike','LIFT & errands'],
    '/how-it-works':['food-moment.webp','Friends enjoying Filipino takeout food together','A little less to do. More time together.','pin','Add your details','check','Review your request'],
    '/about':['delivery-hero-v2.webp','A Cartman PH partner and a customer sharing a friendly delivery moment','Built around the people in your neighborhood.','shop','Local businesses','heart','Everyday connections'],
    '/help':['service-parcel.webp','Thoughtfully packed parcels ready for delivery','Answers for orders, rides, and errands.','box','Booking questions','shield','Demo account help'],
    '/waitlist':['service-food.webp','Freshly prepared food and a cold drink','Your everyday, in one app.','bike','Cartman LIFT','bolt','Pabili & errands']
  };
  const s=scenes[route];
  const partner=route==='/partners';
  const content=`<div class="intro-copy"><div class="eyebrow">${eye}</div><h1>${title}</h1>${copy?`<p>${copy}</p>`:''}${s?`<div class="intro-details"><span>${icon(s[3])}${s[4]}</span><span>${icon(s[5])}${s[6]}</span></div>`:''}${partner?`<div class="intro-details"><span>${icon('shop')}Local businesses</span><span>${icon('bike')}Delivery partners</span></div>`:''}</div>`;
  return `<div class="page-intro ${s?'page-intro-visual':partner?'page-intro-community':''}">${content}${s?`<figure class="intro-scene"><img src="assets/${s[0]}" alt="${s[1]}" width="900" height="600" decoding="async"><figcaption>${mark}<span>${s[2]}</span></figcaption></figure>`:partner?`<div class="community-symbol" aria-hidden="true">${icon('shop')}${icon('heart')}${icon('bike')}</div>`:''}</div>`;
}

function nextStepPanel(title,copy,label='Explore the ordering demo',href='order.html'){
  return `<section class="page-next"><div><span class="eyebrow">MAKE A LITTLE MORE ROOM FOR YOUR DAY</span><h2>${title}</h2><p>${copy}</p></div><a class="btn" href="${href}" ${href.startsWith('order.html')?'target="_blank" rel="noopener"':''}>${label} ${icon('arrow')}</a></section>`;
}

function aboutPage(){
  return intro('Built around your everyday','Your everyday. Better connected.','Food and essentials to your door. Parcels across town. LIFT rides and everyday errands, together with Cartman PH.')+`
  <section class="story-section"><div class="story-heading"><span class="eyebrow">THE CARTMAN IDEA</span><h2>More than a trip.<br><span>A little more possibility.</span></h2></div><div class="story-description"><p>Life happens locally. At the corner tindahan, your favorite kitchen, and the places you visit every day. Cartman PH is being designed to connect those everyday needs in one place.</p><p>From meals and groceries to parcels, pabili, multi-stop errands, and Cartman LIFT rides, our goal is to make everyday trips and tasks easier to manage.</p></div></section>
  <section class="page-values" aria-label="What Cartman is built around">${[['shop','01','Rooted in local life','A place for neighborhood kitchens, sari-sari stores, and the people who keep your community moving.'],['bag','02','Made for a real day','Food, essentials, parcels, rides, and multiple errands—because your day rarely needs just one thing.'],['heart','03','People at the center','Clear details and thoughtful journeys for customers, merchants, and delivery partners.']].map(([i,n,t,p])=>`<article class="page-value"><div>${icon(i)}<span>${n}</span></div><h3>${t}</h3><p>${p}</p></article>`).join('')}</section>
  <section class="neighborhood-stories"><div class="section-head"><div><span class="eyebrow">YOUR NEIGHBORHOOD. CONNECTED.</span><h2>Good things move together.</h2></div></div><div class="story-grid">${[['merchant-branded.webp','A local shop owner packs a parcel beside a Cartman delivery bag','For local businesses','Your next customer could be closer than you think.','Explore merchant partnerships','#/partners?type=merchant'],['rider-hero-v2.webp','A Cartman PH delivery partner beside his scooter','For delivery partners','Bring your local know-how to a new journey.','Explore rider opportunities','#/partners?type=rider'],['lift-service-v2.webp','A scooter and Philippine sidecar tricycle ready for local rides','For your everyday','A helping hand for the trips on your list.','Explore all six services','#/services']].map(([src,alt,t,p,label,href])=>`<article class="story-card"><img src="assets/${src}" alt="${alt}" width="600" height="400" loading="lazy"><div><span class="eyebrow">${t}</span><h3>${p}</h3><a class="textlink" href="${href}">${label} ${icon('arrow')}</a></div></article>`).join('')}</div></section>
  ${nextStepPanel('Explore everything Cartman offers.','Explore the services and try a sample request. The demo opens in a separate tab.')}`;
}

function howPage(){
  return intro('Simple from the start','Choose. Review. Get moving.','See how to order food and essentials, send parcels, plan errands, or request a LIFT ride.')+`
  <section class="journey-guide" aria-label="How to use Cartman">${[
    ['01','Choose your service.','Food, groceries, a parcel, a ride, or several errands. Start with the service that fits your day.','service-food.webp','A fresh chicken meal and drink','Explore services','#/services'],
    ['02','Make the details yours.','Add your pickup and destination. For multi-stop errands, arrange your tasks in order and include a final drop-off.','multi-errands-v2.webp','Bread, groceries, a parcel and documents','Try multi-stop errands','order.html?service=multi'],
    ['03','Review. Then get on with your day.','Check your request and illustrative estimate. In this demo, confirmation saves a sample request; no rider is dispatched.','doorstep-branded.webp','A friendly Cartman delivery at a neighborhood doorstep','Try an online order','order.html']
  ].map(([n,t,p,src,alt,label,href])=>`<article class="journey-row"><div class="journey-image"><img src="assets/${src}" alt="${alt}" width="900" height="600" loading="lazy"><span>${n}</span></div><div class="journey-copy"><span class="eyebrow">STEP ${n}</span><h2>${t}</h2><p>${p}</p><a class="textlink" href="${href}" ${href.startsWith('order.html')?'target="_blank" rel="noopener"':''}>${label} ${icon('arrow')}</a></div></article>`).join('')}</section>
  <section class="request-prep"><div class="section-head"><div><span class="eyebrow">A FEW DETAILS GO A LONG WAY</span><h2>Before you make a request.</h2></div></div><div class="prep-grid">${[['box','Sending a parcel?',['Have pickup and recipient details ready.','Include clear handling notes.','Describe what you’re sending.']],['bag','Planning errands?',['List the items or tasks for each stop.','Add a shopping budget where needed.','Put your stops in the order you prefer.']],['bike','Taking Cartman LIFT?',['Choose motorcycle or tricycle.','Add pickup, destination, and passengers.','Review the sample fare before confirming.']]].map(([i,t,items])=>`<article>${icon(i)}<h3>${t}</h3><ul>${items.map(t=>`<li>${t}</li>`).join('')}</ul></article>`).join('')}</div></section>
  <section class="guide-faq"><div><span class="eyebrow">GOOD TO KNOW</span><h2>A little clarity<br>before you go.</h2><p>Coverage and final service details will be confirmed before launch.</p></div>${faqView(false)}</section>
  ${nextStepPanel('Give your next request a try.','Explore sample stores, plan an errand, or preview a local ride. No real orders or payments.')}`;
}

function field(label,name,type='text',placeholder='',required=true) {
  const completion={name:'name',email:'email',phone:'tel',recipient:'name'};
  return `<label class="field">${label}${required?'<span class="required-dot" aria-hidden="true">*</span>':'<span class="optional-label">Optional</span>'}<input type="${type}" name="${name}" placeholder="${placeholder}" ${required?'required':''} autocomplete="${completion[name]||'off'}" ${type==='password'?'minlength="8"':''} ${type==='tel'?'inputmode="tel" pattern="(09[0-9]{9}|[+]639[0-9]{9})" title="Use 09 followed by 9 digits, or +639 followed by 9 digits"':''} maxlength="${type==='password'?'128':'180'}"></label>`;
}

function auth(signup=false) {
  return `<section class="auth-layout"><div class="auth-story"><img src="assets/doorstep-branded.webp" alt="A friendly grocery delivery at a neighborhood home" width="800" height="1000"><div class="auth-story-wash"></div><div class="auth-story-copy"><div class="eyebrow">Everything. Delivered.</div><h2>A little help.<br>A whole lot<br>more day.</h2><p>Food. Essentials. Parcels.<br>Errands and LIFT rides.</p><span>${icon('heart')} Made for your everyday.</span></div></div><div class="auth-main"><a class="back-link" href="#/">← Back to Cartman</a><div class="eyebrow">Your everyday starts here</div><h1>${signup?'Hello, possibilities.':'Welcome back.'}</h1><p class="form-subtitle">${signup?'A few details. A little more room for your day.':'Your next little journey starts here.'}</p><div class="tabs" role="group" aria-label="Account type">${['customer','rider','merchant'].map(r=>`<button type="button" data-role="${r}" aria-pressed="${role===r}" class="${role===r?'active':''}">${icon(r==='customer'?'user':r==='rider'?'bike':'shop')}${r[0].toUpperCase()+r.slice(1)}</button>`).join('')}</div><form id="auth-form">${signup?field('Full name','name','text','Juan Dela Cruz'):''}${field('Email address','email','email','you@example.com')}<label class="field">Password<span class="required-dot">*</span><div class="password-field"><input aria-label="Password" type="password" name="password" placeholder="${signup?'Create a password (8+ characters)':'Enter your password'}" required minlength="8" maxlength="128" autocomplete="${signup?'new-password':'current-password'}"><button class="password-toggle" type="button" aria-label="Show password">Show</button></div></label>${signup?'<label class="check"><input type="checkbox" required><span>I understand this is a demo account. <a href="#/terms">Terms</a> &amp; <a href="#/privacy">privacy notice</a>.</span></label>':'<div class="auth-options"><span>Local preview account</span><a href="#/forgot-password">Forgot password?</a></div>'}<button class="btn full">${signup?'Create demo account':'Log in to demo'} ${icon('arrow')}</button></form><p class="form-foot">${signup?'Already part of the neighborhood? <a href="#/login">Log in</a>':'New to Cartman? <a href="#/signup">Create an account</a>'}</p><div class="auth-demo">${icon('shield')}<span>UI preview only. Use sample details. No real authentication is connected and passwords are never stored.</span></div></div></section>`;
}

function bookingProgress(active=1) {
  return `<ol class="booking-progress" aria-label="Booking progress">${['Delivery details','Review & confirm','Track delivery'].map((s,i)=>`<li class="${i+1<=active?'current':''}" ${i+1===active?'aria-current="step"':''}><span>${i+1<active?'✓':i+1}</span>${s}</li>`).join('')}</ol>`;
}

function book(params) {
  const selected=params.get('service')||pendingBooking?.service||'parcel';
  return intro('A little less to do','What can we deliver?','Your next meal, a thoughtful parcel, or a little help with the everyday.')+bookingProgress()+`<div class="booking-layout"><div class="booking-main"><div class="booking-services" role="group" aria-label="Select delivery service">${services.map(s=>`<button type="button" data-service="${s.color}" aria-pressed="${s.color===selected}" class="${s.color===selected?'selected':''}">${icon(s.key)}<span>${serviceNames[s.color]}</span>${icon('check','service-check')}</button>`).join('')}</div><form id="booking-form"><label class="sr-only" for="service-select">Delivery service</label><select name="service" id="service-select" class="sr-only">${services.map(s=>`<option value="${s.color}" ${s.color===selected?'selected':''}>${s.name}</option>`).join('')}</select><section class="booking-panel"><div class="form-section-title"><span>01</span><div><h2>A little point A to point B.</h2><p>Add complete addresses so everything finds its way.</p></div></div><div class="address-fields"><div class="address-marker">${icon('pin')}<i></i>${icon('pin')}</div><div>${field('Pickup address','pickup','text','Building, street, barangay, city')}${field('Drop-off address','dropoff','text','Building, street, barangay, city')}</div></div></section><section class="booking-panel"><div class="form-section-title"><span>02</span><div><h2>Who’s looking forward to it?</h2><p>The recipient and a little planning.</p></div></div><div class="field-row">${field('Recipient name','recipient','text','Juan Dela Cruz')}${field('Mobile number','phone','tel','09123456789')}</div><div class="field-row"><label class="field">Estimated distance<span class="required-dot">*</span><select name="distance" id="distance" aria-label="Estimated distance"><option value="3">Up to 3 km</option><option value="5">3–5 km</option><option value="10">5–10 km</option><option value="15">10–15 km</option></select></label><label class="field">When would you like it?<select name="schedule"><option>As soon as possible</option><option>Today, 2–4 PM (demo)</option><option>Tomorrow, 9–11 AM (demo)</option></select></label></div><label class="field">Anything else we should know?<span class="optional-label">Optional</span><textarea name="notes" maxlength="500" placeholder="Items to pick up, a helpful landmark, or a note for the rider"></textarea></label></section><div class="mobile-book-total"><span>Illustrative total <strong id="mobile-estimate">₱79</strong></span></div><button class="btn full review-button">Review delivery ${icon('arrow')}</button><p class="booking-disclaimer">You can check everything before confirming.</p></form></div><aside class="booking-summary"><div class="summary-photo"><img id="summary-image" src="${media[selected]||media.parcel}" alt="Selected delivery service" width="600" height="400"></div><div class="summary-content"><div class="eyebrow">One less thing on your list</div><h3 id="summary-service">${serviceNames[selected]||'Parcels'}</h3><p id="summary-copy">${services.find(s=>s.color===selected)?.copy||''}</p><div class="summary-line"><span>Sample service fee</span><strong id="base-fee">₱49</strong></div><div class="summary-line"><span>Distance allowance</span><strong id="distance-fee">₱30</strong></div><div class="summary-total"><span>Illustrative total</span><strong id="estimate" aria-live="polite">₱79</strong></div><p class="price-note">Delivery only. Purchases and live rates are not included.</p>${demoNotice('Demo booking. No charges, live dispatch, or real deliveries.')}<a class="textlink" href="#/help">Need a helping hand? ${icon('arrow')}</a></div></aside></div>`;
}

function review() {
  if(!pendingBooking){location.replace('#/book');return '';}
  const b=pendingBooking;
  return intro('Just one more look','Ready for a lighter day?','Let’s make sure every little detail is in the right place.')+bookingProgress(2)+`<div class="review-layout"><article class="booking-panel review-card"><div class="review-heading"><span class="service-icon">${icon(services.find(s=>s.color===b.service)?.key||'box')}</span><div><span class="eyebrow">Your delivery</span><h2>${serviceNames[b.service]}</h2></div><a class="textlink" href="#/book?edit=1">Edit details ↗</a></div><div class="review-route"><div><span class="route-dot"></span><small>PICKUP</small><strong>${safe(b.pickup)}</strong></div><div><span class="route-dot filled"></span><small>DROP-OFF</small><strong>${safe(b.dropoff)}</strong></div></div><dl class="review-details"><div><dt>Recipient</dt><dd>${safe(b.recipient)}</dd></div><div><dt>Mobile</dt><dd>${safe(b.phone)}</dd></div><div><dt>Schedule</dt><dd>${safe(b.schedule)}</dd></div><div><dt>Distance</dt><dd>Up to ${safe(b.distance)} km (estimated)</dd></div>${b.notes?`<div class="wide"><dt>Delivery notes</dt><dd>${safe(b.notes)}</dd></div>`:''}</dl></article><aside class="booking-panel review-payment"><h3>A little clarity.</h3><div class="summary-total"><span>Illustrative total</span><strong>${money(b.total)}</strong></div><p class="price-note">This is a sample delivery estimate. Item purchases are not included.</p>${demoNotice('Confirmation saves a demo request in this browser. No payment or delivery takes place.')}<button id="confirm-booking" class="btn full">Confirm demo booking ${icon('arrow')}</button><a class="review-back" href="#/book?edit=1">← Back to details</a></aside></div>`;
}

function routeMap() {
  return `<div class="route-map" role="img" aria-label="Illustrative delivery route. This is a concept map, not a live location."><div class="map-block b1"></div><div class="map-block b2"></div><div class="map-block b3"></div><div class="map-block b4"></div><div class="map-block b5"></div><div class="map-road road1"></div><div class="map-road road2"></div><div class="map-road road3"></div><svg class="map-route" viewBox="0 0 500 300" aria-hidden="true"><path d="M90 220 L90 160 Q90 145 110 145 L270 145 Q285 145 285 125 L285 70 L405 70" fill="none" stroke="#245b46" stroke-width="5" stroke-dasharray="8 8"/><circle cx="90" cy="220" r="10" fill="#245b46"/><circle cx="405" cy="70" r="10" fill="#fff" stroke="#245b46" stroke-width="5"/></svg><span class="map-label pickup">Pickup</span><span class="map-label dropoff">Your doorstep</span><span class="map-concept">ILLUSTRATIVE ROUTE · NO LIVE GPS</span></div>`;
}

function track(params) {
  const id=(params.get('id')||'').toUpperCase();
  const b=read('cartman-bookings',[]).find(x=>x.id.toUpperCase()===id);
  const found=b||id==='CM-DEMO';
  return intro('A little peace of mind','Good things are on their way.','Follow your demo delivery, from the first little step to your doorstep.')+`<form id="track-form" class="track-search"><label class="sr-only" for="track-reference">Booking reference</label>${icon('box')}<input id="track-reference" name="reference" placeholder="Enter booking reference, e.g. CM-DEMO" required maxlength="40" value="${safe(id)}"><button class="btn">Track delivery ${icon('arrow')}</button></form>${!id?`<div class="track-empty">${routeMap()}<div><span class="service-icon">${icon('pin')}</span><h2>Every journey has a little story.</h2><p>Your booking reference opens yours.<br>Just looking around? Explore a sample delivery.</p><a class="btn outline" href="#/track?id=CM-DEMO">Try demo tracking ${icon('arrow')}</a></div></div>`:found?`<div class="tracking-layout"><div class="tracking-visual">${routeMap()}<div class="tracking-route"><div>${icon('pin')}<span><small>FROM</small><strong>${safe(b?.pickup||'Your neighborhood pickup')}</strong></span></div><div>${icon('pin')}<span><small>TO</small><strong>${safe(b?.dropoff||'Your doorstep')}</strong></span></div></div>${b?`<div class="tracking-info"><span>${serviceNames[b.service]}</span><span>Demo total <strong>${money(b.total)}</strong></span></div>`:''}</div><article class="tracking-status"><div class="status-title"><div><span class="eyebrow">Delivery reference</span><h2>${safe(id)}</h2></div><span class="badge">Confirmed</span></div><p class="tracking-intro">One less thing on your list.<br>Your demo request has been saved.</p><div class="timeline">${[['Demo booking confirmed','Saved in this browser. Ready for its next step.'],['Finding a helping hand','Live rider assignment connects here at launch.'],['Picked up & on the way','Live delivery progress will appear here.'],['A little doorstep happiness','The final step of your delivery journey.']].map(([t,p],i)=>`<div class="timeline-item ${i===0?'done':''}"><strong>${t}</strong><p>${p}</p></div>`).join('')}</div>${demoNotice('Preview only. No real rider, estimated arrival time, or GPS connection.')}<div class="tracking-actions"><a class="btn outline" href="#/help">Get help</a><a class="textlink" href="order.html" target="_blank" rel="noopener">Book another ↗</a></div></article></div>`:`<div class="empty-state" role="alert"><span class="service-icon">${icon('box')}</span><h2>Let’s try that again.</h2><p>That reference wasn’t found in this browser.<br>Check the code, or take a look at a sample delivery.</p><a class="btn outline" href="#/track?id=CM-DEMO">Explore CM-DEMO ↗</a></div>`}`;
}

function account() {
  const u=read('cartman-session');
  if(!u)return auth();
  const bookings=read('cartman-bookings',[]);
  return `<div class="account-shell"><aside class="account-sidebar"><div class="profile-avatar">${safe(u.name.slice(0,1).toUpperCase())}</div><h2>${safe(u.name)}</h2><span class="badge">${safe(u.role)} preview</span><nav aria-label="Account navigation"><a class="selected" href="#/account">${icon('shop')} Overview</a><a href="order.html" target="_blank" rel="noopener">${icon('box')} Book a delivery</a><a href="#/track">${icon('pin')} Track delivery</a><a href="#/help">${icon('heart')} Help & support</a><button id="logout">${icon('user')} Log out</button></nav></aside><section class="account-content"><div class="account-heading"><div class="eyebrow">Your little corner of Cartman</div><h1>Hello, ${safe(u.name.split(' ')[0])}.</h1><p>What can we take off your list today?</p></div><div class="account-banner"><div><h2>${u.role==='customer'?'Your everyday, a tap away.':u.role==='rider'?'Your next chapter starts here.':'Good business. More possibilities.'}</h2><p>${u.role==='customer'?'Meals, essentials, parcels, pabili, multi-stop errands, and LIFT rides.':u.role==='rider'?'Discover the Cartman rider journey and onboarding preview.':'Explore the merchant partnership and store onboarding preview.'}</p><a class="btn" href="#/${u.role==='customer'?'services':'partners?type='+u.role}">${u.role==='customer'?'Explore all services':'Explore your partnership'} ${icon('arrow')}</a></div>${icon(u.role==='customer'?'bag':u.role==='rider'?'bike':'shop')}</div><div class="account-mini-services">${services.map(s=>`<a href="#/book?service=${s.color}">${icon(s.key)}<span>${serviceNames[s.color]}</span><span>↗</span></a>`).join('')}</div><div class="account-section-heading"><h2>Your deliveries</h2><span>${bookings.length} demo ${bookings.length===1?'booking':'bookings'}</span></div><div class="bookings-list">${bookings.length?bookings.map(b=>`<a class="booking-list-item" href="#/track?id=${encodeURIComponent(b.id)}"><span class="service-icon">${icon(services.find(s=>s.color===b.service)?.key||'box')}</span><div><strong>${safe(b.id)}</strong><p>${safe(b.dropoff)}</p><small>${serviceNames[b.service]} · ${new Date(b.created).toLocaleDateString('en-PH',{month:'short',day:'numeric'})}</small></div><div class="booking-list-end"><span class="badge">Confirmed</span><strong>${money(b.total)}</strong></div><span>↗</span></a>`).join(''):`<div class="empty-state compact">${icon('box')}<h3>Your next little journey starts here.</h3><p>No demo deliveries yet. Let’s take something off your list.</p><a class="textlink" href="order.html" target="_blank" rel="noopener">Book your first delivery ↗</a></div>`}</div><div class="profile-details"><span>${icon('user')} ${safe(u.name)}</span><span>${safe(u.email)}</span><span>Local demo profile</span></div></section></div>`;
}

function partners(params) {
 const merchant=params.get('type')==='merchant';
 const title=merchant?'Your business.<br>More doorsteps.':'Your drive.<br>New possibilities.';
 const benefits=merchant?[['shop','Your neighborhood, online','Explore a home for your menu, products, and the little things customers love.'],['box','From counter to doorstep','See how local orders, pickups, and delivery details come together.'],['heart','Built around local life','For neighborhood kitchens, cafés, sari-sari stores, and everyday businesses.']]:[['bike','Put your local know-how to work','Explore opportunities in deliveries, errands, and Cartman LIFT.'],['pin','Clear details for every request','Preview pickup notes, destinations, and service instructions.'],['shield','Prepare with confidence','Learn what to have ready before official rider onboarding opens.']];
 const prepare=merchant?['Business name, category, and location','A contact person and business email','An idea of your menu or product range']:['Your name, email, and home city','Your vehicle type and service interests','Questions about coverage and onboarding'];
 return `<div class="partner-experience" data-partner-kind="${merchant?'merchant':'rider'}"><nav class="partner-role-nav" aria-label="Partnership type"><a href="#/partners?type=merchant" ${merchant?'aria-current="page"':''}>${icon('shop')}For merchants</a><a href="#/partners?type=rider" ${merchant?'':'aria-current="page"'}>${icon('bike')}For riders</a></nav>
 <section class="partner-hero"><div class="partner-hero-copy"><span class="eyebrow">GOOD THINGS MOVE TOGETHER</span><h1>${title}</h1><p>${merchant?'You bring the neighborhood favorites. Let’s bring them a little closer to the people who love them.':'Know your neighborhood? Explore delivery, errand, and LIFT opportunities with Cartman PH.'}</p><button type="button" class="btn" data-partner-start>${merchant?'Become a merchant':'Become a rider'} ${icon('arrow')}</button><span class="partner-hero-note">Partnership preview · Launch details coming soon</span><div class="partner-route" aria-hidden="true"><span>${icon(merchant?'shop':'bike')}${merchant?'Your business':'Your local know-how'}</span><i><b></b></i><span>${icon('heart')}Your community</span></div></div>
 <figure class="partner-hero-visual"><div class="partner-photo"><picture><source media="(max-width:700px)" srcset="assets/partner-${merchant?'merchant':'rider'}-portrait.webp"><img src="assets/partner-${merchant?'merchant':'rider'}-wide-v2.webp" alt="${merchant?'A café owner with a branded Cartman delivery bag':'A Cartman rider in a black uniform with his scooter, helmet, and delivery bag'}" width="1000" height="667"></picture></div></figure></section>
 <section class="partner-value-grid" aria-label="${merchant?'Merchant':'Rider'} opportunities">${benefits.map(([i,t,p],n)=>`<article class="partner-value"><div class="partner-value-top">${icon(i)}<span>0${n+1}</span></div><h2>${t}</h2><p>${p}</p></article>`).join('')}</section>
 <section class="partner-onboarding"><div class="partner-section-heading"><h2>Getting started</h2></div><ol class="partner-journey">${[['Explore the fit',merchant?'See how Cartman could fit your business.':'Explore the services and your preferred vehicle.'],['Share a little about you','Try the interest form with sample details.'],['Know what comes next','Coverage, requirements, and terms will be shared before launch.']].map(([t,p],n)=>`<li><span>0${n+1}</span><h3>${t}</h3><p>${p}</p></li>`).join('')}</ol></section>
 <section class="partner-application" aria-labelledby="partner-form-title"><aside class="partner-prep"><span class="eyebrow">HELPFUL TO HAVE READY</span><h2>What to prepare.</h2><p>Here’s what you can prepare for your expression of interest.</p><ul>${prepare.map(t=>`<li>${icon('check')}<span>${t}</span></li>`).join('')}</ul><div class="partner-prep-note">${icon('shield')}<p>${merchant?'Business eligibility, fees, and service coverage':'Vehicle eligibility, documents, service coverage, and partnership terms'} will be confirmed before launch.</p></div><a class="textlink" href="#/help">Need a little guidance? ${icon('arrow')}</a></aside>
 <div class="form-content partner-interest" role="region" aria-labelledby="partner-form-title" tabindex="-1"><span class="eyebrow">${merchant?'MERCHANT':'RIDER'} INTEREST</span><h2 id="partner-form-title">Let’s start a conversation.</h2><p class="form-subtitle">${merchant?'Tell us about the business you’re building.':'A few details to explore the possibilities.'}</p>${demoNotice('Preview only. Use sample details; this saves on your device and is not sent to a team.')}<form id="partner-form"><input type="hidden" name="partnership" value="${merchant?'merchant':'rider'}"><div class="field-row">${field('Full name','name','text','Juan Dela Cruz')}${field('Email address','email','email','you@example.com')}</div>${merchant?'<div class="field-row">':''}${field(merchant?'Business name':'City / municipality','location','text',merchant?'Your neighborhood business':'Where you’re based')}${merchant?field('City / municipality','city','text','Where your business is based'):''}${merchant?'</div>':''}<label class="field">${merchant?'Business category':'Vehicle type'}<select name="category">${(merchant?['Restaurant / café','Grocery / convenience','Retail / other']:['Motorcycle','Tricycle','Bicycle','Other']).map(t=>`<option>${t}</option>`).join('')}</select></label><label class="check"><input type="checkbox" required><span>I understand this saves a demo expression of interest. No application is sent.</span></label><button class="btn full">Save demo interest ${icon('arrow')}</button></form><div id="partner-result"></div></div></section></div>`;
}

function help() {
  return intro('A helping hand','Help for every Cartman service.','Find answers about food orders, parcels, LIFT rides, pabili, and multi-stop errands.')+`<div class="help-shortcuts"><a href="#/track">${icon('pin')}<div><h3>Follow your delivery</h3><p>Find your demo booking and its next steps.</p></div><span>↗</span></a><a href="#/account">${icon('user')}<div><h3>Your account</h3><p>Your profile and saved demo bookings.</p></div><span>↗</span></a><a href="#/partners">${icon('shop')}<div><h3>Partner with us</h3><p>Explore merchant and rider opportunities.</p></div><span>↗</span></a></div><div class="help-questions"><div class="section-head"><h2>Good questions.<br><span>Helpful answers.</span></h2><label class="help-search"><span class="sr-only">Search help topics</span><input id="help-search" type="search" placeholder="Search a question…"></label></div>${faqView(false)}<p class="hidden help-no-results" role="status">No matching questions. Try a different word, or leave a demo request below.</p></div><div id="contact-support" class="form-shell"><div class="form-content"><h2>Still on your mind?</h2><p class="form-subtitle">Tell us what you need a hand with.</p>${demoNotice('Support preview. Requests are saved locally and are not sent to a team.')}<form id="support-form">${field('Email address','email','email','you@example.com')}<label class="field">What’s it about?<select name="topic"><option>Food &amp; essentials</option><option>Parcels &amp; deliveries</option><option>Cartman LIFT rides</option><option>Pabili &amp; multi-stop errands</option><option>Account help</option><option>Partnership</option><option>Something else</option></select></label><label class="field">Your message<textarea name="message" required maxlength="1000" placeholder="A little detail goes a long way"></textarea></label><button class="btn full">Save demo request ${icon('arrow')}</button></form><div id="support-result"></div></div><aside class="form-side"><div class="service-icon">${icon('heart')}</div><h3>We’ll work<br>it out together.</h3><p>Official contact information and support hours will be added before launch.</p><a class="textlink" href="#/track">Track a demo delivery ↗</a></aside></div>`;
}

function waitlist() {
  const platform=new URLSearchParams(location.hash.split('?')[1]||'').get('platform');
  return `<div class="platform-note">${platform==='ios'?'Cartman for iPhone':platform==='android'?'Cartman for Android':'Cartman for iPhone & Android'} · Coming soon. Official download links will appear here at launch.</div>`+intro('One app. More ways to get things done.','A better everyday is coming.','Meals, essentials, parcels, pabili, multi-stop errands, and Cartman LIFT rides. All in your pocket.')+`<div class="form-shell waitlist-shell"><div class="form-content"><div class="eyebrow">Be part of what’s next</div><h2>Get ready for Cartman.</h2><p class="form-subtitle">Save your interest in the Cartman app launch.</p>${demoNotice('Local preview. This saves your interest on this device; it does not subscribe you to emails.')}<form id="waitlist-form">${field('First name','name','text','Your first name')}${field('Email address','email','email','you@example.com')}${field('City / municipality','city','text','Your neighborhood')}<button class="btn full">Save launch interest ${icon('arrow')}</button></form><div id="waitlist-result"></div></div><aside class="waitlist-visual">${appPhone()}<span>APP CONCEPT · COMING SOON</span></aside></div>`;
}

function servicePage() {
  const location=read('cartman-location','');
  return intro('Your everyday, all in one place','What’s on your list today?','Order meals and essentials, send parcels, plan pabili or multi-stop errands, and get around with Cartman LIFT.')+`<div class="service-location"><span>${icon('pin')}${location?'Exploring for <strong>'+safe(location)+'</strong>':'Made for your neighborhood'}</span><a href="#/">${location?'Change location':'Add your location'} ↗</a></div><section class="section service-catalog">${serviceCardView()}</section><div class="catalog-note">${icon('shield')}<p>This is a service preview. Coverage, partners, and live prices are being finalized. No real orders, rides, or errands are dispatched.</p></div><section class="section catalog-how"><div class="section-head"><h2>Choose a service.<br><span>Make more of your day.</span></h2><a class="textlink" href="#/how-it-works">How it works ${icon('arrow')}</a></div>${stepsView()}</section>`;
}

function slideshow() {
  const slides=[
    {src:media.hero,mobile:'assets/rider-mobile-v2.webp',label:'01 / MORE LIFE. FEWER ERRANDS.',alt:'A smiling Cartman rider in a black branded uniform',copy:'Meals, essentials, parcels, and errands.<br>Motorcycle and tricycle rides with LIFT.',greeting:'A little help for your day.',heading:'What sounds<br>good today?',promo:'A whole lot<br>of possibilities.',image:media.food,card:'A little closer to you.',note:'Your everyday, made easier.',symbol:'bike'},
    {src:'assets/delivery-hero-v2.webp',mobile:'assets/delivery-mobile-v2.webp',label:'02 / CARE AT EVERY DOORSTEP.',alt:'A Cartman PH courier in a black uniform delivers groceries to a customer',copy:'Food, groceries, and parcels to your door.<br>More time for the rest of your day.',greeting:'From a little trip to your doorstep.',heading:'Every little<br>step, in view.',promo:'Care at every<br>doorstep.',image:media.grocery,card:'Care at every doorstep.',note:'From pickup to a little happiness.',symbol:'box'},
    {src:'assets/aling-neneng-demo.webp',mobile:'assets/merchant-mobile-v2.webp',label:'03 / A LITTLE HELP. A LITTLE MORE DAY.',alt:'A welcoming fictional Filipino sari-sari shopkeeper at Aling Neneng’s store',copy:'Pabili, pickups, and multi-stop errands.<br>One request. More off your to-do list.',greeting:'Make a little time for together.',heading:'Good food.<br>Better company.',promo:'Your next<br>favorite bite.',image:media.food,card:'Your list. Taken care of.',note:'A helping hand for your everyday.',symbol:'bolt'}
  ];
  slide=0;
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  const slideDuration=4000;
  let paused=motion.matches, hovering=false, revision=0, countdown;
  const hero=$('.campaign-hero'), heroImage=$('#hero-image');
  const mobileMedia=matchMedia('(max-width:767px)');
  const sourceFor=s=>mobileMedia.matches?s.mobile:s.src;
  heroImage.src=slides[0].src;
  mobileMedia.addEventListener('change',()=>{if(!hero.isConnected)return;hero.querySelectorAll('.hero-image-outgoing').forEach(n=>n.remove())});
  // Warm the small campaign set so transitions do not expose unloaded images.
  [...new Set(slides.map(sourceFor))].forEach(src=>{const image=new Image();image.src=src});
  function show(n){
    const next=(n+slides.length)%slides.length;
    if(next===slide)return;
    slide=next;
    const current=++revision;
    hero.querySelectorAll('.hero-image-outgoing').forEach(image=>image.remove());
    hero.getAnimations({subtree:true}).forEach(animation=>animation.cancel());
    let outgoing;
    if(!motion.matches){
      outgoing=heroImage.cloneNode();
      outgoing.src=heroImage.currentSrc;
      outgoing.removeAttribute('id');outgoing.alt='';outgoing.setAttribute('aria-hidden','true');
      outgoing.classList.add('hero-image-outgoing');
      for(const key of ['objectPosition','objectFit','maskImage','maskComposite','left','right','top','bottom','width','height'])outgoing.style[key]=getComputedStyle(heroImage)[key];
      outgoing.style.transform=getComputedStyle(heroImage).transform;
      outgoing.style.transformOrigin=getComputedStyle(heroImage).transformOrigin;
      heroImage.closest('picture').after(outgoing);
    }
    const s=slides[slide];
    $('.campaign-hero').dataset.scene=String(slide);
    $('#hero-mobile').srcset=s.mobile;$('#hero-image').src=s.src;$('#hero-image').alt=s.alt;
    $('#campaign-label').textContent=s.label;$('#campaign-description').innerHTML=s.copy;
    const phone=$('.hero-phone');
    phone.querySelector('.showcase-content').innerHTML=campaignScreen(slide);
    phone.querySelector('.app-phone').setAttribute('aria-label','Cartman app preview: '+['Discover your favorites','Follow your delivery','Make a pabili request'][slide]);
    document.querySelectorAll('[data-slide]').forEach((b,i)=>{b.classList.toggle('active',i===slide);b.setAttribute('aria-pressed',String(i===slide))});
    if(!motion.matches){
      [phone.querySelector('.phone-view'),$('#campaign-description')].forEach(node=>{
        node.animate([{opacity:.25},{opacity:1}],{duration:280,easing:'cubic-bezier(.2,.7,.2,1)'});
      });
      animateScreen();
      // Keep the previous photo visible until its replacement has decoded.
      heroImage.decode().catch(()=>{}).then(()=>{
        if(current!==revision||!hero.isConnected){outgoing?.remove();return}
        if(motion.matches){outgoing?.remove();return}
        const fade=outgoing.animate([{opacity:1},{opacity:0}],{duration:380,easing:'ease-in-out',fill:'forwards'});
        fade.finished.then(()=>outgoing.remove()).catch(()=>outgoing.remove());
      });
    }
  }
  function start(){
    clearInterval(slideTimer);countdown?.cancel();
    if(!paused&&!hovering&&!hero.querySelector(':focus-visible')&&!document.hidden&&hero.isConnected){
      const bar=hero.querySelector('[data-slide].active .slide-duration');
      if(!motion.matches)countdown=bar?.animate([{transform:'scaleX(0)'},{transform:'scaleX(1)'}],{duration:slideDuration,fill:'forwards'});
      slideTimer=setInterval(()=>{show(slide+1);start()},slideDuration);
    }
  }
  function animateScreen(){
    if(motion.matches)return;
    hero.querySelectorAll('.screen-section').forEach((node,i)=>node.animate([{opacity:0,transform:'scale(.985)'},{opacity:1,transform:'scale(1)'}],{duration:480,delay:100+i*100,easing:'cubic-bezier(.2,.7,.2,1)',fill:'backwards'}));
    hero.querySelector('.screen-route-line')?.animate([{strokeDasharray:'1',strokeDashoffset:1},{strokeDasharray:'1',strokeDashoffset:0}],{duration:1400,delay:350,easing:'ease-in-out',fill:'backwards'});
    hero.querySelector('.screen-progress i')?.animate([{transform:'scaleX(0)'},{transform:'scaleX(1)'}],{duration:1200,delay:550,easing:'ease-out',fill:'backwards'});
    hero.querySelector('.screen-route-rider')?.animate([
      {transform:'translate(0,0)'},{transform:'translate(55px,0)',offset:.25},
      {transform:'translate(55px,-40px)',offset:.45},{transform:'translate(115px,-40px)'}
    ],{duration:2600,delay:650,easing:'ease-in-out',fill:'forwards'});
    hero.querySelectorAll('.screen-store,.screen-shopping-row').forEach((node,i)=>{
      node.animate([{opacity:0,transform:'translateY(5px)'},{opacity:1,transform:'translateY(0)'}],{duration:450,delay:350+i*160,fill:'backwards',easing:'ease-out'});
      node.querySelector('i')?.animate([{opacity:0,transform:'scale(.5)'},{opacity:1,transform:'scale(1)'}],{duration:300,delay:700+i*300,fill:'backwards',easing:'ease-out'});
    });
  }
  function choose(n){show(n);start()}
  document.querySelectorAll('[data-slide]').forEach(b=>b.onclick=()=>choose(Number(b.dataset.slide)));
  document.querySelectorAll('[data-direction]').forEach(b=>b.onclick=()=>choose(slide+Number(b.dataset.direction)));
  hero.addEventListener('keydown',e=>{if(e.ctrlKey||e.metaKey||e.altKey)return;if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();choose(e.key==='Home'?0:e.key==='End'?slides.length-1:slide+(e.key==='ArrowRight'?1:-1))});
  let gesture;
  hero.addEventListener('pointerdown',e=>{if(e.pointerType==='touch'&&!e.target.closest('a,button'))gesture={x:e.clientX,y:e.clientY}});
  hero.addEventListener('pointerup',e=>{if(!gesture)return;const dx=e.clientX-gesture.x,dy=e.clientY-gesture.y;gesture=null;if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)*1.5)choose(slide+(dx<0?1:-1))});
  hero.addEventListener('pointercancel',()=>{gesture=null});
  hero.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'){hovering=true;start()}});
  hero.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse'){hovering=false;start()}});
  hero.addEventListener('focusin',()=>start());
  hero.addEventListener('focusout',()=>queueMicrotask(start));
  document.onvisibilitychange=()=>{if($('#hero-image'))start();else clearInterval(slideTimer)};
  document.querySelectorAll('[data-slide]').forEach(b=>b.innerHTML='<span class="slide-duration" aria-hidden="true"></span>');
  motion.addEventListener('change',()=>{if(!hero.isConnected)return;paused=motion.matches;if(motion.matches){hero.getAnimations({subtree:true}).forEach(a=>a.cancel());hero.querySelectorAll('.hero-image-outgoing').forEach(n=>n.remove())}start()});
  animateScreen();start();
}

function refineMotion(route){window.CartmanMotion?.mount(document,{opening:route==='/'})}

function bind(route,params) {
  bindFaqMotion();
  document.querySelectorAll("[data-partner-start]").forEach(button=>button.onclick=()=>{const form=document.querySelector(".partner-interest");form?.focus({preventScroll:true});form?.scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"instant":"smooth",block:"start"});});
  bindBase(route,params);
  refineMotion(route);
  if($('#location-form'))$('#location-form').onsubmit=e=>{e.preventDefault();save('cartman-location',new FormData(e.target).get('location').trim());location.hash='/services';toast('Explore services for your day. Live coverage will be confirmed at launch.')};
  if($('#delivery-location'))$('#delivery-location').value=read('cartman-location','');
  if($('#help-search'))$('#help-search').oninput=e=>{const query=e.target.value.toLowerCase().trim();let matches=0;document.querySelectorAll('.help-questions details').forEach(d=>{const match=d.textContent.toLowerCase().includes(query);d.hidden=!match;if(match)matches++});$('.help-no-results').classList.toggle('hidden',matches>0)};
  if($('.password-toggle'))$('.password-toggle').onclick=e=>{const input=e.currentTarget.previousElementSibling;const visible=input.type==='password';input.type=visible?'text':'password';e.currentTarget.textContent=visible?'Hide':'Show';e.currentTarget.setAttribute('aria-label',visible?'Hide password':'Show password')};
  document.querySelectorAll('[data-role]').forEach(b=>b.onclick=()=>{const values=$('#auth-form')?Object.fromEntries(new FormData($('#auth-form'))):{};role=b.dataset.role;render(false);for(const [k,v] of Object.entries(values)){const input=$('#auth-form')?.elements.namedItem(k);if(input&&input.type!=='checkbox')input.value=v}});
  if($('#booking-form')) {
    const form=$('#booking-form');
    const prefill=params.get('edit')&&pendingBooking?pendingBooking:read('cartman-draft');
    if(prefill){for(const [k,v]of Object.entries(prefill)){const input=form.elements.namedItem(k);if(input)input.value=v}}
    if(services.some(s=>s.color===params.get('service')))$('#service-select').value=params.get('service');
    const deliveryLocation=read('cartman-location','');if(deliveryLocation&&!form.elements.dropoff.value)form.elements.dropoff.value=deliveryLocation;
    const update=()=>{const service=$('#service-select').value;const base={food:49,grocery:69,parcel:49,errands:89};const fee=Number($('#distance').value)*10;const total=base[service]+fee;$('#estimate').textContent=money(total);$('#mobile-estimate').textContent=money(total);$('#base-fee').textContent=money(base[service]);$('#distance-fee').textContent=money(fee);$('#summary-service').textContent=serviceNames[service];$('#summary-copy').textContent=services.find(s=>s.color===service)?.copy||'';$('#summary-image').src=media[service];document.querySelectorAll('[data-service]').forEach(b=>{b.classList.toggle('selected',b.dataset.service===service);b.setAttribute('aria-pressed',String(b.dataset.service===service))});save('cartman-draft',Object.fromEntries(new FormData(form)))};
    document.querySelectorAll('[data-service]').forEach(b=>b.onclick=()=>{$('#service-select').value=b.dataset.service;update()});
    $('#service-select').onchange=update;$('#distance').onchange=update;form.oninput=()=>save('cartman-draft',Object.fromEntries(new FormData(form)));
    form.onsubmit=e=>{e.preventDefault();pendingBooking={...Object.fromEntries(new FormData(form)),total:estimate()};save('cartman-review',pendingBooking);location.hash='/review'};update();
  }
  if($('#confirm-booking'))$('#confirm-booking').onclick=e=>{if(!pendingBooking)return;e.currentTarget.disabled=true;const b={...pendingBooking,id:'CM-'+(crypto.randomUUID?crypto.randomUUID().split('-')[0].toUpperCase():Date.now().toString(36).toUpperCase()),created:new Date().toISOString()};if(save('cartman-bookings',[b,...read('cartman-bookings',[])])){pendingBooking=null;localStorage.removeItem('cartman-review');localStorage.removeItem('cartman-draft');location.hash='/track?id='+b.id;toast('Your demo booking is confirmed.')}else e.currentTarget.disabled=false};
  if($('#clear-data'))$('#clear-data').onclick=()=>{['session','bookings','partner','support','waitlist','location','review','draft'].forEach(k=>localStorage.removeItem('cartman-'+k));pendingBooking=null;header();toast('Your Cartman demo data has been cleared.')};
  if($('#auth-form'))$('#auth-form').onsubmit=e=>{e.preventDefault();const d=new FormData(e.target);if(save('cartman-session',{name:String(d.get('name')||d.get('email').split('@')[0]).trim(),email:d.get('email'),role})){location.hash='/account';toast('Welcome to your Cartman demo workspace.')}};
}

pendingBooking=read('cartman-review');
render();
