import { NextResponse } from 'next/server';
import { getSessionFromRequest } from '../_utils/session';
import { query } from '../_utils/db';

export async function POST(req) {
  try {
    const session = getSessionFromRequest(req);
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'ACCESS_DENIED: Admin permissions required.' }, { status: 403 });
    }

    const { id, title, date } = await req.json();

    if (!title || !date) {
      return NextResponse.json({ error: 'Title and date are required.' }, { status: 400 });
    }

    const targetId = id || `dl-${Date.now()}`;

    let parsedDate;
    if (typeof date === 'string') {
      if (!date.includes('Z') && !/[+-]\d{2}:?\d{2}$/.test(date)) {
        const hasSeconds = date.split(':').length === 3;
        parsedDate = new Date(`${date}${hasSeconds ? '' : ':00'}+08:00`);
      } else {
        parsedDate = new Date(date);
      }
    } else {
      parsedDate = new Date(date);
    }

    // Upsert into Supabase
    await query(
      `INSERT INTO deadlines (id, title, date, created_by)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (id) DO UPDATE SET
         title = EXCLUDED.title,
         date = EXCLUDED.date,
         created_by = EXCLUDED.created_by`,
      [targetId, title, parsedDate, session.username]
    );

    // Log to audit log
    await query(
      `INSERT INTO audit_logs (actor, action, details) VALUES ($1, $2, $3)`,
      [session.username, 'DEADLINE_SAVED', `Admin saved deadline: "${title}" set to ${date}`]
    );

    return NextResponse.json({ success: true, message: 'Deadline saved successfully.', id: targetId });
  } catch (err) {
    console.error('adminSaveDeadline API error:', err);
    return NextResponse.json({ error: 'Failed to save deadline.' }, { status: 500 });
  }
}
