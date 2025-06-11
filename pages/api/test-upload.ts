import type { NextApiRequest, NextApiResponse } from 'next';
const { Pool } = require('pg'); // Use require to avoid ESModule import issues

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const testApplicant = {
      project_id: '00000000-0000-0000-0000-000000000000', // replace with a real UUID in your table
      name: 'Test User',
      phone: '555-1234',
      email: 'test@example.com',
      location: 'Testville',
      status: 'applied',
    };

    const result = await pool.query(
      `INSERT INTO applicants (project_id, name, phone, email, location, status)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [
        testApplicant.project_id,
        testApplicant.name,
        testApplicant.phone,
        testApplicant.email,
        testApplicant.location,
        testApplicant.status,
      ]
    );

    res.status(200).json({ message: 'Test insert successful', result: result.rows });
  } catch (error) {
    console.error('Test insert failed:', error);
    res.status(500).json({ message: 'Test insert failed', error });
  }
}
