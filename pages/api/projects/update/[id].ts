import type { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { id } = req.query;
  const {
    name,
    client_name,
    start_date,
    location,
    budget,
    actual,
    status,
  } = req.body;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Missing or invalid project ID' });
  }

  try {
    const query = `
      UPDATE projects
      SET name = $1,
          client_name = $2,
          start_date = $3,
          location = $4,
          budget = $5,
          actual = $6,
          status = $7
      WHERE id = $8
    `;

    const values = [
      name,
      client_name,
      start_date,
      location,
      parseFloat(budget),
      parseFloat(actual),
      status,
      id,
    ];

    await pool.query(query, values);
    res.status(200).json({ message: 'Project updated successfully' });
  } catch (err: any) {
    console.error('Error updating project:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}
