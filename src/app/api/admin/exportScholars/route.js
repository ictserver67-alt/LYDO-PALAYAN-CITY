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
    const scope = searchParams.get('scope') || 'all'; // 'all' or 'filtered'
    const statusFilter = searchParams.get('statusFilter') || 'all'; // 'all', 'present', 'pending', 'approved', 'rejected'
    const barangay = searchParams.get('barangay');
    const search = searchParams.get('search');

    // 1. Fetch all applications
    const sql = 'SELECT * FROM scholar_applications ORDER BY application_no ASC';
    const res = await query(sql);
    let rows = res.rows || [];

    // 2. Filter in JS
    if (scope === 'filtered') {
      if (barangay && barangay !== 'All') {
        rows = rows.filter(r => r.barangay === barangay);
      }
      if (search && search.trim() !== '') {
        const q = search.trim().toLowerCase();
        rows = rows.filter(r => 
          (r.student_full_name || '').toLowerCase().includes(q) ||
          (r.application_no || '').toLowerCase().includes(q) ||
          (r.school || '').toLowerCase().includes(q) ||
          (r.barangay || '').toLowerCase().includes(q) ||
          (r.email || '').toLowerCase().includes(q) ||
          (r.contact_number || '').toLowerCase().includes(q)
        );
      }
    }

    // Filter by export category
    if (statusFilter === 'present') {
      rows = rows.filter(r => r.appeared === true);
    } else if (statusFilter === 'pending') {
      rows = rows.filter(r => r.status === 'Pending');
    } else if (statusFilter === 'approved') {
      rows = rows.filter(r => r.status === 'Approved');
    } else if (statusFilter === 'rejected') {
      rows = rows.filter(r => r.status === 'Rejected');
    }

    // 3. Build CSV string
    const headers = [
      'Application No',
      'Date Filed',
      'Full Name',
      'Date of Birth',
      'Sex',
      'Barangay',
      'Contact Number',
      'Email',
      'School',
      'School Year',
      'Solo Parent Beneficiary',
      'Orphan',
      'PWD',
      'IP (Indigenous People)',
      'Out of School Youth',
      'Special Circumstances Specify',
      'Status',
      'Attended (Appeared)',
      'Evaluated By',
      'Evaluated At'
    ];

    const escapeCsvCell = (val) => {
      if (val === null || val === undefined) return '';
      let str = String(val);
      if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
        str = '"' + str.replace(/"/g, '""') + '"';
      }
      return str;
    };

    const csvRows = [headers.join(',')];

    for (const r of rows) {
      const bdate = r.date_of_birth ? new Date(r.date_of_birth).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        timeZone: 'Asia/Manila'
      }) : '—';

      const dateFiled = r.date_filed ? new Date(r.date_filed).toLocaleString('en-US', {
        timeZone: 'Asia/Manila'
      }) : '—';

      const evaluatedAt = r.evaluated_at ? new Date(r.evaluated_at).toLocaleString('en-US', {
        timeZone: 'Asia/Manila'
      }) : '—';

      const rowValues = [
        r.application_no,
        dateFiled,
        r.student_full_name,
        bdate,
        r.sex,
        r.barangay,
        r.contact_number,
        r.email,
        r.school,
        r.school_year,
        r.is_solo_parent_beneficiary ? 'Yes' : 'No',
        r.is_orphan ? 'Yes' : 'No',
        r.is_pwd ? 'Yes' : 'No',
        r.is_ip ? 'Yes' : 'No',
        r.is_out_of_school_youth ? 'Yes' : 'No',
        r.special_circumstances_specify || '',
        r.status,
        r.appeared ? 'Yes' : 'No',
        r.evaluated_by || '—',
        evaluatedAt
      ];

      csvRows.push(rowValues.map(escapeCsvCell).join(','));
    }

    const csvContent = csvRows.join('\n');

    // Return as downloadable file attachment
    return new Response(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="scholars_${statusFilter}_export_${new Date().toISOString().slice(0, 10)}.csv"`
      }
    });

  } catch (err) {
    console.error('exportScholars API error:', err);
    return NextResponse.json({ error: 'Failed to export scholar data.' }, { status: 500 });
  }
}
