'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [userEmail, setUserEmail] = useState('');
  const [username, setUsername] = useState('sarah');
  const [bio, setBio] = useState("bf'eafbuxvubiaiaeibca;cgui");
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const [transactions, setTransactions] = useState([
    { id: 1, title: 'bakso', amount: 20000, date: '2026-01-01', category: 'makanan' },
    { id: 2, title: 'dimsum', amount: 45000, date: '2026-01-01', category: 'makanan' },
    { id: 3, title: 'dalgona', amount: 10000, date: '2026-01-01', category: 'minuman' },
    { id: 4, title: 'susu', amount: 10000, date: '2026-01-02', category: 'minuman' },
    { id: 5, title: 'roti', amount: 20000, date: '2026-01-02', category: 'makanan' },
    { id: 6, title: 'mie ayam', amount: 15000, date: '2026-01-03', category: 'makanan' },
    { id: 7, title: 'es teh manis', amount: 5000, date: '2026-01-03', category: 'minuman' },
    { id: 8, title: 'bensin motor', amount: 25000, date: '2026-01-04', category: 'transportasi' },
    { id: 9, title: 'seblak pedas', amount: 18000, date: '2026-01-04', category: 'makanan' },
    { id: 10, title: 'kopi susu', amount: 12000, date: '2026-01-05', category: 'minuman' },
    { id: 11, title: 'siomay', amount: 10000, date: '2026-01-05', category: 'makanan' },
    { id: 12, title: 'parkir', amount: 3000, date: '2026-01-06', category: 'transportasi' },
    { id: 13, title: 'martabak manis', amount: 30000, date: '2026-01-06', category: 'makanan' },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [settingsView, setSettingsView] = useState('main'); 
  const [settingsModal, setSettingsModal] = useState(null); 

  const [searchQuery, setSearchQuery] = useState('');
  const [batasHarian, setBatasHarian] = useState(45000);
  const [inputBatas, setInputBatas] = useState(45000);

  // States Notifikasi
  const [notifDicatat, setNotifDicatat] = useState(true);
  const [notifMendekati, setNotifMendekati] = useState(true);
  const [notifMelebihi, setNotifMelebihi] = useState(true);
  const [notifIngatkan, setNotifIngatkan] = useState(true);
  const [jamIngat, setJamIngat] = useState('20');
  const [menitIngat, setMenitIngat] = useState('00');

  // States Privasi
  const [tampilkanAkun, setTampilkanAkun] = useState(true);
  const [tampilkanEmail, setTampilkanEmail] = useState(true);
  const [riwayatPengeluaranActive, setRiwayatPengeluaranActive] = useState(true);
  const [persenMendekati, setPersenMendekati] = useState('70%');
  const [autoLogoutVal, setAutoLogoutVal] = useState('5 menit');
  const [deleteOptions, setDeleteOptions] = useState({ hariIni: true, mingguIni: false, bulanIni: false, semua: false });

  // States Bahasa & Rating
  const [selectedLanguage, setSelectedLanguage] = useState('indonesia');
  const [ratingVal, setRatingVal] = useState(0);

  // Form states
  const [profileForm, setProfileForm] = useState({ name: '', email: '', bio: '' });
  const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [pinForm, setPinForm] = useState({ newPin: '', confirmPin: '' });

  const getTodayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [form, setForm] = useState({ title: '', amount: '', date: getTodayString() });
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const router = useRouter();

  const loadTransactions = async (email) => {
    try {
      const res = await fetch(`/api/transactions?email=${encodeURIComponent(email)}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setTransactions(data);
        }
      }
    } catch (err) {
      console.log('Pakai data lokal');
    }
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail) return;

      try {
        const response = await fetch(`/api/transactions?user_email=${userEmail}`);
        const data = await response.json();

        if (response.ok) {
          setTransactions(data);
        }
      } catch (error) {
        console.error('Gagal memuat data transaksi:', error);
      }
    };

    fetchTransactions();
  }, []);

  const formatDateString = (dateVal) => {
    if (!dateVal) return getTodayString();
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return String(dateVal).split('T')[0];
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatGroupHeaderDate = (dateStr) => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const days = ['minggu', 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'];
    const months = ['jan', 'feb', 'mar', 'apr', 'mei', 'jun', 'jul', 'agust', 'sep', 'okt', 'nov', 'des'];
    
    const dayName = days[d.getDay()];
    const dayNum = String(d.getDate()).padStart(2, '0');
    const monthName = months[d.getMonth()];
    const yearShort = String(d.getFullYear()).slice(-2);

    return `${dayName}, ${dayNum}-${monthName}-${yearShort}`;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ambil email user yang sedang login dari localStorage
    const userEmail = localStorage.getItem('userEmail');

    if (!userEmail) {
      alert('Sesi login tidak ditemukan, silakan login ulang.');
      return;
    }

    const newTransaction = {
      title: form.title,
      amount: Number(form.amount),
      date: form.date || getTodayString(),
      type: form.type || 'Pengeluaran', // Pastikan form punya pilihan 'Pemasukan' atau 'Pengeluaran'
      user_email: userEmail
    };

    try {
      // Kirim data ke API backend untuk disimpan ke database Aiven
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTransaction),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Gagal menyimpan transaksi');
      }

      // Jika sukses di database, perbarui tampilan/state lokal
      setTransactions((prev) => [{ ...newTransaction, id: result.id }, ...prev]);

      // Reset form dan tutup modal
      setForm({ title: '', amount: '', date: getTodayString() });
      setShowModal(false);
      alert('Transaksi berhasil disimpan ke database!');

    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({ 
      title: item.title, 
      amount: item.amount, 
      date: formatDateString(item.date) 
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Hapus pengeluaran ini?')) {
      setTransactions((prev) => prev.filter((item) => item.id !== id));
      try {
        await fetch('/api/transactions', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }),
        });
      } catch (err) {}
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    router.push('/login');
  };

  const handleSimpanBatas = (e) => {
    e.preventDefault();
    setBatasHarian(Number(inputBatas));
    alert('Batas pengeluaran harian berhasil diubah!');
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setUsername(profileForm.name);
    setUserEmail(profileForm.email);
    setBio(profileForm.bio);
    setSettingsModal(null);
    alert('Profil berhasil diperbarui!');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePassword = (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('Konfirmasi password tidak cocok!');
      return;
    }
    setSettingsModal(null);
    setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    alert('Password berhasil diubah!');
  };

  const handleSavePin = (e) => {
    e.preventDefault();
    if (pinForm.newPin !== pinForm.confirmPin) {
      alert('Konfirmasi PIN tidak cocok!');
      return;
    }
    setSettingsModal(null);
    setPinForm({ newPin: '', confirmPin: '' });
    alert('PIN aplikasi berhasil diaktifkan!');
  };

  const groupedTransactions = transactions.reduce((groups, item) => {
    const dateKey = formatDateString(item.date);
    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push(item);
    return groups;
  }, {});

  const filteredGroupKeys = Object.keys(groupedTransactions).filter((dateKey) => {
    const headerTitle = formatGroupHeaderDate(dateKey).toLowerCase();
    return headerTitle.includes(searchQuery.toLowerCase().trim());
  });

  const todayStr = getTodayString();
  const todayTransactions = transactions.filter((t) => formatDateString(t.date) === todayStr);
  const displayHomeList = todayTransactions.length > 0 ? todayTransactions : transactions;

  const totalPengeluaran = displayHomeList.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
  const sisaUang = batasHarian - totalPengeluaran;
  const isAman = sisaUang >= 0;

  return (
    <div className="simku-layout">
      {/* Sidebar Navigasi Collapsible */}
      <aside className={`simku-sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <div>
          <div className="brand-header">
            <div className="brand-icon">
              <i className="fa-solid fa-wallet"></i>
            </div>
            
            <span className="brand-title-text">SIMKU</span>
            
            <button 
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="btn-toggle-sidebar"
              title={isSidebarCollapsed ? "Buka Sidebar" : "Tutup Sidebar"}
            >
              <i className={`fa-solid ${isSidebarCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'}`}></i>
            </button>
          </div>

          <div className="sidebar-menu">
            <button 
              onClick={() => { setActiveTab('home'); setSettingsView('main'); }} 
              className={`menu-icon-btn ${activeTab === 'home' ? 'active' : ''}`}
              title="Home"
            >
              <i className="fa-solid fa-house"></i>
              {!isSidebarCollapsed && <span>Home</span>}
            </button>

            <button 
              onClick={() => { setActiveTab('chart'); setSettingsView('main'); }} 
              className={`menu-icon-btn ${activeTab === 'chart' ? 'active' : ''}`}
              title="Riwayat"
            >
              <i className="fa-solid fa-chart-column"></i>
              {!isSidebarCollapsed && <span>Riwayat</span>}
            </button>

            <button 
              onClick={() => { setActiveTab('timer'); setSettingsView('main'); }} 
              className={`menu-icon-btn ${activeTab === 'timer' ? 'active' : ''}`}
              title="Batas"
            >
              <i className="fa-solid fa-stopwatch"></i>
              {!isSidebarCollapsed && <span>Batas</span>}
            </button>

            <button 
              onClick={() => { setActiveTab('notif'); setSettingsView('main'); }} 
              className={`menu-icon-btn ${activeTab === 'notif' ? 'active' : ''}`}
              title="Notifikasi"
            >
              <i className="fa-solid fa-bell"></i>
              {!isSidebarCollapsed && <span>Notifikasi</span>}
            </button>

            <button 
              onClick={() => setActiveTab('settings')} 
              className={`menu-icon-btn ${activeTab === 'settings' ? 'active' : ''}`}
              title="Pengaturan"
            >
              <i className="fa-solid fa-gear"></i>
              {!isSidebarCollapsed && <span>Pengaturan</span>}
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <button 
            onClick={() => setSettingsModal('exitAccount')} 
            className="btn-logout-sidebar"
            style={{ marginBottom: '16px', padding: '10px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '8px', fontWeight: 'bold', width: '100%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            title="Logout"
          >
            <i className="fa-solid fa-right-from-bracket"></i>
            {!isSidebarCollapsed && <span>Logout</span>}
          </button>
          <div className="sidebar-footer-illustration">
            <i className="fa-solid fa-sack-dollar"></i>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="simku-main">
        {/* --- TAB 1: HOME --- */}
        {activeTab === 'home' && (
          <>
            <h1 className="greeting-text">Hallo, {username}</h1>
            <div className="summary-grid">
              <div className="summary-card">
                <label>total pengeluaran</label>
                <div className="val val-black">Rp {totalPengeluaran.toLocaleString('id-ID')}</div>
              </div>
              <div className="summary-card">
                <label>batas harian</label>
                <div className="val val-red">Rp {batasHarian.toLocaleString('id-ID')}</div>
              </div>
              <div className="summary-card">
                <label>sisa uang</label>
                <div className="val" style={{ color: isAman ? '#16a34a' : '#dc2626' }}>
                  Rp {sisaUang.toLocaleString('id-ID')}
                </div>
              </div>
            </div>

            {/* Banner Status */}
            <div className="status-banner" style={{ backgroundColor: isAman ? '#dc2626' : '#991b1b' }}>
              <div className="status-icon-circle">
                <i className={`fa-solid ${isAman ? 'fa-check' : 'fa-xmark'}`}></i>
              </div>
              <div className="status-text">
                {isAman ? 'pengeluaran hari ini masih aman' : 'pengeluaran melebihi batas harian!'}
              </div>
            </div>

            <div className="expenses-box">
              <div className="expenses-header">
                <span>pengeluaran hari ini :</span>
                <button 
                  onClick={() => { setEditingId(null); setForm({ title: '', amount: '', date: getTodayString() }); setShowModal(true); }} 
                  className="btn-add-red"
                >
                  <i className="fa-solid fa-plus"></i>
                </button>
              </div>

              <div className="table-subtitle">
                <div>nama pengeluaran</div>
                <div className="text-center">harga</div>
                <div className="text-right">tanggal</div>
              </div>

              <div className="expense-list">
                {displayHomeList.map((item) => (
                  <div key={item.id} className="expense-card-item">
                    <div className="item-left">
                      <span className="item-title">{item.title}</span>
                      <span className="item-date">{formatDateString(item.date)}</span>
                    </div>
                    <div className="item-right">
                      <span className="item-price">{Number(item.amount).toLocaleString('id-ID')}</span>
                      <div className="item-actions">
                        <button onClick={() => handleEdit(item)} className="btn-link-edit">edit</button>
                        <button onClick={() => handleDelete(item.id)} className="btn-link-delete">hapus</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* --- TAB 2: RIWAYAT PENGELUARAN --- */}
        {activeTab === 'chart' && (
          <div>
            <h1 className="riwayat-header-title">Riwayat pengeluaran</h1>
            <div className="search-bar-red">
              <i className="fa-solid fa-magnifying-glass"></i>
              <input 
                type="text" 
                placeholder="search (misal: senin, 01-jan)" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <hr style={{ border: 'none', borderTop: '1px solid #cbd5e1', marginBottom: '24px' }} />

            <div className="riwayat-container-grid">
              <div className="riwayat-scroll-list">
                {filteredGroupKeys.map((dateKey) => (
                  <div key={dateKey} className="day-group-card">
                    <div className="day-title">{formatGroupHeaderDate(dateKey)}</div>
                    {groupedTransactions[dateKey].map((item) => (
                      <div key={item.id} className="day-item-row">
                        <span style={{ textTransform: 'lowercase' }}>{item.title}</span>
                        <span>{Number(item.amount).toLocaleString('id-ID')}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              <div>
                <div className="chart-card-box">
                  <div className="donut-chart-mock">
                    <div className="donut-inner-hole"></div>
                  </div>
                  <div className="chart-legend">
                    <div style={{ color: '#16a34a' }}>makanan: 60%</div>
                    <div style={{ color: '#0284c7' }}>minuman: 20%</div>
                    <div style={{ color: '#ea580c' }}>transportasi: 10%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 3: BATAS PENGELUARAN --- */}
        {activeTab === 'timer' && (
          <div>
            <h1 className="batas-title">batas pengeluaran</h1>

            <div className="batas-grid-layout">
              <div className="batas-left-column">
                <div className="batas-stat-card">
                  <div className="batas-warning-icon">
                    <i className="fa-solid fa-triangle-exclamation"></i>
                  </div>
                  <div className="batas-stat-info">
                    <div>total hari ini : Rp {totalPengeluaran.toLocaleString('id-ID')}</div>
                    <div>batas harian : Rp {batasHarian.toLocaleString('id-ID')}</div>
                    <div>sisa batas : Rp {sisaUang.toLocaleString('id-ID')}</div>
                  </div>
                </div>

                <div className="batas-status-pink">
                  <i className={`fa-solid ${isAman ? 'fa-circle-check' : 'fa-circle-xmark'}`} style={{ fontSize: '20px', color: isAman ? '#16a34a' : '#dc2626' }}></i>
                  <span>{isAman ? 'Pengeluaran hari ini masih aman' : 'Pengeluaran hari ini tidak aman'}</span>
                </div>

                <form onSubmit={handleSimpanBatas} className="batas-form-card">
                  <label>atur batas pengeluaran harian</label>
                  <input 
                    type="number" 
                    value={inputBatas} 
                    onChange={(e) => setInputBatas(e.target.value)}
                    className="batas-input-box"
                    required
                  />
                  <button type="submit" className="batas-btn-simpan">
                    simpan
                  </button>
                </form>
              </div>

              <div className="batas-tips-card">
                <h3>tips hemat hari ini</h3>
                <p>
                  catat setiap pengeluaran kecil harianmu secara rutin, karena pengeluaran kecil yang terabaikan seringkali menjadi penyebab utama anggaran bulanan cepat habis tanpa disadari!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 4: NOTIFIKASI --- */}
        {activeTab === 'notif' && (
          <div>
            <h1 className="notif-title">notifikasi</h1>

            <div className="notif-scroll-container">
              <div className="notif-card-danger">
                <div className="notif-icon-circle-danger">
                  <i className="fa-solid fa-triangle-exclamation"></i>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <strong>⚠️ Pengeluaran hampir mencapai batas</strong>
                  <span>Sisa uang jajan hari ini Rp 5.000</span>
                </div>
              </div>

              <div className="notif-card-danger">
                <div className="notif-icon-circle-danger">
                  <i className="fa-solid fa-triangle-exclamation"></i>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <strong>⚠️ Pengeluaran hampir mencapai batas</strong>
                  <span>Sisa uang jajan hari ini Rp 15.000</span>
                </div>
              </div>

              <div className="notif-card-safe">
                <div className="notif-icon-circle-safe">
                  <i className="fa-solid fa-shield-halved"></i>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <strong>Pengeluaran hari ini aman</strong>
                  <span>atur pengeluaranmu lebih baik!!</span>
                </div>
              </div>

              <div className="notif-card-safe">
                <div className="notif-icon-circle-safe">
                  <i className="fa-solid fa-shield-halved"></i>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <strong>Pengeluaran hari ini aman</strong>
                  <span>atur pengeluaranmu lebih baik!!</span>
                </div>
              </div>

              <div className="notif-card-danger">
                <div className="notif-icon-circle-danger">
                  <i className="fa-solid fa-triangle-exclamation"></i>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <strong>⚠️ Pengeluaran hampir mencapai batas</strong>
                  <span>Sisa uang jajan hari ini Rp 2.000</span>
                </div>
              </div>

              <div className="notif-card-safe">
                <div className="notif-icon-circle-safe">
                  <i className="fa-solid fa-shield-halved"></i>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <strong>Pengeluaran hari ini aman</strong>
                  <span>selalu catat pengeluaran harianmu!</span>
                </div>
              </div>

              <div className="notif-card-danger">
                <div className="notif-icon-circle-danger">
                  <i className="fa-solid fa-triangle-exclamation"></i>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <strong>⚠️ Pengeluaran hampir mencapai batas</strong>
                  <span>Sisa uang jajan hari ini Rp 1.000</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 5: PENGATURAN --- */}
        {activeTab === 'settings' && (
          <div>
            {settingsView === 'main' && (
              <>
                <h1 className="settings-header-title">pengaturan</h1>

                <div className="settings-group-box">
                  <div className="settings-group-header">Akun saya</div>
                  <div className="settings-item-row" onClick={() => setSettingsView('account')}>
                    <span>keamanan & akun</span>
                    <i className="fa-solid fa-chevron-right"></i>
                  </div>
                  <div className="settings-item-row" onClick={() => setSettingsModal('exitAccount')}>
                    <span>ganti akun / keluar</span>
                    <i className="fa-solid fa-chevron-right"></i>
                  </div>
                </div>

                <div className="settings-group-box">
                  <div className="settings-group-header">Pengaturan</div>
                  <div className="settings-item-row" onClick={() => setSettingsView('notif')}>
                    <span>pengaturan notifikasi</span>
                    <i className="fa-solid fa-chevron-right"></i>
                  </div>
                  <div className="settings-item-row" onClick={() => setSettingsView('privacy')}>
                    <span>pengaturan privasi</span>
                    <i className="fa-solid fa-chevron-right"></i>
                  </div>
                  <div className="settings-item-row" onClick={() => setSettingsView('language')}>
                    <span>bahasa</span>
                    <i className="fa-solid fa-chevron-right"></i>
                  </div>
                </div>

                <div className="settings-group-box">
                  <div className="settings-group-header">Bantuan</div>
                  <div className="settings-item-row" onClick={() => setSettingsView('help')}>
                    <span>pusat bantuan</span>
                    <i className="fa-solid fa-chevron-right"></i>
                  </div>
                  <div className="settings-item-row" onClick={() => setSettingsView('policy')}>
                    <span>kebijakan</span>
                    <i className="fa-solid fa-chevron-right"></i>
                  </div>
                  <div className="settings-item-row" onClick={() => setSettingsView('info')}>
                    <span>informasi</span>
                    <i className="fa-solid fa-chevron-right"></i>
                  </div>
                  <div className="settings-item-row" onClick={() => setSettingsModal('rating')}>
                    <span>suka SIMKU? nilai kami</span>
                    <i className="fa-solid fa-chevron-right"></i>
                  </div>
                </div>
              </>
            )}

            {settingsView === 'account' && (
              <>
                <div className="subpage-back-header">
                  <button onClick={() => setSettingsView('main')} className="back-btn-circle">
                    <i className="fa-solid fa-arrow-left"></i>
                  </button>
                  <h1 className="settings-header-title" style={{ marginBottom: 0 }}>keamanan & akun</h1>
                </div>

                <div className="account-info-card">
                  <div className="account-profile-left">
                    <div className="profile-avatar-circle" style={{ overflow: 'hidden' }}>
                      {avatarUrl ? (
                        <img src={avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <i className="fa-solid fa-user"></i>
                      )}
                    </div>
                    <div className="profile-detail-text">
                      <h3>{username}</h3>
                      <p>{userEmail}</p>
                      <span>Bio : {bio}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setProfileForm({ name: username, email: userEmail, bio: bio });
                      setSettingsModal('editProfile');
                    }}
                    className="btn-edit-profile-pink"
                  >
                    Edit profil
                  </button>
                </div>

                <div className="security-card-group">
                  <div className="security-card-title">keamanan</div>
                  <div className="security-item-row" onClick={() => setSettingsModal('password')}>
                    <span>ubah pasword</span>
                    <i className="fa-solid fa-chevron-right"></i>
                  </div>
                  <div className="security-item-row" onClick={() => setSettingsModal('pin')}>
                    <span>aktifkan PIN aplikasi</span>
                    <i className="fa-solid fa-chevron-right"></i>
                  </div>
                </div>

                <div className="verification-card-group">
                  <div className="security-card-title" style={{ color: 'white' }}>verifikasi</div>
                  <div className="verification-item-row">
                    <span>email</span>
                    <span className="verif-tag-safe">terverifikasi</span>
                  </div>
                  <div className="verification-item-row">
                    <span>nomor telepon</span>
                    <span className="verif-tag-pending">belum terverifikasi</span>
                  </div>
                </div>
              </>
            )}

            {settingsView === 'notif' && (
              <>
                <div className="subpage-back-header">
                  <button onClick={() => setSettingsView('main')} className="back-btn-circle">
                    <i className="fa-solid fa-arrow-left"></i>
                  </button>
                  <h1 className="settings-header-title" style={{ marginBottom: 0 }}>pengaturan notifikasi</h1>
                </div>

                <div className="notif-settings-box">
                  <div className="notif-toggle-item">
                    <div className="notif-toggle-info">
                      <span className="notif-toggle-title">pengeluaran dicaat</span>
                      <span className="notif-toggle-sub">notifikasi saat kamu menambah pengeluaran</span>
                    </div>
                    <label className="switch">
                      <input type="checkbox" checked={notifDicatat} onChange={(e) => setNotifDicatat(e.target.checked)} />
                      <span className="slider"></span>
                    </label>
                  </div>

                  <div className="notif-toggle-item">
                    <div className="notif-toggle-info">
                      <span className="notif-toggle-title">mendekati batas harian</span>
                      <span className="notif-toggle-sub">muncul saat uang &lt;20%</span>
                    </div>
                    <label className="switch">
                      <input type="checkbox" checked={notifMendekati} onChange={(e) => setNotifMendekati(e.target.checked)} />
                      <span className="slider"></span>
                    </label>
                  </div>

                  <div className="notif-toggle-item">
                    <div className="notif-toggle-info">
                      <span className="notif-toggle-title">melebihi batas harian</span>
                      <span className="notif-toggle-sub">peringatan saat batas terlampaui</span>
                    </div>
                    <label className="switch">
                      <input type="checkbox" checked={notifMelebihi} onChange={(e) => setNotifMelebihi(e.target.checked)} />
                      <span className="slider"></span>
                    </label>
                  </div>

                  <div className="notif-toggle-item">
                    <div className="notif-toggle-info">
                      <span className="notif-toggle-title">ingatkan catat pengeluaran harian</span>
                      <span className="notif-toggle-sub">jam {jamIngat}.{menitIngat}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <button onClick={() => setSettingsModal('timePicker')} className="btn-atur-small">atur</button>
                      <label className="switch">
                        <input type="checkbox" checked={notifIngatkan} onChange={(e) => setNotifIngatkan(e.target.checked)} />
                        <span className="slider"></span>
                      </label>
                    </div>
                  </div>
                </div>
              </>
            )}

            {settingsView === 'privacy' && (
              <>
                <div className="subpage-back-header">
                  <button onClick={() => setSettingsView('main')} className="back-btn-circle">
                    <i className="fa-solid fa-arrow-left"></i>
                  </button>
                  <h1 className="settings-header-title" style={{ marginBottom: 0 }}>pengaturan privasi</h1>
                </div>

                <div className="privacy-settings-box">
                  <div className="privacy-section-card">
                    <span className="privacy-section-title">privasi akun</span>
                    <div className="privacy-item-row" onClick={() => setSettingsModal('nearLimit')}>
                      <span>mendekati batas harian</span>
                      <i className="fa-solid fa-chevron-right"></i>
                    </div>
                    <div className="privacy-item-row">
                      <span>tampilkan akun</span>
                      <label className="switch">
                        <input type="checkbox" checked={tampilkanAkun} onChange={(e) => setTampilkanAkun(e.target.checked)} />
                        <span className="slider"></span>
                      </label>
                    </div>
                    <div className="privacy-item-row">
                      <span>tampilkan email</span>
                      <label className="switch">
                        <input type="checkbox" checked={tampilkanEmail} onChange={(e) => setTampilkanEmail(e.target.checked)} />
                        <span className="slider"></span>
                      </label>
                    </div>
                  </div>

                  <div className="privacy-section-card">
                    <span className="privacy-section-title">data dan aktifikasi</span>
                    <div className="privacy-item-row">
                      <span>riwayat pengeluaran</span>
                      <label className="switch">
                        <input type="checkbox" checked={riwayatPengeluaranActive} onChange={(e) => setRiwayatPengeluaranActive(e.target.checked)} />
                        <span className="slider"></span>
                      </label>
                    </div>
                    <div className="privacy-item-row" onClick={() => setSettingsModal('deleteHistory')}>
                      <span>hapus riwayat</span>
                      <i className="fa-solid fa-chevron-right"></i>
                    </div>
                  </div>

                  <div className="privacy-section-card">
                    <span className="privacy-section-title">keamanan data</span>
                    <div className="privacy-item-row" onClick={() => setSettingsModal('autoLogout')}>
                      <span>kunci aplikasi / logout otomatis</span>
                      <label className="switch">
                        <input type="checkbox" checked={true} readOnly />
                        <span className="slider"></span>
                      </label>
                    </div>
                  </div>
                </div>
              </>
            )}

            {settingsView === 'language' && (
              <>
                <div className="subpage-back-header">
                  <button onClick={() => setSettingsView('main')} className="back-btn-circle">
                    <i className="fa-solid fa-arrow-left"></i>
                  </button>
                  <h1 className="settings-header-title" style={{ marginBottom: 0 }}>bahasa</h1>
                </div>

                <div className="language-box">
                  <label className="radio-option-item">
                    <input type="radio" name="lang" checked={selectedLanguage === 'indonesia'} onChange={() => setSelectedLanguage('indonesia')} />
                    <span>bahasa indonesia (default)</span>
                  </label>
                  <label className="radio-option-item">
                    <input type="radio" name="lang" checked={selectedLanguage === 'minang'} onChange={() => setSelectedLanguage('minang')} />
                    <span>bahasa minang</span>
                  </label>
                  <label className="radio-option-item">
                    <input type="radio" name="lang" checked={selectedLanguage === 'sunda'} onChange={() => setSelectedLanguage('sunda')} />
                    <span>bahasa sunda</span>
                  </label>
                  <label className="radio-option-item">
                    <input type="radio" name="lang" checked={selectedLanguage === 'jawa'} onChange={() => setSelectedLanguage('jawa')} />
                    <span>bahasa jawa</span>
                  </label>

                  <button onClick={() => { alert('Bahasa berhasil diubah!'); setSettingsView('main'); }} className="btn-popup-red" style={{ marginTop: '12px', width: '120px' }}>
                    simpan
                  </button>
                </div>
              </>
            )}

            {settingsView === 'help' && (
              <>
                <div className="subpage-back-header">
                  <button onClick={() => setSettingsView('main')} className="back-btn-circle">
                    <i className="fa-solid fa-arrow-left"></i>
                  </button>
                  <h1 className="settings-header-title" style={{ marginBottom: 0 }}>pusat bantuan</h1>
                </div>

                <div className="help-center-box">
                  <div className="help-search-bar">
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <input type="text" placeholder="cari bantuan" />
                  </div>

                  <div className="help-contact-list">
                    <span className="help-contact-title">Hubungi Kami</span>
                    <span className="help-contact-item">Email</span>
                    <span className="help-contact-item">WhatsApp</span>
                    <span className="help-contact-item">Form</span>
                  </div>
                </div>
              </>
            )}

            {settingsView === 'policy' && (
              <>
                <div className="subpage-back-header">
                  <button onClick={() => setSettingsView('main')} className="back-btn-circle">
                    <i className="fa-solid fa-arrow-left"></i>
                  </button>
                  <h1 className="settings-header-title" style={{ marginBottom: 0 }}>kebijakan privasi</h1>
                </div>

                <div className="info-policy-container">
                  <div className="info-policy-card">
                    <div className="info-policy-icon-circle">
                      <i className="fa-regular fa-file-lines"></i>
                    </div>
                    <div className="info-policy-content">
                      <span className="info-policy-title">Data yang dikumpulkan:</span>
                      <ul className="info-policy-list">
                        <li>Nama pengguna</li>
                        <li>Email</li>
                        <li>Data pengeluaran jajan</li>
                      </ul>
                    </div>
                  </div>

                  <div className="info-policy-card">
                    <div className="info-policy-icon-circle">
                      <i className="fa-regular fa-folder"></i>
                    </div>
                    <div className="info-policy-content">
                      <span className="info-policy-title">Data digunakan untuk:</span>
                      <ul className="info-policy-list">
                        <li>penyimpanan data pengeluaran</li>
                        <li>menampilkan riwaya dan ringkasan</li>
                      </ul>
                    </div>
                  </div>

                  <div className="info-policy-card">
                    <div className="info-policy-icon-circle">
                      <i className="fa-solid fa-user-shield"></i>
                    </div>
                    <div className="info-policy-content">
                      <span className="info-policy-title">Data tidak dibagikan:</span>
                      <p style={{ fontSize: '13px', marginTop: '2px' }}>
                        data tidak dibagikan ke pihak ke3 tanpa persetujuan pengguna
                      </p>
                    </div>
                  </div>

                  <div className="info-policy-card">
                    <div className="info-policy-icon-circle">
                      <i className="fa-regular fa-user"></i>
                    </div>
                    <div className="info-policy-content">
                      <span className="info-policy-title">Tanggung jawab pengguna:</span>
                      <ul className="info-policy-list">
                        <li>pengguna bertanggung jawab atas akun sendiri</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </>
            )}

            {settingsView === 'info' && (
              <>
                <div className="subpage-back-header">
                  <button onClick={() => setSettingsView('main')} className="back-btn-circle">
                    <i className="fa-solid fa-arrow-left"></i>
                  </button>
                  <h1 className="settings-header-title" style={{ marginBottom: 0 }}>informasi</h1>
                </div>

                <div className="info-policy-container">
                  <div className="info-policy-card">
                    <div className="info-policy-icon-circle">
                      <i className="fa-solid fa-circle-info"></i>
                    </div>
                    <div className="info-policy-content">
                      <span className="info-policy-title">Tentang aplikasi:</span>
                      <p style={{ fontSize: '13px', lineHeight: '1.5', marginTop: '2px' }}>
                        Aplikasi Pencatatan Uang Jajan adalah aplikasi berbasis web yang membantu pengguna mencatat, memantau, dan mengatur pengeluaran jajan harian agar lebih terkontrol.
                      </p>
                    </div>
                  </div>

                  <div className="info-policy-card">
                    <div className="info-policy-icon-circle">
                      <i className="fa-solid fa-bullseye"></i>
                    </div>
                    <div className="info-policy-content">
                      <span className="info-policy-title">Tujuan Aplikasi</span>
                      <ul className="info-policy-list">
                        <li>Membantu mengelola pengeluaran jajan</li>
                        <li>Melatih kebiasaan mencatat keuangan</li>
                        <li>Sebagai aplikasi latihan CRUD</li>
                      </ul>
                    </div>
                  </div>

                  <div className="info-policy-card">
                    <div className="info-policy-icon-circle">
                      <i className="fa-solid fa-list-check"></i>
                    </div>
                    <div className="info-policy-content">
                      <span className="info-policy-title">Fitur Utama</span>
                      <ul className="info-policy-list">
                        <li>Pencatatan pengeluaran</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </main>

      {/* --- MODALS --- */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3 style={{ marginBottom: '16px' }}>{editingId ? 'Edit Pengeluaran' : 'Tambah Pengeluaran'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nama Pengeluaran</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="form-control" placeholder="bakso / dimsum" />
              </div>
              <div className="form-group">
                <label>Harga (Rp)</label>
                <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required className="form-control" placeholder="20000" />
              </div>
              <div className="form-group">
                <label>Tanggal</label>
                <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required className="form-control" />
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                <button type="submit" className="auth-button" style={{ marginTop: 0 }}>Simpan</button>
                <button type="button" onClick={() => setShowModal(false)} style={{ width: '100%', height: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', background: 'white', fontWeight: 600, cursor: 'pointer' }}>Batal</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {settingsModal === 'editProfile' && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3 style={{ marginBottom: '16px', fontStyle: 'italic' }}>edit profil</h3>
            <form onSubmit={handleSaveProfile}>
              <div className="form-group">
                <label>foto profil</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  className="form-control" 
                  style={{ paddingTop: '6px' }}
                />
              </div>
              <div className="form-group">
                <label>nama</label>
                <input type="text" value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} required className="form-control" />
              </div>
              <div className="form-group">
                <label>email</label>
                <input type="email" value={profileForm.email} onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })} required className="form-control" />
              </div>
              <div className="form-group">
                <label>bio</label>
                <input type="text" value={profileForm.bio} onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })} className="form-control" />
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                <button type="submit" className="auth-button" style={{ marginTop: 0 }}>simpan</button>
                <button type="button" onClick={() => setSettingsModal(null)} style={{ width: '100%', height: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', background: 'white', fontWeight: 600, cursor: 'pointer' }}>batal</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {settingsModal === 'password' && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3 style={{ marginBottom: '16px', fontStyle: 'italic' }}>ubah pasword</h3>
            <form onSubmit={handleSavePassword}>
              <div className="form-group">
                <label>pasword lama</label>
                <input type="password" placeholder="******" value={passwordForm.oldPassword} onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })} required className="form-control" />
              </div>
              <div className="form-group">
                <label>pasword baru</label>
                <input type="password" placeholder="******" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} required className="form-control" />
              </div>
              <div className="form-group">
                <label>konfirmasi pasword</label>
                <input type="password" placeholder="******" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} required className="form-control" />
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                <button type="submit" className="auth-button" style={{ marginTop: 0 }}>simpan</button>
                <button type="button" onClick={() => setSettingsModal(null)} style={{ width: '100%', height: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', background: 'white', fontWeight: 600, cursor: 'pointer' }}>batal</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {settingsModal === 'pin' && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3 style={{ marginBottom: '16px', fontStyle: 'italic' }}>aktifkan PIN aplikasi</h3>
            <form onSubmit={handleSavePin}>
              <div className="form-group">
                <label>buat PIN baru</label>
                <input type="password" placeholder="******" maxLength={6} value={pinForm.newPin} onChange={(e) => setPinForm({ ...pinForm, newPin: e.target.value })} required className="form-control" />
              </div>
              <div className="form-group">
                <label>konfirmasi PIN</label>
                <input type="password" placeholder="******" maxLength={6} value={pinForm.confirmPin} onChange={(e) => setPinForm({ ...pinForm, confirmPin: e.target.value })} required className="form-control" />
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                <button type="submit" className="auth-button" style={{ marginTop: 0 }}>simpan</button>
                <button type="button" onClick={() => setSettingsModal(null)} style={{ width: '100%', height: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', background: 'white', fontWeight: 600, cursor: 'pointer' }}>batal</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {settingsModal === 'nearLimit' && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px' }}>mendekati batas harian</h3>
            <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px' }}>aktifkan peringatan saat pengeluaran hampir mencapaian batas harian</p>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', fontStyle: 'italic', color: '#64748b' }}>batas harian</label>
              <div style={{ backgroundColor: '#dc2626', color: 'white', padding: '8px', borderRadius: '8px', textAlign: 'center', fontWeight: 'bold', fontSize: '14px', marginTop: '4px', maxWidth: '140px' }}>
                Rp {batasHarian.toLocaleString('id-ID')}
              </div>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>ingatkan saat mencapai</p>
              <div className="modal-check-list" style={{ margin: 0 }}>
                {['70 %', '80 %', '90 %'].map((p) => (
                  <label key={p} className="radio-option-item">
                    <input type="radio" name="persen" checked={persenMendekati === p} onChange={() => setPersenMendekati(p)} />
                    <span>{p}</span>
                  </label>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setSettingsModal(null)} className="btn-popup-red">batal</button>
              <button onClick={() => { alert('Pengaturan batas disimpan!'); setSettingsModal(null); }} className="btn-popup-red">simpan</button>
            </div>
          </div>
        </div>
      )}

      {settingsModal === 'deleteHistory' && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px' }}>hapus riwayat pengeluaran?</h3>
            <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px' }}>semua data yg dikeluarkan akan dihapus dan tidak bisa dikembalikan</p>
            <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>pilih data yg ingin di hapus</p>
            <div className="modal-check-list">
              <label className="checkbox-option-item">
                <input type="checkbox" checked={deleteOptions.hariIni} onChange={(e) => setDeleteOptions({ ...deleteOptions, hariIni: e.target.checked })} />
                <span>hari ini</span>
              </label>
              <label className="checkbox-option-item">
                <input type="checkbox" checked={deleteOptions.mingguIni} onChange={(e) => setDeleteOptions({ ...deleteOptions, mingguIni: e.target.checked })} />
                <span>minggu ini</span>
              </label>
              <label className="checkbox-option-item">
                <input type="checkbox" checked={deleteOptions.bulanIni} onChange={(e) => setDeleteOptions({ ...deleteOptions, bulanIni: e.target.checked })} />
                <span>bulan ini</span>
              </label>
              <label className="checkbox-option-item">
                <input type="checkbox" checked={deleteOptions.semua} onChange={(e) => setDeleteOptions({ ...deleteOptions, semua: e.target.checked })} />
                <span>semua riwayat</span>
              </label>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setSettingsModal(null)} className="btn-popup-red">batal</button>
              <button onClick={() => { alert('Riwayat berhasil dihapus!'); setSettingsModal(null); }} className="btn-popup-red">hapus</button>
            </div>
          </div>
        </div>
      )}

      {settingsModal === 'autoLogout' && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px' }}>logout otomatis</h3>
            <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px' }}>keluar otomatis setelah</p>
            <div className="modal-check-list" style={{ marginBottom: '20px' }}>
              {['5 menit', '15 menit', '30 menit'].map((m) => (
                <label key={m} className="radio-option-item">
                  <input type="radio" name="autologout" checked={autoLogoutVal === m} onChange={() => setAutoLogoutVal(m)} />
                  <span>{m}</span>
                </label>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setSettingsModal(null)} className="btn-popup-red">batal</button>
              <button onClick={() => { alert(`Logout otomatis diset ${autoLogoutVal}`); setSettingsModal(null); }} className="btn-popup-red">simpan</button>
            </div>
          </div>
        </div>
      )}

      {settingsModal === 'exitAccount' && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px' }}>keluar dari akun?</h3>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>kamu akan keluar dari akun SIMKU di perangkat ini.</p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setSettingsModal('switchAccount')} className="btn-popup-red">ganti akun</button>
              <button onClick={() => setSettingsModal('logoutConfirm')} className="btn-popup-red">keluar</button>
              <button onClick={() => setSettingsModal('deleteConfirm')} className="btn-popup-red">hapus akun</button>
            </div>
          </div>
        </div>
      )}

      {settingsModal === 'switchAccount' && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px' }}>ganti akun</h3>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '12px' }}>pilih akun yg tersedia</p>
            <ul style={{ paddingLeft: '20px', marginBottom: '16px', fontSize: '14px', fontWeight: 'bold' }}>
              <li>{userEmail || 'ghinanur@gmail.com'}</li>
            </ul>
            <div style={{ marginBottom: '20px' }}>
              <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px' }}>akun lain</p>
              <button onClick={handleLogout} className="btn-popup-red" style={{ padding: '8px 14px', fontSize: '12px' }}>tambah / login</button>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setSettingsModal(null)} className="btn-popup-red">batal</button>
              <button onClick={() => { setSettingsModal(null); alert('Akun aktif dipilih!'); }} className="btn-popup-red">lanjut</button>
            </div>
          </div>
        </div>
      )}

      {settingsModal === 'logoutConfirm' && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px' }}>keluar</h3>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>yakin ingin keluar dari akun ini</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setSettingsModal(null)} className="btn-popup-red">batal</button>
              <button onClick={handleLogout} className="btn-popup-red">keluar</button>
            </div>
          </div>
        </div>
      )}

      {settingsModal === 'deleteConfirm' && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px' }}>hapus akun</h3>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>yakin ingin menghapus akun</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setSettingsModal(null)} className="btn-popup-red">batal</button>
              <button onClick={() => { alert('Akun berhasil dihapus!'); handleLogout(); }} className="btn-popup-red">hapus</button>
            </div>
          </div>
        </div>
      )}

      {settingsModal === 'timePicker' && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '12px' }}>atur peringatan</h3>
            <p style={{ fontSize: '13px', color: '#64748b' }}>pilih jam</p>
            <div className="time-picker-row">
              <div className="time-picker-box">
                <button type="button" onClick={() => setJamIngat(String((Number(jamIngat) + 1) % 24).padStart(2, '0'))} className="time-picker-btn">+</button>
                <div className="time-picker-val">{jamIngat}</div>
                <button type="button" onClick={() => setJamIngat(String((Number(jamIngat) - 1 + 24) % 24).padStart(2, '0'))} className="time-picker-btn">-</button>
              </div>
              <span style={{ fontWeight: 'bold' }}>:</span>
              <div className="time-picker-box">
                <button type="button" onClick={() => setMenitIngat(String((Number(menitIngat) + 5) % 60).padStart(2, '0'))} className="time-picker-btn">+</button>
                <div className="time-picker-val">{menitIngat}</div>
                <button type="button" onClick={() => setMenitIngat(String((Number(menitIngat) - 5 + 60) % 60).padStart(2, '0'))} className="time-picker-btn">-</button>
              </div>
              <button type="button" onClick={() => setSettingsModal(null)} className="btn-popup-red" style={{ flex: 'none', padding: '8px 20px', marginLeft: '12px' }}>simpan</button>
            </div>
          </div>
        </div>
      )}

      {settingsModal === 'rating' && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '8px' }}>
              kamu akan keluar dari akun SIMKU di perangkat ini.
            </p>
            <div className="rating-stars-row">
              {[1, 2, 3, 4, 5].map((star) => (
                <i 
                  key={star} 
                  className={`fa-solid fa-star ${star <= ratingVal ? 'star-active' : ''}`}
                  onClick={() => setRatingVal(star)}
                ></i>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '20px' }}>
              <button onClick={() => setSettingsModal(null)} className="btn-popup-red">nanti saja</button>
              <button onClick={() => { alert(`Terima kasih memberi nilai ${ratingVal} bintang!`); setSettingsModal(null); }} className="btn-popup-red">nilai sekarang</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}