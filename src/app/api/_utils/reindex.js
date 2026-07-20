import { query } from './db';

export async function reindexScholars() {
  const sql = `
    WITH reordered AS (
      SELECT id, ROW_NUMBER() OVER (ORDER BY date_filed ASC) as new_seq
      FROM scholar_applications
    )
    UPDATE scholar_applications
    SET application_no = 'AFS-' || LPAD(reordered.new_seq::text, 5, '0')
    FROM reordered
    WHERE scholar_applications.id = reordered.id;
  `;
  await query(sql);
}
