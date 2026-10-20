import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

export async function POST(req) {
  try {
    const { action, email, password } = await req.json();
    const pool = getPool();

    if (action === 'register') {
      const [existing] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
      if (existing.length > 0) {
        return NextResponse.json({ error: 'Email sudah terdaftar!' }, { status: 400 });
      }
      await pool.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, password]);
      return NextResponse.json({ message: 'Registrasi berhasil!' });
    }

    if (action === 'login') {
      const [rows] = await pool.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
      if (rows.length === 0) {
        return NextResponse.json({ error: 'Email atau password salah!' }, { status: 401 });
      }
      return NextResponse.json({ message: 'Login berhasil!', user: { email: rows[0].email } });
    }

    return NextResponse.json({ error: 'Aksi tidak valid' }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}