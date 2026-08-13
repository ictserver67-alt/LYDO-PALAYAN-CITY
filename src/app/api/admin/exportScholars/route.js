import { NextResponse } from 'next/server';
import { getSessionFromRequest } from '../../_utils/session';
import { query } from '../../_utils/db';
import * as XLSX from 'xlsx';

export async function GET(req) {
  try {
    const session = getSessionFromRequest(req);
    if (!session || (session.role !== 'admin' && session.role !== 'LYDC' && session.role !== 'encoder')) {
      return NextResponse.json({ error: 'ACCESS_DENIED: Restricted access.' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const scope = searchParams.get('scope') || 'all'; // 'all' or 'filtered'
    
    // Custom filter selections
    const statusFilter = searchParams.get('statusFilter') || 'all'; 
    const attendanceFilter = searchParams.get('attendanceFilter') || 'all'; 
    const barangayFilter = searchParams.get('barangayFilter') || 'All';
    const circumstanceFilter = searchParams.get('circumstanceFilter') || 'all';
    
    // Search / Main Filter params (only if scope is filtered)
    const search = searchParams.get('search');
    const mainBarangay = searchParams.get('mainBarangay');
    const mainStatus = searchParams.get('mainStatus');

    // 1. Fetch all applications
    const sql = 'SELECT * FROM scholar_applications ORDER BY application_no ASC';
    const res = await query(sql);
    let rows = res.rows || [];

    // 2. Apply main filters (if scope is 'filtered')
    if (scope === 'filtered') {
      if (mainBarangay && mainBarangay !== 'All') {
        rows = rows.filter(r => r.barangay === mainBarangay);
      }
      if (mainStatus && mainStatus !== 'All') {
        rows = rows.filter(r => r.status === mainStatus);
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

    // 3. Apply custom export filters
    // Barangay filter
    if (barangayFilter !== 'All') {
      rows = rows.filter(r => r.barangay === barangayFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      const statusMap = {
        pending: 'Pending',
        approved: 'Approved',
        rejected: 'Rejected'
      };
      if (statusMap[statusFilter]) {
        rows = rows.filter(r => r.status === statusMap[statusFilter]);
      }
    }

    // Attendance filter
    if (attendanceFilter === 'present') {
      rows = rows.filter(r => r.appeared === true);
    } else if (attendanceFilter === 'absent') {
      rows = rows.filter(r => r.appeared !== true);
    }

    // Circumstances filter
    if (circumstanceFilter === 'solo_parent') {
      rows = rows.filter(r => r.is_solo_parent_beneficiary === true);
    } else if (circumstanceFilter === 'orphan') {
      rows = rows.filter(r => r.is_orphan === true);
    } else if (circumstanceFilter === 'pwd') {
      rows = rows.filter(r => r.is_pwd === true);
    } else if (circumstanceFilter === 'ip') {
      rows = rows.filter(r => r.is_ip === true);
    } else if (circumstanceFilter === 'osy') {
      rows = rows.filter(r => r.is_out_of_school_youth === true);
    } else if (circumstanceFilter === 'any') {
      rows = rows.filter(r => 
        r.is_solo_parent_beneficiary === true ||
        r.is_orphan === true ||
        r.is_pwd === true ||
        r.is_ip === true ||
        r.is_out_of_school_youth === true
      );
    }

    // 4. Map rows to Excel-friendly JSON objects
    const excelData = rows.map(r => {
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

      // Circumstances list
      const circs = [];
      if (r.is_solo_parent_beneficiary) circs.push('Solo Parent');
      if (r.is_orphan) circs.push('Orphan');
      if (r.is_pwd) circs.push('PWD');
      if (r.is_ip) circs.push('IP');
      if (r.is_out_of_school_youth) circs.push('OSY');

      return {
        'Application No': r.application_no || '',
        'Date Filed': dateFiled,
        'Full Name': r.student_full_name || '',
        'Date of Birth': bdate,
        'Sex': r.sex || '',
        'Barangay': r.barangay || '',
        'Contact Number': r.contact_number || '',
        'Email': r.email || '',
        'School': r.school || '',
        'School Year': r.school_year || '',
        'Attended (Appeared)': r.appeared ? 'YES' : 'NO',
        'Status': r.status === 'Pending' ? 'For Review' : (r.status === 'Approved' ? 'Approved' : 'Disapproved'),
        'Special Circumstances': circs.join(', ') || 'None',
        'Circumstances Specified': r.special_circumstances_specify || '',
        'Evaluated By': r.evaluated_by || '—',
        'Evaluated At': evaluatedAt
      };
    });

    // 5. Generate Workbook using SheetJS
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Scholars');

    // Auto-fit column widths
    const colWidths = [
      { wch: 15 }, // Application No
      { wch: 22 }, // Date Filed
      { wch: 26 }, // Full Name
      { wch: 14 }, // Date of Birth
      { wch: 8 },  // Sex
      { wch: 16 }, // Barangay
      { wch: 16 }, // Contact Number
      { wch: 25 }, // Email
      { wch: 25 }, // School
      { wch: 12 }, // School Year
      { wch: 20 }, // Attended (Appeared)
      { wch: 14 }, // Status
      { wch: 25 }, // Special Circumstances
      { wch: 25 }, // Circumstances Specified
      { wch: 15 }, // Evaluated By
      { wch: 22 }  // Evaluated At
    ];
    worksheet['!cols'] = colWidths;

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

    // 6. Return response
    return new Response(excelBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="scholars_export_${new Date().toISOString().slice(0, 10)}.xlsx"`
      }
    });

  } catch (err) {
    console.error('exportScholars Excel API error:', err);
    return NextResponse.json({ error: 'Failed to export scholar data in Excel format.' }, { status: 500 });
  }
}
