// ===== DATA REPOSITORI KMS =====

// Capture: laporan warga
let reports = JSON.parse(localStorage.getItem('kms_reports')) || [
  { id:'RPT-001', judul:'Lampu jalan mati Blok C', kategori:'Fasilitas Umum', urgensi:'Sedang', status:'Diterima', anonim:false, pelapor:'Budi', tanggal:'01 Mar 2025', rt:'RT 03', rw:'RW 03', deskripsi:'Lampu mati 2 hari.', eskalasi:false },
  { id:'RPT-002', judul:'Sampah menumpuk', kategori:'Kebersihan', urgensi:'Tinggi', status:'Diverifikasi RT', anonim:true, pelapor:'Anonim', tanggal:'02 Mar 2025', rt:'RT 03', rw:'RW 03', deskripsi:'Bau tidak sedap.', eskalasi:true },
  { id:'RPT-003', judul:'Jalan berlubang', kategori:'Infrastruktur', urgensi:'Rendah', status:'Ditangani', anonim:false, pelapor:'Siti', tanggal:'28 Feb 2025', rt:'RT 05', rw:'RW 03', deskripsi:'Membahayakan.', eskalasi:false },
  { id:'RPT-004', judul:'Pencurian sepeda', kategori:'Keamanan', urgensi:'Tinggi', status:'Selesai', anonim:false, pelapor:'Ahmad', tanggal:'25 Feb 2025', rt:'RT 03', rw:'RW 03', deskripsi:'Hilang saat maghrib.', eskalasi:false },
];

// Store: repositori eksplisit (SOP/Regulasi) & tasit (FAQ)
let knowledgeRepo = JSON.parse(localStorage.getItem('kms_repo')) || [
  { id:'SOP-001', judul:'SOP Penanganan Banjir', tipe:'SOP', tanggal:'10 Jan 2025', deskripsi:'Prosedur evakuasi & koordinasi lintas RT.' },
  { id:'REG-002', judul:'Peraturan Keamanan Lingkungan', tipe:'Regulasi', tanggal:'15 Des 2024', deskripsi:'Aturan ronda & tamu menginap.' },
  { id:'FAQ-003', judul:'Solusi Sampah Menumpuk', tipe:'Tasit/FAQ', tanggal:'20 Feb 2025', deskripsi:'Koordinasi DLH & jadwal angkut.' },
];

// Share: broadcast
let broadcastList = JSON.parse(localStorage.getItem('kms_broadcast')) || [
  { id:1, judul:'Kerja Bakti Minggu Ini', pesan:'Sabtu, 8 Mar 2025 pukul 07.00.', tanggal:'03 Mar 2025', rw:'RW 03' },
  { id:2, judul:'Waspada DBD', pesan:'Lakukan 3M Plus.', tanggal:'01 Mar 2025', rw:'RW 03' },
];

// Apply: log darurat
let panicLogs = JSON.parse(localStorage.getItem('kms_panic')) || [];

function saveAll() {
  localStorage.setItem('kms_reports', JSON.stringify(reports));
  localStorage.setItem('kms_repo', JSON.stringify(knowledgeRepo));
  localStorage.setItem('kms_broadcast', JSON.stringify(broadcastList));
  localStorage.setItem('kms_panic', JSON.stringify(panicLogs));
}

function getCurrentUser() {
  const u = localStorage.getItem('kms_user');
  return u ? JSON.parse(u) : null;
}

function setCurrentUser(user) {
  if (user) localStorage.setItem('kms_user', JSON.stringify(user));
  else localStorage.removeItem('kms_user');
}