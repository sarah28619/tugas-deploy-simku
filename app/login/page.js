'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    if (email && password) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', email);
      router.push('/dashboard');
    } else {
      alert('Mohon isi email dan password!');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Header Tanpa Ikon, di Tengah dengan Subteks */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: '0 0 4px 0' }}>SIMKU</h1>
          <p style={{ fontSize: '13px', color: '#64748b', margin: 0, fontStyle: 'italic' }}>sistem manajement keuangan</p>
        </div>

        <h2 className="auth-title">Masuk ke Akun Anda</h2>
        <p className="auth-subtitle">Kelola pencatatan keuangan harian dengan mudah</p>

        <form onSubmit={handleLogin}>
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

          <button type="submit" className="auth-submit-btn">
            Masuk
          </button>
        </form>

        <p className="auth-footer-text">
          Belum punya akun? <Link href="/register">Daftar Sekarang</Link>
        </p>
      </div>
    </div>
  );
}