import type { NextApiRequest, NextApiResponse } from "next";
import pool from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const parsedId = Array.isArray(id) ? id[0] : id;

  if (req.method === "GET") {
    try {
      const result = await pool.query(
        `SELECT * FROM employees WHERE id = $1`,
        [parsedId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Employee not found" });
      }
      const projectsResult = await pool.query(
        `SELECT 
           ph.*, 
           p.name AS project_name
         FROM project_history ph
         JOIN projects p ON ph.project_id = p.id
         WHERE ph.employee_id = $1
         ORDER BY ph.start_date DESC`,
        [parsedId]
      );
      return res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to fetch employee" });
    }
  } else if (req.method === "PUT") {
    const { notes, status, blacklisted, end_date } = req.body;
    try {
      const result = await pool.query(
        `UPDATE employees
         SET notes = $1,
             status = $2,
             blacklisted = $3,
             end_date = $4
         WHERE id = $5
         RETURNING *`,
        [notes, status, blacklisted, end_date, parsedId]
      );
      return res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to update employee" });
    }
  } else {
    res.setHeader("Allow", ["GET", "PUT"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
