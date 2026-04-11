// ── SUPABASE CONFIG ──
const SUPABASE_URL = "https://qzmgpbchdpzbbbmttlce.supabase.co";
const SUPABASE_KEY = "sb_publishable_gKH4tstG1WMkLQiJ0JzpTg__8D_ZUlH";
const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'byoki-auth-token'
  }
});

let currentUser = null;
let cart = [];
let orderDetails = {};

// ── INIT ──
document.addEventListener('DOMContentLoaded', async () => {
  // Load cart from localStorage
  const saved = localStorage.getItem('byoki-cart');
  if (saved) cart = JSON.parse(saved);

  // Check session
  const { data: { session } } = await db.auth.getSession();
  if (!session) {
    document.getElementById('checkoutLayout').style.display = 'none';
    document.getElementById('notSignedIn').style.display = 'block';
    return;
  }

  currentUser = session.user;

  if (cart.length === 0) {
    document.getElementById('checkoutLayout').style.display = 'none';
    document.getElementById('emptyCart').style.display = 'block';
    return;
  }

  document.getElementById('checkoutLayout').style.display = 'grid';
  renderSummary();
  prefillDetails();
});

// ── PREFILL FROM PROFILE ──
async function prefillDetails() {
  const { data } = await db.from('user_profiles').select('*').eq('id', currentUser.id).single();
  if (!data) return;
  if (data.full_name) document.getElementById('fullName').value = data.full_name;
  if (data.phone) document.getElementById('phone').value = data.phone;
  if (data.address) document.getElementById('address').value = data.address;
  if (data.city) document.getElementById('city').value = data.city;
  if (data.country) document.getElementById('country').value = data.country;
  document.getElementById('email').value = currentUser.email;
}

// ── RENDER SUMMARY ──
function renderSummary() {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  document.getElementById('summarySubtotal').textContent = `$${total.toFixed(2)}`;
  document.getElementById('summaryTotal').textContent = `$${total.toFixed(2)}`;
  document.getElementById('summaryItems').innerHTML = cart.map(item => `
    <div class="summary-item">
      <div class="summary-item-img">
        <img src="${item.Image}" alt="${item.name}">
      </div>
      <div style="flex:1;">
        <div class="summary-item-name">${item.name}</div>
        <div class="summary-item-qty">Qty: ${item.qty}</div>
      </div>
      <div class="summary-item-price">$${(item.price * item.qty).toFixed(2)}</div>
    </div>
  `).join('');
}

// ── STEP 1 → STEP 2 ──
function goToReview() {
  const fullName = document.getElementById('fullName').value.trim();
  const email = document.getElementById('email').value.trim();
  const address = document.getElementById('address').value.trim();
  const city = document.getElementById('city').value.trim();
  const country = document.getElementById('country').value.trim();
  const errorEl = document.getElementById('detailsError');

  if (!fullName || !email || !address || !city || !country) {
    errorEl.textContent = 'Please fill in all required fields.';
    return;
  }

  orderDetails = {
    fullName,
    email,
    address,
    city,
    country,
    phone: document.getElementById('phone').value.trim(),
    postalCode: document.getElementById('postalCode').value.trim(),
  };

  // Render review
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  document.getElementById('reviewItems').innerHTML = cart.map(item => `
    <div class="review-item">
      <div class="review-item-img"><img src="${item.Image}" alt="${item.name}"></div>
      <div style="flex:1;">
        <div class="review-item-name">${item.name}</div>
        <div class="review-item-size">Size: ${item.selectedSize || 'N/A'}</div>
        <div class="review-item-qty">Qty: ${item.qty}</div>
      </div>
      <div class="review-item-price">$${(item.price * item.qty).toFixed(2)}</div>
    </div>
  `).join('');

  document.getElementById('reviewAddress').innerHTML = `
    <p>${orderDetails.fullName}</p>
    <p>${orderDetails.address}, ${orderDetails.city}, ${orderDetails.country}</p>
    <p>${orderDetails.email}</p>
    ${orderDetails.phone ? `<p>${orderDetails.phone}</p>` : ''}
  `;

  // Switch steps
  document.getElementById('detailsStep').style.display = 'none';
  document.getElementById('reviewStep').style.display = 'block';

  // Update step indicators
  document.getElementById('step1').classList.remove('active');
  document.getElementById('step1').classList.add('completed');
  document.getElementById('step2').classList.add('active');

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goToDetails() {
  document.getElementById('reviewStep').style.display = 'none';
  document.getElementById('detailsStep').style.display = 'block';
  document.getElementById('step2').classList.remove('active');
  document.getElementById('step1').classList.remove('completed');
  document.getElementById('step1').classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── PLACE ORDER ──
async function placeOrder() {
  const errorEl = document.getElementById('reviewError');
  const btn = document.querySelector('#reviewStep .btn-primary');
  btn.textContent = 'Placing order…';
  btn.disabled = true;

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  // Insert order
  const { data: order, error: orderError } = await db.from('orders').insert({
    user_id: currentUser.id,
    email: orderDetails.email,
    full_name: orderDetails.fullName,
    address: orderDetails.address,
    city: orderDetails.city,
    country: orderDetails.country,
    total: total,
    status: 'pending'
  }).select().single();

  if (orderError) {
    errorEl.textContent = 'Failed to place order. Please try again.';
    btn.textContent = 'Place Order';
    btn.disabled = false;
    return;
  }

  // Insert order items
  const items = cart.map(item => ({
    order_id: order.id,
    product_id: item.id,
    product_name: item.name,
    price: item.price,
    qty: item.qty
  }));

  const { error: itemsError } = await db.from('order_items').insert(items);

  if (itemsError) {
    errorEl.textContent = 'Order saved but items failed. Contact support.';
    btn.textContent = 'Place Order';
    btn.disabled = false;
    return;
  }

  // Clear cart
  localStorage.removeItem('byoki-cart');

  // Show confirmation
  document.getElementById('reviewStep').style.display = 'none';
  document.getElementById('confirmStep').style.display = 'block';
  document.getElementById('confirmOrderId').textContent = `Order #${order.id}`;

  document.getElementById('step2').classList.remove('active');
  document.getElementById('step2').classList.add('completed');
  document.getElementById('step3').classList.add('active');

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── TOAST ──
let toastTimer;
function showToast(msg, type = '') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast show' + (type ? ' ' + type : '');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.classList.remove('show'); }, 2800);
}