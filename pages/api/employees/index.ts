import type { NextApiRequest, NextApiResponse } from "next";
import pool from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const result = await pool.query("SELECT * FROM employees ORDER BY created_at DESC");
      res.status(200).json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch employees" });
    }
  }

  if (req.method === "POST") {
    const { full_name, position, location, start_date, status, notes, email, phone } = req.body;
    try {
      const result = await pool.query(
        `INSERT INTO employees (full_name, position, location, start_date, status, notes, email, phone)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [full_name, position, location, start_date, status, notes, email, phone]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to add employee" });
    }
  }
}
