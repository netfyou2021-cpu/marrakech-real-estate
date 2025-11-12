// Admin UI for listings and i18n
const API = '/api';
const DEFAULT_TOKEN = process.env.ADMIN_TOKEN || 'dev-token';

async function getListings(){
  const res = await fetch(`${API}/listings?perPage=200`);
  if(!res.ok) throw new Error('failed');
  const j = await res.json();
  return j.listings || [];
}

function renderListings(rows){
  const root = document.getElementById('listings-root');
  root.innerHTML = '';
  rows.forEach(r=>{
    const div = document.createElement('div');
    div.className = 'listing-row';
    div.innerHTML = `
      <img src="${r.images && r.images[0] ? r.images[0] : 'https://via.placeholder.com/160x120?text=No+Image'}" />
      <div style="flex:1">
        <strong>${r.title}</strong>
        <div style="font-size:0.9rem;color:#666">${r.location || ''} · ${r.type} · ${r.action} · ${r.priceText || r.price}</div>
      </div>
      <div class="listing-actions">
        <button data-id="${r.id}" class="edit">Edit</button>
        <button data-id="${r.id}" class="del">Delete</button>
      </div>
    `;
    root.appendChild(div);
  });
  root.querySelectorAll('button.edit').forEach(b=>b.addEventListener('click', async (e)=>{
    const id = e.currentTarget.getAttribute('data-id');
    const resp = await fetch(`${API}/listings/${id}`);
    if(!resp.ok) return alert('not found');
    const obj = await resp.json();
    fillForm(obj);
  }));
  root.querySelectorAll('button.del').forEach(b=>b.addEventListener('click', async (e)=>{
    if(!confirm('Delete listing?')) return;
    const id = e.currentTarget.getAttribute('data-id');
    try{
      const token = document.getElementById('admin-token').value || DEFAULT_TOKEN;
      const res = await fetch(`${API}/listings/${id}`,{method:'DELETE',headers:{'x-admin-token':token}});
      if(res.ok){ alert('Deleted'); loadListings(); }
      else alert('Delete failed');
    }catch(err){ alert(err.message); }
  }));
}

function fillForm(obj){
  document.getElementById('listing-id').value = obj.id||'';
  document.getElementById('listing-title').value = obj.title||'';
  document.getElementById('listing-type').value = obj.type||'';
  document.getElementById('listing-action').value = obj.action||'';
  document.getElementById('listing-price').value = obj.price||'';
  document.getElementById('listing-priceText').value = obj.priceText||'';
  document.getElementById('listing-location').value = obj.location||'';
  document.getElementById('listing-rooms').value = obj.rooms||'';
  document.getElementById('listing-surface').value = obj.surface||'';
  document.getElementById('listing-images').value = (obj.images||[]).join(', ');
  document.getElementById('listing-description').value = obj.description||'';
}

function clearForm(){
  document.getElementById('listing-form').reset();
  document.getElementById('listing-id').value = '';
  document.getElementById('listing-status').textContent = '';
}

async function saveListing(){
  const id = document.getElementById('listing-id').value;
  const payload = {
    title: document.getElementById('listing-title').value,
    type: document.getElementById('listing-type').value,
    action: document.getElementById('listing-action').value,
    price: Number(document.getElementById('listing-price').value)||0,
    priceText: document.getElementById('listing-priceText').value,
    location: document.getElementById('listing-location').value,
    rooms: Number(document.getElementById('listing-rooms').value)||0,
    surface: Number(document.getElementById('listing-surface').value)||0,
    images: document.getElementById('listing-images').value.split(',').map(s=>s.trim()).filter(Boolean),
    description: document.getElementById('listing-description').value
  };
  const token = document.getElementById('admin-token').value || DEFAULT_TOKEN;
  try{
    let res;
    if(id){
      res = await fetch(`${API}/listings/${id}`,{method:'PUT',headers:{'Content-Type':'application/json','x-admin-token':token},body:JSON.stringify(payload)});
    } else {
      res = await fetch(`${API}/listings`,{method:'POST',headers:{'Content-Type':'application/json','x-admin-token':token},body:JSON.stringify(payload)});
    }
    if(!res.ok){ const text = await res.text(); document.getElementById('listing-status').textContent='Error: '+text; return; }
    const data = await res.json();
    document.getElementById('listing-status').textContent = 'Saved: ' + (data.id || 'ok');
    await loadListings();
    clearForm();
  }catch(err){ document.getElementById('listing-status').textContent = err.message }
}

async function loadListings(){
  try{
    const rows = await getListings();
    renderListings(rows);
  }catch(err){ document.getElementById('listings-root').textContent = 'Error loading: '+err.message }
}

// i18n
async function loadI18n(){
  try{
    const res = await fetch(`${API}/i18n`);
    if(!res.ok) throw new Error('no');
    const j = await res.json();
    document.getElementById('i18n-editor').value = JSON.stringify(j,null,2);
    document.getElementById('i18n-status').textContent = 'Loaded';
  }catch(e){ document.getElementById('i18n-status').textContent = 'Error: '+e.message }
}

async function saveI18n(){
  try{
    const payload = JSON.parse(document.getElementById('i18n-editor').value);
    const token = document.getElementById('admin-token').value || DEFAULT_TOKEN;
    const res = await fetch(`${API}/i18n`,{method:'POST',headers:{'Content-Type':'application/json','x-admin-token':token},body:JSON.stringify(payload)});
    const j = await res.json();
    document.getElementById('i18n-status').textContent = 'Saved';
  }catch(e){ document.getElementById('i18n-status').textContent = 'Error: '+e.message }
}

// wire
window.addEventListener('load', ()=>{
  document.getElementById('reload-listings').addEventListener('click', loadListings);
  document.getElementById('save-listing').addEventListener('click', saveListing);
  document.getElementById('delete-listing').addEventListener('click', async ()=>{
    const id = document.getElementById('listing-id').value; if(!id) return alert('No id');
    if(!confirm('Delete listing?')) return;
    const token = document.getElementById('admin-token').value || DEFAULT_TOKEN;
    const res = await fetch(`${API}/listings/${id}`,{method:'DELETE',headers:{'x-admin-token':token}});
    if(res.ok){ alert('Deleted'); loadListings(); clearForm(); } else alert('Delete failed');
  });
  document.getElementById('clear-form').addEventListener('click', clearForm);
  document.getElementById('load-i18n').addEventListener('click', loadI18n);
  document.getElementById('save-i18n').addEventListener('click', saveI18n);
  loadListings();
  loadI18n();
});
