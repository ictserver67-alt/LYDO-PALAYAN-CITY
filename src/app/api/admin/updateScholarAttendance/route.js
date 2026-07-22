import { NextResponse } from 'next/server';
import { getSessionFromRequest } from '../../_utils/session';
import { query } from '../../_utils/db';

export async function POST(req) {
  try {
    const session = getSessionFromRequest(req);
    if (!session || (session.role !== 'encoder' && session.role !== 'admin')) {
      return NextResponse.json({ error: 'ACCESS_DENIED: Access restricted to encoders and admins only.' }, { status: 403 });
    }

    const { id, appeared } = await req.json();

    if (!id || appeared === undefined) {
      return NextResponse.json({ error: 'Missing ID or attendance status' }, { status: 400 });
    }

    await query(
      `UPDATE scholar_applications SET appeared = $1 WHERE id = $2`,
      [appeared ? true : false, id]
    );

    // Log the action
    await query(
      `INSERT INTO audit_logs (actor, action, details) VALUES ($1, $2, $3)`,
      [session.username, 'UPDATE_SCHOLAR_ATTENDANCE', `Updated attendance of scholar ID: ${id} to ${appeared ? 'Appeared' : 'Absent'}`]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Update scholar attendance error:', err);
    return NextResponse.json({ error: `Failed to update attendance: ${err.message}` }, { status: 500 });
  }
}
