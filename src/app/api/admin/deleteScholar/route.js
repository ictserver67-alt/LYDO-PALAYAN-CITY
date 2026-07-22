import { NextResponse } from 'next/server';
import { getSessionFromRequest } from '../../_utils/session';
import { query } from '../../_utils/db';
import { reindexScholars } from '../../_utils/reindex';

export async function POST(req) {
  try {
    const session = getSessionFromRequest(req);
    // Only admins and encoders can delete scholar records
    if (!session || (session.role !== 'admin' && session.role !== 'encoder')) {
      return NextResponse.json({ error: 'ACCESS_DENIED: Access restricted to admins and encoders.' }, { status: 403 });
    }

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Missing application ID' }, { status: 400 });
    }

    // Delete the scholar application
    await query('DELETE FROM scholar_applications WHERE id = $1', [id]);

    // Re-index all application numbers sequentially to fill the gap
    await reindexScholars();

    // Log the action
    await query(
      `INSERT INTO audit_logs (actor, action, details) VALUES ($1, $2, $3)`,
      [session.username, 'DELETE_SCHOLAR', `Deleted scholar application ID: ${id}`]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Delete scholar error:', err);
    return NextResponse.json({ error: `Failed to delete scholar application: ${err.message}` }, { status: 500 });
  }
}
