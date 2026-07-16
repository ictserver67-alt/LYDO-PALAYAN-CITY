import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { query } from '../_utils/db';

export async function POST(req) {
  try {
    const { username, password, displayName, role, barangay } = await req.json();

    if (!username || !password || !displayName || !role) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    if (role !== 'SK' && role !== 'LYDC') {
      return NextResponse.json({ error: 'Invalid role for self-registration.' }, { status: 400 });
    }
    
    if (role === 'SK' && !barangay) {
      return NextResponse.json({ error: 'Barangay is required for SK.' }, { status: 400 });
    }

    const cleanedUsername = username.toLowerCase().trim();

    // Check if username is taken
    const checkRes = await query('SELECT username FROM users WHERE username = $1', [cleanedUsername]);
    if (checkRes.rows.length > 0) {
      return NextResponse.json({ error: 'Username is already taken.' }, { status: 400 });
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters long.' }, { status: 400 });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert user into DB as unapproved
    await query(
      `INSERT INTO users (username, password_hash, role, barangay, display_name, is_approved)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [cleanedUsername, passwordHash, role, role === 'SK' ? barangay : null, displayName, false]
    );

    // Add audit log
    await query(
      `INSERT INTO audit_logs (actor, action, details) VALUES ($1, $2, $3)`,
      [cleanedUsername, 'USER_REGISTER', `Officer self-registered (Pending Approval): ${cleanedUsername} as ${role}`]
    );

    return NextResponse.json({ success: true, message: 'Registration successful! Your account is pending administrator approval before you can log in.' });
  } catch (err) {
    console.error('Registration API error:', err);
    return NextResponse.json({ error: 'Failed to complete registration.' }, { status: 500 });
  }
}
