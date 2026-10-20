import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email dan password wajib diisi!' }, 
        { status: 400 }
      );
    }

    const pool = getPool();

    await pool.query(
      'INSERT INTO users (email, password) VALUES (?, ?)',
      [email, password]
    );

    return NextResponse.json(
      { message: 'Registrasi berhasil!' }, 
      { status: 201 }
    );
  } catch (error) {
    console.error('ERROR REGISTER:', error);

    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json(
        { error: 'Email sudah terdaftar!' }, 
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Gagal menyimpan data ke database' }, 
      { status: 500 }
    );
  }
}