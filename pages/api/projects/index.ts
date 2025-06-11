import type { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const result = await pool.query(`
      SELECT
        id,
        name,
        start_date AS "startDate",
        location,
        budget,
        actual,
        status,
        client_name
      FROM projects
      ORDER BY start_date DESC
    `);
    

    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching projects:', err);
    res.status(500).json({ message: 'Error loading projects' });
  }
}
