import type { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, startDate, location, budget, actual, status, client_name } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO projects (id, name, start_date, location, budget, actual, status, client_name)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [
        uuidv4(),
        name,
        startDate,
        location,
        budget,
        actual,
        (status || 'active').toLowerCase(),
        client_name,
      ]
    );

    res.status(200).json({ message: 'Project created', project: result.rows[0] });
  } catch (err) {
    const error = err as Error;
    console.error('❌ Failed to insert project:', error);
    res.status(500).json({ message: 'Database insert failed', error: error.message });
  }
}
