import type { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid project ID' });
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const result = await pool.query(
      `SELECT id, name, start_date AS "startDate", location, budget, actual, status, client_name
       FROM projects
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (err: any) {
    console.error('Error fetching project:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}
