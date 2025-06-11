import type { NextApiRequest, NextApiResponse } from 'next';
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for AWS RDS without cert verification
  },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { project_id } = req.query;

  if (!project_id) {
    return res.status(400).json({ message: 'Missing project_id' });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM applicants WHERE project_id = $1',
      [project_id]
    );

    res.status(200).json(result.rows);
  } catch (err: any) {
    console.error('❌ Error fetching applicants:', err);
    res.status(500).json({ message: 'Database query failed', error: err.message });
  }
}
