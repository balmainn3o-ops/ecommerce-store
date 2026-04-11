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

// ── INIT ──
document.addEventListener('DOMContentLoaded', async () => {
  const { data: { session } } = await db.auth.getSession();
  if (!session) {
    document.querySelector('.account-layout').style.display = 'none';
    document.getElementById('notLoggedIn').style.display = 'flex';
    return;
  }
  currentUser = session.user;
  initPage();
});

db.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT') {
    window.location.href = 'ecommerce-store.html';
  }
  if (event === 'SIGNED_IN' && session?.user) {
    currentUser = session.user;
  }
});

async function initPage() {
  // Sidebar info
  document.getElementById('sidebarEmail').textContent = currentUser.email;
  document.getElementById('sidebarAvatar').textContent = currentUser.email[0].toUpperCase();
  document.getElementById('sidebarJoined').textContent = 'Joined ' + new Date(currentUser.created_at).toLocaleDateString('en-ZA', { year: 'numeric', month: 'long' });
  document.getElementById('profileEmail').value = currentUser.email;

  await loadProfile();
  await loadOrders();
}

// ── TABS ──
function showTab(name, btn) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.account-nav-item').forEach(b => b.classList.remove('active'));
  document.getElementById(name + 'Tab').classList.add('active');
  btn.classList.add('active');
}

// ── PROFILE ──
async function loadProfile() {
  const { data, error } = await db.from('user_profiles').select('*').eq('id', currentUser.id).single();
  if (error || !data) return;
  if (data.full_name) document.getElementById('fullName').value = data.full_name;
  if (data.phone) document.getElementById('phone').value = data.phone;
  if (data.address) document.getElementById('address').value = data.address;
  if (data.city) document.getElementById('city').value = data.city;
  if (data.country) document.getElementById('country').value = data.country;
}

async function saveProfile() {
  const msgEl = document.getElementById('profileMsg');
  const payload = {
    full_name: document.getElementById('fullName').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    address: document.getElementById('address').value.trim(),
    city: document.getElementById('city').value.trim(),
    country: document.getElementById('country').value.trim(),
    updated_at: new Date().toISOString(),
  };

  const { error } = await db.from('user_profiles').update(payload).eq('id', currentUser.id);
  if (error) {
    msgEl.className = 'form-msg error';
    msgEl.textContent = 'Failed to save — ' + error.message;
  } else {
    msgEl.className = 'form-msg success';
    msgEl.textContent = '✅ Profile saved successfully!';
    showToast('✅ Profile updated!', 'gold');
    setTimeout(() => { msgEl.textContent = ''; }, 3000);
  }
}

// ── ORDERS ──
async function loadOrders() {
  const { data: orders, error } = await db
    .from('orders')
    .select('*')
    .eq('user_id', currentUser.id)
    .order('created_at', { ascending: false });

  const container = document.getElementById('ordersList');

  if (error || !orders || orders.length === 0) {
    container.innerHTML = `
      <div class="empty-orders">
        <div style="font-size:3rem;margin-bottom:1rem;">📦</div>
        <p>You haven't placed any orders yet.</p>
        <a href="ecommerce-store.html" class="btn-primary" style="display:inline-block;text-decoration:none;">Start Shopping</a>
      </div>`;
    return;
  }

  const orderIds = orders.map(o => o.id);
  const { data: allItems } = await db
    .from('order_items')
    .select('*')
    .in('order_id', orderIds);

  container.innerHTML = orders.map(order => {
    const items = (allItems || []).filter(i => i.order_id === order.id);
    return `
      <div class="order-card">
        <div class="order-card-header">
          <div>
            <div class="order-id">Order #${order.id}</div>
            <div class="order-date">${new Date(order.created_at).toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
          </div>
          <div class="order-total">$${Number(order.total).toFixed(2)}</div>
          <span class="order-status status-${order.status}">${order.status}</span>
        </div>
        <div class="order-items">
          ${items.length > 0 ? items.map(item => `
            <div class="order-item">
              <div>
                <div class="order-item-name">${item.product_name}</div>
                <div class="order-item-qty">Qty: ${item.qty}</div>
              </div>
              <div class="order-item-price">$${Number(item.price * item.qty).toFixed(2)}</div>
            </div>
          `).join('') : '<p style="font-size:0.78rem;color:var(--muted);">No items found</p>'}
        </div>
        <div class="order-address">
          📍 ${order.address}, ${order.city}, ${order.country}
        </div>
      </div>
    `;
  }).join('');
}

// ── CHANGE PASSWORD ──
async function changePassword() {
  const newPass = document.getElementById('newPassword').value;
  const confirmPass = document.getElementById('confirmPassword').value;
  const msgEl = document.getElementById('passwordMsg');

  if (!newPass || !confirmPass) {
    msgEl.className = 'form-msg error';
    msgEl.textContent = 'Please fill in both fields.';
    return;
  }
  if (newPass.length < 6) {
    msgEl.className = 'form-msg error';
    msgEl.textContent = 'Password must be at least 6 characters.';
    return;
  }
  if (newPass !== confirmPass) {
    msgEl.className = 'form-msg error';
    msgEl.textContent = 'Passwords do not match.';
    return;
  }

  const { error } = await db.auth.updateUser({ password: newPass });
  if (error) {
    msgEl.className = 'form-msg error';
    msgEl.textContent = error.message;
  } else {
    msgEl.className = 'form-msg success';
    msgEl.textContent = '✅ Password updated successfully!';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';
    showToast('🔒 Password updated!', 'gold');
    setTimeout(() => { msgEl.textContent = ''; }, 3000);
  }
}

// ── DELETE ACCOUNT ──
async function confirmDeleteAccount() {
  const confirmed = confirm('Are you absolutely sure? This will permanently delete your account and all your data.');
  if (!confirmed) return;
  await db.from('user_profiles').delete().eq('id', currentUser.id);
  await db.auth.signOut();
  window.location.href = 'ecommerce-store.html';
}

// ── SIGN OUT ──
async function handleSignOut() {
  await db.auth.signOut();
  window.location.href = 'ecommerce-store.html';
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