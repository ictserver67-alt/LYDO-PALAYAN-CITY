import { NextResponse } from 'next/server';
import { getSessionFromRequest } from '../../_utils/session';
import { query } from '../../_utils/db';
import { formatFullName } from '../../_utils/nameHelper';

export async function POST(req) {
  try {
    const session = getSessionFromRequest(req);
    // Only encoders and admins can update scholar records
    if (!session || (session.role !== 'encoder' && session.role !== 'admin')) {
      return NextResponse.json({ error: 'ACCESS_DENIED: Access restricted to encoders and admins only.' }, { status: 403 });
    }

    const data = await req.json();

    if (!data.id) {
      return NextResponse.json({ error: 'Missing application ID' }, { status: 400 });
    }

    const firstName = (data.firstName || '').trim();
    const middleName = (data.middleName || '').trim();
    const lastName = (data.lastName || '').trim();
    const suffix = (data.suffix || '').trim();

    let studentFullName = (data.studentFullName || '').trim();
    if (!studentFullName && (firstName || lastName)) {
      studentFullName = formatFullName({ firstName, middleName, lastName, suffix });
    }

    const updateQuery = `
      UPDATE scholar_applications
      SET
        student_full_name = $1,
        first_name = $2,
        middle_name = $3,
        last_name = $4,
        suffix = $5,
        date_of_birth = $6,
        sex = $7,
        barangay = $8,
        contact_number = $9,
        email = $10,
        school = $11,
        school_year = $12,
        is_solo_parent_beneficiary = $13,
        is_orphan = $14,
        is_pwd = $15,
        is_ip = $16,
        is_out_of_school_youth = $17,
        special_circumstances_specify = $18,
        status = $19
      WHERE id = $20
    `;

    const values = [
      studentFullName,
      firstName || null,
      middleName || null,
      lastName || null,
      suffix || null,
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
      data.id
    ];

    await query(updateQuery, values);

    // Log the action
    await query(
      `INSERT INTO audit_logs (actor, action, details) VALUES ($1, $2, $3)`,
      [session.username, 'UPDATE_SCHOLAR', `Updated scholar application ID: ${data.id}`]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Update scholar error:', err);
    return NextResponse.json({ error: 'Failed to update scholar application' }, { status: 500 });
  }
}
