// pages/api/applicants/update-status.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { applicant_id, status } = req.body;

  if (!applicant_id || !status) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  try {
    await pool.query(
      `UPDATE applicants SET status = $1 WHERE id = $2`,
      [status, applicant_id]
    );
    res.status(200).json({ message: 'Status updated' });
  } catch (error: any) {
    console.error('Update failed:', error);
    res.status(500).json({ message: 'Failed to update status' });
  }
}
