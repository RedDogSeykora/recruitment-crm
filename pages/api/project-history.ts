import type { NextApiRequest, NextApiResponse } from "next";
import pool from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    let {
      employee_id,
      project_id,
      start_date,
      end_date,
      doors_per_hour,
      total_doors,
      survey_rate,
      total_hours,
    } = req.body;

    // Convert empty strings to null (PostgreSQL-safe)
    start_date = start_date?.trim() === "" ? null : start_date;
    end_date = end_date?.trim() === "" ? null : end_date;

    // Convert empty numbers to null (just in case)
    doors_per_hour = doors_per_hour === "" ? null : doors_per_hour;
    total_doors = total_doors === "" ? null : total_doors;
    survey_rate = survey_rate === "" ? null : survey_rate;
    total_hours = total_hours === "" ? null : total_hours;

    try {
      const result = await pool.query(
        `
          INSERT INTO project_history (
            employee_id,
            project_id,
            start_date,
            end_date,
            doors_per_hour,
            total_doors,
            survey_rate,
            total_hours
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          RETURNING *
        `,
        [
          employee_id,
          project_id,
          start_date,
          end_date,
          doors_per_hour,
          total_doors,
          survey_rate,
          total_hours,
        ]
      );

      return res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error("Error inserting project history:", err);
      return res.status(500).json({ error: "Failed to save project history" });
    }
  }

  res.setHeader("Allow", ["POST"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
