import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Required for Supabase
});

export async function POST(req) {
  try {
    const { email, firstName, lastName, password, confirmPassword } = await req.json();

    if (!email || !firstName || !lastName || !password || !confirmPassword) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format." }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match." }, { status: 400 });
    }

    const client = await pool.connect();
    const existing = await client.query("SELECT * FROM Admin WHERE Email = $1", [email]);
    if (existing.rows.length > 0) {
      client.release();
      return NextResponse.json({ error: "Email already exists." }, { status: 400 });
    }

    await client.query(
      "INSERT INTO admin (email, fname, lname, password) VALUES ($1, $2, $3, $4)",
      [email, firstName, lastName, password]
    );

    client.release();
    return NextResponse.json({ message: "Account created successfully." }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
