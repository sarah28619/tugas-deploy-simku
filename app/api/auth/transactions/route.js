import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

export async function GET(req) {
  try {
    const pool = getPool();
    const [rows] = await pool.query('SELECT * FROM transactions ORDER BY date DESC, id DESC');
    return NextResponse.json(rows);
  } catch (err) {
    return NextResponse.json([]);
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { title, amount, date, user_email, category } = body;
    const pool = getPool();

    const itemTitle = title || 'Pengeluaran';
    const itemAmount = Number(amount) || 0;
    const itemDate = date || new Date().toISOString().split('T')[0];
    const itemEmail = user_email || '';
    const itemCategory = category || 'makanan';

    try {
      const [result] = await pool.query(
        'INSERT INTO transactions (title, amount, date, user_email, type, category) VALUES (?, ?, ?, ?, ?, ?)',
        [itemTitle, itemAmount, itemDate, itemEmail, 'Pengeluaran', itemCategory]
      );
      return NextResponse.json({ message: 'Berhasil', insertId: result.insertId });
    } catch (e) {
      const [result] = await pool.query(
        'INSERT INTO transactions (title, amount, date) VALUES (?, ?, ?)',
        [itemTitle, itemAmount, itemDate]
      );
      return NextResponse.json({ message: 'Berhasil', insertId: result.insertId });
    }
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { id } = await req.json();
    const pool = getPool();
    await pool.query('DELETE FROM transactions WHERE id = ?', [id]);
    return NextResponse.json({ message: 'Berhasil dihapus' });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}