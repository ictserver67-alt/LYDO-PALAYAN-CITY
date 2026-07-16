import { NextResponse } from 'next/server';
import { getSessionFromRequest } from '../../_utils/session';
import { query } from '../../_utils/db';

export async function POST(req) {
  try {
    const session = getSessionFromRequest(req);
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'ACCESS_DENIED: Admin permissions required.' }, { status: 403 });
    }

    const { username } = await req.json();

    if (!username) {
      return NextResponse.json({ error: 'Missing username.' }, { status: 400 });
    }

    // Approve the user
    await query('UPDATE users SET is_approved = true WHERE username = $1', [username]);

    // Log the action
    await query(
      `INSERT INTO audit_logs (actor, action, details) VALUES ($1, $2, $3)`,
      [session.username, 'APPROVE_USER', `Approved user account: ${username}`]
    );

    return NextResponse.json({ success: true, message: `Account "${username}" approved successfully.` });
  } catch (err) {
    console.error('Approve user error:', err);
    return NextResponse.json({ error: 'Failed to approve user account.' }, { status: 500 });
  }
}
