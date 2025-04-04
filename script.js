// ===================== KONFIGURASI =====================
const ADMIN_PASSWORD = 'admin123'; // (Opsional)
const scriptURL =
  'https://script.google.com/macros/s/AKfycbxW5DF6DqaG_6gjRz5ChqaempbSj8KbRqZW8M1ySMiUA9acqvE5fz5MZuLjCWtoLJLi/exec';

const paketMapping = {
  'Munggah 5000': { nilai: '5000', barang: '200', total: '300' },
  'Munggah Hemat': { nilai: '3000', barang: '200', total: '300' },
  'Lebaran Wow': { nilai: '10000', barang: '130', total: '330' },
  'Mom 5000': { nilai: '5000', barang: '130', total: '330' },
  'Lebaran Sembako': { nilai: '5000', barang: '180', total: '330' },
  'Kue Kaleng': { nilai: '5000', barang: '180', total: '330' },
  'Kids 3500': { nilai: '3500', barang: '130', total: '330' },
  'Kids 3000': { nilai: '3000', barang: '130', total: '330' },
  'Kids 2000': { nilai: '2000', barang: '155', total: '330' },
  'Kids 1000': { nilai: '1000', barang: '230', total: '330' },
  Cookies: { nilai: '1000', barang: '230', total: '330' },
  Mingguan: { nilai: '', barang: '0', total: '40' },
};

// ===================== FUNGSI LOGIN =====================
function login() {
  let inputPassword = document.getElementById('adminPassword').value.trim();
  if (inputPassword === ADMIN_PASSWORD) {
    document.getElementById('loginContainer').classList.add('hidden');
    document.getElementById('adminPanel').classList.remove('hidden');
  } else {
    document.getElementById('loginError').style.display = 'block';
  }
}

// ===================== SWITCH TAB =====================
function switchTab(tab) {
  document.getElementById('formSetoran').classList.remove('active');
  document.getElementById('formPeserta').classList.remove('active');
  document
    .querySelector('.tab-buttons button.active')
    .classList.remove('active');

  if (tab === 'setoran') {
    document.getElementById('formSetoran').classList.add('active');
    document
      .querySelector('.tab-buttons button:nth-child(1)')
      .classList.add('active');
  } else {
    document.getElementById('formPeserta').classList.add('active');
    document
      .querySelector('.tab-buttons button:nth-child(2)')
      .classList.add('active');
  }
}

// ===================== UPDATE NILAI & TOTAL =====================
function updateNilaiTotal() {
  const jenisPaket = document.getElementById('jenisPaket').value;
  const nilaiSetoranInput = document.getElementById('nilaiSetoran');
  const setoranBarangInput = document.getElementById('setoranBarang'); // Pastikan ada input dengan id ini di HTML
  const totalSetoranInput = document.getElementById('totalSetoran');

  if (paketMapping[jenisPaket]) {
    nilaiSetoranInput.value = paketMapping[jenisPaket].nilai;
    setoranBarangInput.value = paketMapping[jenisPaket].barang;
    totalSetoranInput.value = paketMapping[jenisPaket].total;
  } else {
    nilaiSetoranInput.value = '';
    setoranBarangInput.value = '';
    totalSetoranInput.value = '';
  }
}

// ===================== FILTER PENCARIAN PESERTA =====================
function cariPeserta() {
  let filterType = document.getElementById('filterType').value; // no / id / nama / grup
  let filterValue = document.getElementById('filterValue').value.trim();
  if (!filterValue) {
    alert('Masukkan kata kunci pencarian!');
    return;
  }

  fetch(
    `${scriptURL}?filterType=${filterType}&q=${encodeURIComponent(filterValue)}`
  )
    .then((res) => res.json())
    .then((data) => {
      let hasilDiv = document.getElementById('hasilPencarian');
      if (data.error) {
        hasilDiv.innerHTML = `<p style="color:red;">${data.error}</p>`;
      } else {
        tampilkanHasilPencarian(data);
      }
      hasilDiv.classList.remove('hidden');
    })
    .catch(() => {
      let hasilDiv = document.getElementById('hasilPencarian');
      hasilDiv.innerHTML = `<p style="color:red;">Terjadi kesalahan!</p>`;
      hasilDiv.classList.remove('hidden');
    });
}

function tampilkanHasilPencarian(data) {
  let html = `<h3>Hasil Pencarian</h3>`;
  data.forEach((peserta) => {
    html += `
      <div class="updated-item">
        <p><span class="label">No Urut:</span> ${peserta.no}</p>
        <p><span class="label">ID Peserta:</span> ${peserta.idPeserta}</p>
        <p><span class="label">Nama:</span> ${peserta.nama}</p>
        <p><span class="label">Grup ID:</span> ${peserta.grupID}</p>
        <p><span class="label">Setoran Masuk:</span> ${peserta.setoranDilakukan}X</p>
        <p><span class="label">Sisa Setoran:</span> ${peserta.sisaSetoran}X</p>
        <input type="number" id="setoran-${peserta.idPeserta}" placeholder="Jumlah Setoran" />
        <button onclick="tambahSetoranPeserta('${peserta.idPeserta}')">Tambah Setoran</button>
      </div>
    `;
  });
  document.getElementById('hasilPencarian').innerHTML = html;
}

// ===================== TAMBAH SETORAN DARI HASIL PENCARIAN =====================
function tambahSetoranPeserta(idPeserta) {
  let jumlahSetoran = document
    .getElementById(`setoran-${idPeserta}`)
    .value.trim();
  if (!jumlahSetoran) {
    alert('Masukkan jumlah setoran!');
    return;
  }
  let formData = new FormData();
  formData.append('action', 'addSetoran');
  formData.append('idPeserta', idPeserta);
  formData.append('setoranBaru', jumlahSetoran);

  fetch(scriptURL, { method: 'POST', body: formData })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        fetchUpdatedData(idPeserta);
      } else {
        alert(data.error);
      }
    })
    .catch(() => {
      alert('Gagal menambahkan setoran!');
    });
}

// ===================== TAMBAH SETORAN (LANGSUNG) =====================
function tambahSetoran() {
  let idPeserta = document.getElementById('idPesertaSetoran').value.trim();
  let setoranBaru = document.getElementById('setoranBaru').value.trim();
  let statusEl = document.getElementById('setoranStatus');
  if (!idPeserta || !setoranBaru) {
    tampilkanStatus(statusEl, 'Semua field harus diisi!', 'error');
    return;
  }
  let formData = new FormData();
  formData.append('action', 'addSetoran');
  formData.append('idPeserta', idPeserta);
  formData.append('setoranBaru', setoranBaru);
  fetch(scriptURL, { method: 'POST', body: formData })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        tampilkanStatus(statusEl, data.success, 'success');
        fetchUpdatedData(idPeserta);
      } else {
        tampilkanStatus(statusEl, data.error, 'error');
      }
    })
    .catch(() => {
      tampilkanStatus(statusEl, 'Gagal menambahkan setoran!', 'error');
    });
}

// ===================== AMBIL DATA TERBARU =====================
function fetchUpdatedData(idPeserta) {
  fetch(`${scriptURL}?id=${idPeserta}`)
    .then((r) => r.json())
    .then((data) => {
      if (data.error) {
        document.getElementById(
          'updatedParticipant'
        ).innerHTML = `<p style="color:red;">${data.error}</p>`;
        document
          .getElementById('updatedParticipant')
          .classList.remove('hidden');
      } else {
        showUpdatedParticipant(data);
      }
    })
    .catch(() => {
      document.getElementById(
        'updatedParticipant'
      ).innerHTML = `<p style="color:red;">Terjadi kesalahan mengambil data terbaru!</p>`;
      document.getElementById('updatedParticipant').classList.remove('hidden');
    });
}

// ===================== TAMPILKAN DATA TERBARU =====================
function showUpdatedParticipant(data) {
  let container = document.getElementById('updatedParticipant');
  let html = `<h3>Data Terbaru Peserta</h3>`;
  data.forEach((peserta) => {
    let pesanBarang = '';
    if (
      peserta.setoranBarang &&
      Number(peserta.setoranDilakukan) >= Number(peserta.setoranBarang)
    ) {
      pesanBarang = `<p style="color:green;font-weight:bold;">Selamat, Anda telah mencapai simpanan barang! Setoran selanjutnya akan menambah ke tabungan uang Anda.</p>`;
    }
    html += `
      <div class="updated-item">
        <p><span class="label">No Urut:</span> ${peserta.no}</p>
        <p><span class="label">ID Peserta:</span> ${peserta.idPeserta}</p>
        <p><span class="label">Nama:</span> ${peserta.nama}</p>
        <p><span class="label">Paket:</span> ${peserta.jenisPaket}</p>
        <p><span class="label">Nilai Setoran:</span> ${peserta.nilaiSetoran}</p>
        <p><span class="label">Total Setoran:</span> ${peserta.totalSetoran}X</p>
        <p><span class="label">Setoran Masuk:</span> ${peserta.setoranDilakukan}X</p>
        <p><span class="label">Sisa Setoran:</span> ${peserta.sisaSetoran}X</p>
        <p><span class="label">Setoran Barang:</span> ${peserta.setoranBarang}X</p>
        ${pesanBarang}
      </div>
    `;
  });
  container.innerHTML = html;
  container.classList.remove('hidden');
}

// ===================== TAMBAH PESERTA =====================
function tambahPeserta() {
  let idPeserta = document.getElementById('idPesertaBaru').value.trim();
  let nama = document.getElementById('namaPeserta').value.trim();
  let jenisPaket = document.getElementById('jenisPaket').value;
  let nilaiSetoran = document.getElementById('nilaiSetoran').value.trim();
  let totalSetoran = document.getElementById('totalSetoran').value.trim();
  let grupID = document.getElementById('grupID').value.trim();
  let statusEl = document.getElementById('pesertaStatus');

  if (
    !idPeserta ||
    !nama ||
    !jenisPaket ||
    !nilaiSetoran ||
    !totalSetoran ||
    !grupID
  ) {
    tampilkanStatus(statusEl, 'Semua field harus diisi!', 'error');
    return;
  }

  let formData = new FormData();
  formData.append('action', 'addPeserta');
  formData.append('idPeserta', idPeserta);
  formData.append('nama', nama);
  formData.append('jenisPaket', jenisPaket);
  formData.append('nilaiSetoran', nilaiSetoran);
  formData.append('totalSetoran', totalSetoran);
  formData.append('grupID', grupID);
  // Pastikan data setoran barang dikirim juga
  formData.append(
    'setoranBarang',
    document.getElementById('setoranBarang').value.trim()
  );

  fetch(scriptURL, { method: 'POST', body: formData })
    .then((res) => res.json())
    .then((data) => {
      tampilkanStatus(
        statusEl,
        data.success || data.error,
        data.success ? 'success' : 'error'
      );
    })
    .catch(() => {
      tampilkanStatus(statusEl, 'Gagal menambahkan peserta!', 'error');
    });
}

// ===================== TAMPILKAN STATUS =====================
function tampilkanStatus(element, message, type) {
  element.textContent = message;
  element.className = `status ${type}`;
  element.style.display = 'block';
  setTimeout(() => (element.style.display = 'none'), 3000);
}

// ===================== RESET FILTER =====================
function resetFilter() {
  document.getElementById('filterValue').value = '';
  let hasilDiv = document.getElementById('hasilPencarian');
  hasilDiv.classList.add('hidden');
  hasilDiv.innerHTML = '';
  let updatedDiv = document.getElementById('updatedParticipant');
  updatedDiv.classList.add('hidden');
  updatedDiv.innerHTML = '';
}

// ===================== RESET FORM =====================
function resetForm(type) {
  if (type === 'peserta') {
    document
      .querySelectorAll('#formPeserta input')
      .forEach((input) => (input.value = ''));
    document.getElementById('jenisPaket').selectedIndex = 0;
  } else if (type === 'setoran') {
    document
      .querySelectorAll('#formSetoran input')
      .forEach((input) => (input.value = ''));
    document.getElementById('updatedParticipant').classList.add('hidden');
    document.getElementById('updatedParticipant').innerHTML = '';
  }
}
