function switchAuthMode(mode) {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const tabLogin = document.getElementById('authTabLogin');
  const tabRegister = document.getElementById('authTabRegister');
  if (mode === 'login') {
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
    tabLogin.classList.add('tab-active');
    tabRegister.classList.remove('tab-active');
  } else {
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
    tabRegister.classList.add('tab-active');
    tabLogin.classList.remove('tab-active');
  }
}

function updateRegionFields() {
  const role = document.querySelector('input[name="regRole"]:checked').value;
  document.getElementById('rtField').classList.toggle('hidden', role === 'rw');
  document.getElementById('rwField').classList.toggle('hidden', role !== 'rw');
}

function handleLogin() {
  const id = document.getElementById('loginIdentifier').value.trim().toLowerCase();
  const pwd = document.getElementById('loginPassword').value.trim();
  if (!id || !pwd) { showToast('Isi semua field', 'warn'); return; }

  let role = 'warga', rt = 'RT 03', rw = 'RW 03', name = 'Warga';
  if (id.includes('rt')) {
    const m = id.match(/rt\s*(\d+)/);
    rt = m ? 'RT ' + m[1].padStart(2,'0') : 'RT 03';
    role = 'rt'; name = 'Ketua ' + rt;
  } else if (id.includes('rw')) {
    const m = id.match(/rw\s*(\d+)/);
    rw = m ? 'RW ' + m[1].padStart(2,'0') : 'RW 03';
    role = 'rw'; name = 'Ketua ' + rw;
  } else {
    name = id.split('@')[0] || 'Warga';
  }
  doLogin({ name, role, rt, rw });
}

function quickDemo(role) {
  const map = {
    warga: { name:'Warga Demo', role:'warga', rt:'RT 03', rw:'RW 03' },
    rt:    { name:'Ketua RT 03', role:'rt', rt:'RT 03', rw:'RW 03' },
    rw:    { name:'Ketua RW 03', role:'rw', rt:'RT 03', rw:'RW 03' }
  };
  doLogin(map[role]);
}

function handleRegister() {
  const name = document.getElementById('regName').value.trim();
  const phone = document.getElementById('regPhone').value.trim();
  const pwd = document.getElementById('regPassword').value.trim();
  const role = document.querySelector('input[name="regRole"]:checked').value;
  const rt = document.getElementById('regRT')?.value || 'RT 03';
  const rw = document.getElementById('regRW')?.value || 'RW 03';

  if (!name || !phone || !pwd) { showToast('Lengkapi data', 'warn'); return; }
  if (pwd.length < 6) { showToast('Password min. 6 karakter', 'warn'); return; }

  showToast(`Akun ${role.toUpperCase()} dibuat! Silakan masuk.`);
  setTimeout(() => {
    switchAuthMode('login');
    document.getElementById('loginIdentifier').value = phone;
    document.getElementById('loginPassword').value = pwd;
  }, 1200);
}

function doLogin(user) {
  setCurrentUser(user);
  document.getElementById('authScreen').classList.add('hidden');
  document.getElementById('appScreen').classList.remove('hidden');
  document.getElementById('panicBtn').classList.remove('hidden');

  const labels = { warga:'Warga', rt:'Pengurus '+user.rt, rw:'Pengurus '+user.rw };
  const icons  = { warga:'fa-user', rt:'fa-house-chimney-user', rw:'fa-building-flag' };
  document.getElementById('roleLabel').textContent = labels[user.role];
  document.getElementById('roleIcon').className = 'fas ' + icons[user.role];
  document.getElementById('headerSub').textContent = `${user.name} · ${user.rt} · ${user.rw}`;

  render();
  showToast(`Selamat datang, ${user.name}!`);
}

function handleLogout() {
  openModal('Keluar', 'Yakin ingin keluar?', () => {
    setCurrentUser(null);
    document.getElementById('appScreen').classList.add('hidden');
    document.getElementById('authScreen').classList.remove('hidden');
    document.getElementById('panicBtn').classList.add('hidden');
    document.getElementById('loginForm').reset();
    document.getElementById('registerForm').reset();
    showToast('Anda telah keluar');
  });
}