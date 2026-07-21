import { NextResponse } from 'next/server';
import { getSessionFromRequest } from '../../_utils/session';
import { query } from '../../_utils/db';

export async function GET(req) {
  try {
    const session = getSessionFromRequest(req);
    if (!session || (session.role !== 'admin' && session.role !== 'LYDC' && session.role !== 'encoder')) {
      return NextResponse.json({ error: 'ACCESS_DENIED: Restricted access.' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const barangay = searchParams.get('barangay');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, parseInt(searchParams.get('limit') || '10', 10));
    const offset = (page - 1) * limit;

    let whereClause = ' WHERE 1=1';
    const params = [];

    if (barangay && barangay !== 'All') {
      params.push(barangay);
      whereClause += ` AND barangay = $${params.length}`;
    }

    if (status && status !== 'All') {
      params.push(status);
      whereClause += ` AND status = $${params.length}`;
    }

    if (search && search.trim() !== '') {
      params.push(`%${search.trim()}%`);
      const pIdx = params.length;
      whereClause += ` AND (
        student_full_name ILIKE $${pIdx} OR 
        application_no ILIKE $${pIdx} OR 
        school ILIKE $${pIdx} OR 
        barangay ILIKE $${pIdx} OR 
        email ILIKE $${pIdx} OR 
        contact_number ILIKE $${pIdx}
      )`;
    }

    // 1. Total Count Query
    const countSql = `SELECT COUNT(*)::int as total FROM scholar_applications${whereClause}`;
    const countRes = await query(countSql, params);
    const total = parseInt(countRes.rows[0]?.total || '0', 10);

    // 2. Data Query with Pagination
    const dataParams = [...params, limit, offset];
    const dataSql = `SELECT * FROM scholar_applications${whereClause} ORDER BY date_filed DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    const dataRes = await query(dataSql, dataParams);

    const totalPages = Math.ceil(total / limit) || 1;

    return NextResponse.json({
      applications: dataRes.rows,
      total,
      page,
      limit,
      totalPages
    });
  } catch (err) {
    console.error('listApplications API error:', err);
    return NextResponse.json({ error: 'Failed to retrieve applications.' }, { status: 500 });
  }
}
