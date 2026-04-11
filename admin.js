// ── SUPABASE CONFIG ──
const SUPABASE_URL = "https://qzmgpbchdpzbbbmttlce.supabase.co";
const SUPABASE_KEY = "sb_publishable_gKH4tstG1WMkLQiJ0JzpTg__8D_ZUlH";
const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('topbarDate').textContent = new Date().toLocaleDateString('en-ZA', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
  loadAnalytics();
});

// ── NAVIGATION ──
function showSection(name) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
  document.getElementById(name + 'Section').classList.add('active');
  event.currentTarget.classList.add('active');
  document.getElementById('topbarTitle').textContent =
    name.charAt(0).toUpperCase() + name.slice(1);
  if (name === 'analytics') loadAnalytics();
  if (name === 'products') loadProducts();
  if (name === 'orders') loadOrders();
  if (name === 'users') loadUsers();
}

// ── ANALYTICS ──
async function loadAnalytics() {
  const [ordersRes, usersRes, productsRes, itemsRes] = await Promise.all([
    db.from('orders').select('*'),
    db.from('user_profiles').select('*'),
    db.from('products').select('*'),
    db.from('order_items').select('*'),
  ]);

  const orders = ordersRes.data || [];
  const users = usersRes.data || [];
  const products = productsRes.data || [];
  const items = itemsRes.data || [];

  // Stats
  const revenue = orders.reduce((s, o) => s + Number(o.total), 0);
  document.getElementById('totalRevenue').textContent = `$${revenue.toFixed(2)}`;
  document.getElementById('totalOrders').textContent = orders.length;
  document.getElementById('totalUsers').textContent = users.length;
  document.getElementById('totalProducts').textContent = products.length;

  // Best sellers
  const salesMap = {};
  items.forEach(item => {
    if (!salesMap[item.product_id]) salesMap[item.product_id] = { qty: 0, revenue: 0, name: item.product_name, price: item.price };
    salesMap[item.product_id].qty += item.qty;
    salesMap[item.product_id].revenue += item.price * item.qty;
  });
  const sorted = Object.entries(salesMap).sort((a, b) => b[1].revenue - a[1].revenue).slice(0, 5);
  const bsEl = document.getElementById('bestSellers');
  if (sorted.length === 0) {
    bsEl.innerHTML = `<div class="empty-state"><p>No sales data yet</p></div>`;
  } else {
    bsEl.innerHTML = sorted.map(([id, s]) => {
      const product = products.find(p => p.id == id);
      return `
        <div class="best-seller-item">
          <div class="bs-img">
            ${product ? `<img src="${product.image}" alt="${s.name}">` : ''}
          </div>
          <div>
            <div class="bs-name">${s.name}</div>
            <div class="bs-cat">${s.qty} sold</div>
          </div>
          <div class="bs-revenue">$${s.revenue.toFixed(2)}</div>
        </div>
      `;
    }).join('');
  }

  // Recent orders
  const recent = [...orders].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5);
  const roEl = document.getElementById('recentOrders');
  if (recent.length === 0) {
    roEl.innerHTML = `<div class="empty-state"><p>No orders yet</p></div>`;
  } else {
    roEl.innerHTML = recent.map(o => `
      <div class="recent-order-item">
        <div class="ro-id">#${o.id}</div>
        <div>
          <div class="ro-name">${o.full_name}</div>
          <div class="ro-email">${o.email}</div>
        </div>
        <div class="ro-total">$${Number(o.total).toFixed(2)}</div>
        <span class="badge badge-${o.status}">${o.status}</span>
      </div>
    `).join('');
  }
}

// ── PRODUCTS ──
async function loadProducts() {
  const { data, error } = await db.from('products').select('*').order('id');
  if (error) { showToast('Failed to load products'); return; }
  const tbody = document.getElementById('productsBody');
  if (!data.length) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:2rem;color:var(--muted);">No products found</td></tr>`;
    return;
  }
  tbody.innerHTML = data.map(p => `
    <tr>
      <td><div class="table-img"><img src="${p.image}" alt="${p.name}"></div></td>
      <td style="font-weight:500;color:var(--ink);">${p.name}</td>
      <td style="text-transform:capitalize;">${p.category}</td>
      <td>$${Number(p.price).toFixed(2)}${p.old_price ? `<br><span style="text-decoration:line-through;color:var(--muted);font-size:0.72rem;">$${p.old_price}</span>` : ''}</td>
      <td>${p.badge ? `<span class="badge badge-${p.badge}">${p.badge}</span>` : '—'}</td>
      <td>
        <div class="action-btns">
          <button class="btn-edit" onclick="openProductModal(${p.id})">Edit</button>
          <button class="btn-delete" onclick="deleteProduct(${p.id})">Delete</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function openProductModal(id = null) {
  document.getElementById('productModalTitle').textContent = id ? 'Edit Product' : 'Add Product';
  document.getElementById('editProductId').value = id || '';
  document.getElementById('productFormError').textContent = '';
  if (!id) {
    ['pName','pImage','pDesc','pSizes','pColors'].forEach(f => document.getElementById(f).value = '');
    ['pPrice','pOldPrice','pRating','pReviews'].forEach(f => document.getElementById(f).value = '');
    document.getElementById('pCategory').value = 'clothing';
    document.getElementById('pBadge').value = '';
  } else {
    loadProductForEdit(id);
  }
  document.getElementById('productOverlay').classList.add('open');
}

async function loadProductForEdit(id) {
  const { data } = await db.from('products').select('*').eq('id', id).single();
  if (!data) return;
  document.getElementById('pName').value = data.name || '';
  document.getElementById('pCategory').value = data.category || 'clothing';
  document.getElementById('pPrice').value = data.price || '';
  document.getElementById('pOldPrice').value = data.old_price || '';
  document.getElementById('pImage').value = data.image || '';
  document.getElementById('pBadge').value = data.badge || '';
  document.getElementById('pRating').value = data.rating || '';
  document.getElementById('pReviews').value = data.reviews || '';
  document.getElementById('pSizes').value = (data.sizes || []).join(',');
  document.getElementById('pColors').value = (data.colors || []).join(',');
  document.getElementById('pDesc').value = data.description || '';
}

async function saveProduct() {
  const id = document.getElementById('editProductId').value;
  const name = document.getElementById('pName').value.trim();
  const price = document.getElementById('pPrice').value;
  const errorEl = document.getElementById('productFormError');
  if (!name || !price) { errorEl.textContent = 'Name and price are required.'; return; }

  const payload = {
    name,
    category: document.getElementById('pCategory').value,
    price: parseFloat(price),
    old_price: document.getElementById('pOldPrice').value ? parseFloat(document.getElementById('pOldPrice').value) : null,
    image: document.getElementById('pImage').value.trim(),
    badge: document.getElementById('pBadge').value || null,
    rating: parseFloat(document.getElementById('pRating').value) || 0,
    reviews: parseInt(document.getElementById('pReviews').value) || 0,
    sizes: document.getElementById('pSizes').value.split(',').map(s => s.trim()).filter(Boolean),
    colors: document.getElementById('pColors').value.split(',').map(c => c.trim()).filter(Boolean),
    description: document.getElementById('pDesc').value.trim(),
  };

  let error;
  if (id) {
    ({ error } = await db.from('products').update(payload).eq('id', id));
  } else {
    ({ error } = await db.from('products').insert(payload));
  }

  if (error) { errorEl.textContent = error.message; return; }
  closeProductModalDirect();
  showToast(id ? '✅ Product updated!' : '✅ Product added!', 'gold');
  loadProducts();
}

async function deleteProduct(id) {
  if (!confirm('Are you sure you want to delete this product?')) return;
  const { error } = await db.from('products').delete().eq('id', id);
  if (error) { showToast('Failed to delete product'); return; }
  showToast('🗑️ Product deleted');
  loadProducts();
}

function closeProductModal(e) {
  if (e.target === document.getElementById('productOverlay')) closeProductModalDirect();
}

function closeProductModalDirect() {
  document.getElementById('productOverlay').classList.remove('open');
}

// ── ORDERS ──
async function loadOrders() {
  const { data, error } = await db.from('orders').select('*').order('created_at', { ascending: false });
  if (error) { showToast('Failed to load orders'); return; }
  const tbody = document.getElementById('ordersBody');
  if (!data.length) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:2rem;color:var(--muted);">No orders yet</td></tr>`;
    return;
  }
  tbody.innerHTML = data.map(o => `
    <tr>
      <td style="font-family:'DM Mono',monospace;font-size:0.72rem;color:var(--muted);">#${o.id}</td>
      <td style="font-weight:500;color:var(--ink);">${o.full_name}</td>
      <td style="color:var(--muted);font-size:0.78rem;">${o.email}</td>
      <td style="font-family:'Cormorant Garamond',serif;font-size:1.1rem;font-weight:600;">$${Number(o.total).toFixed(2)}</td>
      <td>
        <select class="status-select" onchange="updateOrderStatus(${o.id}, this.value)">
          <option value="pending" ${o.status==='pending'?'selected':''}>Pending</option>
          <option value="processing" ${o.status==='processing'?'selected':''}>Processing</option>
          <option value="shipped" ${o.status==='shipped'?'selected':''}>Shipped</option>
          <option value="delivered" ${o.status==='delivered'?'selected':''}>Delivered</option>
          <option value="cancelled" ${o.status==='cancelled'?'selected':''}>Cancelled</option>
        </select>
      </td>
      <td style="font-family:'DM Mono',monospace;font-size:0.7rem;color:var(--muted);">${new Date(o.created_at).toLocaleDateString()}</td>
      <td><span class="badge badge-${o.status}">${o.status}</span></td>
    </tr>
  `).join('');
}

async function updateOrderStatus(id, status) {
  const { error } = await db.from('orders').update({ status }).eq('id', id);
  if (error) { showToast('Failed to update order status'); return; }
  showToast(`✅ Order #${id} marked as ${status}`, 'gold');
  loadOrders();
}

// ── USERS ──
async function loadUsers() {
  const { data, error } = await db.from('user_profiles').select('*').order('created_at', { ascending: false });
  if (error) { showToast('Failed to load users'); return; }
  const tbody = document.getElementById('usersBody');
  if (!data.length) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:2rem;color:var(--muted);">No users yet</td></tr>`;
    return;
  }
  tbody.innerHTML = data.map(u => `
    <tr>
      <td><div class="table-avatar">${u.email ? u.email[0].toUpperCase() : '?'}</div></td>
      <td style="color:var(--ink);font-size:0.82rem;">${u.email}</td>
      <td>${u.full_name || '—'}</td>
      <td>${u.city || '—'}</td>
      <td>${u.country || '—'}</td>
      <td style="font-family:'DM Mono',monospace;font-size:0.7rem;color:var(--muted);">${new Date(u.created_at).toLocaleDateString()}</td>
    </tr>
  `).join('');
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