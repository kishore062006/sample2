import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS ideas (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        description TEXT NOT NULL,
        impact_metric TEXT,
        submitter_name TEXT,
        submitter_email TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    return res.status(200).json({ message: "Table created successfully!" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
