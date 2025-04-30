const API_URL =
  'https://script.google.com/macros/s/AKfycbz5ngg1M4aW2RjYLgcwm5lYXGealgaih-1rd7rCoQJv_bamrudmsJkAWLEcBUk2BzOF/exec';

// Ambil token dari localStorage
function getToken() {
  return localStorage.getItem('adminToken') || '';
}

// Redirect ke login jika token tidak ada atau tidak valid
async function initAuth() {
  const token = getToken();
  if (!token) {
    alert('🔒 Anda harus login dahulu.');
    window.location.href = 'index.html';
    return false;
  }
  // verifikasi token ke server
  const form = new FormData();
  form.append('action', 'verifyAdmin');
  form.append('token', token);
  try {
    const res = await fetch(API_URL, { method: 'POST', body: form });
    const data = await res.json();
    if (!data.success) throw new Error('Token invalid');
    return true;
  } catch (e) {
    localStorage.removeItem('adminToken');
    alert('🔒 Token kedaluwarsa atau tidak sah. Silakan login ulang.');
    window.location.href = 'index.html';
    return false;
  }
}

document.addEventListener('DOMContentLoaded', initAuth);

// Tambah Peserta Tabungan (header baris 3–5)
function tambahPesertaTabungan() {
  const id = document.getElementById('idTabunganBaru').value.trim();
  const nama = document.getElementById('namaTabunganBaru').value.trim();

  if (!id || !nama) {
    alert('ID dan Nama peserta wajib diisi!');
    return;
  }

  const formData = new FormData();
  formData.append('sheetName', 'TABUNGAN');
  formData.append('action', 'addTabunganParticipant');
  formData.append('idPeserta', id);
  formData.append('nama', nama);
  formData.append('token', getToken()); // ← kirim token

  fetch(API_URL, {
    method: 'POST',
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        alert('✅ ' + data.success);
        document.getElementById('idTabunganBaru').value = '';
        document.getElementById('namaTabunganBaru').value = '';
      } else {
        alert('❌ ' + (data.error || 'Gagal menambahkan peserta'));
      }
    })
    .catch((err) => alert('🚫 Gagal menghubungi server!'));
}

// Input Tabungan Peserta (baris ke bawah)
function inputTabunganPeserta() {
  const id = document.getElementById('idTabunganSetor').value.trim();
  const jumlah = document.getElementById('jumlahTabungan').value.trim();

  if (!id || !jumlah || Number(jumlah) <= 0) {
    alert('ID peserta dan jumlah tabungan harus valid!');
    return;
  }

  const formData = new FormData();
  formData.append('sheetName', 'TABUNGAN');
  formData.append('action', 'addTabunganEntry');
  formData.append('idPeserta', id);
  formData.append('jumlahTabungan', jumlah);
  formData.append('token', getToken()); // ← kirim token

  fetch(API_URL, {
    method: 'POST',
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        alert('✅ ' + data.success);
        document.getElementById('idTabunganSetor').value = '';
        document.getElementById('jumlahTabungan').value = '';
      } else {
        alert('❌ ' + (data.error || 'Gagal mencatat tabungan'));
      }
    })
    .catch((err) => alert('🚫 Gagal menghubungi server!'));
}
