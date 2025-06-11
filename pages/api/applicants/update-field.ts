import type { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { applicant_id, field, value } = req.body;

  const allowedFields = [
    'last_contacted',
    'first_name',
    'last_name',
    'contact_result',
    'date_applied',
    'position',
    'phone',
    'email',
    'location',
    'source',
    'recruiter',
    'phone_screen_date',
    'phone_screen_time',
    'interview_date',
    'interview_time',
    'notes',
    'interviewed_by',
    'offer_date',
    'offer_amount',
    'hire_date',
    'decline_date',
    'decline_type',
    'reason_for_decline',
    'training_date',
  ];

  if (!allowedFields.includes(field)) {
    return res.status(400).json({ message: 'Invalid field for update' });
  }

  try {
    if (field === 'first_name' || field === 'last_name') {
      // First/last name special handling
      const { rows } = await pool.query('SELECT name FROM applicants WHERE id = $1', [applicant_id]);
      const currentName = rows[0]?.name || '';
  
      const currentFirstName = currentName.split(' ')[0] || '';
      const currentLastName = currentName.split(' ').slice(1).join(' ') || '';
  
      let newFullName = '';
  
      if (field === 'first_name') {
        newFullName = `${value} ${currentLastName}`.trim();
      } else if (field === 'last_name') {
        newFullName = `${currentFirstName} ${value}`.trim();
      }
  
      const updateQuery = 'UPDATE applicants SET name = $1 WHERE id = $2';
      await pool.query(updateQuery, [newFullName, applicant_id]);
  
    } else if (field === 'last_contacted') {
      // Special handling for last_contacted — update contacted too
      const updateQuery = 'UPDATE applicants SET last_contacted = $1, contacted = $2 WHERE id = $3';
      await pool.query(updateQuery, [value, value ? true : false, applicant_id]);
  
    } else {
      // Normal updates
      const query = `UPDATE applicants SET ${field} = $1 WHERE id = $2`;
      await pool.query(query, [value, applicant_id]);
    }
  
    res.status(200).json({ message: 'Field updated successfully' });
  
  } catch (err: any) {
    console.error('Error updating applicant field:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
  
  
}
