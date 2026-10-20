import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

// GET: Ambil semua transaksi berdasarkan user_email
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const user_email = searchParams.get('user_email');

    const pool = getPool();
    let query = 'SELECT * FROM transactions ORDER BY date DESC, id DESC';
    let params = [];

    if (user_email) {
      query = 'SELECT * FROM transactions WHERE user_email = ? ORDER BY date DESC, id DESC';
      params = [user_email];
    }

    const [rows] = await pool.query(query, params);
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error('ERROR GET TRANSACTIONS:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Tambah transaksi baru ke database Aiven
export async function POST(request) {
  try {
    const { user_email, title, type, amount, date } = await request.json();

    if (!user_email || !title || !type || !amount || !date) {
      return NextResponse.json(
        { error: 'Semua field wajib diisi!' },
        { status: 400 }
      );
    }

    const pool = getPool();
    const [result] = await pool.query(
      'INSERT INTO transactions (user_email, title, type, amount, date) VALUES (?, ?, ?, ?, ?)',
      [user_email, title, type, amount, date]
    );

    return NextResponse.json(
      { message: 'Transaksi berhasil ditambahkan!', id: result.insertId },
      { status: 201 }
    );
  } catch (error) {
    console.error('ERROR POST TRANSACTION:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}