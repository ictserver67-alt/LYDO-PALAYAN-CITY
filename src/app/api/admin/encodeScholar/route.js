import { NextResponse } from 'next/server';
import { getSessionFromRequest } from '../../_utils/session';
import { query } from '../../_utils/db';

export async function POST(req) {
  try {
    const session = getSessionFromRequest(req);
    // Only encoders and admins can encode scholars
    if (!session || (session.role !== 'encoder' && session.role !== 'admin')) {
      return NextResponse.json({ error: 'ACCESS_DENIED: Access restricted to encoders and admins only.' }, { status: 403 });
    }

    const data = await req.json();

    // Required fields check (minimal checking)
    if (!data.studentFullName || !data.dateOfBirth || !data.sex || !data.barangay) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Atomic generation of AFS application number & insertion
    const insertQuery = `
      INSERT INTO scholar_applications (
        application_no,
        student_full_name,
        date_of_birth,
        sex,
        barangay,
        contact_number,
        email,
        school,
        school_year,
        is_solo_parent_beneficiary,
        is_orphan,
        is_pwd,
        is_ip,
        is_out_of_school_youth,
        special_circumstances_specify,
        status,
        evaluated_by,
        evaluated_at
      )
      VALUES (
        'AFS-' || LPAD(nextval('scholar_afs_seq')::text, 5, '0'),
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
        $11, $12, $13, $14, $15, $16, NOW()
      )
      RETURNING application_no
    `;

    const values = [
      data.studentFullName,
      data.dateOfBirth,
      data.sex,
      data.barangay,
      data.contactNumber || '',
      data.email || '',
      data.school || '',
      data.schoolYear || '',
      data.isSoloParentBeneficiary ? true : false,
      data.isOrphan ? true : false,
      data.isPwd ? true : false,
      data.isIp ? true : false,
      data.isOutOfSchoolYouth ? true : false,
      data.specialCircumstancesSpecify || null,
      data.status || 'Pending',
      session.username // evaluated_by is the encoder
    ];

    await query(insertQuery, values);

    // Re-index all application numbers sequentially
    const { reindexScholars } = require('../../_utils/reindex');
    await reindexScholars();

    // Fetch the final assigned application_no
    const finalRes = await query(
      `SELECT application_no FROM scholar_applications 
       WHERE student_full_name = $1 AND date_of_birth = $2 
       ORDER BY date_filed DESC LIMIT 1`,
      [data.studentFullName, data.dateOfBirth]
    );
    const newAfs = finalRes.rows[0]?.application_no || 'AFS-00001';

    // Log the action
    await query(
      `INSERT INTO audit_logs (actor, action, details) VALUES ($1, $2, $3)`,
      [session.username, 'ENCODE_SCHOLAR', `Encoded new scholar application: ${newAfs}`]
    );

    return NextResponse.json({ success: true, applicationNo: newAfs });
  } catch (err) {
    console.error('Encode scholar error:', err);
    return NextResponse.json({ error: `Failed to encode scholar application: ${err.message}` }, { status: 500 });
  }
}
