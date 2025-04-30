const scriptURL =
  'https://script.google.com/macros/s/AKfycbz5ngg1M4aW2RjYLgcwm5lYXGealgaih-1rd7rCoQJv_bamrudmsJkAWLEcBUk2BzOF/exec';
const API_URL = scriptURL;

// Tombol Login diklik
document.getElementById('btnLogin').addEventListener('click', login);

// Saat halaman selesai dimuat, periksa token
window.addEventListener('DOMContentLoaded', async () => {
  const ok = await initAuth();
  if (ok) {
    loginSuccess(); // ✅ tampilkan UI admin jika token masih valid
  } else {
    document.getElementById('loginContainer').classList.remove('hidden');
    document.getElementById('adminPanel').classList.add('hidden');
  }
});

// Fungsi login
function login() {
  const pw = document.getElementById('adminPassword').value;
  const form = new FormData();
  form.append('action', 'verifyAdmin');
  form.append('password', pw);

  fetch(API_URL, { method: 'POST', body: form })
    .then((r) => r.json())
    .then((data) => {
      if (data.success && data.token) {
        localStorage.setItem('adminToken', data.token);
        loginSuccess();
      } else {
        showLoginError();
      }
    })
    .catch(() => {
      showLoginError();
    });
}

// Tampilkan UI admin
function loginSuccess() {
  document.getElementById('loginContainer').classList.add('hidden');
  document.getElementById('adminPanel').classList.remove('hidden');
  document.getElementById('loginError').classList.add('hidden');
}

// Tampilkan error saat login gagal
function showLoginError() {
  document.getElementById('loginError').classList.remove('hidden');
}

// Ambil token dari localStorage
function getToken() {
  return localStorage.getItem('adminToken') || '';
}

// Verifikasi token saat load halaman
async function initAuth() {
  const token = getToken();
  if (!token) return false;

  const form = new FormData();
  form.append('action', 'verifyAdmin');
  form.append('token', token);

  try {
    const r = await fetch(API_URL, { method: 'POST', body: form });
    const data = await r.json();
    return data.success;
  } catch {
    return false;
  }
}

function redirectLogin() {
  localStorage.removeItem('adminToken');
  alert('🔒 Token tidak valid atau kadaluwarsa. Silakan login ulang.');
  window.location.href = 'index.html';
}

// ————— Tab logic —————
function switchTab(tab) {
  // reset active class
  setoranTabBtn.classList.remove('active');
  pesertaTabBtn.classList.remove('active');
  formSetoran.classList.add('hidden');
  formPeserta.classList.add('hidden');

  if (tab === 'setoran') {
    setoranTabBtn.classList.add('active');
    formSetoran.classList.remove('hidden');
  } else {
    pesertaTabBtn.classList.add('active');
    formPeserta.classList.remove('hidden');
  }
}

// inisialisasi: sembunyikan kedua form, aktifkan tab setoran
switchTab('setoran');

// Mapping paket (gunakan sesuai kebutuhan)
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
  Cookies: { nilai: '1000', barang: '330', total: '330' },
  Mingguan: { nilai: '', barang: '0', total: '40' },
};

// ===================== DAFTAR BARANG UNTUK PAKET MINGGUAN =====================
const barangMingguan = [
  // Kategori Mie
  { category: 'Mie', name: 'Indomie Ayam Bawang', price: 3200 },
  { category: 'Mie', name: 'Indomie Soto', price: 3200 },
  { category: 'Mie', name: 'Indomie Goreng Bawang', price: 3500 },
  { category: 'Mie', name: 'Indomie Goreng Rendang', price: 3500 },
  { category: 'Mie', name: 'Indomie Goreng Rica-rica', price: 3500 },
  { category: 'Mie', name: 'Indomie Goreng Aceh', price: 3500 },
  { category: 'Mie', name: 'Indomie Goreng Cabe Ijo', price: 3500 },
  { category: 'Mie', name: 'Indomie Goreng Ayam Geprek', price: 3500 },
  { category: 'Mie', name: 'Indomie Goreng Ayam Pop', price: 3500 },
  { category: 'Mie', name: 'Indomie Empal Gentong', price: 3500 },
  { category: 'Mie', name: 'Indomie Kocok Bandung', price: 3500 },
  { category: 'Mie', name: 'Mie Sedap Goreng', price: 3500 },
  { category: 'Mie', name: 'Mie Sedap Bawang', price: 3500 },
  { category: 'Mie', name: 'Mie Sedaap Baked Soto', price: 3500 },
  { category: 'Mie', name: 'Mie Sedaap Baked Goreng', price: 3500 },
  { category: 'Mie', name: 'Mie Sedaap Ayam Jerit', price: 3000 },
  { category: 'Mie', name: 'Mie Sedaap Korean Spicy', price: 3000 },
  { category: 'Mie', name: 'Mie Sedaap Kare Kental', price: 3000 },
  { category: 'Mie', name: 'Mie Sedap Ayam Bawang', price: 3000 },
  { category: 'Mie', name: 'Mie Sedap Soto', price: 3000 },
  { category: 'Mie', name: 'Mie Sukses Goreng Rendang', price: 4000 },
  { category: 'Mie', name: 'Mie Sukses Ayam Bawang Kuah', price: 4000 },
  { category: 'Mie', name: 'Mie Sukses Goreng Kecap', price: 4000 },
  { category: 'Mie', name: 'Mie Sukses Goreng Kriuk', price: 4000 },
  { category: 'Mie', name: 'Mie Oven Goreng', price: 3000 },
  { category: 'Mie', name: 'Mie Oven Kuah', price: 3000 },
  { category: 'Mie', name: 'Pop Mie Ayam Besar', price: 3200 },
  { category: 'Mie', name: 'Pop Mie Bakso Besar', price: 3200 },
  { category: 'Mie', name: 'Pop Mie Gledek', price: 3500 },
  { category: 'Mie', name: 'Pop Mie Goreng', price: 3500 },
  { category: 'Mie', name: 'Pop Mie Ayam Kecil', price: 2500 },
  { category: 'Mie', name: 'Pop Mie Bakso Kecil', price: 2500 },

  // Kategori Sembako
  { category: 'Sembako', name: 'Beras Super 25 kg', price: 10000 },
  { category: 'Sembako', name: 'Beras Super 10 kg', price: 5000 },
  {
    category: 'Sembako',
    name: 'Minyak Goreng Bimoli 5L (Kompan)',
    price: 3750,
  },
  { category: 'Sembako', name: 'Minyak Goreng kemasan 2L  1 pc', price: 1500 },
  {
    category: 'Sembako',
    name: 'Minyak Goreng Kemasan 2L (1 Karton)',
    price: 7500,
  },
  { category: 'Sembako', name: 'Kecap Bango 550 ml', price: 800 },
  { category: 'Sembako', name: 'Kecap ABC 520 ml', price: 750 },
  { category: 'Sembako', name: 'Kecap Sedap 600 ml', price: 700 },
  { category: 'Sembako', name: 'Royco Ayam 230 gr', price: 400 },
  { category: 'Sembako', name: 'Royco Sapi 230 gr', price: 400 },
  { category: 'Sembako', name: 'Totole kaldu jamur 200 gr', price: 750 },
  { category: 'Sembako', name: 'VetSin Sasa 250 gr', price: 500 },
  { category: 'Sembako', name: 'Gula Pasir 1 kg', price: 600 },
  { category: 'Sembako', name: 'Gula Kawung 1 kg', price: 900 },
  { category: 'Sembako', name: 'Kerupuk Udang MP 1 kg', price: 1200 },
  { category: 'Sembako', name: 'Kerupuk Udang 1 Karton', price: 5000 },
  { category: 'Sembako', name: 'Emping 1 kg', price: 3000 },
  { category: 'Sembako', name: 'Ranginang 1 kg', price: 1500 },
  { category: 'Sembako', name: 'Kerupuk Kemplang 1 ball', price: 1900 },
  { category: 'Sembako', name: 'Kerupuk Kemplang 1 Kg', price: 600 },
  { category: 'Sembako', name: 'Kacang kupas 1 kg', price: 1250 },
  { category: 'Sembako', name: 'Kacang kupas 500 gr', price: 625 },
  { category: 'Sembako', name: 'Terigu Segitiga Biru 1 kg', price: 450 },
  { category: 'Sembako', name: 'Terigu Kunci Biru 1 kg', price: 450 },
  { category: 'Sembako', name: 'Terigu Cakra Kembar 1 kg', price: 550 },
  { category: 'Sembako', name: 'Mentega Blueband 200 gr', price: 400 },
  { category: 'Sembako', name: 'Mentega Palmia 200 gr', price: 300 },

  // Kategori Daging
  { category: 'Daging', name: 'Daging Super 1 kg', price: 4000 },
  { category: 'Daging', name: 'Tulang Iga Gondrong 1 kg', price: 3250 },
  { category: 'Daging', name: 'Daging Iga 1 kg', price: 4000 },
  { category: 'Daging', name: 'Cokor Sapi 1 kg', price: 5000 },
  { category: 'Daging', name: 'Paha Sapi 1 kg', price: 3750 },
  { category: 'Daging', name: 'Kepala Sapi 1 kg', price: 2750 },
  { category: 'Daging', name: 'Daging Ayam 1 kg', price: 1250 },

  // Kategori Kue Kaleng
  { category: 'Kue Kaleng', name: 'Kue Monde Besar', price: 4600 },
  { category: 'Kue Kaleng', name: 'Kue Monde Kecil', price: 2300 },
  { category: 'Kue Kaleng', name: 'Kue Monde Eggroll Besar', price: 3000 },
  { category: 'Kue Kaleng', name: 'Kue Monde Eggroll Kecil', price: 2200 },
  { category: 'Kue Kaleng', name: 'Kue Khongguan Besar', price: 3250 },
  { category: 'Kue Kaleng', name: 'Kue Khongguan Kecil', price: 2200 },
  { category: 'Kue Kaleng', name: 'Kue Wafer Tango Coklat', price: 1750 },
  { category: 'Kue Kaleng', name: 'Kue Wafer Tango Vanila', price: 1750 },
  { category: 'Kue Kaleng', name: 'Kue Wafer Nissin', price: 2000 },
  { category: 'Kue Kaleng', name: 'Kue Astor Kaleng Kecil', price: 1000 },
  { category: 'Kue Kaleng', name: 'Kue Astor Aladin Blek', price: 6250 },
  { category: 'Kue Kaleng', name: 'Kue Wafer Aladin Blek', price: 6000 },

  // Kategori Minuman
  { category: 'Minuman', name: 'SKM Frisian Flag pouch 545 ml', price: 625 },
  { category: 'Minuman', name: 'Susu Frisian Flag 1 L', price: 600 },
  { category: 'Minuman', name: 'Pocari Sweet 2 L', price: 650 },
  { category: 'Minuman', name: 'ABC Squash deligh 1 botol', price: 400 },
  { category: 'Minuman', name: 'ABC Special Gread 1 botol', price: 650 },
  { category: 'Minuman', name: 'Marjan Boudoin', price: 650 },
  { category: 'Minuman', name: 'Fanta 1,5L', price: 500 },
  { category: 'Minuman', name: 'Coca cola 1,5 L', price: 500 },
  { category: 'Minuman', name: 'Sprite 1,5L', price: 500 },
  { category: 'Minuman', name: 'Teh Pucuk 1 L', price: 400 },
];

// Objek untuk menyimpan pesanan (kuantitas) peserta
let selectedItems = {};

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

// ===================== GET SHEET NAME =====================
// Fungsi untuk mengambil nama sheet dari dropdown
function getSheetName() {
  const sheetSelect = document.getElementById('sheetSelector');
  return sheetSelect ? sheetSelect.value : 'IBU';
}

// ===================== UPDATE NILAI & TOTAL =====================
function updateNilaiTotal() {
  const jenisPaket = document.getElementById('jenisPaket').value;
  const nilaiSetoranInput = document.getElementById('nilaiSetoran');
  const setoranBarangInput = document.getElementById('setoranBarang');
  const totalSetoranInput = document.getElementById('totalSetoran');
  const barangContainer = document.getElementById('barangContainer');

  if (jenisPaket === 'Mingguan') {
    barangContainer.classList.remove('hidden');
    generateBarangList();
    nilaiSetoranInput.value = '';
    setoranBarangInput.value = '';
    totalSetoranInput.value = '';
  } else {
    barangContainer.classList.add('hidden');
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
}

// ===================== GENERATE DAFTAR BARANG (ACCORDION + TOMBOL +/-) =====================
function generateBarangList() {
  const barangListDiv = document.getElementById('barangList');
  barangListDiv.innerHTML = '';
  selectedItems = {};

  const categories = {};
  barangMingguan.forEach((item) => {
    if (!categories[item.category]) {
      categories[item.category] = [];
    }
    categories[item.category].push(item);
  });

  Object.keys(categories).forEach((categoryName) => {
    const categoryTitle = document.createElement('h5');
    categoryTitle.textContent = categoryName.toUpperCase();
    categoryTitle.className = 'category-title';
    // Klik untuk toggle konten kategori
    categoryTitle.addEventListener('click', () =>
      toggleCategory(categoryContentDiv)
    );

    const categoryContentDiv = document.createElement('div');
    categoryContentDiv.className = 'category-content hidden';

    categories[categoryName].forEach((item, idx) => {
      const itemRow = document.createElement('div');
      itemRow.className = 'item-row';

      const itemNo = document.createElement('span');
      itemNo.textContent = idx + 1 + '.';
      itemNo.className = 'item-no';

      const itemName = document.createElement('span');
      itemName.textContent = item.name;
      itemName.className = 'item-name';

      const itemPrice = document.createElement('span');
      itemPrice.textContent = `Rp${item.price}`;
      itemPrice.className = 'item-price';

      const minusBtn = document.createElement('button');
      minusBtn.textContent = '–';
      minusBtn.className = 'minus-btn';
      minusBtn.addEventListener('click', () =>
        decreaseItem(item.name, item.price, qtySpan)
      );

      const qtySpan = document.createElement('span');
      qtySpan.textContent = '0';
      qtySpan.className = 'item-qty';

      const plusBtn = document.createElement('button');
      plusBtn.textContent = '+';
      plusBtn.className = 'plus-btn';
      plusBtn.addEventListener('click', () =>
        increaseItem(item.name, item.price, qtySpan)
      );

      itemRow.appendChild(itemNo);
      itemRow.appendChild(itemName);
      itemRow.appendChild(itemPrice);
      itemRow.appendChild(minusBtn);
      itemRow.appendChild(qtySpan);
      itemRow.appendChild(plusBtn);

      categoryContentDiv.appendChild(itemRow);
    });

    barangListDiv.appendChild(categoryTitle);
    barangListDiv.appendChild(categoryContentDiv);
  });
}

function toggleCategory(categoryContentDiv) {
  categoryContentDiv.classList.toggle('hidden');
}

function increaseItem(name, price, qtySpan) {
  if (!selectedItems[name]) {
    selectedItems[name] = { quantity: 0, price: price };
  }
  selectedItems[name].quantity++;
  qtySpan.textContent = selectedItems[name].quantity;
  updateTotalSetoranBarang();
}

function decreaseItem(name, price, qtySpan) {
  if (!selectedItems[name]) {
    selectedItems[name] = { quantity: 0, price: price };
  }
  if (selectedItems[name].quantity > 0) {
    selectedItems[name].quantity--;
  }
  qtySpan.textContent = selectedItems[name].quantity;
  updateTotalSetoranBarang();
}

function updateTotalSetoranBarang() {
  let total = 0;
  let selectedNames = [];
  for (const itemName in selectedItems) {
    const { quantity, price } = selectedItems[itemName];
    if (quantity > 0) {
      total += quantity * price;
      selectedNames.push(`${itemName} x${quantity}`);
    }
  }
  document.getElementById('totalSetoranBarang').textContent = total;
  document.getElementById('totalSetoran').value = total;
  document.getElementById('setoranBarang').value = selectedNames.join(', ');
}

// ===================== CONTOH REQUEST (FILTER, TAMBAH PESERTA, DLL.) =====================

function cariPeserta() {
  const sheetName = getSheetName();
  const filterType = document.getElementById('filterType').value;
  const filterValue = document.getElementById('filterValue').value.trim();
  if (!filterValue) {
    alert('Masukkan kata kunci pencarian!');
    return;
  }
  const url = `${scriptURL}?sheetName=${sheetName}&filterType=${filterType}&q=${encodeURIComponent(
    filterValue
  )}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      const hasilDiv = document.getElementById('hasilPencarian');
      if (data.error) {
        hasilDiv.innerHTML = `<p style="color:red;">${data.error}</p>`;
      } else {
        tampilkanHasilPencarian(data);
      }
      hasilDiv.classList.remove('hidden');
    })
    .catch(() => {
      const hasilDiv = document.getElementById('hasilPencarian');
      hasilDiv.innerHTML = `<p style="color:red;">Terjadi kesalahan!</p>`;
      hasilDiv.classList.remove('hidden');
    });
}

function tampilkanHasilPencarian(data) {
  let html = `<h3>Hasil Pencarian</h3>`;
  data.forEach((peserta) => {
    let detailMingguanHTML = '';
    if (
      peserta.jenisPaket &&
      peserta.jenisPaket.toLowerCase() === 'mingguan' &&
      peserta.setoranBarang &&
      peserta.setoranBarang.trim() !== ''
    ) {
      const itemStrings = peserta.setoranBarang.split(',');
      let totalRincian = 0;
      detailMingguanHTML += `<div class="detail-peserta"><p><strong>Rincian Harga per Item:</strong></p>`;
      itemStrings.forEach((itemStr, idx) => {
        const parts = itemStr.trim().split('x');
        if (parts.length === 2) {
          const itemName = parts[0].trim();
          const quantity = Number(parts[1].trim());
          const barang = barangMingguan.find(
            (b) => b.name.toLowerCase() === itemName.toLowerCase()
          );
          if (barang && !isNaN(quantity)) {
            const subTotal = barang.price * quantity;
            totalRincian += subTotal;
            detailMingguanHTML += `<p>${
              idx + 1
            }. ${itemName} x${quantity} = Rp ${subTotal.toLocaleString()}</p>`;
          }
        }
      });
      detailMingguanHTML += `<p><strong>Total Rincian:</strong> Rp ${totalRincian.toLocaleString()}</p></div>`;
    }

    html += `
      <div class="updated-item">
        <p><span class="label">No Urut:</span> ${peserta.no}</p>
        <p><span class="label">ID Peserta:</span> ${peserta.idPeserta}</p>
        <p><span class="label">Grup ID:</span> ${peserta.grupID}</p>
        <p><span class="label">Nama:</span> ${peserta.nama}</p>
        <p><span class="label">Paket:</span> ${peserta.jenisPaket}</p>
        <p><span class="label">Nilai Setoran:</span> Rp ${peserta.nilaiSetoran}</p>
        ${detailMingguanHTML}
        <p><span class="label">Total Setoran:</span> ${peserta.totalSetoran}x</p>
        
        <p><span class="label">Setoran Masuk:</span> ${peserta.setoranDilakukan}X</p>
        <p><span class="label">Sisa Setoran:</span> ${peserta.sisaSetoran}X</p>
        <input type="number" id="setoran-${peserta.idPeserta}" placeholder="Jumlah Setoran" />
        <button onclick="tambahSetoranPeserta('${peserta.idPeserta}')">Tambah Setoran</button>
      </div>
    `;
  });

  document.getElementById('hasilPencarian').innerHTML = html;
}

function tambahSetoranPeserta(idPeserta) {
  const jumlahSetoran = document
    .getElementById(`setoran-${idPeserta}`)
    .value.trim();
  if (!jumlahSetoran) {
    alert('Masukkan jumlah setoran!');
    return;
  }
  const formData = new FormData();
  formData.append('sheetName', getSheetName());
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

function tambahSetoran() {
  const sheetName = getSheetName();
  const idPeserta = document.getElementById('idPesertaSetoran').value.trim();
  const setoranBaru = document.getElementById('setoranBaru').value.trim();
  const statusEl = document.getElementById('setoranStatus');
  if (!idPeserta || !setoranBaru) {
    tampilkanStatus(statusEl, 'Semua field harus diisi!', 'error');
    return;
  }
  const formData = new FormData();
  formData.append('sheetName', sheetName);
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

function fetchUpdatedData(idPeserta) {
  const sheetName = getSheetName();
  fetch(`${scriptURL}?sheetName=${sheetName}&id=${idPeserta}`)
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

function showUpdatedParticipant(data) {
  // Siapkan HTML isi data peserta
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
        <p><span class="label">Nilai Setoran:</span> Rp ${peserta.nilaiSetoran}</p>
        <p><span class="label">Setoran Barang:</span> ${peserta.setoranBarang}</p>
        <p><span class="label">Total Setoran:</span> ${peserta.totalSetoran}X</p>
        <p><span class="label">Setoran Masuk:</span> ${peserta.setoranDilakukan}X</p>
        <p><span class="label">Sisa Setoran:</span> ${peserta.sisaSetoran}X</p>
        
        ${pesanBarang}
      </div>
    `;
  });

  // Tampilkan notifikasi mengambang di tengah atas
  const notif = document.getElementById('floatingStatus');
  const msg = document.getElementById('statusMessage');
  msg.innerHTML = '✅ Setoran berhasil ditambahkan.<br>' + html;
  notif.classList.remove('error');
  notif.classList.add('success');
  notif.style.display = 'block';

  // Auto close setelah 5 detik
  setTimeout(() => {
    notif.style.display = 'none';
  }, 50000);
}

function hideFloatingStatus() {
  document.getElementById('floatingStatus').style.display = 'none';
}

function tambahPeserta() {
  const sheetName = getSheetName();
  const idPeserta = document.getElementById('idPesertaBaru').value.trim();
  const nama = document.getElementById('namaPeserta').value.trim();
  const jenisPaket = document.getElementById('jenisPaket').value;
  const nilaiSetoran = document.getElementById('nilaiSetoran').value.trim();
  const totalSetoran = document.getElementById('totalSetoran').value.trim();
  const grupID = document.getElementById('grupID').value.trim();

  if (!idPeserta || !nama || !jenisPaket || !totalSetoran || !grupID) {
    alert('❌ Semua field harus diisi!');
    return;
  }
  const token = localStorage.getItem('adminToken');
  if (!token) {
    alert('⚠️ Anda belum login atau session telah berakhir.');
    return;
  }

  const formData = new FormData();
  formData.append('token', token);
  formData.append('sheetName', sheetName);
  formData.append('action', 'addPeserta');
  formData.append('idPeserta', idPeserta);
  formData.append('nama', nama);
  formData.append('jenisPaket', jenisPaket);
  formData.append('nilaiSetoran', nilaiSetoran);
  formData.append('totalSetoran', totalSetoran);
  formData.append('grupID', grupID);
  formData.append(
    'setoranBarang',
    document.getElementById('setoranBarang').value.trim()
  );

  fetch(scriptURL, {
    method: 'POST',
    body: formData,
  })
    .then((r) => r.json())
    .then((data) => {
      if (data.success) {
        alert('✅ ' + data.success);
      } else if (data.error === 'Unauthorized') {
        alert('⚠️ Token tidak valid. Silakan login ulang.');
        // misal: window.location.href = 'index.html';
      } else {
        alert('❌ ' + (data.error || 'Gagal menambahkan peserta'));
      }
    })
    .catch((err) => {
      console.error(err);
      alert('🚫 Gagal menghubungi server!');
    });
}

function resetFilter() {
  document.getElementById('filterValue').value = '';
  const hasilDiv = document.getElementById('hasilPencarian');
  hasilDiv.classList.add('hidden');
  hasilDiv.innerHTML = '';
  const updatedDiv = document.getElementById('updatedParticipant');
  updatedDiv.classList.add('hidden');
  updatedDiv.innerHTML = '';
}

function resetForm(type) {
  if (type === 'peserta') {
    document
      .querySelectorAll('#formPeserta input')
      .forEach((input) => (input.value = ''));
    document.getElementById('jenisPaket').selectedIndex = 0;
    document.getElementById('barangContainer').classList.add('hidden');
    document.getElementById('barangList').innerHTML = '';
  } else if (type === 'setoran') {
    document
      .querySelectorAll('#formSetoran input')
      .forEach((input) => (input.value = ''));
    document.getElementById('updatedParticipant').classList.add('hidden');
    document.getElementById('updatedParticipant').innerHTML = '';
  }
}

function bukaKalkulatorAdmin() {
  window.location.href = 'kalkulator-admin.html';
}

// fungsi logout / close admin
function closeAdmin() {
  // hapus token
  localStorage.removeItem('adminToken');
  // sembunyikan panel, tampilkan login
  document.getElementById('adminPanel').classList.add('hidden');
  document.getElementById('loginContainer').classList.remove('hidden');
}
