// ===== APP: Router & Render Utama =====

let currentSubTab = 'form';

function showToast(msg, icon = 'check') {
  const t = document.getElementById('toast');
  const map = { check:'fa-circle-check text-green-400', info:'fa-circle-info text-blue-400', warn:'fa-triangle-exclamation text-yellow-400' };
  t.querySelector('i').className = 'fas ' + (map[icon] || map.check);
  document.getElementById('toastMsg').textContent = msg;
  t.classList.remove('hidden'); t.classList.add('flex');
  setTimeout(() => { t.classList.add('hidden'); t.classList.remove('flex'); }, 2500);
}

function openModal(title, body, cb) {
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalBody').textContent = body;
  const m = document.getElementById('modal');
  m.classList.remove('hidden'); m.classList.add('flex');
  const btn = document.getElementById('modalConfirmBtn');
  const n = btn.cloneNode(true);
  btn.parentNode.replaceChild(n, btn);
  n.addEventListener('click', () => { cb(); closeModal(); });
}

function closeModal() {
  const m = document.getElementById('modal');
  m.classList.add('hidden'); m.classList.remove('flex');
}

function badgeStatus(s) {
  const map = {
    'Diterima':'bg-amber-100 text-amber-700',
    'Diverifikasi RT':'bg-blue-100 text-blue-700',
    'Ditangani':'bg-indigo-100 text-indigo-700',
    'Selesai':'bg-green-100 text-green-700'
  };
  return `<span class="px-3 py-1 rounded-full text-[11px] font-bold uppercase ${map[s]||'bg-slate-100 text-slate-600'}">${s}</span>`;
}

function badgeUrgensi(u) {
  const map = { Rendah:'bg-slate-100 text-slate-600', Sedang:'bg-orange-100 text-orange-700', Tinggi:'bg-red-100 text-red-700' };
  return `<span class="px-2.5 py-1 rounded-full text-[11px] font-bold ${map[u]||''}">${u}</span>`;
}

function setSubTab(tab) { currentSubTab = tab; render(); }

function render() {
  const user = getCurrentUser();
  if (!user) return;
  const main = document.getElementById('mainContent');
  if (user.role === 'warga') main.innerHTML = renderWarga(user);
  else if (user.role === 'rt') main.innerHTML = renderRT(user);
  else main.innerHTML = renderRW(user);
}

// ===== WARGA =====
function renderWarga(user) {
  const tabs = [
    { id:'form', label:'Buat Laporan', icon:'fa-pen-to-square' },
    { id:'tracking', label:'Status Laporan', icon:'fa-magnifying-glass-chart' },
    { id:'info', label:'Papan Informasi', icon:'fa-bullhorn' }
  ];
  let content = '';
  if (currentSubTab === 'form') content = renderCaptureForm(user);
  else if (currentSubTab === 'tracking') content = renderRealTimeTracking(user);
  else content = renderPapanInformasi(user);

  return `
    <div class="flex gap-2 mb-6 overflow-x-auto scrollbar-hide">
      ${tabs.map(t => `
        <button onclick="setSubTab('${t.id}')" class="whitespace-nowrap flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition ${
          currentSubTab === t.id ? 'bg-primary text-white shadow-lg shadow-orange-200' : 'bg-white border border-slate-200 text-slate-600 hover:bg-primary-soft'
        }"><i class="fas ${t.icon}"></i> ${t.label}</button>
      `).join('')}
    </div>
    ${content}
  `;
}

// ===== RT =====
function renderRT(user) {
  const my = reports.filter(r => r.rt === user.rt);
  return `
    <div class="fade-in">
      <div class="bg-gradient-to-r from-primary to-orange-500 rounded-2xl p-5 mb-6 text-white">
        <h2 class="font-bold text-xl"><i class="fas fa-house-chimney-user"></i> Dashboard ${user.rt}</h2>
        <p class="text-orange-50 text-sm mt-1">Tahap STORE & verifikasi awal — ${user.rw}</p>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        ${[
          { label:'Total', v:my.length, c:'bg-orange-100 text-orange-600', i:'fa-file-lines' },
          { label:'Menunggu', v:my.filter(r=>r.status==='Diterima').length, c:'bg-amber-100 text-amber-600', i:'fa-clock' },
          { label:'Ditangani', v:my.filter(r=>r.status==='Ditangani').length, c:'bg-indigo-100 text-indigo-600', i:'fa-screwdriver-wrench' },
          { label:'Selesai', v:my.filter(r=>r.status==='Selesai').length, c:'bg-green-100 text-green-600', i:'fa-circle-check' }
        ].map(s => `
          <div class="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <div class="w-9 h-9 rounded-lg ${s.c} flex items-center justify-center mb-2"><i class="fas ${s.i}"></i></div>
            <p class="text-2xl font-extrabold">${s.v}</p>
            <p class="text-xs text-slate-500">${s.label}</p>
          </div>
        `).join('')}
      </div>

      <div class="bg-gradient-to-r from-primary to-orange-500 rounded-2xl p-5 mb-6 flex flex-wrap items-center justify-between gap-4 shadow-lg">
        <div class="text-white">
          <h3 class="font-bold text-lg"><i class="fas fa-people-arrows"></i> Proxy Reporting</h3>
          <p class="text-sm text-orange-50 mt-1">Input laporan lisan dari lansia/tanpa smartphone.</p>
        </div>
        <button onclick="proxyReport()" class="bg-white text-primary-dark font-bold px-5 py-3 rounded-xl hover:bg-orange-50">
          <i class="fas fa-plus mr-2"></i> Input
        </button>
      </div>

      <h2 class="text-xl font-bold mb-4">Laporan Masuk — ${user.rt}</h2>
      <div class="space-y-4">
        ${my.map(r => `
          <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <div class="flex flex-wrap justify-between items-start gap-3 mb-3">
              <div class="flex-1 min-w-[200px]">
                <div class="flex items-center gap-2 flex-wrap mb-1">
                  <h3 class="font-bold text-lg">${r.judul}</h3>
                  ${r.anonim ? '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700"><i class="fas fa-user-secret"></i> ANONIM</span>' : ''}
                </div>
                <p class="text-xs text-slate-500">${r.id} · ${r.pelapor} · ${r.tanggal}</p>
              </div>
              <div class="flex items-center gap-2">${badgeUrgensi(r.urgensi)} ${badgeStatus(r.status)}</div>
            </div>
            <p class="text-sm text-slate-600 mb-4">${r.deskripsi}</p>
            <div class="flex flex-wrap gap-2 pt-3 border-t border-slate-100">
              ${r.status === 'Diterima' ? `
                <button onclick="verifyReport('${r.id}')" class="px-4 py-2 rounded-xl bg-blue-500 text-white text-sm font-semibold"><i class="fas fa-check"></i> Verifikasi</button>
                <button onclick="escalateReport('${r.id}')" class="px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold"><i class="fas fa-arrow-up"></i> Eskalasi RW</button>
              ` : ''}
              ${r.status === 'Diverifikasi RT' ? `
                <button onclick="handleReport('${r.id}')" class="px-4 py-2 rounded-xl bg-indigo-500 text-white text-sm font-semibold"><i class="fas fa-screwdriver-wrench"></i> Tangani</button>
                <button onclick="escalateReport('${r.id}')" class="px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold"><i class="fas fa-arrow-up"></i> Eskalasi RW</button>
              ` : ''}
              ${r.status === 'Ditangani' ? `<button onclick="finishReport('${r.id}')" class="px-4 py-2 rounded-xl bg-green-500 text-white text-sm font-semibold"><i class="fas fa-check-double"></i> Selesai</button>` : ''}
              ${r.status === 'Selesai' ? '<span class="text-sm text-green-600 font-semibold"><i class="fas fa-circle-check"></i> Selesai</span>' : ''}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function verifyReport(id){ const r=reports.find(x=>x.id===id); if(r){r.status='Diverifikasi RT'; saveAll(); showToast('Terverifikasi'); render();} }
function escalateReport(id){ const r=reports.find(x=>x.id===id); if(r){r.status='Diverifikasi RT'; r.eskalasi=true; saveAll(); showToast('Dieskalasi ke RW','info'); render();} }
function handleReport(id){ const r=reports.find(x=>x.id===id); if(r){r.status='Ditangani'; saveAll(); showToast('Ditangani'); render();} }
function finishReport(id){ const r=reports.find(x=>x.id===id); if(r){r.status='Selesai'; saveAll(); showToast('Selesai','check'); render();} }

function proxyReport() {
  const judul = prompt('Judul laporan (dari warga):');
  if (!judul) return;
  const user = getCurrentUser();
  reports.unshift({
    id:'RPT-'+String(reports.length+1).padStart(3,'0'),
    judul, kategori:'Sosial', urgensi:'Sedang', status:'Diterima',
    anonim:false, pelapor:user.name+' (Proxy)', tanggal:'Hari ini',
    rt:user.rt, rw:user.rw, deskripsi:'Input via proxy reporting.', eskalasi:false
  });
  saveAll();
  showToast('Laporan proxy tersimpan');
  render();
}

// ===== RW =====
function renderRW(user) {
  const rwRep = reports.filter(r => r.rw === user.rw);
  const escal = rwRep.filter(r => r.eskalasi || r.status === 'Diverifikasi RT');
  return `
    <div class="fade-in">
      <div class="bg-gradient-to-r from-primary to-orange-500 rounded-2xl p-5 mb-6 text-white">
        <h2 class="font-bold text-xl"><i class="fas fa-building-flag"></i> Dashboard ${user.rw}</h2>
        <p class="text-orange-50 text-sm mt-1">Tahap STORE, SHARE & APPLY — monitoring seluruh RT</p>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        ${[
          { label:'Total', v:rwRep.length, c:'bg-orange-100 text-orange-600', i:'fa-file-lines' },
          { label:'Eskalasi', v:escal.length, c:'bg-red-100 text-red-600', i:'fa-arrow-up' },
          { label:'Selesai', v:rwRep.filter(r=>r.status==='Selesai').length, c:'bg-green-100 text-green-600', i:'fa-circle-check' },
          { label:'Avg Respons', v:'2.4h', c:'bg-blue-100 text-blue-600', i:'fa-clock' }
        ].map(s => `
          <div class="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <div class="w-9 h-9 rounded-lg ${s.c} flex items-center justify-center mb-2"><i class="fas ${s.i}"></i></div>
            <p class="text-2xl font-extrabold">${s.v}</p>
            <p class="text-xs text-slate-500">${s.label}</p>
          </div>
        `).join('')}
      </div>

      <div class="grid lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 class="text-xl font-bold mb-1"><i class="fas fa-inbox text-primary"></i> Laporan Eskalasi</h2>
            <p class="text-sm text-slate-500 mb-4">Dari RT di ${user.rw}.</p>
            <div class="space-y-3">
              ${escal.length === 0 ? '<p class="text-center py-8 text-slate-400 text-sm">Tidak ada eskalasi.</p>' : ''}
              ${escal.map(r => `
                <div class="border border-slate-100 rounded-xl p-4">
                  <div class="flex justify-between items-start gap-2 mb-2">
                    <div>
                      <h3 class="font-bold">${r.judul}</h3>
                      <p class="text-xs text-slate-500">${r.id} · ${r.rt} · ${r.tanggal}</p>
                    </div>
                    ${badgeStatus(r.status)}
                  </div>
                  <p class="text-sm text-slate-600 mb-3">${r.deskripsi}</p>
                  <button onclick="showToast('Ditindaklanjuti ${user.rw}')" class="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold">
                    <i class="fas fa-play"></i> Tindak Lanjut
                  </button>
                </div>
              `).join('')}
            </div>
          </div>
          ${renderShareBroadcast(user)}
        </div>
        <div class="space-y-6">
          ${renderAnalytics(user)}
          ${renderStoreRepo()}
        </div>
      </div>
    </div>
  `;
}

// Init: auto login jika ada sesi
window.addEventListener('DOMContentLoaded', () => {
  const user = getCurrentUser();
  if (user) doLogin(user);
});