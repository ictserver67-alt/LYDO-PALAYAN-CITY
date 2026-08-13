import { NextResponse } from 'next/server';
import { getSessionFromRequest } from '../../_utils/session';
import { query } from '../../_utils/db';

export async function POST(req) {
  try {
    const session = getSessionFromRequest(req);
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'ACCESS_DENIED: Admin access required.' }, { status: 403 });
    }

    // Reset appeared column to false
    const sql = 'UPDATE scholar_applications SET appeared = FALSE';
    const res = await query(sql);

    // Log this action in audit_logs
    const logSql = 'INSERT INTO audit_logs (actor, action, details) VALUES ($1, $2, $3)';
    await query(logSql, [
      session.username,
      'RESET_ATTENDANCE',
      `All scholar attendance records reset to unchecked (absent). Total rows updated: ${res.rowCount || 0}`
    ]);

    return NextResponse.json({ 
      success: true, 
      message: `All attendance records have been reset successfully. (${res.rowCount || 0} scholars updated)` 
    });
  } catch (err) {
    console.error('resetAttendance API error:', err);
    return NextResponse.json({ error: 'Failed to reset attendance.' }, { status: 500 });
  }
}
