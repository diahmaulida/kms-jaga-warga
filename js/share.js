// ===== SHARE: Broadcast & Papan Informasi Digital =====

function renderShareBroadcast(user) {
  const list = broadcastList.filter(b => b.rw === user.rw);
  return `
    <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <h2 class="text-xl font-bold mb-1 flex items-center gap-2">
        <i class="fas fa-tower-broadcast text-primary"></i> Broadcast Notifikasi
      </h2>
      <p class="text-sm text-slate-500 mb-4">Tahap SHARE — sebar maklumat serentak ke smartphone warga ${user.rw}.</p>
      <div class="flex gap-2 mb-4">
        <input id="broadcastInput" type="text" placeholder="Tulis pengumuman..." class="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:border-primary outline-none text-sm">
        <button onclick="sendBroadcast()" class="px-5 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-dark">
          <i class="fas fa-paper-plane"></i>
        </button>
      </div>
      <div class="space-y-3">
        ${list.slice(0,5).map(b => `
          <div class="flex items-start gap-3 bg-slate-50 rounded-xl p-3">
            <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white text-xs flex-shrink-0">
              <i class="fas fa-bullhorn"></i>
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-sm">${b.judul}</p>
              <p class="text-xs text-slate-500 truncate">${b.pesan}</p>
            </div>
            <span class="text-[10px] text-slate-400 flex-shrink-0">${b.tanggal}</span>
          </div>
        `).join('')}
        ${list.length === 0 ? '<p class="text-center text-slate-400 py-6 text-sm">Belum ada pengumuman.</p>' : ''}
      </div>
    </div>
  `;
}

function renderPapanInformasi(user) {
  const list = broadcastList.filter(b => b.rw === user.rw);
  return `
    <div class="fade-in">
      <h2 class="text-2xl font-bold mb-1">Papan Informasi Digital</h2>
      <p class="text-slate-500 mb-6 text-sm">Tahap SHARE — akses SOP & regulasi ${user.rw} secara mandiri, kapan saja.</p>
      <div class="grid sm:grid-cols-2 gap-4 mb-6">
        ${list.map(b => `
          <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-10 h-10 bg-primary-soft rounded-xl flex items-center justify-center text-primary">
                <i class="fas fa-bullhorn"></i>
              </div>
              <div>
                <h3 class="font-bold">${b.judul}</h3>
                <p class="text-xs text-slate-400">${b.tanggal}</p>
              </div>
            </div>
            <p class="text-sm text-slate-600">${b.pesan}</p>
          </div>
        `).join('')}
      </div>
      ${renderStoreRepo()}
    </div>
  `;
}

function sendBroadcast() {
  const user = getCurrentUser();
  const input = document.getElementById('broadcastInput');
  if (!input.value.trim()) { showToast('Tulis pesan dulu', 'warn'); return; }
  broadcastList.unshift({
    id: Date.now(), judul: 'Pengumuman Terbaru',
    pesan: input.value, tanggal: 'Hari ini', rw: user.rw
  });
  saveAll();
  showToast('Broadcast terkirim!');
  render();
}