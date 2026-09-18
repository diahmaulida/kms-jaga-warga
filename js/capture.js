// ===== CAPTURE: Form laporan warga =====

function renderCaptureForm(user) {
  return `
    <div class="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 fade-in">
      <div class="flex items-center gap-3 mb-6 p-4 bg-primary-soft rounded-2xl border border-orange-100">
        <i class="fas fa-satellite-dish text-primary text-xl"></i>
        <div>
          <p class="font-bold text-sm">Tahap CAPTURE — ${user.rt} · ${user.rw}</p>
          <p class="text-xs text-slate-500">Laporan langsung masuk ke Ketua ${user.rt} tanpa birokrasi berlapis.</p>
        </div>
      </div>
      <h2 class="text-2xl font-bold mb-1">Buat Laporan Baru</h2>
      <p class="text-slate-500 mb-6 text-sm">Data pengetahuan (kategori, lokasi, urgensi, bukti) akan tersimpan otomatis di KMS.</p>
      <form onsubmit="event.preventDefault(); submitReport(this);" class="space-y-5">
        <div>
          <label class="block font-semibold mb-2 text-sm">Judul Laporan</label>
          <input name="judul" required type="text" placeholder="Contoh: Lampu jalan mati" class="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:border-primary outline-none">
        </div>
        <div class="grid sm:grid-cols-2 gap-4">
          <div>
            <label class="block font-semibold mb-2 text-sm">Kategori Insiden</label>
            <select name="kategori" required class="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white">
              <option value="">Pilih kategori</option>
              <option>Fasilitas Umum</option><option>Kebersihan</option>
              <option>Keamanan</option><option>Infrastruktur</option><option>Sosial</option>
            </select>
          </div>
          <div>
            <label class="block font-semibold mb-2 text-sm">Tingkat Urgensi</label>
            <select name="urgensi" required class="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white">
              <option value="">Pilih urgensi</option>
              <option>Rendah</option><option>Sedang</option><option>Tinggi</option>
            </select>
          </div>
        </div>
        <div>
          <label class="block font-semibold mb-2 text-sm">Lokasi Kejadian</label>
          <div class="flex gap-2">
            <input name="lokasi" required type="text" placeholder="Alamat/patokan" class="flex-1 px-4 py-3.5 rounded-xl border border-slate-200 focus:border-primary outline-none">
            <button type="button" onclick="detectGPS(this)" class="px-4 rounded-xl bg-primary text-white font-semibold hover:bg-primary-dark" title="Deteksi GPS">
              <i class="fas fa-location-crosshairs"></i>
            </button>
          </div>
        </div>
        <div>
          <label class="block font-semibold mb-2 text-sm">Deskripsi</label>
          <textarea name="deskripsi" required rows="3" placeholder="Jelaskan detail..." class="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:border-primary outline-none resize-none"></textarea>
        </div>
        <div class="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center cursor-pointer hover:border-primary hover:bg-primary-soft transition" onclick="showToast('Bukti dilampirkan (simulasi)', 'info')">
          <i class="fas fa-cloud-arrow-up text-3xl text-primary mb-2"></i>
          <p class="font-semibold text-sm">Lampiran Bukti Foto / Video</p>
          <p class="text-xs text-slate-400 mt-1">Data dukung verifikasi fisik</p>
        </div>
        <label class="flex items-center gap-3 bg-slate-50 p-4 rounded-xl cursor-pointer">
          <input name="anonim" type="checkbox" class="w-5 h-5 accent-primary">
          <span class="text-sm font-medium"><i class="fas fa-user-secret text-purple-500 mr-1"></i> Kirim sebagai <strong>Anonim</strong> (kasus sensitif/konflik)</span>
        </label>
        <button type="submit" class="w-full py-4 rounded-xl bg-primary text-white font-bold hover:bg-primary-dark transition shadow-lg shadow-orange-200">
          <i class="fas fa-paper-plane mr-2"></i> Kirim Laporan
        </button>
      </form>
    </div>
  `;
}

function detectGPS(btn) {
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
  setTimeout(() => {
    btn.innerHTML = '<i class="fas fa-check"></i>';
    showToast('Koordinat GPS terdeteksi (simulasi)');
  }, 1000);
}

function submitReport(form) {
  const user = getCurrentUser();
  const fd = new FormData(form);
  const id = 'RPT-' + String(reports.length + 1).padStart(3,'0');
  reports.unshift({
    id, judul: fd.get('judul'), kategori: fd.get('kategori'),
    urgensi: fd.get('urgensi'), lokasi: fd.get('lokasi'),
    deskripsi: fd.get('deskripsi'),
    anonim: fd.get('anonim') === 'on',
    pelapor: fd.get('anonim') === 'on' ? 'Anonim' : user.name,
    tanggal: 'Hari ini', rt: user.rt, rw: user.rw, status: 'Diterima', eskalasi: false
  });
  saveAll();
  showToast(`Laporan terkirim ke Ketua ${user.rt}!`);
  setTimeout(() => { setSubTab('tracking'); }, 800);
}