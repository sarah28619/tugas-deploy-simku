'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Pastikan ada kata 'export default' di depan nama fungsi komponenmu
export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Konfirmasi password tidak cocok!');
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Gagal mendaftarkan akun');
      }

      alert('Akun berhasil dibuat dan tersimpan di database!');
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', email);
      router.push('/dashboard');
      
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: '0 0 4px 0' }}>SIMKU</h1>
          <p style={{ fontSize: '13px', color: '#64748b', margin: 0, fontStyle: 'italic' }}>sistem manajement keuangan</p>
        </div>

        <h2 className="auth-title">Buat Akun Baru</h2>
        <p className="auth-subtitle">Mulai atur dan pantau batas pengeluaranmu</p>

        <form onSubmit={handleRegister}>
          <div className="auth-form-group">
            <label>Email</label>
            <input 
              type="email" 
              className="auth-input" 
              placeholder="nama@email.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div className="auth-form-group">
            <label>Password</label>
            <input 
              type="password" 
              className="auth-input" 
              placeholder="********" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <div className="auth-form-group">
            <label>Konfirmasi Password</label>
            <input 
              type="password" 
              className="auth-input" 
              placeholder="********" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required 
            />
          </div>

          <button type="submit" className="auth-submit-btn">
            Daftar Sekarang
          </button>
        </form>

        <p className="auth-footer-text">
          Sudah memiliki akun? <Link href="/login">Masuk di Sini</Link>
        </p>
      </div>
    </div>
  );
}