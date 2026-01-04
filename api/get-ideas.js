import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ success: false, message: "Method Not Allowed" });
    }

    try {
        // Fetch ideas: Most votes first, then newest first
        const { rows } = await sql`
            SELECT * FROM ideas 
            ORDER BY votes DESC, created_at DESC;
        `;
        
        return res.status(200).json({ success: true, ideas: rows });
    } catch (error) {
        console.error('Database Fetch Error:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
}
