import { NextResponse } from 'next/server';
import { getSessionFromRequest } from '../../_utils/session';
import { query } from '../../_utils/db';

export async function POST(req) {
  try {
    const session = getSessionFromRequest(req);
    if (!session || (session.role !== 'encoder' && session.role !== 'admin')) {
      return NextResponse.json({ error: 'ACCESS_DENIED: Access restricted to encoders and admins only.' }, { status: 403 });
    }

    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json({ error: 'Missing ID or status' }, { status: 400 });
    }

    await query(
      `UPDATE scholar_applications SET status = $1 WHERE id = $2`,
      [status, id]
    );

    // Log the action
    await query(
      `INSERT INTO audit_logs (actor, action, details) VALUES ($1, $2, $3)`,
      [session.username, 'UPDATE_SCHOLAR_STATUS', `Updated status of scholar ID: ${id} to ${status}`]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Update scholar status error:', err);
    return NextResponse.json({ error: `Failed to update status: ${err.message}` }, { status: 500 });
  }
}
