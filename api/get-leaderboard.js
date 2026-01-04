import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
    try {
        // Fetch only the top 3 ideas based on votes
        const { rows } = await sql`
            SELECT id, title, category, votes, submitter_name 
            FROM ideas 
            WHERE votes > 0
            ORDER BY votes DESC 
            LIMIT 3;
        `;
        return res.status(200).json({ success: true, leaderboard: rows });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}
