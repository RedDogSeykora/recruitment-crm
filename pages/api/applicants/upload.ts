import type { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const applicants = req.body;

  if (!Array.isArray(applicants)) {
    return res.status(400).json({ message: 'Invalid data format' });
  }

  try {
    console.log("Received applicants:", applicants);
    console.log('Applicants to insert:', applicants);

    const insertQuery = `
      INSERT INTO applicants (
        project_id, name, phone, email, location, status
      ) VALUES ($1, $2, $3, $4, $5, $6)
    `;

    for (const a of applicants) {
        try {
          await pool.query(
            `INSERT INTO applicants (
              project_id, name, phone, email, location, status
            ) VALUES ($1, $2, $3, $4, $5, $6)`,
            [
              a.project_id,
              a.name,
              a.phone,
              a.email,
              a.location,
              a.status || 'Inactive',
            ]
          );
        } catch (err) {
          console.error('Insert error for applicant:', a, err);
        }
      }
      
    res.status(200).json({ message: 'Upload successful' });
  } catch (error) {
    console.error('Error uploading applicants:', error);
    res.status(500).json({ message: 'Server error' });
  }
}
