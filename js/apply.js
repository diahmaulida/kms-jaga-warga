// ===== APPLY: Monitoring & Analytics =====

function renderRealTimeTracking(user) {
  const my = reports.filter(r => !r.anonim && r.rt === user.rt);
  return `
    <div class="fade-in">
      <h2 class="text-2xl font-bold mb-1">Real-Time Tracking</h2>
      <p class="text-slate-500 mb-6 text-sm">Tahap APPLY — transparansi status laporan Anda.</p>
      <div class="space-y-4">
        ${my.map(r => `
          <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 border-l-4 ${
            r.status === 'Selesai' ? 'border-l-green-500' :
            r.status === 'Ditangani' ? 'border-l-indigo-500' :
            r.status === 'Diverifikasi RT' ? 'border-l-blue-500' : 'border-l-amber-500'
          }">
            <div class="flex flex-wrap justify-between items-start gap-3 mb-3">
              <div>
                <h3 class="font-bold text-lg">${r.judul}</h3>
                <p class="text-xs text-slate-500">${r.tanggal} · ${r.kategori}</p>
              </div>
              ${badgeStatus(r.status)}
            </div>
            <div class="flex items-center gap-2 mt-4">
              ${['Diterima','Diverifikasi RT','Ditangani','Selesai'].map((s, i) => {
                const steps = ['Diterima','Diverifikasi RT','Ditangani','Selesai'];
                const idx = steps.indexOf(r.status);
                const active = i <= idx;
                return `
                  <div class="flex-1 flex items-center">
                    <div class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      active ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'
                    }">${active ? '<i class="fas fa-check"></i>' : i+1}</div>
                    ${i < 3 ? `<div class="flex-1 h-0.5 ${i < idx ? 'bg-primary' : 'bg-slate-200'} mx-1"></div>` : ''}
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        `).join('')}
        ${my.length === 0 ? '<div class="text-center py-12 text-slate-400"><i class="fas fa-inbox text-4xl mb-3"></i><p>Belum ada laporan.</p></div>' : ''}
      </div>
    </div>
  `;
}

function renderAnalytics(user) {
  const scope = user.role === 'rw' ? reports.filter(r => r.rw === user.rw) : reports.filter(r => r.rt === user.rt);
  const total = scope.length;
  const selesai = scope.filter(r => r.status === 'Selesai').length;
  const proses = scope.filter(r => r.status === 'Ditangani' || r.status === 'Diverifikasi RT').length;
  const pending = scope.filter(r => r.status === 'Diterima').length;

  return `
    <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
      <h2 class="text-lg font-bold mb-1 flex items-center gap-2">
        <i class="fas fa-chart-pie text-primary"></i> Analytical Dashboard
      </h2>
      <p class="text-xs text-slate-500 mb-4">Tahap APPLY — evaluasi kinerja & pemetaan tren.</p>
      <div class="grid grid-cols-2 gap-3 mb-4">
        <div class="bg-orange-50 rounded-xl p-3"><p class="text-xs text-slate-500">Total</p><p class="text-2xl font-extrabold text-primary">${total}</p></div>
        <div class="bg-green-50 rounded-xl p-3"><p class="text-xs text-slate-500">Selesai</p><p class="text-2xl font-extrabold text-green-600">${selesai}</p></div>
        <div class="bg-indigo-50 rounded-xl p-3"><p class="text-xs text-slate-500">Diproses</p><p class="text-2xl font-extrabold text-indigo-600">${proses}</p></div>
        <div class="bg-amber-50 rounded-xl p-3"><p class="text-xs text-slate-500">Menunggu</p><p class="text-2xl font-extrabold text-amber-600">${pending}</p></div>
      </div>
      <div class="space-y-3">
        ${['RT 01','RT 03','RT 05'].map((rt, i) => {
          const v = [85, 72, 60][i];
          return `
            <div>
              <div class="flex justify-between text-xs font-semibold mb-1"><span>${rt}</span><span>${v}%</span></div>
              <div class="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div class="h-full bg-primary rounded-full" style="width:${v}%"></div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
      <div class="mt-4 pt-4 border-t border-slate-100 text-center">
        <p class="text-xs text-slate-500">Skor Kepatuhan ${user.role === 'rw' ? user.rw : user.rt}</p>
        <p class="text-3xl font-extrabold text-primary">78<span class="text-lg text-slate-400">/100</span></p>
      </div>
    </div>
  `;
}

// Panic button dengan sirine
function triggerPanic() {
  openModal('🚨 DARURAT', 'Aktifkan sirine & kirim sinyal darurat ke Ketua RT + pos ronda?', () => {
    const sirene = document.getElementById('sirene');
    if (sirene) { sirene.loop = true; sirene.play().catch(()=>{}); }
    if (navigator.vibrate) navigator.vibrate([500,200,500,200,1000]);

    const user = getCurrentUser();
    panicLogs.unshift({
      id: 'PANIC-' + Date.now(),
      user: user.name, rt: user.rt, rw: user.rw,
      waktu: new Date().toLocaleString('id-ID'),
      lokasi: 'Lokasi GPS terdeteksi (simulasi)'
    });
    saveAll();

    showToast('🚨 Sinyal darurat terkirim!', 'warn');
    setTimeout(() => {
      if (sirene) { sirene.pause(); sirene.currentTime = 0; }
    }, 5000);
  });
}