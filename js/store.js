// ===== STORE: Repositori Eksplisit (SOP/Regulasi) & Tasit (FAQ) =====

function renderStoreRepo() {
  return `
    <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <h2 class="text-lg font-bold mb-1 flex items-center gap-2">
        <i class="fas fa-database text-primary"></i> Repositori Pengetahuan
      </h2>
      <p class="text-xs text-slate-500 mb-4">Tahap STORE — aset pengetahuan tidak hilang saat pergantian pengurus.</p>
      <div class="space-y-3">
        ${knowledgeRepo.map(k => `
          <div class="border-l-4 border-primary bg-slate-50 rounded-r-xl p-3 cursor-pointer hover:bg-orange-50 transition" onclick="showToast('Membuka: ${k.judul}', 'info')">
            <div class="flex items-center gap-2 mb-1">
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${
                k.tipe === 'SOP' ? 'bg-blue-100 text-blue-700' :
                k.tipe === 'Regulasi' ? 'bg-purple-100 text-purple-700' :
                'bg-green-100 text-green-700'
              }">${k.tipe}</span>
              <span class="text-[10px] text-slate-400">${k.tanggal}</span>
            </div>
            <p class="font-semibold text-sm">${k.judul}</p>
            <p class="text-xs text-slate-500 mt-0.5 line-clamp-2">${k.deskripsi}</p>
          </div>
        `).join('')}
      </div>
      <button onclick="addRepoPrompt()" class="w-full mt-4 py-2.5 rounded-xl border-2 border-dashed border-slate-200 text-slate-500 text-sm font-semibold hover:border-primary hover:text-primary transition">
        <i class="fas fa-plus mr-1"></i> Tambah Dokumen
      </button>
    </div>
  `;
}

function addRepoPrompt() {
  const judul = prompt('Judul dokumen:');
  if (!judul) return;
  const tipe = prompt('Tipe (SOP / Regulasi / Tasit/FAQ):', 'SOP') || 'SOP';
  knowledgeRepo.unshift({
    id: tipe.toUpperCase().slice(0,3) + '-' + Date.now(),
    judul, tipe, tanggal: 'Hari ini', deskripsi: 'Dokumen baru ditambahkan.'
  });
  saveAll();
  showToast('Dokumen tersimpan di repositori');
  render();
}