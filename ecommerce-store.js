
// ── PRODUCT DATA ──
const products = [
  {id:1,name:"Merino Wool Coat",category:"clothing",price:289,oldPrice:null,Image:"https://thefoschini.vtexassets.com/arquivos/ids/224343992-300-400/2a06fb59-8f70-4217-8de9-992448468e70.png?v=639075968030630000",rating:4.8,reviews:124,badge:"new",colors:["#1a1714","#8a7660","#f0ebe2"],sizes:["XS","S","M","L","XL"],desc:"Luxuriously soft merino wool in a tailored silhouette. Fully lined with a timeless lapel collar."},
  {id:2,name:"Leather Tote Bag",category:"accessories",price:195,oldPrice:240,Image:"https://static.vecteezy.com/system/resources/thumbnails/053/775/328/small/the-black-leather-tote-bag-is-shown-on-a-black-background-png.png",rating:4.9,reviews:88,badge:"sale",colors:["#8a6040","#1a1714","#c4bdb2"],sizes:["One Size"],desc:"Full-grain vegetable-tanned leather that develops a beautiful patina with age."},
  {id:3,name:"Linen Shirt Dress",category:"clothing",price:149,oldPrice:null,Image:"https://whitecompany.scene7.com/is/image/whitecompany/Linen-Shirt-Dress/A15594_SU25_36_P_4?$M_P_PDP$",rating:4.6,reviews:63,badge:null,colors:["#f0ebe2","#d4c8b5","#9a9186"],sizes:["XS","S","M","L","XL","XXL"],desc:"Breathable 100% linen with mother-of-pearl buttons. Easy, effortless summer dressing."},
  {id:4,name:"Ceramic Mug Set",category:"home",price:68,oldPrice:null,Image:"https://png.pngtree.com/png-vector/20240509/ourmid/pngtree-the-essential-guide-to-choosing-perfect-coffee-mug-set-png-image_12431803.png",rating:4.7,reviews:201,badge:"hot",colors:["#f0ebe2","#1a1714","#b8955a"],sizes:["Set of 2","Set of 4"],desc:"Hand-thrown stoneware glazed in matte earth tones. Dishwasher safe, oven safe."},
  {id:5,name:"Cashmere Scarf",category:"accessories",price:124,oldPrice:155,Image:"https://png.pngtree.com/png-vector/20240813/ourmid/pngtree-elegant-tan-scarf-with-fringed-ends-for-timeless-style-png-image_13466479.png",rating:4.9,reviews:47,badge:"sale",colors:["#b8955a","#8a9690","#1a1714"],sizes:["One Size"],desc:"Pure Grade-A cashmere, softer with every wash. 180cm × 60cm."},
  {id:6,name:"Beauty Accessories",category:"beauty",price:58,oldPrice:null,Image:"https://png.pngtree.com/png-vector/20240818/ourmid/pngtree-geset-of-luxury-beauty-cosmetic-makeup-bdifferent-png-image_13532167.png",rating:4.8,reviews:312,badge:"new",colors:["#e8d0d8"],sizes:["30ml","50ml"],desc:"Cold-pressed organic rosehip seed oil. Brightens, plumps, and restores overnight."},
  {id:7,name:"Wide-Leg Trousers",category:"clothing",price:178,oldPrice:null,Image:"https://png.pngtree.com/png-vector/20250705/ourmid/pngtree-olive-green-wide-leg-pants-png-image_16607690.webp",rating:4.5,reviews:94,badge:null,colors:["#1a1714","#f0ebe2","#4a453f"],sizes:["XS","S","M","L","XL"],desc:"Fluid crepe fabric with a high waist and wide silhouette. Side zip fastening."},
  {id:8,name:"Beeswax Candle",category:"home",price:42,oldPrice:null,Image:"https://static.vecteezy.com/system/resources/thumbnails/068/846/914/small/caramel-colored-beeswax-candle-with-wick-png.png",rating:4.6,reviews:156,badge:null,colors:["#d4b07a","#f0ebe2"],sizes:["Small","Large"],desc:"Pure beeswax with notes of cedarwood and bergamot. 55-hour burn time."},
  {id:9,name:"Silk Pillowcase",category:"home",price:89,oldPrice:110,Image:"https://png.pngtree.com/png-vector/20240812/ourmid/pngtree-multicolored-decorative-pillowcase-png-image_13461971.png",rating:4.7,reviews:78,badge:"sale",colors:["#f0ebe2","#1a1714","#8a6040"],sizes:["Standard","King"],desc:"22-momme mulberry silk. Gentle on hair and skin, naturally temperature-regulating."},
  {id:10,name:"Leather Belt",category:"accessories",price:85,oldPrice:null,Image:"https://png.pngtree.com/png-vector/20250530/ourmid/pngtree-classic-leather-belt-png-image_16420292.png",rating:4.5,reviews:41,badge:null,colors:["#8a6040","#1a1714"],sizes:["S","M","L","XL"],desc:"Full-grain belt with a brushed brass buckle. Hand-stitched edges."},
  {id:11,name:"Vitamin C Serum",category:"beauty",price:72,oldPrice:90,Image:"https://png.pngtree.com/png-clipart/20250511/original/pngtree-luxury-vitamin-c-serum-in-golden-dropper-bottle-png-image_20800759.png",rating:4.8,reviews:228,badge:"sale",colors:["#d4c8b5"],sizes:["15ml","30ml"],desc:"15% vitamin C with hyaluronic acid. Brightens, evens, and protects."},
  {id:12,name:"Knit Sweater",category:"clothing",price:168,oldPrice:null,Image:"https://static.vecteezy.com/system/resources/previews/054/788/451/non_2x/cream-cable-knit-sweater-with-colorful-striped-sleeves-on-transparent-background-png.png",rating:4.6,reviews:85,badge:"new",colors:["#b8955a","#f0ebe2","#8a9690"],sizes:["XS","S","M","L","XL"],desc:"Relaxed-fit lambswool knit with ribbed cuffs and hem. Machine washable."},
];

let cart = [];
let currentFilter = 'all';
let currentSort = 'default';
let wishlist = new Set();

// ── RENDER PRODUCTS ──
function renderProducts(list){
  const grid = document.getElementById('productGrid');
  const count = document.getElementById('productCount');
  count.textContent = list.length + ' products';
  if(list.length === 0){
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:4rem;color:var(--muted);">
      <div style="font-size:3rem;margin-bottom:1rem;">🔍</div>
      <p style="font-size:0.9rem;">No products found. Try a different filter.</p>
    </div>`;
    return;
  }
  grid.innerHTML = list.map((p,i) => `
    <div class="product-card" style="animation-delay:${i*0.06}s" data-id="${p.id}">
      <div class="product-img-wrap" onclick="openModal(${p.id})">
        <div class="product-img-bg"><img src="${p.Image}" alt="${p.name}"></div>
        ${p.badge ? `<span class="product-badge badge-${p.badge}">${p.badge}</span>` : ''}
        <div class="product-actions">
          <button class="p-action-btn ${wishlist.has(p.id)?'wishlisted':''}" onclick="event.stopPropagation();toggleWishlist(${p.id},this)" title="Wishlist">
            ${wishlist.has(p.id)?'❤️':'🤍'}
          </button>
          <button class="p-action-btn" onclick="event.stopPropagation();openModal(${p.id})" title="Quick View">👁</button>
        </div>
      </div>
      <div class="product-info">
        <div class="product-category">${p.category}</div>
        <div class="product-name" onclick="openModal(${p.id})">${p.name}</div>
        <div class="color-swatches">
          ${p.colors.map((c,ci) => `<div class="swatch ${ci===0?'active':''}" style="background:${c}" onclick="event.stopPropagation()"></div>`).join('')}
        </div>
        <div class="product-rating">
          <div class="stars">${'★'.repeat(Math.floor(p.rating))}${p.rating%1?'½':''}</div>
          <span class="rating-count">(${p.reviews})</span>
        </div>
        <div class="product-footer">
          <div class="product-price">
            <span class="price-current">$${p.price}</span>
            ${p.oldPrice?`<span class="price-old">$${p.oldPrice}</span>`:''}
          </div>
          <button class="add-to-cart-btn" onclick="addToCart(${p.id},this)">Add</button>
        </div>
      </div>
    </div>
  `).join('');
}

function getFilteredSorted(){
  let list = currentFilter === 'all' ? [...products] : products.filter(p => p.category === currentFilter);
  const q = document.getElementById('searchInput').value.toLowerCase().trim();
  if(q) list = list.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
  if(currentSort === 'price-asc') list.sort((a,b) => a.price - b.price);
  else if(currentSort === 'price-desc') list.sort((a,b) => b.price - a.price);
  else if(currentSort === 'rating') list.sort((a,b) => b.rating - a.rating);
  else if(currentSort === 'newest') list.sort((a,b) => b.id - a.id);
  return list;
}

function filterProducts(cat, btn){
  currentFilter = cat;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  if(btn) btn.classList.add('active');
  renderProducts(getFilteredSorted());
  document.getElementById('products').scrollIntoView({behavior:'smooth',block:'start'});
}

function sortProducts(val){
  currentSort = val;
  renderProducts(getFilteredSorted());
}

function handleSearch(){
  renderProducts(getFilteredSorted());
}

// ── CART ──
function addToCart(id, btn){
  const p = products.find(x => x.id === id);
  const existing = cart.find(x => x.id === id);
  if(existing){ existing.qty++; }
  else { cart.push({...p, qty:1, selectedSize: p.sizes[0]}); }
  updateCart();
  if(btn){ btn.textContent = '✓ Added'; btn.classList.add('added'); setTimeout(()=>{btn.textContent='Add';btn.classList.remove('added');},1500); }
  showToast(`🛍️ ${p.name} added to cart`,'gold');
}

function removeFromCart(id){
  cart = cart.filter(x => x.id !== id);
  updateCart();
}

function changeQty(id, delta){
  const item = cart.find(x => x.id === id);
  if(!item) return;
  item.qty += delta;
  if(item.qty <= 0) removeFromCart(id);
  else updateCart();
}

function updateCart(){
  const total = cart.reduce((s,i) => s + i.price * i.qty, 0);
  const count = cart.reduce((s,i) => s + i.qty, 0);
  const badge = document.getElementById('cartBadge');
  badge.textContent = count;
  badge.classList.toggle('visible', count > 0);
  document.getElementById('cartCount').textContent = `(${count} item${count !== 1 ? 's' : ''})`;
  document.getElementById('cartSubtotal').textContent = `$${total.toFixed(2)}`;
  document.getElementById('cartTotal').textContent = `$${total.toFixed(2)}`;
  const footer = document.getElementById('cartFooter');
  footer.style.display = cart.length > 0 ? 'block' : 'none';
  const itemsEl = document.getElementById('cartItems');
  if(cart.length === 0){
    itemsEl.innerHTML = `<div class="cart-empty"><div class="empty-icon">🛒</div><p>Your cart is empty.</p><p style="font-size:0.75rem;">Add something beautiful.</p></div>`;
  } else {
    itemsEl.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div class="cart-item-img">${item.Image}</div>
        <div>
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-variant">Size: ${item.selectedSize}</div>
          <div class="qty-control">
            <button class="qty-btn" onclick="changeQty(${item.id},-1)">−</button>
            <span class="qty-num">${item.qty}</span>
            <button class="qty-btn" onclick="changeQty(${item.id},1)">+</button>
          </div>
          <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
        </div>
        <div class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</div>
      </div>
    `).join('');
  }
}

function toggleCart(){
  const overlay = document.getElementById('cartOverlay');
  const sidebar = document.getElementById('cartSidebar');
  overlay.classList.toggle('open');
  sidebar.classList.toggle('open');
}

// ── WISHLIST ──
function toggleWishlist(id, btn){
  const p = products.find(x => x.id === id);
  if(wishlist.has(id)){
    wishlist.delete(id);
    btn.classList.remove('wishlisted');
    btn.innerHTML = '🤍';
    showToast(`Removed from wishlist`);
  } else {
    wishlist.add(id);
    btn.classList.add('wishlisted');
    btn.innerHTML = '❤️';
    showToast(`❤️ ${p.name} wishlisted`,'gold');
  }
}

// ── QUICK VIEW MODAL ──
function openModal(id){
  const p = products.find(x => x.id === id);
  document.getElementById('modalImg').innerHTML = `
    <button class="modal-close" onclick="closeModalDirect()">✕</button>
    <div style="font-size:10rem;">${p.Image}</div>
    ${p.badge ? `<span class="product-badge badge-${p.badge}" style="position:absolute;top:1rem;left:1rem;">${p.badge}</span>` : ''}
  `;
  document.getElementById('modalContent').innerHTML = `
    <div class="modal-category">${p.category}</div>
    <div class="modal-name">${p.name}</div>
    <div class="modal-price-row">
      <span class="modal-price">$${p.price}</span>
      ${p.oldPrice?`<span class="modal-old-price">$${p.oldPrice}</span>`:''}
      ${p.oldPrice?`<span class="product-badge badge-sale" style="position:relative;top:0;left:0;">Save $${p.oldPrice-p.price}</span>`:''}
    </div>
    <div class="product-rating" style="margin-bottom:1rem;">
      <div class="stars">${'★'.repeat(Math.floor(p.rating))}${p.rating%1?'½':''}</div>
      <span class="rating-count">(${p.reviews} reviews)</span>
    </div>
    <div class="modal-desc">${p.desc}</div>
    <div class="option-label">Colour</div>
    <div class="color-swatches" style="margin-bottom:1.2rem;">
      ${p.colors.map((c,ci) => `<div class="swatch ${ci===0?'active':''}" style="background:${c};width:22px;height:22px;" onclick="this.parentNode.querySelectorAll('.swatch').forEach(s=>s.classList.remove('active'));this.classList.add('active')"></div>`).join('')}
    </div>
    <div class="option-label">Size</div>
    <div class="size-grid">
      ${p.sizes.map((s,si) => `<button class="size-btn ${si===0?'active':''}" onclick="this.parentNode.querySelectorAll('.size-btn').forEach(b=>b.classList.remove('active'));this.classList.add('active')">${s}</button>`).join('')}
    </div>
    <div class="modal-actions">
      <button class="modal-add-btn" onclick="addToCart(${p.id},null);closeModalDirect();">Add to Cart — $${p.price}</button>
      <button class="modal-wish-btn ${wishlist.has(p.id)?'active':''}" onclick="toggleWishlistModal(${p.id},this)">
        ${wishlist.has(p.id)?'❤️':'🤍'}
      </button>
    </div>
    <div class="modal-meta">
      <p>🚚 <span>Free shipping</span> on orders over $150</p>
      <p>↩️ <span>Free returns</span> within 30 days</p>
      <p>🌿 <span>Sustainably sourced</span> materials</p>
    </div>
  `;
  document.getElementById('modalOverlay').classList.add('open');
}

function toggleWishlistModal(id, btn){
  const p = products.find(x => x.id === id);
  if(wishlist.has(id)){
    wishlist.delete(id);
    btn.classList.remove('active');
    btn.innerHTML = '🤍';
  } else {
    wishlist.add(id);
    btn.classList.add('active');
    btn.innerHTML = '❤️';
    showToast(`❤️ ${p.name} wishlisted`,'gold');
  }
}

function closeModal(e){
  if(e.target === document.getElementById('modalOverlay')) closeModalDirect();
}

function closeModalDirect(){
  document.getElementById('modalOverlay').classList.remove('open');
}

// ── TOAST ──
let toastTimer;
function showToast(msg, type=''){
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast show' + (type ? ' '+type : '');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>{ t.classList.remove('show'); }, 2800);
}

// ── NEWSLETTER ──
function handleNewsletter(){
  const val = document.getElementById('emailInput').value;
  if(!val || !val.includes('@')){ showToast('Please enter a valid email.'); return; }
  showToast('🎉 You\'re subscribed — welcome to the edit!','gold');
  document.getElementById('emailInput').value = '';
}

// ── SWATCH CLICK ──
document.addEventListener('click', e => {
  if(e.target.classList.contains('swatch') && !e.target.closest('.modal-content')){
    const swatches = e.target.closest('.color-swatches').querySelectorAll('.swatch');
    swatches.forEach(s => s.classList.remove('active'));
    e.target.classList.add('active');
  }
});

// ── KEYBOARD ESC ──
document.addEventListener('keydown', e => {
  if(e.key === 'Escape'){
    closeModalDirect();
    const overlay = document.getElementById('cartOverlay');
    const sidebar = document.getElementById('cartSidebar');
    if(sidebar.classList.contains('open')){ overlay.classList.remove('open'); sidebar.classList.remove('open'); }
  }
});

// ── INIT ──
renderProducts(products);
