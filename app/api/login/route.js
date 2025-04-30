import { pool } from '../../../utils/db';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    const client = await pool.connect();
    const result = await client.query(
      'SELECT * FROM admin WHERE email = $1 AND password = $2',
      [email, password]
    );
    client.release();

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    return NextResponse.json({ message: 'Login successful' });
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
