import { NextResponse } from 'next/server';
import { getSessionFromRequest } from '../../_utils/session';
import { query } from '../../_utils/db';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    const session = getSessionFromRequest(req);
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'ACCESS_DENIED: Admin access required.' }, { status: 403 });
    }

    const { targetUsername, newPassword } = await req.json();
    if (!targetUsername || !newPassword || newPassword.length < 8) {
      return NextResponse.json({ error: 'INVALID_INPUT: Password must be at least 8 characters long.' }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update in database
    const updateSql = 'UPDATE users SET password_hash = $1 WHERE username = $2';
    const dbRes = await query(updateSql, [hashedPassword, targetUsername]);

    // Log the change in audit_logs
    const logSql = 'INSERT INTO audit_logs (actor, action, details) VALUES ($1, $2, $3)';
    await query(logSql, [
      session.username,
      'RESET_PASSWORD',
      `Password reset for user account: ${targetUsername}`
    ]);

    return NextResponse.json({ success: true, message: `Password for ${targetUsername} has been reset successfully.` });
  } catch (err) {
    console.error('resetUserPassword API error:', err);
    return NextResponse.json({ error: 'Failed to reset user password.' }, { status: 500 });
  }
}
